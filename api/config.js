const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// The theme currently live in the game (set weekly by scripts/weekly-refresh.mjs).
module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const { data, error } = await supabase
      .from('themes')
      .select('name, category, cover_image, live_at')
      .eq('status', 'live')
      .order('live_at', { ascending: false })
      .limit(1);
    if (error) throw error;
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=3600');
    res.status(200).json({ theme: data[0] || null });
  } catch (error) {
    console.error('Error fetching config:', error);
    res.status(500).json({ error: 'Failed to fetch config' });
  }
};
