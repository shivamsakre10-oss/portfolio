import { useState, useRef, useEffect } from "react";
import TitleHeader from "../components/TitleHeader";
import { useTheme } from "../context/ThemeContext";

const DEFAULT_BANNER = `
   ____           __  ____      ___          
  / __ \\____  ___/ /_/ __/___  / (_)___      
 / /_/ / __ \\/ ___/ __/_/ __ \\/ / / __ \\     
/ ____/ /_/ / /  / /_/ / /_/ / / / /_/ /     
\\/    \\____/_/   \\__/_/ \\____/_/_/\\____/      
Interactive Systems Terminal v2.6.4 (Three.js WebGL2)
Type 'help' to view commands, or click any quick pill below.
`;

const INITIAL_HISTORY = [
  {
    type: "banner",
    text: DEFAULT_BANNER,
  },
  {
    type: "output",
    text: "● CLUSTER STATUS: HEALTHY | Node.js v20.12 | WebGL2 Enabled | 99.99% Uptime",
  },
];

const Terminal = () => {
  const { theme, toggleTheme, setTheme, isDark } = useTheme();
  const [input, setInput] = useState("");
  const [history, setHistory] = useState(INITIAL_HISTORY);
  const [isTopRunning, setIsTopRunning] = useState(false);
  const [topMetrics, setTopMetrics] = useState({
    cpu: 16.8,
    mem: 384,
    reqPerSec: 1480,
    latency: 12,
  });

  const terminalBodyRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
    }
  }, [history, isTopRunning, topMetrics]);

  useEffect(() => {
    let interval;
    if (isTopRunning) {
      interval = setInterval(() => {
        setTopMetrics({
          cpu: +(14 + Math.random() * 12).toFixed(1),
          mem: Math.floor(370 + Math.random() * 30),
          reqPerSec: Math.floor(1400 + Math.random() * 200),
          latency: Math.floor(9 + Math.random() * 6),
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTopRunning]);

  const executeCommand = (cmdText) => {
    const trimmed = cmdText.trim();
    if (!trimmed) return;

    const parts = trimmed.split(" ");
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1).join(" ");

    const newHistory = [...history, { type: "input", text: trimmed }];

    if (isTopRunning && cmd !== "clear" && cmd !== "exit" && cmd !== "q") {
      setIsTopRunning(false);
    }

    switch (cmd) {
      case "help":
        newHistory.push({
          type: "output",
          text: `AVAILABLE TERMINAL UTILITIES:
  help      - Display available system commands
  bio       - Background, engineering philosophy & core focus
  skills    - Print verified technical stack & framework proficiencies
  projects  - High-impact production platforms and case studies
  top       - Real-time animated cluster telemetry (CPU, memory, latency)
  sql       - Interactive SQL query runner (e.g. sql SELECT * FROM stack)
  deploy    - Simulate multi-stage Docker & CI/CD production rollout
  scope     - Jump to interactive Project Timeline & Scope Estimator
  whatsapp  - Open direct WhatsApp conversation (+91 97703 75191)
  email     - Open direct email client (shivamsakre10@gmail.com)
  whoami    - Print current session details
  date      - Current IST & UTC system timestamps
  clear     - Clear terminal buffer`,
        });
        break;

      case "bio":
        newHistory.push({
          type: "output",
          text: `ENGINEERING BACKGROUND:
Role:       Full Stack Engineer & Interactive 3D WebGL Developer
Focus:      High-throughput backend APIs, 3D WebGL experiences, and transactional systems
Philosophy: Atomic data integrity, 60fps WebGL optimization, sub-100ms API response.
Status:     Available for technical contracts, custom 3D web apps, and architecture reviews.`,
        });
        break;

      case "skills":
      case "stack":
        newHistory.push({
          type: "output",
          text: `CORE TECHNICAL STACK MATRIX:
┌─────────────────────┬────────────────────────────────────────────────────────┐
│ Frontend & 3D       │ React 19, Three.js, React Three Fiber, Vite, Tailwind   │
│ Backend & APIs      │ Node.js, Laravel (PHP), Python, Django REST, REST/WS   │
│ Databases & Caching │ PostgreSQL, MySQL (Atomic Row Locks), Redis, SQLite    │
│ Payment Rails       │ Stripe, Razorpay, Mercado Pago, Webhook Idempotency    │
│ DevOps & Cloud      │ Docker, AWS S3/EC2, CI/CD Actions, Linux Environments   │
└─────────────────────┴────────────────────────────────────────────────────────┘`,
        });
        break;

      case "projects":
        newHistory.push({
          type: "output",
          text: `FEATURED PRODUCTION CASE STUDIES:
1. 3D Interactive Portfolio (Active) - Three.js WebGL canvas, GLTF lighting & shaders.
2. Workforce Dispatch & Hiring Portal - Candidate match engine & bulk interview pipelines.
3. Fintech Webhook Engine - Idempotent payment processing with atomic MySQL locks.
4. Enterprise Logistics CRM - Multi-facility shipment routing & FedEx connectors.
5. Real-Time Analytics Ledger - Sub-second double-entry ledger transactions.`,
        });
        break;

      case "top":
        setIsTopRunning(true);
        newHistory.push({
          type: "output",
          text: "🚀 Real-time cluster telemetry started. (Run any command or 'clear' to exit).",
        });
        break;

      case "sql":
        if (!args || args.toLowerCase().includes("select")) {
          newHistory.push({
            type: "output",
            text: `Executing on cluster://prod-db-primary:3306 (SSL Verified)...
+----+----------------------+-------------+--------------+------------------+
| ID | DOMAIN / COMPONENT   | PROFICIENCY | PRODUCTION   | CONCURRENCY SAFE |
+----+----------------------+-------------+--------------+------------------+
| 01 | Three.js / WebGL     | 96%         | YES          | 60 FPS Optimized |
| 02 | React 19 & Next.js   | 98%         | YES          | Full-Stack       |
| 03 | Node / Laravel APIs  | 95%         | YES          | Atomic DB Locks  |
| 04 | Redis Queues & Cache | 94%         | YES          | In-Memory Cache  |
| 05 | MySQL / PostgreSQL   | 96%         | YES          | Zero Desync      |
+----+----------------------+-------------+--------------+------------------+
5 rows in set (0.0012 sec) — Query executed successfully.`,
          });
        } else {
          newHistory.push({
            type: "error",
            text: `SQL Syntax Error: Try: sql SELECT * FROM stack`,
          });
        }
        break;

      case "deploy":
        newHistory.push({
          type: "output",
          text: `[CI/CD PIPELINE INITIALIZED]
✔ Commit verified (main@HEAD -> 2a9f4c0)
✔ Static analysis & lint checks passed (0 errors, 0 warnings)
✔ 3D GLTF asset tree compressed & cached via WebP textures
✔ Docker multi-stage build: completed in 10.8s
✔ Automated unit & integration tests: 94 passed, 0 failed
✔ Rolling deployment: 4/4 pods healthy
✔ Edge CDN purge complete across 28 global regions
🚀 Production deployment LIVE with 99.99% Availability & sub-15ms edge latency.`,
        });
        break;

      case "scope":
        newHistory.push({
          type: "output",
          text: "Navigating to Project Timeline & Scope Estimator below...",
        });
        setTimeout(() => {
          const el = document.getElementById("scope");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }, 200);
        break;

      case "whatsapp":
        newHistory.push({
          type: "output",
          text: "Opening direct WhatsApp chat window (+91 97703 75191)...",
        });
        window.open(
          "https://wa.me/919770375191?text=Hi!%20Connecting%20via%20your%203D%20portfolio%20terminal.",
          "_blank"
        );
        break;

      case "email":
      case "mail":
        navigator.clipboard?.writeText("shivamsakre10@gmail.com");
        newHistory.push({
          type: "output",
          text: `Opening Gmail composer for shivamsakre10@gmail.com...
✔ Copied 'shivamsakre10@gmail.com' to clipboard.`,
        });
        window.open(
          "https://mail.google.com/mail/?view=cm&fs=1&to=shivamsakre10@gmail.com&su=Project%20Inquiry%20from%20Portfolio%20Terminal",
          "_blank",
          "noopener,noreferrer"
        );
        break;

      case "whoami":
        newHistory.push({
          type: "output",
          text: "visitor@portfolio-terminal (Role: Prospective Client / Collaborator)",
        });
        break;

      case "date":
        newHistory.push({
          type: "output",
          text: `IST: ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}
UTC: ${new Date().toUTCString()}`,
        });
        break;

      case "theme":
        if (args.toLowerCase() === "toggle") {
          toggleTheme();
          newHistory.push({
            type: "output",
            text: `Theme toggled. Current theme is now active.`,
          });
        } else if (args.toLowerCase() === "light") {
          setTheme("light");
          newHistory.push({
            type: "output",
            text: `Theme switched to LIGHT mode.`,
          });
        } else if (args.toLowerCase() === "dark") {
          setTheme("dark");
          newHistory.push({
            type: "output",
            text: `Theme switched to DARK mode.`,
          });
        } else {
          newHistory.push({
            type: "output",
            text: `CURRENT THEME: ${theme.toUpperCase()} (isDark: ${isDark ? "true" : "false"})
Usage: 'theme toggle', 'theme light', 'theme dark'`,
          });
        }
        break;

      case "clear":
      case "cls":
        setIsTopRunning(false);
        setHistory([
          {
            type: "output",
            text: "Terminal buffer cleared. Type 'help' to view commands.",
          },
        ]);
        setInput("");
        return;

      default:
        newHistory.push({
          type: "error",
          text: `zsh: command not found: ${cmd}. Type 'help' to view commands.`,
        });
        break;
    }

    setHistory(newHistory);
    setInput("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    executeCommand(input);
  };

  const quickPills = [
    { label: "help", cmd: "help" },
    { label: "bio", cmd: "bio" },
    { label: "skills", cmd: "skills" },
    { label: "projects", cmd: "projects" },
    { label: "top (monitor)", cmd: "top" },
    { label: "sql query", cmd: "sql SELECT * FROM stack" },
    { label: "deploy", cmd: "deploy" },
    { label: "clear", cmd: "clear" },
  ];

  return (
    <section id="terminal" className="section-padding relative">
      <div className="w-full h-full md:px-10 px-5">
        <TitleHeader
          title="Interactive Systems Terminal"
          sub="⚡ Developer Shell · Run real-time diagnostics & inspect architecture"
        />

        {/* Quick action buttons / pills matching portfolio pill style */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-10 mb-6">
          <span className="text-xs uppercase tracking-wider text-blue-50 font-medium mr-2">
            Quick Commands:
          </span>
          {quickPills.map((pill) => (
            <button
              key={pill.cmd}
              onClick={() => executeCommand(pill.cmd)}
              className="btn-shimmer-glass text-xs px-3.5 py-1.5 rounded-full border border-white/10 hover:border-[#00f0ff]/60 bg-[#1e1f25]/90 hover:bg-[#252731] text-[#b9cacb] hover:text-[#00f0ff] hover:shadow-[0_0_15px_rgba(0,240,255,0.25)] hover:-translate-y-0.5 active:scale-95 transition-all duration-200 cursor-pointer font-mono select-none"
            >
              {pill.label}
            </button>
          ))}
        </div>

        {/* Sleek Glassmorphic Terminal Window matching 3D Portfolio Dark Theme */}
        <div
          onClick={() => inputRef.current?.focus()}
          className="mx-auto max-w-5xl rounded-2xl border border-black-50 bg-black-100/90 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden cursor-text transition-all duration-300 hover:border-white/20"
        >
          {/* Terminal Title Bar */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-black-50 bg-black-200/50">
            <div className="flex items-center gap-2.5">
              <span className="size-3 rounded-full bg-[#ff5f56]/80 hover:bg-[#ff5f56] transition-colors" />
              <span className="size-3 rounded-full bg-[#ffbd2e]/80 hover:bg-[#ffbd2e] transition-colors" />
              <span className="size-3 rounded-full bg-[#27c93f]/80 hover:bg-[#27c93f] transition-colors" />
              <span className="ml-3 font-mono text-xs text-white-50/70 hidden sm:inline">
                developer@portfolio ~ zsh
              </span>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/60 border border-white/5">
                <span className="size-1.5 rounded-full bg-[#62e0ff] animate-ping" />
                <span className="text-[10px] font-mono text-[#62e0ff] font-semibold tracking-wider">
                  LIVE CLUSTER
                </span>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  executeCommand("clear");
                }}
                className="text-xs font-mono text-blue-50 hover:text-[#00f0ff] px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Terminal Body */}
          <div
            ref={terminalBodyRef}
            className="p-6 font-mono text-xs md:text-sm text-white-50 overflow-y-auto max-h-[460px] space-y-3 leading-relaxed selection:bg-[#62e0ff]/30 selection:text-white"
          >
            {history.map((item, index) => {
              if (item.type === "banner") {
                return (
                  <pre
                    key={index}
                    className="text-[#62e0ff] font-medium text-[9px] md:text-xs leading-none whitespace-pre overflow-x-auto py-2"
                  >
                    {item.text}
                  </pre>
                );
              }
              if (item.type === "input") {
                return (
                  <div key={index} className="flex items-center gap-2 text-white">
                    <span className="text-[#62e0ff] font-bold">➜</span>
                    <span className="text-[#839cb5]">~/portfolio</span>
                    <span className="text-white-50/50">$</span>
                    <span className="font-semibold text-white">{item.text}</span>
                  </div>
                );
              }
              if (item.type === "error") {
                return (
                  <div key={index} className="text-rose-400 pl-4 border-l border-rose-500/50">
                    {item.text}
                  </div>
                );
              }
              return (
                <div
                  key={index}
                  className="text-white-50 whitespace-pre-wrap pl-4 border-l border-white/10"
                >
                  {item.text}
                </div>
              );
            })}

            {/* Live animated TOP monitor telemetry */}
            {isTopRunning && (
              <div className="p-4 my-2 rounded-xl border border-white/10 bg-black-200/80 text-white-50 font-mono text-xs space-y-2">
                <div className="flex justify-between border-b border-white/10 pb-1.5 font-semibold text-white">
                  <span className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-[#62e0ff] animate-pulse" />
                    LIVE TELEMETRY MONITOR (top)
                  </span>
                  <span className="text-xs text-blue-50">Press any key or run command to return</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1 text-xs">
                  <div className="bg-black-100 p-2.5 rounded-lg border border-black-50">
                    <span className="text-blue-50 text-[10px] block uppercase">CPU Load</span>
                    <span className="text-white font-bold text-sm">{topMetrics.cpu}%</span>
                  </div>
                  <div className="bg-black-100 p-2.5 rounded-lg border border-black-50">
                    <span className="text-blue-50 text-[10px] block uppercase">Memory Used</span>
                    <span className="text-white font-bold text-sm">{topMetrics.mem} MB</span>
                  </div>
                  <div className="bg-black-100 p-2.5 rounded-lg border border-black-50">
                    <span className="text-blue-50 text-[10px] block uppercase">Throughput</span>
                    <span className="text-white font-bold text-sm">{topMetrics.reqPerSec} req/s</span>
                  </div>
                  <div className="bg-black-100 p-2.5 rounded-lg border border-black-50">
                    <span className="text-blue-50 text-[10px] block uppercase">Edge Latency</span>
                    <span className="text-[#62e0ff] font-bold text-sm">{topMetrics.latency} ms</span>
                  </div>
                </div>
              </div>
            )}

            {/* Terminal Input Prompt */}
            <form onSubmit={handleSubmit} className="flex items-center gap-2 pt-3">
              <span className="text-[#62e0ff] font-bold">➜</span>
              <span className="text-[#839cb5]">~/portfolio</span>
              <span className="text-white-50/50">$</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="type a command... (e.g. 'help', 'skills', 'top', 'sql')"
                className="flex-1 bg-transparent text-white font-mono text-xs md:text-sm focus:outline-none placeholder:text-blue-50/50"
                autoComplete="off"
                spellCheck="false"
              />
              <span className="inline-block w-2 h-4 bg-[#62e0ff] animate-pulse" />
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Terminal;
