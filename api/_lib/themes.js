// Shared by the weekly job (scripts/weekly-refresh.mjs) and the review API.
// Files under api/_lib are not exposed as routes by Vercel.

const MIN_TO_PUBLISH = 11; // 10 rounds need 11 products

function must({ data, error }) {
  if (error) throw error;
  return data;
}

// Make a staged theme live: its approved products go active, the previous
// theme (and any legacy hand-entered products) go inactive.
async function publishTheme(db, themeId) {
  const theme = must(await db.from('themes').select('*').eq('id', themeId).single());
  const approved = must(await db.from('products').select('id, image_path').eq('theme_id', themeId).eq('review_status', 'approved'));
  if (approved.length < MIN_TO_PUBLISH) {
    return { ok: false, theme, approved: approved.length, reason: `Need ${MIN_TO_PUBLISH} approved products, have ${approved.length}.` };
  }

  const live = must(await db.from('themes').select('id').eq('status', 'live').neq('id', themeId));
  for (const t of live) {
    must(await db.from('themes').update({ status: 'archived' }).eq('id', t.id));
    must(await db.from('products').update({ is_active: false }).eq('theme_id', t.id));
  }
  must(await db.from('products').update({ is_active: false }).is('theme_id', null).eq('is_active', true));
  must(await db.from('products').update({ is_active: false }).eq('theme_id', themeId).neq('review_status', 'approved'));
  must(await db.from('products').update({ is_active: true }).eq('theme_id', themeId).eq('review_status', 'approved'));

  const cover = theme.cover_image || approved[0].image_path;
  must(await db.from('themes').update({ status: 'live', live_at: new Date().toISOString(), cover_image: cover }).eq('id', themeId));
  return { ok: true, theme, approved: approved.length };
}

module.exports = { MIN_TO_PUBLISH, publishTheme, must };
