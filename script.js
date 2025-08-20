// Supabase configuration
const SUPABASE_URL = 'https://guxqqxrrpvrrboiinens.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_ng4WrHmBMatzMMzyrpQuXw_4DzuZ6a8';

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Database service functions
const dbService = {
    async fetchActiveProducts() {
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('is_active', true);
            
            if (error) throw error;
            
            // Handle image URLs - direct URLs or storage paths
            const productsWithImages = data.map((product) => {
                if (product.image_path) {
                    // Check if image_path is already a full URL
                    if (product.image_path.startsWith('http://') || product.image_path.startsWith('https://')) {
                        product.image_url = product.image_path;
                    } else {
                        // Treat as storage path
                        const { data: publicUrl } = supabase.storage
                            .from('furniture-images')
                            .getPublicUrl(product.image_path);
                        
                        if (publicUrl) {
                            product.image_url = publicUrl.publicUrl;
                        }
                    }
                }
                return product;
            });
            
            return productsWithImages;
        } catch (error) {
            console.error('Error fetching products:', error);
            return [];
        }
    },

    async recordUserChoice(sessionId, roundNumber, winnerId, loserId) {
        try {
            const { error } = await supabase
                .from('user_choices')
                .insert({
                    session_id: sessionId,
                    round_number: roundNumber,
                    winner_id: winnerId,
                    loser_id: loserId
                });
            
            if (error) throw error;
        } catch (error) {
            console.error('Error recording user choice:', error);
        }
    },

    async getHeadToHeadStats(productA_id, productB_id) {
        try {
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
            const MIN_BATTLES = 2;
            
            if (totalBattles < MIN_BATTLES) {
                return {
                    productA_percentage: null,
                    productB_percentage: null,
                    totalBattles,
                    isRealData: false,
                    hasEnoughData: false
                };
            }

            const productA_percentage = Math.round((productA_wins / totalBattles) * 100);
            
            return {
                productA_percentage,
                productB_percentage: 100 - productA_percentage,
                totalBattles,
                isRealData: true,
                hasEnoughData: true
            };
        } catch (error) {
            console.error('Error getting head-to-head stats:', error);
            return {
                productA_percentage: null,
                productB_percentage: null,
                totalBattles: 0,
                isRealData: false,
                hasEnoughData: false
            };
        }
    }
};

// Generate unique session ID
function generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Legacy furniture items data (fallback)
const fallbackFurnitureItems = [
    {
        name: "Barcelona Chair",
        designer: "Ludwig Mies van der Rohe",
        materials: "Leather, stainless steel",
        description: "Iconic modernist lounge chair with clean geometric lines",
        link: "https://www.knoll.com/product/barcelona-chair",
        image: "🪑"
    },
    {
        name: "Eames Lounge Chair",
        designer: "Charles & Ray Eames",
        materials: "Molded plywood, leather",
        description: "Mid-century masterpiece combining comfort and elegance",
        link: "https://www.hermanmiller.com/products/seating/lounge-seating/eames-lounge-chair-and-ottoman/",
        image: "🛋️"
    },
    {
        name: "Wishbone Chair",
        designer: "Hans Wegner",
        materials: "Oak wood, paper cord",
        description: "Danish craftsmanship with organic Y-shaped backrest",
        link: "https://www.carlhansen.com/en/collection/chairs/ch24-wishbone-chair",
        image: "🪑"
    },
    {
        name: "Tulip Table",
        designer: "Eero Saarinen",
        materials: "Fiberglass, aluminum",
        description: "Sculptural pedestal table eliminating 'clutter of legs'",
        link: "https://www.knoll.com/product/saarinen-dining-table",
        image: "🍽️"
    },
    {
        name: "Wassily Chair",
        designer: "Marcel Breuer",
        materials: "Chrome steel, leather",
        description: "Revolutionary cantilevered chair inspired by bicycle frames",
        link: "https://www.knoll.com/product/wassily-chair",
        image: "🪑"
    },
    {
        name: "Diamond Chair",
        designer: "Harry Bertoia",
        materials: "Steel wire, vinyl cushion",
        description: "Sculptural wire frame chair that's 'mostly made of air'",
        link: "https://www.knoll.com/product/bertoia-diamond-chair",
        image: "💎"
    },
    {
        name: "Noguchi Coffee Table",
        designer: "Isamu Noguchi",
        materials: "Glass, walnut",
        description: "Biomorphic glass table balancing on wooden base",
        link: "https://www.hermanmiller.com/products/tables/coffee-tables/noguchi-table/",
        image: "☕"
    },
    {
        name: "Panton Chair",
        designer: "Verner Panton",
        materials: "Molded plastic",
        description: "First single-piece plastic chair in vibrant colors",
        link: "https://www.vitra.com/en-us/product/panton-chair",
        image: "🌈"
    },
    {
        name: "Egg Chair",
        designer: "Arne Jacobsen",
        materials: "Fiberglass, fabric upholstery",
        description: "Cocoon-like swivel chair offering privacy and comfort",
        link: "https://www.fritzhansen.com/en/products/chairs/egg-chair",
        image: "🥚"
    },
    {
        name: "Butterfly Stool",
        designer: "Sori Yanagi",
        materials: "Molded plywood",
        description: "Zen-inspired stool with butterfly wing silhouette",
        link: "https://www.vitra.com/en-us/product/butterfly-stool",
        image: "🦋"
    },
    {
        name: "Cesca Chair",
        designer: "Marcel Breuer",
        materials: "Chrome steel, cane",
        description: "Bauhaus design with woven cane seat and back",
        link: "https://www.knoll.com/product/cesca-chair-cane",
        image: "🪑"
    },
    {
        name: "Swan Chair",
        designer: "Arne Jacobsen",
        materials: "Fiberglass, wool upholstery",
        description: "Elegant curved chair resembling a swan's embrace",
        link: "https://www.fritzhansen.com/en/products/chairs/swan-chair",
        image: "🦢"
    },
    {
        name: "Marshmallow Sofa",
        designer: "George Nelson",
        materials: "Steel frame, vinyl cushions",
        description: "Playful modular sofa with colorful circular cushions",
        link: "https://www.hermanmiller.com/products/seating/lounge-seating/nelson-marshmallow-sofa/",
        image: "🛋️"
    },
    {
        name: "Cyclone Table",
        designer: "Isamu Noguchi",
        materials: "Steel wire, wood",
        description: "Dynamic sculptural table with tornado-like base",
        link: "https://www.knoll.com/product/cyclone-table",
        image: "🌪️"
    },
    {
        name: "Ant Chair",
        designer: "Arne Jacobsen",
        materials: "Molded plywood, steel",
        description: "Minimalist three-legged chair with ant-like silhouette",
        link: "https://www.fritzhansen.com/en/products/chairs/ant-chair",
        image: "🐜"
    },
    {
        name: "Coconut Chair",
        designer: "George Nelson",
        materials: "Fiberglass, fabric",
        description: "Shell-like lounge chair inspired by coconut fragments",
        link: "https://www.hermanmiller.com/products/seating/lounge-seating/nelson-coconut-chair/",
        image: "🥥"
    },
    {
        name: "Ribbon Chair",
        designer: "Pierre Paulin",
        materials: "Steel frame, stretch fabric",
        description: "Flowing sculptural chair resembling a continuous ribbon",
        link: "https://www.artifort.com/en/products/seating/ribbon-chair",
        image: "🎀"
    },
    {
        name: "Platner Table",
        designer: "Warren Platner",
        materials: "Steel wire, glass",
        description: "Elegant dining table with decorative wire base",
        link: "https://www.knoll.com/product/platner-dining-table",
        image: "✨"
    },
    {
        name: "Womb Chair",
        designer: "Eero Saarinen",
        materials: "Fiberglass, wool upholstery",
        description: "Enveloping lounge chair designed for maximum comfort",
        link: "https://www.knoll.com/product/womb-chair",
        image: "🤱"
    },
    {
        name: "Magistretti Table",
        designer: "Vico Magistretti",
        materials: "Lacquered wood",
        description: "Minimalist dining table with geometric precision",
        link: "https://www.oluce.com/en/products/tables/magistretti-table",
        image: "📐"
    },
    {
        name: "Tongue Chair",
        designer: "Finn Juhl",
        materials: "Teak wood, leather",
        description: "Sculptural chair with floating seat and organic curves",
        link: "https://www.onecollection.com/products/chairs/tongue-chair",
        image: "👅"
    },
    {
        name: "Tolix Chair",
        designer: "Xavier Pauchard",
        materials: "Galvanized steel",
        description: "Industrial metal chair with timeless utilitarian design",
        link: "https://www.tolix.fr/en/products/chairs/chair-a",
        image: "🏭"
    },
    {
        name: "Pastil Chair",
        designer: "Eero Aarnio",
        materials: "Fiberglass",
        description: "Futuristic pod chair in bold candy colors",
        link: "https://www.artek.fi/en/products/pastil-chair",
        image: "🍭"
    },
    {
        name: "Saarinen Executive Chair",
        designer: "Eero Saarinen",
        materials: "Aluminum, upholstery",
        description: "Sleek office chair with elegant pedestal base",
        link: "https://www.knoll.com/product/saarinen-executive-chair",
        image: "💼"
    }
];

// Game state
let gameState = {
    gamePool: [],
    currentPair: [],
    usedItems: [],
    round: 1,
    gameOver: false,
    winner: null,
    chosenItem: null,
    isLocked: true,
    ponderTime: 3,
    showResults: false,
    pollResults: { left: 0, right: 0 },
    ponderTimer: null,
    sessionId: null
};

// DOM elements
const elements = {
    startScreen: document.getElementById('startScreen'),
    playButton: document.getElementById('playButton'),
    gameOverScreen: document.getElementById('gameOverScreen'),
    gameBoard: document.getElementById('gameBoard'),
    leftCard: document.getElementById('leftCard'),
    rightCard: document.getElementById('rightCard'),
    vsBadge: document.getElementById('vsBadge'),
    continueButton: document.getElementById('continueButton'),
    selectionPrompt: document.getElementById('selectionPrompt'),
    resetButton: document.getElementById('resetButton'),
    subtitle: document.getElementById('subtitle'),
    
    // Left card elements
    leftEmoji: document.getElementById('leftEmoji'),
    leftTitle: document.getElementById('leftTitle'),
    leftDesigner: document.getElementById('leftDesigner'),
    leftMaterials: document.getElementById('leftMaterials'),
    leftDescription: document.getElementById('leftDescription'),
    leftLink: document.getElementById('leftLink'),
    leftPollResults: document.getElementById('leftPollResults'),
    leftPollLabel: document.getElementById('leftPollLabel'),
    leftPollPercentage: document.getElementById('leftPollPercentage'),
    leftPollFill: document.getElementById('leftPollFill'),
    leftPollDescription: document.getElementById('leftPollDescription'),
    
    // Right card elements
    rightEmoji: document.getElementById('rightEmoji'),
    rightTitle: document.getElementById('rightTitle'),
    rightDesigner: document.getElementById('rightDesigner'),
    rightMaterials: document.getElementById('rightMaterials'),
    rightDescription: document.getElementById('rightDescription'),
    rightLink: document.getElementById('rightLink'),
    rightPollResults: document.getElementById('rightPollResults'),
    rightPollLabel: document.getElementById('rightPollLabel'),
    rightPollPercentage: document.getElementById('rightPollPercentage'),
    rightPollFill: document.getElementById('rightPollFill'),
    rightPollDescription: document.getElementById('rightPollDescription'),
    
    // Winner elements
    winnerEmoji: document.getElementById('winnerEmoji'),
    winnerName: document.getElementById('winnerName'),
    winnerDesigner: document.getElementById('winnerDesigner'),
    winnerMaterials: document.getElementById('winnerMaterials'),
    winnerDescription: document.getElementById('winnerDescription'),
    winnerLink: document.getElementById('winnerLink'),
    
    // Ponder message
    ponderMessage: document.getElementById('ponderMessage')
};

// Initialize game
async function initializeGame() {
    try {
        // Generate new session ID
        gameState.sessionId = generateSessionId();
        
        // Fetch products from Supabase
        let products = await dbService.fetchActiveProducts();
        
        // Fallback to hardcoded data if database fails
        if (!products || products.length === 0) {
            console.warn('No products from database, using fallback data');
            products = fallbackFurnitureItems;
        }
        
        // Shuffle and select 16 random items
        const shuffled = [...products].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, Math.min(16, shuffled.length));
        
        gameState.gamePool = selected;
        gameState.currentPair = [selected[0], selected[1]];
        gameState.usedItems = [selected[0], selected[1]];
        gameState.round = 1;
        gameState.gameOver = false;
        gameState.winner = null;
        gameState.chosenItem = null;
        gameState.isLocked = true;
        gameState.ponderTime = 3;
        gameState.showResults = false;
        gameState.pollResults = { left: 0, right: 0 };
        
        // Update UI
        updateDisplay();
        startPonderTime();
    } catch (error) {
        console.error('Error initializing game:', error);
        // Fallback to hardcoded data
        const shuffled = [...fallbackFurnitureItems].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 16);
        
        gameState.gamePool = selected;
        gameState.currentPair = [selected[0], selected[1]];
        gameState.usedItems = [selected[0], selected[1]];
        gameState.round = 1;
        gameState.gameOver = false;
        gameState.winner = null;
        gameState.chosenItem = null;
        gameState.isLocked = true;
        gameState.ponderTime = 3;
        gameState.showResults = false;
        gameState.pollResults = { left: 0, right: 0 };
        
        updateDisplay();
        startPonderTime();
    }
}

// Update display
function updateDisplay() {
    if (gameState.gameOver && gameState.winner) {
        showGameOverScreen();
        return;
    }
    
    // Update subtitle with round info
    elements.subtitle.textContent = `Round ${gameState.round} of 15`;
    elements.subtitle.className = 'subtitle round-info';
    
    // Update cards
    updateCard('left', gameState.currentPair[0]);
    updateCard('right', gameState.currentPair[1]);
    
    // Update VS badge - always show 'vs'
    elements.vsBadge.textContent = 'vs';
    elements.vsBadge.classList.remove('countdown', 'ponder-mode');
    
    // Update card states
    updateCardStates();
    
    // Show/hide controls and poll results
    if (gameState.showResults) {
        showPollResults();
        showContinueButton();
        hideSelectionPrompt();
    } else {
        hidePollResults();
        hideContinueButton();
        if (!gameState.isLocked) {
            showSelectionPrompt();
        } else {
            hideSelectionPrompt();
        }
    }
    
    // Show/hide game screens
    elements.gameOverScreen.classList.add('hidden');
    elements.gameBoard.classList.remove('hidden');
}

// Truncate text to character limit
function truncateText(text, limit) {
    if (!text) return '';
    if (text.length <= limit) return text;
    return text.substring(0, limit).trim() + '...';
}

// Update individual card
function updateCard(side, item) {
    const prefix = side === 'left' ? 'left' : 'right';
    const linkUrl = item.product_url || item.link || '#';
    
    // Handle image display - use actual image or fallback to emoji
    const imageContainer = elements[`${prefix}Emoji`];
    
    if (item.image_url) {
        // Clear any existing content and create img element
        imageContainer.innerHTML = '';
        const img = document.createElement('img');
        img.src = item.image_url;
        img.alt = item.name;
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';
        img.style.borderRadius = '4px';
        
        // Handle image load errors - fallback to emoji
        img.onerror = () => {
            imageContainer.innerHTML = '';
            imageContainer.textContent = item.image || '🪑';
        };
        
        imageContainer.appendChild(img);
    } else {
        // Fallback to emoji
        imageContainer.innerHTML = '';
        imageContainer.textContent = item.image || '🪑';
    }
    
    elements[`${prefix}Title`].textContent = truncateText(item.name, 60);
    elements[`${prefix}Designer`].textContent = truncateText(item.designer, 50);
    elements[`${prefix}Materials`].textContent = item.materials || '';
    elements[`${prefix}Description`].textContent = truncateText(item.description, 250);
    elements[`${prefix}Link`].href = linkUrl;
}

// Update card states
function updateCardStates() {
    const leftCard = elements.leftCard;
    const rightCard = elements.rightCard;
    
    // Only update if state actually changed to avoid flicker
    const isCurrentlyLocked = leftCard.classList.contains('locked');
    
    if (gameState.isLocked && !isCurrentlyLocked) {
        // Locking cards
        leftCard.classList.remove('active');
        rightCard.classList.remove('active');
        leftCard.classList.add('locked');
        rightCard.classList.add('locked');
    } else if (!gameState.isLocked && isCurrentlyLocked) {
        // Unlocking cards - smooth transition
        leftCard.classList.remove('locked');
        rightCard.classList.remove('locked');
        
        // Add active class with slight delay for smooth transition
        setTimeout(() => {
            leftCard.classList.add('active');
            rightCard.classList.add('active');
        }, 50);
    }
    
    // Handle choice states
    if (gameState.chosenItem) {
        leftCard.classList.remove('chosen', 'not-chosen');
        rightCard.classList.remove('chosen', 'not-chosen');
        
        if (gameState.chosenItem === gameState.currentPair[0]) {
            leftCard.classList.add('chosen');
            rightCard.classList.add('not-chosen');
        } else {
            rightCard.classList.add('chosen');
            leftCard.classList.add('not-chosen');
        }
    } else {
        // Clear choice states
        leftCard.classList.remove('chosen', 'not-chosen');
        rightCard.classList.remove('chosen', 'not-chosen');
    }
}

// Start ponder time
function startPonderTime() {
    if (gameState.ponderTimer) {
        clearTimeout(gameState.ponderTimer);
    }
    
    const isMobile = window.innerWidth <= 800;
    
    // Enable ponder mode visual cues
    document.body.classList.add('ponder-mode');
    elements.vsBadge.classList.add('ponder-mode');
    elements.leftCard.classList.add('ponder-disabled');
    elements.rightCard.classList.add('ponder-disabled');
    
    if (isMobile) {
        // On mobile, replace VS badge text instead of showing ponder message
        elements.vsBadge.textContent = 'Study Both';
    } else {
        // On desktop, show ponder message
        elements.ponderMessage.classList.remove('hidden');
        elements.ponderMessage.classList.add('show');
    }
    
    // Hide message and unlock after 3 seconds
    gameState.ponderTimer = setTimeout(() => {
        // Remove ponder mode visual cues
        document.body.classList.remove('ponder-mode');
        elements.vsBadge.classList.remove('ponder-mode');
        elements.leftCard.classList.remove('ponder-disabled');
        elements.rightCard.classList.remove('ponder-disabled');
        
        // Restore VS badge text
        elements.vsBadge.textContent = 'vs';
        
        if (!isMobile) {
            elements.ponderMessage.classList.remove('show');
            
            // Wait for fade out animation, then hide and unlock
            setTimeout(() => {
                elements.ponderMessage.classList.add('hidden');
                gameState.isLocked = false;
                
                // Instead of full updateDisplay(), just update what's needed
                updateCardStates();
                showSelectionPrompt();
            }, 300);
        } else {
            // On mobile, unlock immediately
            gameState.isLocked = false;
            updateCardStates();
            showSelectionPrompt();
        }
    }, 3000);
}

// Handle choice
async function handleChoice(chosenItem) {
    if (gameState.gameOver || gameState.isLocked || gameState.showResults) {
        return;
    }
    
    // Immediate UI feedback
    gameState.chosenItem = chosenItem;
    gameState.isLocked = true;
    updateCardStates();
    
    // Record the choice in database (async in background)
    const loserItem = gameState.currentPair.find(item => item !== chosenItem);
    const recordPromise = dbService.recordUserChoice(
        gameState.sessionId,
        gameState.round,
        chosenItem.id,
        loserItem.id
    );
    
    // Get real head-to-head poll percentages from database (async in background)
    const statsPromise = dbService.getHeadToHeadStats(
        gameState.currentPair[0].id,
        gameState.currentPair[1].id
    );
    
    // Show results immediately, update with data when ready
    gameState.showResults = true;
    updateDisplay();
    
    // Handle async operations
    try {
        const [, headToHeadStats] = await Promise.all([recordPromise, statsPromise]);
        
        if (headToHeadStats.hasEnoughData) {
            gameState.pollResults = {
                left: headToHeadStats.productA_percentage,
                right: headToHeadStats.productB_percentage
            };
            console.log(`Showing real data: ${headToHeadStats.totalBattles} battles between these products`);
        } else {
            // Don't show percentages - will display "Not enough data" message
            gameState.pollResults = {
                left: null,
                right: null
            };
            console.log('Not enough battles between these products, hiding percentages');
        }
        
        // Update poll results with real data
        showPollResults();
    } catch (error) {
        console.error('Error getting head-to-head stats:', error);
        gameState.pollResults = {
            left: null,
            right: null
        };
        showPollResults();
    }
}

// Show poll results
function showPollResults() {
    const leftResults = elements.leftPollResults;
    const rightResults = elements.rightPollResults;
    
    leftResults.classList.remove('hidden');
    rightResults.classList.remove('hidden');
    
    // Add show class for fade animation
    setTimeout(() => {
        leftResults.classList.add('show');
        rightResults.classList.add('show');
    }, 50);
    
    // Update left poll
    const leftChosen = gameState.chosenItem === gameState.currentPair[0];
    elements.leftPollLabel.textContent = leftChosen ? 'Your Choice' : 'Not Selected';
    elements.leftPollLabel.classList.toggle('chosen', leftChosen);
    
    if (gameState.pollResults.left !== null) {
        elements.leftPollPercentage.textContent = `${gameState.pollResults.left}%`;
        elements.leftPollFill.style.width = `${gameState.pollResults.left}%`;
        elements.leftPollDescription.textContent = `${gameState.pollResults.left}% chose this`;
    } else {
        elements.leftPollPercentage.textContent = '—';
        elements.leftPollFill.style.width = '0%';
        elements.leftPollDescription.textContent = 'Not enough data';
    }
    
    elements.leftPollFill.classList.toggle('chosen', leftChosen);
    const leftContent = leftResults.querySelector('.poll-content');
    leftContent.classList.toggle('chosen', leftChosen);
    
    // Update right poll
    const rightChosen = gameState.chosenItem === gameState.currentPair[1];
    elements.rightPollLabel.textContent = rightChosen ? 'Your Choice' : 'Not Selected';
    elements.rightPollLabel.classList.toggle('chosen', rightChosen);
    
    if (gameState.pollResults.right !== null) {
        elements.rightPollPercentage.textContent = `${gameState.pollResults.right}%`;
        elements.rightPollFill.style.width = `${gameState.pollResults.right}%`;
        elements.rightPollDescription.textContent = `${gameState.pollResults.right}% chose this`;
    } else {
        elements.rightPollPercentage.textContent = '—';
        elements.rightPollFill.style.width = '0%';
        elements.rightPollDescription.textContent = 'Not enough data';
    }
    
    elements.rightPollFill.classList.toggle('chosen', rightChosen);
    const rightContent = rightResults.querySelector('.poll-content');
    rightContent.classList.toggle('chosen', rightChosen);
}

// Hide poll results
function hidePollResults() {
    elements.leftPollResults.classList.remove('show');
    elements.rightPollResults.classList.remove('show');
    
    setTimeout(() => {
        elements.leftPollResults.classList.add('hidden');
        elements.rightPollResults.classList.add('hidden');
    }, 400);
}

// Show continue button with animation
function showContinueButton() {
    // Hide VS badge
    elements.vsBadge.classList.add('hidden');
    // Show continue button
    elements.continueButton.classList.remove('hidden');
    setTimeout(() => {
        elements.continueButton.classList.add('show');
    }, 50);
}

// Hide continue button
function hideContinueButton() {
    elements.continueButton.classList.remove('show');
    setTimeout(() => {
        elements.continueButton.classList.add('hidden');
        // Show VS badge again
        elements.vsBadge.classList.remove('hidden');
    }, 300);
}

// Show selection prompt with animation
function showSelectionPrompt() {
    elements.selectionPrompt.classList.remove('hidden');
    setTimeout(() => {
        elements.selectionPrompt.classList.add('show');
    }, 50);
}

// Hide selection prompt
function hideSelectionPrompt() {
    elements.selectionPrompt.classList.remove('show');
    setTimeout(() => {
        elements.selectionPrompt.classList.add('hidden');
    }, 300);
}

// Move to next round
function moveToNextRound() {
    // Check if game should end
    if (gameState.round >= 15) {
        gameState.gameOver = true;
        gameState.winner = gameState.chosenItem;
        updateDisplay();
        return;
    }
    
    // Add the loser to used items (winner stays for next round)
    const loserItem = gameState.currentPair.find(item => item !== gameState.chosenItem);
    if (!gameState.usedItems.includes(loserItem)) {
        gameState.usedItems.push(loserItem);
    }
    
    // Get next challenger from remaining pool (exclude all used items)
    const remainingPool = gameState.gamePool.filter(item => !gameState.usedItems.includes(item));
    
    if (remainingPool.length === 0) {
        gameState.gameOver = true;
        gameState.winner = gameState.chosenItem;
        updateDisplay();
        return;
    }
    
    const nextChallenger = remainingPool[Math.floor(Math.random() * remainingPool.length)];
    
    // Add the new challenger to used items
    gameState.usedItems.push(nextChallenger);
    
    // Winner stays on the left, challenger on the right
    gameState.currentPair = [gameState.chosenItem, nextChallenger];
    gameState.round++;
    gameState.chosenItem = null;
    gameState.showResults = false;
    gameState.isLocked = true;
    gameState.ponderTime = 3;
    
    updateDisplay();
    startPonderTime();
}

// Show game over screen
function showGameOverScreen() {
    elements.gameOverScreen.classList.remove('hidden');
    elements.gameBoard.classList.add('hidden');
    document.body.classList.add('winner-screen');
    
    // Update winner information
    const linkUrl = gameState.winner.product_url || gameState.winner.link || '#';
    
    // Handle winner image display
    if (gameState.winner.image_url) {
        // Clear any existing content and create img element
        elements.winnerEmoji.innerHTML = '';
        const img = document.createElement('img');
        img.src = gameState.winner.image_url;
        img.alt = gameState.winner.name;
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';
        img.style.borderRadius = '4px';
        
        // Handle image load errors - fallback to emoji
        img.onerror = () => {
            elements.winnerEmoji.innerHTML = '';
            elements.winnerEmoji.textContent = gameState.winner.image || '🪑';
        };
        
        elements.winnerEmoji.appendChild(img);
    } else {
        // Fallback to emoji
        elements.winnerEmoji.innerHTML = '';
        elements.winnerEmoji.textContent = gameState.winner.image || '🪑';
    }
    
    elements.winnerName.textContent = truncateText(gameState.winner.name, 60);
    elements.winnerDesigner.textContent = truncateText(gameState.winner.designer, 50);
    elements.winnerMaterials.textContent = gameState.winner.materials || '';
    elements.winnerDescription.textContent = truncateText(gameState.winner.description, 250);
    elements.winnerLink.href = linkUrl;
}

// Reset game
function resetGame() {
    if (gameState.ponderTimer) {
        clearTimeout(gameState.ponderTimer);
    }
    // Reset subtitle
    elements.subtitle.textContent = 'Choose your preferred piece';
    elements.subtitle.className = 'subtitle';
    // Remove any mode states
    document.body.classList.remove('ponder-mode', 'winner-screen');
    elements.vsBadge.classList.remove('ponder-mode');
    elements.leftCard.classList.remove('ponder-disabled');
    elements.rightCard.classList.remove('ponder-disabled');
    
    initializeGame();
}

// Start game
function startGame() {
    elements.startScreen.classList.add('hidden');
    document.body.classList.remove('winner-screen');
    initializeGame();
}

// Event listeners
elements.playButton.addEventListener('click', startGame);
elements.leftCard.addEventListener('click', () => handleChoice(gameState.currentPair[0]));
elements.rightCard.addEventListener('click', () => handleChoice(gameState.currentPair[1]));
elements.continueButton.addEventListener('click', moveToNextRound);
elements.resetButton.addEventListener('click', resetGame);

// Prevent link clicks from triggering card selection
elements.leftLink.addEventListener('click', (e) => e.stopPropagation());
elements.rightLink.addEventListener('click', (e) => e.stopPropagation());

// Mobile menu functionality
document.addEventListener('DOMContentLoaded', () => {
    elements.startScreen.classList.remove('hidden');
    elements.gameBoard.classList.add('hidden');
    elements.gameOverScreen.classList.add('hidden');
    
    // Mobile menu toggle
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuClose = document.getElementById('mobileMenuClose');
    
    if (mobileMenuToggle && mobileMenu && mobileMenuClose) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenu.classList.add('is-open');
        });
        
        mobileMenuClose.addEventListener('click', () => {
            mobileMenu.classList.remove('is-open');
        });
        
        // Close menu when clicking outside
        mobileMenu.addEventListener('click', (e) => {
            if (e.target === mobileMenu) {
                mobileMenu.classList.remove('is-open');
            }
        });
    }
});