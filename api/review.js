const crypto = require('crypto');
const { createClient } = require('@supabase/supabase-js');
const { publishTheme, MIN_TO_PUBLISH, must } = require('./_lib/themes');

// Admin endpoint behind review.html. Needs REVIEW_TOKEN and
// SUPABASE_SERVICE_ROLE_KEY in the Vercel environment.
const db = process.env.SUPABASE_SERVICE_ROLE_KEY
  ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })
  : null;

function authorized(req) {
  const expected = process.env.REVIEW_TOKEN || '';
  const given = String(req.headers['x-review-token'] || '');
  if (!expected || given.length !== expected.length) return false;
  return crypto.timingSafeEqual(Buffer.from(given), Buffer.from(expected));
}

const PRODUCT_FIELDS = 'id, name, designer, materials, description, image_path, image_path_2, product_url, image_crops, crop_warnings, review_status, is_active';
const STATUSES = ['pending', 'approved', 'rejected'];

module.exports = async function handler(req, res) {
  if (!db) return res.status(500).json({ error: 'Review is not configured (missing service key).' });
  if (!authorized(req)) return res.status(401).json({ error: 'Wrong or missing review token.' });

  try {
    if (req.method === 'GET') {
      // ?which=live to adjust crops on the theme that's already in the game.
      const status = req.query.which === 'live' ? 'live' : 'staged';
      const themes = must(await db.from('themes').select('*').eq('status', status).order('staged_at', { ascending: false }).limit(1));
      const theme = themes[0] || null;
      const products = theme
        ? must(await db.from('products').select(PRODUCT_FIELDS).eq('theme_id', theme.id).order('id'))
        : [];
      return res.status(200).json({ theme, products, minToPublish: MIN_TO_PUBLISH });
    }

    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};

      if (body.action === 'save') {
        const patch = {};
        if (body.image_crops && typeof body.image_crops === 'object') patch.image_crops = body.image_crops;
        if (typeof body.name === 'string' && body.name.trim()) patch.name = body.name.trim().slice(0, 120);
        if (STATUSES.includes(body.review_status)) patch.review_status = body.review_status;
        const product = must(await db.from('products').select('id, theme_id').eq('id', body.id).single());
        const theme = must(await db.from('themes').select('status').eq('id', product.theme_id).single());
        // On the live theme, rejecting pulls the product out of the game immediately.
        if (theme.status === 'live' && patch.review_status) patch.is_active = patch.review_status === 'approved';
        must(await db.from('products').update(patch).eq('id', body.id));
        return res.status(200).json({ ok: true });
      }

      if (body.action === 'cover') {
        must(await db.from('themes').update({ cover_image: String(body.cover_image) }).eq('id', body.theme_id));
        return res.status(200).json({ ok: true });
      }

      if (body.action === 'publish') {
        const result = await publishTheme(db, body.theme_id);
        return res.status(result.ok ? 200 : 400).json(result);
      }
    }

    res.status(400).json({ error: 'Unknown request' });
  } catch (error) {
    console.error('Review API error:', error);
    res.status(500).json({ error: error.message || 'Review request failed' });
  }
};
