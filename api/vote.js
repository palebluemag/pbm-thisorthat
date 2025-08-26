const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { sessionId, roundNumber, winnerId, loserId } = req.body;
    
    // Validate required fields
    if (!sessionId || !roundNumber || !winnerId || !loserId) {
      return res.status(400).json({ 
        error: 'Missing required fields: sessionId, roundNumber, winnerId, loserId' 
      });
    }
    
    // Record the vote
    const { error } = await supabase
      .from('user_choices')
      .insert({
        session_id: sessionId,
        round_number: roundNumber,
        winner_id: winnerId,
        loser_id: loserId
      });
    
    if (error) throw error;
    
    res.status(200).json({ success: true });
    
  } catch (error) {
    console.error('Error recording vote:', error);
    res.status(500).json({ error: 'Failed to record vote' });
  }
}