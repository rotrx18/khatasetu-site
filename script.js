// ============================================
// KhataSetu Production Script (FINAL UNIVERSAL FIX)
// ============================================

// ================= COMPONENT LOADER (IMPROVED) =================
function loadComponent(id, file, callback){
  const el = document.getElementById(id);
  if(!el) return;

  // Use a leading slash to fetch from the root of the domain
  const path = file.startsWith('/') ? file : '/' + file;

  fetch(path)
    .then(res => {
      if(!res.ok){
        console.error("❌ Not found:", path);
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
  const el = document.getElementById("year");
  if(el){
    el.textContent = new Date().getFullYear();
  }
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
            behavior: "smooth"
          });
        }
      }
    });
  });
}

// ================= INIT =================
document.addEventListener("DOMContentLoaded", ()=>{

  console.log("📍 Base:", getBasePath());

  // Navbar
  loadComponent("navbar", "navbar.html", ()=>{
    initDarkMode();
  });

  // Footer
  loadComponent("footer", "footer.html", ()=>{
    setYear();
  });

  // Features
  lazyLoadImages();
  smoothScroll();

});