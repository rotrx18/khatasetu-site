// HERO SLIDER
let slides = document.querySelectorAll(".slide");
let currentSlide = 0;

setInterval(() => {
  slides[currentSlide].classList.remove("active");
  currentSlide = (currentSlide + 1) % slides.length;
  slides[currentSlide].classList.add("active");
}, 3000);

// CAROUSEL
let images = document.querySelectorAll(".carousel-item");
let currentImage = 0;

setInterval(() => {
  images[currentImage].classList.remove("active");
  currentImage = (currentImage + 1) % images.length;
  images[currentImage].classList.add("active");
}, 2500);

// DARK LIGHT TOGGLE
const toggleBtn = document.getElementById("themeToggle");
toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  document.body.classList.toggle("light");
});