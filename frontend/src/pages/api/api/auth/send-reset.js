import sgMail from '@sendgrid/mail'
import crypto from 'crypto'

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method_not_allowed' })
  const { email } = req.body
  if (!email) return res.status(400).json({ error: 'missing_email' })

  // generate token (short-living)
  const token = crypto.randomBytes(32).toString('hex')
  const expiresAt = Date.now() + 1000 * 60 * 60 // 1 hour

  // Persist token to DB: INSERT or upsert into password_resets (implement according to your DB)
  // Example pseudocode: await DB.prepare('INSERT INTO password_resets (email, token, expires) VALUES (?, ?, ?)').run(email, token, expiresAt)

  const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${token}&email=${encodeURIComponent(email)}`

  const msg = {
    to: email,
    from: process.env.EMAIL_FROM,
    subject: 'Recuperação de senha - Agroisync',
    text: `Use este link para recuperar sua senha: ${resetUrl} (válido por 1 hora)`,
    html: `<p>Use este link para recuperar sua senha: <a href="${resetUrl}">${resetUrl}</a></p><p>Válido por 1 hora.</p>`
  }

  try {
    await sgMail.send(msg)
    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error('SendGrid error', err)
    return res.status(500).json({ ok: false, error: 'email_failed' })
  }
}
