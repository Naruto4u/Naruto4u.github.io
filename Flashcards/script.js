// Flashcard data
const flashcardsData = [
  { front: "Klein", back: "Small" },
  { front: "das Kind", back: "the Child" },
  { front: "Sein", back: "to be" },
  { front: "das Buch", back: "the Book" },
  { front: "groß", back: "Big" },
  { front: "schreiben", back: "to Write" },
  { front: "gut", back: "Good" },
  { front: "die Schwester", back: "the Sister" },
  { front: "leben", back: "to Live" },
  { front: "das Auto", back: "the Car" },
  { front: "die Mutter", back: "the Mother" },
  { front: "die Schule", back: "the School" },
  { front: "sehen", back: "to See" },
  { front: "lesen", back: "to Read" },
  { front: "der Bruder", back: "the Brother" },
  { front: "der Vater", back: "the Father" },
  { front: "lernen", back: "to Learn" },
  { front: "schlecht", back: "Bad" },
  { front: "haben", back: "to Have" },
  { front: "die Familie", back: "the Family" },
  { front: "essen", back: "to Eat" },
  { front: "arbeiten", back: "to Work" },
  { front: "gehen", back: "to Go" },
  { front: "die Faru", back: "the Woman" },
  { front: "sagen", back: "to Say" },
  { front: "der Mann", back: "the Man" }
];

let currentIndex = 0; // Track the current flashcard

// Function to render a single flashcard
function renderFlashcard(index) {
  const flashcardContainer = document.querySelector('.flashcard-container');
  flashcardContainer.innerHTML = ''; // Clear previous flashcard

  const flashcard = document.createElement('div');
  flashcard.classList.add('flashcard');

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
  currentIndex = 0; // Reset to the first card
  renderFlashcard(currentIndex); // Render the first card
  populateDropdown(); // Update dropdown to match the new order
}

document.getElementById('shuffle-btn').addEventListener('click', shuffleFlashcards);

// Populate dropdown menu with mini flashcards
function populateDropdown() {
  const dropdownMenu = document.getElementById('dropdown-menu');
  dropdownMenu.innerHTML = ''; // Clear existing mini cards

  flashcardsData.forEach((card, index) => {
    const miniCard = document.createElement('div');
    miniCard.classList.add('mini-card');
    miniCard.textContent = card.front;

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
