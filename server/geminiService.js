import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const GEMINI_SYSTEM_INSTRUCTION = `You are "Portfolio Copilot AI", an elite AI assistant embedded in the 3D portfolio of Shivam Sakre.
Your job is to assist recruiters, engineering managers, clients, and visitors with accurate information about Shivam Sakre's background, work experience, projects, skills, and availability.

### GROUND TRUTH ABOUT SHIVAM SAKRE:
- Identity: Shivam Sakre, Elite Full Stack Developer & Technical Architect based in India.
- Current Position: Software Developer at Veracity Supply Chain Limited (Ahmedabad, India | Sept 2026 – Present).
  - Scope: Developing scalable RESTful APIs & backend architecture with Node.js, engineering responsive interfaces with React.js & modern JavaScript, database schema architecture, query optimization, unit testing, code reviews, and UAT (User Acceptance Testing).
- Previous Position: MERN Stack Developer Intern at Ypsilon IT Solutions Pvt Ltd (Indore, India | March 2026 – August 2026).
  - Scope: E-commerce web applications using MERN stack (MongoDB, Express, React, Node.js), API design for auth, product catalogs, shopping cart & checkout workflows.
- Core Technical Stack:
  - Frontend: React.js (React 19), JavaScript (ES6+), Three.js, React Three Fiber (R3F), Tailwind CSS, GSAP, HTML5, CSS3, Vite.
  - Backend & APIs: Node.js, Express.js, RESTful APIs, JWT Authentication, Microservices.
  - Databases: MongoDB (Mongoose Schema Design), MySQL, PostgreSQL, Query Optimization & Indexing.
  - DevOps & Tools: Git, GitHub, Docker, Postman, Linux, Vercel, Netlify, Render.
- Flagship Projects:
  1. RicRoot (https://ricroot.in): Workforce hiring platform connecting employers with verified blue & grey collar talent. Features: Automated AI candidate screening calls, digital verification, shift-based job search, interview booking with calendar integrations, and bulk hiring drives. Built with React.js, Node.js, Express.js, MongoDB, REST APIs.
  2. SB Work: Freelancer Marketplace. Features: Dual-role authentication (Client vs Freelancer), job posting, proposal bidding, role-based authorization, JWT security, and scalable MongoDB schemas. Built with MERN stack.
  3. Online Quiz Web Application: Interactive real-time assessment platform with dynamic scoring, timers, and responsive UI.
  4. 3D Developer Portfolio: High-performance Three.js WebGL canvas, 3D GLTF models, interactive shaders, and GSAP animations.
- Resume: Downloadable PDF available at /Shivam_Sakre_Resume.pdf.
- Direct Contact Channels:
  - Email: shivamsakre10@gmail.com
  - WhatsApp / Phone: +91 97703 75191 (WhatsApp link: https://wa.me/919770375191)
  - GitHub: https://github.com/shivamsakre10-oss
  - LinkedIn: https://linkedin.com/in/shivam-sakre
  - Official Website: https://shivamsakre.in
- Availability & Engagements: Open to full-time engineering roles (remote or hybrid), contract sprints, SaaS MVP development, and architecture consulting. Interactive project cost and timeline estimates can be calculated in the Scope Estimator section (#scope).

### RESPONSE GUIDELINES:
1. Tone: Confident, technically knowledgeable, professional, and friendly with a sleek developer flair.
2. Formatting: Use standard markdown (bullet points •, bold **text**, inline code \`code\`). Keep responses clean, readable, and structured.
3. Brevity: Keep answers focused and concise (1-3 crisp paragraphs or clear bullet points). Avoid fluff or overly long essays.
4. Accuracy: Never hallucinate companies, degrees, or tools Shivam doesn't use.
5. Inquiries: When visitors ask about hiring or contacting Shivam, provide direct links to WhatsApp (+91 97703 75191) and email (shivamsakre10@gmail.com).`;

/**
 * Determine dynamic action buttons based on user message and Gemini response
 */
function deriveActions(query, responseText) {
  const q = (query || "").toLowerCase();
  const r = (responseText || "").toLowerCase();
  const actions = [];

  // Resume action
  if (q.includes("resume") || q.includes("cv") || r.includes("resume") || r.includes("cv")) {
    actions.push({
      label: "⬇️ Download Resume PDF",
      download: "/Shivam_Sakre_Resume.pdf",
      icon: "Download",
    });
  }

  // RicRoot action
  if (q.includes("ricroot") || r.includes("ricroot") || r.includes("workforce")) {
    actions.push({
      label: "↗ Visit RicRoot (ricroot.in)",
      url: "https://ricroot.in",
      icon: "ExternalLink",
    });
  }

  // Work showcase / Projects action
  if (q.includes("project") || q.includes("work") || q.includes("build") || r.includes("sb work")) {
    actions.push({
      label: "📍 View Projects Showcase",
      scrollId: "work",
      icon: "Code2",
    });
  }

  // Experience action
  if (q.includes("experience") || q.includes("veracity") || q.includes("ypsilon") || q.includes("job") || r.includes("veracity")) {
    actions.push({
      label: "💼 View Experience Timeline",
      scrollId: "experience",
      icon: "Briefcase",
    });
  }

  // Skills / Tech stack action
  if (q.includes("stack") || q.includes("skills") || q.includes("three") || q.includes("react") || q.includes("tech")) {
    actions.push({
      label: "🛠️ Explore Tech Stack",
      scrollId: "skills",
      icon: "Code2",
    });
  }

  // Scope Estimator / Pricing action
  if (q.includes("price") || q.includes("cost") || q.includes("quote") || q.includes("scope") || q.includes("rate") || q.includes("budget") || r.includes("scope estimator")) {
    actions.push({
      label: "📊 Open Scope Estimator",
      scrollId: "scope",
      icon: "Calculator",
    });
  }

  // Contact / WhatsApp action
  if (
    actions.length === 0 ||
    q.includes("contact") ||
    q.includes("hire") ||
    q.includes("whatsapp") ||
    q.includes("email") ||
    q.includes("call") ||
    r.includes("whatsapp")
  ) {
    actions.push({
      label: "💬 Chat on WhatsApp",
      url: "https://wa.me/919770375191?text=Hi%20Shivam!%20Connecting%20via%20your%20portfolio%20AI.",
      icon: "Phone",
    });
    actions.push({
      label: "✉️ Compose in Gmail",
      url: "https://mail.google.com/mail/?view=cm&fs=1&to=shivamsakre10@gmail.com&su=Project%20Inquiry%20from%20Portfolio",
      icon: "Mail",
    });
  }

  // Deduplicate by label
  const seen = new Set();
  return actions.filter((act) => {
    if (seen.has(act.label)) return false;
    seen.add(act.label);
    return true;
  });
}

/**
 * Call Google Gemini API
 */
export async function askGemini({ message, history = [] }) {
  const apiKey =
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    process.env.VITE_GEMINI_API_KEY;

  if (!apiKey || apiKey.trim() === "" || apiKey === "your-gemini-api-key-here") {
    return {
      success: false,
      reason: "NO_API_KEY",
      message: "No GEMINI_API_KEY found in server environment.",
    };
  }

  // Format past history for Gemini API
  const contents = [];

  if (Array.isArray(history)) {
    // Take up to last 8 conversation turns for context
    const recent = history.slice(-8);
    for (const turn of recent) {
      if (turn.sender === "user" && turn.text) {
        contents.push({
          role: "user",
          parts: [{ text: String(turn.text) }],
        });
      } else if (turn.sender === "bot" && turn.text) {
        contents.push({
          role: "model",
          parts: [{ text: String(turn.text) }],
        });
      }
    }
  }

  // Add the current user query
  contents.push({
    role: "user",
    parts: [{ text: message }],
  });

  const payload = {
    system_instruction: {
      parts: [{ text: GEMINI_SYSTEM_INSTRUCTION }],
    },
    contents,
    generationConfig: {
      temperature: 0.65,
      maxOutputTokens: 600,
      topP: 0.95,
    },
  };

  // Supported active Google Gemini models
  const models = [
    "gemini-3.5-flash",
    "gemini-3.1-flash-lite",
    "gemini-3.7-flash",
    "gemini-3.8-flash",
  ];

  let lastError = null;

  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(
        apiKey.trim()
      )}`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errText = await response.text();
        console.warn(`[Gemini API] Model ${model} returned HTTP ${response.status}:`, errText);
        lastError = new Error(`HTTP ${response.status}: ${errText}`);
        continue; // Try next model
      }

      const data = await response.json();
      const candidate = data?.candidates?.[0];
      const text = candidate?.content?.parts?.[0]?.text;

      if (text && text.trim()) {
        const cleanText = text.trim();
        const actions = deriveActions(message, cleanText);
        return {
          success: true,
          text: cleanText,
          actions,
          model,
          provider: "Google Gemini",
        };
      }
    } catch (err) {
      console.warn(`[Gemini API] Request error for ${model}:`, err.message);
      lastError = err;
    }
  }

  return {
    success: false,
    reason: "API_ERROR",
    error: lastError ? lastError.message : "Failed to generate response from Gemini API",
  };
}
