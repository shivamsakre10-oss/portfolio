import { askGemini } from "../server/geminiService.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "METHOD_NOT_ALLOWED",
      message: "Only POST requests are permitted.",
    });
  }

  try {
    const result = await askGemini(req.body);
    const statusCode = result.success ? 200 : (result.reason === "NO_API_KEY" ? 200 : 400);
    return res.status(statusCode).json(result);
  } catch (err) {
    console.error("Vercel Copilot Serverless Function Error:", err);
    return res.status(500).json({
      success: false,
      error: "SERVER_ERROR",
      message: err.message,
    });
  }
}
