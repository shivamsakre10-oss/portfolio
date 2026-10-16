import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

let lenis = null;

/**
 * Initialise site-wide inertia smooth scrolling (Lenis), driven by the GSAP
 * ticker so ScrollTrigger animations stay perfectly in sync.
 * Skipped entirely when the user prefers reduced motion.
 * Returns a cleanup function.
 */
export const initLenis = () => {
  if (typeof window === "undefined" || lenis) return () => {};

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return () => {};
  }

  // Ensure html element has the lenis class so lenis.css and scroll-behavior: auto take effect
  document.documentElement.classList.add("lenis");

  lenis = new Lenis({
    // Velocity-continuous lerp inertia: glides in and out with no easing-curve
    // restarts between wheel ticks
    lerp: 0.085,
    smoothWheel: true,
    wheelMultiplier: 0.9,
    touchMultiplier: 1.4,
    // Let inner scrollable panels (chat, terminal) scroll natively
    allowNestedScroll: true,
  });

  if (typeof window !== "undefined") {
    window.lenis = lenis;
  }

  lenis.on("scroll", ScrollTrigger.update);

  const tick = (time) => lenis?.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);

  return () => {
    gsap.ticker.remove(tick);
    lenis?.destroy();
    lenis = null;
    if (typeof window !== "undefined") {
      delete window.lenis;
    }
    document.documentElement.classList.remove("lenis");
  };
};

export const getLenis = () => lenis;
