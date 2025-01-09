// Select the flashcard
cont flashcard = document.querySelector('.flashcard');

//Add a click event listener to the flashcard
.addEventListener('click', function() {

//toggle the "flipped" class on the flashcard
this.classList.toggle('flipped');
});