require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

(async () => {
  try {
    // First, let's see what categories exist
    const { data: allProducts, error: allError } = await supabase
      .from('products')
      .select('id, name, category, is_active')
      .eq('is_active', true);

    if (allError) throw allError;

    console.log('All active products:');
    allProducts.forEach(p => {
      console.log(`ID ${p.id}: ${p.name} - Category: ${p.category}`);
    });

    // Get Chairs products - check if it's in an array
    const chairProducts = allProducts.filter(p => {
      if (Array.isArray(p.category)) {
        return p.category.includes('Chairs');
      }
      return p.category === 'Chairs';
    });

    const chairIds = chairProducts.map(p => p.id);
    console.log('\nChair product IDs:', chairIds);
    console.log('Total Chair products:', chairIds.length);

    // Get all votes involving chair products
    const { data: votes, error: votesError } = await supabase
      .from('user_choices')
      .select('session_id, created_at')
      .or(`winner_id.in.(${chairIds.join(',')}),loser_id.in.(${chairIds.join(',')})`);

    if (votesError) throw votesError;

    // Count unique sessions
    const uniqueSessions = new Set(votes.map(v => v.session_id));
    console.log('\n=== CHAIRS THEME SESSION STATISTICS ===');
    console.log('Total unique sessions:', uniqueSessions.size);
    console.log('Total votes recorded:', votes.length);

    // Show recent sessions
    const sessionDates = {};
    votes.forEach(v => {
      if (!sessionDates[v.session_id]) {
        sessionDates[v.session_id] = v.created_at;
      }
    });

    const sortedSessions = Object.entries(sessionDates)
      .sort((a, b) => new Date(b[1]) - new Date(a[1]))
      .slice(0, 10);

    console.log('\nMost recent 10 sessions:');
    sortedSessions.forEach(([sessionId, date], i) => {
      console.log(`${i + 1}. Session: ${sessionId.substring(0, 8)}... at ${new Date(date).toLocaleString()}`);
    });

  } catch (error) {
    console.error('Error:', error);
  }
})();
