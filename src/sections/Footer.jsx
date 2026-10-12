import { useState } from "react";
import { Link as ScrollLink, animateScroll as scroll } from "react-scroll";

/* -------------------------------------------------------------------------- */
/* Data Definitions from Resume                                               */
/* -------------------------------------------------------------------------- */
const PERSONAL_INFO = {
  name: "Shivam Sakre",
  monogram: "SS",
  role: "Full Stack Developer | MERN Stack Developer",
  location: "Ahmedabad, Gujarat",
  email: "Shivamsakre10@gmail.com",
  intro:
    "Building responsive, user-friendly web applications with modern frontend technologies, scalable backend APIs, and efficient database solutions.",
  status: "Available for Opportunities",
};

const NAV_LINKS = [
  { name: "Home", targetId: "home", code: "01" },
  { name: "About", targetId: "about", code: "02" },
  { name: "Skills", targetId: "skills", code: "03" },
  { name: "Experience", targetId: "experience", code: "04" },
  { name: "Projects", targetId: "work", code: "05" },
  { name: "Contact", targetId: "contact", code: "06" },
];

const TECHNOLOGIES = [
  "React.js",
  "Node.js",
  "Express.js",
  "MongoDB",
  "JavaScript",
  "REST APIs",
];

const SOCIAL_LINKS = [
  {
    name: "GitHub",
    url: "https://github.com/shivamsakre10-oss",
    handle: "shivamsakre10-oss",
    type: "github",
  },
  {
    name: "LinkedIn",
    url: "https://linkedin.com/in/shivam-sakre",
    handle: "shivam-sakre",
    type: "linkedin",
  },
  {
    name: "Portfolio",
    url: "https://shivamsakre.in",
    handle: "shivamsakre.in",
    type: "portfolio",
  },
];

/* -------------------------------------------------------------------------- */
/* Vector Icons Matching Website Aesthetics                                   */
/* -------------------------------------------------------------------------- */
function SocialIcon({ type }) {
  if (type === "github") {
    return (
      <svg
        className="w-4 h-4"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
        />
      </svg>
    );
  }
  if (type === "linkedin") {
    return (
      <svg
        className="w-4 h-4"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.68 1.68 0 1 0 0-3.36 1.68 1.68 0 0 0 0 3.36m1.39 9.74v-8.37H5.07v8.37h2.78z" />
      </svg>
    );
  }
  return (
    <svg
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* Main Footer Component with react-scroll Links                              */
/* -------------------------------------------------------------------------- */
export default function Footer() {
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = (e) => {
    e.preventDefault();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(PERSONAL_INFO.email);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2200);
    }
  };

  return (
    <footer
      id="portfolio-footer"
      className="w-full relative border-t border-[#3b494b]/35 bg-[#07090e] text-[#e1e2e9] z-20 font-code-sm overflow-hidden"
    >
      {/* Specular Ambient Glow & Grid Backdrop */}
      <div className="absolute inset-0 pointer-events-none cyber-grid opacity-20 z-0" />
      <div className="pointer-events-none absolute -top-40 left-1/4 w-96 h-96 bg-[#00f0ff]/5 rounded-full blur-3xl z-0" />
      <div className="pointer-events-none absolute -bottom-40 right-1/4 w-96 h-96 bg-[#a855f7]/5 rounded-full blur-3xl z-0" />
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00f0ff]/40 via-[#9cf0ff]/20 to-transparent z-10" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-12">
        {/* ================================================================ */}
        {/* Main Content Grid: Identity, Quick Nav, Direct Connect          */}
        {/* ================================================================ */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 items-start">
          {/* -------------------------------------------------------------- */}
          {/* Col 1: Identity & Role (lg: 5 cols)                            */}
          {/* -------------------------------------------------------------- */}
          <div className="lg:col-span-5 space-y-5">
            {/* Logo + Monogram: ScrollLink to Home */}
            <div className="flex items-center gap-3">
              <ScrollLink
                to="home"
                smooth="easeInOutQuart"
                duration={800}
                offset={0}
                className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#00f0ff]/10 border border-[#00f0ff]/30 text-[#00f0ff] font-code-md font-bold text-sm shadow-[0_0_12px_rgba(0,240,255,0.25)] hover:border-[#00f0ff] hover:shadow-[0_0_16px_rgba(0,240,255,0.45)] transition-all duration-300 cursor-pointer"
                aria-label={PERSONAL_INFO.name}
              >
                {PERSONAL_INFO.monogram}
              </ScrollLink>
              <div>
                <ScrollLink
                  to="home"
                  smooth="easeInOutQuart"
                  duration={800}
                  offset={0}
                  className="font-headline-sm text-lg sm:text-xl font-bold tracking-wider text-white hover:text-[#00f0ff] transition-colors duration-200 block cursor-pointer"
                >
                  {PERSONAL_INFO.name.toUpperCase()}
                </ScrollLink>
                <span className="font-code-sm text-xs text-[#00f0ff] tracking-tight block font-medium">
                  {PERSONAL_INFO.role}
                </span>
              </div>
            </div>

            {/* Short Introduction */}
            <p className="font-body-sm text-sm text-slate-300 leading-relaxed max-w-md font-normal">
              "{PERSONAL_INFO.intro}"
            </p>

            {/* Telemetry Status & Location Tags */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              {/* Location Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#11141e] border border-white/10 text-slate-300 font-code-sm text-xs">
                <svg
                  className="w-3.5 h-3.5 text-[#00f0ff]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span>{PERSONAL_INFO.location}</span>
              </div>

              {/* Live Availability Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#11141e] border border-emerald-500/30 text-emerald-300 font-code-sm text-xs shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_6px_#10b981]" />
                </span>
                <span>{PERSONAL_INFO.status}</span>
              </div>
            </div>
          </div>

          {/* -------------------------------------------------------------- */}
          {/* Col 2: Quick Navigation Links with react-scroll (lg: 3 cols)   */}
          {/* -------------------------------------------------------------- */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center gap-2 pb-1 border-b border-white/[0.08]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] shadow-[0_0_6px_#00f0ff]" />
              <span className="font-code-sm text-xs uppercase tracking-widest text-[#00f0ff] font-semibold">
                QUICK NAVIGATION
              </span>
            </div>

            <nav aria-label="Footer Navigation">
              <ul className="grid grid-cols-2 sm:grid-cols-1 gap-2.5">
                {NAV_LINKS.map((link) => (
                  <li key={link.name}>
                    <ScrollLink
                      to={link.targetId}
                      smooth="easeInOutQuart"
                      duration={800}
                      offset={-80}
                      spy={true}
                      className="group flex items-center justify-between py-1 text-slate-300 hover:text-white transition-all duration-200 cursor-pointer select-none"
                    >
                      <span className="flex items-center gap-2">
                        <span className="font-code-sm text-[10px] text-slate-500 group-hover:text-[#00f0ff] transition-colors">
                          {link.code}
                        </span>
                        <span className="group-hover:translate-x-1 transition-transform duration-200">
                          {link.name}
                        </span>
                      </span>
                      <span className="text-slate-600 group-hover:text-[#00f0ff] opacity-0 group-hover:opacity-100 transition-all duration-200 text-xs">
                        ↗
                      </span>
                    </ScrollLink>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* -------------------------------------------------------------- */}
          {/* Col 3: Direct Connect & Social Links (lg: 4 cols)              */}
          {/* -------------------------------------------------------------- */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2 pb-1 border-b border-white/[0.08]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] shadow-[0_0_6px_#00f0ff]" />
              <span className="font-code-sm text-xs uppercase tracking-widest text-[#00f0ff] font-semibold">
                DIRECT TRANSMISSION
              </span>
            </div>

            {/* Email Card with Mailto & Quick Copy */}
            <div className="p-3.5 rounded-xl bg-[#0e111a]/90 border border-white/10 hover:border-[#00f0ff]/40 transition-all duration-300 group">
              <div className="flex items-center justify-between gap-3">
                <a
                  href={`mailto:${PERSONAL_INFO.email}`}
                  className="flex items-center gap-3 min-w-0 flex-1"
                  title={`Send email to ${PERSONAL_INFO.email}`}
                >
                  <div className="w-9 h-9 rounded-lg bg-[#00f0ff]/10 border border-[#00f0ff]/30 text-[#00f0ff] flex items-center justify-center shrink-0 group-hover:shadow-[0_0_10px_rgba(0,240,255,0.3)] transition-all">
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <span className="block text-[10px] text-slate-400 font-code-sm uppercase tracking-wider">
                      PRIMARY EMAIL
                    </span>
                    <span className="block font-code-sm text-xs text-white truncate group-hover:text-[#00f0ff] transition-colors">
                      {PERSONAL_INFO.email}
                    </span>
                  </div>
                </a>

                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="px-2.5 py-1.5 rounded-md bg-white/5 hover:bg-[#00f0ff]/15 border border-white/10 hover:border-[#00f0ff]/30 text-[10px] font-code-sm text-slate-300 hover:text-[#00f0ff] transition-all shrink-0 cursor-pointer"
                  title="Copy email address"
                  aria-label="Copy email address"
                >
                  {copiedEmail ? "COPIED" : "COPY"}
                </button>
              </div>
            </div>

            {/* Social Links Cards */}
            <div className="grid grid-cols-3 gap-2">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-lg bg-[#0e111a]/80 border border-white/10 hover:border-[#00f0ff]/40 hover:bg-[#00f0ff]/5 hover:text-[#00f0ff] text-slate-300 transition-all duration-200 group text-center"
                  aria-label={social.name}
                >
                  <span className="text-slate-400 group-hover:text-[#00f0ff] transition-colors">
                    <SocialIcon type={social.type} />
                  </span>
                  <span className="font-code-sm text-[11px] font-medium tracking-tight">
                    {social.name}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* ================================================================ */}
        {/* Technologies Strip: Core Stack Badges                           */}
        {/* ================================================================ */}
        <div className="mt-12 pt-6 border-t border-white/[0.08]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff]" />
              <span className="font-code-sm text-[11px] text-slate-400 uppercase tracking-widest font-semibold">
                CORE TECHNOLOGIES:
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {TECHNOLOGIES.map((tech) => (
                <span
                  key={tech}
                  className="px-2.5 py-1 rounded bg-[#10141f] border border-white/[0.08] hover:border-[#00f0ff]/40 text-slate-300 hover:text-white font-code-sm text-xs transition-colors duration-200 cursor-default"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ================================================================ */}
        {/* Bottom Bar: Copyright, Location & Scroll to Top via react-scroll*/}
        {/* ================================================================ */}
        <div className="mt-8 pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-code-sm text-slate-500">
          <div className="flex items-center gap-2">
            <span>© 2026 Shivam Sakre. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden sm:inline-block text-slate-500">
              Built with React &amp; Tailwind CSS
            </span>

            <button
              type="button"
              onClick={() => scroll.scrollToTop({ duration: 800, smooth: "easeInOutQuart" })}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#11141e] hover:bg-[#00f0ff]/10 border border-white/10 hover:border-[#00f0ff]/40 text-slate-400 hover:text-[#00f0ff] transition-all duration-200 cursor-pointer group"
              aria-label="Scroll back to top"
            >
              <span>BACK TO TOP</span>
              <svg
                className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-y-0.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="m18 15-6-6-6 6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
