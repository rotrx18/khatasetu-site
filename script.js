// ============================================
// KhataSetu Production Script (ULTIMATE FINAL)
// ============================================

// ✅ AUTO BASE URL (WORKS EVERYWHERE)
const BASE_URL = window.location.origin + "/";

// ================= COMPONENT LOADER =================
function loadComponent(id, file, callback){
  const el = document.getElementById(id);
  if(!el) return;

  fetch(BASE_URL + file)
    .then(res => res.text())
    .then(data => {
      el.innerHTML = data;
      if(callback) callback();
    })
    .catch(err => console.error("Component load error:", err));
}

// ================= AUTO YEAR =================
function setYear(){
  const yearEl = document.getElementById("year");

  if(yearEl){
    yearEl.textContent = new Date().getFullYear();
  } else {
    // retry if footer loads late
    setTimeout(setYear, 200);
  }
}

// ================= LAZY LOAD IMAGES =================
function lazyLoadImages(){
  const images = document.querySelectorAll("img[data-src]");

  if("IntersectionObserver" in window){
    const observer = new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute("data-src");
          observer.unobserve(img);
        }
      });
    });

    images.forEach(img => observer.observe(img));
  } else {
    // fallback
    images.forEach(img=>{
      img.src = img.dataset.src;
      img.removeAttribute("data-src");
    });
  }
}

// ================= DARK MODE =================
function initDarkMode(){
  const themeToggle = document.getElementById("themeToggle");
  const savedTheme = localStorage.getItem("theme");

  // Load saved theme
  if(savedTheme === "dark"){
    document.body.classList.add("dark");
  }

  if(themeToggle){
    themeToggle.textContent =
      document.body.classList.contains("dark") ? "☀️" : "🌙";

    themeToggle.addEventListener("click", ()=>{
      document.body.classList.toggle("dark");

      if(document.body.classList.contains("dark")){
        localStorage.setItem("theme","dark");
        themeToggle.textContent = "☀️";
      } else {
        localStorage.setItem("theme","light");
        themeToggle.textContent = "🌙";
      }
    });
  }
}

// ================= SMOOTH SCROLL =================
function smoothScroll(){
  document.querySelectorAll('a[href^="#"]').forEach(anchor=>{
    anchor.addEventListener("click", function(e){
      const targetID = this.getAttribute("href");

      if(targetID.length > 1){
        const target = document.querySelector(targetID);

        if(target){
          e.preventDefault();
          target.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
        }
      }
    });
  });
}

// ================= INIT =================
document.addEventListener("DOMContentLoaded", ()=>{

  // 🔥 GLOBAL COMPONENT LOAD (NO PATH ISSUE)
  loadComponent("navbar", "navbar.html");

  loadComponent("footer", "footer.html", ()=>{
    setYear(); // ensure year works after footer load
  });

  // FEATURES
  lazyLoadImages();
  smoothScroll();

  // Delay dark mode (navbar loads first)
  setTimeout(()=>{
    initDarkMode();
  },150);

});