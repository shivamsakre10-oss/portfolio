import { useState, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  Search,
  Layout,
  Server,
  Database,
  CheckCircle2,
  GitBranch,
  Code2,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { smoothScrollTo } from "../utils/smoothScroll";

gsap.registerPlugin(ScrollTrigger);

export default function DevelopmentProcess() {
  const [activePhase, setActivePhase] = useState(0);

  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  const phases = [
    {
      id: "phase-01",
      number: "01",
      title: "Requirements & Planning",
      shortTitle: "01. Requirements",
      color: "cyan",
      hoverClass: "hover-glow-cyan",
      borderClass: "border-cyan-500/30 hover:border-cyan-400/70",
      activeBorderClass: "border-cyan-400 ring-2 ring-cyan-400/50 shadow-[0_0_25px_rgba(6,182,212,0.3)]",
      auraBg: "bg-cyan-500/15 group-hover:bg-cyan-400/25",
      auraBgBottom: "bg-cyan-600/10",
      auraDelay: "-2.5s",
      beamColor: "via-cyan-400",
      pillBadge: "text-cyan-300 bg-cyan-950/70 border-cyan-500/35",
      pingColor: "bg-cyan-400 shadow-[0_0_6px_#22d3ee]",
      iconBg: "bg-cyan-950/50 border-cyan-500/35 text-cyan-400 group-hover:text-cyan-100 group-hover:border-cyan-400/70 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]",
      titleHover: "group-hover:text-cyan-200",
      dotColor: "bg-cyan-400",
      footerLeft: "REQUIREMENTS",
      footerRight: "PROJECT PLANNING",
      metricBadge: "text-cyan-300 bg-cyan-950/60 border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.15)] group-hover:border-cyan-400/50 group-hover:shadow-[0_0_15px_rgba(6,182,212,0.25)]",
      metricPing: "bg-cyan-400",
      shimmerColor: "via-cyan-400/20",
      shimmerDelay: "0s",
      description:
        "Understand project requirements, define application features, and plan the frontend, backend, and database structure.",
      Icon: Search,
    },
    {
      id: "phase-02",
      number: "02",
      title: "UI Development",
      shortTitle: "02. UI Dev",
      color: "purple",
      hoverClass: "hover-glow-purple",
      borderClass: "border-purple-500/30 hover:border-purple-400/70",
      activeBorderClass: "border-purple-400 ring-2 ring-purple-400/50 shadow-[0_0_25px_rgba(168,85,247,0.3)]",
      auraBg: "bg-purple-500/15 group-hover:bg-purple-400/25",
      auraBgBottom: "bg-purple-600/10",
      auraDelay: "-3.5s",
      beamColor: "via-purple-400",
      pillBadge: "text-purple-300 bg-purple-950/70 border-purple-500/35",
      pingColor: "bg-purple-400 shadow-[0_0_6px_#c084fc]",
      iconBg: "bg-purple-950/50 border-purple-500/35 text-purple-400 group-hover:text-purple-100 group-hover:border-purple-400/70 group-hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]",
      iconDelay: "-1s",
      titleHover: "group-hover:text-purple-200",
      dotColor: "bg-purple-400",
      footerLeft: "REACT.JS",
      footerRight: "RESPONSIVE UI",
      metricBadge: "text-purple-300 bg-purple-950/60 border-purple-500/30 shadow-[0_0_10px_rgba(168,85,247,0.15)] group-hover:border-purple-400/50 group-hover:shadow-[0_0_15px_rgba(168,85,247,0.25)]",
      metricPing: "bg-purple-400",
      shimmerColor: "via-purple-400/20",
      shimmerDelay: "-1.2s",
      description:
        "Build responsive user interfaces using HTML, CSS, JavaScript, and React.js, focusing on reusable components and user-friendly layouts.",
      Icon: Layout,
    },
    {
      id: "phase-03",
      number: "03",
      title: "Backend & API Development",
      shortTitle: "03. Backend APIs",
      color: "emerald",
      hoverClass: "hover-glow-emerald",
      borderClass: "border-emerald-500/30 hover:border-emerald-400/70",
      activeBorderClass: "border-emerald-400 ring-2 ring-emerald-400/50 shadow-[0_0_25px_rgba(16,185,129,0.3)]",
      auraBg: "bg-emerald-500/15 group-hover:bg-emerald-400/25",
      auraBgBottom: "bg-emerald-600/10",
      auraDelay: "-4s",
      beamColor: "via-emerald-400",
      pillBadge: "text-emerald-300 bg-emerald-950/70 border-emerald-500/35",
      pingColor: "bg-emerald-400 shadow-[0_0_6px_#34d399]",
      iconBg: "bg-emerald-950/50 border-emerald-500/35 text-emerald-400 group-hover:text-emerald-100 group-hover:border-emerald-400/70 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]",
      iconDelay: "-2s",
      titleHover: "group-hover:text-emerald-200",
      dotColor: "bg-emerald-400",
      footerLeft: "NODE.JS",
      footerRight: "REST APIs",
      metricBadge: "text-emerald-300 bg-emerald-950/60 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.15)] group-hover:border-emerald-400/50 group-hover:shadow-[0_0_15px_rgba(16,185,129,0.25)]",
      metricPing: "bg-emerald-400",
      shimmerColor: "via-emerald-400/20",
      shimmerDelay: "-2.3s",
      description:
        "Develop backend functionality using Node.js and Express.js, including REST API endpoints, application logic, and CRUD operations.",
      Icon: Server,
    },
    {
      id: "phase-04",
      number: "04",
      title: "Database & Authentication",
      shortTitle: "04. Database & Auth",
      color: "amber",
      hoverClass: "hover-glow-amber",
      borderClass: "border-amber-500/30 hover:border-amber-400/70",
      activeBorderClass: "border-amber-400 ring-2 ring-amber-400/50 shadow-[0_0_25px_rgba(245,158,11,0.3)]",
      auraBg: "bg-amber-500/15 group-hover:bg-amber-400/25",
      auraBgBottom: "bg-amber-600/10",
      auraDelay: "-1.5s",
      beamColor: "via-amber-400",
      pillBadge: "text-amber-300 bg-amber-950/70 border-amber-500/35",
      pingColor: "bg-amber-400 shadow-[0_0_5px_#fcd34d]",
      iconBg: "bg-amber-950/50 border-amber-500/35 text-amber-400 group-hover:text-amber-100 group-hover:border-amber-400/70 group-hover:shadow-[0_0_20px_rgba(245,158,11,0.4)]",
      iconDelay: "-3s",
      titleHover: "group-hover:text-amber-200",
      dotColor: "bg-amber-400",
      footerLeft: "MONGODB",
      footerRight: "JWT AUTH",
      metricBadge: "text-amber-300 bg-amber-950/60 border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.15)] group-hover:border-amber-400/50 group-hover:shadow-[0_0_15px_rgba(245,158,11,0.25)]",
      metricPing: "bg-amber-400",
      shimmerColor: "via-amber-400/20",
      shimmerDelay: "-0.7s",
      description:
        "Work with MongoDB and SQL databases, implement database operations, and apply JWT-based authentication and authorization where required.",
      Icon: Database,
    },
    {
      id: "phase-05",
      number: "05",
      title: "Testing & Debugging",
      shortTitle: "05. Testing",
      color: "sky",
      hoverClass: "hover-glow-sky",
      borderClass: "border-sky-500/30 hover:border-sky-400/70",
      activeBorderClass: "border-sky-400 ring-2 ring-sky-400/50 shadow-[0_0_25px_rgba(14,165,233,0.3)]",
      auraBg: "bg-sky-500/15 group-hover:bg-sky-400/25",
      auraBgBottom: "bg-sky-600/10",
      auraDelay: "-4.8s",
      beamColor: "via-sky-400",
      pillBadge: "text-sky-300 bg-sky-950/70 border-sky-500/35",
      pingColor: "bg-sky-400 shadow-[0_0_5px_#38bdf8]",
      iconBg: "bg-sky-950/50 border-sky-500/35 text-sky-400 group-hover:text-sky-100 group-hover:border-sky-400/70 group-hover:shadow-[0_0_20px_rgba(14,165,233,0.4)]",
      iconDelay: "-1.7s",
      titleHover: "group-hover:text-sky-200",
      dotColor: "bg-sky-400",
      footerLeft: "POSTMAN",
      footerRight: "DEBUGGING",
      metricBadge: "text-sky-300 bg-sky-950/60 border-sky-500/30 shadow-[0_0_10px_rgba(14,165,233,0.15)] group-hover:border-sky-400/50 group-hover:shadow-[0_0_15px_rgba(14,165,233,0.25)]",
      metricPing: "bg-sky-400",
      shimmerColor: "via-sky-400/20",
      shimmerDelay: "-1.9s",
      description:
        "Test API endpoints using Postman, debug application issues, and verify application functionality throughout development.",
      Icon: CheckCircle2,
    },
    {
      id: "phase-06",
      number: "06",
      title: "Version Control & Delivery",
      shortTitle: "06. Delivery",
      color: "fuchsia",
      hoverClass: "hover-glow-fuchsia",
      borderClass: "border-fuchsia-500/30 hover:border-fuchsia-400/70",
      activeBorderClass: "border-fuchsia-400 ring-2 ring-fuchsia-400/50 shadow-[0_0_25px_rgba(217,70,239,0.3)]",
      auraBg: "bg-fuchsia-500/15 group-hover:bg-fuchsia-400/25",
      auraBgBottom: "bg-fuchsia-600/10",
      auraDelay: "-2.8s",
      beamColor: "via-fuchsia-400",
      pillBadge: "text-fuchsia-300 bg-fuchsia-950/70 border-fuchsia-500/35",
      pingColor: "bg-fuchsia-400 shadow-[0_0_5px_#f0abfc]",
      iconBg: "bg-fuchsia-950/50 border-fuchsia-500/35 text-fuchsia-400 group-hover:text-fuchsia-100 group-hover:border-fuchsia-400/70 group-hover:shadow-[0_0_20px_rgba(217,70,239,0.4)]",
      iconDelay: "-2.4s",
      titleHover: "group-hover:text-fuchsia-200",
      dotColor: "bg-fuchsia-400",
      footerLeft: "GIT",
      footerRight: "GITHUB",
      metricBadge: "text-fuchsia-300 bg-fuchsia-950/60 border-fuchsia-500/30 shadow-[0_0_10px_rgba(217,70,239,0.15)] group-hover:border-fuchsia-400/50 group-hover:shadow-[0_0_15px_rgba(217,70,239,0.25)]",
      metricPing: "bg-fuchsia-400",
      shimmerColor: "via-fuchsia-400/20",
      shimmerDelay: "-3.1s",
      description:
        "Manage source code with Git and GitHub, organize project changes, and prepare applications for deployment using the project's actual deployment setup.",
      Icon: GitBranch,
    },
  ];

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReducedMotion) return;

      const validCards = cardsRef.current.filter(Boolean);
      if (validCards.length > 0) {
        gsap.fromTo(
          validCards,
          { opacity: 0, y: 32 },
          {
            opacity: 1,
            y: 0,
            duration: 0.65,
            stagger: 0.08,
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

  const handleStepClick = (index) => {
    setActivePhase(index);
    const cardEl = document.getElementById(phases[index].id);
    if (cardEl) {
      cardEl.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const handleProjectsClick = (e) => {
    e.preventDefault();
    smoothScrollTo("work");
  };

  return (
    <section
      ref={sectionRef}
      className="scroll-mt-28 relative overflow-hidden text-slate-100 font-sans antialiased selection:bg-cyan-500/30 selection:text-cyan-200"
      data-purpose="development-process"
      id="process"
    >
      {/* Anchor alias so both #process and #development-process work */}
      <span id="development-process" className="sr-only" aria-hidden="true" />

      {/* Ambient Backdrop */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none z-0 overflow-hidden"
      >
        <div className="absolute inset-0 bg-cyber-grid pointer-events-none opacity-40" />
        <div className="absolute -top-40 left-1/4 w-[700px] h-[450px] bg-[#00f0ff]/10 rounded-full blur-[130px] pointer-events-none animate-ambient-glow" />
        <div
          className="absolute top-1/3 -right-24 w-[650px] h-[650px] bg-[#571bc1]/15 rounded-full blur-[150px] pointer-events-none animate-ambient-glow"
          style={{ animationDelay: "3s" }}
        />
        <div
          className="absolute -bottom-24 left-1/3 w-[600px] h-[550px] bg-[#00dbe9]/10 rounded-full blur-[140px] pointer-events-none animate-ambient-glow"
          style={{ animationDelay: "6s" }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <header className="mb-12 sm:mb-16" data-purpose="section-header">
            <div className="flex items-center gap-3 mb-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/50 border border-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.15)]">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#22d3ee]" />
                <span className="font-mono text-[11px] sm:text-xs font-semibold tracking-widest text-cyan-300 uppercase">
                  [06 // DEVELOPMENT WORKFLOW]
                </span>
              </div>
              <div className="h-px bg-gradient-to-r from-cyan-500/40 via-slate-800 to-transparent flex-1 max-w-sm" />
            </div>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-slate-400 tracking-[-0.03em] leading-[1.1]">
              How I Build
            </h2>
            <p className="mt-3.5 sm:mt-4 text-sm sm:text-base lg:text-lg text-slate-400 max-w-3xl leading-relaxed font-normal">
              From understanding requirements to developing, testing, and deploying web applications—with a focus on clean code, reliable APIs, and maintainable full-stack solutions.
            </p>

            {/* Stepper Rail in Header */}
            <div className="mt-8 sm:mt-10 pt-5 border-t border-slate-800/80">
              <div className="relative">
                {/* Connecting hairline track on desktop */}
                <div className="hidden lg:block absolute top-1/2 left-0 right-0 -translate-y-1/2 h-[1px] bg-slate-800/90 z-0" />

                {/* Horizontal scroll on mobile/tablet, 6-col grid on desktop */}
                <div className="flex lg:grid lg:grid-cols-6 gap-2.5 sm:gap-3 overflow-x-auto no-scrollbar py-1 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0">
                  {phases.map((p, idx) => {
                    const isSelected = activePhase === idx;
                    return (
                      <button
                        key={p.id}
                        onClick={() => handleStepClick(idx)}
                        type="button"
                        className={`relative z-10 shrink-0 min-w-max lg:min-w-0 flex items-center gap-2 sm:gap-2.5 px-3 py-2 rounded-lg font-mono text-xs transition-all duration-200 cursor-pointer text-left ${
                          isSelected
                            ? "bg-[#1e1f25] border border-cyan-400/60 shadow-[0_0_16px_rgba(0,240,255,0.22)] text-cyan-300"
                            : "bg-[#1a1b21]/80 border border-[#3b494b]/40 hover:border-slate-600 text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        {isSelected ? (
                          <span className="relative flex h-2 w-2 shrink-0">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
                          </span>
                        ) : (
                          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${p.dotColor}`} />
                        )}
                        <span className="tracking-tight font-medium whitespace-nowrap">
                          {p.shortTitle}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </header>

          {/* Process Grid: 3 columns on desktop, 2 on tablet, 1 on mobile */}
          <section
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6 scroll-mt-24 items-stretch"
            data-purpose="phases-grid"
            id="pipeline-grid"
          >
            {phases.map((phase, idx) => {
              const isActive = activePhase === idx;
              const CardIcon = phase.Icon;

              return (
                <article
                  key={phase.id}
                  id={phase.id}
                  ref={(el) => (cardsRef.current[idx] = el)}
                  onClick={() => setActivePhase(idx)}
                  className={`phase-card ${phase.hoverClass} group relative rounded-2xl bg-gradient-to-b from-[#1a1b21]/90 to-[#121318]/90 border ${
                    isActive ? phase.activeBorderClass : phase.borderClass
                  } p-6 sm:p-7 backdrop-blur-xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_10px_30px_rgba(0,0,0,0.5)] flex flex-col justify-between overflow-hidden transition-all duration-300 cursor-pointer h-full`}
                  data-purpose="phase-card"
                >
                  {/* Luminous hairline border beam */}
                  <div
                    className={`absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent ${phase.beamColor} to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500`}
                  />
                  <div
                    className={`absolute -top-16 -right-16 w-48 h-48 ${phase.auraBg} rounded-full blur-3xl pointer-events-none animate-card-aura transition-all duration-500`}
                  />
                  <div
                    className={`absolute -bottom-20 -left-20 w-40 h-40 ${phase.auraBgBottom} rounded-full blur-2xl pointer-events-none animate-card-aura`}
                    style={{ animationDelay: phase.auraDelay }}
                  />

                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-5">
                      {/* Phase number pill badge */}
                      <span
                        className={`inline-flex items-center gap-2 font-mono text-xs font-bold tracking-wider ${phase.pillBadge} px-3 py-1 rounded-full shadow-[0_0_12px_rgba(6,182,212,0.15)] group-hover:shadow-[0_0_18px_rgba(6,182,212,0.3)] transition-all`}
                      >
                        <span className="relative flex h-2 w-2">
                          <span
                            className={`animate-ping absolute inline-flex h-full w-full rounded-full ${phase.pingColor} opacity-75`}
                          />
                          <span
                            className={`relative inline-flex rounded-full h-2 w-2 ${phase.pingColor}`}
                          />
                        </span>
                        PHASE {phase.number}
                      </span>

                      {/* Tech Icon squircle */}
                      <div
                        className={`w-10 h-10 rounded-xl ${phase.iconBg} shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),0_0_15px_rgba(6,182,212,0.15)] flex items-center justify-center transition-all duration-300 group-hover:scale-105`}
                        style={
                          phase.iconDelay
                            ? { animationDelay: phase.iconDelay }
                            : undefined
                        }
                      >
                        <CardIcon className="w-5 h-5 stroke-[1.8] group-hover:scale-110 transition-transform duration-200" />
                      </div>
                    </div>

                    <h3
                      className={`text-xl font-bold font-display text-white ${phase.titleHover} tracking-tight transition-colors flex items-center gap-2`}
                    >
                      {phase.title}
                    </h3>
                    <p className="mt-3 text-sm text-slate-400 leading-relaxed font-normal">
                      {phase.description}
                    </p>
                  </div>

                  {/* Footer metadata: Domain & Deliverable */}
                  <div className="relative z-10 mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono transition-colors">
                    <span className="text-slate-400 font-medium flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${phase.dotColor}`} />
                      {phase.footerLeft}
                    </span>

                    {/* Deliverable badge */}
                    <span
                      className={`relative overflow-hidden inline-flex items-center gap-1.5 font-semibold px-2.5 py-1 rounded ${phase.metricBadge} transition-all`}
                    >
                      <span className="relative flex h-1.5 w-1.5">
                        <span
                          className={`animate-ping absolute inline-flex h-full w-full rounded-full ${phase.metricPing} opacity-75`}
                        />
                        <span
                          className={`relative inline-flex rounded-full h-1.5 w-1.5 ${phase.metricPing}`}
                        />
                      </span>
                      <span>{phase.footerRight}</span>
                      <span
                        className={`absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent ${phase.shimmerColor} to-transparent skew-x-12 animate-shimmer pointer-events-none`}
                        style={{ animationDelay: phase.shimmerDelay }}
                      />
                    </span>
                  </div>
                </article>
              );
            })}
          </section>

          {/* Bottom Information Panel: Full Stack Development */}
          <aside
            className="mt-12 sm:mt-16 rounded-2xl border border-[#3b494b]/40 bg-[#1a1b21]/70 p-6 sm:p-8 backdrop-blur-md flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 overflow-hidden relative shadow-xl"
            data-purpose="pipeline-summary"
          >
            <div className="absolute -top-24 left-1/4 w-80 h-32 bg-[#00f0ff]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00f0ff]/30 to-transparent" />

            <div className="relative z-10 flex items-start sm:items-center gap-4 sm:gap-5">
              <div className="relative flex items-center justify-center shrink-0">
                <div className="absolute inset-0 rounded-2xl bg-[#00f0ff]/20 blur-md" />
                <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-b from-[#1e1f25] to-[#121318] border border-[#00f0ff]/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_4px_16px_rgba(0,0,0,0.4)] flex items-center justify-center text-cyan-300">
                  <Code2 className="w-6 h-6 sm:w-7 sm:h-7 stroke-[1.8]" />
                </div>
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <h3 className="text-base sm:text-lg font-semibold text-white tracking-tight">
                    Full Stack Development
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 shadow-[0_0_8px_rgba(6,182,212,0.2)]">
                    MERN STACK
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
                  Building practical web applications with React.js, Node.js, Express.js, MongoDB, REST APIs, and secure authentication.
                </p>
              </div>
            </div>

            <div className="relative z-10 flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <button
                className="relative group px-5 sm:px-6 py-2.5 text-xs font-mono font-semibold rounded-xl bg-gradient-to-b from-[#00f0ff] to-[#00dbe9] hover:from-[#7df4ff] hover:to-[#00f0ff] text-[#06070a] transition-all duration-200 shadow-[0_0_20px_rgba(0,240,255,0.3),inset_0_1px_0_rgba(255,255,255,0.4)] flex items-center justify-center gap-2 cursor-pointer flex-1 sm:flex-initial"
                onClick={handleProjectsClick}
                type="button"
              >
                <span>View Featured Projects</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1 duration-150" />
              </button>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 sm:px-5 py-2.5 text-xs font-mono font-medium rounded-xl border border-slate-700/80 hover:border-slate-600 bg-[#121318]/70 hover:bg-[#1e1f25] text-slate-300 hover:text-white transition-all duration-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] cursor-pointer flex items-center justify-center gap-2 flex-1 sm:flex-initial"
              >
                <span>GitHub Profile</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
