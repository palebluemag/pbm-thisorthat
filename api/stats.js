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
    const { productA_id, productB_id } = req.query;
    
    // Validate required parameters
    if (!productA_id || !productB_id) {
      return res.status(400).json({ 
        error: 'Missing required parameters: productA_id, productB_id' 
      });
    }
    
    // Query for battles where productA won against productB
    const { data: aWins, error: aError } = await supabase
      .from('user_choices')
      .select('id')
      .eq('winner_id', productA_id)
      .eq('loser_id', productB_id);

    // Query for battles where productB won against productA  
    const { data: bWins, error: bError } = await supabase
      .from('user_choices')
      .select('id')
      .eq('winner_id', productB_id)
      .eq('loser_id', productA_id);

    if (aError || bError) {
      console.error('Supabase query error:', aError || bError);
      throw aError || bError;
    }

    const productA_wins = aWins?.length || 0;
    const productB_wins = bWins?.length || 0;
    const totalBattles = productA_wins + productB_wins;

    console.log(`Head-to-head stats: Product ${productA_id} vs ${productB_id}`);
    console.log(`Product A wins: ${productA_wins}, Product B wins: ${productB_wins}, Total: ${totalBattles}`);

    // Minimum threshold before showing real data
    const MIN_BATTLES = 1;
    
    if (totalBattles < MIN_BATTLES) {
      return res.status(200).json({
        productA_percentage: null,
        productB_percentage: null,
        totalBattles,
        isRealData: false,
        hasEnoughData: false
      });
    }

    const productA_percentage = Math.round((productA_wins / totalBattles) * 100);
    
    res.status(200).json({
      productA_percentage,
      productB_percentage: 100 - productA_percentage,
      totalBattles,
      isRealData: true,
      hasEnoughData: true
    });
    
  } catch (error) {
    console.error('Error getting head-to-head stats:', error);
    res.status(500).json({
      productA_percentage: null,
      productB_percentage: null,
      totalBattles: 0,
      isRealData: false,
      hasEnoughData: false,
      error: 'Failed to get stats'
    });
  }
}