#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('Make sure SUPABASE_URL and SUPABASE_ANON_KEY are set in your .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function analyzeVotingData() {
  try {
    console.log('🔍 Analyzing voting data...\n');

    // Get all active products
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, name, designer, is_active')
      .eq('is_active', true);

    if (productsError) throw productsError;

    console.log(`📊 Total active products: ${products.length}\n`);

    // Get all voting records with session info
    const { data: votes, error: votesError } = await supabase
      .from('user_choices')
      .select('session_id, winner_id, loser_id');

    if (votesError) throw votesError;

    console.log(`🗳️ Total votes recorded: ${votes.length}`);
    
    // Count unique sessions
    const uniqueSessions = new Set(votes.map(vote => vote.session_id));
    console.log(`🎮 Total game sessions: ${uniqueSessions.size}\n`);

    // Create a Set of all product IDs that have received votes (either as winner or loser)
    const votedProductIds = new Set();
    
    votes.forEach(vote => {
      votedProductIds.add(vote.winner_id);
      votedProductIds.add(vote.loser_id);
    });

    console.log(`🎯 Products that have been in battles: ${votedProductIds.size}\n`);

    // Find products with zero votes
    const productsWithZeroVotes = products.filter(product => 
      !votedProductIds.has(product.id)
    );

    // Calculate voting statistics for products that have votes
    const productStats = {};
    
    votes.forEach(vote => {
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
    });

    // Results
    console.log('=' .repeat(60));
    console.log('📈 VOTING ANALYSIS RESULTS');
    console.log('=' .repeat(60));

    if (productsWithZeroVotes.length > 0) {
      console.log(`\n❌ PRODUCTS WITH ZERO VOTES (${productsWithZeroVotes.length} products):`);
      console.log('-'.repeat(50));
      
      productsWithZeroVotes.forEach((product, index) => {
        console.log(`${index + 1}. "${product.name}" by ${product.designer} (ID: ${product.id})`);
      });
    } else {
      console.log('\n✅ All active products have received at least one vote!');
    }

    // Show top performers
    const productsWithVotes = products
      .filter(product => productStats[product.id])
      .map(product => ({
        ...product,
        ...productStats[product.id],
        winRate: productStats[product.id].wins / productStats[product.id].total
      }))
      .sort((a, b) => b.winRate - a.winRate);

    if (productsWithVotes.length > 0) {
      console.log(`\n📊 ALL PRODUCTS RANKED BY WIN RATE (${productsWithVotes.length} products):`);
      console.log('-'.repeat(70));
      
      productsWithVotes.forEach((product, index) => {
        const winRate = (product.winRate * 100).toFixed(1);
        console.log(`${(index + 1).toString().padStart(2)}. "${product.name}" - ${winRate.padStart(5)}% win rate (${product.wins}W-${product.losses}L, ${product.total} battles)`);
      });
    }

    // Summary statistics
    console.log(`\n📊 SUMMARY STATISTICS:`);
    console.log('-'.repeat(50));
    console.log(`Total active products: ${products.length}`);
    console.log(`Products with votes: ${votedProductIds.size}`);
    console.log(`Products with zero votes: ${productsWithZeroVotes.length}`);
    console.log(`Coverage: ${((votedProductIds.size / products.length) * 100).toFixed(1)}%`);
    console.log(`Total battles: ${votes.length}`);
    console.log(`Total game sessions: ${uniqueSessions.size}`);
    
    if (uniqueSessions.size > 0) {
      const avgVotesPerSession = (votes.length / uniqueSessions.size).toFixed(1);
      console.log(`Average votes per session: ${avgVotesPerSession}`);
    }

    if (votedProductIds.size > 0) {
      const avgBattlesPerProduct = votes.length * 2 / votedProductIds.size; // Each vote involves 2 products
      console.log(`Average battles per product: ${avgBattlesPerProduct.toFixed(1)}`);
    }

  } catch (error) {
    console.error('❌ Error analyzing voting data:', error);
    process.exit(1);
  }
}

// Run the analysis
analyzeVotingData().then(() => {
  console.log('\n✅ Analysis complete!');
}).catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});