import { useState, useEffect, useRef } from "react";
import HologramScene from "./components/HologramScene";
import PortfolioCopilot from "./components/PortfolioCopilot";
import NavBar from "./components/NavBar";
import StatsCard from "./components/StatsCard";
import CareerTrajectory from "./sections/CareerTrajectory";
import ShowcaseSection from "./sections/ShowcaseSection";
import CapabilitiesSection from "./sections/CapabilitiesSection";
import DevelopmentProcess from "./sections/DevelopmentProcess";
import ValueProposition from "./sections/ValueProposition";
import Terminal from "./sections/Terminal";
import ScopeEstimator from "./sections/ScopeEstimator";
import Contact from "./sections/Contact";
import Footer from "./sections/Footer";
import CyberMiddleBody from "./components/CyberMiddleBody";
import { Users, ShoppingBag, Zap } from "lucide-react";
import { smoothScrollTo } from "./utils/smoothScroll";

const ROTATING_PHRASES = [
  "Digital Experiences",
  "Websites",
  "Web Apps",
  "Interactive Interfaces",
  "Digital Products",
];

const App = () => {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [phraseAnimClass, setPhraseAnimClass] = useState("opacity-100 translate-y-0");
  const [skillFilter, setSkillFilter] = useState("all");
  const [openDrawers, setOpenDrawers] = useState({
    frontend: false,
    backend: false,
    datastores: false,
    devops: false,
  });

  const toggleDrawer = (drawerId) => {
    setOpenDrawers((prev) => ({ ...prev, [drawerId]: !prev[drawerId] }));
  };

  const progressBarRef = useRef(null);

  // 0. Enforce starting at scroll position (0, 0) on full page reload & disable auto-scroll restoration
  useEffect(() => {
    if (typeof window === "undefined") return;

    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    // Clear any previous anchor hash on full reload to prevent auto-scrolling to bottom
    if (window.location.hash) {
      window.history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search
      );
    }

    const resetScrollToTop = () => {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      if (document.documentElement) document.documentElement.scrollTop = 0;
      if (document.body) document.body.scrollTop = 0;
    };

    // Immediate instant reset
    resetScrollToTop();

    // Secondary reset after layout paint
    const rafId = requestAnimationFrame(resetScrollToTop);
    const timerId = setTimeout(resetScrollToTop, 50);

    const handlePageShow = () => {
      resetScrollToTop();
    };

    const handleBeforeUnload = () => {
      window.scrollTo(0, 0);
    };

    const handlePopState = () => {
      if (!window.location.hash) {
        resetScrollToTop();
      }
    };

    window.addEventListener("pageshow", handlePageShow);
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopState);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timerId);
      window.removeEventListener("pageshow", handlePageShow);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  // 1. Rotating headline cycle
  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseAnimClass("opacity-0 -translate-y-3");
      setTimeout(() => {
        setPhraseIndex((prev) => (prev + 1) % ROTATING_PHRASES.length);
        setPhraseAnimClass("opacity-100 translate-y-0");
      }, 300);
    }, 2800);

    return () => clearInterval(interval);
  }, []);

  // 2. Global Scroll Handler (Top Progress Bar)
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0 && progressBarRef.current) {
        const progress = (window.scrollY / totalHeight) * 100;
        progressBarRef.current.style.width = `${progress}%`;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 3. Scroll Reveal Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
          }
        });
      },
      { threshold: 0.12 }
    );

    const elements = document.querySelectorAll(".reveal-item");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // 4. Delegated smooth scroll handler for all internal anchor links across the site
  useEffect(() => {
    const handleAnchorClick = (e) => {
      const link = e.target.closest("a");
      if (!link) return;

      const href = link.getAttribute("href");
      if (!href || !href.startsWith("#") || href === "#") return;

      const targetId = href.slice(1);
      const targetElement =
        document.getElementById(targetId) ||
        (targetId === "projects" ? document.getElementById("work") : null) ||
        (targetId === "services" ? document.getElementById("capabilities") : null);

      if (targetElement || targetId === "home" || targetId === "") {
        e.preventDefault();
        smoothScrollTo(href);
      }
    };

    document.addEventListener("click", handleAnchorClick);
    return () => document.removeEventListener("click", handleAnchorClick);
  }, []);

  // 4. Card Spotlight Physics
  const handleCardMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);
  };



  return (
    <div className="bg-[#121318] text-[#e3e1e9] font-body-md antialiased selection:bg-[#00f0ff] selection:text-[#0d0e13] relative overflow-x-hidden min-h-screen">
      {/* 1. SCROLL-DRIVEN PROGRESS BAR */}
      <div
        aria-hidden="true"
        className="fixed top-0 left-0 right-0 h-1 z-[100] bg-[#0d0e13]/40 pointer-events-none"
      >
        <div
          ref={progressBarRef}
          id="scroll-progress-bar"
          className="h-full w-0 bg-gradient-to-r from-[#00f0ff] via-[#00dbe9] to-[#8b5cf6] shadow-[0_0_12px_rgba(0,240,255,0.8)] transition-all duration-75 ease-out"
        />
      </div>

      {/* Ambient Grid & Lighting */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#00f0ff]/10 blur-[130px] rounded-full" />
        <div className="absolute top-[40%] right-[-10%] w-[600px] h-[500px] bg-[#571bc1]/20 blur-[140px] rounded-full" />
        <div className="absolute bottom-[10%] left-[-5%] w-[600px] h-[450px] bg-[#00dbe9]/10 blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-cyber-grid pointer-events-none opacity-40" />
      </div>

      {/* MODERN PREMIUM RESPONSIVE NAVBAR */}
      <NavBar />

      {/* MAIN CONTENT */}
      <main className="relative z-10 pt-28">
        {/* HERO SECTION WITH SCROLL-LINKED 3D CAMERA SCENE */}
        <section
          className="relative min-h-[720px] lg:min-h-[780px] flex flex-col justify-center items-center text-center pt-6 pb-12 sm:pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden"
          id="home"
        >
          {/* Three.js 3D Background */}
          <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
            <HologramScene />
          </div>

          {/* Pill Badge */}
          <div className="relative z-10 inline-flex items-center gap-2.5 px-space-md py-space-xs rounded-full bg-[#1e1f25]/70 border border-[#00f0ff]/40 backdrop-blur-md mb-6 reveal-item is-revealed">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00f0ff] opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00f0ff]" />
            </span>
            <span className="font-code-sm text-code-sm tracking-wide text-[#00f0ff] uppercase">
              AVAILABLE FOR HIGH-IMPACT ARCHITECTURES
            </span>
          </div>

          {/* Rotating Headline */}
          <div className="relative z-10 max-w-5xl mx-auto">
            <h1 className="font-headline-lg-mobile md:font-display-xl text-3xl md:text-6xl font-bold tracking-tight text-[#e3e1e9] mb-6 leading-none reveal-item is-revealed">
              I Create{" "}
              <span
                id="rotating-text"
                className={`text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] via-[#00dbe9] to-[#d0bcff] font-bold inline-block transition-all duration-300 transform ${phraseAnimClass}`}
              >
                {ROTATING_PHRASES[phraseIndex]}
              </span>
              <br className="hidden sm:inline" /> Built For The Modern Web
            </h1>

            <p className="font-body-lg text-lg text-[#b9cacb] max-w-2xl mx-auto mb-10 leading-relaxed reveal-item is-revealed stagger-1">
              Full Stack Developer focused on clean UI, powerful functionality and seamless user experiences across mission-critical platforms.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-16 reveal-item is-revealed stagger-2">
              <a
                className="btn-shimmer-sweep group relative w-full sm:w-auto px-8 py-4 rounded-xl font-code-md text-sm font-bold tracking-wider bg-gradient-to-r from-[#00f0ff] via-[#00dbe9] to-[#38bdf8] text-[#06070a] shadow-[0_0_28px_rgba(0,240,255,0.45),inset_0_1px_1px_rgba(255,255,255,0.7),0_10px_25px_rgba(0,0,0,0.5)] hover:shadow-[0_0_45px_rgba(0,240,255,0.8),0_14px_35px_rgba(0,0,0,0.6)] hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] flex items-center justify-center gap-3 select-none"
                href="#projects"
              >
                <span>VIEW MY WORK</span>
                <span className="material-symbols-outlined text-[19px] group-hover:translate-x-1.5 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]">
                  arrow_forward
                </span>
              </a>
              <a
                className="btn-shimmer-glass group relative w-full sm:w-auto px-8 py-4 rounded-xl font-code-md text-sm font-bold tracking-wider bg-gradient-to-b from-[#1e1f25]/90 to-[#121318]/95 backdrop-blur-xl border border-white/10 hover:border-[#00f0ff]/60 text-[#e3e1e9] hover:text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.12),0_8px_24px_rgba(0,0,0,0.5)] hover:shadow-[0_0_30px_rgba(0,240,255,0.25),inset_0_1px_1px_rgba(255,255,255,0.25),0_14px_30px_rgba(0,0,0,0.6)] hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] flex items-center justify-center gap-3 select-none"
                href="#contact"
              >
                <span>LET'S CONNECT</span>
                <span className="material-symbols-outlined text-[19px] text-[#00f0ff] group-hover:scale-115 group-hover:rotate-6 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]">
                  terminal
                </span>
              </a>
            </div>
          </div>

          {/* Separate Floating Premium Statistics Cards */}
          <div className="relative z-10 w-full max-w-5xl mx-auto mt-10 sm:mt-14 pt-2 grid grid-cols-1 sm:grid-cols-3 gap-5 md:gap-6 reveal-item is-revealed stagger-3 text-left">
            <StatsCard
              title="Years Experience"
              value="4+"
              icon={Users}
              gradient="bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-[0_0_24px_rgba(6,182,212,0.35)]"
            />
            <StatsCard
              title="Projects Delivered"
              value="4"
              icon={ShoppingBag}
              gradient="bg-gradient-to-tr from-purple-500 to-indigo-600 shadow-[0_0_24px_rgba(168,85,247,0.35)]"
            />
            <StatsCard
              title="Uptime SLA"
              value="99.9%"
              icon={Zap}
              gradient="bg-gradient-to-tr from-emerald-500 to-teal-600 shadow-[0_0_24px_rgba(16,185,129,0.35)]"
            />
          </div>
        </section>

        {/* ========================================================
            MIDDLE BODY CYBERPUNK BACKGROUND WRAPPER
            Starts immediately after Hero, ends immediately before Footer
            Continuous Dark Cyberpunk Grid, Ambient Radial Glow & Embers
            ======================================================== */}
        <CyberMiddleBody>
          {/* WHO I AM (ABOUT STORY) */}
          <section className="scroll-mt-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="about">
          {/* Eyebrow Telemetry Badge */}
          <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-lg bg-[#0d121d]/80 border border-[#3b494b]/40 mb-4 backdrop-blur-sm reveal-item is-revealed">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00f2fe] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00f2fe]" />
            </span>
            <span className="font-code-sm text-xs text-[#00f0ff] uppercase tracking-widest">
              [01 // IDENTITY]
            </span>
            <span className="text-[#849495] font-code-sm text-xs pl-2 border-l border-[#3b494b]/40">
              STATUS: NOMINAL
            </span>
          </div>

          <h2 className="font-headline-lg text-3xl md:text-5xl font-bold text-[#e3e1e9] mb-12 reveal-item stagger-1 is-revealed">
            Who I Am
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Story Card */}
            <div className="lg:col-span-6 flex flex-col justify-between p-space-xl rounded-xl bg-[#1a1b21]/70 border border-[#3b494b]/30 backdrop-blur-md reveal-item stagger-2 shadow-lg is-revealed">
              <div className="space-y-6">
                <h3 className="font-headline-sm text-2xl font-semibold text-[#dbfcff]">
                  Building Modern Web Experiences With Scalable Full-Stack Technologies.
                </h3>
                <p className="text-[#b9cacb] leading-relaxed">
                  I am a Full Stack Developer with hands-on experience building responsive web applications using React.js, Node.js, Express.js, and MongoDB. I enjoy transforming ideas into reliable, user-friendly digital experiences through modern web technologies.
                </p>
                <p className="text-[#b9cacb] leading-relaxed">
                  My experience includes developing RESTful APIs, implementing JWT-based authentication, designing database schemas, integrating frontend interfaces with backend services, and building complete web applications. I focus on writing maintainable code and developing efficient, responsive solutions.
                </p>
                <p className="text-[#b9cacb] leading-relaxed">
                  I have worked on e-commerce applications, freelancer marketplace platforms, and online quiz systems. I am also familiar with Python, Java, SQL databases, Git, GitHub, and Postman. I am passionate about learning new technologies, solving problems, and continuously improving my development skills.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#3b494b]/30">
                  <div>
                    <span className="block font-code-sm text-xs text-[#849495]">LOCATION</span>
                    <span className="font-code-md text-sm text-[#e3e1e9]">
                      Ahmedabad, Gujarat, India
                    </span>
                  </div>
                  <div>
                    <span className="block font-code-sm text-xs text-[#849495]">PRIMARY DOMAIN</span>
                    <span className="font-code-md text-sm text-[#00f0ff]">
                      Full-Stack Development · MERN Stack · REST APIs
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-8">
                <a
                  className="btn-shimmer-glass group inline-flex items-center gap-3 px-6 py-3.5 rounded-xl bg-gradient-to-b from-[#292a2f]/90 to-[#1a1b21]/95 backdrop-blur-xl border border-white/15 hover:border-[#00f0ff]/60 text-[#e3e1e9] hover:text-white font-code-md text-xs sm:text-sm font-bold tracking-wider shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),0_8px_20px_rgba(0,0,0,0.4)] hover:shadow-[0_0_30px_rgba(0,240,255,0.28),inset_0_1px_1px_rgba(255,255,255,0.25),0_12px_28px_rgba(0,0,0,0.5)] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] select-none"
                  href="/Shivam_Sakre_Resume.pdf"
                  download="Shivam_Sakre_Resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="material-symbols-outlined text-[20px] text-[#00f0ff] group-hover:translate-y-1 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]">
                    download
                  </span>
                  <span>DOWNLOAD RESUME (PDF)</span>
                </a>
              </div>
            </div>

            {/* Diagnostic Terminal Card */}
            <div className="lg:col-span-6 rounded-xl bg-[#0d0e13] border border-[#3b494b]/40 overflow-hidden shadow-2xl flex flex-col reveal-item stagger-3 is-revealed">
              <div className="flex items-center justify-between px-space-md py-space-sm bg-[#1e1f25] border-b border-[#3b494b]/30">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#93000a]" />
                  <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 font-code-sm text-xs text-[#b9cacb] font-medium">
                    ~/portfolio/developer_profile.json
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs font-code-sm text-[#849495]">
                  <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-pulse" />
                  <span>LIVE REPL</span>
                </div>
              </div>

              <div className="p-space-lg font-code-sm text-xs overflow-x-auto leading-relaxed flex-1 bg-[#0d0e13] flex flex-col justify-between">
                <div>
                  <p className="text-[#3b494b] mb-2">// Executing runtime environmental diagnostics...</p>
                  <p className="text-[#00f0ff] mb-4">
                    <span className="text-[#d0bcff]">$</span> cat developer_profile.json
                  </p>
                  <pre className="text-[#b9cacb] font-code-sm text-xs leading-6">
                    <code>
                      {`{\n`}
                      {'  '}<span className="text-[#00f0ff]">"name"</span>: <span className="text-[#dbfcff]">"Shivam Sakre"</span>,{'\n'}
                      {'  '}<span className="text-[#00f0ff]">"role"</span>: <span className="text-[#dbfcff]">"Full Stack Developer"</span>,{'\n'}
                      {'  '}<span className="text-[#00f0ff]">"stack"</span>: [{'\n'}
                      {'    '}<span className="text-[#dbfcff]">"React.js"</span>,{'\n'}
                      {'    '}<span className="text-[#dbfcff]">"Node.js"</span>,{'\n'}
                      {'    '}<span className="text-[#dbfcff]">"Express.js"</span>,{'\n'}
                      {'    '}<span className="text-[#dbfcff]">"MongoDB"</span>{'\n'}
                      {'  '}{`],\n`}
                      {'  '}<span className="text-[#00f0ff]">"skills"</span>: [{'\n'}
                      {'    '}<span className="text-[#dbfcff]">"JavaScript"</span>,{'\n'}
                      {'    '}<span className="text-[#dbfcff]">"Python"</span>,{'\n'}
                      {'    '}<span className="text-[#dbfcff]">"Java"</span>{'\n'}
                      {'  '}{`],\n`}
                      {'  '}<span className="text-[#00f0ff]">"projects"</span>: [{'\n'}
                      {'    '}<span className="text-[#dbfcff]">"SB Work"</span>,{'\n'}
                      {'    '}<span className="text-[#dbfcff]">"Online Quiz App"</span>{'\n'}
                      {'  '}{`],\n`}
                      {'  '}<span className="text-[#00f0ff]">"status"</span>: <span className="text-[#dbfcff]">"Available for Opportunities"</span>{'\n'}
                      {`}`}
                    </code>
                  </pre>
                </div>
                <div className="mt-4 pt-4 border-t border-[#3b494b]/30 flex items-center justify-between text-[#849495]">
                  <span>Ready for pipeline injection</span>
                  <span className="text-[#00f0ff]">200 OK</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SKILLS ECOSYSTEM SECTION */}
        <section className="scroll-mt-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="skills">
          {/* Eyebrow Telemetry Badge */}
          <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-lg bg-[#0d121d]/80 border border-[#3b494b]/40 mb-4 backdrop-blur-sm reveal-item is-revealed">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00f2fe] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00f2fe]" />
            </span>
            <span className="font-code-sm text-xs text-[#00f0ff] uppercase tracking-widest">
              [02 // TECH ARSENAL &amp; CORE COMPETENCIES]
            </span>
            <span className="text-[#849495] font-code-sm text-xs pl-2 border-l border-[#3b494b]/40">
              STATUS: NOMINAL
            </span>
          </div>

          {/* Main Headline Cluster */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#3b494b]/30 reveal-item is-revealed stagger-1">
            <div>
              <h2 className="font-headline-lg text-3xl md:text-5xl font-bold text-[#dbfcff] tracking-tight bg-gradient-to-r from-white via-[#dbfcff] to-[#849495] bg-clip-text text-transparent">
                Skills Ecosystem
              </h2>
              <p className="font-body-md text-base md:text-lg text-[#b9cacb] max-w-3xl mt-3 leading-relaxed">
                A practical technology stack for building responsive web applications, REST APIs, and complete full-stack solutions.
              </p>
            </div>
            {/* Quick Telemetry Beacon */}
            <div className="hidden xl:flex flex-col items-end gap-1 font-code-sm text-xs text-[#849495]">
              <span className="text-[#00f0ff] font-semibold">[ BUFFER: LOCKED // 60 FPS ]</span>
              <span>CLOCK_DRIFT: +0.002ms</span>
            </div>
          </div>

          {/* System Telemetry Summary Bar (4 Stat Capsules) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6 reveal-item is-revealed stagger-2">
            <div className="bg-[#0d121d]/70 border border-[#3b494b]/35 rounded-xl p-4 flex items-center justify-between backdrop-blur-sm">
              <div>
                <span className="font-code-sm text-[11px] text-[#849495] block mb-1 tracking-wider uppercase">CORE SKILLS</span>
                <span className="font-headline-sm text-base md:text-lg font-semibold text-[#dbfcff] tracking-tight">Full Stack Development</span>
              </div>
              <span className="material-symbols-outlined text-[#00f0ff] opacity-80 text-[26px]">terminal</span>
            </div>
            <div className="bg-[#0d121d]/70 border border-[#3b494b]/35 rounded-xl p-4 flex items-center justify-between backdrop-blur-sm">
              <div>
                <span className="font-code-sm text-[11px] text-[#849495] block mb-1 tracking-wider uppercase">FRONTEND</span>
                <span className="font-headline-sm text-base md:text-lg font-semibold text-[#00f0ff] tracking-tight">React.js, HTML, CSS</span>
              </div>
              <span className="material-symbols-outlined text-[#00f0ff] opacity-80 text-[26px]">layers</span>
            </div>
            <div className="bg-[#0d121d]/70 border border-[#3b494b]/35 rounded-xl p-4 flex items-center justify-between backdrop-blur-sm">
              <div>
                <span className="font-code-sm text-[11px] text-[#849495] block mb-1 tracking-wider uppercase">BACKEND</span>
                <span className="font-headline-sm text-base md:text-lg font-semibold text-[#d0bcff] tracking-tight">Node.js, Express.js</span>
              </div>
              <span className="material-symbols-outlined text-[#d0bcff] opacity-80 text-[26px]">dns</span>
            </div>
            <div className="bg-[#0d121d]/70 border border-[#3b494b]/35 rounded-xl p-4 flex items-center justify-between backdrop-blur-sm">
              <div>
                <span className="font-code-sm text-[11px] text-[#849495] block mb-1 tracking-wider uppercase">DATABASES</span>
                <span className="font-headline-sm text-base md:text-lg font-semibold text-[#dbfcff] tracking-tight">MongoDB, MySQL, PostgreSQL</span>
              </div>
              <span className="material-symbols-outlined text-[#00f0ff] opacity-80 text-[26px]">database</span>
            </div>
          </div>

          {/* Interactive Category Filter Tab Bar */}
          <div className="my-8 reveal-item is-revealed stagger-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-2.5 sm:p-2 rounded-xl bg-[#0d121d]/90 border border-[#3b494b]/40 backdrop-blur-md shadow-[0_10px_25px_rgba(0,0,0,0.4)]">
              {/* Filter Tabs Group */}
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2" role="tablist">
                {/* Tab 0: ALL */}
                <button
                  type="button"
                  onClick={() => setSkillFilter("all")}
                  className={`filter-tab relative group px-3.5 sm:px-4 py-2 rounded-lg text-left transition-all duration-200 border flex items-center gap-2 cursor-pointer select-none ${
                    skillFilter === "all"
                      ? "active bg-[#00f0ff]/12 border-[#00f0ff]/70 text-[#dbfcff] shadow-[0_0_16px_rgba(0,240,255,0.25)]"
                      : "border-[#3b494b]/30 bg-[#121318]/60 hover:border-[#00f0ff]/50 hover:bg-[#1a1b21] text-[#b9cacb]"
                  }`}
                >
                  <span className={`tab-index font-code-sm text-xs tracking-widest ${skillFilter === "all" ? "text-[#00f0ff]" : "text-[#849495] group-hover:text-[#00f0ff]"}`}>[00]</span>
                  <span className="font-code-md text-xs sm:text-sm tracking-wider uppercase font-semibold">ALL</span>
                  <span className="text-[10px] font-code-sm px-1.5 py-0.5 rounded bg-[#1e1f25] text-[#849495] group-hover:text-[#00f0ff] border border-white/10 ml-1">4</span>
                  {skillFilter === "all" && (
                    <span className="active-indicator absolute -bottom-[1px] left-3 right-3 h-[2px] bg-[#00f0ff] rounded shadow-[0_0_8px_#00f0ff]" />
                  )}
                </button>

                {/* Tab 1: FRONTEND */}
                <button
                  type="button"
                  onClick={() => setSkillFilter("frontend")}
                  className={`filter-tab relative group px-3.5 sm:px-4 py-2 rounded-lg text-left transition-all duration-200 border flex items-center gap-2 cursor-pointer select-none ${
                    skillFilter === "frontend"
                      ? "active bg-[#00f0ff]/12 border-[#00f0ff]/70 text-[#dbfcff] shadow-[0_0_16px_rgba(0,240,255,0.25)]"
                      : "border-[#3b494b]/30 bg-[#121318]/60 hover:border-[#00f0ff]/50 hover:bg-[#1a1b21] text-[#b9cacb]"
                  }`}
                >
                  <span className={`tab-index font-code-sm text-xs tracking-widest ${skillFilter === "frontend" ? "text-[#00f0ff]" : "text-[#849495] group-hover:text-[#00f0ff]"}`}>[01]</span>
                  <span className="font-code-md text-xs sm:text-sm tracking-wider uppercase font-semibold">FRONTEND</span>
                  <span className="text-[10px] font-code-sm px-1.5 py-0.5 rounded bg-[#1e1f25] text-[#849495] group-hover:text-[#00f0ff] border border-white/10 ml-1">1</span>
                  {skillFilter === "frontend" && (
                    <span className="active-indicator absolute -bottom-[1px] left-3 right-3 h-[2px] bg-[#00f0ff] rounded shadow-[0_0_8px_#00f0ff]" />
                  )}
                </button>

                {/* Tab 2: BACKEND */}
                <button
                  type="button"
                  onClick={() => setSkillFilter("backend")}
                  className={`filter-tab relative group px-3.5 sm:px-4 py-2 rounded-lg text-left transition-all duration-200 border flex items-center gap-2 cursor-pointer select-none ${
                    skillFilter === "backend"
                      ? "active bg-[#d0bcff]/12 border-[#d0bcff]/70 text-[#e9ddff] shadow-[0_0_16px_rgba(208,188,255,0.25)]"
                      : "border-[#3b494b]/30 bg-[#121318]/60 hover:border-[#d0bcff]/50 hover:bg-[#1a1b21] text-[#b9cacb]"
                  }`}
                >
                  <span className={`tab-index font-code-sm text-xs tracking-widest ${skillFilter === "backend" ? "text-[#d0bcff]" : "text-[#849495] group-hover:text-[#d0bcff]"}`}>[02]</span>
                  <span className="font-code-md text-xs sm:text-sm tracking-wider uppercase font-semibold">BACKEND</span>
                  <span className="text-[10px] font-code-sm px-1.5 py-0.5 rounded bg-[#1e1f25] text-[#849495] group-hover:text-[#d0bcff] border border-white/10 ml-1">1</span>
                  {skillFilter === "backend" && (
                    <span className="active-indicator absolute -bottom-[1px] left-3 right-3 h-[2px] bg-[#d0bcff] rounded shadow-[0_0_8px_#d0bcff]" />
                  )}
                </button>

                {/* Tab 3: DATABASES */}
                <button
                  type="button"
                  onClick={() => setSkillFilter("databases")}
                  className={`filter-tab relative group px-3.5 sm:px-4 py-2 rounded-lg text-left transition-all duration-200 border flex items-center gap-2 cursor-pointer select-none ${
                    skillFilter === "databases"
                      ? "active bg-[#00f0ff]/12 border-[#00f0ff]/70 text-[#dbfcff] shadow-[0_0_16px_rgba(0,240,255,0.25)]"
                      : "border-[#3b494b]/30 bg-[#121318]/60 hover:border-[#00f0ff]/50 hover:bg-[#1a1b21] text-[#b9cacb]"
                  }`}
                >
                  <span className={`tab-index font-code-sm text-xs tracking-widest ${skillFilter === "databases" ? "text-[#00f0ff]" : "text-[#849495] group-hover:text-[#00f0ff]"}`}>[03]</span>
                  <span className="font-code-md text-xs sm:text-sm tracking-wider uppercase font-semibold">DATABASES</span>
                  <span className="text-[10px] font-code-sm px-1.5 py-0.5 rounded bg-[#1e1f25] text-[#849495] group-hover:text-[#00f0ff] border border-white/10 ml-1">1</span>
                  {skillFilter === "databases" && (
                    <span className="active-indicator absolute -bottom-[1px] left-3 right-3 h-[2px] bg-[#00f0ff] rounded shadow-[0_0_8px_#00f0ff]" />
                  )}
                </button>

                {/* Tab 4: DEV TOOLS */}
                <button
                  type="button"
                  onClick={() => setSkillFilter("tools")}
                  className={`filter-tab relative group px-3.5 sm:px-4 py-2 rounded-lg text-left transition-all duration-200 border flex items-center gap-2 cursor-pointer select-none ${
                    skillFilter === "tools"
                      ? "active bg-[#d0bcff]/12 border-[#d0bcff]/70 text-[#e9ddff] shadow-[0_0_16px_rgba(208,188,255,0.25)]"
                      : "border-[#3b494b]/30 bg-[#121318]/60 hover:border-[#d0bcff]/50 hover:bg-[#1a1b21] text-[#b9cacb]"
                  }`}
                >
                  <span className={`tab-index font-code-sm text-xs tracking-widest ${skillFilter === "tools" ? "text-[#d0bcff]" : "text-[#849495] group-hover:text-[#d0bcff]"}`}>[04]</span>
                  <span className="font-code-md text-xs sm:text-sm tracking-wider uppercase font-semibold">DEV TOOLS</span>
                  <span className="text-[10px] font-code-sm px-1.5 py-0.5 rounded bg-[#1e1f25] text-[#849495] group-hover:text-[#d0bcff] border border-white/10 ml-1">1</span>
                  {skillFilter === "tools" && (
                    <span className="active-indicator absolute -bottom-[1px] left-3 right-3 h-[2px] bg-[#d0bcff] rounded shadow-[0_0_8px_#d0bcff]" />
                  )}
                </button>
              </div>

              {/* Telemetry Filter State Beacon */}
              <div className="flex items-center gap-3 px-3 py-1 font-code-sm text-xs text-[#849495] border-t sm:border-t-0 sm:border-l border-[#3b494b]/30">
                <span className="flex items-center gap-1.5 text-[#dbfcff]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] animate-pulse" />
                  <span className="text-[11px] uppercase tracking-wider font-semibold">
                    {skillFilter === "all"
                      ? "SCOPE: ALL_SECTORS"
                      : skillFilter === "frontend"
                      ? "SCOPE: FRONTEND_REACTIVE"
                      : skillFilter === "backend"
                      ? "SCOPE: BACKEND_SERVICES"
                      : skillFilter === "databases"
                      ? "SCOPE: DATA_STORES"
                      : "SCOPE: TOOLS_LANGUAGES"}
                  </span>
                </span>
                <span className="font-code-sm text-xs text-[#849495] border-l border-[#3b494b]/30 pl-2">
                  ACTIVE: {skillFilter === "all" ? "4/4" : "1/4"}
                </span>
              </div>
            </div>
          </div>

          {/* Tech Arsenal: 4 Bento Cards (2x2 on desktop) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-start">
            {/* Card 01: FRONTEND DEVELOPMENT */}
            {(skillFilter === "all" || skillFilter === "frontend") && (
              <div className="skill-card group relative bg-[#0d121d]/85 rounded-2xl border border-[#3b494b]/40 hover:border-[#00f0ff] hover:-translate-y-1.5 transition-all duration-300 p-6 md:p-8 backdrop-blur-xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.8)] hover:shadow-[0_25px_50px_-10px_rgba(0,240,255,0.22)] flex flex-col justify-between overflow-hidden">
                {/* Top subtle glow accent */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#00f0ff]/10 rounded-full blur-2xl group-hover:bg-[#00f0ff]/20 transition-all duration-500 pointer-events-none" />

                <div>
                  {/* Card Header */}
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#3b494b]/30">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#00f0ff]/10 border border-[#00f0ff]/30 flex items-center justify-center text-[#00f0ff] transition-transform group-hover:scale-105">
                        <span className="material-symbols-outlined text-[22px]">layers</span>
                      </div>
                      <div>
                        <h3 className="font-headline-sm text-lg font-semibold text-[#dbfcff] tracking-wide">
                          01. FRONTEND DEVELOPMENT
                        </h3>
                        <span className="font-code-sm text-[11px] text-[#849495] tracking-wider uppercase">
                          RESPONSIVE &amp; DYNAMIC INTERFACES
                        </span>
                      </div>
                    </div>
                    <span className="font-code-sm text-xs text-[#849495] group-hover:text-[#00f0ff] transition-colors">
                      REF // 0xFE01
                    </span>
                  </div>

                  {/* Metric Gauges with Glowing Bars */}
                  <div className="space-y-4 mb-8">
                    {/* Meter 1: React.js */}
                    <div>
                      <div className="flex justify-between items-center mb-1 font-code-sm text-xs">
                        <span className="text-[#e3e1e9]">React.js (Component Architecture &amp; Hooks)</span>
                        <span className="text-[#00f0ff] font-semibold">92%</span>
                      </div>
                      <div className="w-full bg-[#1e1f25] rounded-full h-1.5 overflow-hidden p-0.5">
                        <div className="bg-gradient-to-r from-[#00f0ff] to-[#38bdf8] h-full rounded-full shadow-[0_0_8px_#00f0ff] animate-bar-glow" style={{ width: "92%" }} />
                      </div>
                    </div>
                    {/* Meter 2: JavaScript */}
                    <div>
                      <div className="flex justify-between items-center mb-1 font-code-sm text-xs">
                        <span className="text-[#e3e1e9]">JavaScript (ES6+, DOM &amp; Async Flow)</span>
                        <span className="text-[#00f0ff] font-semibold">90%</span>
                      </div>
                      <div className="w-full bg-[#1e1f25] rounded-full h-1.5 overflow-hidden p-0.5">
                        <div className="bg-gradient-to-r from-[#00f0ff] to-[#38bdf8] h-full rounded-full shadow-[0_0_8px_#00f0ff] animate-bar-glow" style={{ width: "90%" }} />
                      </div>
                    </div>
                    {/* Meter 3: HTML & CSS */}
                    <div>
                      <div className="flex justify-between items-center mb-1 font-code-sm text-xs">
                        <span className="text-[#e3e1e9]">HTML5 &amp; CSS3 (Semantic &amp; Responsive UI)</span>
                        <span className="text-[#00f0ff] font-semibold">94%</span>
                      </div>
                      <div className="w-full bg-[#1e1f25] rounded-full h-1.5 overflow-hidden p-0.5">
                        <div className="bg-gradient-to-r from-[#00f0ff] to-[#38bdf8] h-full rounded-full shadow-[0_0_8px_#00f0ff] animate-bar-glow" style={{ width: "94%" }} />
                      </div>
                    </div>
                    {/* Meter 4: Angular */}
                    <div>
                      <div className="flex justify-between items-center mb-1 font-code-sm text-xs">
                        <span className="text-[#e3e1e9]">Angular (Framework Architecture &amp; SPA)</span>
                        <span className="text-[#00f0ff] font-semibold">80%</span>
                      </div>
                      <div className="w-full bg-[#1e1f25] rounded-full h-1.5 overflow-hidden p-0.5">
                        <div className="bg-gradient-to-r from-[#00f0ff] to-[#38bdf8] h-full rounded-full shadow-[0_0_8px_#00f0ff] animate-bar-glow" style={{ width: "80%" }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Secondary Stack Chips */}
                <div>
                  <span className="font-code-sm text-[11px] text-[#849495] block mb-2 tracking-wider uppercase">
                    SKILL BADGES &amp; TECHNOLOGIES:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {["HTML", "CSS", "JavaScript", "React.js", "Angular", "Responsive Web Design"].map((pkg) => (
                      <span key={pkg} className="px-2.5 py-1 rounded-lg bg-[#1a1b21] border border-[#3b494b]/40 text-[#b9cacb] font-code-sm text-[11px] hover:border-[#00f0ff] hover:text-[#00f0ff] transition-colors">
                        {pkg}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Interactive Expandable Project Telemetry Toggle & Drawer */}
                <div className="mt-6 pt-4 border-t border-[#3b494b]/30">
                  <button
                    type="button"
                    onClick={() => toggleDrawer("frontend")}
                    className="telemetry-drawer-toggle w-full py-2.5 px-3.5 rounded-lg bg-[#121318]/80 hover:bg-[#1a1b21] border border-[#3b494b]/40 hover:border-[#00f0ff]/60 text-left flex items-center justify-between transition-all duration-200 group/btn cursor-pointer select-none"
                  >
                    <span className="flex items-center gap-2 font-code-sm text-xs text-[#dbfcff] tracking-wide">
                      <span className="text-[#00f0ff] font-bold toggle-glyph">
                        {openDrawers.frontend ? "[-]" : "[+]"}
                      </span>
                      <span className="toggle-text uppercase font-semibold">
                        {openDrawers.frontend ? "COLLAPSE_TELEMETRY // DOSSIER ACTIVE" : "VIEW_PROD_DEPLOYMENTS // 2 RECENT REFS"}
                      </span>
                    </span>
                    <span className={`material-symbols-outlined text-[#849495] group-hover/btn:text-[#00f0ff] transition-transform duration-300 toggle-chevron text-[18px] ${openDrawers.frontend ? "is-open-chevron" : ""}`}>
                      expand_more
                    </span>
                  </button>

                  <div className={`telemetry-drawer-content ${openDrawers.frontend ? "is-open" : ""}`}>
                    <div className="drawer-inner pt-4 space-y-4">
                      {/* Reference Item A */}
                      <div className="p-3.5 rounded-xl bg-[#080b12]/90 border border-[#3b494b]/35 hover:border-[#00f0ff]/40 transition-colors">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-code-sm bg-[#00f0ff]/10 border border-[#00f0ff]/30 text-[#00f0ff]">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] animate-pulse" />
                              <span>● LIVE PROD</span>
                            </span>
                            <span className="font-headline-sm text-xs sm:text-sm font-semibold text-[#dbfcff]">SB Work - Freelancer Marketplace UI</span>
                          </div>
                          <span className="text-[10px] font-code-sm text-[#849495] border border-[#3b494b]/30 px-1.5 py-0.5 rounded">SHA-256 // b7f28a9c</span>
                        </div>
                        <p className="font-body-sm text-xs text-[#b9cacb] mb-2.5 leading-relaxed">
                          Responsive React.js interface with dynamic proposal forms, client and freelancer dashboards, and clean state coordination.
                        </p>
                        <div className="flex flex-wrap items-center gap-1.5 mb-3.5">
                          {["React.js", "JavaScript", "HTML5", "Responsive CSS"].map((t) => (
                            <span key={t} className="text-[10px] font-code-sm px-2 py-0.5 rounded bg-[#1a1b21] text-[#00f0ff] border border-[#3b494b]/30">
                              {t}
                            </span>
                          ))}
                        </div>

                        {/* Benchmark Graph: 60 FPS Frame Budget Curve */}
                        <div className="p-3 rounded-lg bg-[#121318]/70 border border-[#3b494b]/30 space-y-2">
                          <div className="flex items-center justify-between text-[11px] font-code-sm">
                            <span className="text-[#849495] uppercase flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] animate-ping" />
                              <span>BENCHMARK // 60 FPS RENDER TIMELINE</span>
                            </span>
                            <span className="text-[#00f0ff] font-semibold">[ 14.2ms AVG // SMOOTH 60FPS ]</span>
                          </div>
                          <div className="relative w-full h-16 bg-[#080b12]/90 rounded border border-[#3b494b]/30 overflow-hidden px-1 pt-1">
                            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 380 60">
                              <defs>
                                <linearGradient id="feFrameGrad" x1="0" x2="0" y1="0" y2="1">
                                  <stop offset="0%" stopColor="#00f2fe" stopOpacity="0.3" />
                                  <stop offset="100%" stopColor="#00f2fe" stopOpacity="0.0" />
                                </linearGradient>
                              </defs>
                              <line stroke="#3a494b" strokeDasharray="2 2" strokeWidth="0.75" x1="0" x2="380" y1="20" y2="20" />
                              <line stroke="#3a494b" strokeDasharray="2 2" strokeWidth="0.75" x1="0" x2="380" y1="40" y2="40" />
                              <line stroke="#ffb4ab" strokeDasharray="3 3" strokeOpacity="0.75" strokeWidth="1" x1="0" x2="380" y1="12" y2="12" />
                              <text fill="#ffb4ab" fontFamily="JetBrains Mono" fontSize="8" opacity="0.8" x="4" y="10">16.6ms BUDGET THRESHOLD</text>
                              <polygon fill="url(#feFrameGrad)" points="0,55 0,38 30,34 60,37 90,32 120,36 150,31 180,35 210,30 240,34 270,32 300,35 330,31 360,33 380,32 380,55" />
                              <path d="M 0,38 Q 30,34 60,37 T 120,36 T 180,35 T 240,34 T 300,35 T 360,33 L 380,32" fill="none" stroke="#00f0ff" strokeWidth="1.75" />
                              <circle cx="60" cy="37" fill="#00f0ff" stroke="#080b12" strokeWidth="1.5" r="3.5"><title>13.8ms @ T+10s [FRAME STABLE]</title></circle>
                              <circle cx="120" cy="36" fill="#00f0ff" stroke="#080b12" strokeWidth="1.5" r="3.5"><title>14.1ms @ T+20s [FRAME STABLE]</title></circle>
                              <circle cx="210" cy="30" fill="#00f0ff" stroke="#080b12" strokeWidth="1.5" r="3.5"><title>12.4ms @ T+35s [PEAK PERF // 72FPS]</title></circle>
                              <circle cx="300" cy="35" fill="#00f0ff" stroke="#080b12" strokeWidth="1.5" r="3.5"><title>14.2ms @ T+48s [FRAME STABLE]</title></circle>
                              <circle cx="380" cy="32" fill="#00f0ff" stroke="#080b12" strokeWidth="1.5" r="3.5"><title>13.5ms @ T+60s [STEADY BUFFER]</title></circle>
                            </svg>
                          </div>
                          <div className="flex justify-between items-center text-[10px] font-code-sm text-[#849495] pt-0.5">
                            <span>T-0ms (INIT)</span>
                            <span className="text-[#00f0ff]">LCP: FAST RENDER // SUB-100ms</span>
                            <span>T-60s (STEADY BUFFER)</span>
                          </div>
                        </div>
                      </div>

                      {/* Reference Item B */}
                      <div className="p-3.5 rounded-xl bg-[#080b12]/90 border border-[#3b494b]/35 hover:border-[#00f0ff]/40 transition-colors">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-code-sm bg-[#00f0ff]/10 border border-[#00f0ff]/30 text-[#00f0ff]">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff]" />
                              <span>DEPLOYED</span>
                            </span>
                            <span className="font-headline-sm text-xs sm:text-sm font-semibold text-[#dbfcff]">Online Quiz Web Application Interface</span>
                          </div>
                          <span className="text-[10px] font-code-sm text-[#849495] border border-[#3b494b]/30 px-1.5 py-0.5 rounded">SHA-256 // e3a91c04</span>
                        </div>
                        <p className="font-body-sm text-xs text-[#b9cacb] mb-2.5 leading-relaxed">
                          Interactive quiz experience with real-time question timers, dynamic question navigation, instant score calculation, and responsive layout.
                        </p>
                        <div className="flex flex-wrap items-center gap-1.5 mb-3.5">
                          {["React.js", "JavaScript", "HTML5", "CSS3"].map((t) => (
                            <span key={t} className="text-[10px] font-code-sm px-2 py-0.5 rounded bg-[#1a1b21] text-[#00f0ff] border border-[#3b494b]/30">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Card 02: BACKEND DEVELOPMENT */}
            {(skillFilter === "all" || skillFilter === "backend") && (
              <div className="skill-card group relative bg-[#0d121d]/85 rounded-2xl border border-[#3b494b]/40 hover:border-[#d0bcff] hover:-translate-y-1.5 transition-all duration-300 p-6 md:p-8 backdrop-blur-xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.8)] hover:shadow-[0_25px_50px_-10px_rgba(208,188,255,0.22)] flex flex-col justify-between overflow-hidden">
                {/* Top subtle glow accent */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#d0bcff]/15 rounded-full blur-2xl group-hover:bg-[#d0bcff]/25 transition-all duration-500 pointer-events-none" />

                <div>
                  {/* Card Header */}
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#3b494b]/30">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#d0bcff]/10 border border-[#d0bcff]/30 flex items-center justify-center text-[#d0bcff] transition-transform group-hover:scale-105">
                        <span className="material-symbols-outlined text-[22px]">dns</span>
                      </div>
                      <div>
                        <h3 className="font-headline-sm text-lg font-semibold text-[#dbfcff] tracking-wide">
                          02. BACKEND DEVELOPMENT
                        </h3>
                        <span className="font-code-sm text-[11px] text-[#849495] tracking-wider uppercase">
                          RESTFUL APIS &amp; SERVER ARCHITECTURE
                        </span>
                      </div>
                    </div>
                    <span className="font-code-sm text-xs text-[#849495] group-hover:text-[#d0bcff] transition-colors">
                      REF // 0xBE02
                    </span>
                  </div>

                  {/* Metric Gauges with Glowing Bars */}
                  <div className="space-y-4 mb-8">
                    {/* Meter 1: Node.js */}
                    <div>
                      <div className="flex justify-between items-center mb-1 font-code-sm text-xs">
                        <span className="text-[#e3e1e9]">Node.js (Server Runtime &amp; Event Loop)</span>
                        <span className="text-[#d0bcff] font-semibold">90%</span>
                      </div>
                      <div className="w-full bg-[#1e1f25] rounded-full h-1.5 overflow-hidden p-0.5">
                        <div className="bg-gradient-to-r from-[#d0bcff] to-[#a855f7] h-full rounded-full shadow-[0_0_8px_#d0bcff] animate-bar-glow" style={{ width: "90%" }} />
                      </div>
                    </div>
                    {/* Meter 2: Express.js */}
                    <div>
                      <div className="flex justify-between items-center mb-1 font-code-sm text-xs">
                        <span className="text-[#e3e1e9]">Express.js (Routing, Middleware &amp; APIs)</span>
                        <span className="text-[#d0bcff] font-semibold">92%</span>
                      </div>
                      <div className="w-full bg-[#1e1f25] rounded-full h-1.5 overflow-hidden p-0.5">
                        <div className="bg-gradient-to-r from-[#d0bcff] to-[#a855f7] h-full rounded-full shadow-[0_0_8px_#d0bcff] animate-bar-glow" style={{ width: "92%" }} />
                      </div>
                    </div>
                    {/* Meter 3: REST API Design */}
                    <div>
                      <div className="flex justify-between items-center mb-1 font-code-sm text-xs">
                        <span className="text-[#e3e1e9]">REST API Design (CRUD &amp; Resource Modeling)</span>
                        <span className="text-[#d0bcff] font-semibold">94%</span>
                      </div>
                      <div className="w-full bg-[#1e1f25] rounded-full h-1.5 overflow-hidden p-0.5">
                        <div className="bg-gradient-to-r from-[#d0bcff] to-[#a855f7] h-full rounded-full shadow-[0_0_8px_#d0bcff] animate-bar-glow" style={{ width: "94%" }} />
                      </div>
                    </div>
                    {/* Meter 4: JWT Authentication */}
                    <div>
                      <div className="flex justify-between items-center mb-1 font-code-sm text-xs">
                        <span className="text-[#e3e1e9]">JWT Authentication (Token Security &amp; Sessions)</span>
                        <span className="text-[#d0bcff] font-semibold">88%</span>
                      </div>
                      <div className="w-full bg-[#1e1f25] rounded-full h-1.5 overflow-hidden p-0.5">
                        <div className="bg-gradient-to-r from-[#d0bcff] to-[#a855f7] h-full rounded-full shadow-[0_0_8px_#d0bcff] animate-bar-glow" style={{ width: "88%" }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Secondary Stack Chips */}
                <div>
                  <span className="font-code-sm text-[11px] text-[#849495] block mb-2 tracking-wider uppercase">
                    SKILL BADGES &amp; TECHNOLOGIES:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {["Node.js", "Express.js", "REST APIs", "JWT Authentication", "API Middleware", "JSON"].map((pkg) => (
                      <span key={pkg} className="px-2.5 py-1 rounded-lg bg-[#1a1b21] border border-[#3b494b]/40 text-[#b9cacb] font-code-sm text-[11px] hover:border-[#d0bcff] hover:text-[#d0bcff] transition-colors">
                        {pkg}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Interactive Expandable Project Telemetry Toggle & Drawer */}
                <div className="mt-6 pt-4 border-t border-[#3b494b]/30">
                  <button
                    type="button"
                    onClick={() => toggleDrawer("backend")}
                    className="telemetry-drawer-toggle w-full py-2.5 px-3.5 rounded-lg bg-[#121318]/80 hover:bg-[#1a1b21] border border-[#3b494b]/40 hover:border-[#d0bcff]/60 text-left flex items-center justify-between transition-all duration-200 group/btn cursor-pointer select-none"
                  >
                    <span className="flex items-center gap-2 font-code-sm text-xs text-[#dbfcff] tracking-wide">
                      <span className="text-[#d0bcff] font-bold toggle-glyph">
                        {openDrawers.backend ? "[-]" : "[+]"}
                      </span>
                      <span className="toggle-text uppercase font-semibold">
                        {openDrawers.backend ? "COLLAPSE_TELEMETRY // DOSSIER ACTIVE" : "VIEW_PROD_DEPLOYMENTS // 2 RECENT REFS"}
                      </span>
                    </span>
                    <span className={`material-symbols-outlined text-[#849495] group-hover/btn:text-[#d0bcff] transition-transform duration-300 toggle-chevron text-[18px] ${openDrawers.backend ? "is-open-chevron" : ""}`}>
                      expand_more
                    </span>
                  </button>

                  <div className={`telemetry-drawer-content ${openDrawers.backend ? "is-open" : ""}`}>
                    <div className="drawer-inner pt-4 space-y-4">
                      {/* Reference Item A */}
                      <div className="p-3.5 rounded-xl bg-[#080b12]/90 border border-[#3b494b]/35 hover:border-[#d0bcff]/40 transition-colors">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-code-sm bg-[#d0bcff]/10 border border-[#d0bcff]/30 text-[#d0bcff]">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#d0bcff] animate-pulse" />
                              <span>● LIVE PROD</span>
                            </span>
                            <span className="font-headline-sm text-xs sm:text-sm font-semibold text-[#dbfcff]">SB Work Authentication &amp; REST API Core</span>
                          </div>
                          <span className="text-[10px] font-code-sm text-[#849495] border border-[#3b494b]/30 px-1.5 py-0.5 rounded">SHA-256 // d84c71ef</span>
                        </div>
                        <p className="font-body-sm text-xs text-[#b9cacb] mb-2.5 leading-relaxed">
                          Secure JWT token generation, password hashing, protected endpoint middleware, and structured RESTful routing for freelancers and clients.
                        </p>
                        <div className="flex flex-wrap items-center gap-1.5 mb-3.5">
                          {["Node.js", "Express.js", "JWT Auth", "REST APIs"].map((t) => (
                            <span key={t} className="text-[10px] font-code-sm px-2 py-0.5 rounded bg-[#1a1b21] text-[#d0bcff] border border-[#3b494b]/30">
                              {t}
                            </span>
                          ))}
                        </div>

                        {/* Benchmark Graph: Concurrency & RPS Curve */}
                        <div className="p-3 rounded-lg bg-[#121318]/70 border border-[#3b494b]/30 space-y-2">
                          <div className="flex items-center justify-between text-[11px] font-code-sm">
                            <span className="text-[#849495] uppercase flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#d0bcff] animate-ping" />
                              <span>API LATENCY // RESPONSE TIME DISTRIBUTION</span>
                            </span>
                            <span className="text-[#d0bcff] font-semibold">[ P95: 12.4ms // P50: 3.2ms ]</span>
                          </div>
                          <div className="relative w-full h-16 bg-[#080b12]/90 rounded border border-[#3b494b]/30 overflow-hidden px-1 pt-1">
                            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 380 60">
                              <defs>
                                <linearGradient id="beRpsGrad" x1="0" x2="0" y1="0" y2="1">
                                  <stop offset="0%" stopColor="#c084fc" stopOpacity="0.35" />
                                  <stop offset="100%" stopColor="#a855f7" stopOpacity="0.0" />
                                </linearGradient>
                              </defs>
                              <line stroke="#3a494b" strokeDasharray="2 2" strokeWidth="0.75" x1="0" x2="380" y1="20" y2="20" />
                              <line stroke="#3a494b" strokeDasharray="2 2" strokeWidth="0.75" x1="0" x2="380" y1="40" y2="40" />
                              <polygon fill="url(#beRpsGrad)" points="0,55 0,50 40,46 90,38 140,28 190,19 240,16 290,14 340,13 380,12 380,55" />
                              <path d="M 0,50 Q 70,44 140,28 T 240,16 T 380,12" fill="none" stroke="#c084fc" strokeWidth="1.75" />
                              <circle cx="40" cy="46" fill="#c084fc" stroke="#080b12" strokeWidth="1.5" r="3.5"><title>Fast Endpoint Response</title></circle>
                              <circle cx="140" cy="28" fill="#c084fc" stroke="#080b12" strokeWidth="1.5" r="3.5"><title>Middleware Verification</title></circle>
                              <circle cx="240" cy="16" fill="#c084fc" stroke="#080b12" strokeWidth="1.5" r="3.5"><title>P95: 12.4ms</title></circle>
                              <circle cx="380" cy="12" fill="#ddb7ff" stroke="#080b12" strokeWidth="1.5" r="3.5"><title>Optimized Route Handler</title></circle>
                            </svg>
                          </div>
                          <div className="flex justify-between items-center text-[10px] font-code-sm text-[#849495] pt-0.5">
                            <span>0ms (DISPATCH)</span>
                            <span className="text-[#d0bcff]">CLEAN ASYNC EVENT HANDLING</span>
                            <span>SUB-15ms RESPONSE</span>
                          </div>
                        </div>
                      </div>

                      {/* Reference Item B */}
                      <div className="p-3.5 rounded-xl bg-[#080b12]/90 border border-[#3b494b]/35 hover:border-[#d0bcff]/40 transition-colors">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-code-sm bg-[#d0bcff]/10 border border-[#d0bcff]/30 text-[#d0bcff]">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#d0bcff]" />
                              <span>ACTIVE // RELIABLE</span>
                            </span>
                            <span className="font-headline-sm text-xs sm:text-sm font-semibold text-[#dbfcff]">Quiz Engine RESTful API Service</span>
                          </div>
                          <span className="text-[10px] font-code-sm text-[#849495] border border-[#3b494b]/30 px-1.5 py-0.5 rounded">SHA-256 // f1a890cb</span>
                        </div>
                        <p className="font-body-sm text-xs text-[#b9cacb] mb-2.5 leading-relaxed">
                          Clean RESTful service handling question category fetching, submission validation, score persistence, and error handling middleware.
                        </p>
                        <div className="flex flex-wrap items-center gap-1.5 mb-3.5">
                          {["Node.js", "Express.js", "JSON Validation", "Error Middleware"].map((t) => (
                            <span key={t} className="text-[10px] font-code-sm px-2 py-0.5 rounded bg-[#1a1b21] text-[#d0bcff] border border-[#3b494b]/30">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Card 03: DATABASES & DATA MANAGEMENT */}
            {(skillFilter === "all" || skillFilter === "databases" || skillFilter === "infra") && (
              <div className="skill-card group relative bg-[#0d121d]/85 rounded-2xl border border-[#3b494b]/40 hover:border-[#00f0ff] hover:-translate-y-1.5 transition-all duration-300 p-6 md:p-8 backdrop-blur-xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.8)] hover:shadow-[0_25px_50px_-10px_rgba(0,240,255,0.22)] flex flex-col justify-between overflow-hidden">
                {/* Top subtle glow accent */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#00f0ff]/10 rounded-full blur-2xl group-hover:bg-[#00f0ff]/20 transition-all duration-500 pointer-events-none" />

                <div>
                  {/* Card Header */}
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#3b494b]/30">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#00f0ff]/10 border border-[#00f0ff]/30 flex items-center justify-center text-[#00f0ff] transition-transform group-hover:scale-105">
                        <span className="material-symbols-outlined text-[22px]">database</span>
                      </div>
                      <div>
                        <h3 className="font-headline-sm text-lg font-semibold text-[#dbfcff] tracking-wide">
                          03. DATABASES &amp; DATA MANAGEMENT
                        </h3>
                        <span className="font-code-sm text-[11px] text-[#849495] tracking-wider uppercase">
                          RELATIONAL &amp; DOCUMENT DATA STORES
                        </span>
                      </div>
                    </div>
                    <span className="font-code-sm text-xs text-[#849495] group-hover:text-[#00f0ff] transition-colors">
                      REF // 0xDB03
                    </span>
                  </div>

                  {/* Metric Gauges with Glowing Bars */}
                  <div className="space-y-4 mb-8">
                    {/* Meter 1: MongoDB */}
                    <div>
                      <div className="flex justify-between items-center mb-1 font-code-sm text-xs">
                        <span className="text-[#e3e1e9]">MongoDB (Document Collections &amp; Aggregations)</span>
                        <span className="text-[#00f0ff] font-semibold">90%</span>
                      </div>
                      <div className="w-full bg-[#1e1f25] rounded-full h-1.5 overflow-hidden p-0.5">
                        <div className="bg-gradient-to-r from-[#00f0ff] to-[#38bdf8] h-full rounded-full shadow-[0_0_8px_#00f0ff] animate-bar-glow" style={{ width: "90%" }} />
                      </div>
                    </div>
                    {/* Meter 2: MySQL */}
                    <div>
                      <div className="flex justify-between items-center mb-1 font-code-sm text-xs">
                        <span className="text-[#e3e1e9]">MySQL (Relational Tables &amp; Structured Queries)</span>
                        <span className="text-[#00f0ff] font-semibold">86%</span>
                      </div>
                      <div className="w-full bg-[#1e1f25] rounded-full h-1.5 overflow-hidden p-0.5">
                        <div className="bg-gradient-to-r from-[#00f0ff] to-[#38bdf8] h-full rounded-full shadow-[0_0_8px_#00f0ff] animate-bar-glow" style={{ width: "86%" }} />
                      </div>
                    </div>
                    {/* Meter 3: PostgreSQL */}
                    <div>
                      <div className="flex justify-between items-center mb-1 font-code-sm text-xs">
                        <span className="text-[#e3e1e9]">PostgreSQL (Relational Schemas &amp; Constraints)</span>
                        <span className="text-[#00f0ff] font-semibold">84%</span>
                      </div>
                      <div className="w-full bg-[#1e1f25] rounded-full h-1.5 overflow-hidden p-0.5">
                        <div className="bg-gradient-to-r from-[#00f0ff] to-[#38bdf8] h-full rounded-full shadow-[0_0_8px_#00f0ff] animate-bar-glow" style={{ width: "84%" }} />
                      </div>
                    </div>
                    {/* Meter 4: Database Schema Design */}
                    <div>
                      <div className="flex justify-between items-center mb-1 font-code-sm text-xs">
                        <span className="text-[#e3e1e9]">Database Schema Design (Data Modeling)</span>
                        <span className="text-[#00f0ff] font-semibold">88%</span>
                      </div>
                      <div className="w-full bg-[#1e1f25] rounded-full h-1.5 overflow-hidden p-0.5">
                        <div className="bg-gradient-to-r from-[#00f0ff] to-[#38bdf8] h-full rounded-full shadow-[0_0_8px_#00f0ff] animate-bar-glow" style={{ width: "88%" }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Secondary Stack Chips */}
                <div>
                  <span className="font-code-sm text-[11px] text-[#849495] block mb-2 tracking-wider uppercase">
                    SKILL BADGES &amp; TECHNOLOGIES:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {["MongoDB", "MySQL", "PostgreSQL", "Database Schema Design", "SQL Queries", "Data Modeling"].map((pkg) => (
                      <span key={pkg} className="px-2.5 py-1 rounded-lg bg-[#1a1b21] border border-[#3b494b]/40 text-[#b9cacb] font-code-sm text-[11px] hover:border-[#00f0ff] hover:text-[#00f0ff] transition-colors">
                        {pkg}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Interactive Expandable Project Telemetry Toggle & Drawer */}
                <div className="mt-6 pt-4 border-t border-[#3b494b]/30">
                  <button
                    type="button"
                    onClick={() => toggleDrawer("datastores")}
                    className="telemetry-drawer-toggle w-full py-2.5 px-3.5 rounded-lg bg-[#121318]/80 hover:bg-[#1a1b21] border border-[#3b494b]/40 hover:border-[#00f0ff]/60 text-left flex items-center justify-between transition-all duration-200 group/btn cursor-pointer select-none"
                  >
                    <span className="flex items-center gap-2 font-code-sm text-xs text-[#dbfcff] tracking-wide">
                      <span className="text-[#00f0ff] font-bold toggle-glyph">
                        {openDrawers.datastores ? "[-]" : "[+]"}
                      </span>
                      <span className="toggle-text uppercase font-semibold">
                        {openDrawers.datastores ? "COLLAPSE_TELEMETRY // DOSSIER ACTIVE" : "VIEW_PROD_DEPLOYMENTS // 2 RECENT REFS"}
                      </span>
                    </span>
                    <span className={`material-symbols-outlined text-[#849495] group-hover/btn:text-[#00f0ff] transition-transform duration-300 toggle-chevron text-[18px] ${openDrawers.datastores ? "is-open-chevron" : ""}`}>
                      expand_more
                    </span>
                  </button>

                  <div className={`telemetry-drawer-content ${openDrawers.datastores ? "is-open" : ""}`}>
                    <div className="drawer-inner pt-4 space-y-4">
                      {/* Reference Item A */}
                      <div className="p-3.5 rounded-xl bg-[#080b12]/90 border border-[#3b494b]/35 hover:border-[#00f0ff]/40 transition-colors">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-code-sm bg-[#00f0ff]/10 border border-[#00f0ff]/30 text-[#00f0ff]">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] animate-pulse" />
                              <span>● LIVE PROD</span>
                            </span>
                            <span className="font-headline-sm text-xs sm:text-sm font-semibold text-[#dbfcff]">SB Work MongoDB Architecture</span>
                          </div>
                          <span className="text-[10px] font-code-sm text-[#849495] border border-[#3b494b]/30 px-1.5 py-0.5 rounded">SHA-256 // 7c3d290e</span>
                        </div>
                        <p className="font-body-sm text-xs text-[#b9cacb] mb-2.5 leading-relaxed">
                          Document modeling for users, job postings, client contracts, and application tracking with optimized schema indexes.
                        </p>
                        <div className="flex flex-wrap items-center gap-1.5 mb-3.5">
                          {["MongoDB", "Mongoose", "Schema Indexing", "Document Models"].map((t) => (
                            <span key={t} className="text-[10px] font-code-sm px-2 py-0.5 rounded bg-[#1a1b21] text-[#00f0ff] border border-[#3b494b]/30">
                              {t}
                            </span>
                          ))}
                        </div>

                        {/* Benchmark Graph: Query Latency */}
                        <div className="p-3 rounded-lg bg-[#121318]/70 border border-[#3b494b]/30 space-y-2">
                          <div className="flex items-center justify-between text-[11px] font-code-sm">
                            <span className="text-[#849495] uppercase flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] animate-ping" />
                              <span>QUERY EXECUTION // INDEXED RETRIEVAL PROFILE</span>
                            </span>
                            <span className="text-[#00f0ff] font-semibold">[ 18ms AVG // INDEXED QUERIES ]</span>
                          </div>
                          <div className="relative w-full h-16 bg-[#080b12]/90 rounded border border-[#3b494b]/30 overflow-hidden px-1 pt-1">
                            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 380 60">
                              <defs>
                                <linearGradient id="ragGrad" x1="0" x2="0" y1="0" y2="1">
                                  <stop offset="0%" stopColor="#00f2fe" stopOpacity="0.35" />
                                  <stop offset="100%" stopColor="#00f2fe" stopOpacity="0.0" />
                                </linearGradient>
                              </defs>
                              <line stroke="#3a494b" strokeDasharray="2 2" strokeWidth="0.75" x1="0" x2="380" y1="20" y2="20" />
                              <line stroke="#3a494b" strokeDasharray="2 2" strokeWidth="0.75" x1="0" x2="380" y1="40" y2="40" />
                              <polygon fill="url(#ragGrad)" points="0,55 0,22 45,28 90,24 135,26 180,21 225,25 270,23 315,22 360,24 380,22 380,55" />
                              <path d="M 0,22 Q 45,30 90,24 T 180,21 T 270,23 T 380,22" fill="none" stroke="#00f0ff" strokeWidth="1.75" />
                              <circle cx="45" cy="28" fill="#00f0ff" stroke="#080b12" strokeWidth="1.5" r="3.5"><title>Indexed Scan</title></circle>
                              <circle cx="90" cy="24" fill="#00f0ff" stroke="#080b12" strokeWidth="1.5" r="3.5"><title>Pipeline Lookup</title></circle>
                              <circle cx="180" cy="21" fill="#00f0ff" stroke="#080b12" strokeWidth="1.5" r="3.5"><title>Optimal Execution</title></circle>
                              <circle cx="380" cy="22" fill="#00f0ff" stroke="#080b12" strokeWidth="1.5" r="3.5"><title>Fast Query Return</title></circle>
                            </svg>
                          </div>
                          <div className="flex justify-between items-center text-[10px] font-code-sm text-[#849495] pt-0.5">
                            <span>COLLECTION SCAN</span>
                            <span className="text-[#00f0ff]">INDEX-OPTIMIZED LOOKUPS</span>
                            <span>CONSISTENT DATA INTEGRITY</span>
                          </div>
                        </div>
                      </div>

                      {/* Reference Item B */}
                      <div className="p-3.5 rounded-xl bg-[#080b12]/90 border border-[#3b494b]/35 hover:border-[#00f0ff]/40 transition-colors">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-code-sm bg-[#00f0ff]/10 border border-[#00f0ff]/30 text-[#00f0ff]">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff]" />
                              <span>DEPLOYED</span>
                            </span>
                            <span className="font-headline-sm text-xs sm:text-sm font-semibold text-[#dbfcff]">Relational Quiz Bank &amp; Results Store</span>
                          </div>
                          <span className="text-[10px] font-code-sm text-[#849495] border border-[#3b494b]/30 px-1.5 py-0.5 rounded">SHA-256 // b459c03a</span>
                        </div>
                        <p className="font-body-sm text-xs text-[#b9cacb] mb-2.5 leading-relaxed">
                          Relational database modeling with foreign keys, normalization, question pools, and score history tracking using MySQL / PostgreSQL.
                        </p>
                        <div className="flex flex-wrap items-center gap-1.5 mb-3.5">
                          {["MySQL", "PostgreSQL", "Relational Keys", "SQL Queries"].map((t) => (
                            <span key={t} className="text-[10px] font-code-sm px-2 py-0.5 rounded bg-[#1a1b21] text-[#00f0ff] border border-[#3b494b]/30">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Card 04: PROGRAMMING & DEV TOOLS */}
            {(skillFilter === "all" || skillFilter === "tools" || skillFilter === "infra") && (
              <div className="skill-card group relative bg-[#0d121d]/85 rounded-2xl border border-[#3b494b]/40 hover:border-[#d0bcff] hover:-translate-y-1.5 transition-all duration-300 p-6 md:p-8 backdrop-blur-xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.8)] hover:shadow-[0_25px_50px_-10px_rgba(208,188,255,0.22)] flex flex-col justify-between overflow-hidden">
                {/* Top subtle glow accent */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#d0bcff]/15 rounded-full blur-2xl group-hover:bg-[#d0bcff]/25 transition-all duration-500 pointer-events-none" />

                <div>
                  {/* Card Header */}
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#3b494b]/30">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#d0bcff]/10 border border-[#d0bcff]/30 flex items-center justify-center text-[#d0bcff] transition-transform group-hover:scale-105">
                        <span className="material-symbols-outlined text-[22px]">terminal</span>
                      </div>
                      <div>
                        <h3 className="font-headline-sm text-lg font-semibold text-[#dbfcff] tracking-wide">
                          04. PROGRAMMING &amp; DEV TOOLS
                        </h3>
                        <span className="font-code-sm text-[11px] text-[#849495] tracking-wider uppercase">
                          CORE LANGUAGES, VCS &amp; API TESTING
                        </span>
                      </div>
                    </div>
                    <span className="font-code-sm text-xs text-[#849495] group-hover:text-[#d0bcff] transition-colors">
                      REF // 0xTL04
                    </span>
                  </div>

                  {/* Metric Gauges with Glowing Bars */}
                  <div className="space-y-4 mb-8">
                    {/* Meter 1: Python & Java */}
                    <div>
                      <div className="flex justify-between items-center mb-1 font-code-sm text-xs">
                        <span className="text-[#e3e1e9]">Python &amp; Java (Object-Oriented Programming)</span>
                        <span className="text-[#d0bcff] font-semibold">86%</span>
                      </div>
                      <div className="w-full bg-[#1e1f25] rounded-full h-1.5 overflow-hidden p-0.5">
                        <div className="bg-gradient-to-r from-[#d0bcff] to-[#a855f7] h-full rounded-full shadow-[0_0_8px_#d0bcff] animate-bar-glow" style={{ width: "86%" }} />
                      </div>
                    </div>
                    {/* Meter 2: C & C++ */}
                    <div>
                      <div className="flex justify-between items-center mb-1 font-code-sm text-xs">
                        <span className="text-[#e3e1e9]">C &amp; C++ (Data Structures &amp; Core Logic)</span>
                        <span className="text-[#d0bcff] font-semibold">82%</span>
                      </div>
                      <div className="w-full bg-[#1e1f25] rounded-full h-1.5 overflow-hidden p-0.5">
                        <div className="bg-gradient-to-r from-[#d0bcff] to-[#a855f7] h-full rounded-full shadow-[0_0_8px_#d0bcff] animate-bar-glow" style={{ width: "82%" }} />
                      </div>
                    </div>
                    {/* Meter 3: Git & GitHub */}
                    <div>
                      <div className="flex justify-between items-center mb-1 font-code-sm text-xs">
                        <span className="text-[#e3e1e9]">Git &amp; GitHub (Version Control &amp; Collaboration)</span>
                        <span className="text-[#d0bcff] font-semibold">92%</span>
                      </div>
                      <div className="w-full bg-[#1e1f25] rounded-full h-1.5 overflow-hidden p-0.5">
                        <div className="bg-gradient-to-r from-[#d0bcff] to-[#a855f7] h-full rounded-full shadow-[0_0_8px_#d0bcff] animate-bar-glow" style={{ width: "92%" }} />
                      </div>
                    </div>
                    {/* Meter 4: Postman */}
                    <div>
                      <div className="flex justify-between items-center mb-1 font-code-sm text-xs">
                        <span className="text-[#e3e1e9]">Postman (API Testing &amp; Endpoint Debugging)</span>
                        <span className="text-[#d0bcff] font-semibold">90%</span>
                      </div>
                      <div className="w-full bg-[#1e1f25] rounded-full h-1.5 overflow-hidden p-0.5">
                        <div className="bg-gradient-to-r from-[#d0bcff] to-[#a855f7] h-full rounded-full shadow-[0_0_8px_#d0bcff] animate-bar-glow" style={{ width: "90%" }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Secondary Stack Chips */}
                <div>
                  <span className="font-code-sm text-[11px] text-[#849495] block mb-2 tracking-wider uppercase">
                    SKILL BADGES &amp; TECHNOLOGIES:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {["Python", "Java", "C", "C++", "Git", "GitHub", "Postman"].map((pkg) => (
                      <span key={pkg} className="px-2.5 py-1 rounded-lg bg-[#1a1b21] border border-[#3b494b]/40 text-[#b9cacb] font-code-sm text-[11px] hover:border-[#d0bcff] hover:text-[#d0bcff] transition-colors">
                        {pkg}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Interactive Expandable Project Telemetry Toggle & Drawer */}
                <div className="mt-6 pt-4 border-t border-[#3b494b]/30">
                  <button
                    type="button"
                    onClick={() => toggleDrawer("devops")}
                    className="telemetry-drawer-toggle w-full py-2.5 px-3.5 rounded-lg bg-[#121318]/80 hover:bg-[#1a1b21] border border-[#3b494b]/40 hover:border-[#d0bcff]/60 text-left flex items-center justify-between transition-all duration-200 group/btn cursor-pointer select-none"
                  >
                    <span className="flex items-center gap-2 font-code-sm text-xs text-[#dbfcff] tracking-wide">
                      <span className="text-[#d0bcff] font-bold toggle-glyph">
                        {openDrawers.devops ? "[-]" : "[+]"}
                      </span>
                      <span className="toggle-text uppercase font-semibold">
                        {openDrawers.devops ? "COLLAPSE_TELEMETRY // DOSSIER ACTIVE" : "VIEW_PROD_DEPLOYMENTS // 2 RECENT REFS"}
                      </span>
                    </span>
                    <span className={`material-symbols-outlined text-[#849495] group-hover/btn:text-[#d0bcff] transition-transform duration-300 toggle-chevron text-[18px] ${openDrawers.devops ? "is-open-chevron" : ""}`}>
                      expand_more
                    </span>
                  </button>

                  <div className={`telemetry-drawer-content ${openDrawers.devops ? "is-open" : ""}`}>
                    <div className="drawer-inner pt-4 space-y-4">
                      {/* Reference Item A */}
                      <div className="p-3.5 rounded-xl bg-[#080b12]/90 border border-[#3b494b]/35 hover:border-[#d0bcff]/40 transition-colors">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-code-sm bg-[#d0bcff]/10 border border-[#d0bcff]/30 text-[#d0bcff]">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#d0bcff] animate-pulse" />
                              <span>● LIVE PROD</span>
                            </span>
                            <span className="font-headline-sm text-xs sm:text-sm font-semibold text-[#dbfcff]">Git &amp; GitHub Version Control Workflow</span>
                          </div>
                          <span className="text-[10px] font-code-sm text-[#849495] border border-[#3b494b]/30 px-1.5 py-0.5 rounded">SHA-256 // 9e023f81</span>
                        </div>
                        <p className="font-body-sm text-xs text-[#b9cacb] mb-2.5 leading-relaxed">
                          Clean versioning practices with feature branching, clear commit documentation, merge reviews, and repository management.
                        </p>
                        <div className="flex flex-wrap items-center gap-1.5 mb-3.5">
                          {["Git", "GitHub", "Branch Management", "Version Control"].map((t) => (
                            <span key={t} className="text-[10px] font-code-sm px-2 py-0.5 rounded bg-[#1a1b21] text-[#d0bcff] border border-[#3b494b]/30">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Reference Item B */}
                      <div className="p-3.5 rounded-xl bg-[#080b12]/90 border border-[#3b494b]/35 hover:border-[#d0bcff]/40 transition-colors">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-code-sm bg-[#d0bcff]/10 border border-[#d0bcff]/30 text-[#d0bcff]">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#d0bcff]" />
                              <span>ACTIVE // TESTED</span>
                            </span>
                            <span className="font-headline-sm text-xs sm:text-sm font-semibold text-[#dbfcff]">Postman API Testing &amp; Verification Suite</span>
                          </div>
                          <span className="text-[10px] font-code-sm text-[#849495] border border-[#3b494b]/30 px-1.5 py-0.5 rounded">SHA-256 // cc4510da</span>
                        </div>
                        <p className="font-body-sm text-xs text-[#b9cacb] mb-2.5 leading-relaxed">
                          Organized Postman request collections verifying API authentication headers, JSON payload formatting, status codes, and edge case handling.
                        </p>
                        <div className="flex flex-wrap items-center gap-1.5 mb-3.5">
                          {["Postman", "API Testing", "Status Codes", "Payload Validation"].map((t) => (
                            <span key={t} className="text-[10px] font-code-sm px-2 py-0.5 rounded bg-[#1a1b21] text-[#d0bcff] border border-[#3b494b]/30">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Terminal Diagnostics Footnote Strip */}
          <div className="mt-8 bg-[#0d121d]/80 border border-[#3b494b]/35 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 font-code-sm text-xs text-[#849495] backdrop-blur-sm reveal-item is-revealed stagger-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#00f0ff] text-[18px]">terminal</span>
              <span className="text-[#e3e1e9]">SYS_DIAGNOSTICS: Practical full-stack architecture verified for responsive performance and clean code.</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-[#00f0ff] font-semibold">[ PROD_READY // VERIFIED ]</span>
              <span className="hover:text-white cursor-pointer transition-colors font-mono">STATUS // NOMINAL</span>
            </div>
          </div>
        </section>

        {/* WORK EXPERIENCE // CAREER TRAJECTORY SECTION */}
        <CareerTrajectory />

        {/* // 04 // SHOWCASE LABS: FEATURED PROJECTS */}
        <ShowcaseSection />

        {/* // 05 // CAPABILITIES SECTION ("What I Build") */}
        <CapabilitiesSection />

        {/* // 06 // WORKFLOW METHODOLOGY: DEVELOPMENT PROCESS */}
        <DevelopmentProcess />

        {/* // 07 // VALUE PROPOSITION: WHY WORK WITH ME */}
        <ValueProposition />

        {/* // 08 // INTERACTIVE DEVELOPER TERMINAL */}
        <Terminal />

        {/* // 09 // PROJECT TIMELINE & SCOPE ESTIMATOR */}
        <ScopeEstimator />

        {/* // 10 // TRANSMISSION PROTOCOL: HAVE AN IDEA? LET'S BUILD IT. */}
        <Contact />
        </CyberMiddleBody>
      </main>

      {/* ARCHITECTURAL SPECIFICATION: EDITORIAL MINIMALIST COMMAND HUB FOOTER */}
      <Footer />

      {/* Portfolio AI Copilot Assistant Widget */}
      <PortfolioCopilot />
    </div>
  );
};

export default App;
