import { useState, useEffect, useRef } from "react";
import { smoothScrollTo } from "../utils/smoothScroll";

const NAV_ITEMS = [
  { name: "Home", anchor: "#home", id: "home", code: "01" },
  { name: "About", anchor: "#about", id: "about", code: "02" },
  { name: "Skills", anchor: "#skills", id: "skills", code: "03" },
  { name: "Experience", anchor: "#experience", id: "experience", code: "04" },
  { name: "Projects", anchor: "#projects", id: "projects", code: "05" },
  { name: "Services", anchor: "#services", id: "services", code: "06" },
];

const NavBar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navContainerRef = useRef(null);
  const itemRefs = useRef([]);

  const [indicatorStyle, setIndicatorStyle] = useState({
    left: 0,
    width: 0,
    opacity: 0,
  });

  // Entrance animation trigger
  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  // Active item index calculation
  const activeIndex = NAV_ITEMS.findIndex((item) => item.id === activeSection);

  // Scroll detection for transparent-to-subtle blur transition and active section spy
  useEffect(() => {
    let ticking = false;
    // Section tops are cached (re-measured on resize / layout growth) so the
    // scroll handler never forces a synchronous layout.
    let tops = [];

    const measure = () => {
      const base = window.scrollY;
      tops = NAV_ITEMS.map((item) => {
        const el =
          document.getElementById(item.id) ||
          (item.id === "projects" ? document.getElementById("work") : null) ||
          (item.id === "services" ? document.getElementById("capabilities") : null);
        return el ? { id: item.id, top: el.getBoundingClientRect().top + base } : null;
      }).filter(Boolean);
    };

    const update = () => {
      ticking = false;
      const scrollY = window.scrollY;
      setScrolled(scrollY > 20);

      if (scrollY < 120) {
        setActiveSection("home");
        return;
      }

      const navOffset = window.innerWidth < 768 ? 90 : 130;
      let currentId = "home";
      for (let i = 0; i < tops.length; i++) {
        if (tops[i].top - scrollY <= navOffset + 60) currentId = tops[i].id;
      }
      setActiveSection(currentId);
    };

    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    const handleResize = () => {
      measure();
      handleScroll();
    };

    measure();
    update();
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(document.body);
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Update sliding indicator position for hovered or active item
  useEffect(() => {
    const updateIndicator = () => {
      const targetIndex =
        hoveredIndex !== null
          ? hoveredIndex
          : activeIndex !== -1
          ? activeIndex
          : 0;

      const targetEl = itemRefs.current[targetIndex];
      const containerEl = navContainerRef.current;

      if (targetEl && containerEl) {
        const containerRect = containerEl.getBoundingClientRect();
        const targetRect = targetEl.getBoundingClientRect();

        setIndicatorStyle({
          left: targetRect.left - containerRect.left,
          width: targetRect.width,
          opacity: 1,
        });
      }
    };

    updateIndicator();
    const raf = requestAnimationFrame(updateIndicator);
    window.addEventListener("resize", updateIndicator);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", updateIndicator);
    };
  }, [hoveredIndex, activeIndex, mounted]);

  // Handle mobile menu body lock and escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setMobileOpen(false);
    };

    const handleResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };

    if (mobileOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }

    window.addEventListener("resize", handleResize);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", handleResize);
    };
  }, [mobileOpen]);

  // Smooth scroll handler with natural fluid easing and sticky navbar offset
  const handleNavClick = (e, anchor, id) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveSection(id);
    setMobileOpen(false);
    smoothScrollTo(anchor);
  };

  return (
    <>
      {/* FULLY TRANSPARENT NAVBAR (NO ENCLOSING RECTANGLE BOX) */}
      <header
        className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          mounted
            ? "translate-y-0 opacity-100"
            : "-translate-y-4 opacity-0"
        } ${
          scrolled
            ? "keep-blur py-3 bg-[#121318]/80 backdrop-blur-md border-b border-white/[0.05]"
            : "py-5 md:py-6 bg-transparent border-b border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between w-full">
            {/* Brand Logo */}
            <a
              href="#home"
              onClick={(e) => handleNavClick(e, "#home", "home")}
              className="flex items-center gap-2.5 group focus:outline-none"
              aria-label="Shivam Sakre"
            >
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#00f0ff]/10 border border-[#00f0ff]/30 group-hover:border-[#00f0ff] group-hover:shadow-[0_0_14px_rgba(0,240,255,0.45)] transition-all duration-300">
                <span className="font-code-md text-xs font-black text-[#00f0ff] tracking-tight group-hover:scale-110 transition-transform duration-300">
                  SS
                </span>
              </span>
              <span className="font-code-md text-sm sm:text-base font-bold tracking-wider text-[#00f0ff] group-hover:text-white transition-colors duration-300">
                SHIVAM SAKRE
              </span>
            </a>

            {/* Desktop Navigation Links — Pure Transparent With Dynamic Active/Hover Pill */}
            <nav
              ref={navContainerRef}
              onMouseLeave={() => setHoveredIndex(null)}
              className="hidden md:flex relative items-center gap-1 bg-transparent"
              aria-label="Main Navigation"
            >
              {/* Dynamic Sliding Pill Indicator */}
              <span
                className="absolute top-1 bottom-1 rounded-full bg-[#00f0ff]/15 border border-[#00f0ff]/30 shadow-[0_0_15px_rgba(0,240,255,0.25)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none"
                style={{
                  transform: `translateX(${indicatorStyle.left}px)`,
                  width: `${indicatorStyle.width}px`,
                  opacity: indicatorStyle.opacity,
                }}
              />

              {NAV_ITEMS.map((item, idx) => {
                const isActive = activeSection === item.id;
                const isHovered = hoveredIndex === idx;

                return (
                  <a
                    key={item.id}
                    ref={(el) => (itemRefs.current[idx] = el)}
                    href={item.anchor}
                    onClick={(e) => handleNavClick(e, item.anchor, item.id)}
                    onMouseEnter={() => setHoveredIndex(idx)}
                    className={`relative px-3.5 lg:px-4 py-1.5 rounded-full font-code-md text-xs lg:text-[13px] tracking-wide transition-all duration-200 select-none z-10 flex items-center gap-1.5 ${
                      isActive
                        ? "text-[#00f0ff] font-semibold drop-shadow-[0_0_8px_rgba(0,240,255,0.4)]"
                        : isHovered
                        ? "text-white"
                        : "text-[#b9cacb] hover:text-white"
                    }`}
                  >
                    <span>{item.name}</span>
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] shadow-[0_0_6px_#00f0ff] animate-pulse" />
                    )}
                  </a>
                );
              })}
            </nav>

            {/* Right Action Elements */}
            <div className="flex items-center gap-2.5 sm:gap-4">
              {/* Telemetry Latency Indicator */}
              <div className="hidden lg:flex items-center gap-2 font-code-sm text-xs text-[#b9cacb]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00f0ff] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00f0ff]" />
                </span>
                <span className="font-mono text-[11px] text-[#00f0ff]">14ms</span>
              </div>

              {/* Let's Talk CTA Button */}
              <a
                href="#contact"
                onClick={(e) => handleNavClick(e, "#contact", "contact")}
                className="btn-shimmer-sweep group hidden sm:inline-flex items-center gap-2.5 px-4 sm:px-5 py-2 rounded-xl font-code-md text-xs md:text-sm font-bold bg-gradient-to-r from-[#00f0ff] via-[#00dbe9] to-[#38bdf8] text-[#06070a] shadow-[0_0_20px_rgba(0,240,255,0.45),inset_0_1px_1px_rgba(255,255,255,0.6)] hover:shadow-[0_0_32px_rgba(0,240,255,0.75),0_8px_20px_rgba(0,0,0,0.5)] hover:-translate-y-0.5 active:scale-95 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] select-none"
              >
                <span className="tracking-wide">Let's Talk</span>
                <span className="material-symbols-outlined text-[17px] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]">
                  arrow_outward
                </span>
              </a>

              {/* Mobile Animated Hamburger Button */}
              <button
                type="button"
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden relative z-50 flex flex-col items-center justify-center w-10 h-10 rounded-lg text-[#00f0ff] active:scale-95 transition-all duration-200 focus:outline-none"
                aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={mobileOpen}
              >
                <span
                  className={`block w-5 h-[2px] bg-[#00f0ff] rounded-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] origin-center ${
                    mobileOpen ? "translate-y-[6px] rotate-45" : ""
                  }`}
                />
                <span
                  className={`block w-5 h-[2px] bg-[#00f0ff] rounded-full my-[4px] transition-all duration-200 ease-out ${
                    mobileOpen ? "opacity-0 scale-x-0" : ""
                  }`}
                />
                <span
                  className={`block w-5 h-[2px] bg-[#00f0ff] rounded-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] origin-center ${
                    mobileOpen ? "-translate-y-[6px] -rotate-45" : ""
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Mobile Dropdown Menu */}
          <div
            className={`md:hidden overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              mobileOpen
                ? "max-h-[460px] opacity-100 mt-3 pt-3 border-t border-white/10 pointer-events-auto"
                : "max-h-0 opacity-0 mt-0 pt-0 border-t-0 pointer-events-none"
            }`}
          >
            <div className="flex flex-col gap-1.5 pb-3">
              {NAV_ITEMS.map((item, index) => {
                const isActive = activeSection === item.id;
                return (
                  <a
                    key={item.id}
                    href={item.anchor}
                    onClick={(e) => handleNavClick(e, item.anchor, item.id)}
                    style={{
                      transitionDelay: mobileOpen ? `${index * 40}ms` : "0ms",
                    }}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl font-code-md text-sm transition-all duration-200 active:scale-[0.98] ${
                      isActive
                        ? "bg-[#00f0ff]/15 text-[#00f0ff] border border-[#00f0ff]/30 shadow-[0_0_15px_rgba(0,240,255,0.15)] font-semibold"
                        : "text-[#b9cacb] hover:text-white hover:bg-white/[0.05] border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs text-[#849495]">{item.code}</span>
                      <span>{item.name}</span>
                    </div>
                    {isActive ? (
                      <span className="flex items-center gap-1.5 text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded bg-[#00f0ff]/20 text-[#00f0ff]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] animate-ping" />
                        Active
                      </span>
                    ) : (
                      <span className="material-symbols-outlined text-[16px] text-[#849495]">
                        chevron_right
                      </span>
                    )}
                  </a>
                );
              })}

              <div className="pt-2 mt-1 border-t border-white/10 flex flex-col gap-2">
                <a
                  href="#contact"
                  onClick={(e) => handleNavClick(e, "#contact", "contact")}
                  className="btn-shimmer-sweep group w-full py-3.5 rounded-xl bg-gradient-to-r from-[#00f0ff] via-[#00dbe9] to-[#38bdf8] text-[#06070a] font-code-md text-sm font-bold flex items-center justify-center gap-2.5 shadow-[0_0_24px_rgba(0,240,255,0.45),inset_0_1px_1px_rgba(255,255,255,0.6)] active:scale-[0.98] transition-all duration-200"
                >
                  <span className="tracking-wide">Let's Talk</span>
                  <span className="material-symbols-outlined text-[19px] group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform duration-300">
                    send
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Backdrop overlay for mobile menu */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default NavBar;
