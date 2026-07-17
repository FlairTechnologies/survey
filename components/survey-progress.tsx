'use client'

import { motion } from 'framer-motion'

interface SurveyProgressProps {
  currentStep: number
  totalSteps: number
}

export default function SurveyProgress({ currentStep, totalSteps }: SurveyProgressProps) {
  // calculate progress percentage
  // We exclude the welcome page (index 0) from the percentage progress to make it start at 0%
  const progressPercent =
    totalSteps <= 1 ? 0 : Math.min(100, Math.max(0, (currentStep / (totalSteps - 1)) * 100))

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="flex justify-between items-center text-xs font-medium text-muted-foreground">
        <span>Survey Progress</span>
        <span>{Math.round(progressPercent)}% Complete</span>
      </div>
      <div className="h-2 w-full bg-secondary dark:bg-[#1f2937] rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-[#FFC078] to-[#DA9646] rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        />
      </div>
    </div>
  )
}
