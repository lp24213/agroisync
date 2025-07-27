import { useState } from 'react';
import { useRouter } from 'next/router';
import Skeleton from '../components/Skeleton';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await fetch('/api/admin-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    setLoading(false);
    if (res.ok) {
      router.push('/admin');
    } else {
      setError('Credenciais inválidas.');
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background animate-fade-in">
      <form
        onSubmit={handleSubmit}
        className="bg-black/60 p-8 rounded-2xl shadow-neon max-w-md w-full flex flex-col gap-6 border border-primary/30 backdrop-blur-lg"
      >
        <h1 className="text-3xl font-futuristic text-primary mb-2 text-center drop-shadow-neon">
          Login Administrativo
        </h1>
        {error && <div className="text-red-400 text-center mb-2">{error}</div>}
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          autoFocus
          onChange={e => setEmail(e.target.value)}
          className="px-4 py-3 rounded-lg bg-black/70 border border-primary/40 text-white focus:outline-none focus:ring-2 focus:ring-primary w-full"
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="px-4 py-3 rounded-lg bg-black/70 border border-primary/40 text-white focus:outline-none focus:ring-2 focus:ring-primary w-full"
          required
        />
        <button
          type="submit"
          className="mt-4 py-3 rounded-lg bg-primary text-black font-bold shadow-neon hover:bg-accent transition-all text-lg"
          disabled={loading}
        >
          {loading ? <Skeleton width="w-24" height="h-6" /> : 'Entrar'}
        </button>
      </form>
    </div>
  );
}
