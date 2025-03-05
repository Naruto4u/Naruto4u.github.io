const character = document.getElementById('character');
const gameArea = document.getElementById('gameArea');
const gameContainer = document.getElementById('gameContainer');
const platforms = document.querySelectorAll('.platform');
const warps = document.querySelectorAll('.warp'); // Get all warp elements

let posX = 100;
let posY = 0;
let velocityY = 0;
let velocityX = 0;
const gravity = 0.7;
const jumpStrength = -15;
const moveSpeed = 0.8;
const friction = 0.9;
let isJumping = false;
let cameraX = 0;

const keys = {
    left: false,
    right: false,
    up: false
};

function updateCamera() {
    const halfContainer = gameContainer.clientWidth / 2;
    const targetX = -posX + halfContainer;
    cameraX = targetX;

    // Limit camera scrolling
    const maxScroll = -(gameArea.clientWidth - gameContainer.clientWidth);
    cameraX = Math.min(0, Math.max(maxScroll, cameraX));

    gameArea.style.transform = `translate3d(${cameraX}px, 0, 0)`;
}

function checkPlatformCollisions() {
    let onPlatform = false;

    platforms.forEach(platform => {
        // Get platform position and dimensions
        const platformLeft = parseInt(platform.style.left) || 0;
        const platformTop = parseInt(platform.style.top) || 0;
        const platformWidth = parseInt(platform.style.width) || platform.offsetWidth;
        const platformHeight = parseInt(platform.style.height) || platform.offsetHeight;

        // Current character position (not predicted)
        const characterLeft = posX;
        const characterRight = posX + character.clientWidth;
        const characterTop = posY;
        const characterBottom = posY + character.clientHeight;

        // Check collisions
        if (characterRight > platformLeft && 
            characterLeft < platformLeft + platformWidth && 
            characterBottom > platformTop && 
            characterTop < platformTop + platformHeight) {

            // Calculate overlap on each axis
            const overlapLeft = characterRight - platformLeft;
            const overlapRight = (platformLeft + platformWidth) - characterLeft;
            const overlapTop = characterBottom - platformTop;
            const overlapBottom = (platformTop + platformHeight) - characterTop;

            // Find smallest overlap to determine collision direction
            const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);

            if (minOverlap === overlapTop) {
                // Collision from above - land on platform
                posY = platformTop - character.clientHeight;
                velocityY = 0;
                isJumping = false;
                onPlatform = true;
            }
            else if (minOverlap === overlapBottom) {
                // Collision from below - hit head
                posY = platformTop + platformHeight;
                velocityY = 0;
            }
            else if (minOverlap === overlapLeft) {
                // Collision from left
                posX = platformLeft - character.clientWidth;
                velocityX = 0;
            }
            else if (minOverlap === overlapRight) {
                // Collision from right
                posX = platformLeft + platformWidth;
                velocityX = 0;
            }
        }
    });

    return onPlatform;
}

function checkWarpCollisions() {
    warps.forEach(warp => {
        // Get warp position with camera offset correction
        const warpLeft = parseInt(warp.style.left) || 0;
        const warpTop = parseInt(warp.style.top) || 0;
        const warpWidth = parseInt(warp.style.width) || 50; // Default width
        const warpHeight = parseInt(warp.style.height) || 50; // Default height

        // Character bounds with camera offset
        const characterLeft = posX;
        const characterRight = posX + character.clientWidth;
        const characterTop = posY;
        const characterBottom = posY + character.clientHeight;

        // Debug collision box
        console.log('Warp position:', warpLeft, warpTop);
        console.log('Character position:', characterLeft, characterTop);

        // Check for collision
        if (characterRight > warpLeft &&
            characterLeft < warpLeft + warpWidth &&
            characterBottom > warpTop &&
            characterTop < warpTop + warpHeight) {
            
            console.log('Collision detected!');
            const destination = warp.getAttribute('href');
            console.log('Destination:', destination);
            
            if (destination) {
                // Add small delay to prevent multiple warps
                setTimeout(() => {
                    window.location.href = destination;
                }, 100);
            }
        }
    });
}

function updateCharacter() {
    // Handle horizontal movement
    if (keys.left) velocityX -= moveSpeed;
    if (keys.right) velocityX += moveSpeed;

    // Apply friction
    velocityX *= friction;

    // Apply gravity
    velocityY += gravity;

    // Check platform collisions before updating position
    checkPlatformCollisions();

    // Update position
    posX += velocityX;
    posY += velocityY;

    // Check warp collisions
    checkWarpCollisions();

    // Ground collision
    const maxY = gameArea.clientHeight - character.clientHeight;
    if (posY >= maxY) {
        posY = maxY;
        velocityY = 0;
        isJumping = false;
    }

    // Update character position
    character.style.transform = `translate(${posX -100}px, ${posY}px)`;

    // Update camera position
    updateCamera();
}

document.addEventListener('keydown', (event) => {
    switch (event.key.toLowerCase()) {
        case 'a':
        case 'arrowleft':
            keys.left = true;
            break;
        case 'd':
        case 'arrowright':
            keys.right = true;
            break;
        case ' ':
        case 'w':
        case 'arrowup':
            if (!isJumping) {
                velocityY = jumpStrength;
                isJumping = true;
            }
            break;
    }
});

document.addEventListener('keyup', (event) => {
    switch (event.key.toLowerCase()) {
        case 'a':
        case 'arrowleft':
            keys.left = false;
            break;
        case 'd':
        case 'arrowright':
            keys.right = false;
            break;
    }
});

function gameLoop() {
    updateCharacter();
    requestAnimationFrame(gameLoop);
}

// Initialize the game
updateCamera();
gameLoop();