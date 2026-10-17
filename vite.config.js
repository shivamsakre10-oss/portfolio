import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import {
  sendContactEmail,
  sendReceiptEmail,
  isSmtpConfigured,
} from "./server/emailService.js";
import { askGemini } from "./server/geminiService.js";

function apiDevMiddleware() {
  return {
    name: "api-dev-middleware",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url ? req.url.split("?")[0] : "";

        if (url === "/api/health" && req.method === "GET") {
          res.setHeader("Content-Type", "application/json");
          res.end(
            JSON.stringify({
              status: "ok",
              service: "NEXUS_SYS Dev API Middleware",
              smtpConfigured: isSmtpConfigured(),
              destination:
                process.env.CONTACT_DESTINATION_EMAIL || "shivamsakre10@gmail.com",
            })
          );
          return;
        }

        if (url === "/api/contact" && req.method === "POST") {
          let rawBody = "";
          req.on("data", (chunk) => {
            rawBody += chunk;
          });
          req.on("end", async () => {
            try {
              const body = rawBody ? JSON.parse(rawBody) : {};
              const forwarded = req.headers["x-forwarded-for"];
              const ip =
                typeof forwarded === "string"
                  ? forwarded.split(",")[0].trim()
                  : Array.isArray(forwarded) && forwarded[0]
                  ? forwarded[0].trim()
                  : req.socket?.remoteAddress || "127.0.0.1";
              const result = await sendContactEmail({ ...body, ip });
              res.statusCode = result.status || (result.success ? 200 : 400);
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify(result));
            } catch (err) {
              res.statusCode = 500;
              res.setHeader("Content-Type", "application/json");
              res.end(
                JSON.stringify({
                  success: false,
                  status: 500,
                  error: "SERVER_ERROR",
                  message: err.message,
                })
              );
            }
          });
          return;
        }

        if (url === "/api/send-receipt" && req.method === "POST") {
          let rawBody = "";
          req.on("data", (chunk) => {
            rawBody += chunk;
          });
          req.on("end", async () => {
            try {
              const body = rawBody ? JSON.parse(rawBody) : {};
              const forwarded = req.headers["x-forwarded-for"];
              const ip =
                typeof forwarded === "string"
                  ? forwarded.split(",")[0].trim()
                  : Array.isArray(forwarded) && forwarded[0]
                  ? forwarded[0].trim()
                  : req.socket?.remoteAddress || "127.0.0.1";
              const result = await sendReceiptEmail({ ...body, ip });
              res.statusCode = result.status || (result.success ? 200 : 400);
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify(result));
            } catch (err) {
              res.statusCode = 500;
              res.setHeader("Content-Type", "application/json");
              res.end(
                JSON.stringify({
                  success: false,
                  status: 500,
                  error: "SERVER_ERROR",
                  message: err.message,
                })
              );
            }
          });
          return;
        }

        if (url === "/api/copilot" && req.method === "POST") {
          let rawBody = "";
          req.on("data", (chunk) => {
            rawBody += chunk;
          });
          req.on("end", async () => {
            try {
              const body = rawBody ? JSON.parse(rawBody) : {};
              const result = await askGemini(body);
              res.statusCode = result.success ? 200 : (result.reason === "NO_API_KEY" ? 200 : 400);
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify(result));
            } catch (err) {
              res.statusCode = 500;
              res.setHeader("Content-Type", "application/json");
              res.end(
                JSON.stringify({
                  success: false,
                  status: 500,
                  error: "GEMINI_SERVER_ERROR",
                  message: err.message,
                })
              );
            }
          });
          return;
        }

        next();
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), apiDevMiddleware()],
  build: {
    rollupOptions: {
      output: {
        // Keep large, rarely-changing vendors in their own cacheable chunks
        manualChunks(id) {
          if (!id.includes("node_modules")) return undefined;
          if (id.includes("/three/")) return "three";
          if (id.includes("/gsap/")) return "gsap";
          if (id.includes("framer-motion") || id.includes("/motion-")) return "motion";
          return undefined;
        },
      },
    },
  },
});
