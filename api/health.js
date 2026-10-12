import { isSmtpConfigured } from "../server/emailService.js";

export default function handler(req, res) {
  res.json({
    status: "ok",
    service: "NEXUS_SYS Serverless API",
    smtpConfigured: isSmtpConfigured(),
    destination: process.env.CONTACT_DESTINATION_EMAIL || "shivamsakre10@gmail.com",
    timestamp: new Date().toISOString(),
  });
}
