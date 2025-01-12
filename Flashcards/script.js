// Flashcard data
const flashcardsData = [
  { front: "Klein", back: "Small", isWrong: false },
  { front: "das Kind", back: "the Child", isWrong: false },
  { front: "Sein", back: "to be", isWrong: false },
  { front: "das Buch", back: "the Book", isWrong: false },
  { front: "groß", back: "Big", isWrong: false },
  { front: "schreiben", back: "to Write", isWrong: false },
  { front: "gut", back: "Good", isWrong: false },
  { front: "die Schwester", back: "the Sister", isWrong: false },
  { front: "leben", back: "to Live", isWrong: false },
  { front: "das Auto", back: "the Car", isWrong: false }
];

let currentIndex = 0; // Track the current flashcard

// Function to render a single flashcard
function renderFlashcard(index) {
  const flashcardContainer = document.querySelector('.flashcard-container');
  flashcardContainer.innerHTML = ''; // Clear previous flashcard

  const flashcard = document.createElement('div');
  flashcard.classList.add('flashcard');
  if (flashcardsData[index].isWrong) {
    flashcard.classList.add('wrong'); // Highlight wrong cards
  }

  const cardFront = document.createElement('div');
  cardFront.classList.add('card-front');
  cardFront.textContent = flashcardsData[index].front;

  const cardBack = document.createElement('div');
  cardBack.classList.add('card-back');
  cardBack.textContent = flashcardsData[index].back;

  flashcard.appendChild(cardFront);
  flashcard.appendChild(cardBack);

  flashcard.addEventListener('click', function () {
    flashcard.classList.toggle('flipped');
  });

  flashcardContainer.appendChild(flashcard);
}

// Render the first flashcard
renderFlashcard(currentIndex);

// Add navigation functionality
document.getElementById('prev-btn').addEventListener('click', function () {
  currentIndex = (currentIndex - 1 + flashcardsData.length) % flashcardsData.length;
  renderFlashcard(currentIndex);
});

document.getElementById('next-btn').addEventListener('click', function () {
  currentIndex = (currentIndex + 1) % flashcardsData.length;
  renderFlashcard(currentIndex);
});

// Function to shuffle flashcards
function shuffleFlashcards() {
  for (let i = flashcardsData.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [flashcardsData[i], flashcardsData[j]] = [flashcardsData[j], flashcardsData[i]];
  }
  currentIndex = 0;
  renderFlashcard(currentIndex);
  populateDropdown();
}

document.getElementById('shuffle-btn').addEventListener('click', shuffleFlashcards);

// Function to mark the current card as wrong
function markAsWrong() {
  flashcardsData[currentIndex].isWrong = !flashcardsData[currentIndex].isWrong; // Toggle wrong status
  renderFlashcard(currentIndex);
  populateDropdown();
}

document.getElementById('mark-wrong-btn').addEventListener('click', markAsWrong);

// Populate dropdown menu
function populateDropdown() {
  const dropdownMenu = document.getElementById('dropdown-menu');
  dropdownMenu.innerHTML = ''; // Clear existing mini cards

  flashcardsData.forEach((card, index) => {
    const miniCard = document.createElement('div');
    miniCard.classList.add('mini-card');
    miniCard.textContent = card.front;

    if (card.isWrong) {
      miniCard.classList.add('wrong'); // Highlight wrong cards
    }

    miniCard.addEventListener('click', () => {
      currentIndex = index;
      renderFlashcard(currentIndex);
      toggleDropdown();
    });

    dropdownMenu.appendChild(miniCard);
  });
}

// Toggle dropdown menu visibility
function toggleDropdown() {
  const dropdownMenu = document.getElementById('dropdown-menu');
  dropdownMenu.classList.toggle('visible');
}

document.getElementById('dropdown-btn').addEventListener('click', toggleDropdown);

// Populate the dropdown menu initially
populateDropdown();
