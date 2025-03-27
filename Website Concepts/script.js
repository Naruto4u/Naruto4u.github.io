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
    const halfContainerHeight = gameContainer.clientHeight / 2;
    const targetY = -posY + halfContainerHeight;
    let cameraY = targetY;

    // Limit camera scrolling to the bounds of the game area
    const maxScrollY = -(gameArea.clientHeight - gameContainer.clientHeight);
    cameraY = Math.min(0, Math.max(maxScrollY, cameraY));

    // Apply vertical scrolling
    gameArea.style.transform = `translate3d(0, ${cameraY}px, 0)`;
}

function checkPlatformCollisions() {
    let onPlatform = false;

    platforms.forEach(platform => {
        // Get platform position and dimensions
        const platformLeft = parseFloat(platform.style.left) || 0;
        const platformTop = parseFloat(platform.style.top) || 0;
        const platformWidth = parseFloat(platform.style.width) || platform.offsetWidth;
        const platformHeight = parseFloat(platform.style.height) || platform.offsetHeight;

        // Current character position
        const characterLeft = posX;
        const characterRight = posX + character.clientWidth;
        const characterTop = posY;
        const characterBottom = posY + character.clientHeight;

        // Check if the character is within the platform's horizontal bounds
        const isWithinHorizontalBounds = characterRight > platformLeft && characterLeft < platformLeft + platformWidth;

        // Check if the character is landing on the platform
        const isLandingOnPlatform = characterBottom >= platformTop && characterBottom <= platformTop + velocityY;

        // Check if the character is falling
        const isFalling = velocityY >= 0;

        // Skip collision detection if the "down" key is pressed and the character is above the platform
        if (keys.down && isWithinHorizontalBounds && characterBottom <= platformTop + 5) {
            return; // Skip this platform
        }

        if (isWithinHorizontalBounds && isLandingOnPlatform && isFalling) {
            posY = platformTop - character.clientHeight; // Snap character to platform
            velocityY = 0; // Stop vertical movement
            isJumping = false; // Allow jumping again
            onPlatform = true;
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

    // Prevent the character from going off-screen horizontally
    const maxX = gameArea.clientWidth - character.clientWidth;
    if (posX < 0) {
        posX = 0;
        velocityX = 0;
    } else if (posX > maxX) {
        posX = maxX;
        velocityX = 0;
    }

    // Prevent the character from falling below the bottom of the game area
    const maxY = gameArea.clientHeight - character.clientHeight;
    if (posY >= maxY) {
        posY = maxY;
        velocityY = 0;
        isJumping = false;
    }

    // Check warp collisions
    checkWarpCollisions();

    // Update character position
    character.style.transform = `translate(${posX -100}px, ${posY}px)`;

    // Update camera position
    updateCamera();
}

document.addEventListener('keydown', (event) => {
    switch (event.key.toLowerCase()) {
        case 'arrowleft':
        case 'a':
            keys.left = true;
            break;
        case 'arrowright':
        case 'd':
            keys.right = true;
            break;
        case 'arrowup':
        case 'w':
            if (!isJumping) {
                velocityY = jumpStrength;
                isJumping = true;
            }
            break;
        case 'arrowdown':
        case 's':
            keys.down = true;
            break;
    }
});

document.addEventListener('keyup', (event) => {
    switch (event.key.toLowerCase()) {
        case 'arrowleft':
        case 'a':
            keys.left = false;
            break;
        case 'arrowright':
        case 'd':
            keys.right = false;
            break;
        case 'arrowdown':
        case 's':
            keys.down = false;
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