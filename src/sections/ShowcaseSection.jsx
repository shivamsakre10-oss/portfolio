import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  Users,
  Briefcase,
  GraduationCap,
  ExternalLink,
  Search,
  ShieldCheck,
  Bot,
  Calendar,
  Layers,
  Sparkles,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const AppShowcase = () => {
  const sectionRef = useRef(null);
  const ricRootRef = useRef(null);
  const sbWorkRef = useRef(null);
  const quizRef = useRef(null);

  useGSAP(
    () => {
      // Fade in main section safely
      gsap.fromTo(
        sectionRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
            once: true,
          },
        }
      );

      // Animate individual project showcase cards
      const cards = [ricRootRef.current, sbWorkRef.current, quizRef.current].filter(Boolean);
      cards.forEach((card, index) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: index * 0.15,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              start: "top 88%",
              once: true,
            },
          }
        );
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="scroll-mt-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
    >
      <span id="work" className="sr-only" aria-hidden="true" />
      {/* Eyebrow & Headline Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-[#3b494b]/30">
        <div>
          <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-lg bg-[#0d121d]/80 border border-[#3b494b]/40 mb-3 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00f2fe] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00f2fe]" />
            </span>
            <span className="font-code-sm text-xs text-[#00f0ff] uppercase tracking-widest">
              [04 // FEATURED WORKS]
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-[#e3e1e9] tracking-tight">
            Featured Projects
          </h2>
          <p className="text-[#b9cacb] text-sm md:text-base mt-2 max-w-2xl font-normal leading-relaxed">
            A collection of applications, digital products, and full-stack engineering projects.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#1a1b21]/70 border border-[#3b494b]/30 text-xs font-code-sm text-[#00f0ff]">
          <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-pulse" />
          <span>3 PRODUCTION BUILDS</span>
        </div>
      </div>

      {/* Main Showcase Layout */}
      <div className="flex flex-col xl:flex-row gap-8 lg:gap-10 items-stretch">
        {/* Flagship Large Card: RicRoot */}
        <div
          ref={ricRootRef}
          className="xl:w-[60%] flex flex-col justify-between rounded-2xl bg-[#0d121d]/90 border border-[#3b494b]/40 hover:border-[#00f0ff]/60 p-5 sm:p-6 lg:p-7 backdrop-blur-xl shadow-2xl transition-all duration-300 group overflow-hidden"
        >
          {/* Top Dashboard Visual Container — matching 2nd and 3rd project style */}
          <div className="relative w-full h-56 sm:h-64 md:h-72 lg:h-80 rounded-xl overflow-hidden bg-gradient-to-br from-[#0e1626] to-[#080c14] border border-[#3b494b]/30 mb-4 group/mockup">
            <img
              src="/images/ricroot-showcase.png"
              alt="RicRoot Recruitment Dashboard"
              className="w-full h-full object-cover object-top group-hover/mockup:scale-105 transition-transform duration-500 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d121d]/80 via-transparent to-transparent opacity-40 pointer-events-none" />
            <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#121318]/80 text-[#dbfcff] text-[11px] font-code-sm backdrop-blur-md border border-[#00f0ff]/30">
              <Users size={12} className="text-[#00f0ff]" />
              <span>WORKFORCE MANAGEMENT PLATFORM</span>
            </div>
            <div className="absolute top-3 right-3 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#0d121d]/85 border border-[#00f0ff]/40 text-[#00f0ff] text-[10px] font-mono backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] animate-ping" />
              <span>LIVE DASHBOARD</span>
            </div>
          </div>

          <div>
            {/* Category title line */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-code-sm text-[#00f0ff] tracking-wider uppercase font-semibold">
                WORKFORCE MANAGEMENT PLATFORM
              </span>
            </div>

            {/* Title */}
            <h3 className="text-xl sm:text-2xl font-bold font-display text-[#dbfcff] group-hover:text-white transition-colors leading-snug tracking-tight">
              RicRoot — Blue &amp; Grey Collar Workforce Platform
            </h3>

            {/* Compact Description */}
            <p className="text-[#b9cacb] text-xs sm:text-sm mt-2 leading-relaxed">
              RicRoot is a workforce hiring platform designed to connect employers with verified blue-collar and grey-collar talent. It provides tools for job discovery, candidate verification, recruitment management, AI-powered calling, interview scheduling, bulk hiring, and workforce pipeline tracking.
            </p>

            {/* Technology tags */}
            <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-white/[0.06]">
              <span className="px-2.5 py-0.5 rounded text-[11px] font-code-sm bg-white/[0.04] text-slate-300 border border-white/[0.08] hover:border-[#00f0ff]/40 hover:text-[#00f0ff] transition-colors cursor-default">
                Full-Stack Development
              </span>
              <span className="px-2.5 py-0.5 rounded text-[11px] font-code-sm bg-purple-500/10 text-[#d0bcff] border border-purple-500/25 hover:border-purple-400 hover:text-white transition-colors cursor-default">
                React.js
              </span>
              <span className="px-2.5 py-0.5 rounded text-[11px] font-code-sm bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 hover:border-emerald-400 hover:text-emerald-300 transition-colors cursor-default">
                Node.js
              </span>
              <span className="px-2.5 py-0.5 rounded text-[11px] font-code-sm bg-cyan-500/10 text-cyan-300 border border-cyan-500/25 hover:border-cyan-400 hover:text-cyan-200 transition-colors cursor-default">
                REST APIs
              </span>
            </div>

            {/* Feature Highlights Grid: Key Features (left) + Capabilities/Stack (right) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-white/[0.08]">
              {/* Column 1: Key Features */}
              <div className="space-y-2">
                <div className="text-[11px] font-code-sm uppercase tracking-widest text-[#00f0ff] font-semibold mb-2 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] animate-pulse" />
                  Key Platform Features
                </div>

                <div className="group/item flex items-start gap-2 p-1.5 rounded-lg hover:bg-white/[0.03] transition-colors">
                  <div className="p-1 rounded-md bg-[#00f0ff]/10 text-[#00f0ff] shrink-0 mt-0.5 border border-[#00f0ff]/20">
                    <Search size={12} />
                  </div>
                  <div className="text-xs leading-snug">
                    <strong className="text-white font-medium">Job Search &amp; Discovery</strong>
                    <span className="text-slate-400"> – Search jobs by role, location, and shift.</span>
                  </div>
                </div>

                <div className="group/item flex items-start gap-2 p-1.5 rounded-lg hover:bg-white/[0.03] transition-colors">
                  <div className="p-1 rounded-md bg-[#00f0ff]/10 text-[#00f0ff] shrink-0 mt-0.5 border border-[#00f0ff]/20">
                    <ShieldCheck size={12} />
                  </div>
                  <div className="text-xs leading-snug">
                    <strong className="text-white font-medium">Candidate Verification</strong>
                    <span className="text-slate-400"> – Digital candidate profiles and verification.</span>
                  </div>
                </div>

                <div className="group/item flex items-start gap-2 p-1.5 rounded-lg hover:bg-white/[0.03] transition-colors">
                  <div className="p-1 rounded-md bg-[#00f0ff]/10 text-[#00f0ff] shrink-0 mt-0.5 border border-[#00f0ff]/20">
                    <Bot size={12} />
                  </div>
                  <div className="text-xs leading-snug">
                    <strong className="text-white font-medium">AI Calling</strong>
                    <span className="text-slate-400"> – Automated candidate screening calls.</span>
                  </div>
                </div>

                <div className="group/item flex items-start gap-2 p-1.5 rounded-lg hover:bg-white/[0.03] transition-colors">
                  <div className="p-1 rounded-md bg-[#00f0ff]/10 text-[#00f0ff] shrink-0 mt-0.5 border border-[#00f0ff]/20">
                    <Calendar size={12} />
                  </div>
                  <div className="text-xs leading-snug">
                    <strong className="text-white font-medium">Interview Scheduler</strong>
                    <span className="text-slate-400"> – Interview booking and automated meeting links.</span>
                  </div>
                </div>

                <div className="group/item flex items-start gap-2 p-1.5 rounded-lg hover:bg-white/[0.03] transition-colors">
                  <div className="p-1 rounded-md bg-[#00f0ff]/10 text-[#00f0ff] shrink-0 mt-0.5 border border-[#00f0ff]/20">
                    <Layers size={12} />
                  </div>
                  <div className="text-xs leading-snug">
                    <strong className="text-white font-medium">Bulk Hiring</strong>
                    <span className="text-slate-400"> – Manage large-scale recruitment drives.</span>
                  </div>
                </div>
              </div>

              {/* Column 2: 3 Cards + Stack */}
              <div className="space-y-2 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="text-[11px] font-code-sm uppercase tracking-widest text-[#00f0ff] font-semibold mb-2 flex items-center gap-1.5">
                    <Sparkles size={12} />
                    Platform Capabilities
                  </div>

                  <div className="group/card p-2.5 rounded-xl bg-[#0c1322]/80 border border-white/[0.08] hover:border-[#00f0ff]/50 hover:shadow-[0_0_15px_rgba(0,240,255,0.15)] transition-all duration-300">
                    <div className="flex items-center gap-2 mb-0.5">
                      <Sparkles size={12} className="text-[#00f0ff]" />
                      <h4 className="text-xs font-semibold text-white tracking-wide group-hover/card:text-[#00f0ff] transition-colors">
                        Smart Recruitment
                      </h4>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Targeted candidate matching &amp; structured talent pools for blue &amp; grey collar roles.
                    </p>
                  </div>

                  <div className="group/card p-2.5 rounded-xl bg-[#0c1322]/80 border border-white/[0.08] hover:border-[#00f0ff]/50 hover:shadow-[0_0_15px_rgba(0,240,255,0.15)] transition-all duration-300">
                    <div className="flex items-center gap-2 mb-0.5">
                      <Bot size={12} className="text-[#00f0ff]" />
                      <h4 className="text-xs font-semibold text-white tracking-wide group-hover/card:text-[#00f0ff] transition-colors">
                        AI-Powered Screening
                      </h4>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Automated voice calling workflows to pre-qualify and verify candidates at scale.
                    </p>
                  </div>

                  <div className="group/card p-2.5 rounded-xl bg-[#0c1322]/80 border border-white/[0.08] hover:border-[#00f0ff]/50 hover:shadow-[0_0_15px_rgba(0,240,255,0.15)] transition-all duration-300">
                    <div className="flex items-center gap-2 mb-0.5">
                      <Layers size={12} className="text-[#00f0ff]" />
                      <h4 className="text-xs font-semibold text-white tracking-wide group-hover/card:text-[#00f0ff] transition-colors">
                        Workforce Management
                      </h4>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Full recruitment pipeline tracking from candidate screening to interview onboarding.
                    </p>
                  </div>
                </div>

                {/* Tech chips */}
                <div className="pt-2 border-t border-white/[0.06]">
                  <div className="text-[10px] font-code-sm uppercase tracking-widest text-slate-400 font-semibold mb-1.5">
                    Architecture &amp; Stack
                  </div>
                  <div className="flex flex-wrap gap-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-code-sm bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/25">
                      React.js
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-code-sm bg-purple-500/10 text-[#d0bcff] border border-purple-500/25">
                      Node.js
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-code-sm bg-slate-800/80 text-slate-300 border border-slate-700">
                      Express.js
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-code-sm bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
                      MongoDB
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-code-sm bg-cyan-500/10 text-cyan-300 border border-cyan-500/25">
                      REST APIs
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action Button */}
          <div className="mt-5 pt-4 border-t border-white/[0.08] flex flex-wrap items-center gap-3.5">
            <a
              href="https://ricroot.in"
              target="_blank"
              rel="noopener noreferrer"
              className="group/btn inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider font-bold text-[#030712] bg-[#00f0ff] hover:bg-[#5ff6ff] transition-all duration-200 shadow-[0_0_20px_rgba(0,240,255,0.35)] hover:shadow-[0_0_30px_rgba(0,240,255,0.6)] hover:-translate-y-0.5 active:scale-[0.98]"
            >
              <span>VISIT RICROOT</span>
              <ExternalLink size={14} className="transition-transform duration-200 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
            </a>

            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#121318]/90 border border-white/[0.08] text-xs font-mono text-slate-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>ricroot.in</span>
            </span>
          </div>
        </div>

        {/* Right Stacked Column: Library Management & YC Directory */}
        <div className="xl:w-[40%] flex flex-col sm:flex-row xl:flex-col gap-6 lg:gap-8">
          {/* Card 2: SB Work | Freelancer Marketplace */}
          <div
            ref={sbWorkRef}
            className="flex-1 rounded-2xl bg-[#0d121d]/90 border border-[#3b494b]/40 hover:border-[#00f0ff]/60 p-5 sm:p-6 backdrop-blur-xl shadow-2xl transition-all duration-300 group flex flex-col justify-between overflow-hidden"
          >
            <div className="relative w-full h-48 sm:h-52 md:h-56 rounded-xl overflow-hidden bg-gradient-to-br from-[#0e1626] to-[#080c14] border border-[#3b494b]/30 mb-4">
              <img
                src="/images/sbwork-showcase.png"
                alt="SB Work | Freelancer Marketplace"
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d121d]/80 via-transparent to-transparent opacity-40 pointer-events-none" />
              <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#121318]/80 text-[#dbfcff] text-[11px] font-code-sm backdrop-blur-md border border-[#00f0ff]/30">
                <Briefcase size={12} className="text-[#00f0ff]" />
                <span>FREELANCER MARKETPLACE</span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[11px] font-code-sm text-[#00f0ff] tracking-wider uppercase font-semibold">
                  FREELANCER MARKETPLACE
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-[#dbfcff] group-hover:text-[#00f0ff] transition-colors leading-snug">
                SB Work | Freelancer Marketplace
              </h3>
              <p className="text-[#b9cacb] text-xs sm:text-sm mt-2 leading-relaxed">
                A full-stack freelancer marketplace connecting clients and freelancers on a single platform. Includes separate authentication for clients and freelancers, responsive interfaces for project posting and browsing, and REST APIs for managing users, projects, applications, and proposals. Implemented JWT-based authentication and role-based authorization.
              </p>

              {/* Technology tags */}
              <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-white/[0.06]">
                <span className="px-2 py-0.5 rounded text-[11px] font-code-sm bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/25">
                  React.js
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-code-sm bg-purple-500/10 text-[#d0bcff] border border-purple-500/25">
                  Node.js
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-code-sm bg-slate-800/80 text-slate-300 border border-slate-700">
                  Express.js
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-code-sm bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
                  MongoDB
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-code-sm bg-cyan-500/10 text-cyan-300 border border-cyan-500/25">
                  JWT Authentication
                </span>
              </div>
            </div>
          </div>

          {/* Card 3: Online Quiz Web Application */}
          <div
            ref={quizRef}
            className="flex-1 rounded-2xl bg-[#0d121d]/90 border border-[#3b494b]/40 hover:border-[#d0bcff]/60 p-5 sm:p-6 backdrop-blur-xl shadow-2xl transition-all duration-300 group flex flex-col justify-between overflow-hidden"
          >
            <div className="relative w-full h-48 sm:h-52 md:h-56 rounded-xl overflow-hidden bg-gradient-to-br from-[#0e1626] to-[#080c14] border border-[#3b494b]/30 mb-4">
              <img
                src="/images/online-quiz-showcase.png"
                alt="Online Quiz Web Application"
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d121d]/80 via-transparent to-transparent opacity-40 pointer-events-none" />
              <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#121318]/80 text-[#dbfcff] text-[11px] font-code-sm backdrop-blur-md border border-[#d0bcff]/30">
                <GraduationCap size={12} className="text-[#d0bcff]" />
                <span>EDUCATION WEB APPLICATION</span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[11px] font-code-sm text-[#d0bcff] tracking-wider uppercase font-semibold">
                  EDUCATION WEB APPLICATION
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-[#dbfcff] group-hover:text-[#d0bcff] transition-colors leading-snug">
                Online Quiz Web Application
              </h3>
              <p className="text-[#b9cacb] text-xs sm:text-sm mt-2 leading-relaxed">
                A web-based quiz platform that enables college students to attempt subject-wise quizzes. Includes quiz and question management, student records, secure login and registration for students and administrators, and an admin panel for managing questions and monitoring student performance.
              </p>

              {/* Technology tags */}
              <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-white/[0.06]">
                <span className="px-2 py-0.5 rounded text-[11px] font-code-sm bg-purple-500/10 text-[#d0bcff] border border-purple-500/25">
                  React.js
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-code-sm bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/25">
                  Node.js
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-code-sm bg-slate-800/80 text-slate-300 border border-slate-700">
                  Express.js
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-code-sm bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
                  MongoDB
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppShowcase;
