'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, RotateCcw, AlertCircle } from 'lucide-react'
import Image from 'next/image'
import { useTheme } from 'next-themes'

import LogoFullDark from '@/public/assets/logo/logo-full-dark.png'
import LogoFullLight from '@/public/assets/logo/logo-full-light.png'

import { ThemeToggle } from '@/components/theme-toggle'
import { MOCK_QUESTIONS, getSections, getActiveSectionIndex } from '@/components/survey-questions'
import SurveySidebar from '@/components/survey-sidebar'
import SurveyStepRenderer from '@/components/survey-step-renderer'
import SurveyCompletion from '@/components/survey-completion'

export default function SurveyPage() {
  const [mounted, setMounted] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [direction, setDirection] = useState(1) // 1 = forward, -1 = backward
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)

  const { theme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  const currentQuestion = MOCK_QUESTIONS[currentStep]
  const totalSteps = MOCK_QUESTIONS.length
  const totalQuestions = totalSteps - 1 // exclude welcome

  const sections = useMemo(() => getSections(MOCK_QUESTIONS), [])
  const activeSectionIndex = getActiveSectionIndex(sections, currentStep)
  const progressPercent = isSubmitted
    ? 100
    : totalSteps <= 1
    ? 0
    : Math.min(100, Math.max(0, (currentStep / (totalSteps - 1)) * 100))

  // Validation function for current step
  const validateStep = (overrideAnswer?: any): boolean => {
    if (!currentQuestion) return true
    if (currentQuestion.type === 'welcome') return true

    const answer = overrideAnswer !== undefined ? overrideAnswer : answers[currentQuestion.id]

    if (currentQuestion.required) {
      if (answer === undefined || answer === null || answer === '') {
        setValidationError('This question is required.')
        return false
      }
      if (Array.isArray(answer) && answer.length === 0) {
        setValidationError('Please select at least one option.')
        return false
      }
      if (currentQuestion.type === 'textarea' && String(answer).trim().length < 10) {
        setValidationError('Please type at least 10 characters.')
        return false
      }
    }

    setValidationError(null)
    return true
  }

  const handleNext = (overrideAnswer?: any) => {
    const val = overrideAnswer && typeof overrideAnswer === 'object' && 'nativeEvent' in overrideAnswer ? undefined : overrideAnswer
    if (!validateStep(val)) return

    if (currentStep < totalSteps - 1) {
      setDirection(1)
      setCurrentStep((prev) => prev + 1)
    } else {
      setDirection(1)
      setIsSubmitted(true)
    }
  }

  const handleBack = () => {
    setValidationError(null)
    if (currentStep > 0) {
      setDirection(-1)
      setCurrentStep((prev) => prev - 1)
    }
  }

  const handleAnswerChange = (val: any) => {
    setValidationError(null)
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: val,
    }))
  }

  const handleReset = () => {
    setAnswers({})
    setCurrentStep(0)
    setIsSubmitted(false)
    setValidationError(null)
  }

  // Keyboard: Ctrl/Cmd+Enter advances, Esc goes back
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isSubmitted) return
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        handleNext()
      } else if (e.key === 'Escape') {
        handleBack()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentStep, answers, isSubmitted])

  const slideVariants = {
    enter: (dir: number) => ({ y: dir > 0 ? 24 : -24, opacity: 0 }),
    center: { y: 0, opacity: 1 },
    exit: (dir: number) => ({ y: dir < 0 ? 24 : -24, opacity: 0 }),
  }

  return (
    <main className="min-h-screen lg:grid lg:grid-cols-[24rem_1fr] xl:grid-cols-[27rem_1fr]">
      {/* Branded rail (desktop) */}
      <SurveySidebar
        sections={sections}
        activeSectionIndex={activeSectionIndex}
        progressPercent={progressPercent}
        isSubmitted={isSubmitted}
      />

      {/* Content canvas */}
      <section className="relative flex min-h-screen flex-col bg-background">
        {/* faint canvas texture */}
        <div className="pointer-events-none absolute inset-0 -z-0 bg-[radial-gradient(60%_50%_at_80%_0%,color-mix(in_oklch,var(--brand-1)_10%,transparent),transparent)]" />

        {/* Top bar */}
        <div className="relative z-10 flex items-center justify-between gap-3 px-5 sm:px-8 py-4">
          {/* Mobile logo */}
          <div className="lg:hidden">
            {mounted && theme === 'dark' ? (
              <Image src={LogoFullDark} alt="Flair Technologies" className="h-7 w-auto" />
            ) : (
              <Image src={LogoFullLight} alt="Flair Technologies" className="h-7 w-auto" />
            )}
          </div>
          <div className="hidden lg:block" />

          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-border/70 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground cursor-pointer flair-focus"
              title="Restart survey"
              aria-label="Restart survey"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile progress + section label */}
        {!isSubmitted && (
          <div className="relative z-10 px-5 sm:px-8 pb-2 lg:hidden">
            <div className="mb-1.5 flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              <span>{activeSectionIndex >= 0 ? sections[activeSectionIndex].label : 'Welcome'}</span>
              <span className="text-accent">{Math.round(progressPercent)}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
              <motion.div
                className="h-full rounded-full flair-gradient"
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          </div>
        )}

        {/* Question stage */}
        <div className="relative z-10 flex flex-1 items-center justify-center px-5 sm:px-8 py-8 md:py-12">
          <div className="w-full min-w-0 max-w-xl">
            <AnimatePresence mode="wait" custom={direction} initial={false}>
              {isSubmitted ? (
                <motion.div
                  key="completion"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  <SurveyCompletion questions={MOCK_QUESTIONS} answers={answers} onReset={handleReset} />
                </motion.div>
              ) : (
                <motion.div
                  key={currentQuestion.id}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  <SurveyStepRenderer
                    question={currentQuestion}
                    answer={answers[currentQuestion.id]}
                    onChange={handleAnswerChange}
                    onNext={handleNext}
                    questionNumber={currentStep}
                    totalQuestions={totalQuestions}
                  />

                  {validationError && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-5 flex items-center gap-2 rounded-xl border border-destructive/25 bg-destructive/8 p-3.5 text-xs font-semibold text-destructive"
                    >
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>{validationError}</span>
                    </motion.div>
                  )}

                  {currentQuestion.type !== 'welcome' && (
                    <div className="mt-8 flex items-center justify-between gap-3">
                      <button
                        onClick={handleBack}
                        disabled={currentStep === 0}
                        className="flex items-center gap-1.5 rounded-full px-3 py-2 text-[13px] font-semibold text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flair-focus"
                      >
                        <ArrowLeft className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Back</span>
                      </button>

                      <button
                        onClick={handleNext}
                        className="group flex items-center gap-1.5 rounded-full flair-gradient px-5 py-2.5 text-[13px] font-bold text-black shadow-soft transition-shadow hover:shadow-float cursor-pointer flair-focus"
                      >
                        <span>{currentStep === totalSteps - 1 ? 'Submit survey' : 'Continue'}</span>
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 px-5 sm:px-8 py-4 text-center text-[11px] font-medium text-muted-foreground/60 lg:text-left">
          &copy; {new Date().getFullYear()} Flair Technologies
        </div>
      </section>
    </main>
  )
}
