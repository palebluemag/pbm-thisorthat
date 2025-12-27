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
    const { limit = 5, category } = req.query;
    const limitNum = parseInt(limit, 10);

    if (limitNum < 1 || limitNum > 50) {
      return res.status(400).json({ error: 'Limit must be between 1 and 50' });
    }

    // Get all active products first
    const { data: allProducts, error: productsError } = await supabase
      .from('products')
      .select('id, name, product_url, is_active, category')
      .eq('is_active', true);

    if (productsError) throw productsError;

    // Filter by category if provided (handles array field)
    let products = allProducts;
    if (category) {
      products = allProducts.filter(product => {
        if (!product.category) return false;

        try {
          let categories = typeof product.category === 'string'
            ? JSON.parse(product.category)
            : product.category;

          return Array.isArray(categories) && categories.includes(category);
        } catch (e) {
          return false;
        }
      });
    }

    // Get voting records for current category products only
    const categoryProductIds = products.map(p => p.id);

    if (categoryProductIds.length === 0) {
      return res.status(200).json({
        products: [],
        totalProducts: 0,
        productsWithVotes: 0
      });
    }

    const { data: votes, error: votesError } = await supabase
      .from('user_choices')
      .select('winner_id, loser_id')
      .or(`winner_id.in.(${categoryProductIds.join(',')}),loser_id.in.(${categoryProductIds.join(',')})`);

    if (votesError) throw votesError;

    // Calculate win rates for each product
    const productStats = {};
    const categoryIdSet = new Set(categoryProductIds);

    votes.forEach(vote => {
      // Only count battles between products in the same category
      if (categoryIdSet.has(vote.winner_id) && categoryIdSet.has(vote.loser_id)) {
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

    // If no votes yet for this category, return empty
    if (Object.keys(productStats).length === 0) {
      return res.status(200).json({
        products: [],
        totalProducts: products.length,
        productsWithVotes: 0
      });
    }

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