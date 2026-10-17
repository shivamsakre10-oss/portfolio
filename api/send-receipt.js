import { sendReceiptEmail } from "../server/emailService.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "METHOD_NOT_ALLOWED", message: "Only POST allowed." });
  }

  const forwarded = req.headers["x-forwarded-for"];
  const ip =
    typeof forwarded === "string"
      ? forwarded.split(",")[0].trim()
      : Array.isArray(forwarded) && forwarded[0]
      ? forwarded[0].trim()
      : req.socket?.remoteAddress || "127.0.0.1";

  try {
    const result = await sendReceiptEmail({ ...req.body, ip });
    return res.status(result.status || (result.success ? 200 : 400)).json(result);
  } catch (err) {
    console.error("Vercel receipt handler error:", err);
    return res.status(500).json({ success: false, error: "SERVER_ERROR", message: err.message });
  }
}
