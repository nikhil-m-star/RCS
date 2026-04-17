import { motion } from 'framer-motion';

export function TetrisFall({ children, delay = 0, className = '' }) {
  return (
    <motion.div
      className={className}
      initial={{ y: '-120vh', opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        type: 'spring',
        damping: 15,
        stiffness: 80,
        delay: delay,
      }}
    >
      {children}
    </motion.div>
  );
}
