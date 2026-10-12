import { useState, useMemo } from "react";
import TitleHeader from "../components/TitleHeader";
import { useTheme } from "../context/ThemeContext";

const PROJECT_TYPES = [
  {
    id: "3d_web",
    name: "3D Interactive Web Experience",
    baseDays: 20,
    icon: "🌐",
    stack: "Three.js + React Three Fiber + Tailwind",
    description: "Immersive 3D canvas, physics, custom GLTF models, and fluid GSAP transitions.",
  },
  {
    id: "saas_platform",
    name: "Full-Stack SaaS Platform",
    baseDays: 24,
    icon: "💻",
    stack: "React 19 + Node.js / Laravel + PostgreSQL",
    description: "Multi-tenant architecture, dashboard analytics, user accounts, and billing.",
  },
  {
    id: "fintech_payments",
    name: "Fintech & High-Concurrency APIs",
    baseDays: 14,
    icon: "💳",
    stack: "Node / Laravel + Redis + MySQL Locks + Stripe",
    description: "Idempotent payment rails, race-condition immunity, and high-throughput webhooks.",
  },
  {
    id: "ai_workflows",
    name: "AI Automation & LLM Workflows",
    baseDays: 16,
    icon: "🤖",
    stack: "Python FastAPI + OpenAI API + Redis Queues",
    description: "Autonomous agent workflows, prompt chaining, vector embeddings, and streaming responses.",
  },
  {
    id: "full_mvp",
    name: "End-to-End MVP (Web + Mobile)",
    baseDays: 32,
    icon: "🚀",
    stack: "React + React Native + Unified Backend API",
    description: "Production launch-ready web portal and companion cross-platform mobile apps.",
  },
];

const ADDON_FEATURES = [
  {
    id: "three_d",
    name: "Custom 3D Models & Shaders",
    days: 5,
    icon: "🎨",
    desc: "Interactive 3D canvas, dynamic lighting, and camera choreographies",
  },
  {
    id: "auth_jwt",
    name: "Multi-Role JWT Auth & RBAC",
    days: 3,
    icon: "🔐",
    desc: "Secure token refresh, session management, and granular permissions",
  },
  {
    id: "payments",
    name: "Payment Gateways & Subscriptions",
    days: 4,
    icon: "💰",
    desc: "Stripe, Razorpay, or custom checkout webhooks with idempotency",
  },
  {
    id: "realtime",
    name: "Real-Time WebSockets & Live Feeds",
    days: 5,
    icon: "⚡",
    desc: "Instant notifications, live telemetry, and sub-second socket pipelines",
  },
  {
    id: "ai_bot",
    name: "Intelligent AI Chat & Agent Copilot",
    days: 6,
    icon: "🧠",
    desc: "Domain-specific AI assistant with vector retrieval & tool calling",
  },
  {
    id: "devops",
    name: "Dockerized CI/CD & Cloud Setup",
    days: 3,
    icon: "🐳",
    desc: "Automated test pipelines, AWS containerization, and edge CDN caching",
  },
];

const PACES = [
  {
    id: "standard",
    name: "Standard Agile Sprint",
    multiplier: 1.0,
    desc: "Structured milestone reviews & balanced velocity",
  },
  {
    id: "fast_track",
    name: "Accelerated Fast-Track",
    multiplier: 0.8,
    badge: "PRIORITY",
    desc: "Dedicated sprint allocation for rapid product launches",
  },
];

const ScopeEstimator = () => {
  const { theme, isDark } = useTheme();
  const [selectedType, setSelectedType] = useState(PROJECT_TYPES[0]);
  const [selectedAddons, setSelectedAddons] = useState(["three_d", "auth_jwt"]);
  const [selectedPace, setSelectedPace] = useState(PACES[0]);
  const [copied, setCopied] = useState(false);

  const toggleAddon = (id) => {
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const calculation = useMemo(() => {
    const addonsDays = selectedAddons.reduce((sum, id) => {
      const feature = ADDON_FEATURES.find((f) => f.id === id);
      return sum + (feature ? feature.days : 0);
    }, 0);

    const rawTotalDays = (selectedType.baseDays + addonsDays) * selectedPace.multiplier;
    const totalDays = Math.max(5, Math.round(rawTotalDays));
    const weeks = Math.max(1, Math.ceil(totalDays / 5));

    return {
      addonsDays,
      totalDays,
      weeks,
    };
  }, [selectedType, selectedAddons, selectedPace]);

  const addonNames = selectedAddons
    .map((id) => ADDON_FEATURES.find((f) => f.id === id)?.name)
    .filter(Boolean)
    .join(", ");

  const scopeBrief = `Hi! I calculated a project scope on your 3D portfolio:
- Project Type: ${selectedType.name}
- Tech Stack: ${selectedType.stack}
- Included Features: ${addonNames || "Core Foundation Only"}
- Sprint Pace: ${selectedPace.name}
- Estimated Timeline: ~${calculation.weeks} Weeks (${calculation.totalDays} Dev Days)

Can we schedule a call to review requirements and start this sprint?`;

  const whatsappUrl = `https://wa.me/919770375191?text=${encodeURIComponent(scopeBrief)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(scopeBrief);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section id="scope" className="section-padding relative scroll-mt-28">
      <div className="w-full h-full md:px-10 px-5">
        <TitleHeader
          title="Project Timeline & Scope Estimator"
          sub="📊 Scope Estimator · Configure project deliverables & export a sprint brief"
        />

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto">
          {/* LEFT: Configurator Controls (7 cols) */}
          <div className="lg:col-span-7 space-y-10">
            {/* Step 1: Project Type */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="flex items-center justify-center size-7 rounded-full bg-blue-100 border border-white/10 text-white font-semibold text-xs">
                  01
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    Select Project Architecture
                  </h3>
                  <p className="text-xs text-blue-50">
                    Choose the primary system architecture for your build
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {PROJECT_TYPES.map((type) => {
                  const isSelected = selectedType.id === type.id;
                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setSelectedType(type)}
                      className={`text-left p-5 rounded-2xl border transition-all duration-300 cursor-pointer relative overflow-hidden group ${
                        isSelected
                          ? "border-[#62e0ff] bg-gradient-to-br from-[#62e0ff]/10 via-black-200 to-black-100 shadow-[0_0_30px_-5px_rgba(98,224,255,0.2)]"
                          : "border-black-50 bg-black-100/90 hover:border-white/20 hover:bg-black-200/50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-2xl">{type.icon}</span>
                        <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-black-200 text-blue-50 border border-white/5">
                          +{type.baseDays}d base
                        </span>
                      </div>
                      <h4 className="mt-3 text-sm font-semibold text-white group-hover:text-white-50 transition-colors">
                        {type.name}
                      </h4>
                      <p className="mt-1 text-[11px] text-blue-50 font-mono">
                        {type.stack}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Add-on Features */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="flex items-center justify-center size-7 rounded-full bg-blue-100 border border-white/10 text-white font-semibold text-xs">
                  02
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    Architectural Modules & Features
                  </h3>
                  <p className="text-xs text-blue-50">
                    Select key functionalities required for this release
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ADDON_FEATURES.map((addon) => {
                  const isChecked = selectedAddons.includes(addon.id);
                  return (
                    <button
                      key={addon.id}
                      type="button"
                      onClick={() => toggleAddon(addon.id)}
                      className={`flex items-start gap-3.5 p-4 rounded-xl border transition-all duration-300 text-left cursor-pointer ${
                        isChecked
                          ? "border-[#62e0ff]/70 bg-[#62e0ff]/5 shadow-[0_0_20px_-5px_rgba(98,224,255,0.15)]"
                          : "border-black-50 bg-black-100/90 hover:border-white/20 hover:bg-black-200/40"
                      }`}
                    >
                      <span className="text-xl shrink-0 mt-0.5">{addon.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-white">
                            {addon.name}
                          </span>
                          <span className="text-[10px] font-mono text-[#62e0ff] font-semibold ml-1">
                            +{addon.days}d
                          </span>
                        </div>
                        <p className="text-[11px] text-blue-50 leading-relaxed mt-0.5">
                          {addon.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Sprint Pace */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="flex items-center justify-center size-7 rounded-full bg-blue-100 border border-white/10 text-white font-semibold text-xs">
                  03
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    Sprint Delivery Velocity
                  </h3>
                  <p className="text-xs text-blue-50">
                    Select delivery timeframe and milestone pacing
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {PACES.map((pace) => {
                  const isSelected = selectedPace.id === pace.id;
                  return (
                    <button
                      key={pace.id}
                      type="button"
                      onClick={() => setSelectedPace(pace)}
                      className={`p-4 rounded-xl border text-left transition-all duration-300 cursor-pointer ${
                        isSelected
                          ? "border-white bg-blue-100/40 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                          : "border-black-50 bg-black-100/90 hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-white">
                          {pace.name}
                        </span>
                        {pace.badge && (
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#62e0ff]/20 text-[#62e0ff] border border-[#62e0ff]/30">
                            {pace.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-blue-50 mt-1">
                        {pace.desc}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT: Scope Summary Card & Output (5 cols) */}
          <div className="lg:col-span-5">
            <div className="sticky top-28 rounded-2xl border border-black-50 bg-gradient-to-b from-black-100 via-black-200 to-black-100 p-8 shadow-[0_25px_60px_rgba(0,0,0,0.8)] backdrop-blur-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-5 border-b border-black-50">
                  <span className="text-xs font-mono uppercase tracking-wider text-blue-50">
                    Sprint Estimate
                  </span>
                  <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-100/80 border border-white/5">
                    <span className="size-1.5 rounded-full bg-[#62e0ff] animate-pulse" />
                    <span className="text-[10px] font-mono text-[#62e0ff] font-semibold">
                      READY TO BUILD
                    </span>
                  </div>
                </div>

                {/* Big Metric Display */}
                <div className="my-8 p-6 rounded-2xl bg-black/60 border border-black-50 text-center">
                  <span className="text-xs font-mono text-blue-50 uppercase tracking-widest block">
                    Estimated Delivery Timeline
                  </span>
                  <div className="flex items-baseline justify-center gap-2 mt-2">
                    <span className="text-5xl md:text-6xl font-semibold bg-gradient-to-r from-white via-white-50 to-[#62e0ff] bg-clip-text text-transparent">
                      ~{calculation.weeks}
                    </span>
                    <span className="text-xl font-semibold text-white-50">
                      Weeks
                    </span>
                  </div>
                  <div className="mt-2 text-xs font-mono text-blue-50">
                    ({calculation.totalDays} development days scheduled)
                  </div>
                </div>

                {/* Breakdown List */}
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-white/5">
                    <span className="text-blue-50">Architecture Base:</span>
                    <span className="font-medium text-white truncate max-w-[200px]">
                      {selectedType.name}
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-white/5">
                    <span className="text-blue-50">Base Allocation:</span>
                    <span className="font-mono text-white font-semibold">
                      {selectedType.baseDays} days
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-white/5">
                    <span className="text-blue-50">Modules Selected:</span>
                    <span className="font-mono text-white font-semibold">
                      {selectedAddons.length} features (+{calculation.addonsDays}d)
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-white/5">
                    <span className="text-blue-50">Sprint Pace:</span>
                    <span className="font-medium text-white">
                      {selectedPace.name} ({selectedPace.multiplier}x)
                    </span>
                  </div>
                </div>
              </div>

              {/* Conversion Buttons */}
              <div className="mt-10 space-y-3">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-4 px-6 rounded-full bg-white text-black font-semibold text-sm hover:bg-white-50 hover:shadow-[0_0_25px_rgba(255,255,255,0.3)] transition-all duration-300 cursor-pointer"
                >
                  <span>Discuss Brief on WhatsApp</span>
                  <span>↗</span>
                </a>

                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="py-3 px-4 rounded-xl border border-black-50 bg-black-200 text-white-50 text-xs font-medium hover:text-white hover:border-white/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>{copied ? "✓ Copied!" : "📋 Copy Scope"}</span>
                  </button>

                  <a
                    href={`https://mail.google.com/mail/?view=cm&fs=1&to=shivamsakre10@gmail.com&su=${encodeURIComponent("Project Scope Inquiry")}&body=${encodeURIComponent(scopeBrief)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3 px-4 rounded-xl border border-black-50 bg-black-200 text-white-50 text-xs font-medium hover:text-white hover:border-white/20 transition-all flex items-center justify-center gap-1.5 text-center cursor-pointer"
                  >
                    <span>✉️ Send via Gmail ↗</span>
                  </a>
                </div>
                <p className="text-[11px] text-center text-blue-50 font-mono mt-2">
                  Includes full source code, test suites & CI/CD deployment docs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ScopeEstimator;
