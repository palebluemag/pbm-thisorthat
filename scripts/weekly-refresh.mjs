#!/usr/bin/env node
// Weekly content refresh for the game.
//
//   1. publish  – if last week's staged theme has enough approved products,
//                 make it the live theme (old theme's products go inactive).
//   2. stage    – pick the next Adorno category, pull the newest products,
//                 clean them up, auto-crop, and save them as drafts for review.
//
// Usage:
//   node scripts/weekly-refresh.mjs                 # publish, then stage
//   node scripts/weekly-refresh.mjs --only=stage    # or --only=publish
//   node scripts/weekly-refresh.mjs --dry-run [--slug=table-lamps]
//        (no database writes; prints candidates to scripts/out/dry-run.json)
//
// Env: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY (writes need the service key).
// Writes a summary to refresh-result.json for the GitHub workflow.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';
import { fetchCategory, fetchDesigner, qualifies, toRow } from './lib/adorno.mjs';
import { autoCrop } from './lib/autocrop.mjs';
import { createRequire } from 'node:module';
const { publishTheme, MIN_TO_PUBLISH } = createRequire(import.meta.url)('../api/_lib/themes.js');

const here = path.dirname(fileURLToPath(import.meta.url));
const args = Object.fromEntries(process.argv.slice(2).map(a => {
    const [k, v] = a.replace(/^--/, '').split('=');
    return [k, v ?? true];
}));
const DRY = !!args['dry-run'];

const STAGE_COUNT = 20;      // leave room to reject a few

const { rotation } = JSON.parse(fs.readFileSync(path.join(here, 'themes.json'), 'utf8'));

let db = null;
if (!DRY) {
    const url = process.env.SUPABASE_URL, key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required (or use --dry-run)');
    db = createClient(url, key, { auth: { persistSession: false } });
}

const result = { published: null, staged: null, notes: [] };
const log = (...m) => console.log(...m);
const must = ({ data, error }) => { if (error) throw error; return data; };

// ---------- publish ----------
async function publish() {
    const staged = must(await db.from('themes').select('*').eq('status', 'staged').order('staged_at', { ascending: false }).limit(1))[0];
    if (!staged) { result.notes.push('No staged theme waiting to publish.'); return; }

    const approved = must(await db.from('products').select('id').eq('theme_id', staged.id).eq('review_status', 'approved'));
    const pending = must(await db.from('products').select('id').eq('theme_id', staged.id).eq('review_status', 'pending'));
    if (approved.length < MIN_TO_PUBLISH) {
        result.notes.push(`"${staged.name}" not published: ${approved.length} approved (need ${MIN_TO_PUBLISH}), ${pending.length} still pending review. Current theme stays live.`);
        result.awaitingReview = { theme: staged.name, approved: approved.length, pending: pending.length };
        return;
    }

    const out = await publishTheme(db, staged.id);
    if (!out.ok) { result.notes.push(out.reason); return; }
    result.published = { theme: staged.name, products: approved.length };
    log(`Published "${staged.name}" with ${approved.length} products.`);
}

// ---------- stage ----------
async function pickTheme() {
    if (args.slug) return rotation.find(t => t.slug === args.slug) || { slug: args.slug, name: args.slug };
    if (DRY) return rotation[0];
    const history = must(await db.from('themes').select('adorno_slug, staged_at'));
    const lastUsed = slug => Math.max(0, ...history.filter(h => h.adorno_slug === slug).map(h => Date.parse(h.staged_at)));
    return [...rotation].sort((a, b) => lastUsed(a.slug) - lastUsed(b.slug))[0];
}

async function existingKeys() {
    const urls = new Set(), ids = new Set();
    const strip = u => (u || '').split('?')[0].replace(/\/$/, '');
    if (DRY) {
        // Without the service key we can only see live products; good enough for a preview.
        const anon = process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY
            ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY) : null;
        const rows = anon ? (await anon.from('products').select('product_url')).data || [] : [];
        rows.forEach(r => urls.add(strip(r.product_url)));
        return { urls, ids, strip };
    }
    for (let from = 0; ; from += 1000) {
        const rows = must(await db.from('products').select('product_url, source_id').range(from, from + 999));
        rows.forEach(r => { urls.add(strip(r.product_url)); if (r.source_id) ids.add(Number(r.source_id)); });
        if (rows.length < 1000) break;
    }
    return { urls, ids, strip };
}

async function stage() {
    if (!DRY) {
        const waiting = must(await db.from('themes').select('name').eq('status', 'staged'));
        if (waiting.length) { result.notes.push(`"${waiting[0].name}" is already staged and awaiting review; not staging another.`); return; }
    }

    const { urls, ids, strip } = await existingKeys();
    const triedSlugs = new Set();
    for (let attempt = 0; attempt < 3; attempt++) {
        const theme = await pickTheme();
        if (triedSlugs.has(theme.slug)) break;
        triedSlugs.add(theme.slug);

        log(`Staging "${theme.name}" from adorno.design/${theme.slug} …`);
        const raw = await fetchCategory(theme.slug, 200);
        const fresh = raw.filter(qualifies).filter(p => !ids.has(p.id) && !urls.has(strip(p.permalink)));
        log(`  ${raw.length} fetched, ${fresh.length} new & usable`);
        if (fresh.length < MIN_TO_PUBLISH) {
            result.notes.push(`Skipped "${theme.name}": only ${fresh.length} new products.`);
            if (!DRY) must(await db.from('themes').insert({ name: theme.name, category: `${theme.name} (skipped ${today()})`, adorno_slug: theme.slug, status: 'skipped' }));
            if (args.slug || DRY) return;
            continue;
        }

        // One piece per designer, and no size/colour variants of the same piece.
        const rows = [], seenDesigners = new Set(), seenNames = new Set();
        const baseName = n => n.toLowerCase().replace(/\([^)]*\)|\b(small|medium|large|mini|xl|s|m|l)\b/g, '').replace(/\W+/g, ' ').trim();
        for (const p of fresh) {
            if (rows.length >= STAGE_COUNT) break;
            const draft = toRow(p);
            if (seenNames.has(baseName(draft.name))) continue;
            const who = await fetchDesigner(p.permalink);
            if (!who) { log(`  - skip (no designer found): ${p.name}`); continue; }
            if (seenDesigners.has(who.designer.toLowerCase())) continue;
            seenDesigners.add(who.designer.toLowerCase());
            seenNames.add(baseName(draft.name));
            const row = { ...draft, ...who };
            const a = await autoCrop(row.image_path, 'Main photo');
            const b = await autoCrop(row.image_path_2, 'Second photo');
            row.image_crops = { 1: a.crops, 2: b.crops };
            row.crop_warnings = [...a.warnings, ...b.warnings];
            rows.push(row);
            log(`  + ${row.name} — ${row.designer}${row.crop_warnings.length ? `  ⚠ ${row.crop_warnings.length}` : ''}`);
        }

        const category = `${theme.name} · ${today()}`;
        if (DRY) {
            const out = path.join(here, 'out');
            fs.mkdirSync(out, { recursive: true });
            fs.writeFileSync(path.join(out, 'dry-run.json'), JSON.stringify({ theme, category, rows }, null, 2));
            log(`Dry run: wrote ${rows.length} candidates to scripts/out/dry-run.json`);
        } else {
            const themeRow = must(await db.from('themes').insert({ name: theme.name, category, adorno_slug: theme.slug, status: 'staged' }).select().single());
            must(await db.from('products').insert(rows.map(r => ({
                ...r, category: [category], theme_id: themeRow.id, review_status: 'pending', is_active: false,
            }))));
        }
        result.staged = { theme: theme.name, products: rows.length, flagged: rows.filter(r => r.crop_warnings.length).length };
        return;
    }
}

const today = () => new Date().toISOString().slice(0, 10);

try {
    if (!DRY && args.only !== 'stage') await publish();
    if (args.only !== 'publish') await stage();
} finally {
    fs.writeFileSync('refresh-result.json', JSON.stringify(result, null, 2));
    log('\n' + JSON.stringify(result, null, 2));
}
