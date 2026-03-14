// ============================================
// KhataSetu Production Script
// ============================================

document.addEventListener("DOMContentLoaded", function () {

  // ============================================
  // 🌙 Dark Mode Toggle
  // ============================================

  const themeToggle = document.getElementById("themeToggle");
  const savedTheme = localStorage.getItem("theme");

  // Load saved theme
  if (savedTheme === "dark") {
    document.body.classList.add("dark");
  }

  if (themeToggle) {

    // set initial icon
    if (document.body.classList.contains("dark")) {
      themeToggle.textContent = "☀️";
    } else {
      themeToggle.textContent = "🌙";
    }

    themeToggle.addEventListener("click", function () {

      document.body.classList.toggle("dark");

      if (document.body.classList.contains("dark")) {
        localStorage.setItem("theme", "dark");
        themeToggle.textContent = "☀️";
      } else {
        localStorage.setItem("theme", "light");
        themeToggle.textContent = "🌙";
      }

    });

  }


  // ============================================
  // 🚀 Smooth Anchor Scroll
  // ============================================

  const anchors = document.querySelectorAll('a[href^="#"]');

  anchors.forEach(anchor => {

    anchor.addEventListener("click", function (e) {

      const targetID = this.getAttribute("href");

      if (targetID.length > 1) {

        const target = document.querySelector(targetID);

        if (target) {

          e.preventDefault();

          target.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });

        }

      }

    });

  });

});