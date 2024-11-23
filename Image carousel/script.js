let currentIndex = 0;
const images = document.querySelectorAll(".carousel-item");

function showImage(index) {
    images.forEach((image) => {
        image.classList.remove("active");
    });
    images[index].classList.add("active");
}

function prevImage() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    showImage(currentIndex);
}

function nextImage() {
    currentIndex = (currentIndex + 1) % images.length;
    showImage(currentIndex);
}
