'use client'

import { motion } from 'framer-motion'

export default function SurveyBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-background transition-colors duration-500">
      {/* Ambient glowing blobs */}
      <motion.div
        className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-[#FFC078]/25 to-[#DA9646]/10 blur-[100px] dark:from-[#FFC078]/15 dark:to-[#DA9646]/5"
        animate={{
          x: [0, 50, -30, 0],
          y: [0, -30, 50, 0],
          scale: [1, 1.1, 0.9, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute top-[35%] -right-[15%] w-[60%] h-[60%] rounded-full bg-gradient-to-br from-[#DA9646]/20 to-[#FFC078]/5 blur-[130px] dark:from-[#DA9646]/10 dark:to-[#FFC078]/3"
        animate={{
          x: [0, -60, 40, 0],
          y: [0, 50, -40, 0],
          scale: [1, 0.95, 1.1, 1],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute -bottom-[20%] left-[15%] w-[45%] h-[45%] rounded-full bg-gradient-to-br from-[#FFC078]/15 to-[#DA9646]/25 blur-[110px] dark:from-[#FFC078]/8 dark:to-[#DA9646]/12"
        animate={{
          x: [0, 40, -40, 0],
          y: [0, -50, 30, 0],
          scale: [1, 1.05, 0.95, 1],
        }}
        transition={{
          duration: 28,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      {/* Subtle tech-inspired grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(128,128,128,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(128,128,128,0.06)_1px,transparent_1px)] bg-[size:32px_32px] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_60%,transparent_100%)] pointer-events-none" />
    </div>
  )
}
