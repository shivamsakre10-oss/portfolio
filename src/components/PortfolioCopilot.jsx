import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import {
  Bot,
  Sparkles,
  Send,
  X,
  Maximize2,
  Minimize2,
  RotateCcw,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Square,
  Headphones,
  FileText,
  ExternalLink,
  Copy,
  Check,
  Download,
  Terminal,
  Code2,
  Briefcase,
  User,
  Mail,
  Phone,
  ArrowUpRight,
  Calculator,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { smoothScrollTo } from "../utils/smoothScroll";

// Quick suggestion prompts displayed as interactive chips
const QUICK_PROMPTS = [
  { label: "📄 Download Resume", query: "Can I download Shivam's resume?" },
  { label: "🚀 Featured Projects", query: "Tell me about your featured projects and builds." },
  { label: "💼 Work Experience", query: "Where has Shivam worked and what is his experience?" },
  { label: "🛠️ Core Tech Stack", query: "What technologies and databases do you work with?" },
  { label: "🌐 RicRoot Platform", query: "Tell me more about the RicRoot platform." },
  { label: "📱 WhatsApp Contact", query: "What is your WhatsApp number?" },
  { label: "📊 Project Scope", query: "How do you estimate project pricing and timelines?" },
  { label: "⚡ Terminal Shell", query: "How do I use the live terminal shell?" },
];

const INITIAL_MESSAGES = [
  {
    id: "init-1",
    sender: "bot",
    timestamp: "Just now",
    text: "👋 **Hello! I'm Shivam's Portfolio Copilot AI.**\n\nI can answer questions about Shivam Sakre's **software engineering background**, **full-stack projects (RicRoot, SB Work)**, **core tech stack**, or help you schedule a project sprint and download his resume.",
    actions: [
      { label: "📄 Download Resume", download: "/Shivam_Sakre_Resume.pdf", icon: "Download" },
      { label: "🚀 Top Projects", scrollId: "work", icon: "Code2" },
      { label: "💼 Work Experience", scrollId: "experience", icon: "Briefcase" },
      { label: "💬 Chat on WhatsApp", url: "https://wa.me/919770375191?text=Hi%20Shivam!%20Connecting%20via%20your%20portfolio%20AI.", icon: "Phone" },
      { label: "✉️ Direct Email", url: "https://mail.google.com/mail/?view=cm&fs=1&to=shivamsakre10@gmail.com&su=Project%20Inquiry%20from%20Portfolio", icon: "Mail" },
      { label: "📊 Scope Estimator", scrollId: "scope", icon: "Calculator" },
    ],
  },
];

// Rich offline knowledge base for Shivam Sakre
const KNOWLEDGE_BASE = [
  {
    id: "resume",
    keywords: [
      "resume",
      "cv",
      "curriculum vitae",
      "download resume",
      "download cv",
      "pdf",
      "biodata",
      "profile document",
    ],
    response: {
      text: "📄 **Shivam Sakre — Verified Technical Resume:**\n\n• **Current Role**: Software Developer @ Veracity Supply Chain Limited\n• **Core Stack**: React.js, Node.js, Express.js, MongoDB, JavaScript, REST APIs\n• **Previous**: MERN Stack Developer Intern @ Ypsilon IT Solutions\n• **Location**: Ahmedabad / Indore, India (Available for Remote)\n\nYou can download the complete, print-ready PDF resume below:",
      actions: [
        { label: "⬇️ Download Resume PDF", download: "/Shivam_Sakre_Resume.pdf", icon: "Download" },
        { label: "💼 View Experience Section", scrollId: "experience", icon: "Briefcase" },
        { label: "✉️ Email for Inquiries", copy: "shivamsakre10@gmail.com", icon: "Copy" },
      ],
    },
  },
  {
    id: "about",
    keywords: [
      "about",
      "who is",
      "who are you",
      "bio",
      "background",
      "tell me about yourself",
      "introduce",
      "introduction",
      "profile",
      "location",
      "where are you from",
      "where is shivam",
      "based",
    ],
    response: {
      text: "👨‍💻 **About Shivam Sakre:**\n\nShivam is an **Elite Full Stack Developer & Technical Architect** based in India, specializing in high-performance web applications, resilient backend architectures, and modern interactive UI systems.\n\n• **Current Position**: Software Developer at **Veracity Supply Chain Limited** (Ahmedabad, India).\n• **Specialization**: Full-Stack development (React.js, Node.js, Express.js, MongoDB, RESTful APIs, Three.js WebGL).\n• **Engineering Philosophy**: Clean modular architecture, type safety, optimal database query execution, and high-fidelity user experiences.",
      actions: [
        { label: "💼 Work Experience", scrollId: "experience", icon: "Briefcase" },
        { label: "🛠️ View Tech Stack", scrollId: "skills", icon: "Code2" },
        { label: "📄 Download Resume", download: "/Shivam_Sakre_Resume.pdf", icon: "Download" },
        { label: "💬 Connect on WhatsApp", url: "https://wa.me/919770375191?text=Hi%20Shivam!%20I%20would%20like%20to%20connect.", icon: "Phone" },
      ],
    },
  },
  {
    id: "experience",
    keywords: [
      "experience",
      "work history",
      "where does he work",
      "current company",
      "current job",
      "veracity",
      "ypsilon",
      "employment",
      "internship",
      "career",
      "roles",
      "company",
    ],
    response: {
      text: "💼 **Professional Career Trajectory:**\n\n1. **Software Developer** — *Veracity Supply Chain Limited* (Sept 2026 – Present | Ahmedabad, India)\n   • Developing scalable RESTful APIs and server-side business logic using Node.js.\n   • Engineering responsive, accessible web interfaces in React.js and modern JavaScript.\n   • Designing schema structures, query optimizations, unit tests, code reviews, and User Acceptance Testing (UAT).\n\n2. **MERN Stack Developer Intern** — *Ypsilon IT Solutions Pvt Ltd* (March 2026 – August 2026 | Indore, India)\n   • Engineered core e-commerce modules using MongoDB, Express.js, React.js, and Node.js.\n   • Designed database schemas and APIs for user authentication, product catalogs, and cart/checkout workflows.",
      actions: [
        { label: "📍 Jump to Experience Timeline", scrollId: "experience", icon: "Briefcase" },
        { label: "📄 Download Full Resume", download: "/Shivam_Sakre_Resume.pdf", icon: "Download" },
        { label: "💬 Discuss Contract Availability", url: "https://wa.me/919770375191?text=Hi%20Shivam!%20I%20have%20an%20opportunity%20to%20discuss.", icon: "Phone" },
      ],
    },
  },
  {
    id: "ricroot",
    keywords: [
      "ricroot",
      "workforce",
      "hiring platform",
      "blue collar",
      "grey collar",
      "ai calling",
      "screening",
      "bulk hiring",
    ],
    response: {
      text: "🌐 **Flagship Project: RicRoot** *(ricroot.in)*\n\n**RicRoot** is a next-generation workforce hiring platform connecting enterprise employers with verified blue-collar and grey-collar talent across India.\n\n• **Core Capabilities**:\n  - Automated AI voice calling for rapid candidate pre-screening.\n  - Digital candidate verification and structured skill profiles.\n  - Multi-shift job discovery and location-based candidate matching.\n  - Automated interview scheduling with direct calendar links.\n  - High-volume bulk hiring pipeline tracking.\n• **Tech Stack**: React.js, Node.js, Express.js, MongoDB, RESTful API architecture.",
      actions: [
        { label: "↗ Visit RicRoot (ricroot.in)", url: "https://ricroot.in", icon: "ExternalLink" },
        { label: "📍 View in Work Showcase", scrollId: "work", icon: "Code2" },
        { label: "💬 Inquire About Similar Platform", url: "https://wa.me/919770375191?text=Hi%20Shivam!%20I'm%20interested%20in%20building%20a%20platform%20like%20RicRoot.", icon: "Phone" },
      ],
    },
  },
  {
    id: "sbwork",
    keywords: [
      "sb work",
      "sbwork",
      "freelancer",
      "marketplace",
      "bidding",
      "proposals",
      "jwt",
      "role based",
    ],
    response: {
      text: "💼 **Featured Project: SB Work | Freelancer Marketplace**\n\nA full-stack platform bridging clients and freelancers with frictionless bidding and project delivery:\n\n• **Key Features**:\n  - Dual-role authentication system (Client vs Freelancer accounts).\n  - Project posting portal, discovery filters, proposal submissions, and real-time bid tracking.\n  - JWT-based authentication and granular role-based authorization.\n  - Scalable RESTful API architecture with MongoDB relational document schemas.\n• **Stack**: React.js, Node.js, Express.js, MongoDB, JWT Security.",
      actions: [
        { label: "📍 View in Work Showcase", scrollId: "work", icon: "Code2" },
        { label: "🛠️ Inspect Tech Stack", scrollId: "skills", icon: "Code2" },
      ],
    },
  },
  {
    id: "quiz",
    keywords: [
      "quiz",
      "online quiz",
      "assessment",
      "test",
      "scoring",
    ],
    response: {
      text: "🧠 **Featured Project: Online Quiz Web Application**\n\nAn interactive, real-time assessment platform with responsive UI and instant feedback:\n\n• Dynamic question generation and timed test sessions.\n• Instant score calculation, detailed result breakdown, and performance analytics.\n• Mobile-first responsive UI built with modern React.js.",
      actions: [
        { label: "📍 View in Work Showcase", scrollId: "work", icon: "Code2" },
      ],
    },
  },
  {
    id: "threejs",
    keywords: [
      "three",
      "threejs",
      "three.js",
      "3d",
      "webgl",
      "canvas",
      "fiber",
      "r3f",
      "hologram",
      "shaders",
      "gltf",
    ],
    response: {
      text: "✨ **3D WebGL & Interactive Engineering:**\n\nThis portfolio itself is a showcase of high-performance 3D graphics built for the web:\n\n• **Three.js & React Three Fiber (R3F)**: Custom GLTF 3D models with interactive orbiting, camera transforms, and dynamic lighting.\n• **Custom Shaders & Holograms**: Real-time holographic vertex scanning and particle systems.\n• **60 FPS Performance**: Optimized frame loops, low draw-call batching, and responsive canvas scaling.",
      actions: [
        { label: "📍 View 3D Tech Models", scrollId: "skills", icon: "Code2" },
        { label: "⚡ Run Terminal Diagnostics", scrollId: "terminal", icon: "Terminal" },
      ],
    },
  },
  {
    id: "projects",
    keywords: [
      "project",
      "projects",
      "work",
      "portfolio",
      "showcase",
      "apps",
      "builds",
      "products",
      "what have you built",
    ],
    response: {
      text: "🚀 **Featured Production Platforms:**\n\n1. **RicRoot — Blue & Grey Collar Workforce Platform** *(ricroot.in)*\n   • Job search by shift/location, automated AI screening calls, candidate digital verification, and bulk hiring drives.\n2. **SB Work — Freelancer Marketplace**\n   • Dual authentication, project bidding & proposal system, JWT security, and role-based permissions.\n3. **Online Quiz Web Application**\n   • Interactive test execution with real-time scoring and performance tracking.\n4. **3D Interactive Developer Portfolio**\n   • Three.js WebGL canvas, 3D GLTF asset shaders, GSAP scroll triggers, and responsive glassmorphism UI.",
      actions: [
        { label: "📍 Explore Work Showcase", scrollId: "work", icon: "Code2" },
        { label: "↗ Visit RicRoot", url: "https://ricroot.in", icon: "ExternalLink" },
        { label: "⚡ Terminal Shell", scrollId: "terminal", icon: "Terminal" },
      ],
    },
  },
  {
    id: "stack",
    keywords: [
      "stack",
      "tech",
      "technology",
      "skills",
      "tools",
      "languages",
      "react",
      "node",
      "express",
      "mongodb",
      "mysql",
      "javascript",
      "tailwind",
      "docker",
      "git",
    ],
    response: {
      text: "🛠️ **Core Technical Stack & Competencies:**\n\n• **Frontend & UI**: React.js 19, JavaScript (ES6+), Three.js, React Three Fiber, Tailwind CSS, GSAP Animations, HTML5, CSS3, Vite\n• **Backend & APIs**: Node.js, Express.js, RESTful APIs, JWT Authentication, Microservices Architecture\n• **Databases & Persistence**: MongoDB (Mongoose Schema Design), MySQL, PostgreSQL, Query Optimization & Indexing\n• **DevOps & Tooling**: Git, GitHub, Docker, Postman, Linux, Vercel, Netlify, Render, UAT Testing",
      actions: [
        { label: "📍 View 3D Skills Orbit", scrollId: "skills", icon: "Code2" },
        { label: "📄 Download Resume", download: "/Shivam_Sakre_Resume.pdf", icon: "Download" },
        { label: "💬 Discuss Your Tech Stack", url: "https://wa.me/919770375191?text=Hi%20Shivam!%20Let's%20discuss%20our%20tech%20stack.", icon: "Phone" },
      ],
    },
  },
  {
    id: "contact",
    keywords: [
      "contact",
      "email",
      "mail",
      "phone",
      "whatsapp",
      "call",
      "number",
      "message",
      "reach",
      "hire",
      "get in touch",
      "social",
      "linkedin",
      "github",
    ],
    response: {
      text: "📱 **Direct Communication Channels:**\n\n• **Email**: [shivamsakre10@gmail.com](mailto:shivamsakre10@gmail.com)\n• **WhatsApp / Mobile**: [+91 97703 75191](https://wa.me/919770375191)\n• **GitHub**: [github.com/shivamsakre10-oss](https://github.com/shivamsakre10-oss)\n• **LinkedIn**: [linkedin.com/in/shivam-sakre](https://linkedin.com/in/shivam-sakre)\n• **Official Site**: [shivamsakre.in](https://shivamsakre.in)\n\n⚡ Guaranteed response time within **15 minutes** on WhatsApp or under **24 hours** via email.",
      actions: [
        { label: "💬 Open WhatsApp Chat", url: "https://wa.me/919770375191?text=Hi%20Shivam!%20Connecting%20via%20your%20portfolio.", icon: "Phone" },
        { label: "✉️ Compose in Gmail", url: "https://mail.google.com/mail/?view=cm&fs=1&to=shivamsakre10@gmail.com&su=Project%20Inquiry%20%26%20Collaboration", icon: "Mail" },
        { label: "📋 Copy Email", copy: "shivamsakre10@gmail.com", icon: "Copy" },
        { label: "📋 Copy Phone (+91 97703 75191)", copy: "+91 97703 75191", icon: "Copy" },
      ],
    },
  },
  {
    id: "pricing",
    keywords: [
      "hire",
      "quote",
      "cost",
      "price",
      "pricing",
      "rate",
      "rates",
      "hourly",
      "budget",
      "estimate",
      "scope",
      "sprint",
      "freelance",
      "availability",
      "start a project",
    ],
    response: {
      text: "💼 **Project Engagements & Sprint Availability:**\n\nShivam is currently open to:\n• **Full-Time Engineering Positions** (Remote or Hybrid)\n• **Contract Sprints & Technical Retainers**\n• **Full-Stack SaaS MVPs & 3D Interactive Web Applications**\n• **Backend Architecture & Database Optimization**\n\nYou can use the interactive **Scope Estimator** below to configure architectural features, calculate investment, and generate a customized brief in real time!",
      actions: [
        { label: "📊 Open Scope Estimator", scrollId: "scope", icon: "Calculator" },
        { label: "💬 Quick Quote on WhatsApp", url: "https://wa.me/919770375191?text=Hi%20Shivam!%20I'd%20like%20to%20get%20a%20quote%20for%20a%20project.", icon: "Phone" },
        { label: "✉️ Send Project Brief (Email)", url: "https://mail.google.com/mail/?view=cm&fs=1&to=shivamsakre10@gmail.com&su=Project%20Scope%20Inquiry", icon: "Mail" },
        { label: "📍 Jump to Contact Form", scrollId: "contact", icon: "Mail" },
      ],
    },
  },
  {
    id: "terminal",
    keywords: [
      "terminal",
      "cli",
      "command",
      "shell",
      "commands",
      "diagnostics",
      "deploy",
      "sys",
    ],
    response: {
      text: "⚡ **Interactive Developer Terminal:**\n\nYou can interact directly with the embedded browser shell emulator:\n• `help` — Show all supported command instructions\n• `top` — Run real-time performance and system memory telemetry\n• `stack` — View full stack modules & active ports\n• `sql` — Query live mock database tables\n• `deploy` — Simulate an automated CI/CD build cycle\n• `clear` — Clear terminal screen",
      actions: [
        { label: "⚡ Open Terminal Shell", scrollId: "terminal", icon: "Terminal" },
      ],
    },
  },
  {
    id: "testimonials",
    keywords: [
      "testimonial",
      "testimonials",
      "review",
      "reviews",
      "recommendation",
      "clients",
      "feedback",
      "what do people say",
    ],
    response: {
      text: "⭐ **Client Reviews & Engineering Assurance:**\n\n• **Quality Focus**: High-availability cloud systems with 99.9% uptime and zero regressions.\n• **Reliable Communication**: Regular milestone check-ins, sprint demos, and guaranteed SLA responses.\n• **On-Time Delivery**: Clean pull requests, robust test coverage, and transparent timelines.",
      actions: [
        { label: "📍 Read Client Reviews", scrollId: "reviews", icon: "CheckCircle2" },
        { label: "💬 Message Shivam", url: "https://wa.me/919770375191?text=Hi%20Shivam!%20I%20saw%20your%20portfolio%20reviews.", icon: "Phone" },
      ],
    },
  },
  {
    id: "greetings",
    keywords: ["hi", "hello", "hey", "sup", "greetings", "good morning", "good evening", "howdy"],
    response: {
      text: "👋 **Hello! How can I assist you today?**\n\nI can tell you about Shivam Sakre's technical experience, walk you through production platforms like **RicRoot** and **SB Work**, assist with an instant project estimate, or download his resume.",
      actions: [
        { label: "📄 Download Resume", download: "/Shivam_Sakre_Resume.pdf", icon: "Download" },
        { label: "🚀 Featured Projects", scrollId: "work", icon: "Code2" },
        { label: "💼 Work Experience", scrollId: "experience", icon: "Briefcase" },
        { label: "📱 WhatsApp Chat", url: "https://wa.me/919770375191?text=Hi%20Shivam!%20Connecting%20via%20your%20portfolio.", icon: "Phone" },
      ],
    },
  },
];

// Rich Markdown-like text formatter that outputs clean styled JSX
const FormattedMessage = ({ text }) => {
  const lines = text.split("\n");

  const formatInlineText = (line) => {
    // Process bold, inline code, and links
    const parts = [];
    let currentIndex = 0;

    // Regex matching [label](url), **bold**, and `code`
    const pattern = /(\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|`([^`]+)`)/g;
    let match;

    while ((match = pattern.exec(line)) !== null) {
      if (match.index > currentIndex) {
        parts.push(line.substring(currentIndex, match.index));
      }

      if (match[2] && match[3]) {
        // Link [label](url)
        parts.push(
          <a
            key={`link-${match.index}`}
            href={match[3]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#00f0ff] underline hover:text-[#5ff6ff] font-medium transition-colors"
          >
            {match[2]}
          </a>
        );
      } else if (match[4]) {
        // Bold **text**
        parts.push(
          <strong key={`bold-${match.index}`} className="text-white font-bold">
            {match[4]}
          </strong>
        );
      } else if (match[5]) {
        // Code `code`
        parts.push(
          <code
            key={`code-${match.index}`}
            className="px-1.5 py-0.5 rounded bg-[#00f0ff]/10 text-[#00f0ff] font-mono text-[11px] border border-[#00f0ff]/20"
          >
            {match[5]}
          </code>
        );
      }

      currentIndex = pattern.lastIndex;
    }

    if (currentIndex < line.length) {
      parts.push(line.substring(currentIndex));
    }

    return parts.length > 0 ? parts : line;
  };

  return (
    <div className="space-y-1.5 text-xs sm:text-[13px] leading-relaxed select-text">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={idx} className="h-1.5" />;
        }

        // Bullet point
        if (trimmed.startsWith("•") || trimmed.startsWith("-")) {
          const content = trimmed.substring(1).trim();
          return (
            <div key={idx} className="flex items-start gap-2 pl-1">
              <span className="text-[#00f0ff] text-xs mt-0.5">•</span>
              <span className="flex-1">{formatInlineText(content)}</span>
            </div>
          );
        }

        // Numbered list
        const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
        if (numMatch) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-1">
              <span className="text-[#00f0ff] font-mono text-xs mt-0.5 font-bold">
                {numMatch[1]}.
              </span>
              <span className="flex-1">{formatInlineText(numMatch[2])}</span>
            </div>
          );
        }

        return <p key={idx}>{formatInlineText(line)}</p>;
      })}
    </div>
  );
};

// Clean markdown punctuation, emojis, and code formatting so speech synthesis sounds natural
const cleanTextForSpeech = (rawText) => {
  if (!rawText) return "";
  return rawText
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/__([^_]+)__/g, "$1")
    .replace(/_([^_]+)_/g, "$1")
    .replace(/```[\s\S]*?```/g, " code omitted ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/^#+\s+/gm, "")
    .replace(/^[•\-\*]\s+/gm, "")
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, "")
    .replace(/\n+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

const PortfolioCopilot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [copyToast, setCopyToast] = useState("");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [speakingMessageId, setSpeakingMessageId] = useState(null);
  const [autoVoice, setAutoVoice] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const messagesContainerRef = useRef(null);
  const audioCtxRef = useRef(null);
  const autoVoiceRef = useRef(autoVoice);
  const recognitionRef = useRef(null);

  useEffect(() => {
    autoVoiceRef.current = autoVoice;
  }, [autoVoice]);

  // Stop ongoing speech synthesis
  const stopSpeaking = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setSpeakingMessageId(null);
  }, []);

  // Speak bot response text using Web Speech API
  const speakMessage = useCallback(
    (messageId, rawText) => {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) {
        setCopyToast("Voice synthesis not supported in this browser.");
        setTimeout(() => setCopyToast(""), 3000);
        return;
      }

      if (speakingMessageId === messageId) {
        stopSpeaking();
        return;
      }

      window.speechSynthesis.cancel();

      const text = cleanTextForSpeech(rawText);
      if (!text) return;

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      const voices = window.speechSynthesis.getVoices();
      if (voices && voices.length > 0) {
        const preferredVoice =
          voices.find(
            (v) =>
              v.lang.startsWith("en") &&
              (v.name.includes("Google") ||
                v.name.includes("Natural") ||
                v.name.includes("Samantha") ||
                v.name.includes("Microsoft") ||
                v.name.includes("Daniel"))
          ) ||
          voices.find((v) => v.lang.startsWith("en")) ||
          voices[0];
        if (preferredVoice) utterance.voice = preferredVoice;
      }

      utterance.onend = () => {
        setSpeakingMessageId(null);
      };

      utterance.onerror = (e) => {
        if (e.error !== "canceled" && e.error !== "interrupted") {
          console.warn("Speech synthesis error:", e);
        }
        setSpeakingMessageId(null);
      };

      setSpeakingMessageId(messageId);
      window.speechSynthesis.speak(utterance);
    },
    [speakingMessageId, stopSpeaking]
  );

  // Toggle voice input (Speech Recognition)
  const toggleListening = () => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setCopyToast("Voice recognition requires Chrome, Edge, or Safari.");
      setTimeout(() => setCopyToast(""), 3500);
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
      setIsListening(false);
      return;
    }

    stopSpeaking();

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onstart = () => {
        setIsListening(true);
        playChime("send");
      };

      recognition.onresult = (event) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript) {
          setInput(transcript);
        }
      };

      recognition.onerror = (event) => {
        console.warn("Speech recognition error:", event.error);
        setIsListening(false);
        if (event.error === "not-allowed" || event.error === "service-not-allowed") {
          setCopyToast("Microphone access was denied in browser.");
          setTimeout(() => setCopyToast(""), 3000);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.warn("Speech recognition init error:", err);
      setIsListening(false);
      setCopyToast("Microphone could not be initialized.");
      setTimeout(() => setCopyToast(""), 3000);
    }
  };

  // Cleanup speech synthesis & microphone when drawer closes or unmounts
  useEffect(() => {
    if (!isOpen) {
      stopSpeaking();
      if (isListening && recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
        setIsListening(false);
      }
    }
  }, [isOpen, stopSpeaking, isListening]);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  // Play subtle futuristic cyber audio cues using Web Audio API
  const playChime = useCallback(
    (type = "receive") => {
      if (!soundEnabled) return;
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        if (!audioCtxRef.current) {
          audioCtxRef.current = new AudioCtx();
        }
        const ctx = audioCtxRef.current;
        if (ctx.state === "suspended") {
          ctx.resume();
        }

        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        if (type === "send") {
          osc.type = "sine";
          osc.frequency.setValueAtTime(480, now);
          osc.frequency.exponentialRampToValueAtTime(720, now + 0.08);
          gain.gain.setValueAtTime(0.06, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
          osc.start(now);
          osc.stop(now + 0.08);
        } else {
          osc.type = "triangle";
          osc.frequency.setValueAtTime(540, now);
          osc.frequency.exponentialRampToValueAtTime(840, now + 0.1);
          gain.gain.setValueAtTime(0.07, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
          osc.start(now);
          osc.stop(now + 0.12);
        }
      } catch {
        // Audio policy ignore
      }
    },
    [soundEnabled]
  );

  // Auto-scroll messages smoothly to bottom
  useEffect(() => {
    if (isOpen && messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages, isTyping, isOpen]);

  // Intelligent offline match scoring algorithm
  const processQuery = (rawQuery) => {
    const q = rawQuery.toLowerCase().trim();

    let bestMatch = null;
    let highestScore = 0;

    for (const item of KNOWLEDGE_BASE) {
      let score = 0;
      for (const kw of item.keywords) {
        if (q === kw) {
          score += 15;
        } else if (q.includes(kw)) {
          // Weight multi-word keyword matches higher
          score += kw.includes(" ") ? 8 : 4;
        }
      }
      if (score > highestScore) {
        highestScore = score;
        bestMatch = item;
      }
    }

    if (bestMatch && highestScore >= 3) {
      return bestMatch.response;
    }

    // Default intelligent fallback
    return {
      text: "Thanks for checking in! I'm trained on **Shivam Sakre's portfolio**, software engineering background, and production platforms.\n\nHere are some popular topics you can ask me about:",
      actions: [
        { label: "📄 Download Resume", download: "/Shivam_Sakre_Resume.pdf", icon: "Download" },
        { label: "🚀 RicRoot Platform", url: "https://ricroot.in", icon: "ExternalLink" },
        { label: "💼 Work Experience", scrollId: "experience", icon: "Briefcase" },
        { label: "🛠️ Core Tech Stack", scrollId: "skills", icon: "Code2" },
        { label: "💬 WhatsApp (+91 97703 75191)", url: "https://wa.me/919770375191?text=Hi%20Shivam!%20Connecting%20via%20your%20portfolio.", icon: "Phone" },
        { label: "📊 Scope Estimator", scrollId: "scope", icon: "Calculator" },
      ],
    };
  };

  const handleSend = async (textToSend) => {
    const messageText = (textToSend || input).trim();
    if (!messageText) return;

    playChime("send");

    const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const userMsg = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: messageText,
      timestamp: timeStr,
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setIsTyping(true);

    try {
      // 1. Attempt Google Gemini API via backend proxy
      const response = await fetch("/api/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: messageText,
          history: updatedMessages,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.text) {
          const botMsg = {
            id: `bot-${Date.now()}`,
            sender: "bot",
            text: data.text,
            actions: data.actions || [],
            model: data.model || "Gemini Flash",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          };
          setMessages((prev) => [...prev, botMsg]);
          setIsTyping(false);
          playChime("receive");
          if (autoVoiceRef.current) {
            speakMessage(botMsg.id, botMsg.text);
          }
          return;
        }
      }
    } catch (err) {
      console.warn("Gemini API endpoint fallback:", err);
    }

    // 2. Intelligent Offline/Local Engine Fallback
    setTimeout(() => {
      const botResponse = processQuery(messageText);
      const botMsg = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: botResponse.text,
        actions: botResponse.actions,
        model: "Local Engine",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
      playChime("receive");
      if (autoVoiceRef.current) {
        speakMessage(botMsg.id, botMsg.text);
      }
    }, 450);
  };

  const handleActionClick = (action) => {
    if (action.copy) {
      navigator.clipboard?.writeText(action.copy);
      setCopyToast(`Copied "${action.copy}" to clipboard!`);
      setTimeout(() => setCopyToast(""), 3000);
      return;
    }

    if (action.download) {
      const link = document.createElement("a");
      link.href = action.download;
      link.download = "Shivam_Sakre_Resume.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setCopyToast("Downloading Shivam Sakre's Resume PDF...");
      setTimeout(() => setCopyToast(""), 3000);
      return;
    }

    if (action.url) {
      window.open(action.url, "_blank", "noopener,noreferrer");
      return;
    }

    if (action.scrollId) {
      setIsOpen(false);
      smoothScrollTo(action.scrollId);
      return;
    }

    if (action.query) {
      handleSend(action.query);
    }
  };

  const handleResetChat = () => {
    stopSpeaking();
    if (isListening && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
      setIsListening(false);
    }
    setMessages(INITIAL_MESSAGES);
    setInput("");
    setCopyToast("Chat history cleared.");
    setTimeout(() => setCopyToast(""), 2000);
  };

  return (
    <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50">
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-3 px-4 sm:px-5 py-3 rounded-full border border-[#00f0ff]/30 hover:border-[#00f0ff] bg-[#121318]/90 backdrop-blur-2xl text-white shadow-[0_15px_35px_rgba(0,0,0,0.85),0_0_20px_rgba(0,240,255,0.2)] hover:shadow-[0_0_35px_rgba(0,240,255,0.45),0_20px_40px_rgba(0,0,0,0.9)] hover:scale-105 active:scale-95 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer select-none"
          aria-label="Open Portfolio Copilot AI"
        >
          <div className="relative">
            <span className="flex size-7 items-center justify-center rounded-full bg-[#1e1f25] border border-[#00f0ff]/30 text-[#00f0ff] group-hover:scale-110 transition-transform duration-300">
              <Bot size={16} />
            </span>
            <span className="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-[#00f0ff] animate-ping" />
            <span className="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-[#00f0ff] shadow-[0_0_8px_#00f0ff]" />
          </div>
          <div className="flex flex-col text-left">
            <span className="font-code-md text-xs font-bold text-white group-hover:text-[#00f0ff] transition-colors tracking-wide flex items-center gap-1.5">
              <span>COPILOT AI</span>
              <span className="px-1.5 py-0.2 rounded text-[9px] bg-[#00f0ff]/15 text-[#00f0ff] font-mono border border-[#00f0ff]/30">
                v2.5
              </span>
            </span>
            <span className="text-[10px] text-[#849495] font-sans hidden sm:inline">
              Ask about projects &amp; skills
            </span>
          </div>
        </button>
      )}

      {/* Floating Chat Drawer Window */}
      {isOpen && (
        <div
          className={`rounded-3xl border border-[#00f0ff]/30 bg-[#0d0e13]/95 backdrop-blur-2xl shadow-[0_30px_90px_rgba(0,0,0,0.95),0_0_40px_rgba(0,240,255,0.15)] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 transition-all ${
            isExpanded
              ? "w-[94vw] sm:w-[520px] max-w-[540px] h-[640px] max-h-[88vh]"
              : "w-[340px] sm:w-[410px] h-[550px] max-h-[85vh]"
          }`}
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-4 sm:px-5 py-3.5 border-b border-white/10 bg-[#14161f]/80 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="relative">
                <span className="flex size-8 items-center justify-center rounded-xl bg-[#00f0ff]/10 border border-[#00f0ff]/40 text-[#00f0ff] shadow-[0_0_12px_rgba(0,240,255,0.3)]">
                  <Bot size={18} />
                </span>
                <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-emerald-400 border-2 border-[#121318]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-white tracking-wider font-code-md">
                    SHIVAM COPILOT AI
                  </h4>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/40">
                    LIVE
                  </span>
                </div>
                <p className="text-[10px] text-[#b9cacb] font-mono flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] animate-pulse" />
                  <span>Interactive Portfolio Intelligence</span>
                </p>
              </div>
            </div>

            {/* Header Control Buttons */}
            <div className="flex items-center gap-1 sm:gap-1.5 text-white/60">
              {/* Auto Voice Reader Toggle */}
              <button
                type="button"
                onClick={() => {
                  setAutoVoice((prev) => {
                    const next = !prev;
                    if (!next) stopSpeaking();
                    setCopyToast(next ? "Auto-read voice enabled 🔊" : "Auto-read voice disabled 🔇");
                    setTimeout(() => setCopyToast(""), 2000);
                    return next;
                  });
                }}
                className={`size-7 rounded-lg flex items-center justify-center transition-all cursor-pointer relative ${
                  autoVoice
                    ? "bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/50 shadow-[0_0_10px_rgba(0,240,255,0.3)]"
                    : "hover:bg-white/10 hover:text-white"
                }`}
                title={autoVoice ? "Auto-read answers in voice: ON (Click to disable)" : "Auto-read answers in voice: OFF (Click to enable)"}
                aria-label="Toggle auto voice reader"
              >
                <Headphones size={14} />
                {autoVoice && (
                  <span className="absolute -top-0.5 -right-0.5 size-1.5 rounded-full bg-[#00f0ff] shadow-[0_0_6px_#00f0ff]" />
                )}
              </button>

              {/* Sound Toggle */}
              <button
                type="button"
                onClick={() => setSoundEnabled((prev) => !prev)}
                className="size-7 rounded-lg hover:bg-white/10 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                title={soundEnabled ? "Mute audio cues" : "Enable audio cues"}
                aria-label="Toggle audio feedback"
              >
                {soundEnabled ? <Volume2 size={14} className="text-[#00f0ff]" /> : <VolumeX size={14} />}
              </button>

              {/* Clear History */}
              <button
                type="button"
                onClick={handleResetChat}
                className="size-7 rounded-lg hover:bg-white/10 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                title="Reset conversation"
                aria-label="Reset conversation"
              >
                <RotateCcw size={14} />
              </button>

              {/* Expand / Minimize Toggle */}
              <button
                type="button"
                onClick={() => setIsExpanded((prev) => !prev)}
                className="size-7 rounded-lg hover:bg-white/10 hover:text-white hidden sm:flex items-center justify-center transition-colors cursor-pointer"
                title={isExpanded ? "Standard view" : "Expand view"}
                aria-label="Toggle chat window size"
              >
                {isExpanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
              </button>

              {/* Close Window */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="size-7 rounded-lg bg-white/5 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/40 border border-transparent transition-all flex items-center justify-center cursor-pointer ml-1"
                aria-label="Close copilot assistant"
              >
                <X size={15} />
              </button>
            </div>
          </div>

          {/* Quick Toast Notification */}
          {copyToast && (
            <div className="bg-[#00f0ff] text-[#06070a] text-[11px] font-bold py-1.5 px-4 text-center animate-in fade-in duration-150 flex items-center justify-center gap-1.5 shadow-[0_4px_12px_rgba(0,240,255,0.4)]">
              <Check size={13} />
              <span>{copyToast}</span>
            </div>
          )}

          {/* Quick Prompt Carousel Pills */}
          <div className="px-3 py-2 border-b border-white/[0.06] bg-[#0f1118]/70 flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth">
            <span className="text-[10px] font-code-sm text-[#00f0ff] uppercase tracking-wider shrink-0 flex items-center gap-1">
              <Sparkles size={11} />
              <span>Suggested:</span>
            </span>
            {QUICK_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(prompt.query)}
                className="shrink-0 px-2.5 py-1 rounded-full text-[11px] font-code-sm bg-white/[0.04] hover:bg-[#00f0ff]/15 text-[#b9cacb] hover:text-[#00f0ff] border border-white/[0.08] hover:border-[#00f0ff]/40 transition-all duration-200 cursor-pointer active:scale-95"
              >
                {prompt.label}
              </button>
            ))}
          </div>

          {/* Messages Stream */}
          <div
            ref={messagesContainerRef}
            className="flex-1 p-4 overflow-y-auto space-y-4 text-xs font-sans scroll-smooth"
          >
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${
                  m.sender === "user" ? "items-end" : "items-start"
                }`}
              >
                {/* Header label & Timestamp */}
                <div className="flex items-center gap-1.5 mb-1 px-1 text-[10px] font-mono text-[#849495]">
                  {m.sender === "user" ? (
                    <span>You</span>
                  ) : (
                    <span className="text-[#00f0ff] font-semibold flex items-center gap-1">
                      <Bot size={11} />
                      <span>Shivam Copilot</span>
                    </span>
                  )}
                  <span>•</span>
                  <span>{m.timestamp || "Just now"}</span>
                </div>

                {/* Message Bubble */}
                <div
                  className={`p-3.5 sm:p-4 rounded-2xl max-w-[88%] sm:max-w-[85%] leading-relaxed ${
                    m.sender === "user"
                      ? "bg-gradient-to-r from-[#00f0ff]/20 to-[#38bdf8]/20 text-white rounded-tr-sm border border-[#00f0ff]/40 shadow-[0_0_20px_rgba(0,240,255,0.15)]"
                      : "bg-[#14161f] text-[#e3e1e9] border border-white/10 rounded-tl-sm shadow-md"
                  }`}
                >
                  <FormattedMessage text={m.text} />

                  {/* Bot Voice Reader Action Row */}
                  {m.sender === "bot" && (
                    <div className="mt-3 pt-2.5 border-t border-white/[0.08] flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        {speakingMessageId === m.id ? (
                          <button
                            type="button"
                            onClick={stopSpeaking}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#00f0ff]/20 hover:bg-[#00f0ff]/30 text-[#00f0ff] border border-[#00f0ff]/50 text-[10px] font-mono font-semibold transition-all cursor-pointer shadow-[0_0_12px_rgba(0,240,255,0.3)]"
                            title="Stop reading aloud"
                          >
                            <Square size={10} className="fill-current text-[#00f0ff]" />
                            <span>Stop Voice</span>
                            <span className="flex items-center gap-0.5 ml-1">
                              <span className="w-0.5 h-2 bg-[#00f0ff] rounded-full animate-bounce" />
                              <span className="w-0.5 h-3 bg-[#00f0ff] rounded-full animate-pulse" />
                              <span className="w-0.5 h-1.5 bg-[#00f0ff] rounded-full animate-bounce" />
                            </span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => speakMessage(m.id, m.text)}
                            className="group/read inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-[#00f0ff]/15 hover:border-[#00f0ff]/40 text-[#b9cacb] hover:text-[#00f0ff] border border-white/[0.08] text-[10px] font-mono transition-all duration-200 cursor-pointer"
                            title="Read answer aloud in voice"
                          >
                            <Volume2 size={11} className="text-[#00f0ff] group-hover/read:scale-110 transition-transform" />
                            <span>Read Aloud</span>
                          </button>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard?.writeText(m.text);
                            setCopyToast("Copied answer to clipboard!");
                            setTimeout(() => setCopyToast(""), 2000);
                          }}
                          className="text-[#849495] hover:text-[#00f0ff] p-1 rounded hover:bg-white/[0.05] transition-colors cursor-pointer"
                          title="Copy answer"
                          aria-label="Copy message text"
                        >
                          <Copy size={11} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Bot Interactive Action Chips */}
                {m.actions && m.actions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2.5 max-w-[92%]">
                    {m.actions.map((act, aIdx) => (
                      <button
                        key={aIdx}
                        type="button"
                        onClick={() => handleActionClick(act)}
                        className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/10 hover:border-[#00f0ff]/60 bg-[#181a24] hover:bg-[#1f2230] text-[#b9cacb] hover:text-[#00f0ff] hover:shadow-[0_0_15px_rgba(0,240,255,0.25)] hover:-translate-y-0.5 active:scale-95 text-[11px] font-medium tracking-wide transition-all duration-200 cursor-pointer select-none"
                      >
                        {act.icon === "Download" && <Download size={12} className="text-[#00f0ff]" />}
                        {act.icon === "ExternalLink" && <ExternalLink size={12} className="text-[#00f0ff]" />}
                        {act.icon === "Briefcase" && <Briefcase size={12} className="text-[#00f0ff]" />}
                        {act.icon === "Code2" && <Code2 size={12} className="text-[#00f0ff]" />}
                        {act.icon === "Phone" && <Phone size={12} className="text-emerald-400" />}
                        {act.icon === "Mail" && <Mail size={12} className="text-cyan-400" />}
                        {act.icon === "Copy" && <Copy size={12} className="text-[#00f0ff]" />}
                        {act.icon === "Calculator" && <Calculator size={12} className="text-purple-400" />}
                        {act.icon === "Terminal" && <Terminal size={12} className="text-amber-400" />}
                        <span>{act.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Animated Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-2 p-3 rounded-2xl bg-[#14161f] border border-white/10 w-fit">
                <span className="text-[10px] text-[#00f0ff] font-mono mr-1">Analyzing</span>
                <span className="size-1.5 rounded-full bg-[#00f0ff] animate-bounce" />
                <span
                  className="size-1.5 rounded-full bg-[#00f0ff] animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                />
                <span
                  className="size-1.5 rounded-full bg-[#00f0ff] animate-bounce"
                  style={{ animationDelay: "0.4s" }}
                />
              </div>
            )}
          </div>

          {/* Chat Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 sm:p-3.5 border-t border-white/10 bg-[#14161f]/80 backdrop-blur-md flex items-center gap-2"
          >
            <div className="relative flex-1">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  isListening
                    ? "🎙️ Listening... Speak your question now..."
                    : "Ask about RicRoot, experience, stack, or resume..."
                }
                className={`w-full bg-[#090a0f] text-white placeholder:text-[#849495] border ${
                  isListening
                    ? "border-[#00f0ff] ring-2 ring-[#00f0ff]/30 shadow-[0_0_20px_rgba(0,240,255,0.3)] placeholder:text-[#00f0ff]"
                    : "border-white/10 focus:border-[#00f0ff]/70 focus:shadow-[0_0_15px_rgba(0,240,255,0.25)]"
                } rounded-full pl-4 pr-9 sm:pr-10 py-2.5 text-xs sm:text-[13px] focus:outline-none transition-all duration-200`}
              />
              {isListening && (
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                  </span>
                </span>
              )}
            </div>

            {/* Voice Input (Speech-to-Text Microphone) Button */}
            <button
              type="button"
              onClick={toggleListening}
              className={`size-9 rounded-full border transition-all duration-300 flex items-center justify-center cursor-pointer select-none shrink-0 ${
                isListening
                  ? "bg-red-500/20 border-red-500 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.5)] animate-pulse"
                  : "bg-white/[0.05] hover:bg-[#00f0ff]/20 border-white/10 hover:border-[#00f0ff]/50 text-[#b9cacb] hover:text-[#00f0ff] hover:scale-105 active:scale-95"
              }`}
              title={isListening ? "Stop listening" : "Ask with voice (Microphone input)"}
              aria-label="Toggle voice input"
            >
              {isListening ? <MicOff size={15} /> : <Mic size={15} />}
            </button>

            {/* Send Button */}
            <button
              type="submit"
              disabled={!input.trim()}
              className="size-9 rounded-full bg-gradient-to-r from-[#00f0ff] to-[#38bdf8] text-[#06070a] hover:shadow-[0_0_25px_rgba(0,240,255,0.7)] hover:scale-105 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none font-bold flex items-center justify-center transition-all duration-200 cursor-pointer select-none shrink-0 shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)]"
              aria-label="Send message to Copilot"
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default PortfolioCopilot;
