/* Logo typewriter effect */
  const logo = document.getElementById("logo");
  const text = logo.textContent;
  logo.textContent = "";

  const speed = 40; // ms per character
  let i = 0;

  function type() {
    if (i < text.length) {
      logo.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }

  type();



/* First page load nav link fade in */
document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("FirstLoadEver")) {
    document.body.classList.add("no-fade");
  } else {
    localStorage.setItem("FirstLoadEver", "true");
  }
});

/* Nav color change after scroll 10px */
document.addEventListener("scroll", () => {
  const nav = document.querySelector("nav");
  if (window.scrollY > 10) {
    nav.classList.add("scrolled");
  } else {
    nav.classList.remove("scrolled");
    nav.classList.remove("black"); // reset completely
  }
});

/* Intersection for black state */
const el = document.getElementById("black-intersection");
let wasBelow = false;

function checkIntersection() {
  if (!el) return;
  const rect = el.getBoundingClientRect();

  const top = rect.top;
  const threshold = window.innerHeight * 0.40; // 40vh line

  const isBelow = top <= threshold;
  const nav = document.querySelector("nav");

  // Crossing downward → add .black while keeping .scrolled
  if (isBelow && !wasBelow) {
    console.log("black intersection");
    nav.classList.add("black");
  }

  // Crossing upward → remove .black, keep .scrolled
  if (!isBelow && wasBelow) {
    console.log("above intersection");
    nav.classList.remove("black");
  }

  wasBelow = isBelow;
}

document.addEventListener("scroll", checkIntersection, { passive: true });
window.addEventListener("resize", checkIntersection);



//  ----------------- *** Mobile nav activator 


// Simple toggle for mobile nav
const menuToggle = document.querySelector('.mobile-nav .menu-toggle');
const mobileNav = document.querySelector('.mobile-nav');

menuToggle.addEventListener('click', () => {
  mobileNav.classList.toggle('open');
});












/* sticky text during 3d scene */
document.addEventListener("scroll", () => {
  const canvas = document.getElementById("canvas-target");
  const section = document.getElementById("three-section");

  const scrollY = window.scrollY;
  const sectionTop = section.offsetTop;
  const sectionBottom = sectionTop + section.offsetHeight;

  // Turn on after scrolling past one full viewport (100vh from the very top)
  if (scrollY >= window.innerHeight && scrollY < sectionBottom - window.innerHeight) {
    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100vh";
  } else {
    // Reset back into flow so it scrolls out naturally
    canvas.style.position = "absolute";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100vh";
  }
});
