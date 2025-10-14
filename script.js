
// API configuration
const API_BASE_URL = window.location.origin;

// Game configuration
const gameConfig = {
    currentTheme: 'Chairs', // Change this to set the current theme
    currentCategory: 'Chairs' // Change this to filter by category (e.g., 'Chairs', 'Tables', 'Lighting', etc.)
};

// API service functions
const dbService = {
    async fetchActiveProducts(category = null) {
        try {
            const url = category 
                ? `${API_BASE_URL}/api/products?category=${encodeURIComponent(category)}`
                : `${API_BASE_URL}/api/products`;
            
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return data.products;
        } catch (error) {
            console.error('Error fetching products:', error);
            return [];
        }
    },

    async recordUserChoice(sessionId, roundNumber, winnerId, loserId) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/vote`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    sessionId,
                    roundNumber,
                    winnerId,
                    loserId
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        } catch (error) {
            console.error('Error recording user choice:', error);
        }
    },

    async getHeadToHeadStats(productA_id, productB_id) {
        try {
            const response = await fetch(
                `${API_BASE_URL}/api/stats?productA_id=${productA_id}&productB_id=${productB_id}`
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            return data;
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
    },

    async getTopProducts(limit = 5) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/leaderboard?limit=${limit}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return data.products;
        } catch (error) {
            console.error('Error getting top products:', error);
            return [];
        }
    }
};

// Generate unique session ID
function generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}


// Generate controversy message based on percentage
function getControversyMessage(percentage) {
    const messageRanges = {
        veryLow: [
            "Hot Take",
            "Bold Choice!",
            "You're brave!"
        ],
        low: [
            "Not So Popular",
            "Going Against the Grain",
            "Interesting choice..."
        ],
        medium: [
            "Tough Call",
            "Split Decision",
            "Could go either way"
        ],
        high: [
            "Usually a Winner",
            "Safe Bet",
            "Good eye!"
        ],
        veryHigh: [
            "Crowd Favorite",
            "Obvious Winner",
            "Everyone agrees!"
        ]
    };

    let range;
    if (percentage >= 0 && percentage <= 20) {
        range = messageRanges.veryLow;
    } else if (percentage > 20 && percentage <= 40) {
        range = messageRanges.low;
    } else if (percentage > 40 && percentage <= 60) {
        range = messageRanges.medium;
    } else if (percentage > 60 && percentage <= 80) {
        range = messageRanges.high;
    } else if (percentage > 80 && percentage <= 100) {
        range = messageRanges.veryHigh;
    } else {
        return "Interesting Choice";
    }

    // Return random message from the appropriate range
    const randomIndex = Math.floor(Math.random() * range.length);
    return range[randomIndex];
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
    autoContinueTimer: null,
    sessionId: null
};

// DOM elements
const elements = {
    startScreen: document.getElementById('startScreen'),
    playButton: document.getElementById('playButton'),
    gameOverScreen: document.getElementById('gameOverScreen'),
    gameBoard: document.getElementById('gameBoard'),
    gameTheme: document.getElementById('gameTheme'),
    leftCard: document.getElementById('leftCard'),
    rightCard: document.getElementById('rightCard'),
    vsBadge: document.getElementById('vsBadge'),
    continueButton: document.getElementById('continueButton'),
    selectionPrompt: document.getElementById('selectionPrompt'),
    resetButton: document.getElementById('resetButton'),
    subtitle: document.getElementById('subtitle'),
    ponderMessage: document.getElementById('ponderMessage'),
    
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
    leaderboardList: document.getElementById('leaderboardList')
};

// Initialize game
async function initializeGame() {
    try {
        // Generate new session ID
        gameState.sessionId = generateSessionId();
        
        // Update theme display
        if (elements.gameTheme) {
            elements.gameTheme.textContent = gameConfig.currentTheme;
        }
        
        // Fetch products from Supabase using current category filter
        let products = await dbService.fetchActiveProducts(gameConfig.currentCategory);
        
        // Fallback to hardcoded data if database fails
        if (!products || products.length === 0) {
            console.warn('No products from database, using fallback data');
            products = fallbackFurnitureItems;
        }
        
        // Shuffle products and select 16 for the game
        const shuffled = [...products].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, Math.min(16, shuffled.length));

        gameState.gamePool = selected;
        gameState.currentPair = [selected[0], selected[1]];
        gameState.usedItems = [gameState.currentPair[0], gameState.currentPair[1]];
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
        gameState.usedItems = [gameState.currentPair[0], gameState.currentPair[1]];
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
    elements.subtitle.textContent = `Round ${gameState.round} of 10`;
    elements.subtitle.className = 'subtitle round-info';
    
    // Update cards with smooth transition for subsequent rounds
    if (gameState.round > 1) {
        elements.leftCard.classList.add('game-start-fade');
        elements.rightCard.classList.add('game-start-fade');
    }
    
    updateCard('left', gameState.currentPair[0]);
    updateCard('right', gameState.currentPair[1]);
    
    // Fade in cards for subsequent rounds
    if (gameState.round > 1) {
        setTimeout(() => {
            elements.leftCard.classList.remove('game-start-fade');
            elements.rightCard.classList.remove('game-start-fade');
        }, 200);
    }
    
    // Update VS badge - always show 'vs'
    elements.vsBadge.textContent = 'vs';
    elements.vsBadge.classList.remove('countdown');
    
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
    elements[`${prefix}Designer`].href = item.designer_url || '#';
    if (!item.designer_url) {
        elements[`${prefix}Designer`].style.cursor = 'default';
        elements[`${prefix}Designer`].onclick = (e) => e.preventDefault();
    } else {
        elements[`${prefix}Designer`].style.cursor = 'pointer';
        elements[`${prefix}Designer`].onclick = null;
    }
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
    
    // Enable ponder mode visual cues
    document.body.classList.add('ponder-mode');
    elements.leftCard.classList.add('ponder-disabled');
    elements.rightCard.classList.add('ponder-disabled');
    
    // Show ponder message with smooth fade in
    elements.ponderMessage.classList.remove('hidden');
    elements.ponderMessage.classList.add('ponder-fade-in');
    
    // Start countdown timer with smooth fade in
    let countdown = 3;
    elements.vsBadge.classList.remove('stable');
    elements.vsBadge.textContent = countdown;
    elements.vsBadge.classList.add('countdown', 'countdown-fade-in');
    
    // Smooth fade in both elements with longer delay
    setTimeout(() => {
        elements.ponderMessage.classList.remove('ponder-fade-in');
        elements.ponderMessage.classList.add('show');
        elements.vsBadge.classList.remove('countdown-fade-in');
    }, 500);
    
    const countdownInterval = setInterval(() => {
        countdown--;
        if (countdown > 0) {
            elements.vsBadge.textContent = countdown;
        } else {
            clearInterval(countdownInterval);
            
            // Remove ponder mode visual cues
            document.body.classList.remove('ponder-mode');
            elements.leftCard.classList.remove('ponder-disabled');
            elements.rightCard.classList.remove('ponder-disabled');
            
            // Start fade out of VS badge and ponder message simultaneously
            elements.vsBadge.classList.add('fade-out');
            elements.ponderMessage.classList.remove('show');
            
            // Wait for fade out, then change text and fade back in very slowly
            setTimeout(() => {
                elements.ponderMessage.classList.add('hidden');
                
                // Change VS badge content while it's invisible
                elements.vsBadge.classList.remove('countdown');
                elements.vsBadge.textContent = 'vs';
                
                // Wait longer before fading VS badge back in for smoother appearance
                setTimeout(() => {
                    elements.vsBadge.classList.remove('fade-out');
                }, 300);
                
                gameState.isLocked = false;
                
                // Update what's needed
                updateCardStates();
                showSelectionPrompt();
            }, 800);
        }
    }, 1000);
    
    // Backup timer to ensure unlock after 3 seconds
    gameState.ponderTimer = setTimeout(() => {
        clearInterval(countdownInterval);
        
        // Remove ponder mode visual cues
        document.body.classList.remove('ponder-mode');
        elements.leftCard.classList.remove('ponder-disabled');
        elements.rightCard.classList.remove('ponder-disabled');
        
        // Start fade out of VS badge and ponder message simultaneously
        elements.vsBadge.classList.add('fade-out');
        elements.ponderMessage.classList.remove('show');
        
        setTimeout(() => {
            elements.ponderMessage.classList.add('hidden');
            
            // Change VS badge content while it's invisible
            elements.vsBadge.classList.remove('countdown');
            elements.vsBadge.textContent = 'vs';
            
            // Wait longer before fading VS badge back in for smoother appearance
            setTimeout(() => {
                elements.vsBadge.classList.remove('fade-out');
            }, 300);
            
            gameState.isLocked = false;
            updateCardStates();
            showSelectionPrompt();
        }, 800);
    }, 3000);
}

// Handle choice
async function handleChoice(chosenItem) {
    if (gameState.gameOver || gameState.isLocked || gameState.showResults) {
        return;
    }
    
    // Immediate UI feedback - hide selection prompt first to prevent shifting
    hideSelectionPrompt();

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
    
    // Show results immediately for continue button, but delay poll data display
    gameState.showResults = true;
    gameState.pollDataReady = false; // Flag to control poll display
    updateDisplay();
    
    // Handle async operations
    try {
        const [, headToHeadStats] = await Promise.all([recordPromise, statsPromise]);
        
        if (headToHeadStats.hasEnoughData) {
            gameState.pollResults = {
                left: headToHeadStats.productA_percentage,
                right: headToHeadStats.productB_percentage
            };
        } else {
            // Don't show percentages - will display "Not enough data" message
            gameState.pollResults = {
                left: null,
                right: null
            };
        }
        
        // Mark poll data as ready and show results
        gameState.pollDataReady = true;
        showPollResults();

        // Start auto-continue timer
        startAutoContinueTimer();
    } catch (error) {
        console.error('Error getting head-to-head stats:', error);
        gameState.pollResults = {
            left: null,
            right: null
        };

        // Mark poll data as ready (even with no data) and show results
        gameState.pollDataReady = true;
        showPollResults();

        // Start auto-continue timer
        startAutoContinueTimer();
    }
}

// Start auto-continue timer
function startAutoContinueTimer() {
    // Clear any existing timer
    if (gameState.autoContinueTimer) {
        clearTimeout(gameState.autoContinueTimer);
    }
    
    gameState.autoContinueTimer = setTimeout(() => {
        if (gameState.showResults && !gameState.gameOver) {
            // Hide continue button and poll results, then move to next round
            elements.continueButton.classList.remove('show');
            elements.continueButton.classList.add('hidden');
            hidePollResults(); // Clear data when auto-continuing
            moveToNextRound();
        }
    }, 8000);
}

// Show poll results with stable display
function showPollResults() {
    const leftResults = elements.leftPollResults;
    const rightResults = elements.rightPollResults;

    const leftChosen = gameState.chosenItem === gameState.currentPair[0];
    const rightChosen = gameState.chosenItem === gameState.currentPair[1];

    // Only show if poll data is ready to prevent flash of old data
    if (!gameState.pollDataReady) {
        return;
    }

    // Reset progress bars to prevent flash
    elements.leftPollFill.style.width = '0%';
    elements.rightPollFill.style.width = '0%';
    elements.leftPollFill.style.transition = 'none';
    elements.rightPollFill.style.transition = 'none';

    leftResults.classList.remove('hidden');
    rightResults.classList.remove('hidden');

    // Add show class for fade animation
    setTimeout(() => {
        leftResults.classList.add('show');
        rightResults.classList.add('show');
    }, 50);

    // Set up labels
    elements.leftPollLabel.textContent = leftChosen ? 'Your Choice' : 'Not Chosen';
    elements.leftPollLabel.classList.toggle('chosen', leftChosen);
    elements.rightPollLabel.textContent = rightChosen ? 'Your Choice' : 'Not Chosen';
    elements.rightPollLabel.classList.toggle('chosen', rightChosen);

    // Calculate percentages
    let leftPercentage, rightPercentage;
    if (gameState.pollResults.left !== null && gameState.pollResults.right !== null) {
        leftPercentage = gameState.pollResults.left;
        rightPercentage = gameState.pollResults.right;
    } else {
        leftPercentage = Math.floor(Math.random() * 101);
        rightPercentage = Math.floor(Math.random() * 101);
    }

    // Set text content
    elements.leftPollPercentage.textContent = `${leftPercentage}% Chose This`;
    elements.rightPollPercentage.textContent = `${rightPercentage}% Chose This`;
    elements.leftPollDescription.textContent = leftChosen ? getControversyMessage(leftPercentage) : '';
    elements.rightPollDescription.textContent = rightChosen ? getControversyMessage(rightPercentage) : '';

    // Ensure consistent height
    if (!elements.leftPollDescription.textContent) {
        elements.leftPollDescription.innerHTML = '&nbsp;';
    }
    if (!elements.rightPollDescription.textContent) {
        elements.rightPollDescription.innerHTML = '&nbsp;';
    }

    // Set up styling
    elements.leftPollFill.classList.toggle('chosen', leftChosen);
    elements.rightPollFill.classList.toggle('chosen', rightChosen);
    const leftContent = leftResults.querySelector('.poll-content');
    const rightContent = rightResults.querySelector('.poll-content');
    leftContent.classList.toggle('chosen', leftChosen);
    rightContent.classList.toggle('chosen', rightChosen);

    // Animate progress bars
    setTimeout(() => {
        elements.leftPollFill.style.transition = 'width 1s ease-out';
        elements.rightPollFill.style.transition = 'width 1s ease-out';
        elements.leftPollFill.style.width = `${leftPercentage}%`;
        elements.rightPollFill.style.width = `${rightPercentage}%`;
    }, 200);
}

// Hide poll results
function hidePollResults() {
    elements.leftPollResults.classList.remove('show');
    elements.rightPollResults.classList.remove('show');

    // Immediately reset everything to prevent any flashing
    elements.leftPollFill.style.width = '0%';
    elements.rightPollFill.style.width = '0%';
    elements.leftPollFill.style.transition = 'none';
    elements.rightPollFill.style.transition = 'none';
    elements.leftPollPercentage.textContent = '';
    elements.rightPollPercentage.textContent = '';
    elements.leftPollDescription.textContent = '';
    elements.rightPollDescription.textContent = '';

    setTimeout(() => {
        elements.leftPollResults.classList.add('hidden');
        elements.rightPollResults.classList.add('hidden');
    }, 200);
}

// Show continue button with animation
function showContinueButton() {
    // Hide VS badge
    elements.vsBadge.classList.add('hidden');
    // Show continue button with smooth fade in
    elements.continueButton.classList.remove('hidden');
    elements.continueButton.classList.add('continue-fade-in');
    
    setTimeout(() => {
        elements.continueButton.classList.remove('continue-fade-in');
        elements.continueButton.classList.add('show');
    }, 500);
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
    // Clear auto-continue timer
    if (gameState.autoContinueTimer) {
        clearTimeout(gameState.autoContinueTimer);
        gameState.autoContinueTimer = null;
    }
    
    // Check if game should end
    if (gameState.round >= 10) {
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
    
    // Clear poll results data for clean transition
    gameState.pollResults = { left: null, right: null };
    gameState.pollDataReady = false; // Reset poll data flag

    // Winner stays on the left, challenger on the right
    gameState.currentPair = [gameState.chosenItem, nextChallenger];
    gameState.round++;
    gameState.chosenItem = null;
    gameState.showResults = false;
    gameState.isLocked = true;
    gameState.ponderTime = 3;

    // Ensure poll results are hidden
    hidePollResults();

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
    elements.winnerDesigner.href = gameState.winner.designer_url || '#';
    if (!gameState.winner.designer_url) {
        elements.winnerDesigner.style.cursor = 'default';
        elements.winnerDesigner.onclick = (e) => e.preventDefault();
    } else {
        elements.winnerDesigner.style.cursor = 'pointer';
        elements.winnerDesigner.onclick = null;
    }
    elements.winnerMaterials.textContent = gameState.winner.materials || '';
    elements.winnerDescription.textContent = truncateText(gameState.winner.description, 250);
    elements.winnerLink.href = linkUrl;
    
    // Load and display top 5 leaderboard
    loadLeaderboard();
}

// Load and display leaderboard
async function loadLeaderboard() {
    try {
        const topProducts = await dbService.getTopProducts(5);
        displayLeaderboard(topProducts);
    } catch (error) {
        console.error('Error loading leaderboard:', error);
        elements.leaderboardList.innerHTML = '<p style="text-align: center; color: #999;">Unable to load leaderboard</p>';
    }
}

// Display leaderboard
function displayLeaderboard(products) {
    if (!products || products.length === 0) {
        elements.leaderboardList.innerHTML = '<p style="text-align: center; color: #999;">No data available</p>';
        return;
    }
    
    const leaderboardHTML = products.map((product, index) => {
        const winRate = (product.winRate * 100).toFixed(1);
        const linkUrl = product.product_url || '#';
        
        return `
            <div class="leaderboard-item">
                <span class="leaderboard-rank">${index + 1}</span>
                <div class="leaderboard-product">
                    <a href="${linkUrl}" target="_blank" rel="noopener noreferrer" class="leaderboard-product-name">
                        ${truncateText(product.name, 40)}
                    </a>
                </div>
                <span class="leaderboard-stats">${winRate}%</span>
            </div>
        `;
    }).join('');
    
    elements.leaderboardList.innerHTML = leaderboardHTML;
}

// Reset game
function resetGame() {
    if (gameState.ponderTimer) {
        clearTimeout(gameState.ponderTimer);
    }
    if (gameState.autoContinueTimer) {
        clearTimeout(gameState.autoContinueTimer);
    }
    // Reset subtitle
    elements.subtitle.textContent = 'Round 1 of 10';
    elements.subtitle.className = 'subtitle round-info';
    // Remove any mode states
    document.body.classList.remove('ponder-mode', 'winner-screen');
    elements.vsBadge.classList.remove('countdown');
    elements.vsBadge.classList.add('stable');
    elements.vsBadge.textContent = 'vs';
    elements.leftCard.classList.remove('ponder-disabled');
    elements.rightCard.classList.remove('ponder-disabled');
    elements.ponderMessage.classList.remove('show');
    elements.ponderMessage.classList.add('hidden');
    
    initializeGame();
}

// Start game
function startGame() {
    elements.startScreen.classList.add('hidden');
    document.body.classList.remove('winner-screen');
    
    // Initialize game first
    initializeGame();
    
    // Set up initial fade state after initialization
    elements.leftCard.classList.add('game-start-fade');
    elements.rightCard.classList.add('game-start-fade');
    elements.gameBoard.classList.add('initial-fade');
    
    // Show game board
    elements.gameBoard.classList.remove('hidden');
    
    // Start smooth fade-in after a brief moment
    setTimeout(() => {
        elements.gameBoard.classList.remove('initial-fade');
        
        // Both cards fade in together after game board is visible
        setTimeout(() => {
            elements.leftCard.classList.remove('game-start-fade');
            elements.rightCard.classList.remove('game-start-fade');
        }, 300);
    }, 200);
}

// Event listeners
elements.playButton.addEventListener('click', startGame);
elements.leftCard.addEventListener('click', () => handleChoice(gameState.currentPair[0]));
elements.rightCard.addEventListener('click', () => handleChoice(gameState.currentPair[1]));
elements.continueButton.addEventListener('click', () => {
    // Hide continue button and poll results immediately to prevent jump
    elements.continueButton.classList.remove('show');
    elements.continueButton.classList.add('hidden');
    hidePollResults(); // Clear data when transitioning
    moveToNextRound();
});
elements.resetButton.addEventListener('click', resetGame);

// Prevent link clicks from triggering card selection
elements.leftLink.addEventListener('click', (e) => e.stopPropagation());
elements.rightLink.addEventListener('click', (e) => e.stopPropagation());
elements.leftDesigner.addEventListener('click', (e) => e.stopPropagation());
elements.rightDesigner.addEventListener('click', (e) => e.stopPropagation());

// Keyboard navigation for desktop users
document.addEventListener('keydown', (e) => {
    // Check if we're in the game board (not start screen or other modals)
    if (!elements.startScreen.classList.contains('hidden') || elements.gameOverScreen.classList.contains('show')) {
        return;
    }

    // Handle Continue button during results phase
    if (gameState.showResults && !gameState.gameOver) {
        switch(e.key) {
            case ' ': // Spacebar
            case 'Enter':
                e.preventDefault();
                // Simulate continue button click
                elements.continueButton.classList.remove('show');
                elements.continueButton.classList.add('hidden');
                hidePollResults();
                moveToNextRound();
                break;
        }
        return;
    }

    // Handle card selection during active gameplay (not during ponder time, results, or game over)
    if (gameState.gameOver || gameState.isLocked || gameState.showResults || !gameState.currentPair.length) {
        return;
    }

    switch(e.key) {
        case 'ArrowLeft':
            e.preventDefault();
            handleChoice(gameState.currentPair[0]); // Left card
            break;
        case 'ArrowRight':
            e.preventDefault();
            handleChoice(gameState.currentPair[1]); // Right card
            break;
    }
});

// Set theme display function
function updateThemeDisplay() {
    const themeElement = document.getElementById('gameTheme');
    if (themeElement) {
        themeElement.textContent = gameConfig.currentTheme;
    }
}

// Check for preview mode
function checkPreviewMode() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('preview') === 'true';
}

// Preview mode functionality
let previewState = {
    products: []
};

// Preview mode elements
const previewElements = {
    previewScreen: document.getElementById('previewScreen'),
    previewGrid: document.getElementById('previewGrid'),
    previewTheme: document.getElementById('previewTheme'),
    backToGameButton: document.getElementById('backToGameButton'),
    refreshPreviewButton: document.getElementById('refreshPreviewButton')
};

// Initialize preview mode
async function initializePreviewMode() {
    try {
        // Hide all other screens
        elements.startScreen.classList.add('hidden');
        elements.gameBoard.classList.add('hidden');
        elements.gameOverScreen.classList.add('hidden');
        
        // Show preview screen
        previewElements.previewScreen.classList.remove('hidden');
        
        // Update theme display
        previewElements.previewTheme.textContent = gameConfig.currentTheme;
        
        // Load and display products
        await loadPreviewProducts();
        
    } catch (error) {
        console.error('Error initializing preview mode:', error);
        showError('Failed to load preview mode');
    }
}

// Load products for preview
async function loadPreviewProducts() {
    try {
        const products = await dbService.fetchActiveProducts(gameConfig.currentCategory);
        previewState.products = products;
        displayPreviewProducts(products);
    } catch (error) {
        console.error('Error loading preview products:', error);
        showError('Failed to load products');
    }
}

// Display products in preview grid (2 cards per row like the game)
function displayPreviewProducts(products) {
    const grid = previewElements.previewGrid;
    grid.innerHTML = '';
    
    if (!products || products.length === 0) {
        grid.innerHTML = '<p style="text-align: center; color: #666;">No products found for this category.</p>';
        return;
    }
    
    // Create rows of 2 cards each (like the game layout)
    for (let i = 0; i < products.length; i += 2) {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'preview-row';
        
        // Add first card
        const product1 = products[i];
        const card1 = createPreviewProductElement(product1);
        rowDiv.appendChild(card1);
        
        // Add second card if it exists
        if (i + 1 < products.length) {
            const product2 = products[i + 1];
            const card2 = createPreviewProductElement(product2);
            rowDiv.appendChild(card2);
        }
        
        grid.appendChild(rowDiv);
    }
}

// Create individual product element for preview (uses exact game card structure)
function createPreviewProductElement(product) {
    const productDiv = document.createElement('div');
    productDiv.className = 'furniture-card'; // Use exact game class
    
    const linkUrl = product.product_url || product.link || '#';
    
    // Use EXACT same HTML structure as the game cards
    productDiv.innerHTML = `
        <div class="card-image-container">
            <div class="card-emoji"></div>
        </div>
        <div class="card-content">
            <div class="card-info">
                <h3 class="card-title">${truncateText(product.name, 60)}</h3>
                <p class="card-designer">${truncateText(product.designer, 50)}</p>
                <p class="card-materials">${product.materials || ''}</p>
            </div>
            <p class="card-description">${truncateText(product.description, 250)}</p>
            <a href="${linkUrl}" target="_blank" rel="noopener noreferrer" class="card-link">
                Learn More
            </a>
        </div>
    `;
    
    // Handle image display using exact same logic as updateCard function
    const imageContainer = productDiv.querySelector('.card-emoji');
    
    if (product.image_url) {
        // Clear any existing content and create img element
        imageContainer.innerHTML = '';
        const img = document.createElement('img');
        img.src = product.image_url;
        img.alt = product.name;
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';
        img.style.borderRadius = '4px';
        
        // Handle image load errors - fallback to emoji
        img.onerror = () => {
            imageContainer.innerHTML = '';
            imageContainer.textContent = product.image || '🪑';
        };
        
        imageContainer.appendChild(img);
    } else {
        // Fallback to emoji
        imageContainer.innerHTML = '';
        imageContainer.textContent = product.image || '🪑';
    }
    
    return productDiv;
}

// Show error message
function showError(message) {
    previewElements.previewGrid.innerHTML = `
        <div style="text-align: center; color: #cc0000; grid-column: 1 / -1; padding: 2rem;">
            <p>${message}</p>
            <button onclick="window.location.reload()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: #000; color: #fff; border: none; cursor: pointer;">
                Retry
            </button>
        </div>
    `;
}

// Back to game functionality
function backToGame() {
    // Remove preview parameter and reload
    const url = new URL(window.location);
    url.searchParams.delete('preview');
    window.location.href = url.toString();
}

// Mobile menu functionality
document.addEventListener('DOMContentLoaded', () => {
    // Check if we're in preview mode
    if (checkPreviewMode()) {
        initializePreviewMode();
        
        // Set up preview mode event listeners
        previewElements.backToGameButton.addEventListener('click', backToGame);
        previewElements.refreshPreviewButton.addEventListener('click', loadPreviewProducts);
        
        return; // Exit early, don't initialize normal game
    }
    
    // Normal game initialization
    elements.startScreen.classList.remove('hidden');
    elements.gameBoard.classList.add('hidden');
    elements.gameOverScreen.classList.add('hidden');
    previewElements.previewScreen.classList.add('hidden');
    
    // Set theme display on page load
    updateThemeDisplay();
    
    // Also try setting it after a brief delay in case there's a timing issue
    setTimeout(updateThemeDisplay, 100);
    
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