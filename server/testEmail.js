import dotenv from "dotenv";
import nodemailer from "nodemailer";
import { isSmtpConfigured, createTransporter } from "./emailService.js";

dotenv.config();

async function runTest() {
  console.log("================================================================================");
  console.log("// NEXUS_SYS TRANSMISSION — REAL EMAIL DELIVERY VERIFICATION TOOL");
  console.log("================================================================================\n");

  const destEmail = process.env.CONTACT_DESTINATION_EMAIL || "shivamsakre10@gmail.com";
  const user = process.env.SMTP_USER || "(not set)";
  const pass = process.env.SMTP_PASS || "";
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = process.env.SMTP_PORT || "465";
  const resendKey = process.env.RESEND_API_KEY || "";

  console.log("CONFIGURATION STATUS:");
  console.log(`- Target Destination : ${destEmail}`);
  if (resendKey) {
    console.log(`- Provider           : Resend API [CONFIGURED: ${resendKey.slice(0, 6)}...]`);
  } else {
    console.log(`- Provider           : SMTP (${host}:${port})`);
    console.log(`- SMTP User          : ${user}`);
    console.log(`- SMTP Password      : ${pass ? `[CONFIGURED: ${pass.length} chars]` : "[MISSING / EMPTY]"}`);
  }
  console.log("--------------------------------------------------------------------------------\n");

  if (!isSmtpConfigured()) {
    console.error("❌ ERROR: Neither SMTP credentials nor Resend API key are configured in .env.\n");
    console.log("CHOOSE ONE OF THE FOLLOWING TWO OPTIONS TO ENABLE REAL DELIVERY:\n");
    console.log("👉 OPTION 1: GMAIL APP PASSWORD (Recommended & Free)");
    console.log("   1. Open: https://myaccount.google.com/security (Enable 2-Step Verification)");
    console.log("   2. Open: https://myaccount.google.com/apppasswords");
    console.log("   3. Generate an App Password named 'Portfolio Contact'");
    console.log("   4. Paste into .env:");
    console.log("      SMTP_PASS=your16characterapppassword\n");
    console.log("👉 OPTION 2: RESEND API KEY (Instant Free API)");
    console.log("   1. Sign up free at: https://resend.com");
    console.log("   2. Generate an API Key (re_...)");
    console.log("   3. Paste into .env:");
    console.log("      RESEND_API_KEY=re_your_api_key_here\n");
    console.log("After saving .env, run this test again:");
    console.log("   npm run test-email\n");
    console.log("================================================================================");
    process.exit(1);
  }

  // If using Resend
  if (resendKey) {
    console.log(`1. Dispatching real test email to ${destEmail} via Resend API...`);
    try {
      const timestamp = new Date().toISOString();
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendKey.trim()}`,
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM || "Shivam Sakre Transmission <onboarding@resend.dev>",
          to: [destEmail],
          subject: `[NEXUS_SYS Test] Real Email Delivery Verified ✓`,
          text: `Hello Shivam,\n\nThis is a real test transmission confirming that your contact form mail service is operational.\n\nTimestamp: ${timestamp}\nTarget: ${destEmail}\nProvider: Resend API`,
          html: `<div style="font-family: monospace; background: #0b0e15; color: #00e5ff; padding: 24px; border: 1px solid #00e5ff; border-radius: 8px;"><h2>// REAL EMAIL DELIVERY VERIFIED (RESEND API)</h2><p>Destination: ${destEmail}</p><p>Timestamp: ${timestamp}</p></div>`,
        }),
      });

      const data = await res.json();
      if (res.ok && data.id) {
        console.log("\n================================================================================");
        console.log("🎉 SUCCESS: Real email delivered to your inbox via Resend!");
        console.log(`- Message ID : ${data.id}`);
        console.log(`- Recipient  : ${destEmail}`);
        console.log("\nCheck your inbox at " + destEmail + " right now!");
        console.log("================================================================================\n");
        process.exit(0);
      } else {
        console.error("❌ Resend API Error:", data.message || data);
        process.exit(1);
      }
    } catch (err) {
      console.error("❌ Failed to reach Resend API:", err.message);
      process.exit(1);
    }
  }

  // If using SMTP
  console.log("1. Testing connection to mail server...");
  const transporter = createTransporter();

  try {
    await transporter.verify();
    console.log("✓ Connection to " + host + ":" + port + " verified successfully!\n");
  } catch (err) {
    console.error("❌ Mail server connection failed:", err.message);
    if (err.code === "EAUTH") {
      console.error("\nAuthentication Error (EAUTH):");
      console.error("- If using Gmail, make sure you are using an APP PASSWORD, not your personal Gmail password.");
      console.error("- Generate an App Password at: https://myaccount.google.com/apppasswords");
    }
    process.exit(1);
  }

  console.log(`2. Dispatching real test email to ${destEmail}...`);
  try {
    const timestamp = new Date().toISOString();
    const info = await transporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME || "NEXUS_SYS Transmission"}" <${process.env.SMTP_FROM || user}>`,
      to: destEmail,
      subject: `[NEXUS_SYS Test] Real Email Delivery Verified ✓`,
      text: `Hello Shivam,\n\nThis is a real test transmission confirming that your contact form mail server is operational.\n\nTimestamp: ${timestamp}\nTarget: ${destEmail}\nServer Node: AP-SOUTH-1\n\nAll client inquiries submitted through your website will now arrive directly in your inbox.`,
      html: `
        <div style="font-family: monospace; background: #0b0e15; color: #e1e2ec; padding: 24px; border-radius: 10px; border: 1px solid #00e5ff;">
          <h2 style="color: #00e5ff; margin-top: 0;">// NEXUS_SYS: REAL EMAIL DELIVERY VERIFIED</h2>
          <p>This confirms that your mail delivery pipeline is working.</p>
          <div style="background: #10131a; padding: 12px; border-radius: 6px; margin: 16px 0;">
            <strong>DESTINATION:</strong> ${destEmail}<br>
            <strong>TIMESTAMP:</strong> ${timestamp}<br>
            <strong>STATUS:</strong> 250 OK [ACCEPTED]
          </div>
          <p style="color: #849396; font-size: 12px;">Client inquiries submitted through your portfolio contact form will now be received here.</p>
        </div>
      `,
    });

    console.log("\n================================================================================");
    console.log("🎉 SUCCESS: Real email delivered to your mail server!");
    console.log(`- Message ID : ${info.messageId}`);
    console.log(`- Response   : ${info.response}`);
    console.log(`- Recipient  : ${destEmail}`);
    console.log("\nCheck your inbox (and spam folder) at " + destEmail + " right now!");
    console.log("================================================================================\n");
  } catch (err) {
    console.error("❌ Failed to deliver test message:", err.message);
    process.exit(1);
  }
}

runTest();
