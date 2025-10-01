# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a vanilla JavaScript web game called "Design Showdown" - a furniture design voting game in the style of Pale Blue Magazine. Players choose between iconic furniture pieces in tournament-style rounds until a winner emerges after 15 rounds.

## Architecture

The application consists of three core files:
- `index.html` - Single-page structure with game board and winner screens
- `script.js` - Game logic with tournament mechanics and UI state management
- `styles.css` - Minimalist editorial styling with Inter font and clean aesthetics

### Key Components

**Data Layer**
- Products fetched from Supabase `products` table (with fallback to hardcoded array)
- Database schema: id, name, designer, materials, description, price, image_url, product_url, retailer, is_active
- Only active products (`is_active = true`) are used in games

**Game State & Session Management**
- Tournament bracket system selecting 16 random items from available products
- Tracks current round (1-15), chosen items, UI lock states, session ID
- Each game generates unique session ID for vote tracking

**Core Functions**
- `initializeGame()` - Fetches products from Supabase, shuffles and starts tournament
- `handleChoice()` - Records vote in database and calculates real poll percentages
- `moveToNextRound()` - Advances winner to next round against new challenger
- `updateDisplay()` - Manages UI state transitions and animations

**Database Integration**
- `dbService.fetchActiveProducts()` - Gets products where is_active = true
- `dbService.recordUserChoice()` - Stores vote with session, round, winner/loser IDs
- `dbService.getChoiceStats()` - Calculates win percentage from historical votes

**UI States**
- Ponder phase: 3-second delay with locked cards and instructional message
- Selection phase: Active cards with hover effects and selection prompt
- Results phase: Shows real poll percentages from database aggregation
- Game over: Winner showcase with full item details including retailer info

## Development

This is a static site with Supabase backend integration. Open `index.html` directly in a browser or serve with any static file server.

**Backend Setup:**
- Uses Supabase for database (products and user_choices tables)
- Supabase client loaded via CDN in index.html
- Database config in script.js (URL and publishable key)

**Local Development:**
- For live reload: `python -m http.server 8000` or VS Code Live Server extension
- No linting/testing framework configured
- Database operations will work immediately (uses public Supabase endpoint)

## Styling

Uses Pale Blue Magazine aesthetic:
- Inter font family (300-700 weights)
- Minimalist black/white/gray color palette
- Card-based layout with subtle borders
- Smooth CSS transitions and fade animations
- Mobile-responsive design with stacked layout

The design emphasizes clean typography, ample whitespace, and editorial presentation of furniture pieces with designer attribution.

## Change Log

### Image Aspect Ratio Changes (2025-01-19)
**Context**: Coffee Table theme implementation
**Changes Made**:
- `.card-image-container` aspect-ratio: `4/5` → `1` (square)
- `.card-emoji` aspect-ratio: `4/5` → `1` (square)
**Files Modified**: `styles.css` lines 788, 796
**Revert Instructions**: To restore original aspect ratios, change both values back to `4/5`
**Mobile Impact**: None - mobile styles remain unchanged
**Git Commits**:
- 9112848: "Fix grammar error and update desktop product images to square aspect ratio"

### Martin Clausen's Picks Theme Update (2025-01-19)
**Context**: Changed active game theme from Coffee Table to Martin Clausen's Picks
**Changes Made**:
- Updated `gameConfig.currentTheme` from 'Coffee Tables' to 'Martin Clausen\'s Picks'
- Updated `gameConfig.currentCategory` from 'Coffee Table' to 'Martin Clausen\'s Picks' (all products in Supabase have this category)
- Removed Noguchi Coffee Table specific logic that always placed it as initial defender
- Restored original random shuffling for all products
- Updated UI text references in HTML and CSS comments
**Files Modified**: `script.js` lines 9-10, 445-450, 465-471; `index.html` lines 61, 219; `styles.css` lines 1071, 1079
**Database**: All products in Supabase have been labeled with category "Martin Clausen's Picks"
**Revert Instructions**: Change theme back to 'Coffee Tables', set category to 'Coffee Table', and restore Noguchi-specific initialization logic

### Coffee Table Game Logic Changes (2025-01-19) [REVERTED]
**Context**: Coffee Table theme - Noguchi always starts as defender [NOW REMOVED]
**Changes Made**: [REMOVED IN Martin Clausen's Picks update]
- Modified `initializeGame()` function to always place Noguchi Coffee Table as initial defender (left side)
- Ensures Noguchi is removed from remaining pool to prevent duplicates
- No extra votes counted for Noguchi - it's just the starting matchup
- Game logic otherwise unchanged (10 rounds, normal elimination)
**Files Modified**: `script.js` lines ~395-441 [REVERTED]
**Revert Instructions**: Remove Noguchi-specific logic and restore original random shuffling [COMPLETED]