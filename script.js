// ============================================
// KhataSetu Production Script (ULTIMATE FINAL)
// ============================================

// ================= COMPONENT LOADER =================
function loadComponent(id, file, callback){
  const el = document.getElementById(id);
  if(!el) return;

  fetch(file)
    .then(res => {
      if(!res.ok){
        console.error("❌ File not found:", file);
        return "";
      }
      return res.text();
    })
    .then(data => {
      el.innerHTML = data;

      if(callback) callback();
    })
    .catch(err => console.error("❌ Load error:", err));
}

// ================= AUTO YEAR =================
function setYear(){
  const yearEl = document.getElementById("year");

  if(yearEl){
    yearEl.textContent = new Date().getFullYear();
  }
}

// ================= BASE PATH DETECTOR =================
function getBasePath(){
  const path = window.location.pathname;

  // remove empty values
  const segments = path.split("/").filter(Boolean);

  let depth = segments.length;

  // remove index.html from depth
  if(path.endsWith("index.html")){
    depth -= 1;
  }

  let base = "";

  for(let i = 1; i < depth; i++){
    base += "../";
  }

  return base;
}

// ================= LAZY LOAD =================
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
    images.forEach(img=>{
      img.src = img.dataset.src;
      img.removeAttribute("data-src");
    });
  }
}

// ================= DARK MODE =================
function initDarkMode(){
  const toggle = document.getElementById("themeToggle");
  const saved = localStorage.getItem("theme");

  if(saved === "dark"){
    document.body.classList.add("dark");
  }

  if(toggle){
    toggle.textContent =
      document.body.classList.contains("dark") ? "☀️" : "🌙";

    toggle.addEventListener("click", ()=>{
      document.body.classList.toggle("dark");

      if(document.body.classList.contains("dark")){
        localStorage.setItem("theme","dark");
        toggle.textContent = "☀️";
      } else {
        localStorage.setItem("theme","light");
        toggle.textContent = "🌙";
      }
    });
  }
}

// ================= SMOOTH SCROLL =================
function smoothScroll(){
  document.querySelectorAll('a[href^="#"]').forEach(anchor=>{
    anchor.addEventListener("click", function(e){
      const id = this.getAttribute("href");

      if(id.length > 1){
        const target = document.querySelector(id);

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

  const base = getBasePath();

  console.log("✅ Base path:", base);

  // Load components
  loadComponent("navbar", base + "navbar.html", ()=>{
    initDarkMode(); // after navbar loads
  });

  loadComponent("footer", base + "footer.html", ()=>{
    setYear();
  });

  // Features
  lazyLoadImages();
  smoothScroll();

});