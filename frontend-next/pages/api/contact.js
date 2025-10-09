import { Resend } from "resend";

// Simple in-memory rate limiter: 100 req/hour per IP
const RATE_LIMIT = 100;
const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const buckets = new Map();

function sanitize(text = "") {
  return String(text)
    .replace(/<[^>]*>?/gm, "")
    .replace(/[\r\n\t]+/g, " ")
    .trim()
    .slice(0, 5000); // cap length
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "100kb",
    },
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req.socket?.remoteAddress ||
    "unknown";

  // Rate limiting
  const now = Date.now();
  const entry = buckets.get(ip) || { count: 0, start: now };
  if (now - entry.start > WINDOW_MS) {
    entry.count = 0;
    entry.start = now;
  }
  entry.count += 1;
  buckets.set(ip, entry);
  if (entry.count > RATE_LIMIT) {
    return res.status(429).json({ error: "Too many requests" });
  }

  try {
    const { name, email, message, token } = req.body || {};

    // Basic validation
    if (!name || !email || !message || !token) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    if (!validateEmail(email)) {
      return res.status(400).json({ error: "Invalid email" });
    }

    // Turnstile verification
    const formData = new URLSearchParams();
    formData.append("secret", process.env.TURNSTILE_SECRET || "");
    formData.append("response", token);
    // Optionally append ip for enhanced verification
    formData.append("remoteip", ip);

    const verifyResp = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData.toString(),
      },
    );
    const verifyData = await verifyResp.json();
    if (!verifyData.success) {
      return res.status(400).json({ error: "Turnstile verification failed" });
    }

    // Sanitize inputs
    const sName = sanitize(name);
    const sEmail = sanitize(email);
    const sMessage = sanitize(message);

    // Send email via Resend
    const resendApiKey = process.env.RESEND_API_KEY;
    const toEmail = process.env.CONTACT_TO_EMAIL;
    const fromEmail =
      process.env.CONTACT_FROM_EMAIL || "no-reply@agroisync.com";

    if (!resendApiKey || !toEmail) {
      return res.status(500).json({ error: "Email service not configured" });
    }

    const resend = new Resend(resendApiKey);

    const subject = `Contato via site: ${sName}`;
    const html = `
      <div>
        <p><strong>Nome:</strong> ${sName}</p>
        <p><strong>Email:</strong> ${sEmail}</p>
        <p><strong>Mensagem:</strong></p>
        <p>${sMessage}</p>
      </div>
    `;

    try {
      await resend.emails.send({
        from: fromEmail,
        to: toEmail,
        subject,
        html,
      });
    } catch {
      return res.status(502).json({ error: "Failed to send email" });
    }

    return res.status(200).json({ ok: true });
  } catch {
    return res.status(500).json({ error: "Internal server error" });
  }
}
