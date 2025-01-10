// Select the flashcard
const flashcard = document.querySelector('.flashcard');

// Add a click event listener to the flashcard
flashcard.addEventListener('click', function () {
  // Toggle the "flipped" class on the flashcard
  this.classList.toggle('flipped');
});
