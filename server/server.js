import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import {
  sendContactEmail,
  sendReceiptEmail,
  isSmtpConfigured,
} from "./emailService.js";
import { askGemini } from "./geminiService.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Security and utility middlewares
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "50kb" }));

// Helper to extract client IP
function getClientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return req.socket.remoteAddress || "127.0.0.1";
}

// 1. Health check & configuration status
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "NEXUS_SYS Transmission API",
    smtpConfigured: isSmtpConfigured(),
    destination: process.env.CONTACT_DESTINATION_EMAIL || "shivamsakre10@gmail.com",
    timestamp: new Date().toISOString(),
  });
});

// 2. Primary contact submission endpoint
app.post("/api/contact", async (req, res) => {
  try {
    const ip = getClientIp(req);
    const result = await sendContactEmail({ ...req.body, ip });
    return res.status(result.status || (result.success ? 200 : 400)).json(result);
  } catch (err) {
    console.error("Unhandled contact API error:", err);
    return res.status(500).json({
      success: false,
      status: 500,
      error: "INTERNAL_SERVER_ERROR",
      message: "An unexpected server error occurred while processing transmission.",
    });
  }
});

// 3. Dispatch receipt email endpoint
app.post("/api/send-receipt", async (req, res) => {
  try {
    const ip = getClientIp(req);
    const result = await sendReceiptEmail({ ...req.body, ip });
    return res.status(result.status || (result.success ? 200 : 400)).json(result);
  } catch (err) {
    console.error("Unhandled receipt API error:", err);
    return res.status(500).json({
      success: false,
      status: 500,
      error: "INTERNAL_SERVER_ERROR",
      message: "An unexpected server error occurred while sending receipt.",
    });
  }
});

// 4. Portfolio Copilot AI powered by Google Gemini
app.post("/api/copilot", async (req, res) => {
  try {
    const result = await askGemini(req.body);
    const statusCode = result.success ? 200 : (result.reason === "NO_API_KEY" ? 200 : 400);
    return res.status(statusCode).json(result);
  } catch (err) {
    console.error("Unhandled copilot API error:", err);
    return res.status(500).json({
      success: false,
      status: 500,
      error: "INTERNAL_SERVER_ERROR",
      message: "An unexpected error occurred during Copilot AI processing.",
    });
  }
});

// Serve frontend static files in production if available
const distPath = path.resolve(__dirname, "../dist");
app.use(express.static(distPath));
app.use((req, res, next) => {
  if (req.path.startsWith("/api/")) {
    return next();
  }
  res.sendFile(path.join(distPath, "index.html"), (err) => {
    if (err) next();
  });
});

app.listen(PORT, () => {
  console.log(`[NEXUS_SYS API] Server running on http://localhost:${PORT}`);
  console.log(`[NEXUS_SYS API] SMTP Configured: ${isSmtpConfigured() ? "YES" : "NO (Set SMTP_USER & SMTP_PASS in .env)"}`);
});
