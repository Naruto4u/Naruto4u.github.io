const character = document.getElementById('character');
const gameArea = document.getElementById('gameArea');
const gameContainer = document.getElementById('gameContainer');
const platforms = document.querySelectorAll('.platform');

let posX = 100;
let posY = 0;
let velocityY = 0;
let velocityX = 0;
const gravity = 0.5;
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
        const platformRect = platform.getBoundingClientRect();
        const gameAreaRect = gameArea.getBoundingClientRect();

        // Calculate platform position relative to the game area
        const platformLeft = platformRect.left - gameAreaRect.left;
        const platformTop = platformRect.top - gameAreaRect.top;
        const platformWidth = platform.clientWidth;
        const platformHeight = platform.clientHeight;

        const characterLeft = posX;
        const characterRight = posX + character.clientWidth;
        const characterBottom = posY + character.clientHeight;

        if (velocityY > 0 && // Moving downward
            characterBottom >= platformTop &&
            characterBottom <= platformTop + platformHeight &&
            characterRight >= platformLeft &&
            characterLeft <= platformLeft + platformWidth
        ) {
            posY = platformTop - character.clientHeight;
            velocityY = 0;
            isJumping = false;
            onPlatform = true;
        }
    });

    return onPlatform;
}

function updateCharacter() {
    // Handle horizontal movement
    if (keys.left) velocityX -= moveSpeed;
    if (keys.right) velocityX += moveSpeed;

    // Apply friction
    velocityX *= friction;

    // Update position
    posX += velocityX;

    // Bound checking
    const maxX = gameArea.clientWidth - character.clientWidth;
    posX = Math.max(0, Math.min(posX, maxX));

    // Apply gravity
    velocityY += gravity;
    posY += velocityY;

    // Ground collision
    const maxY = gameArea.clientHeight - character.clientHeight;
    if (posY >= maxY) {
        posY = maxY;
        velocityY = 0;
        isJumping = false;
    }

    // Check platform collisions
    checkPlatformCollisions();

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