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

async function addBaselineVotes() {
  try {
    console.log('🔍 Adding baseline votes to all product matchups...\n');

    // Get all active products
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, name')
      .eq('is_active', true);

    if (productsError) throw productsError;

    console.log(`📊 Found ${products.length} active products\n`);

    // Generate all unique pairs (combinations)
    const pairs = [];
    for (let i = 0; i < products.length; i++) {
      for (let j = i + 1; j < products.length; j++) {
        pairs.push([products[i], products[j]]);
      }
    }

    console.log(`🔀 Generated ${pairs.length} unique product pairs\n`);

    // Check existing votes to avoid duplicating baseline votes
    const { data: existingVotes, error: votesError } = await supabase
      .from('user_choices')
      .select('session_id, winner_id, loser_id');

    if (votesError) throw votesError;

    // Create a set of existing session IDs that start with 'baseline_' to avoid re-adding
    const existingBaselineVotes = new Set();
    existingVotes.forEach(vote => {
      if (vote.session_id && vote.session_id.startsWith('baseline_')) {
        existingBaselineVotes.add(`${vote.winner_id}_${vote.loser_id}`);
      }
    });

    console.log(`🚫 Found ${existingBaselineVotes.size} existing baseline votes to skip\n`);

    // Prepare baseline votes
    const baselineVotes = [];
    let addedPairs = 0;

    for (const [productA, productB] of pairs) {
      const pairKey1 = `${productA.id}_${productB.id}`;
      const pairKey2 = `${productB.id}_${productA.id}`;

      // Skip if baseline votes already exist for this pair
      if (existingBaselineVotes.has(pairKey1) && existingBaselineVotes.has(pairKey2)) {
        continue;
      }

      // Add 2 votes where productA wins against productB
      if (!existingBaselineVotes.has(pairKey1)) {
        for (let i = 1; i <= 2; i++) {
          baselineVotes.push({
            session_id: `baseline_${productA.id}_vs_${productB.id}_vote${i}`,
            round_number: 1,
            winner_id: productA.id,
            loser_id: productB.id
          });
        }
      }

      // Add 2 votes where productB wins against productA
      if (!existingBaselineVotes.has(pairKey2)) {
        for (let i = 1; i <= 2; i++) {
          baselineVotes.push({
            session_id: `baseline_${productB.id}_vs_${productA.id}_vote${i}`,
            round_number: 1,
            winner_id: productB.id,
            loser_id: productA.id
          });
        }
      }

      addedPairs++;
    }

    if (baselineVotes.length === 0) {
      console.log('✅ All baseline votes already exist! No new votes to add.');
      return;
    }

    console.log(`📝 Preparing to add ${baselineVotes.length} baseline votes for ${addedPairs} pairs...\n`);

    // Add baseline votes in batches to avoid overwhelming the database
    const batchSize = 100;
    let totalAdded = 0;

    for (let i = 0; i < baselineVotes.length; i += batchSize) {
      const batch = baselineVotes.slice(i, i + batchSize);
      
      console.log(`📤 Adding batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(baselineVotes.length / batchSize)} (${batch.length} votes)...`);
      
      const { error } = await supabase
        .from('user_choices')
        .insert(batch);

      if (error) {
        console.error(`❌ Error adding batch ${Math.floor(i / batchSize) + 1}:`, error);
        throw error;
      }

      totalAdded += batch.length;
      console.log(`✅ Added ${batch.length} votes (${totalAdded}/${baselineVotes.length} total)`);
      
      // Small delay to be nice to the database
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log('\n' + '='.repeat(60));
    console.log('🎉 BASELINE VOTES ADDED SUCCESSFULLY!');
    console.log('='.repeat(60));
    console.log(`Total votes added: ${totalAdded}`);
    console.log(`Product pairs affected: ${addedPairs}`);
    console.log(`Each matchup now has: +2 votes for each side (4 total baseline votes)`);
    
    // Run a quick analysis to show the effect
    console.log('\n🔍 Running quick analysis to show the effect...\n');
    
    const { data: newVotes, error: newVotesError } = await supabase
      .from('user_choices')
      .select('winner_id, loser_id');

    if (newVotesError) throw newVotesError;

    console.log(`📊 Total votes in database now: ${newVotes.length}`);
    console.log(`📈 Original votes: ${newVotes.length - totalAdded}`);
    console.log(`📈 Baseline votes: ${totalAdded}`);

    console.log('\n💡 Impact: This will smooth out win percentages and prevent extreme values');
    console.log('💡 Products with few real votes will now show percentages closer to 50%');
    console.log('💡 Products with many real votes will be less affected by the baseline');

  } catch (error) {
    console.error('❌ Error adding baseline votes:', error);
    process.exit(1);
  }
}

// Warning and confirmation
console.log('⚠️  WARNING: This script will add baseline votes to your database!');
console.log('📝 This will add 2 votes for each side of every possible product matchup');
console.log('🔄 This action will affect your voting statistics and percentages\n');

// Check for --confirm flag
const args = process.argv.slice(2);
if (!args.includes('--confirm')) {
  console.log('❌ Please run with --confirm flag if you want to proceed:');
  console.log('   node add-baseline-votes.js --confirm');
  console.log('\n💡 You can also run analyze-votes.js first to see current statistics');
  process.exit(0);
}

// Run the baseline vote addition
addBaselineVotes().then(() => {
  console.log('\n✅ Process complete! Run analyze-votes.js to see updated statistics.');
}).catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});