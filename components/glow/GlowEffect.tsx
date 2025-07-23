import { motion } from 'framer-motion'

export default function GlowEffect() {
  return (
    <motion.div
      className="absolute w-[400px] h-[400px] rounded-full bg-blue-500 blur-3xl opacity-20 z-0"
      animate={{ scale: [1, 1.4, 1], opacity: [0.2, 0.3, 0.2] }}
      transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
    />
  )
}