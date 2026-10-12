import { useState, useEffect, useRef, useCallback } from "react";

const PITCH_MAP = {
  domain: 587.33, // D5
  backend: 659.25, // E5
  lifecycle: 783.99, // G5
  database: 554.37, // C#5
};

const EMBER_COLORS = [
  { r: 0, g: 245, b: 255 }, // Cyber Cyan
  { r: 5, g: 213, b: 255 }, // Bright Cyan
  { r: 0, g: 242, b: 254 }, // Neon Teal
  { r: 168, g: 85, b: 247 }, // Electric Violet
  { r: 129, g: 140, b: 248 }, // Soft Indigo
  { r: 16, g: 185, b: 129 }, // Emerald Accent
];

const ROLES = [
  {
    id: "veracity",
    category: "FULL STACK",
    title: "Software Developer",
    company: "Veracity Supply Chain Limited",
    location: "Ahmedabad, India",
    period: "Sept 2026 – Present",
    isCurrent: true,
    theme: "cyan",
    narrative:
      "Developing REST APIs and server-side logic using Node.js while building responsive interfaces with HTML, CSS, JavaScript, and React.js. Working on database schemas, efficient queries, unit testing, code reviews, UAT, and technical documentation.",
    metrics: [
      { key: "domain", label: "Specialization", value: "Full-Stack Development" },
      { key: "backend", label: "Backend Core", value: "REST APIs & Node.js" },
      { key: "lifecycle", label: "Engineering Scope", value: "Database Design & UAT", accent: "cyan", fullWidthMobile: true },
    ],
    tech: ["Node.js", "React.js", "JavaScript", "REST APIs", "Database Design"],
  },
  {
    id: "ypsilon",
    category: "MERN STACK",
    title: "MERN Stack Developer Intern",
    company: "Ypsilon IT Solutions Pvt Ltd",
    location: "Indore, India",
    period: "March 2026 – August 2026",
    isCurrent: false,
    theme: "violet",
    narrative:
      "Developed and maintained modules for an e-commerce web application using the MERN stack. Designed MongoDB schemas and built RESTful APIs for authentication, product management, and cart and checkout workflows. Integrated React.js interfaces with backend services to create a responsive shopping experience.",
    metrics: [
      { key: "domain", label: "Specialization", value: "MERN Stack E-Commerce" },
      { key: "backend", label: "API Systems", value: "Auth & Cart Workflows" },
      { key: "database", label: "Data Store", value: "MongoDB Schema Design", accent: "violet", fullWidthMobile: true },
    ],
    tech: ["MongoDB", "Express.js", "React.js", "Node.js", "REST APIs"],
  },
];

export default function CareerTrajectory() {
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [flowMode, setFlowMode] = useState("drift"); // 'drift' | 'warp'
  const [isTiltActive, setIsTiltActive] = useState(true);

  const audioCtxRef = useRef(null);
  const cardsRef = useRef(new Map());

  // Safe Web Audio Context accessor
  const getAudioContext = useCallback(() => {
    if (!audioCtxRef.current) {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      if (AudioCtxClass) {
        audioCtxRef.current = new AudioCtxClass();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  // Hover telemetry audio blip
  const playHoverSound = useCallback(
    (metricKey) => {
      if (!isAudioEnabled) return;
      try {
        const ctx = getAudioContext();
        if (!ctx) return;

        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        const baseFreq = PITCH_MAP[metricKey] || 620;

        osc.type = "triangle";
        osc.frequency.setValueAtTime(baseFreq * 0.88, now);
        osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.05, now + 0.04);
        osc.frequency.exponentialRampToValueAtTime(baseFreq, now + 0.14);

        filter.type = "lowpass";
        filter.frequency.setValueAtTime(2800, now);
        filter.frequency.exponentialRampToValueAtTime(1400, now + 0.16);

        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.linearRampToValueAtTime(0.065, now + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.17);
      } catch {
        // gracefully ignore
      }
    },
    [isAudioEnabled, getAudioContext]
  );

  // Click tactile confirmation audio
  const playClickSound = useCallback(() => {
    if (!isAudioEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;

      // High crisp chirp
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(920, now);
      osc1.frequency.exponentialRampToValueAtTime(1480, now + 0.08);

      gain1.gain.setValueAtTime(0.001, now);
      gain1.gain.linearRampToValueAtTime(0.09, now + 0.008);
      gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.13);

      // Sub resonant pop
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(180, now);
      osc2.frequency.exponentialRampToValueAtTime(60, now + 0.07);

      gain2.gain.setValueAtTime(0.001, now);
      gain2.gain.linearRampToValueAtTime(0.08, now + 0.006);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);

      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now);
      osc2.stop(now + 0.1);
    } catch {
      // gracefully ignore
    }
  }, [isAudioEnabled, getAudioContext]);

  // Warp toggle sound effect
  const playWarpSound = useCallback(
    (isWarp) => {
      if (!isAudioEnabled) return;
      try {
        const ctx = getAudioContext();
        if (!ctx) return;

        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = "sine";
        if (isWarp) {
          osc.frequency.setValueAtTime(320, now);
          osc.frequency.exponentialRampToValueAtTime(1240, now + 0.18);
        } else {
          osc.frequency.setValueAtTime(880, now);
          osc.frequency.exponentialRampToValueAtTime(340, now + 0.18);
        }

        filter.type = "bandpass";
        filter.frequency.setValueAtTime(isWarp ? 1100 : 700, now);
        filter.Q.value = 3;

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.09, now + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.23);
      } catch {
        // gracefully ignore
      }
    },
    [isAudioEnabled, getAudioContext]
  );

  // Spawn visual radar/sonar expanding ripple on telemetry chip
  const triggerHapticRipple = (e, chipElement, theme) => {
    if (!chipElement) return;
    const rect = chipElement.getBoundingClientRect();
    const x = e && typeof e.clientX === "number" ? e.clientX - rect.left : rect.width / 2;
    const y = e && typeof e.clientY === "number" ? e.clientY - rect.top : rect.height / 2;

    let rippleBorderColor = "rgba(6, 182, 212, 0.85)";
    let rippleBg = "radial-gradient(circle, rgba(0, 242, 254, 0.28) 0%, rgba(6, 182, 212, 0.08) 50%, transparent 75%)";
    let rippleGlow = "0 0 16px rgba(0, 242, 254, 0.6)";

    if (theme === "violet") {
      rippleBorderColor = "rgba(168, 85, 247, 0.85)";
      rippleBg = "radial-gradient(circle, rgba(168, 85, 247, 0.28) 0%, rgba(139, 92, 246, 0.08) 50%, transparent 75%)";
      rippleGlow = "0 0 16px rgba(168, 85, 247, 0.6)";
    } else if (theme === "slate") {
      rippleBorderColor = "rgba(148, 163, 184, 0.75)";
      rippleBg = "radial-gradient(circle, rgba(203, 213, 225, 0.22) 0%, rgba(148, 163, 184, 0.06) 50%, transparent 75%)";
      rippleGlow = "0 0 14px rgba(255, 255, 255, 0.4)";
    }

    const ripple = document.createElement("span");
    ripple.className = "haptic-sonar-ripple border";
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.style.borderColor = rippleBorderColor;
    ripple.style.background = rippleBg;
    ripple.style.boxShadow = rippleGlow;

    chipElement.appendChild(ripple);

    setTimeout(() => {
      if (ripple.parentNode === chipElement) {
        chipElement.removeChild(ripple);
      }
    }, 800);
  };

  // Particle embers are powered continuously across all middle sections by CyberMiddleBody

  // Sync depth CSS variables on 3D toggle
  useEffect(() => {
    const rootEl = document.querySelector("#experience");
    if (!rootEl) return;
    const chips = rootEl.querySelectorAll(".telemetry-chip");
    chips.forEach((chip) => {
      if (isTiltActive) {
        chip.style.setProperty("--chip-rest-z", "18px");
        chip.style.setProperty("--chip-hover-z", "42px");
        chip.style.setProperty("--metric-rest-z", "10px");
        chip.style.setProperty("--metric-hover-z", "18px");
        chip.style.setProperty("--metric-label-z", "6px");
        chip.style.setProperty("--metric-label-hover-z", "10px");
      } else {
        chip.style.setProperty("--chip-rest-z", "0px");
        chip.style.setProperty("--chip-hover-z", "0px");
        chip.style.setProperty("--metric-rest-z", "0px");
        chip.style.setProperty("--metric-hover-z", "0px");
        chip.style.setProperty("--metric-label-z", "0px");
        chip.style.setProperty("--metric-label-hover-z", "0px");
        chip.style.setProperty("--chip-tilt-x", "0deg");
        chip.style.setProperty("--chip-tilt-y", "0deg");
      }
    });

    if (!isTiltActive) {
      cardsRef.current.forEach(({ el, state }) => {
        if (state.rafId) {
          cancelAnimationFrame(state.rafId);
          state.rafId = null;
        }
        state.targetRotateX = 0;
        state.targetRotateY = 0;
        state.targetScale = 1;
        state.currentRotateX = 0;
        state.currentRotateY = 0;
        state.currentScale = 1;
        state.isHovered = false;
        if (el) el.style.transform = "";
      });
    }
  }, [isTiltActive]);

  // Card Mouse Move Tilt Physics
  const handleCardMouseMove = (e, roleId) => {
    const cardData = cardsRef.current.get(roleId);
    if (!cardData || !cardData.el) return;
    const card = cardData.el;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);

    if (!isTiltActive) return;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const normX = (x - centerX) / centerX;
    const normY = (y - centerY) / centerY;

    const state = cardData.state;
    state.targetRotateX = -normY * 8.5;
    state.targetRotateY = normX * 8.5;
    state.targetScale = 1.02;
    state.isHovered = true;

    startCardPhysics(roleId);
  };

  const handleCardMouseLeave = (roleId) => {
    const cardData = cardsRef.current.get(roleId);
    if (!cardData || !cardData.el) return;
    const state = cardData.state;
    state.isHovered = false;
    state.targetRotateX = 0;
    state.targetRotateY = 0;
    state.targetScale = 1;

    if (isTiltActive) {
      startCardPhysics(roleId);
    } else {
      cardData.el.style.transform = "";
    }
  };

  const startCardPhysics = (roleId) => {
    const cardData = cardsRef.current.get(roleId);
    if (!cardData || cardData.state.rafId) return;

    const tick = () => {
      const { el, state } = cardData;
      if (!el) return;

      if (!isTiltActive && !state.isHovered) {
        el.style.transform = "";
        state.currentRotateX = 0;
        state.currentRotateY = 0;
        state.currentScale = 1;
        state.rafId = null;
        return;
      }

      const ease = 0.16;
      state.currentRotateX += (state.targetRotateX - state.currentRotateX) * ease;
      state.currentRotateY += (state.targetRotateY - state.currentRotateY) * ease;
      state.currentScale += (state.targetScale - state.currentScale) * ease;

      el.style.transform = `perspective(1000px) rotateX(${state.currentRotateX.toFixed(
        2
      )}deg) rotateY(${state.currentRotateY.toFixed(2)}deg) scale3d(${state.currentScale.toFixed(
        3
      )}, ${state.currentScale.toFixed(3)}, ${state.currentScale.toFixed(3)})`;

      const deltaX = Math.abs(state.targetRotateX - state.currentRotateX);
      const deltaY = Math.abs(state.targetRotateY - state.currentRotateY);
      const deltaS = Math.abs(state.targetScale - state.currentScale);

      if (!state.isHovered && deltaX < 0.02 && deltaY < 0.02 && deltaS < 0.002) {
        el.style.transform = "";
        state.currentRotateX = 0;
        state.currentRotateY = 0;
        state.currentScale = 1;
        state.rafId = null;
      } else {
        state.rafId = requestAnimationFrame(tick);
      }
    };

    cardData.state.rafId = requestAnimationFrame(tick);
  };

  const registerCardRef = (roleId, el) => {
    if (!el) {
      cardsRef.current.delete(roleId);
      return;
    }
    if (!cardsRef.current.has(roleId)) {
      cardsRef.current.set(roleId, {
        el,
        state: {
          targetRotateX: 0,
          targetRotateY: 0,
          targetScale: 1,
          currentRotateX: 0,
          currentRotateY: 0,
          currentScale: 1,
          rafId: null,
          isHovered: false,
        },
      });
    } else {
      cardsRef.current.get(roleId).el = el;
    }
  };

  const handleChipMouseMove = (e, chipEl) => {
    if (!isTiltActive || !chipEl) return;
    const rect = chipEl.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const normX = (x - centerX) / centerX;
    const normY = (y - centerY) / centerY;

    chipEl.style.setProperty("--chip-tilt-x", `${(-normY * 6).toFixed(2)}deg`);
    chipEl.style.setProperty("--chip-tilt-y", `${(normX * 6).toFixed(2)}deg`);
  };

  const handleChipMouseLeave = (chipEl) => {
    if (!chipEl) return;
    chipEl.style.setProperty("--chip-tilt-x", "0deg");
    chipEl.style.setProperty("--chip-tilt-y", "0deg");
  };

  // Toggle Flow Mode
  const handleToggleFlowMode = () => {
    getAudioContext();
    const nextMode = flowMode === "drift" ? "warp" : "drift";
    setFlowMode(nextMode);
    playWarpSound(nextMode === "warp");
    if (typeof window !== "undefined" && window.setEmberFlowMode) {
      window.setEmberFlowMode(nextMode);
    }
  };

  // Toggle SFX
  const handleToggleAudio = () => {
    const next = !isAudioEnabled;
    setIsAudioEnabled(next);
    if (next) {
      getAudioContext();
      playClickSound();
    }
  };

  // Toggle 3D Tilt
  const handleToggleTilt = () => {
    setIsTiltActive((prev) => !prev);
    getAudioContext();
    playClickSound();
  };

  // Filtered Roles
  const filteredRoles = ROLES.filter((role) => {
    if (activeFilter === "ALL") return true;
    return role.category === activeFilter;
  });

  return (
    <section
      id="experience"
      className="scroll-mt-28 relative py-4 text-slate-300 font-sans selection:bg-cyan-500/25 selection:text-cyan-300"
      data-purpose="career-trajectory-section"
    >
      {/* Futuristic Telemetry Top Control Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 mb-8 sm:mb-12">
        <div className="flex flex-wrap items-center justify-between gap-3 p-2.5 sm:p-3 rounded-xl border border-white/[0.08] bg-[#0c1322]/80 backdrop-blur-md shadow-lg">
          {/* Status Badge */}
          <div className="flex items-center space-x-2.5 px-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping-slow absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-400" />
            </span>
            <span className="font-mono text-xs tracking-wider uppercase text-cyan-400/90 font-medium">
              System Status: <span className="text-slate-200">Full-Stack Engineering</span>
            </span>
          </div>

          {/* Interactive Hardware Controls: Audio SFX, Particle Flow Speed, 3D Tilt & PDF Export */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 ml-auto">
            {/* SFX Audio Toggle */}
            <button
              type="button"
              onClick={handleToggleAudio}
              aria-label="Toggle Telemetry Audio SFX"
              aria-pressed={isAudioEnabled}
              className={`group relative flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg border transition-all duration-300 focus:outline-none ${
                isAudioEnabled
                  ? "border-cyan-500/40 bg-cyan-950/30 hover:border-cyan-400 shadow-[0_0_12px_-2px_rgba(6,182,212,0.25)]"
                  : "border-white/10 bg-slate-900/60 hover:border-slate-600 opacity-75 hover:opacity-100"
              }`}
            >
              <svg className="w-3.5 h-3.5 text-cyan-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isAudioEnabled ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                  />
                ) : (
                  <>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                    />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                  </>
                )}
              </svg>
              <span className="font-mono text-[11px] tracking-wider font-semibold text-slate-300">
                <span className="hidden md:inline text-slate-400">AUDIO </span>SFX:{" "}
                <span className={isAudioEnabled ? "text-cyan-300 font-semibold" : "text-slate-400"}>
                  {isAudioEnabled ? "ON" : "MUTED"}
                </span>
              </span>
              <span className="relative flex h-1.5 w-1.5 ml-0.5">
                {isAudioEnabled && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                )}
                <span
                  className={`relative inline-flex rounded-full h-1.5 w-1.5 ${
                    isAudioEnabled ? "bg-cyan-400" : "bg-slate-500"
                  } transition-colors duration-300`}
                />
              </span>
            </button>

            {/* Ember Flow Control Toggle Pill */}
            <button
              type="button"
              onClick={handleToggleFlowMode}
              aria-label="Toggle Ember Particle Flow Speed"
              aria-pressed={flowMode === "warp"}
              className={`group relative flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg border transition-all duration-300 focus:outline-none ${
                flowMode === "warp"
                  ? "border-violet-400/60 bg-gradient-to-r from-violet-950/40 to-cyan-950/40 hover:border-violet-300 shadow-[0_0_18px_rgba(168,85,247,0.35)]"
                  : "border-cyan-500/40 bg-cyan-950/30 hover:border-cyan-400 shadow-[0_0_12px_-2px_rgba(6,182,212,0.25)]"
              }`}
            >
              <svg
                className={`w-3.5 h-3.5 ${
                  flowMode === "warp" ? "text-violet-300 animate-pulse" : "text-cyan-400 group-hover:rotate-12"
                } transition-transform duration-300`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="font-mono text-[11px] tracking-wider font-semibold text-slate-300">
                <span className="hidden md:inline text-slate-400">FLOW: </span>
                <span className={flowMode === "warp" ? "text-violet-300 font-bold" : "text-cyan-300"}>
                  {flowMode === "warp" ? "WARP" : "DRIFT"}
                </span>
              </span>
              <span className="relative flex h-1.5 w-1.5 ml-0.5">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full ${
                    flowMode === "warp" ? "bg-violet-400 opacity-90" : "bg-cyan-400 opacity-75"
                  }`}
                />
                <span
                  className={`relative inline-flex rounded-full h-1.5 w-1.5 ${
                    flowMode === "warp" ? "bg-violet-400" : "bg-cyan-400"
                  } transition-colors duration-300`}
                />
              </span>
            </button>

            {/* 3D Tilt Perspective Toggle Button */}
            <button
              type="button"
              onClick={handleToggleTilt}
              aria-label="Toggle 3D Perspective Tilt"
              aria-pressed={isTiltActive}
              className={`group relative flex items-center gap-2 sm:gap-2.5 px-2.5 sm:px-3 py-1.5 rounded-lg border transition-all duration-300 focus:outline-none ${
                isTiltActive
                  ? "border-cyan-500/40 bg-cyan-950/30 hover:border-cyan-400 shadow-[0_0_12px_-2px_rgba(6,182,212,0.25)]"
                  : "border-white/10 bg-slate-900/60 hover:border-slate-600 opacity-75 hover:opacity-100"
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  {isTiltActive && (
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                  )}
                  <span
                    className={`relative inline-flex rounded-full h-2 w-2 ${
                      isTiltActive ? "bg-cyan-400" : "bg-slate-500"
                    } transition-colors duration-300`}
                  />
                </span>
                <span className="font-mono text-[11px] tracking-wider font-semibold text-slate-300">
                  <span className="text-slate-400 hidden md:inline">PERSPECTIVE </span>3D:{" "}
                  <span className={isTiltActive ? "text-cyan-300 font-semibold" : "text-slate-400"}>
                    {isTiltActive ? "ACTIVE" : "OFF"}
                  </span>
                </span>
              </div>
              <div
                className={`relative w-8 h-4 rounded-full p-0.5 transition-colors duration-300 ${
                  isTiltActive
                    ? "bg-slate-900 border border-cyan-500/50 group-hover:border-cyan-400"
                    : "bg-slate-950 border border-slate-700"
                }`}
              >
                <div
                  className={`w-3 h-3 rounded-full transition-transform duration-300 ease-out ${
                    isTiltActive
                      ? "bg-cyan-400 shadow-[0_0_8px_#00f2fe] translate-x-3.5"
                      : "bg-slate-500 shadow-none translate-x-0"
                  }`}
                />
              </div>
            </button>

            {/* Resume Export Link */}
            <a
              href="/Shivam_Sakre_Resume.pdf"
              download="Shivam_Sakre_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 text-xs font-mono font-semibold tracking-wider uppercase text-cyan-300 border border-cyan-500/40 rounded-lg bg-cyan-950/20 hover:bg-cyan-500/10 hover:border-cyan-400 transition-all duration-300 shadow-[0_0_15px_-3px_rgba(6,182,212,0.2)]"
            >
              <svg className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span className="hidden sm:inline">Export Resume .PDF</span>
              <span className="sm:hidden">.PDF</span>
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="mb-14 md:mb-20">
          <div className="flex items-center space-x-2 text-cyan-400 font-mono text-sm md:text-base font-semibold tracking-wider uppercase mb-3">
            <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>[03 // CAREER TRAJECTORY]</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white">
                Work Experience
              </h2>
              <p className="text-slate-400 mt-3 text-base sm:text-lg max-w-2xl font-normal leading-relaxed">
                Building responsive web applications, developing backend APIs, and creating practical full-stack solutions.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
              <div className="flex flex-wrap items-center gap-2 bg-slate-900/80 p-1.5 rounded-xl border border-white/[0.08] backdrop-blur-sm">
                <button
                  type="button"
                  onClick={() => {
                    setActiveFilter("ALL");
                    playClickSound();
                  }}
                  className={`px-3.5 py-1.5 text-xs font-mono font-medium rounded-lg transition shadow-sm ${
                    activeFilter === "ALL"
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                      : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]"
                  }`}
                >
                  ALL ROLES (02)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveFilter("FULL STACK");
                    playClickSound();
                  }}
                  className={`px-3.5 py-1.5 text-xs font-mono font-medium rounded-lg transition shadow-sm ${
                    activeFilter === "FULL STACK"
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                      : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]"
                  }`}
                >
                  FULL STACK
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveFilter("MERN STACK");
                    playClickSound();
                  }}
                  className={`px-3.5 py-1.5 text-xs font-mono font-medium rounded-lg transition shadow-sm ${
                    activeFilter === "MERN STACK"
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                      : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]"
                  }`}
                >
                  MERN STACK
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Experience Timeline */}
        <div className="relative">
          {/* Continuous Glowing Spine Line */}
          <div className="absolute left-4 sm:left-6 top-5 bottom-12 w-[2px] spine-gradient -translate-x-1/2 opacity-70" />

          <div className="space-y-12 sm:space-y-16">
            {filteredRoles.map((role) => {
              const isCyan = role.theme === "cyan";
              const isViolet = role.theme === "violet";

              const cardBorderClass = isCyan
                ? "border-cyan-500/30 hover:border-cyan-400/60 shadow-xl hover:shadow-glow-cyan"
                : isViolet
                ? "border-violet-500/25 hover:border-violet-400/50 shadow-xl hover:shadow-glow-violet"
                : "border-white/[0.08] hover:border-slate-500/50 shadow-lg";

              const nodeClass = isCyan
                ? "border-cyan-400 ring-4 ring-cyan-500/20 shadow-[0_0_12px_#00f2fe]"
                : isViolet
                ? "border-violet-400 ring-4 ring-violet-500/20 shadow-[0_0_12px_#a855f7]"
                : "border-slate-500 group-hover:border-violet-400 shadow-sm";

              const dateBadgeClass = isCyan
                ? "text-cyan-300 bg-cyan-950/60 border border-cyan-500/40 shadow-[0_0_12px_-2px_rgba(6,182,212,0.4)]"
                : isViolet
                ? "text-violet-300 bg-violet-950/50 border border-violet-500/40"
                : "text-slate-400 bg-slate-900/60 border border-slate-700/50";

              const titleHoverClass = isCyan
                ? "group-hover:text-cyan-200"
                : isViolet
                ? "group-hover:text-violet-200"
                : "group-hover:text-slate-200";

              const companyColorClass = isCyan
                ? "text-cyan-400"
                : isViolet
                ? "text-violet-400"
                : "text-slate-400";

              const chipThemeClass = isCyan
                ? "telemetry-chip-cyan bg-cyan-950/20 border-cyan-500/20"
                : isViolet
                ? "telemetry-chip-violet bg-violet-950/20 border-violet-500/20"
                : "telemetry-chip-slate bg-slate-900/40 border-white/[0.06]";

              const techHoverBorderClass = isCyan
                ? "hover:border-cyan-400/40 hover:text-cyan-300"
                : isViolet
                ? "hover:border-violet-400/40 hover:text-violet-300"
                : "hover:border-slate-400 hover:text-slate-200";

              return (
                <div key={role.id} className="relative pl-12 sm:pl-16 group" data-purpose="timeline-item">
                  {/* Timeline Node */}
                  <div className="absolute left-4 sm:left-6 top-5 -translate-x-1/2 -translate-y-1/2 z-20 flex items-center justify-center">
                    {role.isCurrent && (
                      <span className="absolute w-8 h-8 rounded-full bg-cyan-500/30 animate-ping opacity-75" />
                    )}
                    <span className={`relative w-4 h-4 rounded-full bg-[#030712] border-2 transition-colors ${nodeClass}`} />
                  </div>

                  {/* 3D Glass Card Container */}
                  <div
                    ref={(el) => registerCardRef(role.id, el)}
                    onMouseMove={(e) => handleCardMouseMove(e, role.id)}
                    onMouseLeave={() => handleCardMouseLeave(role.id)}
                    className={`experience-card relative rounded-2xl bg-gradient-to-b from-[#0e1628]/90 to-[#090e1a]/95 border p-6 sm:p-8 backdrop-blur-xl overflow-hidden transition-all duration-300 ${cardBorderClass}`}
                  >
                    <div className="card-glow-overlay" />
                    <div className="card-specular-glare" />

                    {/* Top Row: Role Title, Company & Timeframe Pill */}
                    <div className="relative z-10 flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                      <div>
                        <h3 className={`font-display text-xl sm:text-2xl font-bold text-white tracking-wide transition-colors ${titleHoverClass}`}>
                          {role.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`font-mono text-sm sm:text-base font-semibold tracking-wide ${companyColorClass}`}>
                            {role.company}
                          </span>
                          <span className="text-slate-600 font-mono text-xs">/</span>
                          <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                            <svg className={`w-3.5 h-3.5 ${companyColorClass}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                              />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {role.location}
                          </span>
                        </div>
                      </div>

                      {/* Date Badge */}
                      <div className="self-start">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold tracking-wider ${dateBadgeClass}`}>
                          {role.isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />}
                          {role.period}
                        </span>
                      </div>
                    </div>

                    {/* Role Narrative */}
                    <p className="relative z-10 text-slate-300 text-sm sm:text-base leading-relaxed mb-6 font-normal">
                      {role.narrative}
                    </p>

                    {/* Interactive Telemetry Chips with 3D Parallax Pop-out */}
                    <div className="metrics-3d-grid relative z-20 grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6 font-mono text-xs">
                      {role.metrics.map((m) => (
                        <div
                          key={m.key}
                          data-metric={m.key}
                          onMouseEnter={(e) => {
                            playHoverSound(m.key);
                            triggerHapticRipple(e, e.currentTarget, role.theme);
                          }}
                          onClick={(e) => {
                            playClickSound();
                            triggerHapticRipple(e, e.currentTarget, role.theme);
                          }}
                          onMouseMove={(e) => handleChipMouseMove(e, e.currentTarget)}
                          onMouseLeave={(e) => handleChipMouseLeave(e.currentTarget)}
                          className={`telemetry-chip relative border rounded-lg p-2.5 cursor-pointer backdrop-blur-sm ${chipThemeClass} ${
                            m.fullWidthMobile ? "col-span-2 sm:col-span-1" : ""
                          }`}
                        >
                          <span className="metric-label text-slate-400 block text-[10px] uppercase font-mono tracking-wider">
                            {m.label}
                          </span>
                          <span
                            className={`metric-value font-bold text-sm tracking-tight ${
                              m.accent === "emerald"
                                ? "text-emerald-400"
                                : m.accent === "cyan"
                                ? "text-cyan-300"
                                : isCyan
                                ? "text-cyan-300"
                                : isViolet
                                ? "text-violet-300"
                                : "text-slate-200"
                            }`}
                          >
                            {m.value}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Technology Badges */}
                    <div className="relative z-10 flex flex-wrap items-center gap-2 pt-2 border-t border-white/[0.06]">
                      {role.tech.map((t) => (
                        <span
                          key={t}
                          className={`px-2.5 py-1 text-xs font-mono font-medium rounded-md bg-white/[0.04] text-slate-300 border border-white/[0.08] transition-colors cursor-default ${techHoverBorderClass}`}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Call To Action Footer Banner */}
        <div
          className="mt-16 sm:mt-20 p-8 rounded-2xl border border-cyan-500/20 bg-gradient-to-r from-cyan-950/20 via-slate-900/60 to-purple-950/20 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-6"
          data-purpose="cta-banner"
        >
          <div className="space-y-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 text-cyan-400 font-mono text-xs font-semibold uppercase">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              Availability Status
            </div>
            <h4 className="font-display text-xl font-bold text-white">
              Have a full-stack project or development role in mind?
            </h4>
            <p className="text-sm text-slate-400">
              Available for full-time opportunities and web development projects.
            </p>
          </div>
          <div className="flex items-center gap-4 flex-shrink-0">
            <a
              href="#contact"
              className="px-6 py-3 rounded-xl font-mono text-xs uppercase tracking-wider font-bold text-[#030712] bg-cyan-400 hover:bg-cyan-300 transition-all shadow-[0_0_20px_rgba(0,242,254,0.4)] hover:shadow-[0_0_30px_rgba(0,242,254,0.6)]"
            >
              Initiate Contact //
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
