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

export async function handleContactForm(formData, ip = 'unknown') {
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
    throw new Error('Too many requests');
  }

  const { name, email, message, token } = formData || {};

  // Basic validation
  if (!name || !email || !message || !token) {
    throw new Error('Missing required fields');
  }
  if (!validateEmail(email)) {
    throw new Error('Invalid email');
  }

  // Turnstile verification
  const verifyFormData = new URLSearchParams();
  verifyFormData.append("secret", process.env.REACT_APP_TURNSTILE_SECRET || "");
  verifyFormData.append("response", token);
  verifyFormData.append("remoteip", ip);

  const verifyResp = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: verifyFormData.toString(),
    },
  );
  const verifyData = await verifyResp.json();
  if (!verifyData.success) {
    throw new Error('Turnstile verification failed');
  }

  // Sanitize inputs
  const sName = sanitize(name);
  const sEmail = sanitize(email);
  const sMessage = sanitize(message);

  // Here you would integrate with your email service
  // For now, just return success
  console.log('Contact form submitted:', { sName, sEmail, sMessage });
  
  return { success: true };
}
