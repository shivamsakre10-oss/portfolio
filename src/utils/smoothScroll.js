import { getLenis } from "./lenis";

/**
 * Universal smooth scrolling utility powered by Lenis.
 * Seamlessly handles element IDs, hash strings (e.g., "#about"),
 * DOM elements, responsive navbar offsets, completion callbacks,
 * and prefers-reduced-motion accessibility compliance across the full website.
 */
export const smoothScrollTo = (target, options = {}) => {
  if (typeof window === "undefined") return;

  const {
    offset = window.innerWidth < 768 ? 76 : 84,
    callback,
    updateHash = true,
  } = options;

  let targetId = "";

  if (typeof target === "string") {
    targetId = target.startsWith("#") ? target.slice(1) : target;
  } else if (target instanceof HTMLElement) {
    targetId = target.id;
  }

  const lenis = getLenis();
  const prefersReducedMotion =
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches || false;

  // Handle scrolling to top/home
  if (targetId === "home" || targetId === "" || target === 0) {
    if (lenis) {
      lenis.scrollTo(0, {
        duration: prefersReducedMotion ? 0 : 1.15,
        immediate: prefersReducedMotion,
        onComplete: callback,
      });
    } else {
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
      if (callback) {
        setTimeout(callback, 450);
      }
    }

    if (updateHash && window.history.pushState) {
      window.history.pushState(null, "", "#home");
    }
    return;
  }

  // Resolve aliases if an element isn't found under its primary alias
  let resolvedId = targetId;
  if (!document.getElementById(resolvedId)) {
    if (resolvedId === "projects" && document.getElementById("work")) {
      resolvedId = "work";
    } else if (resolvedId === "work" && document.getElementById("projects")) {
      resolvedId = "projects";
    } else if (resolvedId === "services" && document.getElementById("capabilities")) {
      resolvedId = "capabilities";
    } else if (resolvedId === "capabilities" && document.getElementById("services")) {
      resolvedId = "services";
    } else if (resolvedId === "process" && document.getElementById("development-process")) {
      resolvedId = "development-process";
    }
  }

  const targetElement = document.getElementById(resolvedId);
  if (!targetElement) return;

  if (lenis) {
    lenis.scrollTo(targetElement, {
      offset: -offset,
      duration: prefersReducedMotion ? 0 : 1.15,
      immediate: prefersReducedMotion,
      onComplete: callback,
    });
  } else {
    const targetY = Math.max(
      0,
      window.pageYOffset + targetElement.getBoundingClientRect().top - offset
    );
    window.scrollTo({
      top: targetY,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
    if (callback) {
      setTimeout(callback, 450);
    }
  }

  if (updateHash && window.history.pushState) {
    window.history.pushState(null, "", `#${targetId}`);
  }
};
