import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Code2, Layers, Sparkles, ArrowRight } from "lucide-react";
import { smoothScrollTo } from "../utils/smoothScroll";

gsap.registerPlugin(ScrollTrigger);

export default function CapabilitiesSection() {
  const sectionRef = useRef(null);
  const card1Ref = useRef(null);
  const card2Ref = useRef(null);
  const card3Ref = useRef(null);

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReducedMotion) return;

      const cards = [card1Ref.current, card2Ref.current, card3Ref.current].filter(Boolean);
      if (cards.length > 0) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            stagger: 0.15,
            ease: "power3.out",
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

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);
  };

  const handleInitiateEngagement = (e) => {
    e.preventDefault();
    smoothScrollTo("contact");
  };

  return (
    <section
      ref={sectionRef}
      className="relative py-4 overflow-hidden scroll-mt-28"
      data-purpose="capabilities-showcase"
      id="services"
    >
      {/* Anchor alias so both #services and #capabilities work smoothly */}
      <span id="capabilities" className="sr-only" aria-hidden="true" />

      {/* Ambient Backdrop Effects */}
      <div className="absolute inset-0 cyber-grid pointer-events-none opacity-40" />
      <div className="absolute top-0 left-1/4 w-[650px] h-[500px] glow-orb-cyan rounded-full pointer-events-none -translate-y-1/2 blur-3xl" />
      <div className="absolute bottom-0 right-10 w-[700px] h-[550px] glow-orb-purple rounded-full pointer-events-none translate-y-1/3 blur-3xl" />

      {/* Decorative Top Edge Technical Line */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 md:mb-12">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 border-b border-slate-800/80 pb-5 justify-between">
          <div className="flex items-center gap-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
            </span>
            <div className="font-mono text-xs tracking-widest text-cyan-400 font-semibold uppercase flex items-center gap-2">
              <span>[05 // CAPABILITIES]</span>
              <span className="hidden sm:inline-block w-8 h-[1px] bg-cyan-500/40" />
              <span className="hidden sm:inline text-slate-500 text-[10px]">ENGINEERING SERVICES</span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              PRODUCTION READY
            </span>
            <span className="hidden md:inline-flex items-center gap-1.5 border-l border-slate-800 pl-4">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              MODULAR ARCHITECTURE
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 lg:mb-16" data-purpose="section-header">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display tracking-tight text-white mb-4 leading-tight">
            What I{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-300">
              Build
            </span>
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-slate-400 font-normal leading-relaxed">
            Full-lifecycle engineering engagements focused on high-availability cloud architecture, high-fidelity UI systems, and extreme performance.
          </p>
        </div>

        {/* Capabilities Cards Grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch"
          data-purpose="cards-grid"
        >
          {/* CARD 01: Custom Web Development */}
          <article
            ref={card1Ref}
            className="glass-card rounded-2xl p-7 sm:p-8 flex flex-col justify-between group overflow-hidden relative border border-slate-800/80 hover:border-cyan-400/50 hover:-translate-y-1.5 transition-all duration-300 h-full"
            data-purpose="capability-card-web"
            onMouseMove={handleMouseMove}
          >
            {/* Interactive Spotlight Glow */}
            <div
              className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background:
                  "radial-gradient(450px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(6, 182, 212, 0.14), transparent 70%)",
              }}
            />

            <div className="relative z-10">
              {/* Top Card Header: Icon & Index Badge */}
              <div className="flex items-center justify-between mb-7">
                {/* Squircle Icon Box */}
                <div className="w-12 h-12 rounded-xl bg-slate-900/90 border border-cyan-500/25 flex items-center justify-center shadow-lg shadow-cyan-950/40 text-cyan-400 group-hover:scale-105 group-hover:border-cyan-400/50 group-hover:text-cyan-300 group-hover:shadow-[0_0_20px_rgba(0,240,255,0.25)] transition-all duration-300">
                  <Code2 className="w-6 h-6 stroke-[1.8]" />
                </div>
                {/* Technical Index Indicator */}
                <span className="font-mono text-xs uppercase tracking-wider text-slate-400 font-medium group-hover:text-cyan-400 transition-colors">
                  01 // CUSTOM WEB
                </span>
              </div>

              {/* Title & Narrative */}
              <h3 className="text-xl sm:text-2xl font-bold font-display text-white mb-3 group-hover:text-cyan-100 transition-colors">
                Custom Web Development
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6 font-normal">
                Tailored applications with semantic structure, accessibility, optimized performance, and maintainable code.
              </p>
            </div>

            {/* Bottom Meta & Tags */}
            <div className="pt-6 border-t border-slate-800/80 relative z-10 mt-auto">
              {/* Spec Snapshot Micro-Metric */}
              <div className="mb-4 flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/80" />
                  SSR + CLIENT HYDRATION
                </span>
                <span className="text-slate-400">ACCESSIBLE &amp; SEMANTIC</span>
              </div>

              {/* Tech Tags Strip */}
              <div className="flex flex-wrap gap-1.5">
                <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-medium bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 hover:border-cyan-400/60 hover:text-white hover:bg-cyan-500/20 transition-all duration-200 cursor-default">
                  REACT 19
                </span>
                <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-medium bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 hover:border-cyan-400/60 hover:text-white hover:bg-cyan-500/20 transition-all duration-200 cursor-default">
                  NEXT.JS
                </span>
                <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-medium bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 hover:border-cyan-400/60 hover:text-white hover:bg-cyan-500/20 transition-all duration-200 cursor-default">
                  TYPESCRIPT
                </span>
                <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-medium bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 hover:border-cyan-400/60 hover:text-white hover:bg-cyan-500/20 transition-all duration-200 cursor-default">
                  VERCEL
                </span>
              </div>
            </div>
          </article>

          {/* CARD 02: Full Stack Architecture */}
          <article
            ref={card2Ref}
            className="glass-card rounded-2xl p-7 sm:p-8 flex flex-col justify-between group overflow-hidden relative border border-slate-800/80 hover:border-purple-400/50 hover:-translate-y-1.5 transition-all duration-300 h-full"
            data-purpose="capability-card-architecture"
            onMouseMove={handleMouseMove}
          >
            {/* Interactive Spotlight Glow */}
            <div
              className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background:
                  "radial-gradient(450px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(168, 85, 247, 0.14), transparent 70%)",
              }}
            />

            <div className="relative z-10">
              {/* Top Card Header: Icon & Index Badge */}
              <div className="flex items-center justify-between mb-7">
                {/* Squircle Icon Box */}
                <div className="w-12 h-12 rounded-xl bg-slate-900/90 border border-purple-500/25 flex items-center justify-center shadow-lg shadow-purple-950/40 text-purple-400 group-hover:scale-105 group-hover:border-purple-400/50 group-hover:text-purple-300 group-hover:shadow-[0_0_20px_rgba(168,85,247,0.25)] transition-all duration-300">
                  <Layers className="w-6 h-6 stroke-[1.8]" />
                </div>
                {/* Technical Index Indicator */}
                <span className="font-mono text-xs uppercase tracking-wider text-slate-400 font-medium group-hover:text-purple-400 transition-colors">
                  02 // FULL STACK
                </span>
              </div>

              {/* Title & Narrative */}
              <h3 className="text-xl sm:text-2xl font-bold font-display text-white mb-3 group-hover:text-purple-100 transition-colors">
                Full Stack Architecture
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6 font-normal">
                Modular, scalable application architecture with decoupled services, caching, and resilient persistence layers.
              </p>
            </div>

            {/* Bottom Meta & Tags */}
            <div className="pt-6 border-t border-slate-800/80 relative z-10 mt-auto">
              {/* Spec Snapshot Micro-Metric */}
              <div className="mb-4 flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400/80" />
                  EVENT-DRIVEN SERVICES
                </span>
                <span className="text-slate-400">RESILIENT PERSISTENCE</span>
              </div>

              {/* Tech Tags Strip */}
              <div className="flex flex-wrap gap-1.5">
                <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-medium bg-purple-500/10 text-purple-300 border border-purple-500/20 hover:border-purple-400/60 hover:text-white hover:bg-purple-500/20 transition-all duration-200 cursor-default">
                  NODE.JS
                </span>
                <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-medium bg-purple-500/10 text-purple-300 border border-purple-500/20 hover:border-purple-400/60 hover:text-white hover:bg-purple-500/20 transition-all duration-200 cursor-default">
                  EXPRESS.JS
                </span>
                <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-medium bg-purple-500/10 text-purple-300 border border-purple-500/20 hover:border-purple-400/60 hover:text-white hover:bg-purple-500/20 transition-all duration-200 cursor-default">
                  REST APIS
                </span>
                <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-medium bg-purple-500/10 text-purple-300 border border-purple-500/20 hover:border-purple-400/60 hover:text-white hover:bg-purple-500/20 transition-all duration-200 cursor-default">
                  MONGODB
                </span>
                <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-medium bg-purple-500/10 text-purple-300 border border-purple-500/20 hover:border-purple-400/60 hover:text-white hover:bg-purple-500/20 transition-all duration-200 cursor-default">
                  REDIS
                </span>
              </div>
            </div>
          </article>

          {/* CARD 03: Frontend & Micro-Interactions */}
          <article
            ref={card3Ref}
            className="glass-card rounded-2xl p-7 sm:p-8 flex flex-col justify-between group overflow-hidden relative border border-slate-800/80 hover:border-teal-400/50 hover:-translate-y-1.5 transition-all duration-300 h-full md:col-span-2 lg:col-span-1"
            data-purpose="capability-card-interaction"
            onMouseMove={handleMouseMove}
          >
            {/* Interactive Spotlight Glow */}
            <div
              className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background:
                  "radial-gradient(450px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(20, 184, 166, 0.14), transparent 70%)",
              }}
            />

            <div className="relative z-10">
              {/* Top Card Header: Icon & Index Badge */}
              <div className="flex items-center justify-between mb-7">
                {/* Squircle Icon Box */}
                <div className="w-12 h-12 rounded-xl bg-slate-900/90 border border-teal-500/25 flex items-center justify-center shadow-lg shadow-teal-950/40 text-teal-400 group-hover:scale-105 group-hover:border-teal-400/50 group-hover:text-teal-300 group-hover:shadow-[0_0_20px_rgba(20,184,166,0.25)] transition-all duration-300">
                  <Sparkles className="w-6 h-6 stroke-[1.8]" />
                </div>
                {/* Technical Index Indicator */}
                <span className="font-mono text-xs uppercase tracking-wider text-slate-400 font-medium group-hover:text-teal-400 transition-colors">
                  03 // FRONTEND &amp; UI
                </span>
              </div>

              {/* Title & Narrative */}
              <h3 className="text-xl sm:text-2xl font-bold font-display text-white mb-3 group-hover:text-teal-100 transition-colors">
                Frontend &amp; Micro-Interactions
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6 font-normal">
                Interactive user interfaces featuring refined animations, physics-inspired interactions, and smooth feedback.
              </p>
            </div>

            {/* Bottom Meta & Tags */}
            <div className="pt-6 border-t border-slate-800/80 relative z-10 mt-auto">
              {/* Spec Snapshot Micro-Metric */}
              <div className="mb-4 flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400/80" />
                  HARDWARE ACCELERATED
                </span>
                <span className="text-slate-400">PHYSICS-INSPIRED</span>
              </div>

              {/* Tech Tags Strip */}
              <div className="flex flex-wrap gap-1.5">
                <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-medium bg-teal-500/10 text-teal-300 border border-teal-500/20 hover:border-teal-400/60 hover:text-white hover:bg-teal-500/20 transition-all duration-200 cursor-default">
                  GSAP
                </span>
                <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-medium bg-teal-500/10 text-teal-300 border border-teal-500/20 hover:border-teal-400/60 hover:text-white hover:bg-teal-500/20 transition-all duration-200 cursor-default">
                  THREE.JS
                </span>
                <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-medium bg-teal-500/10 text-teal-300 border border-teal-500/20 hover:border-teal-400/60 hover:text-white hover:bg-teal-500/20 transition-all duration-200 cursor-default">
                  FRAMER MOTION
                </span>
                <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-medium bg-teal-500/10 text-teal-300 border border-teal-500/20 hover:border-teal-400/60 hover:text-white hover:bg-teal-500/20 transition-all duration-200 cursor-default">
                  CSS PHYSICS
                </span>
              </div>
            </div>
          </article>
        </div>

        {/* Quick Engineering Assurance Footnote / Architecture Bar */}
        <aside
          className="mt-14 pt-8 border-t border-slate-800/60 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500"
          data-purpose="audit-strip"
        >
          <div className="flex items-center gap-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span>SYSTEM BENCHMARK: PRODUCTION-GRADE ENGINEERING STANDARDS</span>
          </div>
          <div className="flex flex-wrap items-center gap-5 sm:gap-6">
            <span className="hover:text-slate-300 transition-colors cursor-default">
              TYPE-SAFE ARCHITECTURE
            </span>
            <span className="hover:text-slate-300 transition-colors cursor-default">
              PERFORMANCE DRIVEN
            </span>
            <a
              className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 transition-colors font-semibold group cursor-pointer"
              href="#contact"
              onClick={handleInitiateEngagement}
            >
              <span>INITIATE ENGAGEMENT</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </aside>
      </div>
    </section>
  );
}
