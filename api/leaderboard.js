const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { limit = 5 } = req.query;
    const limitNum = parseInt(limit, 10);
    
    if (limitNum < 1 || limitNum > 50) {
      return res.status(400).json({ error: 'Limit must be between 1 and 50' });
    }

    // Get Coffee Table products (current active theme)
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, name, product_url, is_active')
      .eq('is_active', true); // Only current Coffee Table products

    if (productsError) throw productsError;

    // Get ALL voting records for Coffee Table products (IDs 36-55)
    const coffeeTableIds = products.map(p => p.id);
    const { data: votes, error: votesError } = await supabase
      .from('user_choices')
      .select('winner_id, loser_id')
      .or(`winner_id.in.(${coffeeTableIds.join(',')}),loser_id.in.(${coffeeTableIds.join(',')})`);

    if (votesError) throw votesError;

    // Note: votes already fetched above

    // Calculate win rates for each product
    const productStats = {};
    const coffeeTableIdSet = new Set(coffeeTableIds);

    votes.forEach(vote => {
      // Only count battles between Coffee Table products
      if (coffeeTableIdSet.has(vote.winner_id) && coffeeTableIdSet.has(vote.loser_id)) {
        // Track wins
        if (!productStats[vote.winner_id]) {
          productStats[vote.winner_id] = { wins: 0, losses: 0, total: 0 };
        }
        productStats[vote.winner_id].wins++;
        productStats[vote.winner_id].total++;

        // Track losses
        if (!productStats[vote.loser_id]) {
          productStats[vote.loser_id] = { wins: 0, losses: 0, total: 0 };
        }
        productStats[vote.loser_id].losses++;
        productStats[vote.loser_id].total++;
      }
    });

    // Create leaderboard with win rates
    const leaderboard = products
      .filter(product => productStats[product.id]) // Only products with votes
      .map(product => ({
        id: product.id,
        name: product.name,
        product_url: product.product_url,
        wins: productStats[product.id].wins,
        losses: productStats[product.id].losses,
        total: productStats[product.id].total,
        winRate: productStats[product.id].wins / productStats[product.id].total
      }))
      .sort((a, b) => b.winRate - a.winRate) // Sort by win rate descending
      .slice(0, limitNum); // Take only requested number

    res.status(200).json({
      products: leaderboard,
      totalProducts: products.length,
      productsWithVotes: Object.keys(productStats).length
    });
    
  } catch (error) {
    console.error('Error getting leaderboard:', error);
    res.status(500).json({ error: 'Failed to get leaderboard' });
  }
}