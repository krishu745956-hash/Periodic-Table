import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function NotFound() {
  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <span className="font-display font-bold text-8xl text-ink-faint mb-4">404</span>
      <h1 className="font-display text-2xl font-bold text-ink mb-2">Element Not Found</h1>
      <p className="font-body text-ink-muted max-w-md mb-8">
        The page you're looking for doesn't exist. It might have been displaced or never discovered.
      </p>
      <Link
        to="/"
        className="font-body px-6 py-3 bg-white border-2 border-ink shadow-sketch-sm hover:shadow-sketch text-ink transition-all"
        style={{ borderRadius: '8px 30px 8px 30px / 30px 8px 30px 8px' }}
      >
        ← Back to Periodic Table
      </Link>
    </motion.div>
  )
}