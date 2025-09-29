//OpenAnimation.jsx
import { motion } from 'framer-motion'

export default function OpeningAnimation({ onFinish }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 bg-neutral-900 flex items-center justify-center text-white text-7xl font-extrabold"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 1.5, delay: 1 }}
      onAnimationComplete={onFinish}
    >
      <motion.span
        initial={{ y: 50, opacity: 0, scale: 0.5 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-fuchsia-400 text-glow"
      >
        BookVerse
      </motion.span>
    </motion.div>
  )
}
