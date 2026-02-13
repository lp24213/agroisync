import fetch from 'node-fetch'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method_not_allowed' })
  const { token } = req.body
  if (!token) return res.status(400).json({ error: 'missing_token' })

  const secret = process.env.TURNSTILE_SECRET
  if (!secret) return res.status(500).json({ error: 'turnstile_not_configured' })

  const params = new URLSearchParams()
  params.append('secret', secret)
  params.append('response', token)

  const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body: params
  })
  const data = await verifyRes.json()
  if (!data.success) {
    return res.status(403).json({ ok: false, detail: data })
  }
  return res.status(200).json({ ok: true })
}
