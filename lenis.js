import Lenis from 'lenis';

// set breakpoint (you can tune this)
const BREAKPOINT = 400; // px (roughly iPhone 12 width)

// run only if screen is larger
if (window.innerWidth > BREAKPOINT) {
  const lenis = new Lenis({
    duration: 1.2,  // tweak speed
    smoothWheel: true,
    smoothTouch: false // keep native touch scroll on mobile
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);
}
