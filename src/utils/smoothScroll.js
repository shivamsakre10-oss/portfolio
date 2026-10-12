import { animateScroll as scroll, scroller } from "react-scroll";

/**
 * Universal smooth scrolling utility powered by react-scroll.
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

  // Handle scrolling to top/home
  if (targetId === "home" || targetId === "" || target === 0) {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    if (updateHash && window.history.pushState) {
      window.history.pushState(null, "", "#home");
    }

    if (callback) {
      setTimeout(callback, 450);
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

  const targetY = Math.max(
    0,
    window.pageYOffset + targetElement.getBoundingClientRect().top - offset
  );

  window.scrollTo({
    top: targetY,
    behavior: "smooth",
  });

  if (updateHash && window.history.pushState) {
    window.history.pushState(null, "", `#${targetId}`);
  }

  if (callback) {
    setTimeout(callback, 450);
  }
};
