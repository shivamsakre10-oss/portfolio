/**
 * Ultra-premium animated CTA button with obsidian glassmorphic body,
 * glowing neon ambient halo, live pulsing beacon, and interactive arrow slide.
 */
import { smoothScrollTo } from "../utils/smoothScroll";

const Button = ({ text = "See My Work", className, id = "counter" }) => {
  const handleClick = (e) => {
    e.preventDefault();

    // Prefer scrolling to the work showcase, fallback to counter/id
    const target =
      document.getElementById("work") ||
      document.getElementById(id) ||
      document.getElementById("counter");

    if (target) smoothScrollTo(target.id);
  };

  return (
    <a
      href="#work"
      onClick={handleClick}
      className={`group relative inline-flex items-center justify-between p-1.5 md:p-2 rounded-full cursor-pointer select-none transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] ${
        className ?? "md:w-80 md:h-16 w-64 h-14"
      }`}
    >
      {/* Outer ambient glow halo that pulses softly and intensifies on hover */}
      <span className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-[#62e0ff]/50 via-[#52aeff]/30 to-[#a855f7]/50 opacity-60 blur-md group-hover:opacity-100 group-hover:blur-lg transition-all duration-500 animate-pulse" />

      {/* Radiant metallic border gradient */}
      <span className="absolute inset-0 rounded-full bg-gradient-to-r from-[#62e0ff] via-white/50 to-[#62e0ff] p-[1.5px] transition-all duration-500 group-hover:from-white group-hover:via-[#62e0ff] group-hover:to-white">
        <span className="block w-full h-full rounded-full bg-[#0a0c14]/95 backdrop-blur-xl" />
      </span>

      {/* Shimmer sweep light streak */}
      <span className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
        <span className="absolute top-0 -left-[100%] w-[60%] h-full bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-12 group-hover:animate-shimmer" />
      </span>

      {/* Inner Button Content */}
      <div className="relative z-10 flex items-center justify-between w-full h-full px-5 md:px-6">
        {/* Left: Live pulsing cyan dot + Label */}
        <div className="flex items-center gap-3">
          <span className="relative flex size-2.5 items-center justify-center">
            <span className="absolute inline-flex size-full rounded-full bg-[#62e0ff] opacity-75 animate-ping" />
            <span className="relative inline-flex size-2 rounded-full bg-[#62e0ff] shadow-[0_0_8px_#62e0ff]" />
          </span>
          <span className="font-semibold text-xs md:text-sm tracking-widest uppercase text-white group-hover:text-white transition-colors">
            {text}
          </span>
        </div>

        {/* Right: Circular Arrow Badge */}
        <div className="relative flex items-center justify-center size-8 md:size-10 rounded-full bg-white/10 border border-white/15 text-white shadow-inner group-hover:bg-[#62e0ff] group-hover:border-[#62e0ff] group-hover:text-black transition-all duration-300">
          <svg
            className="size-4 md:size-4.5 transition-transform duration-300 group-hover:translate-y-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </a>
  );
};

export default Button;
