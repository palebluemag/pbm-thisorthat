// Furniture items data
const furnitureItems = [
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
    round: 1,
    gameOver: false,
    winner: null,
    chosenItem: null,
    isLocked: true,
    countdown: 5,
    showResults: false,
    pollResults: { left: 0, right: 0 },
    countdownTimer: null
};

// DOM elements
const elements = {
    gameOverScreen: document.getElementById('gameOverScreen'),
    gameBoard: document.getElementById('gameBoard'),
    leftCard: document.getElementById('leftCard'),
    rightCard: document.getElementById('rightCard'),
    vsBadge: document.getElementById('vsBadge'),
    continueButton: document.getElementById('continueButton'),
    selectionPrompt: document.getElementById('selectionPrompt'),
    resetButton: document.getElementById('resetButton'),
    roundNumber: document.getElementById('roundNumber'),
    
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
    winnerLink: document.getElementById('winnerLink')
};

// Initialize game
function initializeGame() {
    // Shuffle and select 16 random items
    const shuffled = [...furnitureItems].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 16);
    
    gameState.gamePool = selected;
    gameState.currentPair = [selected[0], selected[1]];
    gameState.round = 1;
    gameState.gameOver = false;
    gameState.winner = null;
    gameState.chosenItem = null;
    gameState.isLocked = true;
    gameState.countdown = 5;
    gameState.showResults = false;
    gameState.pollResults = { left: 0, right: 0 };
    
    // Update UI
    updateDisplay();
    startCountdown();
}

// Update display
function updateDisplay() {
    if (gameState.gameOver && gameState.winner) {
        showGameOverScreen();
        return;
    }
    
    // Update round number
    elements.roundNumber.textContent = gameState.round;
    
    // Update cards
    updateCard('left', gameState.currentPair[0]);
    updateCard('right', gameState.currentPair[1]);
    
    // Update VS badge
    if (gameState.isLocked) {
        elements.vsBadge.textContent = gameState.countdown;
        elements.vsBadge.classList.add('countdown');
    } else {
        elements.vsBadge.textContent = 'vs';
        elements.vsBadge.classList.remove('countdown');
    }
    
    // Update card states
    updateCardStates();
    
    // Show/hide controls and poll results
    if (gameState.showResults) {
        showPollResults();
        elements.continueButton.classList.remove('hidden');
        elements.selectionPrompt.classList.add('hidden');
    } else {
        hidePollResults();
        elements.continueButton.classList.add('hidden');
        if (!gameState.isLocked) {
            elements.selectionPrompt.classList.remove('hidden');
        } else {
            elements.selectionPrompt.classList.add('hidden');
        }
    }
    
    // Show/hide game screens
    elements.gameOverScreen.classList.add('hidden');
    elements.gameBoard.classList.remove('hidden');
}

// Update individual card
function updateCard(side, item) {
    const prefix = side === 'left' ? 'left' : 'right';
    
    elements[`${prefix}Emoji`].textContent = item.image;
    elements[`${prefix}Title`].textContent = item.name;
    elements[`${prefix}Designer`].textContent = item.designer;
    elements[`${prefix}Materials`].textContent = item.materials;
    elements[`${prefix}Description`].textContent = item.description;
    elements[`${prefix}Link`].href = item.link;
}

// Update card states
function updateCardStates() {
    const leftCard = elements.leftCard;
    const rightCard = elements.rightCard;
    
    // Reset classes
    leftCard.classList.remove('locked', 'chosen', 'not-chosen');
    rightCard.classList.remove('locked', 'chosen', 'not-chosen');
    
    // Apply states
    if (gameState.isLocked) {
        leftCard.classList.add('locked');
        rightCard.classList.add('locked');
    }
    
    if (gameState.chosenItem) {
        if (gameState.chosenItem === gameState.currentPair[0]) {
            leftCard.classList.add('chosen');
            rightCard.classList.add('not-chosen');
        } else {
            rightCard.classList.add('chosen');
            leftCard.classList.add('not-chosen');
        }
    }
}

// Start countdown
function startCountdown() {
    if (gameState.countdownTimer) {
        clearInterval(gameState.countdownTimer);
    }
    
    gameState.countdown = 5;
    updateCountdownDisplay();
    
    gameState.countdownTimer = setInterval(() => {
        gameState.countdown--;
        updateCountdownDisplay();
        
        if (gameState.countdown <= 0) {
            clearInterval(gameState.countdownTimer);
            gameState.isLocked = false;
            updateDisplay();
        }
    }, 1000);
}

// Update countdown display
function updateCountdownDisplay() {
    if (gameState.isLocked) {
        elements.vsBadge.textContent = gameState.countdown;
        elements.vsBadge.classList.add('countdown');
    } else {
        elements.vsBadge.textContent = 'vs';
        elements.vsBadge.classList.remove('countdown');
    }
}

// Handle choice
function handleChoice(chosenItem) {
    if (gameState.gameOver || gameState.isLocked || gameState.showResults) {
        return;
    }
    
    gameState.chosenItem = chosenItem;
    
    // Generate random poll percentages
    const chosenPercentage = Math.floor(Math.random() * 40) + 50; // 50-90%
    const otherPercentage = 100 - chosenPercentage;
    
    const isLeftChoice = gameState.currentPair[0] === chosenItem;
    gameState.pollResults = {
        left: isLeftChoice ? chosenPercentage : otherPercentage,
        right: isLeftChoice ? otherPercentage : chosenPercentage
    };
    
    gameState.showResults = true;
    
    updateDisplay();
}

// Show poll results
function showPollResults() {
    const leftResults = elements.leftPollResults;
    const rightResults = elements.rightPollResults;
    
    leftResults.classList.remove('hidden');
    rightResults.classList.remove('hidden');
    
    // Update left poll
    const leftChosen = gameState.chosenItem === gameState.currentPair[0];
    elements.leftPollLabel.textContent = leftChosen ? 'Your Choice' : 'Not Selected';
    elements.leftPollLabel.classList.toggle('chosen', leftChosen);
    elements.leftPollPercentage.textContent = `${gameState.pollResults.left}%`;
    elements.leftPollFill.style.width = `${gameState.pollResults.left}%`;
    elements.leftPollFill.classList.toggle('chosen', leftChosen);
    elements.leftPollDescription.textContent = `${gameState.pollResults.left}% chose this`;
    
    const leftContent = leftResults.querySelector('.poll-content');
    leftContent.classList.toggle('chosen', leftChosen);
    
    // Update right poll
    const rightChosen = gameState.chosenItem === gameState.currentPair[1];
    elements.rightPollLabel.textContent = rightChosen ? 'Your Choice' : 'Not Selected';
    elements.rightPollLabel.classList.toggle('chosen', rightChosen);
    elements.rightPollPercentage.textContent = `${gameState.pollResults.right}%`;
    elements.rightPollFill.style.width = `${gameState.pollResults.right}%`;
    elements.rightPollFill.classList.toggle('chosen', rightChosen);
    elements.rightPollDescription.textContent = `${gameState.pollResults.right}% chose this`;
    
    const rightContent = rightResults.querySelector('.poll-content');
    rightContent.classList.toggle('chosen', rightChosen);
}

// Hide poll results
function hidePollResults() {
    elements.leftPollResults.classList.add('hidden');
    elements.rightPollResults.classList.add('hidden');
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
    
    // Get next challenger from remaining pool
    const usedItems = new Set([gameState.chosenItem, gameState.currentPair.find(item => item !== gameState.chosenItem)]);
    const remainingPool = gameState.gamePool.filter(item => !usedItems.has(item));
    
    if (remainingPool.length === 0) {
        gameState.gameOver = true;
        gameState.winner = gameState.chosenItem;
        updateDisplay();
        return;
    }
    
    const nextChallenger = remainingPool[Math.floor(Math.random() * remainingPool.length)];
    
    // Winner stays on the left, challenger on the right
    gameState.currentPair = [gameState.chosenItem, nextChallenger];
    gameState.round++;
    gameState.chosenItem = null;
    gameState.showResults = false;
    gameState.isLocked = true;
    gameState.countdown = 5;
    
    updateDisplay();
    startCountdown();
}

// Show game over screen
function showGameOverScreen() {
    elements.gameOverScreen.classList.remove('hidden');
    elements.gameBoard.classList.add('hidden');
    
    // Update winner information
    elements.winnerEmoji.textContent = gameState.winner.image;
    elements.winnerName.textContent = gameState.winner.name;
    elements.winnerDesigner.textContent = gameState.winner.designer;
    elements.winnerMaterials.textContent = gameState.winner.materials;
    elements.winnerDescription.textContent = gameState.winner.description;
    elements.winnerLink.href = gameState.winner.link;
}

// Reset game
function resetGame() {
    if (gameState.countdownTimer) {
        clearInterval(gameState.countdownTimer);
    }
    initializeGame();
}

// Event listeners
elements.leftCard.addEventListener('click', () => handleChoice(gameState.currentPair[0]));
elements.rightCard.addEventListener('click', () => handleChoice(gameState.currentPair[1]));
elements.continueButton.addEventListener('click', moveToNextRound);
elements.resetButton.addEventListener('click', resetGame);

// Prevent link clicks from triggering card selection
elements.leftLink.addEventListener('click', (e) => e.stopPropagation());
elements.rightLink.addEventListener('click', (e) => e.stopPropagation());

// Initialize game on page load
document.addEventListener('DOMContentLoaded', initializeGame);