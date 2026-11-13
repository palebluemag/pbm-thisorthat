// Pulls products from Adorno's public WooCommerce Store API and turns them
// into rows shaped like the `products` table.

const BASE = 'https://adorno.design';
const UA = 'Mozilla/5.0 (compatible; PBM-ThisOrThat/1.0)';
const AFFILIATE_PARAM = 'wpam_id=75'; // same affiliate tag used on the hand-built sheets

async function get(url, as = 'json') {
    for (let attempt = 1; attempt <= 3; attempt++) {
        const res = await fetch(url, { headers: { 'User-Agent': UA } });
        if (res.ok) return as === 'json' ? res.json() : res.text();
        if (attempt === 3) throw new Error(`${res.status} fetching ${url}`);
        await new Promise(r => setTimeout(r, 1500 * attempt));
    }
}

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', ndash: '–', mdash: '—', rsquo: '’', lsquo: '‘', rdquo: '”', ldquo: '“', hellip: '…' };
export function decode(str = '') {
    return str
        .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n))
        .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
        .replace(/&([a-z]+);/gi, (m, n) => ENTITIES[n.toLowerCase()] ?? m);
}

// "Mora Table Lamp in Sapele Wood and Recycled Paper" -> "Mora Table Lamp"
export function cleanName(raw) {
    const name = decode(raw).replace(/\s*\((?:xs|s|m|l|xl|small|medium|large)\)/gi, '').trim();
    const short = name.split(/\s+(?:in|by|with|made of)\s+|\s+[–—|]\s+|\s+-\s+/i)[0].trim();
    return short.length >= 3 ? short : name;
}

// First paragraph(s) of the description, capped at a sentence boundary.
export function cleanDescription(html, max = 450) {
    const body = (html || '').split(/<div class="tinv/)[0];
    const paragraphs = body
        .split(/<\/p>/i)
        .map(p => decode(p.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim())
        .filter(Boolean);
    let text = '';
    for (const p of paragraphs) {
        if (!text) text = p;
        else if ((text + ' ' + p).length <= max) text += ' ' + p;
        else break;
    }
    if (text.length <= max) return text;
    const cut = text.slice(0, max);
    const end = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('! '), cut.lastIndexOf('? '));
    return end > 120 ? cut.slice(0, end + 1) : cut.replace(/\s+\S*$/, '') + '…';
}

// Drop terms contained in a more specific term ("Sapele" vs "Sapele Wood").
export function cleanMaterials(product, max = 4) {
    const attr = (product.attributes || []).find(a => a.taxonomy === 'pa_material');
    const terms = [...new Set((attr?.terms || []).map(t => decode(t.name).trim()))];
    const kept = terms.filter(t => !terms.some(o => o !== t && o.toLowerCase().includes(t.toLowerCase())));
    return kept.slice(0, max).join(', ');
}

// Prefer the 1280px rendition: sharp enough for the card, far lighter than originals.
export function displayImageUrl(image) {
    const entries = (image.srcset || '')
        .split(',')
        .map(s => s.trim().split(/\s+/))
        .filter(([url, w]) => url && w?.endsWith('w'))
        .map(([url, w]) => ({ url, w: parseInt(w) }));
    const best = entries.filter(e => e.w <= 1600).sort((a, b) => b.w - a.w)[0];
    return best?.url || image.src;
}

function withAffiliate(url) {
    return url + (url.includes('?') ? '&' : '?') + AFFILIATE_PARAM;
}

export async function fetchDesigner(permalink) {
    try {
        const html = await get(permalink, 'text');
        const m = html.match(/class="designer-name">\s*<a href="([^"]+)"[^>]*>([^<]+)<\/a>/);
        return m ? { designer: decode(m[2]).trim(), designer_url: m[1] } : null;
    } catch {
        return null;
    }
}

// Newest in-stock products in a category (by Adorno slug).
export async function fetchCategory(slug, limit = 60) {
    const out = [];
    for (let page = 1; out.length < limit && page <= 5; page++) {
        const url = `${BASE}/wp-json/wc/store/v1/products?category=${encodeURIComponent(slug)}&orderby=date&order=desc&per_page=50&page=${page}`;
        const batch = await get(url);
        if (!batch.length) break;
        out.push(...batch);
    }
    return out.slice(0, limit);
}

export function qualifies(p) {
    return p.is_in_stock && p.images?.length >= 2 && p.permalink && ['simple', 'variable'].includes(p.type);
}

export function toRow(p, extra = {}) {
    return {
        name: cleanName(p.name),
        designer: null,
        materials: cleanMaterials(p),
        description: cleanDescription(p.description || p.short_description),
        image_path: displayImageUrl(p.images[0]),
        image_path_2: displayImageUrl(p.images[1]),
        product_url: withAffiliate(p.permalink),
        retailer: 'Adorno',
        source: 'adorno',
        source_id: p.id,
        ...extra,
    };
}
