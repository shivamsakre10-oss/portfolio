import { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  Layout,
  Server,
  Layers,
  ArrowRight,
  Lock,
  Database,
  Code2,
} from "lucide-react";
import { smoothScrollTo } from "../utils/smoothScroll";

gsap.registerPlugin(ScrollTrigger);

const BREAKPOINTS = [
  { px: 390, label: "Mobile" },
  { px: 768, label: "Tablet" },
  { px: 1024, label: "Laptop" },
  { px: 1440, label: "Desktop" },
];

function BreakpointStrip() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActive((i) => (i + 1) % BREAKPOINTS.length), 1800);
    return () => clearInterval(id);
  }, []);

  const pct = (active / (BREAKPOINTS.length - 1)) * 100;

  return (
    <div className="bp">
      <div className="bp-track">
        <span className="bp-fill" style={{ width: `${pct}%` }} />
        <span className="bp-thumb" style={{ left: `${pct}%` }} />
      </div>
      <div className="bp-list">
        {BREAKPOINTS.map((b, i) => (
          <button
            key={b.px}
            type="button"
            className={`bp-item ${i === active ? "is-active" : ""}`}
            onClick={() => setActive(i)}
          >
            <strong>{b.px}px</strong>
            <span>{b.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function ValueProposition() {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReducedMotion) return;

      const validCards = cardsRef.current.filter(Boolean);
      if (validCards.length > 0) {
        gsap.fromTo(
          validCards,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.12,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    },
    { scope: sectionRef }
  );

  const handleExploreProjects = (e) => {
    e.preventDefault();
    smoothScrollTo("work");
  };

  const techBadges = [
    { label: "HTML", color: "cyan" },
    { label: "CSS", color: "cyan" },
    { label: "JavaScript", color: "cyan" },
    { label: "React.js", color: "cyan" },
    { label: "Node.js", color: "emerald" },
    { label: "Express.js", color: "emerald" },
    { label: "MongoDB", color: "emerald" },
    { label: "SQL", color: "emerald" },
    { label: "Python", color: "violet" },
    { label: "Java", color: "violet" },
    { label: "Git & GitHub", color: "amber" },
    { label: "REST API Design", color: "emerald" },
    { label: "Postman", color: "amber" },
    { label: "JWT Authentication", color: "violet" },
  ];

  return (
    <section
      ref={sectionRef}
      className="scroll-mt-28 relative py-4 text-slate-100 overflow-hidden font-body-md"
      data-purpose="value-proposition-section"
      id="why-me"
    >
      {/* Anchor aliases for smooth navigation */}
      <span id="rationale" className="sr-only" aria-hidden="true" />
      <span id="value-proposition" className="sr-only" aria-hidden="true" />
      <span id="why-work-with-me" className="sr-only" aria-hidden="true" />

      {/* Atmospheric Ambient Glow Pools matching website background */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="ambient-glow-cyan absolute -top-24 left-1/4 w-[700px] h-[550px] blur-[120px]" />
        <div className="ambient-glow-violet absolute top-1/3 -right-24 w-[750px] h-[600px] blur-[140px]" />
        <div className="ambient-glow-emerald absolute -bottom-32 left-1/3 w-[650px] h-[500px] blur-[130px]" />
        <div className="absolute inset-0 bg-cyber-grid pointer-events-none opacity-40" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-14 relative z-10">
        {/* Section Header Cluster */}
        <div className="space-y-6 pt-2 border-b border-white/[0.08] pb-10">
          {/* Classification Tag + Live Status Pill */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <span className="font-code-sm text-xs text-[#00f0ff] font-semibold tracking-wider">
                [07 // VALUE PROPOSITION]
              </span>
              <span className="text-white/20">·</span>
              <span className="font-code-sm text-slate-400 text-xs tracking-wider uppercase">
                EXPERIENCE &amp; ENGINEERING
              </span>
            </div>
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 bg-[#121520]/80 backdrop-blur-md border border-white/10 rounded-full text-[11px] font-code-sm text-slate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] hover:border-emerald-500/40 transition-colors duration-300">
              <span className="relative flex h-2 w-2 items-center justify-center">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60 animate-ping" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,1)]" />
              </span>
              <span className="uppercase tracking-widest text-[10px] font-medium text-emerald-300/90">
                OPEN TO MEANINGFUL OPPORTUNITIES
              </span>
            </div>
          </div>

          {/* Headline & Narrative Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8">
              <h2 className="font-headline-lg text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight font-bold leading-[1.1]">
                Why Work With{" "}
                <span className="text-luminous-duotone font-headline-lg font-bold drop-shadow-[0_0_28px_rgba(56,189,248,0.35)]">
                  Me
                </span>
              </h2>
              <p className="mt-4 font-body-lg text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
                I build responsive, user-friendly web applications by combining frontend development, backend engineering, database management, and practical problem-solving.
              </p>
            </div>

            {/* Resume-backed Focus Badges */}
            <div className="lg:col-span-4 flex flex-wrap lg:justify-end gap-2 font-code-sm text-xs">
              <div className="px-3 py-1.5 bg-[#0e1017]/90 border border-cyan-500/25 rounded-md flex items-center gap-2 shadow-[0_4px_16px_rgba(6,182,212,0.08)] transition-all duration-300 hover:border-cyan-400/50 hover:bg-[#121520]">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(56,189,248,0.9)]" />
                <span className="text-slate-200 tracking-wide">Responsive Frontend</span>
              </div>
              <div className="px-3 py-1.5 bg-[#0e1017]/90 border border-emerald-500/25 rounded-md flex items-center gap-2 shadow-[0_4px_16px_rgba(16,185,129,0.08)] transition-all duration-300 hover:border-emerald-400/50 hover:bg-[#121520]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
                <span className="text-slate-200 tracking-wide">Node &amp; Express APIs</span>
              </div>
              <div className="px-3 py-1.5 bg-[#0e1017]/90 border border-violet-500/25 rounded-md flex items-center gap-2 shadow-[0_4px_16px_rgba(168,85,247,0.08)] transition-all duration-300 hover:border-violet-400/50 hover:bg-[#121520]">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 shadow-[0_0_8px_rgba(167,139,250,0.9)]" />
                <span className="text-slate-200 tracking-wide">Full-Stack Fluency</span>
              </div>
            </div>
          </div>
        </div>

        {/* Core Content: 3 Resume-Based Value Proposition Cards */}
        <div
          aria-label="Core Engineering Pillars"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7 items-stretch"
        >
          {/* Card 01 — Responsive Frontend Development */}
          <article
            ref={(el) => (cardsRef.current[0] = el)}
            className="glass-craft-card card-cyan rounded-xl p-5 sm:p-6 lg:p-6 xl:p-7 flex flex-col justify-between group h-full"
          >
            <div className="space-y-4">
              {/* Header Block: Top Row with Icon, Classification & Right Telemetry Tag */}
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-lg bg-[#0e111a] border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:border-cyan-400 group-hover:text-cyan-200 transition-all duration-500 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] shrink-0">
                    <Layout className="w-5 h-5 sm:w-5.5 sm:h-5.5 stroke-[1.8] transition-transform duration-500 group-hover:scale-105" />
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[0_0_8px_#38bdf8]" />
                  </div>
                  <div>
                    <span className="font-mono text-[10px] text-cyan-400 block uppercase tracking-widest font-semibold">
                      PILLAR 01 // FRONTEND
                    </span>
                    <span className="font-mono text-[9px] text-slate-400 block tracking-tight">
                      Responsive UI &amp; Web Components
                    </span>
                  </div>
                </div>

                {/* Right Telemetry Badge reviewed from website */}
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#0a0c13]/90 border border-cyan-500/25 text-[10px] font-mono text-cyan-300 shadow-sm shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_6px_#38bdf8]" />
                  <span className="tracking-wide">100% RESPONSIVE</span>
                </div>
              </div>

              {/* Verified Tech Badges Strip filling width */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="font-mono text-[9px] sm:text-[9.5px] px-2.5 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 uppercase tracking-tight font-semibold shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                  Responsive Interfaces
                </span>
                <span className="font-mono text-[9px] sm:text-[9.5px] px-2 py-0.5 rounded bg-white/[0.04] text-slate-300 border border-white/10">
                  Reusable Components
                </span>
                <span className="font-mono text-[9px] sm:text-[9.5px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                  React.js
                </span>
                <span className="font-mono text-[9px] sm:text-[9.5px] px-2 py-0.5 rounded bg-white/[0.04] text-slate-300 border border-white/10">
                  HTML5 / CSS3
                </span>
              </div>

              {/* Title & Description */}
              <div>
                <h3 className="font-headline-sm text-xl sm:text-2xl font-bold text-white group-hover:text-cyan-100 transition-colors duration-300">
                  Responsive Frontend Development
                </h3>
                <p className="mt-2.5 font-body-sm text-sm text-slate-300 leading-relaxed font-normal">
                  I develop responsive, user-friendly interfaces using HTML, CSS, JavaScript, and React.js, focusing on clean layouts, reusable components, and practical user experiences.
                </p>
              </div>

              {/* Visual Preview: Responsive desktop-to-mobile interface mockup */}
              <div className="p-4 bg-[#0a0c13]/90 border border-white/10 rounded-lg space-y-3 transition-colors duration-300 group-hover:border-cyan-500/40 shadow-inner">
                <div className="flex justify-between items-center text-[10px] font-code-sm text-slate-400">
                  <span className="uppercase tracking-wider">Multi-Device Viewport</span>
                  <span className="text-cyan-400 flex items-center gap-1.5 font-medium">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_6px_#38bdf8]" />
                    Fluid CSS Grid &amp; Flexbox
                  </span>
                </div>
                {/* Interactive Breakpoint Strip */}
                <BreakpointStrip />
              </div>
            </div>

            {/* Bottom Footer Labels */}
            <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center justify-between font-code-sm text-[11px] text-slate-400">
              <span className="flex items-center gap-2">
                <span className="relative flex h-2 w-2 items-center justify-center">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-60 animate-ping" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyan-400 shadow-[0_0_8px_#38bdf8]" />
                </span>
                <span className="text-slate-300 font-medium">React.js</span>
              </span>
              <span className="px-2.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 font-medium">
                UI Development
              </span>
            </div>
          </article>

          {/* Card 02 — Backend & API Engineering */}
          <article
            ref={(el) => (cardsRef.current[1] = el)}
            className="glass-craft-card card-emerald rounded-xl p-5 sm:p-6 lg:p-6 xl:p-7 flex flex-col justify-between group h-full"
          >
            <div className="space-y-4">
              {/* Header Block: Top Row with Icon, Classification & Right Telemetry Tag */}
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-lg bg-[#0e111a] border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:border-emerald-400 group-hover:text-emerald-200 transition-all duration-500 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] shrink-0">
                    <Server className="w-5 h-5 sm:w-5.5 sm:h-5.5 stroke-[1.8] transition-transform duration-500 group-hover:scale-105" />
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[0_0_8px_#34d399]" />
                  </div>
                  <div>
                    <span className="font-mono text-[10px] text-emerald-400 block uppercase tracking-widest font-semibold">
                      PILLAR 02 // BACKEND
                    </span>
                    <span className="font-mono text-[9px] text-slate-400 block tracking-tight">
                      REST APIs &amp; Server Logic
                    </span>
                  </div>
                </div>

                {/* Right Telemetry Badge reviewed from website */}
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#0a0c13]/90 border border-emerald-500/25 text-[10px] font-mono text-emerald-300 shadow-sm shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#34d399]" />
                  <span className="tracking-wide">REST &amp; CRUD 200 OK</span>
                </div>
              </div>

              {/* Verified Tech Badges Strip filling width */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="font-mono text-[9px] sm:text-[9.5px] px-2.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 uppercase tracking-tight font-semibold shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                  REST API Development
                </span>
                <span className="font-mono text-[9px] sm:text-[9.5px] px-2 py-0.5 rounded bg-white/[0.04] text-slate-300 border border-white/10">
                  Database Management
                </span>
                <span className="font-mono text-[9px] sm:text-[9.5px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  Node.js &amp; Express
                </span>
                <span className="font-mono text-[9px] sm:text-[9.5px] px-2 py-0.5 rounded bg-white/[0.04] text-slate-300 border border-white/10">
                  Postman Verified
                </span>
              </div>

              {/* Title & Description */}
              <div>
                <h3 className="font-headline-sm text-xl sm:text-2xl font-bold text-white group-hover:text-emerald-100 transition-colors duration-300">
                  Backend &amp; API Engineering
                </h3>
                <p className="mt-2.5 font-body-sm text-sm text-slate-300 leading-relaxed font-normal">
                  I build server-side functionality using Node.js and Express.js, develop RESTful APIs, design database schemas, and implement authentication and CRUD operations for web applications.
                </p>
              </div>

              {/* Visual Preview: Clean API workflow diagram connecting frontend, backend, and DB */}
              <div className="p-4 bg-[#0a0c13]/90 border border-white/10 rounded-lg space-y-3 transition-colors duration-300 group-hover:border-emerald-500/40 shadow-inner">
                <div className="flex justify-between items-center text-[10px] font-code-sm text-slate-400">
                  <span className="uppercase tracking-wider">API Architecture Flow</span>
                  <span className="text-emerald-400 flex items-center gap-1.5 font-medium">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399] animate-pulse" />
                    Status 200 OK
                  </span>
                </div>

                {/* Workflow Diagram */}
                <div className="flex items-center justify-between pt-1 font-code-sm text-[10px]">
                  {/* Node 1: Client */}
                  <div className="text-center p-2 bg-[#121520] rounded border border-white/10 group-hover:border-emerald-500/30 transition-colors">
                    <span className="text-white font-medium block">Client UI</span>
                    <span className="text-[8px] text-slate-400">React App</span>
                  </div>

                  {/* Flow Arrow 1 */}
                  <div className="flex flex-col items-center">
                    <span className="text-[8px] text-emerald-300 font-mono">POST /api</span>
                    <span className="text-emerald-400 text-xs">→</span>
                  </div>

                  {/* Node 2: Server */}
                  <div className="text-center p-2 bg-[#121520] rounded border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.15)] group-hover:border-emerald-400 transition-colors">
                    <span className="text-emerald-300 font-semibold block">Express.js</span>
                    <span className="text-[8px] text-slate-400">REST Endpoints</span>
                  </div>

                  {/* Flow Arrow 2 */}
                  <div className="flex flex-col items-center">
                    <span className="text-[8px] text-emerald-300 font-mono">CRUD</span>
                    <span className="text-emerald-400 text-xs">⇄</span>
                  </div>

                  {/* Node 3: Database */}
                  <div className="text-center p-2 bg-[#121520] rounded border border-white/10 group-hover:border-emerald-500/30 transition-colors">
                    <span className="text-white font-medium block">Database</span>
                    <span className="text-[8px] text-slate-400">MongoDB / SQL</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Footer Labels */}
            <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center justify-between font-code-sm text-[11px] text-slate-400">
              <span className="flex items-center gap-2">
                <span className="relative flex h-2 w-2 items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                </span>
                <span className="text-slate-300 font-medium">Node.js &amp; Express.js</span>
              </span>
              <span className="px-2.5 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 font-medium">
                REST APIs
              </span>
            </div>
          </article>

          {/* Card 03 — End-to-End Full Stack Development */}
          <article
            ref={(el) => (cardsRef.current[2] = el)}
            className="glass-craft-card card-violet rounded-xl p-5 sm:p-6 lg:p-6 xl:p-7 flex flex-col justify-between group h-full md:col-span-2 lg:col-span-1"
          >
            <div className="space-y-4">
              {/* Header Block: Top Row with Icon, Classification & Right Telemetry Tag */}
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-lg bg-[#0e111a] border border-violet-500/30 flex items-center justify-center text-violet-400 group-hover:border-violet-400 group-hover:text-violet-200 transition-all duration-500 group-hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] shrink-0">
                    <Layers className="w-5 h-5 sm:w-5.5 sm:h-5.5 stroke-[1.8] transition-transform duration-500 group-hover:scale-105" />
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-violet-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[0_0_8px_#a855f7]" />
                  </div>
                  <div>
                    <span className="font-mono text-[10px] text-violet-400 block uppercase tracking-widest font-semibold">
                      PILLAR 03 // FULL STACK
                    </span>
                    <span className="font-mono text-[9px] text-slate-400 block tracking-tight">
                      End-to-End Architecture
                    </span>
                  </div>
                </div>

                {/* Right Telemetry Badge reviewed from website */}
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#0a0c13]/90 border border-violet-500/25 text-[10px] font-mono text-violet-300 shadow-sm shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse shadow-[0_0_6px_#c084fc]" />
                  <span className="tracking-wide">JWT &amp; MERN VERIFIED</span>
                </div>
              </div>

              {/* Verified Tech Badges Strip filling width */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="font-mono text-[9px] sm:text-[9.5px] px-2.5 py-0.5 rounded-full bg-violet-950/80 text-violet-300 border border-violet-500/40 uppercase tracking-tight font-semibold shadow-[0_0_10px_rgba(168,85,247,0.2)]">
                  Full Stack
                </span>
                <span className="font-mono text-[9px] sm:text-[9.5px] px-2 py-0.5 rounded bg-white/[0.04] text-slate-300 border border-white/10">
                  Secure Authentication
                </span>
                <span className="font-mono text-[9px] sm:text-[9.5px] px-2 py-0.5 rounded bg-violet-500/10 text-violet-300 border border-violet-500/25">
                  MongoDB &amp; React
                </span>
                <span className="font-mono text-[9px] sm:text-[9.5px] px-2 py-0.5 rounded bg-white/[0.04] text-slate-300 border border-white/10">
                  E-Commerce &amp; Marketplaces
                </span>
              </div>

              {/* Title & Description */}
              <div>
                <h3 className="font-headline-sm text-xl sm:text-2xl font-bold text-white group-hover:text-violet-100 transition-colors duration-300">
                  End-to-End Full Stack Development
                </h3>
                <p className="mt-2.5 font-body-sm text-sm text-slate-300 leading-relaxed font-normal">
                  I combine React.js, Node.js, Express.js, and MongoDB to develop complete web applications. My project experience includes freelancer marketplaces, e-commerce modules, and an online quiz platform.
                </p>
              </div>

              {/* Visual Preview: Full-stack architecture illustration */}
              <div className="p-4 bg-[#0a0c13]/90 border border-white/10 rounded-lg space-y-3 transition-colors duration-300 group-hover:border-violet-500/40 shadow-inner">
                <div className="flex justify-between items-center text-[10px] font-code-sm text-slate-400">
                  <span className="uppercase tracking-wider">Full-Stack Architecture</span>
                  <span className="text-violet-400 flex items-center gap-1.5 font-medium">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse shadow-[0_0_6px_#c084fc]" />
                    Full-Stack Pipeline
                  </span>
                </div>

                {/* Architecture Layers */}
                <div className="grid grid-cols-4 gap-1.5 pt-1 font-code-sm text-center">
                  <div className="p-1.5 bg-[#121520] rounded border border-white/10 group-hover:border-violet-500/30 transition-colors">
                    <span className="text-[10px] text-white font-medium block">React</span>
                    <span className="text-[8px] text-slate-400">Frontend</span>
                  </div>
                  <div className="p-1.5 bg-[#121520] rounded border border-violet-500/30 text-violet-300 shadow-[0_0_8px_rgba(168,85,247,0.15)]">
                    <span className="text-[10px] font-semibold block">JWT</span>
                    <span className="text-[8px] text-violet-300/80">Auth Guard</span>
                  </div>
                  <div className="p-1.5 bg-[#121520] rounded border border-white/10 group-hover:border-violet-500/30 transition-colors">
                    <span className="text-[10px] text-white font-medium block">Node</span>
                    <span className="text-[8px] text-slate-400">Express API</span>
                  </div>
                  <div className="p-1.5 bg-[#121520] rounded border border-white/10 group-hover:border-violet-500/30 transition-colors">
                    <span className="text-[10px] text-white font-medium block">MongoDB</span>
                    <span className="text-[8px] text-slate-400">Data Store</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Footer Labels */}
            <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center justify-between font-code-sm text-[11px] text-slate-400">
              <span className="flex items-center gap-2">
                <span className="relative flex h-2 w-2 items-center justify-center">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-60 animate-ping" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-violet-400 shadow-[0_0_8px_#c084fc]" />
                </span>
                <span className="text-slate-300 font-medium">MongoDB</span>
              </span>
              <span className="px-2.5 py-0.5 rounded bg-violet-950/60 border border-violet-500/30 text-violet-300 font-medium">
                JWT Authentication
              </span>
            </div>
          </article>
        </div>

        {/* Redesigned Bottom Technology Panel */}
        <div className="relative p-6 sm:p-8 bg-[#0e1017]/90 backdrop-blur-xl border border-white/10 rounded-xl flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 overflow-hidden shadow-2xl transition-all duration-300 hover:border-white/20">
          {/* Specular Top Light Line */}
          <div className="pointer-events-none absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/40 via-purple-400/40 to-transparent" />
          <div className="pointer-events-none absolute -right-24 -bottom-24 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl" />

          {/* Left: Core Technology Stack Badges */}
          <div className="space-y-3.5 relative z-10 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2 items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
              </span>
              <span className="font-code-sm uppercase tracking-widest text-[#00f0ff] text-xs font-semibold">
                CORE TECHNOLOGY STACK
              </span>
            </div>

            {/* Badges based on resume */}
            <div className="flex flex-wrap items-center gap-2 font-code-sm text-xs">
              {techBadges.map((badge) => {
                const colorMap = {
                  cyan: "bg-[#121520] border-cyan-500/25 text-slate-200 hover:border-cyan-400 hover:text-cyan-200 hover:bg-cyan-500/10",
                  emerald: "bg-[#121520] border-emerald-500/25 text-slate-200 hover:border-emerald-400 hover:text-emerald-200 hover:bg-emerald-500/10",
                  violet: "bg-[#121520] border-purple-500/25 text-slate-200 hover:border-purple-400 hover:text-purple-200 hover:bg-purple-500/10",
                  amber: "bg-[#121520] border-amber-500/25 text-slate-200 hover:border-amber-400 hover:text-amber-200 hover:bg-amber-500/10",
                };

                return (
                  <span
                    key={badge.label}
                    className={`px-3 py-1.5 border rounded transition-all duration-200 cursor-default shadow-sm ${colorMap[badge.color] || colorMap.cyan}`}
                  >
                    {badge.label}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Right: Ethos & Primary CTA Button */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 w-full lg:w-auto relative z-10">
            <div className="text-left sm:text-right">
              <span className="block font-code-sm text-[11px] text-cyan-300 uppercase tracking-wider font-semibold">
                BUILDING PRACTICAL DIGITAL SOLUTIONS
              </span>
              <span className="block font-code-sm text-xs text-slate-400 font-normal tracking-tight mt-0.5">
                Clean code. Reliable APIs. Responsive experiences.
              </span>
            </div>

            <button
              className="radiant-sheen whitespace-nowrap inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-[#00f0ff] to-[#00dbe9] hover:from-[#7df4ff] hover:to-[#00f0ff] text-[#06070a] font-code-sm uppercase tracking-widest text-xs font-bold rounded-lg transition-all duration-300 shadow-[0_0_20px_rgba(0,240,255,0.35)] hover:shadow-[0_0_28px_rgba(0,240,255,0.55)] hover:-translate-y-0.5 cursor-pointer group"
              onClick={handleExploreProjects}
              type="button"
            >
              <span>EXPLORE PROJECTS</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
