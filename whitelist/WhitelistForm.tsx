import { useState } from 'react'
import { registerWhitelistUser } from './register'

export default function WhitelistForm() {
  const [email, setEmail] = useState('')
  const [wallet, setWallet] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async e => {
    e.preventDefault()
    await registerWhitelistUser(email, wallet)
    setSuccess(true)
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-blue-950 rounded-xl text-white space-y-4 max-w-md">
      <h2 className="text-xl font-bold text-blue-400">Whitelist AGROTM</h2>
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Seu email" required className="p-2 w-full rounded bg-black border border-blue-800"/>
      <input value={wallet} onChange={e => setWallet(e.target.value)} placeholder="Sua carteira MetaMask" required className="p-2 w-full rounded bg-black border border-blue-800"/>
      <button className="px-4 py-2 rounded bg-blue-700 hover:bg-blue-800 text-white font-semibold">Registrar</button>
      {success && <p className="text-green-400">✅ Registro realizado com sucesso!</p>}
    </form>
  )
}