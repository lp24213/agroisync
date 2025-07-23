import { motion } from "framer-motion";

export default function AnimatedCard({ children }: { children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
      {children}
    </motion.div>
  );
}
