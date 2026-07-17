'use client'

import React, { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, ClipboardList, Clock, Sparkles } from 'lucide-react'
import { SurveyQuestion } from './survey-questions'

interface SurveyStepRendererProps {
  question: SurveyQuestion
  answer: any
  onChange: (value: any) => void
  onNext: () => void
}

export default function SurveyStepRenderer({
  question,
  answer,
  onChange,
  onNext,
}: SurveyStepRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  // Auto-focus textareas
  useEffect(() => {
    if (question.type === 'textarea' || question.type === 'text') {
      const input = containerRef.current?.querySelector('textarea, input') as HTMLElement
      if (input) input.focus()
    }
  }, [question.id, question.type])

  // Handle hotkeys (1-9) for single-choice questions
  useEffect(() => {
    if (question.type !== 'single-choice' || !question.options) return

    const handleKeyDown = (e: KeyboardEvent) => {
      const keyNum = parseInt(e.key)
      if (keyNum >= 1 && keyNum <= question.options!.length) {
        const option = question.options![keyNum - 1]
        onChange(option)
        // Add a slight delay before moving to the next step so the selection animation is visible
        setTimeout(() => {
          onNext()
        }, 300)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [question, onChange, onNext])

  // 1. Welcome Screen
  if (question.type === 'welcome') {
    return (
      <div className="text-center py-6 flex flex-col items-center gap-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FFC078] to-[#DA9646] flex items-center justify-center shadow-lg shadow-orange-500/10">
          <Sparkles className="w-8 h-8 text-black" />
        </div>
        <div className="space-y-3">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-[#FFC078] via-[#DA9646] to-[#FFC078] bg-size-200 bg-clip-text text-transparent animate-gradient-flow py-1">
            {question.title}
          </h1>
          <p className="text-muted-foreground text-sm md:text-base max-w-lg mx-auto leading-relaxed">
            {question.subtitle}
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-6 mt-4 w-full max-w-md">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-card border border-border/60 shadow-sm flex-1 min-w-[140px] justify-center">
            <Clock className="w-4 h-4 text-[#DA9646]" />
            <span className="text-xs font-semibold">~2 Min Read</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-card border border-border/60 shadow-sm flex-1 min-w-[140px] justify-center">
            <ClipboardList className="w-4 h-4 text-[#DA9646]" />
            <span className="text-xs font-semibold">5 Questions</span>
          </div>
        </div>

        <motion.button
          onClick={onNext}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className="mt-8 px-8 py-4 rounded-full bg-gradient-to-r from-[#FFC078] to-[#DA9646] text-black font-semibold text-base shadow-lg shadow-orange-500/15 hover:shadow-orange-500/25 transition-all duration-300 w-full max-w-xs cursor-pointer"
        >
          Start Survey
        </motion.button>
      </div>
    )
  }

  // Common wrapper for standard question pages
  return (
    <div ref={containerRef} className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
          {question.title}
          {question.required && <span className="text-[#DA9646] ml-1">*</span>}
        </h2>
        {question.subtitle && (
          <p className="text-muted-foreground text-sm leading-relaxed">{question.subtitle}</p>
        )}
      </div>

      <div className="py-2">
        {/* 2. Single Choice Question */}
        {question.type === 'single-choice' && question.options && (
          <div className="grid grid-cols-1 gap-3">
            {question.options.map((option, index) => {
              const isSelected = answer === option
              return (
                <motion.button
                  key={option}
                  onClick={() => {
                    onChange(option)
                    setTimeout(() => onNext(), 300)
                  }}
                  whileHover={{ scale: 1.01, y: -1 }}
                  whileTap={{ scale: 0.99 }}
                  className={`group relative w-full text-left p-4 rounded-xl border transition-all duration-300 flex items-center justify-between gap-4 cursor-pointer ${
                    isSelected
                      ? 'border-[#FFC078] bg-[#FFC078]/10 dark:bg-[#FFC078]/5'
                      : 'border-border/60 hover:border-border hover:bg-secondary/40'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span
                      className={`w-6 h-6 rounded-full border text-xs font-semibold flex items-center justify-center transition-colors duration-300 ${
                        isSelected
                          ? 'border-[#FFC078] bg-[#FFC078] text-black'
                          : 'border-border/80 text-muted-foreground bg-card'
                      }`}
                    >
                      {index + 1}
                    </span>
                    <span
                      className={`text-sm md:text-base font-medium transition-colors ${
                        isSelected ? 'text-foreground font-semibold' : 'text-muted-foreground group-hover:text-foreground'
                      }`}
                    >
                      {option}
                    </span>
                  </div>

                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                      isSelected
                        ? 'border-[#FFC078] bg-[#FFC078] scale-100'
                        : 'border-border scale-75 opacity-0 group-hover:opacity-100'
                    }`}
                  >
                    <Check className={`w-3.5 h-3.5 ${isSelected ? 'text-black' : 'text-muted-foreground'}`} />
                  </div>
                </motion.button>
              )
            })}
            <div className="text-right text-[10px] text-muted-foreground italic mt-1">
              Tip: Press keyboard keys 1-{question.options.length} to select and auto-advance.
            </div>
          </div>
        )}

        {/* 3. Multiple Choice Question */}
        {question.type === 'multiple-choice' && question.options && (
          <div className="grid grid-cols-1 gap-3">
            {question.options.map((option) => {
              const selectedArray = Array.isArray(answer) ? answer : []
              const isSelected = selectedArray.includes(option)

              const handleToggle = () => {
                if (isSelected) {
                  onChange(selectedArray.filter((item) => item !== option))
                } else {
                  onChange([...selectedArray, option])
                }
              }

              return (
                <motion.button
                  key={option}
                  onClick={handleToggle}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className={`group w-full text-left p-4 rounded-xl border transition-all duration-300 flex items-center justify-between gap-4 cursor-pointer ${
                    isSelected
                      ? 'border-[#FFC078] bg-[#FFC078]/10 dark:bg-[#FFC078]/5'
                      : 'border-border/60 hover:border-border hover:bg-secondary/40'
                  }`}
                >
                  <span
                    className={`text-sm md:text-base font-medium transition-colors ${
                      isSelected ? 'text-foreground font-semibold' : 'text-muted-foreground group-hover:text-foreground'
                    }`}
                  >
                    {option}
                  </span>

                  <div
                    className={`w-5.5 h-5.5 rounded-md border flex items-center justify-center transition-all duration-200 ${
                      isSelected
                        ? 'border-[#FFC078] bg-[#FFC078]'
                        : 'border-border bg-card group-hover:border-muted-foreground'
                    }`}
                  >
                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                        >
                          <Check className="w-4 h-4 text-black stroke-[3]" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.button>
              )
            })}
          </div>
        )}

        {/* 4. Rating Question (1-10) */}
        {question.type === 'rating' && (
          <div className="space-y-6 py-4">
            <div className="flex flex-wrap justify-between gap-2.5">
              {Array.from({ length: (question.max || 10) - (question.min || 1) + 1 }).map((_, idx) => {
                const score = (question.min || 1) + idx
                const isSelected = answer === score
                const isHoveredOrSelected = answer !== undefined && answer >= score

                return (
                  <motion.button
                    key={score}
                    type="button"
                    onClick={() => onChange(score)}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    className={`w-10 h-10 md:w-12 md:h-12 rounded-full border text-sm md:text-base font-bold flex items-center justify-center transition-all duration-300 cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-br from-[#FFC078] to-[#DA9646] border-[#FFC078] text-black shadow-lg shadow-orange-500/20'
                        : isHoveredOrSelected
                        ? 'border-[#FFC078]/60 bg-[#FFC078]/10 text-[#DA9646] dark:text-[#FFC078]'
                        : 'border-border/60 hover:border-border hover:bg-secondary/40 text-muted-foreground'
                    }`}
                  >
                    {score}
                  </motion.button>
                )
              })}
            </div>

            <div className="flex justify-between text-xs font-semibold text-muted-foreground px-1">
              <span>{question.minLabel || 'Min'}</span>
              <span>{question.maxLabel || 'Max'}</span>
            </div>
          </div>
        )}

        {/* 5. Slider Question */}
        {question.type === 'slider' && (
          <div className="space-y-6 py-6 px-1">
            <div className="relative">
              {/* Floating value bubble */}
              <div className="flex justify-center mb-6">
                <motion.span
                  key={answer}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="px-4 py-2 rounded-full bg-gradient-to-r from-[#FFC078] to-[#DA9646] text-black text-sm font-bold shadow-md"
                >
                  {answer ?? 0}%
                </motion.span>
              </div>

              <input
                type="range"
                min={question.min ?? 0}
                max={question.max ?? 100}
                value={answer ?? 0}
                onChange={(e) => onChange(parseInt(e.target.value))}
                className="w-full h-2 bg-secondary dark:bg-[#1f2937] rounded-lg appearance-none cursor-pointer accent-[#DA9646] focus:outline-none focus:ring-2 focus:ring-[#FFC078]/50"
                style={{
                  background: `linear-gradient(to right, #DA9646 0%, #DA9646 ${answer ?? 0}%, var(--input) ${answer ?? 0}%, var(--input) 100%)`,
                }}
              />
            </div>

            <div className="flex justify-between text-xs font-semibold text-muted-foreground">
              <span>{question.minLabel || '0%'}</span>
              <span>{question.maxLabel || '100%'}</span>
            </div>
          </div>
        )}

        {/* 6. Text Area Question */}
        {question.type === 'textarea' && (
          <div className="space-y-2">
            <textarea
              value={answer || ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder={question.placeholder || 'Your response...'}
              rows={4}
              maxLength={500}
              className="w-full p-4 rounded-xl border border-border/60 bg-card text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-[#FFC078] focus:border-[#FFC078] transition-all duration-300 resize-none text-sm md:text-base flair-focus"
            />
            <div className="flex justify-between text-xs text-muted-foreground px-1">
              <span>Min 10 characters</span>
              <span>{(answer || '').length} / 500 characters</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
