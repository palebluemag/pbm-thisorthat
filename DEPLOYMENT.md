# Vercel Deployment Instructions

## Prerequisites
1. Install Vercel CLI: `npm install -g vercel`
2. Create a Vercel account at https://vercel.com

## Step-by-Step Deployment

### 1. Install Dependencies
```bash
npm install
```

### 2. Login to Vercel
```bash
vercel login
```

### 3. Deploy to Vercel
```bash
vercel
```

Follow the prompts:
- Link to existing project? **N**
- What's your project's name? **pbm-thisorthat** (or your preferred name)
- In which directory is your code located? **./ **
- Want to override settings? **N**

### 4. Configure Environment Variables
Go to your Vercel dashboard → Your Project → Settings → Environment Variables

Add these variables:
- **SUPABASE_URL**: `https://guxqqxrrpvrrboiinens.supabase.co`
- **SUPABASE_ANON_KEY**: `sb_publishable_ng4WrHmBMatzMMzyrpQuXw_4DzuZ6a8`

Or use the CLI:
```bash
vercel env add SUPABASE_URL
# Enter: https://guxqqxrrpvrrboiinens.supabase.co

vercel env add SUPABASE_ANON_KEY  
# Enter: sb_publishable_ng4WrHmBMatzMMzyrpQuXw_4DzuZ6a8
```

### 5. Redeploy with Environment Variables
```bash
vercel --prod
```

## Local Development
To test locally with Vercel's development server:
```bash
vercel dev
```

This will:
- Start a local development server
- Run your API routes locally
- Load environment variables from Vercel

## Verify Deployment
1. Check that your site loads at the Vercel URL
2. Test that the game can fetch products
3. Verify voting functionality works
4. Check browser console for any API errors

## Security Note
Your Supabase credentials are now secure and not exposed in the client-side code. They're only available to your serverless functions running on Vercel's secure environment.