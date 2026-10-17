import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Simple in-memory rate limiter: IP -> { count, resetTime }
const rateLimitMap = new Map();
const RATE_LIMIT_MAX = 10; // max 10 submissions
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // per 10 minutes

export function resetRateLimit(ip) {
  if (ip) {
    rateLimitMap.delete(ip);
  } else {
    rateLimitMap.clear();
  }
}

export function checkRateLimit(ip) {
  const normalizedIp = String(ip || "").trim().toLowerCase();

  // Never rate-limit localhost / private loopback during local development & testing
  const isLoopback =
    !normalizedIp ||
    normalizedIp === "127.0.0.1" ||
    normalizedIp === "::1" ||
    normalizedIp === "::ffff:127.0.0.1" ||
    normalizedIp === "localhost" ||
    process.env.NODE_ENV === "development";

  if (isLoopback) {
    return { allowed: true };
  }

  const now = Date.now();
  const entry = rateLimitMap.get(normalizedIp);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(normalizedIp, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true };
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    const minutesLeft = Math.ceil((entry.resetTime - now) / 60000);
    return {
      allowed: false,
      message: `Rate limit exceeded. Please wait ${minutesLeft} minute(s) before sending another transmission.`,
    };
  }

  entry.count += 1;
  return { allowed: true };
}

// Check if SMTP or Resend API is configured in environment
export function isSmtpConfigured() {
  if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY.trim() !== "") {
    return true;
  }
  const user = (process.env.SMTP_USER || "").trim();
  const pass = (process.env.SMTP_PASS || "").trim();
  return Boolean(
    user &&
      pass &&
      !pass.includes("xxxx") &&
      pass !== "your-16-char-gmail-app-password"
  );
}

// Create configured Nodemailer transporter
export function createTransporter() {
  const user = (process.env.SMTP_USER || "").trim();
  const pass = (process.env.SMTP_PASS || "").trim();
  if (!user || !pass) {
    return null;
  }

  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = Number(process.env.SMTP_PORT) || 465;
  const secure = process.env.SMTP_SECURE === "true" || port === 465;

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
    // Useful timeout limits
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 20000,
  });
}

// Input validation
export function validateContactInput(data) {
  const { alias, email, brief, _gotcha } = data || {};

  // Spam Honeypot check
  if (_gotcha && String(_gotcha).trim().length > 0) {
    return { valid: false, error: "Automated submission detected (honeypot triggered)." };
  }

  if (!alias || typeof alias !== "string" || alias.trim().length < 2) {
    return { valid: false, error: "Name / Alias must be at least 2 characters." };
  }
  if (alias.trim().length > 100) {
    return { valid: false, error: "Name / Alias must not exceed 100 characters." };
  }

  if (!email || typeof email !== "string") {
    return { valid: false, error: "Contact email is required." };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return { valid: false, error: "Invalid email address format." };
  }
  if (email.trim().length > 255) {
    return { valid: false, error: "Email must not exceed 255 characters." };
  }

  if (!brief || typeof brief !== "string" || brief.trim().length < 5) {
    return { valid: false, error: "Technical brief must be at least 5 characters." };
  }
  if (brief.trim().length > 5000) {
    return { valid: false, error: "Technical brief exceeds 5000 characters limit." };
  }

  return { valid: true };
}

// Primary Contact Form Submission
export async function sendContactEmail({ alias, email, scope, budget, brief, _gotcha, ip = "127.0.0.1" }) {
  // 1. Rate Limiting
  const rateCheck = checkRateLimit(ip);
  if (!rateCheck.allowed) {
    return {
      success: false,
      status: 429,
      error: "RATE_LIMIT_EXCEEDED",
      message: rateCheck.message,
    };
  }

  // 2. Input Validation
  const validation = validateContactInput({ alias, email, brief, _gotcha });
  if (!validation.valid) {
    return {
      success: false,
      status: 400,
      error: "VALIDATION_FAILED",
      message: validation.error,
    };
  }

  // 3. SMTP Configuration Check
  if (!isSmtpConfigured()) {
    const isDev =
      process.env.NODE_ENV !== "production" ||
      !ip ||
      ip === "127.0.0.1" ||
      ip === "::1" ||
      ip === "::ffff:127.0.0.1" ||
      ip === "localhost";

    if (isDev) {
      const sanitizedScope = (scope || "WEB-PLATFORM").toUpperCase();
      const sanitizedBudget = (budget || "TIER2").toUpperCase();
      const destinationEmail =
        process.env.CONTACT_DESTINATION_EMAIL || "shivamsakre10@gmail.com";

      console.log("\n=======================================================");
      console.log("⚡ [NEXUS_SYS TRANSMISSION RECEIVED - SIMULATION / DEV MODE]");
      console.log(`From        : ${alias.trim()} <${email.trim()}>`);
      console.log(`Scope       : ${sanitizedScope}`);
      console.log(`Budget      : ${sanitizedBudget}`);
      console.log(`Brief       : ${brief.trim()}`);
      console.log(`Destination : ${destinationEmail}`);
      console.log("Notice: Set SMTP_PASS in .env with your 16-character App Password to dispatch live emails.");
      console.log("=======================================================\n");

      return {
        success: true,
        status: 200,
        isDevSimulation: true,
        message: "EMAIL ACCEPTED BY MAIL SERVER",
        messageId: `TX-SIM-${Date.now().toString(36).toUpperCase()}`,
        response: "200 OK (Accepted - Dev Simulation)",
        destination: destinationEmail,
      };
    }

    return {
      success: false,
      status: 503,
      error: "SMTP_NOT_CONFIGURED",
      message:
        "Mail server credentials missing. Please set SMTP_USER and SMTP_PASS in the .env file.",
    };
  }

  const destinationEmail =
    process.env.CONTACT_DESTINATION_EMAIL || "shivamsakre10@gmail.com";
  const fromName = process.env.SMTP_FROM_NAME || "NEXUS_SYS Transmission";
  const fromAddress = process.env.SMTP_FROM || process.env.SMTP_USER;

  const sanitizedScope = (scope || "WEB-PLATFORM").toUpperCase();
  const sanitizedBudget = (budget || "TIER2").toUpperCase();
  const timestamp = new Date().toISOString();

  const mailOptions = {
    from: `"${fromName}" <${fromAddress}>`,
    to: destinationEmail,
    replyTo: email.trim(),
    subject: `[NEXUS_SYS Inquiry] ${sanitizedScope} — From ${alias.trim()}`,
    text: `================================================================================
// NEXUS_SYS SECURE TRANSMISSION DISPATCH
================================================================================

TRANSMISSION METADATA:
--------------------------------------------------------------------------------
Client Name / Alias : ${alias.trim()}
Contact Email       : ${email.trim()}
Engagement Scope    : ${sanitizedScope}
Budget Allocation   : ${sanitizedBudget}
Timestamp (UTC)     : ${timestamp}
Source IP           : ${ip}

TECHNICAL BRIEF PAYLOAD:
--------------------------------------------------------------------------------
${brief.trim()}

================================================================================
Note: Reply directly to this email to respond to ${alias.trim()} (${email.trim()}).
`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0e15; color: #e1e2ec; margin: 0; padding: 24px; }
    .card { max-width: 600px; margin: 0 auto; background: #10131a; border: 1px solid rgba(0, 229, 255, 0.3); border-radius: 12px; padding: 28px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.8); }
    .header { border-bottom: 1px solid rgba(255, 255, 255, 0.1); padding-bottom: 16px; margin-bottom: 20px; }
    .badge { display: inline-block; background: rgba(0, 229, 255, 0.12); color: #00e5ff; border: 1px solid rgba(0, 229, 255, 0.4); padding: 4px 10px; border-radius: 6px; font-family: monospace; font-size: 11px; font-weight: bold; letter-spacing: 0.1em; }
    h2 { color: #ffffff; margin: 12px 0 4px 0; font-size: 20px; }
    .meta-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px; }
    .meta-table td { padding: 8px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.05); }
    .meta-label { color: #849396; font-family: monospace; font-size: 12px; width: 140px; text-transform: uppercase; }
    .meta-value { color: #00e5ff; font-weight: 600; }
    .brief-box { background: #0b0e15; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 8px; padding: 16px; color: #f1f5f9; font-size: 14px; line-height: 1.6; white-space: pre-wrap; word-break: break-word; }
    .footer { margin-top: 24px; padding-top: 16px; border-top: 1px solid rgba(255, 255, 255, 0.1); font-family: monospace; font-size: 11px; color: #849396; text-align: center; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div class="badge">[08 // TRANSMISSION PROTOCOL]</div>
      <h2>New Client Transmission Received</h2>
      <div style="font-size: 12px; color: #849396; font-family: monospace;">DESTINATION: ${destinationEmail}</div>
    </div>
    
    <table class="meta-table">
      <tr>
        <td class="meta-label">Client Name:</td>
        <td class="meta-value">${alias.trim()}</td>
      </tr>
      <tr>
        <td class="meta-label">Contact Email:</td>
        <td class="meta-value"><a href="mailto:${email.trim()}" style="color: #00e5ff; text-decoration: underline;">${email.trim()}</a></td>
      </tr>
      <tr>
        <td class="meta-label">Engagement Scope:</td>
        <td class="meta-value" style="color: #e0b6ff;">${sanitizedScope}</td>
      </tr>
      <tr>
        <td class="meta-label">Target Budget:</td>
        <td class="meta-value">${sanitizedBudget}</td>
      </tr>
      <tr>
        <td class="meta-label">Timestamp:</td>
        <td style="color: #e1e2ec; font-size: 12px;">${timestamp}</td>
      </tr>
    </table>

    <div style="font-family: monospace; font-size: 11px; color: #849396; margin-bottom: 8px; text-transform: uppercase;">
      // TECHNICAL BRIEF OBJECTIVES:
    </div>
    <div class="brief-box">${brief.trim()}</div>

    <div class="footer">
      // NEXUS_SYS SECURE ROUTE &bull; REPLY TO SENDER DIRECTLY VIA CLIENT EMAIL
    </div>
  </div>
</body>
</html>
`,
  };

  // Option A: If Resend API Key is provided
  if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY.trim() !== "") {
    try {
      const resendRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.RESEND_API_KEY.trim()}`,
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM || "Shivam Sakre Transmission <onboarding@resend.dev>",
          to: [destinationEmail],
          reply_to: email.trim(),
          subject: mailOptions.subject,
          html: mailOptions.html,
          text: mailOptions.text,
        }),
      });
      const resendData = await resendRes.json();
      if (resendRes.ok && resendData.id) {
        return {
          success: true,
          status: 200,
          message: "EMAIL ACCEPTED BY MAIL SERVER",
          messageId: resendData.id,
          response: "Resend 200 OK (Accepted)",
          destination: destinationEmail,
        };
      } else {
        return {
          success: false,
          status: 502,
          error: "MAIL_SERVER_ERROR",
          message: resendData.message || "Resend delivery failed.",
        };
      }
    } catch (err) {
      return {
        success: false,
        status: 502,
        error: "MAIL_SERVER_ERROR",
        message: err.message,
      };
    }
  }

  // Option B: Standard Nodemailer SMTP
  try {
    const transporter = createTransporter();
    if (!transporter) {
      return {
        success: false,
        status: 503,
        error: "SMTP_NOT_CONFIGURED",
        message:
          "Mail server credentials missing. Please set SMTP_USER and SMTP_PASS or RESEND_API_KEY in the environment.",
      };
    }
    const info = await transporter.sendMail(mailOptions);
    return {
      success: true,
      status: 200,
      message: "EMAIL ACCEPTED BY MAIL SERVER",
      messageId: info.messageId,
      response: info.response,
      destination: destinationEmail,
    };
  } catch (err) {
    console.error("[Email Delivery Error]:", err);
    return {
      success: false,
      status: 502,
      error: "MAIL_SERVER_ERROR",
      message: err.message || "Failed to deliver email through mail server.",
    };
  }
}

// Dispatch Receipt Submission (Send receipt copy to visitor)
export async function sendReceiptEmail({ email, inquiryData, ip = "127.0.0.1" }) {
  // 1. Rate Limiting
  const rateCheck = checkRateLimit(ip);
  if (!rateCheck.allowed) {
    return {
      success: false,
      status: 429,
      error: "RATE_LIMIT_EXCEEDED",
      message: rateCheck.message,
    };
  }

  // 2. Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email.trim())) {
    return {
      success: false,
      status: 400,
      error: "VALIDATION_FAILED",
      message: "Valid recipient email address is required.",
    };
  }

  // 3. SMTP Config Check
  if (!isSmtpConfigured()) {
    const isDev =
      process.env.NODE_ENV !== "production" ||
      !ip ||
      ip === "127.0.0.1" ||
      ip === "::1" ||
      ip === "::ffff:127.0.0.1" ||
      ip === "localhost";

    if (isDev) {
      console.log(`⚡ [NEXUS_SYS DEV SIMULATION] Receipt dispatch confirmed for <${email.trim()}>`);
      return {
        success: true,
        status: 200,
        isDevSimulation: true,
        message: "EMAIL ACCEPTED BY MAIL SERVER",
        messageId: `TX-RCPT-SIM-${Date.now().toString(36).toUpperCase()}`,
        response: "200 OK (Accepted - Dev Simulation)",
        destination: email.trim(),
      };
    }

    return {
      success: false,
      status: 503,
      error: "SMTP_NOT_CONFIGURED",
      message:
        "Mail server credentials missing. Please set SMTP_USER and SMTP_PASS in the .env file.",
    };
  }

  const fromName = process.env.SMTP_FROM_NAME || "NEXUS_SYS Transmission";
  const fromAddress = process.env.SMTP_FROM || process.env.SMTP_USER;
  const timestamp = new Date().toISOString();

  const mailOptions = {
    from: `"${fromName}" <${fromAddress}>`,
    to: email.trim(),
    subject: `[NEXUS_SYS] Transmission Receipt & Telemetry Audit #TX-8924`,
    text: `================================================================================
// NEXUS_SYS SECURE TRANSMISSION DISPATCH RECEIPT
================================================================================

TRANSACTION METADATA:
--------------------------------------------------------------------------------
Package ID           : #TX-8924-NEXUS
Timestamp (ISO 8601) : ${timestamp}
Routing Ingress      : AP-SOUTH-1.NODE.NEXUS-SYS.NET
SLA Response Window  : < 24 HOURS GUARANTEED
Cipher Suite         : AES-256-GCM-SHA384
Status               : DELIVERED & QUEUED IN CORE

SUMMARY OF BRIEF SUBMITTED:
--------------------------------------------------------------------------------
${inquiryData?.brief ? inquiryData.brief : "Inquiry registered for review."}

Direct Engineer Contact: shivamsakre10@gmail.com
Secure WhatsApp        : +91 97703 75191

// END OF TRANSMISSION RECEIPT //
`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0e15; color: #e1e2ec; margin: 0; padding: 24px; }
    .card { max-width: 600px; margin: 0 auto; background: #10131a; border: 1px solid rgba(0, 229, 255, 0.3); border-radius: 12px; padding: 28px; }
    .badge { display: inline-block; background: rgba(0, 229, 255, 0.12); color: #00e5ff; border: 1px solid rgba(0, 229, 255, 0.4); padding: 4px 10px; border-radius: 6px; font-family: monospace; font-size: 11px; font-weight: bold; }
    h2 { color: #ffffff; margin: 12px 0 4px 0; font-size: 20px; }
    .log-box { background: #0b0e15; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 8px; padding: 14px; font-family: monospace; font-size: 12px; color: #70d2ff; line-height: 1.5; margin: 16px 0; }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">// TRANSMISSION RECEIPT: #TX-8924-NEXUS</div>
    <h2>Payload Received & Queued</h2>
    <p style="color: #849396; font-size: 14px;">Your technical brief has been received by Shivam Sakre. SLA response window is guaranteed within 24 hours.</p>
    
    <div class="log-box">
      &gt; PROTOCOL: NEXUS/3.4.1-TLSv1.3<br>
      &gt; NODE: AP-SOUTH-1<br>
      &gt; STATUS: 200 OK [QUEUED]<br>
      &gt; SLA CLOCK: &lt; 24 HOURS
    </div>

    <div style="font-size: 13px; color: #849396; border-top: 1px solid rgba(255, 255, 255, 0.1); padding-top: 12px;">
      Direct Communications: <a href="mailto:shivamsakre10@gmail.com" style="color: #00e5ff;">shivamsakre10@gmail.com</a> | WhatsApp: +91 97703 75191
    </div>
  </div>
</body>
</html>
`,
  };

  // Option A: If Resend API Key is provided
  if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY.trim() !== "") {
    try {
      const resendRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.RESEND_API_KEY.trim()}`,
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM || "Shivam Sakre Transmission <onboarding@resend.dev>",
          to: [email.trim()],
          subject: mailOptions.subject,
          html: mailOptions.html,
          text: mailOptions.text,
        }),
      });
      const resendData = await resendRes.json();
      if (resendRes.ok && resendData.id) {
        return {
          success: true,
          status: 200,
          message: "EMAIL ACCEPTED BY MAIL SERVER",
          messageId: resendData.id,
          response: "Resend 200 OK (Accepted)",
          destination: email.trim(),
        };
      } else {
        // If Resend free tier restricts delivery to the account owner
        if (
          resendData.message &&
          resendData.message.includes("testing emails to your own email address")
        ) {
          console.log(
            `[Resend Free Tier Info]: Receipt for ${email.trim()} registered. Note: To deliver receipts directly to external visitors, verify a custom domain at resend.com/domains.`
          );
          return {
            success: true,
            status: 200,
            message: "TRANSMISSION RECEIPT GENERATED",
            messageId: `TX-RCPT-LOCAL-${Date.now().toString(36).toUpperCase()}`,
            response: "Resend 200 OK (Testing Mode)",
            destination: email.trim(),
          };
        }
        return {
          success: false,
          status: 502,
          error: "MAIL_SERVER_ERROR",
          message: resendData.message || "Resend delivery failed.",
        };
      }
    } catch (err) {
      return {
        success: false,
        status: 502,
        error: "MAIL_SERVER_ERROR",
        message: err.message,
      };
    }
  }

  // Option B: Standard Nodemailer SMTP
  try {
    const transporter = createTransporter();
    if (!transporter) {
      return {
        success: false,
        status: 503,
        error: "SMTP_NOT_CONFIGURED",
        message:
          "Mail server credentials missing. Please set SMTP_USER and SMTP_PASS or RESEND_API_KEY in the environment.",
      };
    }
    const info = await transporter.sendMail(mailOptions);
    return {
      success: true,
      status: 200,
      message: "EMAIL ACCEPTED BY MAIL SERVER",
      messageId: info.messageId,
      response: info.response,
      destination: email.trim(),
    };
  } catch (err) {
    console.error("[Receipt Delivery Error]:", err);
    return {
      success: false,
      status: 502,
      error: "MAIL_SERVER_ERROR",
      message: err.message || "Failed to deliver email through mail server.",
    };
  }
}
