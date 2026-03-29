// ============================================
// KhataSetu Production Script (FULL SYSTEM)
// ============================================

// ================= COMPONENT LOADER =================
function loadComponent(id, file, callback){
  const el = document.getElementById(id);
  if(!el) return;

  fetch(file)
    .then(res => res.text())
    .then(data => {
      el.innerHTML = data;

      // run callback after load
      if(callback) callback();
    })
    .catch(err => console.error("Component load error:", err));
}

// ================= AUTO YEAR =================
function setYear(){
  const yearEl = document.getElementById("year");
  if(yearEl){
    yearEl.textContent = new Date().getFullYear();
  }
}

// ================= LAZY LOAD IMAGES =================
function lazyLoadImages(){
  const images = document.querySelectorAll("img[data-src]");

  if("IntersectionObserver" in window){
    const observer = new IntersectionObserver((entries, observer)=>{
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
    // fallback for old browsers
    images.forEach(img => {
      img.src = img.dataset.src;
      img.removeAttribute("data-src");
    });
  }
}

// ================= DARK MODE =================
function initDarkMode(){

  const themeToggle = document.getElementById("themeToggle");
  const savedTheme = localStorage.getItem("theme");

  // load saved theme
  if(savedTheme === "dark"){
    document.body.classList.add("dark");
  }

  if(themeToggle){

    // set icon
    themeToggle.textContent =
      document.body.classList.contains("dark") ? "☀️" : "🌙";

    themeToggle.addEventListener("click", ()=>{

      document.body.classList.toggle("dark");

      if(document.body.classList.contains("dark")){
        localStorage.setItem("theme", "dark");
        themeToggle.textContent = "☀️";
      }else{
        localStorage.setItem("theme", "light");
        themeToggle.textContent = "🌙";
      }

    });

  }
}

// ================= SMOOTH SCROLL =================
function smoothScroll(){
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
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

  // Load Navbar
  loadComponent("navbar", "/navbar.html");

  // Load Footer + Fix Year AFTER LOAD
  loadComponent("footer", "/footer.html", ()=>{
    setYear();
  });

  // Features
  lazyLoadImages();
  smoothScroll();

  // Delay dark mode init (after navbar loads)
  setTimeout(()=>{
    initDarkMode();
  }, 150);

});