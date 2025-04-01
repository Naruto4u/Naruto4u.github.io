// Get modal elements
const modal = document.getElementById("imageModal");
const modalImg = document.getElementById("modalImage");
const closeBtn = document.getElementsByClassName("close")[0];
const images = document.querySelectorAll(".image-link img");


// Add click event to all images
images.forEach(img => {
    img.addEventListener("click", function(e) {
        e.preventDefault();
        modal.style.display = "block";
        modalImg.src = this.src;
    });
});

// Close modal when clicking (X)
closeBtn.addEventListener("click", function() {
    modal.style.display = "none";
});

// Close modal when clicking outside the image
modal.addEventListener("click", function(e) {
    if (e.target === modal) {
        modal.style.display = "none";
    }
});

// Close modal with Escape key
document.addEventListener("keydown", function(e) {
    if (e.key === "Escape") {
        modal.style.display = "none";
    }
});