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

  lenis = new Lenis({
    duration: 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1.4,
    // Let inner scrollable panels (chat, terminal) scroll natively
    allowNestedScroll: true,
  });

  lenis.on("scroll", ScrollTrigger.update);

  const tick = (time) => lenis?.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);

  return () => {
    gsap.ticker.remove(tick);
    lenis?.destroy();
    lenis = null;
  };
};

export const getLenis = () => lenis;
