// ===============================
// KhataSetu Production Script
// ===============================

document.addEventListener("DOMContentLoaded", function () {

  // ===============================
  // 🌙 Dark Mode Toggle
  // ===============================

  const themeToggle = document.getElementById("themeToggle");

  // Load saved theme
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark");
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
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

  // ===============================
  // 📌 Active Navbar Link Highlight
  // ===============================

  const navLinks = document.querySelectorAll(".navbar a");
  const currentPath = window.location.pathname;

  navLinks.forEach(link => {
    if (link.getAttribute("href") === currentPath) {
      link.style.color = "#2563eb";
      link.style.fontWeight = "600";
    }
  });

  // ===============================
  // 🚀 Smooth Anchor Scroll
  // ===============================

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth"
        });
      }
    });
  });

});