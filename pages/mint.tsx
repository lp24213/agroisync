import { useState } from 'react'
import { ethers } from 'ethers'

export default function MintNFT() {
  const [minted, setMinted] = useState(false)
  const [loading, setLoading] = useState(false)

  const mint = async () => {
    try {
      if (!window.ethereum) throw new Error('MetaMask não detectado')
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(
        '0x000000000000000000000000000000000000dEaD', // contrato exemplo
        ['function mint() public'], // ABI mínima
        signer
      )
      setLoading(true)
      const tx = await contract.mint()
      await tx.wait()
      setMinted(true)
    } catch (err) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center mt-12">
      <button
        onClick={mint}
        disabled={loading}
        className="px-8 py-3 rounded-xl bg-blue-700 hover:bg-blue-900 text-white font-bold transition text-lg"
      >
        {loading ? 'Mintando...' : 'Mintar NFT'}
      </button>
      {minted && <p className="mt-4 text-green-400 font-bold">✅ NFT Mintado com sucesso!</p>}
    </div>
  )
}