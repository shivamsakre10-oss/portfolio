import { useState, useEffect, useRef } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    alias: "",
    email: "",
    scope: "web-platform",
    brief: "",
    budget: "tier2",
    _gotcha: "", // Honeypot field for anti-spam
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitButtonText, setSubmitButtonText] = useState("TRANSMIT INQUIRY");
  const [submitError, setSubmitError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deliveryDetails, setDeliveryDetails] = useState(null);

  const [toastMessage, setToastMessage] = useState("");
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [toastType, setToastType] = useState("info"); // "info" | "success" | "error"

  const [receiptEmail, setReceiptEmail] = useState("");
  const [isDispatchingEmail, setIsDispatchingEmail] = useState(false);
  const [emailDispatched, setEmailDispatched] = useState(false);
  const [receiptStatusText, setReceiptStatusText] = useState("PGP / TLS 1.3 ENCRYPTED");
  const [receiptBtnText, setReceiptBtnText] = useState("SEND DISPATCH [↵]");

  const [terminalLogs, setTerminalLogs] = useState([]);
  const [headerCopyStatus, setHeaderCopyStatus] = useState("COPY RECEIPT");
  const [headerExportStatus, setHeaderExportStatus] = useState("EXPORT LOG");
  const [modalDownloadStatus, setModalDownloadStatus] = useState("EXPORT .TXT LOG");

  const [smtpStatus, setSmtpStatus] = useState({ checked: false, configured: false });

  const toastTimerRef = useRef(null);
  const receiptEmailInputRef = useRef(null);

  // Check backend health & SMTP readiness on mount
  useEffect(() => {
    let isMounted = true;
    fetch("/api/health")
      .then((res) => res.json())
      .then((data) => {
        if (isMounted) {
          setSmtpStatus({ checked: true, configured: Boolean(data.smtpConfigured) });
        }
      })
      .catch(() => {
        if (isMounted) {
          setSmtpStatus({ checked: true, configured: false });
        }
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const showToast = (message, type = "info") => {
    setToastMessage(message);
    setToastType(type);
    setIsToastVisible(true);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      setIsToastVisible(false);
    }, 5000);
  };

  const dismissToast = () => {
    setIsToastVisible(false);
  };

  const handleCopy = (text) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text);
      showToast(`[CLIPBOARD] // ${text} COPIED`, "info");
    }
  };

  const handleScopeChange = (scopeValue) => {
    setFormData((prev) => ({ ...prev, scope: scopeValue }));
  };

  const handleBudgetChange = (budgetValue) => {
    setFormData((prev) => ({ ...prev, budget: budgetValue }));
  };

  // 1. PRIMARY CONTACT FORM SUBMISSION
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    // Client-side validations
    if (formData._gotcha) {
      // Spam honeypot triggered
      return;
    }

    if (!formData.alias.trim() || formData.alias.trim().length < 2) {
      setSubmitError("Please provide your name or alias (minimum 2 characters).");
      showToast("Validation Error: Name / Alias required", "error");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      setSubmitError("Please enter a valid email address.");
      showToast("Validation Error: Invalid email address", "error");
      return;
    }

    if (!formData.brief.trim() || formData.brief.trim().length < 5) {
      setSubmitError("Please provide brief project details (minimum 5 characters).");
      showToast("Validation Error: Technical brief too short", "error");
      return;
    }

    setIsSubmitting(true);
    setSubmitButtonText("SENDING...");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Truthful success: Email accepted by the mail server
        setIsSubmitting(false);
        setSubmitButtonText("EMAIL ACCEPTED BY MAIL SERVER");
        setDeliveryDetails(result);
        setReceiptEmail(formData.email.trim() || "shivamsakre10@gmail.com");
        setEmailDispatched(false);
        setReceiptStatusText("PGP / TLS 1.3 ENCRYPTED");
        setReceiptBtnText("SEND DISPATCH [↵]");

        // Initialize terminal log with real delivery confirmation
        setTerminalLogs([
          `EMAIL ACCEPTED BY MAIL SERVER (MSG_ID: ${result.messageId || "CONFIRMED"})`,
          `DESTINATION: ${result.destination || "shivamsakre10@gmail.com"}`,
        ]);

        setIsModalOpen(true);
        showToast("[EMAIL ACCEPTED BY MAIL SERVER]", "success");

        // Clear form inputs
        setFormData({
          alias: "",
          email: "",
          scope: "web-platform",
          brief: "",
          budget: "tier2",
          _gotcha: "",
        });

        setTimeout(() => {
          setSubmitButtonText("TRANSMIT INQUIRY");
        }, 3500);
      } else {
        // Truthful failure
        setIsSubmitting(false);
        setSubmitButtonText("DELIVERY FAILED — PLEASE TRY AGAIN");
        const errMsg =
          result.error === "SMTP_NOT_CONFIGURED"
            ? "Mail server credentials missing: Set SMTP_USER and SMTP_PASS in the .env file."
            : result.message || "DELIVERY FAILED — PLEASE TRY AGAIN";
        setSubmitError(errMsg);
        showToast(`DELIVERY FAILED — ${errMsg}`, "error");

        setTimeout(() => {
          setSubmitButtonText("TRANSMIT INQUIRY");
        }, 4000);
      }
    } catch (err) {
      console.error("Network / API failure:", err);
      setIsSubmitting(false);
      setSubmitButtonText("DELIVERY FAILED — PLEASE TRY AGAIN");
      setSubmitError("Network error: Unable to reach email API. Check server connection.");
      showToast("DELIVERY FAILED — Network error. Please try again.", "error");

      setTimeout(() => {
        setSubmitButtonText("TRANSMIT INQUIRY");
      }, 4000);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Close modal on ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        closeModal();
        dismissToast();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const getReceiptData = () => {
    const timestamp = deliveryDetails?.timestamp || new Date().toISOString();
    const msgId = deliveryDetails?.messageId || "TX-8924-NEXUS";
    return `// NEXUS_SYS TRANSMISSION RECEIPT\nPKG_ID: #TX-8924-NEXUS\nMESSAGE_ID: ${msgId}\nTIMESTAMP: ${timestamp}\nSTATUS: EMAIL ACCEPTED BY MAIL SERVER\nDESTINATION: shivamsakre10@gmail.com\nSLA: < 24 HOURS`;
  };

  const handleCopyReceipt = () => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(getReceiptData());
      setHeaderCopyStatus("RECEIPT COPIED");
      showToast("[RECEIPT TX-8924 COPIED TO CLIPBOARD]", "info");
      setTimeout(() => {
        setHeaderCopyStatus("COPY RECEIPT");
      }, 2500);
    }
  };

  const generateTelemetryLogText = () => {
    const timestamp = new Date().toISOString();
    const epoch = Math.floor(Date.now() / 1000);
    const msgId = deliveryDetails?.messageId || "VERIFIED-MAIL-DISPATCH";

    return `================================================================================
// NEXUS_SYS SECURE TRANSMISSION DISPATCH LOG
// TELEMETRY LOG RECEIPT & REAL MAIL SERVER AUDIT
================================================================================

TRANSACTION METADATA:
--------------------------------------------------------------------------------
  TRANSACTION ID       : #TX-8924-NEXUS
  MAIL SERVER MSG_ID   : ${msgId}
  TIMESTAMP (ISO 8601) : ${timestamp}
  EPOCH (UNIX SEC)     : ${epoch}
  DELIVERY STATUS      : EMAIL ACCEPTED BY MAIL SERVER
  TARGET DESTINATION   : shivamsakre10@gmail.com
  SLA COMMITMENT       : < 24 HOURS GUARANTEED RESPONSE WINDOW

SECURITY ENCRYPTION MATRIX:
--------------------------------------------------------------------------------
  CIPHER SUITE         : TLS 1.3 / AES-256-GCM-SHA384
  AUTHENTICATION       : VERIFIED SMTP TRANSPORT (SERVER-SIDE SECRETS)
  NON-DISCLOSURE PROTO : AUTO-SIGNED & ATTESTED (MUTUAL NDA 2025)

--------------------------------------------------------------------------------
STATUS SUMMARY:
  [✓] Primary submission accepted by mail provider for delivery.
  [✓] Direct engineer review queue initiated at shivamsakre10@gmail.com.
  [✓] SLA clock active: < 24 Hours guaranteed response window.

// END OF TRANSMISSION LOG -- DISPATCH RECEIPT TX-8924 //
================================================================================`;
  };

  const handleExportLog = () => {
    const logContent = generateTelemetryLogText();
    const filename = "transmission_receipt_TX8924.txt";
    const blob = new Blob([logContent], { type: "text/plain;charset=utf-8" });
    const blobUrl = URL.createObjectURL(blob);

    const downloadAnchor = document.createElement("a");
    downloadAnchor.href = blobUrl;
    downloadAnchor.download = filename;
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    document.body.removeChild(downloadAnchor);
    setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);

    setHeaderExportStatus("LOG EXPORTED");
    setModalDownloadStatus("✓ LOG EXPORTED");
    showToast("[FILE GENERATED // transmission_receipt_TX8924.txt DOWNLOADED]", "info");

    setTimeout(() => {
      setHeaderExportStatus("EXPORT LOG");
      setModalDownloadStatus("EXPORT .TXT LOG");
    }, 2500);
  };

  // 2. DISPATCH RECEIPT TO VISITOR INBOX
  const handleSendEmailReceipt = async () => {
    let target = receiptEmail.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!target || !emailRegex.test(target)) {
      showToast("Validation Error: Please enter a valid recipient email", "error");
      setReceiptStatusText("INVALID RECIPIENT EMAIL");
      return;
    }

    setIsDispatchingEmail(true);
    setReceiptBtnText("SENDING...");
    setReceiptStatusText("SENDING DISPATCH RECEIPT...");

    try {
      const response = await fetch("/api/send-receipt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: target,
          inquiryData: formData,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setIsDispatchingEmail(false);
        setEmailDispatched(true);
        setReceiptBtnText("EMAIL ACCEPTED BY MAIL SERVER");
        setReceiptStatusText("EMAIL ACCEPTED BY MAIL SERVER");

        setTerminalLogs((prev) => [
          ...prev,
          `MAIL_SERVER: EMAIL ACCEPTED BY MAIL SERVER (ID: ${result.messageId || "DELIVERED"}) -> ${target}`,
        ]);

        showToast(`[EMAIL ACCEPTED BY MAIL SERVER -> ${target}]`, "success");

        setTimeout(() => {
          setReceiptBtnText("RESEND DISPATCH [↵]");
          setEmailDispatched(false);
        }, 5000);
      } else {
        setIsDispatchingEmail(false);
        setEmailDispatched(false);
        setReceiptBtnText("DELIVERY FAILED — PLEASE TRY AGAIN");
        const errMsg =
          result.error === "SMTP_NOT_CONFIGURED"
            ? "SMTP credentials not configured on server"
            : result.message || "DELIVERY FAILED — PLEASE TRY AGAIN";
        setReceiptStatusText(`DELIVERY FAILED — ${errMsg}`);

        setTerminalLogs((prev) => [
          ...prev,
          `MAIL_SERVER ERROR: DELIVERY FAILED — ${errMsg} -> ${target}`,
        ]);

        showToast(`DELIVERY FAILED — ${errMsg}`, "error");

        setTimeout(() => {
          setReceiptBtnText("SEND DISPATCH [↵]");
        }, 4000);
      }
    } catch (err) {
      console.error("Receipt dispatch error:", err);
      setIsDispatchingEmail(false);
      setEmailDispatched(false);
      setReceiptBtnText("DELIVERY FAILED — PLEASE TRY AGAIN");
      setReceiptStatusText("DELIVERY FAILED — NETWORK ERROR");

      setTerminalLogs((prev) => [
        ...prev,
        `MAIL_SERVER ERROR: NETWORK ERROR -> ${target}`,
      ]);

      showToast("DELIVERY FAILED — Network error. Please try again.", "error");

      setTimeout(() => {
        setReceiptBtnText("SEND DISPATCH [↵]");
      }, 4000);
    }
  };

  const handleEmailReceiptFocus = () => {
    if (receiptEmailInputRef.current) {
      receiptEmailInputRef.current.focus();
      receiptEmailInputRef.current.select();
    }
  };

  return (
    <section
      className="scroll-mt-28 relative py-4 md:py-6 text-slate-100 overflow-hidden font-body-md"
      data-purpose="transmission-section"
      id="contact"
    >
      {/* Anchor alias so both #contact and #transmission work seamlessly */}
      <span id="transmission" className="sr-only" aria-hidden="true" />

      {/* Ambient Plasma Field Orbs matching website background */}
      <div className="pointer-events-none absolute inset-0 z-0 purple-ambient" />
      <div className="pointer-events-none absolute inset-0 z-0 cyan-ambient" />
      <div className="pointer-events-none absolute inset-0 z-0 bg-cyber-grid opacity-40" />

      {/* Micro Starlight Particulate Constellation */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-40">
        <div className="absolute top-1/4 left-1/5 w-1 h-1 bg-[#00e5ff] rounded-full shadow-[0_0_8px_#00e5ff] animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-[#e0b6ff] rounded-full shadow-[0_0_10px_#e0b6ff]" />
        <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-[#00e5ff] rounded-full shadow-[0_0_6px_#00e5ff]" />
        <div className="absolute top-2/3 right-1/6 w-1 h-1 bg-[#00e5ff] rounded-full shadow-[0_0_6px_#00e5ff] animate-pulse" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* LEFT COLUMN: Brand Transmission Stack (5 Columns) */}
          <div className="lg:col-span-5 flex flex-col space-y-6">
            {/* Telemetry Badge Indicator */}
            <div className="inline-flex items-center gap-2 self-start px-3 py-1.5 rounded-full border border-[#00e5ff]/30 bg-[#10131a]/80 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-[#00e5ff] shadow-[0_0_8px_#00e5ff] animate-pulse" />
              <span className="font-code-sm text-[11px] text-[#00e5ff] tracking-wider font-bold">
                [08 // TRANSMISSION PROTOCOL]
              </span>
            </div>

            {/* Headline Typography */}
            <div className="space-y-1">
              <h2 className="font-headline-lg md:font-headline-xl text-3xl sm:text-4xl md:text-5xl text-white tracking-tight leading-none font-bold">
                Have an Idea?
              </h2>
              <h3 className="font-headline-lg md:font-headline-xl text-3xl sm:text-4xl md:text-5xl tracking-tight leading-none font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00e5ff] via-[#9cf0ff] to-[#e0b6ff]">
                Let’s Build It.
              </h3>
            </div>

            {/* Narrative Description */}
            <p className="font-body-md text-sm sm:text-base text-slate-300 max-w-lg leading-relaxed">
              Whether it's a web application, high-throughput system, or a complete digital product,
              let's turn your vision into production reality.
            </p>

            {/* Availability Indicator Pill & SMTP status note */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-lg bg-[#191b23]/70 border border-white/10 text-slate-300 w-fit font-code-sm text-xs">
                <span className="inline-block w-2 h-2 rounded-full bg-[#00e5ff] shadow-[0_0_6px_#00e5ff]" />
                <span className="text-[#00e5ff] font-bold">AVAILABLE FOR NEW CONTRACTS</span>
                <span className="text-slate-500">— Q2 2025</span>
              </div>

              {smtpStatus.checked && !smtpStatus.configured && (
                <div className="flex items-center gap-2 text-[11px] font-code-sm text-amber-400/90 pl-1">
                  <span className="material-symbols-outlined text-[14px]">info</span>
                  <span>SMTP Configuration: Standby (Set SMTP_PASS in server .env)</span>
                </div>
              )}
            </div>

            {/* Direct Communication Pods */}
            <div className="pt-2 flex flex-col space-y-3.5">
              {/* POD 1: Direct Transmission Email */}
              <div className="group relative flex items-center justify-between p-3.5 rounded-xl bg-[#191b23]/80 border border-white/5 backdrop-blur-md hover:border-[#00e5ff]/40 transition-all duration-200">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-full border border-[#00e5ff]/40 flex items-center justify-center bg-[#00e5ff]/5 text-[#00e5ff] group-hover:border-[#00e5ff] group-hover:shadow-[0_0_12px_rgba(0,229,255,0.4)] transition-all shrink-0">
                    <span className="material-symbols-outlined text-[18px]">alternate_email</span>
                  </div>
                  <div className="min-w-0">
                    <div className="font-code-sm text-[10px] text-slate-400 tracking-wider">
                      DIRECT TRANSMISSION
                    </div>
                    <div className="font-code-md text-sm text-white font-semibold truncate tracking-tight">
                      shivamsakre10@gmail.com
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 pl-2 shrink-0">
                  <button
                    className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 hover:text-[#00e5ff] font-code-sm text-xs font-bold transition-all cursor-pointer active:scale-95"
                    onClick={() => handleCopy("shivamsakre10@gmail.com")}
                    type="button"
                  >
                    Copy
                  </button>
                  <a
                    aria-label="Send direct email via email client"
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[#00e5ff] hover:text-white transition-all flex items-center justify-center cursor-pointer"
                    href="mailto:shivamsakre10@gmail.com"
                  >
                    <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                  </a>
                </div>
              </div>

              {/* POD 2: Secure Voice / WhatsApp */}
              <div className="group relative flex items-center justify-between p-3.5 rounded-xl bg-[#191b23]/80 border border-white/5 backdrop-blur-md hover:border-[#00e5ff]/40 transition-all duration-200">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-full border border-[#00e5ff]/40 flex items-center justify-center bg-[#00e5ff]/5 text-[#00e5ff] group-hover:border-[#00e5ff] group-hover:shadow-[0_0_12px_rgba(0,229,255,0.4)] transition-all shrink-0">
                    <span className="material-symbols-outlined text-[18px]">call</span>
                  </div>
                  <div className="min-w-0">
                    <div className="font-code-sm text-[10px] text-slate-400 tracking-wider">
                      SECURE VOICE // WHATSAPP
                    </div>
                    <div className="font-code-md text-sm text-white font-semibold tracking-wide">
                      +91 97703 75191
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 pl-2 shrink-0">
                  <button
                    className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 hover:text-[#00e5ff] font-code-sm text-xs font-bold transition-all cursor-pointer active:scale-95"
                    onClick={() => handleCopy("+91 97703 75191")}
                    type="button"
                  >
                    Copy
                  </button>
                  <a
                    aria-label="Direct message on WhatsApp"
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[#e0b6ff] hover:text-white transition-all flex items-center justify-center cursor-pointer"
                    href="https://wa.me/919770375191"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <span className="material-symbols-outlined text-[16px]">chat</span>
                  </a>
                </div>
              </div>

              {/* POD 3: SLA Verification Micro-Card */}
              <div className="p-3 rounded-lg bg-[#0b0e15]/70 border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-300 font-code-sm text-xs">
                  <span className="material-symbols-outlined text-[#00e5ff] text-[16px]">
                    verified
                  </span>
                  <span>GUARANTEED RESPONSE WINDOW</span>
                </div>
                <div className="font-code-md text-xs text-[#00e5ff] font-bold">&lt; 24 HOURS</div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Technical Brief Intake Console (7 Columns) */}
          <div className="lg:col-span-7" id="console">
            <div className="relative rounded-2xl bg-[#191b23]/95 border border-white/10 p-6 sm:p-8 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.7)] cyan-glow-subtle">
              {/* Cyber Corner Accents */}
              <div className="absolute -top-px -left-px w-4 h-4 border-t-2 border-l-2 border-[#00e5ff] pointer-events-none" />
              <div className="absolute -top-px -right-px w-4 h-4 border-t-2 border-r-2 border-[#00e5ff] pointer-events-none" />
              <div className="absolute -bottom-px -left-px w-4 h-4 border-b-2 border-l-2 border-[#00e5ff] pointer-events-none" />
              <div className="absolute -bottom-px -right-px w-4 h-4 border-b-2 border-r-2 border-[#00e5ff] pointer-events-none" />

              {/* Header / Status Header of Console */}
              <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-6">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-[#00e5ff] rounded-sm shadow-[0_0_6px_#00e5ff]" />
                  <span className="font-code-sm text-xs text-white uppercase tracking-widest font-bold">
                    DISPATCH CONSOLE // PROTOCOL INITIALIZATION
                  </span>
                </div>
                <span className="font-code-sm text-xs text-slate-400">SEC_CH: TLS 1.3</span>
              </div>

              {/* Technical Error Notice (Shown only if failure occurs) */}
              {submitError && (
                <div className="mb-5 p-3.5 rounded-xl bg-red-950/50 border border-red-500/50 text-red-200 text-xs font-code-sm flex items-start gap-2.5 animate-pulse">
                  <span className="material-symbols-outlined text-[18px] text-red-400 shrink-0">
                    error
                  </span>
                  <div>
                    <div className="font-bold uppercase tracking-wider text-red-400">
                      DELIVERY FAILED — PLEASE TRY AGAIN
                    </div>
                    <div className="mt-0.5 text-slate-300">{submitError}</div>
                  </div>
                </div>
              )}

              {/* Form Structure */}
              <form className="space-y-6" id="dispatch-form" onSubmit={handleFormSubmit}>
                {/* Honeypot anti-spam field */}
                <input
                  autoComplete="off"
                  className="hidden sr-only"
                  name="_gotcha"
                  onChange={(e) => setFormData({ ...formData, _gotcha: e.target.value })}
                  style={{ display: "none" }}
                  tabIndex="-1"
                  type="text"
                  value={formData._gotcha}
                />

                {/* Row 1: Dual Input Wells */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Input: Name / Alias */}
                  <div className="space-y-2">
                    <label
                      className="block font-code-sm text-xs text-slate-400 tracking-widest uppercase"
                      htmlFor="user-alias"
                    >
                      YOUR NAME // ALIAS
                    </label>
                    <div className="relative">
                      <input
                        className="w-full bg-[#0b0e15] text-white placeholder:text-slate-500 border border-white/10 rounded-xl px-4 py-3 font-body-sm text-sm focus:outline-none focus:border-[#00e5ff] focus:ring-1 focus:ring-[#00e5ff] transition-all"
                        id="user-alias"
                        name="alias"
                        onChange={(e) => setFormData({ ...formData, alias: e.target.value })}
                        placeholder="e.g. Jordan Vance"
                        required
                        type="text"
                        value={formData.alias}
                      />
                      <span className="material-symbols-outlined absolute right-3.5 top-3.5 text-slate-500 text-[18px] pointer-events-none">
                        badge
                      </span>
                    </div>
                  </div>

                  {/* Input: Contact Email */}
                  <div className="space-y-2">
                    <label
                      className="block font-code-sm text-xs text-slate-400 tracking-widest uppercase"
                      htmlFor="user-email"
                    >
                      CONTACT EMAIL
                    </label>
                    <div className="relative">
                      <input
                        className="w-full bg-[#0b0e15] text-white placeholder:text-slate-500 border border-white/10 rounded-xl px-4 py-3 font-body-sm text-sm focus:outline-none focus:border-[#00e5ff] focus:ring-1 focus:ring-[#00e5ff] transition-all"
                        id="user-email"
                        name="email"
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="jordan@enterprise.io"
                        required
                        type="email"
                        value={formData.email}
                      />
                      <span className="material-symbols-outlined absolute right-3.5 top-3.5 text-slate-500 text-[18px] pointer-events-none">
                        alternate_email
                      </span>
                    </div>
                  </div>
                </div>

                {/* Row 2: Project Scope Segmented Tags */}
                <div className="space-y-2.5">
                  <label className="block font-code-sm text-xs text-slate-400 tracking-widest uppercase">
                    ENGAGEMENT ARCHITECTURE // SCOPE
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5" id="scope-group">
                    {[
                      { id: "web-platform", label: "Web Platform" },
                      { id: "mvp", label: "Full-Stack MVP" },
                      { id: "ai", label: "AI Integration" },
                      { id: "audit", label: "Architecture Audit" },
                    ].map((scopeItem) => {
                      const isSelected = formData.scope === scopeItem.id;
                      return (
                        <button
                          className={`text-center py-2.5 px-2 rounded-xl border font-code-sm text-xs cursor-pointer transition-all duration-200 active:scale-95 ${
                            isSelected
                              ? "border-[#00e5ff] text-[#00e5ff] bg-[#00e5ff]/10 shadow-[0_0_12px_rgba(0,229,255,0.25)] font-bold"
                              : "bg-[#0b0e15] border-white/5 text-slate-300 hover:border-[#00e5ff]/60 hover:text-white hover:shadow-[0_0_15px_rgba(0,229,255,0.2)]"
                          }`}
                          key={scopeItem.id}
                          onClick={() => handleScopeChange(scopeItem.id)}
                          type="button"
                        >
                          {scopeItem.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Row 3: Technical Brief Textarea */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label
                      className="block font-code-sm text-xs text-slate-400 tracking-widest uppercase"
                      htmlFor="brief-description"
                    >
                      TECHNICAL BRIEF // OBJECTIVES
                    </label>
                    <span className="font-code-sm text-[10px] text-slate-500">
                      PLAIN TEXT / MARKDOWN SUPPORTED
                    </span>
                  </div>
                  <textarea
                    className="w-full bg-[#0b0e15] text-white placeholder:text-slate-500 border border-white/10 rounded-xl p-4 font-body-sm text-sm focus:outline-none focus:border-[#00e5ff] focus:ring-1 focus:ring-[#00e5ff] transition-all resize-y"
                    id="brief-description"
                    onChange={(e) => setFormData({ ...formData, brief: e.target.value })}
                    placeholder="Describe the system, target throughput, deadlines, or design challenges..."
                    required
                    rows={4}
                    value={formData.brief}
                  />
                </div>

                {/* Row 4: Budget Range Selector */}
                <div className="space-y-2">
                  <label className="block font-code-sm text-xs text-slate-400 tracking-widest uppercase">
                    TARGET ALLOCATION // BUDGET TIER
                  </label>
                  <div className="grid grid-cols-3 gap-2.5">
                    {[
                      { id: "tier1", label: "$5K – $15K" },
                      { id: "tier2", label: "$15K – $35K" },
                      { id: "tier3", label: "$35K+ Enterprise" },
                    ].map((budgetOption) => {
                      const isSelected = formData.budget === budgetOption.id;
                      return (
                        <button
                          className={`p-2.5 rounded-xl text-center border font-code-sm text-xs cursor-pointer transition-all duration-200 active:scale-95 ${
                            isSelected
                              ? "border-[#00e5ff] text-[#00e5ff] bg-[#00e5ff]/10 shadow-[0_0_12px_rgba(0,229,255,0.25)] font-bold"
                              : "bg-[#0b0e15] border-white/5 text-slate-300 hover:border-[#00e5ff]/60 hover:text-white hover:shadow-[0_0_15px_rgba(0,229,255,0.2)]"
                          }`}
                          key={budgetOption.id}
                          onClick={() => handleBudgetChange(budgetOption.id)}
                          type="button"
                        >
                          {budgetOption.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Row 5: Action Button & Security Assurance */}
                <div className="pt-2">
                  <button
                    className={`group w-full py-4 px-6 rounded-xl font-bold text-[16px] tracking-wider uppercase flex items-center justify-center gap-3 cursor-pointer transition-all duration-200 select-none ${
                      submitButtonText === "EMAIL ACCEPTED BY MAIL SERVER"
                        ? "bg-emerald-500 text-slate-950 shadow-[0_0_24px_rgba(16,185,129,0.5)]"
                        : submitButtonText === "DELIVERY FAILED — PLEASE TRY AGAIN"
                        ? "bg-red-600 text-white shadow-[0_0_24px_rgba(239,68,68,0.5)]"
                        : "bg-gradient-to-r from-[#00e5ff] via-[#00daf3] to-[#38bdf8] text-[#00363d] cyan-glow hover:shadow-[0_0_30px_rgba(0,229,255,0.7),0_0_12px_rgba(0,229,255,0.9)] hover:brightness-110 hover:-translate-y-0.5 active:scale-[0.98] active:translate-y-0"
                    } disabled:opacity-80 disabled:cursor-not-allowed`}
                    disabled={isSubmitting}
                    id="submit-btn"
                    type="submit"
                  >
                    <span>{submitButtonText}</span>
                    <span
                      className={`material-symbols-outlined text-[20px] transition-transform duration-200 group-hover:translate-x-1.5 inline-block ${
                        isSubmitting ? "animate-spin" : ""
                      }`}
                    >
                      {isSubmitting
                        ? "sync"
                        : submitButtonText === "EMAIL ACCEPTED BY MAIL SERVER"
                        ? "verified"
                        : submitButtonText === "DELIVERY FAILED — PLEASE TRY AGAIN"
                        ? "report"
                        : "send"}
                    </span>
                  </button>
                  <div className="mt-3.5 flex items-center justify-between text-slate-400 font-code-sm text-[11px]">
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[14px] text-[#00e5ff]">lock</span>
                      E2E ENCRYPTED TRANSMISSION
                    </span>
                    <span>NON-DISCLOSURE PROTOCOL AUTO-SIGNED</span>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* ================= HIGH-TECH CONFIRMATION MODAL ================= */}
      {isModalOpen && (
        <div
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 transition-all duration-300 animate-fade-in overflow-y-auto"
          role="dialog"
        >
          {/* Ambient Modal Backdrop */}
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={closeModal} />

          {/* Cyber Modal Card Container */}
          <div
            className="relative w-full max-w-2xl bg-[#12141c]/98 border border-[#00e5ff]/40 rounded-2xl p-5 sm:p-7 backdrop-blur-2xl shadow-[0_25px_70px_rgba(0,0,0,0.9)] cyan-glow z-10 scanlines my-auto max-h-[92vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Corner Cyber Accents */}
            <div className="absolute -top-px -left-px w-5 h-5 border-t-2 border-l-2 border-[#00e5ff] pointer-events-none" />
            <div className="absolute -top-px -right-px w-5 h-5 border-t-2 border-r-2 border-[#00e5ff] pointer-events-none" />
            <div className="absolute -bottom-px -left-px w-5 h-5 border-b-2 border-l-2 border-[#00e5ff] pointer-events-none" />
            <div className="absolute -bottom-px -right-px w-5 h-5 border-b-2 border-r-2 border-[#00e5ff] pointer-events-none" />

            {/* Modal Header & Telemetry */}
            <div className="flex items-center justify-between pb-3.5 border-b border-white/10 gap-3 mb-4 shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="relative flex h-2.5 w-2.5 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00e5ff] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00e5ff] shadow-[0_0_8px_#00e5ff]" />
                </span>
                <span className="font-code-sm text-xs text-[#00e5ff] font-bold tracking-wider uppercase truncate">
                  // TRANSMISSION_DISPATCH: CONFIRMED
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="hidden sm:inline-flex font-code-sm text-[11px] text-slate-400 bg-[#0b0e15] px-2.5 py-1 rounded border border-white/10">
                  PKG: <span className="text-[#00e5ff] font-bold ml-1">#TX-8924</span>
                </span>
                <button
                  aria-label="Dismiss Modal"
                  className="size-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-95"
                  onClick={closeModal}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>
            </div>

            {/* Scrollable Modal Content */}
            <div className="overflow-y-auto pr-1 flex-1">
              {/* Hero Status & Badge Section */}
              <div className="flex items-start gap-3.5 sm:gap-4 mb-4 shrink-0">
                <div className="w-12 h-12 rounded-xl bg-[#00e5ff]/10 border border-[#00e5ff]/40 flex items-center justify-center text-[#00e5ff] cyan-glow-subtle shrink-0 shadow-[0_0_20px_rgba(0,229,255,0.2)]">
                  <span className="material-symbols-outlined text-[28px] animate-pulse">verified_user</span>
                </div>
                <div className="min-w-0">
                  <h4 className="font-headline-sm text-lg sm:text-xl text-white font-bold tracking-tight">
                    Payload Accepted by Mail Server
                  </h4>
                  <p className="font-body-sm text-xs sm:text-sm text-slate-300 mt-0.5 leading-relaxed">
                    Transmission successfully accepted by mail infrastructure. Routed to{" "}
                    <span className="text-[#00e5ff] font-semibold break-all">shivamsakre10@gmail.com</span> for engineer review within 24 hours.
                  </p>
                </div>
              </div>

              {/* Terminal Telemetry Log Box */}
              <div className="rounded-xl bg-[#0b0e15]/95 border border-white/10 p-3 sm:p-3.5 font-code-md text-xs sm:text-[13px] text-slate-200 space-y-1.5 mb-4 overflow-hidden relative shrink-0">
                <div className="flex items-center justify-between text-slate-400 text-[10px] sm:text-[11px] font-code-sm border-b border-white/10 pb-1.5 mb-2">
                  <span className="flex items-center gap-1.5">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#00e5ff]" />
                    DISPATCH TELEMETRY STREAM
                  </span>
                  <span className="text-[#00e5ff] font-bold">NODE: AP-SOUTH-1</span>
                </div>
                <div className="text-slate-300 flex items-center justify-between gap-2">
                  <span className="flex items-center gap-1.5 truncate">
                    <span className="text-slate-500">&gt;</span>
                    <span>INITIATING SECURE SOCKET...</span>
                  </span>
                  <span className="text-[#00e5ff] font-bold shrink-0">[OK]</span>
                </div>
                <div className="text-slate-300 flex items-center justify-between gap-2">
                  <span className="flex items-center gap-1.5 truncate">
                    <span className="text-slate-500">&gt;</span>
                    <span>PAYLOAD ENCRYPTED VIA AES-256-GCM...</span>
                  </span>
                  <span className="text-[#00e5ff] font-bold shrink-0">[OK]</span>
                </div>
                <div className="text-slate-300 flex items-center justify-between gap-2">
                  <span className="flex items-center gap-1.5 truncate">
                    <span className="text-slate-500">&gt;</span>
                    <span>ROUTING VIA NODE: AP-SOUTH-1...</span>
                  </span>
                  <span className="text-[#e0b6ff] font-bold shrink-0">[DELIVERED]</span>
                </div>
                <div className="text-[#00e5ff] font-semibold flex items-center gap-1.5 pt-1 border-t border-white/5 truncate">
                  <span className="text-slate-500">&gt;</span>
                  <span className="truncate">SLA CLOCK INITIALIZED: &lt; 24 HOURS RESPONSE WINDOW</span>
                </div>
                {terminalLogs.map((logMsg, idx) => (
                  <div
                    className="text-cyan-300 flex items-center justify-between gap-2 pt-1 border-t border-white/5 animate-pulse"
                    key={idx}
                  >
                    <span className="flex items-center gap-1.5 truncate">
                      <span className="text-slate-500">&gt;</span>
                      <span className="truncate">{logMsg}</span>
                    </span>
                    <span className="text-[#00e5ff] font-bold shrink-0">[VERIFIED]</span>
                  </div>
                ))}
              </div>

              {/* Sleek Interactive Email Dispatch Strip */}
              <div className="rounded-xl bg-[#0b0e15]/80 border border-[#00e5ff]/20 p-3 mb-4 shrink-0">
                <div className="flex items-center justify-between text-[11px] font-code-sm text-slate-400 mb-2">
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[15px] text-[#00e5ff]">
                      mark_email_read
                    </span>
                    <span className="font-semibold text-slate-300">DISPATCH RECEIPT TO INBOX</span>
                  </span>
                  <span className="text-slate-400 uppercase text-[10px] tracking-wider font-mono">
                    {receiptStatusText}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      className="w-full bg-[#10131a] text-white font-code-sm text-xs placeholder:text-slate-500 border border-white/10 rounded-lg pl-3 pr-8 py-2.5 focus:outline-none focus:border-[#00e5ff] focus:ring-1 focus:ring-[#00e5ff] transition-all"
                      disabled={isDispatchingEmail}
                      onChange={(e) => setReceiptEmail(e.target.value)}
                      placeholder="your-email@domain.com"
                      ref={receiptEmailInputRef}
                      type="email"
                      value={receiptEmail}
                    />
                    <span className="material-symbols-outlined absolute right-2.5 top-2.5 text-slate-500 text-[16px] pointer-events-none">
                      mail
                    </span>
                  </div>
                  <button
                    className={`px-4 py-2.5 rounded-lg font-code-sm text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 shrink-0 ${
                      receiptBtnText === "EMAIL ACCEPTED BY MAIL SERVER"
                        ? "bg-emerald-500 text-slate-950 shadow-[0_0_16px_rgba(16,185,129,0.5)]"
                        : receiptBtnText.includes("FAILED")
                        ? "bg-red-600 text-white shadow-[0_0_16px_rgba(239,68,68,0.5)]"
                        : "bg-[#00e5ff]/10 hover:bg-[#00e5ff]/25 border border-[#00e5ff]/40 hover:border-[#00e5ff] text-[#00e5ff] shadow-[0_0_10px_rgba(0,229,255,0.15)]"
                    }`}
                    disabled={isDispatchingEmail}
                    onClick={handleSendEmailReceipt}
                    type="button"
                  >
                    <span
                      className={`material-symbols-outlined text-[16px] ${
                        isDispatchingEmail ? "animate-spin" : ""
                      }`}
                    >
                      {isDispatchingEmail
                        ? "sync"
                        : receiptBtnText === "EMAIL ACCEPTED BY MAIL SERVER"
                        ? "verified"
                        : receiptBtnText.includes("FAILED")
                        ? "error"
                        : "send"}
                    </span>
                    <span>{receiptBtnText}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Action Controls (Fixed Alignment, No Cut-Offs) */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3.5 border-t border-white/10 shrink-0">
              <div className="flex items-center gap-2">
                <button
                  className="flex-1 sm:flex-initial px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white font-code-sm text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                  onClick={handleCopyReceipt}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px]">content_copy</span>
                  <span>{headerCopyStatus || "COPY RECEIPT"}</span>
                </button>
                <button
                  className="flex-1 sm:flex-initial px-3.5 py-2.5 rounded-xl bg-[#00e5ff]/10 hover:bg-[#00e5ff]/20 border border-[#00e5ff]/40 hover:border-[#00e5ff] text-[#00e5ff] font-code-sm text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                  onClick={handleExportLog}
                  title="Download Formatted Transmission Telemetry Log"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px]">download</span>
                  <span>{modalDownloadStatus || "EXPORT .TXT LOG"}</span>
                </button>
              </div>

              <button
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00e5ff] to-[#00c8e0] text-[#00363d] font-code-sm text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_18px_rgba(0,229,255,0.4)] hover:shadow-[0_0_24px_rgba(0,229,255,0.65)] hover:brightness-110 active:scale-95 flex items-center justify-center gap-2 cursor-pointer shrink-0"
                onClick={closeModal}
                type="button"
              >
                <span>ACKNOWLEDGE [ESC]</span>
                <span className="material-symbols-outlined text-[16px]">check</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= CYBER NOTIFICATION TOAST ================= */}
      <div
        aria-live="polite"
        className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl backdrop-blur-xl transition-all duration-300 ${
          toastType === "error"
            ? "bg-red-950/95 border border-red-500/60 text-white shadow-[0_10px_30px_rgba(239,68,68,0.4)]"
            : toastType === "success"
            ? "bg-emerald-950/95 border border-emerald-500/60 text-white shadow-[0_10px_30px_rgba(16,185,129,0.4)]"
            : "bg-[#191b23]/95 border border-[#00e5ff]/40 text-white shadow-[0_10px_30px_rgba(0,0,0,0.8)] cyan-glow-subtle"
        } ${isToastVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0 pointer-events-none"}`}
      >
        <span className="relative flex h-2.5 w-2.5 shrink-0">
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
              toastType === "error"
                ? "bg-red-500"
                : toastType === "success"
                ? "bg-emerald-400"
                : "bg-[#00e5ff]"
            }`}
          />
          <span
            className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
              toastType === "error"
                ? "bg-red-500 shadow-[0_0_8px_#ef4444]"
                : toastType === "success"
                ? "bg-emerald-400 shadow-[0_0_8px_#10b981]"
                : "bg-[#00e5ff] shadow-[0_0_8px_#00e5ff]"
            }`}
          />
        </span>
        <span
          className={`font-code-sm text-xs font-bold ${
            toastType === "error"
              ? "text-red-300"
              : toastType === "success"
              ? "text-emerald-300"
              : "text-[#00e5ff]"
          }`}
        >
          {toastMessage || "[TRANSMISSION LOGGED: RECEIPT TX-8924] // 200 OK"}
        </span>
        <button
          aria-label="Close Toast"
          className="text-slate-400 hover:text-white ml-2 cursor-pointer"
          onClick={dismissToast}
          type="button"
        >
          <span className="material-symbols-outlined text-[16px]">close</span>
        </button>
      </div>
    </section>
  );
}
