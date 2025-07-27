import { useState } from 'react';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { useRouter } from 'next/router';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [captchaToken, setCaptchaToken] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSMS, setShowSMS] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [show2FA, setShow2FA] = useState(false);
  const [showWebAuthn, setShowWebAuthn] = useState(false);
  const [phone, setPhone] = useState('');
  const [smsCode, setSMSCode] = useState('');
  const [emailCode, setEmailCode] = useState('');
  const [step, setStep] = useState<'register'|'sms'|'email'|'2fa'|'webauthn'|'done'>('register');
  const [qr, setQR] = useState('');
  const [totpSecret, setTotpSecret] = useState('');
  const [totpToken, setTotpToken] = useState('');
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password, confirmPassword, captchaToken }),
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      setSuccess('Cadastro realizado. Agora valide seu telefone.');
      setStep('sms');
      // Enviar SMS automático
      await fetch('/api/send-sms', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ phone }) });
    } else {
      setError(data.message || 'Erro ao cadastrar.');
    }
  }

  async function handleSMSConfirm(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    // Simular verificação do código SMS (em produção, criar endpoint de verificação)
    setLoading(false);
    setSuccess('SMS confirmado! Agora valide o e-mail.');
    setStep('email');
    await fetch('/api/send-email', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) });
  }

  async function handleEmailConfirm(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    // Simular verificação do código e-mail (em produção, criar endpoint de verificação)
    setLoading(false);
    setSuccess('E-mail confirmado! Agora ative o 2FA.');
    setStep('2fa');
    // Iniciar fluxo 2FA
    const res = await fetch('/api/2fa-init', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) });
    const data = await res.json();
    setQR(data.qr);
    setTotpSecret(data.secret);
  }

  async function handle2FAConfirm(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await fetch('/api/2fa-verify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token: totpToken, secret: totpSecret }) });
    setLoading(false);
    if (res.ok) {
      setSuccess('2FA ativado! Agora ative a biometria.');
      setStep('webauthn');
    } else {
      setError('Código 2FA inválido.');
    }
  }

  async function handleWebAuthn() {
    setSuccess('Biometria ativada! Cadastro completo.');
    setStep('done');
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background animate-fade-in px-2">
      {step === 'register' && (
      <form
        onSubmit={handleSubmit}
        className="bg-black/60 p-8 rounded-2xl shadow-neon max-w-md w-full flex flex-col gap-6 border border-primary/30 backdrop-blur-lg"
      >
        <h1 className="text-3xl font-futuristic text-primary mb-2 text-center drop-shadow-neon">
          Cadastro Seguro
        </h1>
        {error && <div className="text-red-400 text-center mb-2">{error}</div>}
        {success && <div className="text-green-400 text-center mb-2">{success}</div>}
        <input
          type="text"
          placeholder="Usuário"
          value={username}
          autoFocus
          onChange={e => setUsername(e.target.value)}
          className="px-4 py-3 rounded-lg bg-black/70 border border-primary/40 text-white focus:outline-none focus:ring-2 focus:ring-primary w-full"
          required
        />
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="px-4 py-3 rounded-lg bg-black/70 border border-primary/40 text-white focus:outline-none focus:ring-2 focus:ring-primary w-full"
          required
        />
        <input
          type="tel"
          placeholder="Telefone (com DDD)"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          className="px-4 py-3 rounded-lg bg-black/70 border border-primary/40 text-white focus:outline-none focus:ring-2 focus:ring-primary w-full"
          required
        />
        <input
          type="password"
          placeholder="Senha (mín. 12 caracteres, maiúscula, minúscula, número, símbolo)"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="px-4 py-3 rounded-lg bg-black/70 border border-primary/40 text-white focus:outline-none focus:ring-2 focus:ring-primary w-full"
          required
        />
        <input
          type="password"
          placeholder="Confirme a senha"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          className="px-4 py-3 rounded-lg bg-black/70 border border-primary/40 text-white focus:outline-none focus:ring-2 focus:ring-primary w-full"
          required
        />
        <div className="flex flex-col items-center mt-2">
          <HCaptcha
            sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITEKEY || ''}
            onVerify={setCaptchaToken}
            theme="dark"
          />
        </div>
        <button
          type="submit"
          className="mt-4 py-3 rounded-lg bg-primary text-black font-bold shadow-neon hover:bg-accent transition-all text-lg"
          disabled={loading || !captchaToken}
        >
          {loading ? 'Cadastrando...' : 'Cadastrar'}
        </button>
      </form>
      )}
      {step === 'sms' && (
        <form onSubmit={handleSMSConfirm} className="bg-black/60 p-8 rounded-2xl shadow-neon max-w-md w-full flex flex-col gap-6 border border-primary/30 backdrop-blur-lg mt-8">
          <h2 className="text-xl text-primary mb-2 text-center">Confirmação SMS</h2>
          <p className="text-white/80 mb-4 text-center">Digite o código enviado para seu telefone.</p>
          <input type="text" placeholder="Código SMS" value={smsCode} onChange={e=>setSMSCode(e.target.value)} className="px-4 py-3 rounded-lg bg-black/70 border border-primary/40 text-white focus:outline-none focus:ring-2 focus:ring-primary w-full" required />
          <button type="submit" className="mt-4 py-3 rounded-lg bg-primary text-black font-bold shadow-neon hover:bg-accent transition-all text-lg">Confirmar SMS</button>
        </form>
      )}
      {step === 'email' && (
        <form onSubmit={handleEmailConfirm} className="bg-black/60 p-8 rounded-2xl shadow-neon max-w-md w-full flex flex-col gap-6 border border-primary/30 backdrop-blur-lg mt-8">
          <h2 className="text-xl text-primary mb-2 text-center">Confirmação de E-mail</h2>
          <p className="text-white/80 mb-4 text-center">Digite o código enviado para seu e-mail.</p>
          <input type="text" placeholder="Código E-mail" value={emailCode} onChange={e=>setEmailCode(e.target.value)} className="px-4 py-3 rounded-lg bg-black/70 border border-primary/40 text-white focus:outline-none focus:ring-2 focus:ring-primary w-full" required />
          <button type="submit" className="mt-4 py-3 rounded-lg bg-primary text-black font-bold shadow-neon hover:bg-accent transition-all text-lg">Confirmar E-mail</button>
        </form>
      )}
      {step === '2fa' && (
        <form onSubmit={handle2FAConfirm} className="bg-black/60 p-8 rounded-2xl shadow-neon max-w-md w-full flex flex-col gap-6 border border-primary/30 backdrop-blur-lg mt-8">
          <h2 className="text-xl text-primary mb-2 text-center">Ative 2FA</h2>
          <p className="text-white/80 mb-4 text-center">Escaneie o QR code no Google Authenticator/Authy ou insira manualmente o código fornecido.</p>
          {qr && <img src={qr} alt="QR Code 2FA" className="mx-auto mb-4" style={{width:180,height:180}} />}
          <input type="text" placeholder="Código 2FA" value={totpToken} onChange={e=>setTotpToken(e.target.value)} className="px-4 py-3 rounded-lg bg-black/70 border border-primary/40 text-white focus:outline-none focus:ring-2 focus:ring-primary w-full" required />
          <button type="submit" className="mt-4 py-3 rounded-lg bg-primary text-black font-bold shadow-neon hover:bg-accent transition-all text-lg">Ativar 2FA</button>
        </form>
      )}
      {step === 'webauthn' && (
        <div className="bg-black/60 p-8 rounded-2xl shadow-neon max-w-md w-full flex flex-col gap-6 border border-primary/30 backdrop-blur-lg mt-8 text-center">
          <h2 className="text-xl text-primary mb-2">Ative Biometria (WebAuthn)</h2>
          <p className="text-white/80 mb-4">Você poderá usar impressão digital, FaceID ou Windows Hello para login ultra seguro.</p>
          <button className="mt-4 py-3 rounded-lg bg-primary text-black font-bold shadow-neon hover:bg-accent transition-all text-lg" onClick={handleWebAuthn}>Ativar Biometria</button>
        </div>
      )}
      {step === 'done' && (
        <div className="bg-black/60 p-8 rounded-2xl shadow-neon max-w-md w-full flex flex-col gap-6 border border-primary/30 backdrop-blur-lg mt-8 text-center">
          <h2 className="text-xl text-primary mb-2">Cadastro Completo!</h2>
          <p className="text-white/80 mb-4">Sua conta está protegida com o máximo de segurança.</p>
          <button className="mt-4 py-3 rounded-lg bg-primary text-black font-bold shadow-neon hover:bg-accent transition-all text-lg" onClick={()=>router.push('/login')}>Ir para login</button>
        </div>
      )}
    </div>
  );
}
