'use client'

import React, { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Check, Sparkles } from 'lucide-react'
import { SurveyQuestion } from './survey-questions'

interface SurveyStepRendererProps {
  question: SurveyQuestion
  answer: any
  onChange: (value: any) => void
  onNext: (overrideAnswer?: any) => void
  questionNumber: number // 1-based position among real questions (welcome = 0)
  totalQuestions: number
}

export default function SurveyStepRenderer({
  question,
  answer,
  onChange,
  onNext,
  questionNumber,
  totalQuestions,
}: SurveyStepRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (question.type === 'textarea' || question.type === 'text') {
      const input = containerRef.current?.querySelector('textarea, input') as HTMLElement
      if (input) input.focus()
    }
  }, [question.id, question.type])

  // Hotkeys 1-9 for single-choice
  useEffect(() => {
    if (question.type !== 'single-choice' || !question.options) return
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return
      const keyNum = parseInt(e.key)
      if (keyNum >= 1 && keyNum <= question.options!.length) {
        const option = question.options![keyNum - 1]
        onChange(option)
        setTimeout(() => onNext(option), 280)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [question, onChange, onNext])

  // ---- Welcome hero ----
  if (question.type === 'welcome') {
    return (
      <div className="flex flex-col gap-7">
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 16 }}
          className="flex h-14 w-14 items-center justify-center rounded-2xl flair-gradient shadow-float"
        >
          <Sparkles className="h-6 w-6 text-black" />
        </motion.div>

        <div className="space-y-4">
          <h1 className="text-[2rem] sm:text-4xl md:text-[3.1rem] font-extrabold leading-[1.08] tracking-tight text-foreground text-balance">
            {question.title}
          </h1>
          <p className="max-w-md text-base leading-relaxed text-muted-foreground">
            {question.subtitle}
          </p>
        </div>

        <motion.button
          onClick={onNext}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="group mt-1 flex w-full max-w-60 items-center justify-center gap-2 rounded-full flair-gradient px-6 py-3 text-sm font-bold text-black shadow-soft transition-shadow duration-300 hover:shadow-float cursor-pointer flair-focus"
        >
          Get started
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </motion.button>

        <p className="text-xs text-muted-foreground/70">
          Press <kbd className="rounded bg-secondary px-1.5 py-0.5 font-mono font-semibold text-muted-foreground">Enter</kbd> or click to begin
        </p>
      </div>
    )
  }

  // ---- Question ----
  return (
    <div ref={containerRef} className="space-y-7">
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-accent">
          <span className="tabular-nums">{String(questionNumber).padStart(2, '0')}</span>
          <span className="h-px w-6 bg-accent/40" />
          <span className="text-muted-foreground/60">{String(totalQuestions).padStart(2, '0')}</span>
        </div>
        <h2 className="text-2xl md:text-[1.9rem] font-bold leading-[1.2] tracking-tight text-foreground text-balance">
          {question.title}
          {question.required && <span className="ml-1 text-accent">*</span>}
        </h2>
        {question.subtitle && (
          <p className="text-sm leading-relaxed text-muted-foreground">{question.subtitle}</p>
        )}
      </div>

      <div>
        {/* Single choice */}
        {question.type === 'single-choice' && question.options && (
          <div className="grid grid-cols-1 gap-2.5">
            {question.options.map((option, index) => {
              const isSelected = answer === option
              return (
                <motion.button
                  key={option}
                  onClick={() => {
                    onChange(option)
                    setTimeout(() => onNext(option), 280)
                  }}
                  whileTap={{ scale: 0.99 }}
                  className={`group flex w-full items-center justify-between gap-3 rounded-xl border px-3.5 py-3 text-left transition-colors duration-200 cursor-pointer flair-focus ${
                    isSelected
                      ? 'border-primary bg-primary/10 dark:bg-primary/8'
                      : 'border-border/70 hover:border-primary/50 hover:bg-secondary/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border text-[11px] font-bold transition-colors duration-200 ${
                        isSelected
                          ? 'border-primary bg-primary text-black'
                          : 'border-border bg-card text-muted-foreground group-hover:border-primary/50'
                      }`}
                    >
                      {index + 1}
                    </span>
                    <span className={`text-sm transition-colors ${isSelected ? 'font-semibold text-foreground' : 'font-medium text-foreground/80 group-hover:text-foreground'}`}>
                      {option}
                    </span>
                  </div>
                  <div className={`flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full border transition-all ${isSelected ? 'scale-100 border-primary bg-primary' : 'scale-75 border-border opacity-0 group-hover:opacity-100'}`}>
                    <Check className={`h-3 w-3 ${isSelected ? 'text-black' : 'text-muted-foreground'}`} />
                  </div>
                </motion.button>
              )
            })}
            <p className="mt-1 text-right text-[11px] text-muted-foreground/70">
              Tip: press <kbd className="font-mono font-semibold text-muted-foreground">1</kbd>–<kbd className="font-mono font-semibold text-muted-foreground">{question.options.length}</kbd> to choose
            </p>
          </div>
        )}

        {/* Multiple choice */}
        {question.type === 'multiple-choice' && question.options && (
          <div className="grid grid-cols-1 gap-2.5">
            {question.options.map((option) => {
              const selectedArray = Array.isArray(answer) ? answer : []
              const isSelected = selectedArray.includes(option)
              const handleToggle = () =>
                onChange(isSelected ? selectedArray.filter((item) => item !== option) : [...selectedArray, option])
              return (
                <motion.button
                  key={option}
                  onClick={handleToggle}
                  whileTap={{ scale: 0.99 }}
                  className={`group flex w-full items-center justify-between gap-3 rounded-xl border px-3.5 py-3 text-left transition-colors duration-200 cursor-pointer flair-focus ${
                    isSelected
                      ? 'border-primary bg-primary/10 dark:bg-primary/8'
                      : 'border-border/70 hover:border-primary/50 hover:bg-secondary/60'
                  }`}
                >
                  <span className={`text-sm transition-colors ${isSelected ? 'font-semibold text-foreground' : 'font-medium text-foreground/80 group-hover:text-foreground'}`}>
                    {option}
                  </span>
                  <div className={`flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-md border transition-colors duration-200 ${isSelected ? 'border-primary bg-primary' : 'border-border bg-card group-hover:border-primary/50'}`}>
                    <AnimatePresence>
                      {isSelected && (
                        <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}>
                          <Check className="h-3 w-3 stroke-3 text-black" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.button>
              )
            })}
          </div>
        )}

        {/* Rating */}
        {question.type === 'rating' && (
          <div className="space-y-5 py-2">
            <div className="flex flex-wrap justify-between gap-2">
              {Array.from({ length: (question.max || 10) - (question.min || 1) + 1 }).map((_, idx) => {
                const score = (question.min || 1) + idx
                const isSelected = answer === score
                const isBelowOrEqual = answer !== undefined && answer >= score
                return (
                  <motion.button
                    key={score}
                    type="button"
                    onClick={() => onChange(score)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.92 }}
                    className={`flex h-9 w-9 items-center justify-center rounded-lg border text-sm font-bold transition-colors duration-200 cursor-pointer flair-focus ${
                      isSelected
                        ? 'flair-gradient border-primary text-black shadow-soft'
                        : isBelowOrEqual
                        ? 'border-primary/50 bg-primary/10 text-accent dark:text-primary'
                        : 'border-border/70 text-muted-foreground hover:border-primary/50 hover:bg-secondary/60'
                    }`}
                  >
                    {score}
                  </motion.button>
                )
              })}
            </div>
            <div className="flex justify-between px-1 text-xs font-medium text-muted-foreground">
              <span>{question.minLabel || 'Min'}</span>
              <span>{question.maxLabel || 'Max'}</span>
            </div>
          </div>
        )}

        {/* Slider */}
        {question.type === 'slider' && (
          <div className="space-y-5 py-4 px-1">
            <div className="flex justify-center">
              <motion.span
                key={answer}
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="rounded-full flair-gradient px-4 py-1.5 text-sm font-bold text-black shadow-sm"
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
              className="flair-range w-full cursor-pointer flair-focus"
              style={{
                background: `linear-gradient(to right, var(--brand-2) 0%, var(--brand-1) ${answer ?? 0}%, var(--input) ${answer ?? 0}%, var(--input) 100%)`,
              }}
            />
            <div className="flex justify-between text-xs font-medium text-muted-foreground">
              <span>{question.minLabel || '0%'}</span>
              <span>{question.maxLabel || '100%'}</span>
            </div>
          </div>
        )}

        {/* Textarea */}
        {question.type === 'textarea' && (
          <div className="space-y-2">
            <textarea
              value={answer || ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder={question.placeholder || 'Type your answer here…'}
              rows={4}
              maxLength={500}
              className="w-full resize-none rounded-xl border border-border/70 bg-card p-3.5 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground/60 transition-shadow duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/70"
            />
            <div className="flex justify-between px-1 text-xs text-muted-foreground">
              <span>Min 10 characters</span>
              <span>{(answer || '').length} / 500</span>
            </div>
          </div>
        )}

        {/* Text */}
        {question.type === 'text' && (
          <input
            type="text"
            value={answer || ''}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                onNext()
              }
            }}
            placeholder={question.placeholder || 'Type your answer here…'}
            className="w-full rounded-xl border border-border/70 bg-card p-3.5 text-sm text-foreground placeholder:text-muted-foreground/60 transition-shadow duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/70"
          />
        )}
      </div>
    </div>
  )
}
