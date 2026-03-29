// ============================================
// KhataSetu Production Script (FINAL UNIVERSAL FIX)
// ============================================

// ================= COMPONENT LOADER =================
function loadComponent(id, file, callback){
  const el = document.getElementById(id);
  if(!el) return;

  // Force absolute path so it works from /blog/folder/index.html
  const path = file.startsWith('/') ? file : '/' + file;

  fetch(path)
    .then(res => {
      if(!res.ok) throw new Error("File not found");
      return res.text();
    })
    .then(data => {
      el.innerHTML = data;
      if(callback) callback();
    })
    .catch(err => console.error("❌ Load error for " + path, err));
}

// ================= AUTO YEAR =================
function setYear(){
  const el = document.getElementById("year");
  if(el) el.textContent = new Date().getFullYear();
}

// ================= DARK MODE =================
function initDarkMode(){
  const toggle = document.getElementById("themeToggle");
  const saved = localStorage.getItem("theme");

  if(saved === "dark") document.body.classList.add("dark");

  if(toggle){
    toggle.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
    toggle.onclick = () => {
      document.body.classList.toggle("dark");
      const isDark = document.body.classList.contains("dark");
      localStorage.setItem("theme", isDark ? "dark" : "light");
      toggle.textContent = isDark ? "☀️" : "🌙";
    };
  }
}

// ================= LAZY LOAD & SCROLL =================
function initUIHelpers(){
  // Lazy Load
  const images = document.querySelectorAll("img[data-src]");
  images.forEach(img => { img.src = img.dataset.src; });

  // Smooth Scroll
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function(e) {
      const target = document.querySelector(this.getAttribute("href"));
      if(target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
}

// ================= INIT =================
document.addEventListener("DOMContentLoaded", () => {
  // Use absolute paths with leading slashes
  loadComponent("navbar", "/navbar.html", initDarkMode);
  loadComponent("footer", "/footer.html", setYear);
  
  initUIHelpers();
});