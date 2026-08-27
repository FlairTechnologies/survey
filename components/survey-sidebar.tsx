'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { Check, Clock, ShieldCheck } from 'lucide-react'
import { SurveySection } from './survey-questions'
import LogoFullDark from '@/public/assets/logo/logo-full-dark.png'

interface SurveySidebarProps {
  sections: SurveySection[]
  activeSectionIndex: number
  progressPercent: number
  isSubmitted: boolean
}

export default function SurveySidebar({
  sections,
  activeSectionIndex,
  progressPercent,
  isSubmitted,
}: SurveySidebarProps) {
  const current = activeSectionIndex >= 0 ? sections[activeSectionIndex] : null

  return (
    <aside className="relative hidden lg:flex lg:flex-col justify-between overflow-hidden bg-[#0b0a09] text-white/90 px-10 py-9">
      {/* Ambient brand light */}
      <div className="pointer-events-none absolute -top-32 -left-24 h-[26rem] w-[26rem] rounded-full bg-[#DA9646]/25 blur-[110px]" />
      <div className="pointer-events-none absolute -bottom-24 -right-16 h-80 w-80 rounded-full bg-[#FFC078]/12 blur-[100px]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_70%_60%_at_30%_30%,#000,transparent)]" />

      {/* Logo */}
      <div className="relative z-10">
        <Image src={LogoFullDark} alt="Flair Technologies" className="h-9 w-auto" priority />
      </div>

      {/* Section context + stepper */}
      <div className="relative z-10 my-10">
        <motion.div
          key={isSubmitted ? 'done' : current?.label ?? 'welcome'}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mb-9"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#FFC078]">
            {isSubmitted ? 'Complete' : current ? `${current.eyebrow} · ${activeSectionIndex + 1} of ${sections.length}` : 'Welcome'}
          </p>
          <h2 className="mt-2 text-[1.75rem] leading-tight font-bold tracking-tight text-white">
            {isSubmitted ? 'Thank you' : current ? current.label : 'Product Research Survey'}
          </h2>
          {!isSubmitted && current?.description && (
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-white/50">{current.description}</p>
          )}
        </motion.div>

        <ol className="space-y-1">
          {sections.map((section, i) => {
            const isDone = isSubmitted || activeSectionIndex > i
            const isActive = !isSubmitted && activeSectionIndex === i
            return (
              <li key={section.label} className="flex items-center gap-3 py-1">
                <span
                  className={`relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold transition-colors duration-300 ${
                    isDone
                      ? 'bg-gradient-to-br from-[#FFC078] to-[#DA9646] text-black'
                      : isActive
                      ? 'bg-white/10 text-white ring-2 ring-[#FFC078]'
                      : 'bg-white/5 text-white/40 ring-1 ring-white/10'
                  }`}
                >
                  {isDone ? <Check className="h-3.5 w-3.5 stroke-[3]" /> : i + 1}
                </span>
                <span
                  className={`text-sm transition-colors duration-300 ${
                    isActive ? 'font-semibold text-white' : isDone ? 'text-white/70' : 'text-white/40'
                  }`}
                >
                  {section.label}
                </span>
              </li>
            )
          })}
        </ol>
      </div>

      {/* Footer: progress + reassurance */}
      <div className="relative z-10">
        <div className="mb-4 flex items-center gap-4 text-[11px] font-medium text-white/40">
          <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> ~2 min</span>
          <span className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5" /> Private &amp; secure</span>
        </div>
        <div className="mb-2 flex items-center justify-between text-xs font-semibold text-white/70">
          <span>Your progress</span>
          <span className="text-[#FFC078]">{Math.round(progressPercent)}%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-[#FFC078] to-[#DA9646]"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </div>
    </aside>
  )
}
