import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { neon } from "@neondatabase/serverless";

// ---------------------------------------------------------------------------
// DISPOSABLE / THROWAWAY EMAIL DOMAINS BLOCKLIST
// Bots frequently use these to submit spam without a real inbox.
// ---------------------------------------------------------------------------
const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com","tempmail.com","guerrillamail.com","10minutemail.com",
  "throwaway.email","yopmail.com","trashmail.com","fakeinbox.com",
  "sharklasers.com","guerrillamailblock.com","grr.la","guerrillamail.info",
  "spam4.me","bccto.me","dispostable.com","tempr.email","discard.email",
  "maildrop.cc","getairmail.com","filzmail.com","spamgourmet.com",
  "mailnesia.com","mailnull.com","spamspot.com","trashmail.me",
  "trashmail.at","trashmail.io","discardmail.com","tempinbox.com",
  "spamex.com","emailondeck.com","throwam.com","getnada.com",
  "tempmailaddress.com","mailtemp.info","spamwc.com","anonaddy.com",
]);

// ---------------------------------------------------------------------------
// DB-backed rate limiter — works across all Vercel serverless instances.
// 3 submissions allowed per IP per 24 hours.
// ---------------------------------------------------------------------------
async function checkRateLimit(ip) {
  const sql = neon(process.env.DATABASE_URL);
  const WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours
  const MAX = 3;

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS rate_limits (
        ip VARCHAR(64) PRIMARY KEY,
        count INTEGER NOT NULL DEFAULT 1,
        expires_at BIGINT NOT NULL
      )
    `;

    const now = Date.now();
    const expiresAt = now + WINDOW_MS;

    const rows = await sql`
      INSERT INTO rate_limits (ip, count, expires_at)
      VALUES (${ip}, 1, ${expiresAt})
      ON CONFLICT (ip) DO UPDATE SET
        count = CASE
          WHEN rate_limits.expires_at < ${now} THEN 1
          ELSE rate_limits.count + 1
        END,
        expires_at = CASE
          WHEN rate_limits.expires_at < ${now} THEN ${expiresAt}
          ELSE rate_limits.expires_at
        END
      RETURNING count, expires_at
    `;

    const count = rows[0]?.count ?? 1;
    return { limited: count > MAX, remaining: Math.max(0, MAX - count) };
  } catch {
    return { limited: false, remaining: MAX };
  }
}

// ---------------------------------------------------------------------------
// GOOGLE reCAPTCHA v3 VERIFICATION
// Set RECAPTCHA_SECRET_KEY in Vercel environment variables to enable.
// ---------------------------------------------------------------------------
async function verifyRecaptcha(token) {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) return true; // Skip if not configured yet

  try {
    const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `secret=${secret}&response=${token}`,
    });
    const data = await res.json();
    // Score below 0.5 = likely a bot. 1.0 = definitely human.
    return data.success && data.score >= 0.5;
  } catch {
    return true; // Fail open — don't block real users if reCAPTCHA is down
  }
}

export async function POST(request) {
  // ---------------------------------------------------------------------------
  // 🚫 TEMPORARILY DISABLED — Contact form email sending is paused.
  // To re-enable, remove this block and the early return below.
  // ---------------------------------------------------------------------------
  return NextResponse.json(
    { error: "Our online inquiry form is temporarily unavailable. Please call us directly at +91 99601 94497 or email sales@comeetindia.com" },
    { status: 503 }
  );
  // ---------------------------------------------------------------------------

  try {
    // 1. Extract Client IP
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded
      ? forwarded.split(",")[0].trim()
      : request.headers.get("x-real-ip") || "127.0.0.1";

    // 2. IP Rate Limit Check (3 per day)
    const { limited } = await checkRateLimit(ip);
    if (limited) {
      return NextResponse.json(
        {
          error:
            "You have reached the maximum of 3 inquiries per day from your connection. Please call our team directly at +91 99601 94497.",
        },
        { status: 429 }
      );
    }

    // 3. Parse Body
    const body = await request.json();
    const { name, email, phone, service, budget, message, company_fax, _timestamp, recaptchaToken } = body;

    // 4. Honeypot Anti-Bot Trap:
    // 'company_fax' is invisible to human users. If filled, it's an automated bot.
    if (company_fax && company_fax.trim().length > 0) {
      // Silently accept so bot thinks it succeeded, but send NO email
      return NextResponse.json({ success: true });
    }

    // 5. Time-Based Bot Check:
    // Humans cannot realistically fill a form in under 3 seconds.
    // If _timestamp is missing or form was submitted too fast, it's a bot.
    if (_timestamp) {
      const elapsed = Date.now() - parseInt(_timestamp);
      if (elapsed < 3000) {
        return NextResponse.json({ success: true }); // Silently reject bot
      }
    }

    // 6. Google reCAPTCHA v3 Verification
    if (recaptchaToken) {
      const isHuman = await verifyRecaptcha(recaptchaToken);
      if (!isHuman) {
        return NextResponse.json(
          { error: "Bot activity detected. Please refresh the page and try again." },
          { status: 403 }
        );
      }
    }

    // 7. Input Validation & Bounds
    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json({ error: "Please provide your full name." }, { status: 400 });
    }
    if (name.length > 100) {
      return NextResponse.json({ error: "Name must be under 100 characters." }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.trim()) || email.length > 120) {
      return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
    }

    // 8. Disposable Email Domain Check
    const emailDomain = email.trim().toLowerCase().split("@")[1];
    if (DISPOSABLE_DOMAINS.has(emailDomain)) {
      return NextResponse.json(
        { error: "Temporary or disposable email addresses are not accepted. Please use your real work or personal email." },
        { status: 400 }
      );
    }

    if (!message || typeof message !== "string" || message.trim().length < 5) {
      return NextResponse.json({ error: "Please provide a brief message describing your requirements." }, { status: 400 });
    }
    if (message.length > 3000) {
      return NextResponse.json({ error: "Message is too long (maximum 3000 characters)." }, { status: 400 });
    }

    // Sanitize string inputs for safe HTML email rendering
    const sanitize = (str) =>
      str
        ? String(str)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;")
        : "";

    const safeName    = sanitize(name.trim());
    const safeEmail   = sanitize(email.trim());
    const safePhone   = sanitize((phone || "").trim()) || "—";
    const safeService = sanitize(service || "General Automation Inquiry");
    const safeBudget  = sanitize(budget || "Standard");
    const safeMessage = sanitize(message.trim()).replace(/\n/g, "<br/>");

    // 9. Transporter Setup
    if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
      console.warn("SMTP Warning: SMTP_USER or SMTP_PASSWORD not set in environment.");
      return NextResponse.json({
        success: true,
        mock: true,
        note: "Inquiry received in dev mode (SMTP credentials pending in .env.local).",
      });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: parseInt(process.env.SMTP_PORT) || 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const recipient = process.env.CONTACT_RECIPIENT || "sales@comeetindia.com";

    // 10. Verify SMTP connection before sending
    try {
      await transporter.verify();
    } catch (verifyError) {
      console.error("SMTP Authentication Error:", verifyError);
      return NextResponse.json(
        { error: `Email server authentication failed: ${verifyError.message}. Please check SMTP_USER and SMTP_PASSWORD in Vercel.` },
        { status: 500 }
      );
    }

    // 11. Send Inquiry Email to Comeet Sales Team
    await transporter.sendMail({
      from: `"Comeet Controls Portal" <${process.env.SMTP_USER}>`,
      to: recipient,
      replyTo: email.trim(),
      subject: `[Website Inquiry] ${safeService} - ${safeName}`,
      html: `
        <div style="font-family:Arial,Helvetica,sans-serif;max-width:640px;margin:0 auto;background:#f8fafc;padding:24px;border-radius:12px;border:1px solid #e2e8f0;">
          <div style="background:linear-gradient(135deg,#0066ff,#00b4ff);padding:24px;border-radius:8px;text-align:center;color:#ffffff;">
            <h1 style="margin:0;font-size:22px;letter-spacing:-0.5px;">New Website Inquiry</h1>
            <p style="margin:6px 0 0;opacity:0.9;font-size:13px;">Comeet Controls Pvt. Ltd. · Customer Portal</p>
          </div>
          
          <div style="background:#ffffff;padding:28px;border-radius:8px;margin-top:16px;box-shadow:0 2px 4px rgba(0,0,0,0.04);">
            <table style="width:100%;border-collapse:collapse;font-size:14px;line-height:1.6;">
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #edf2f7;color:#64748b;width:140px;"><strong>Client Name</strong></td>
                <td style="padding:10px 0;border-bottom:1px solid #edf2f7;color:#0f172a;font-weight:600;">${safeName}</td>
              </tr>
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #edf2f7;color:#64748b;"><strong>Work Email</strong></td>
                <td style="padding:10px 0;border-bottom:1px solid #edf2f7;color:#0066ff;"><a href="mailto:${safeEmail}" style="color:#0066ff;text-decoration:none;">${safeEmail}</a></td>
              </tr>
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #edf2f7;color:#64748b;"><strong>Contact Phone</strong></td>
                <td style="padding:10px 0;border-bottom:1px solid #edf2f7;color:#0f172a;"><a href="tel:${safePhone}" style="color:#0f172a;text-decoration:none;">${safePhone}</a></td>
              </tr>
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #edf2f7;color:#64748b;"><strong>Service Category</strong></td>
                <td style="padding:10px 0;border-bottom:1px solid #edf2f7;color:#0f172a;">${safeService}</td>
              </tr>
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #edf2f7;color:#64748b;"><strong>Timeline / Urgency</strong></td>
                <td style="padding:10px 0;border-bottom:1px solid #edf2f7;color:#0f172a;">${safeBudget}</td>
              </tr>
              <tr>
                <td style="padding:14px 0 6px;color:#64748b;vertical-align:top;"><strong>Project Scope</strong></td>
                <td style="padding:14px 0 6px;color:#0f172a;line-height:1.7;">${safeMessage}</td>
              </tr>
            </table>

            <div style="margin-top:24px;padding:14px 18px;background:#f0f9ff;border-left:4px solid #00b4ff;border-radius:4px;font-size:12px;color:#0369a1;">
              <strong>Quick Tip:</strong> Simply click &ldquo;Reply&rdquo; in your email client to respond directly to ${safeName} (${safeEmail}).
            </div>
          </div>
          
          <p style="text-align:center;font-size:11px;color:#94a3b8;margin:16px 0 0;">
            Submission IP: ${ip} · Received: ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST
          </p>
        </div>
      `,
    });

    // 12. Send Auto-Reply Confirmation to Submitter
    await transporter.sendMail({
      from: `"Comeet Controls Pvt. Ltd." <${process.env.SMTP_USER}>`,
      to: email.trim(),
      subject: `We received your inquiry — Comeet Controls Pvt. Ltd.`,
      html: `
        <div style="font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:0 auto;background:#f8fafc;padding:24px;border-radius:12px;border:1px solid #e2e8f0;">
          <div style="background:linear-gradient(135deg,#0066ff,#00b4ff);padding:28px 24px;border-radius:8px;text-align:center;color:#ffffff;">
            <h1 style="margin:0;font-size:20px;letter-spacing:-0.5px;">Thank You, ${safeName}!</h1>
            <p style="margin:8px 0 0;opacity:0.9;font-size:13px;">Your inquiry has been received by our engineering team.</p>
          </div>

          <div style="background:#ffffff;padding:28px;border-radius:8px;margin-top:16px;box-shadow:0 2px 4px rgba(0,0,0,0.04);">
            <p style="font-size:14px;color:#334155;line-height:1.7;margin-top:0;">
              We have received your technical inquiry regarding <strong>${safeService}</strong>. Our senior engineer will review your requirements and respond within <strong>24 working hours</strong> (Mon–Sat, 9 AM – 6 PM IST).
            </p>

            <div style="background:#f0f9ff;border:1px solid #bae6fd;border-radius:8px;padding:16px 20px;margin:20px 0;font-size:13px;color:#0369a1;">
              <strong>Your Inquiry Summary</strong><br/>
              <span style="color:#334155;">Service: ${safeService}</span><br/>
              <span style="color:#334155;">Timeline: ${safeBudget || "Not specified"}</span>
            </div>

            <p style="font-size:13px;color:#64748b;line-height:1.6;">
              If your requirement is <strong>urgent</strong>, please call or WhatsApp us directly:
            </p>
            <p style="text-align:center;margin:16px 0;">
              <a href="tel:+919960194497" style="display:inline-block;background:linear-gradient(135deg,#0066ff,#00b4ff);color:#ffffff;font-weight:600;font-size:15px;text-decoration:none;padding:12px 28px;border-radius:30px;">
                📞 +91 99601 94497
              </a>
            </p>

            <hr style="border:none;border-top:1px solid #e2e8f0;margin:20px 0;" />
            <p style="font-size:12px;color:#94a3b8;margin:0;line-height:1.6;">
              <strong style="color:#334155;">Comeet Controls Pvt. Ltd.</strong><br/>
              Shop No. 34, Mahasainik Industrial Estate Rd,<br/>
              T Block, MIDC, Bhosari, Pimpri-Chinchwad – 411026, Maharashtra<br/>
              <a href="mailto:sales@comeetindia.com" style="color:#0066ff;text-decoration:none;">sales@comeetindia.com</a> · 
              <a href="https://www.comeetindia.com" style="color:#0066ff;text-decoration:none;">www.comeetindia.com</a>
            </p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Contact API Server Error:", error);
    return NextResponse.json(
      { error: "Failed to send email. Error: " + (error.message || "Unknown error") },
      { status: 500 }
    );
  }
}
