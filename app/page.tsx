'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, RotateCcw, CheckCircle2 } from 'lucide-react'
import Image from 'next/image'
import { useTheme } from 'next-themes'

import LogoFullDark from '@/public/assets/logo/logo-full-dark.png'
import LogoFullLight from '@/public/assets/logo/logo-full-light.png'
import Logo from '@/public/assets/logo/logo-short.png'

import { ThemeToggle } from '@/components/theme-toggle'
import { MOCK_QUESTIONS } from '@/components/survey-questions'
import SurveyBackground from '@/components/survey-background'
import SurveyProgress from '@/components/survey-progress'
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

  // Validation function for current step
  const validateStep = (overrideAnswer?: any): boolean => {
    if (!currentQuestion) return true
    if (currentQuestion.type === 'welcome') return true

    const answer = overrideAnswer !== undefined ? overrideAnswer : answers[currentQuestion.id]

    // Check if required
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

  // Navigation handlers
  const handleNext = (overrideAnswer?: any) => {
    const val = overrideAnswer && typeof overrideAnswer === 'object' && 'nativeEvent' in overrideAnswer ? undefined : overrideAnswer;
    if (!validateStep(val)) return

    if (currentStep < totalSteps - 1) {
      setDirection(1)
      setCurrentStep((prev) => prev + 1)
    } else {
      // Last step: Submit
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

  // Handle keyboard interaction (Enter / Esc)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isSubmitted) return

      if (e.key === 'Enter' && e.ctrlKey) {
        // Ctrl+Enter or Cmd+Enter to advance
        handleNext()
      } else if (e.key === 'Escape') {
        handleBack()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentStep, answers, isSubmitted])

  // Framer Motion slide transition variants
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 100 : -100,
      opacity: 0,
    }),
  }

  return (
    <main className="min-h-screen relative flex flex-col justify-between">
      <SurveyBackground />

      {/* 1. Header Area */}
      <header className="w-full py-4 border-b border-border/40 bg-background/50 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-2 select-none">
            {mounted && theme === 'dark' ? (
              <Image src={LogoFullDark} alt="Flair Tech Logo" className="w-auto h-12 hidden md:block animate-pulse" />
            ) : (
              <Image src={LogoFullLight} alt="Flair Tech Logo" className="w-auto h-12 hidden md:block" />
            )}
            <Image src={Logo} alt="Flair Tech Logo" className="w-auto h-8 block md:hidden" />
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleReset}
              className="p-2 rounded-full border border-border/60 hover:bg-secondary/40 text-muted-foreground hover:text-foreground transition-all cursor-pointer"
              title="Reset Survey"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* 2. Main Survey Container */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-2xl bg-card/70 dark:bg-card/45 backdrop-blur-xl border border-border/80 dark:border-border/40 rounded-3xl shadow-xl overflow-hidden card-elevated">
          {/* Progress bar (except welcome and submitted page) */}
          {!isSubmitted && currentStep > 0 && (
            <div className="px-6 md:px-8 pt-6">
              <SurveyProgress currentStep={currentStep} totalSteps={totalSteps} />
            </div>
          )}

          <div className="p-6 md:p-10 relative">
            <AnimatePresence mode="wait" custom={direction} initial={false}>
              {isSubmitted ? (
                <motion.div
                  key="completion"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
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
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                >
                  <SurveyStepRenderer
                    question={currentQuestion}
                    answer={answers[currentQuestion.id]}
                    onChange={handleAnswerChange}
                    onNext={handleNext}
                  />

                  {/* Validation Error Alert */}
                  {validationError && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 p-3.5 rounded-xl border border-orange-500/30 bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs font-semibold flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4 text-orange-500 stroke-[3]" />
                      <span>{validationError}</span>
                    </motion.div>
                  )}

                  {/* Navigation footer controls (only for non-welcome questions) */}
                  {currentQuestion.type !== 'welcome' && (
                    <div className="mt-8 flex items-center justify-between border-t border-border/40 pt-6">
                      <button
                        onClick={handleBack}
                        className="flex items-center gap-2 px-5 py-3 rounded-full border border-border/80 hover:border-foreground text-foreground hover:bg-secondary/40 font-semibold text-sm transition-all cursor-pointer"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back</span>
                      </button>

                      <button
                        onClick={handleNext}
                        className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#FFC078] to-[#DA9646] hover:from-[#FFC078]/90 hover:to-[#DA9646]/90 text-black font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer"
                      >
                        <span>{currentStep === totalSteps - 1 ? 'Submit Survey' : 'Next'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* 3. Footer branding */}
      <footer className="w-full py-4 text-center text-xs font-semibold text-muted-foreground/60 border-t border-border/20 bg-background/30 select-none">
        <p>&copy; {new Date().getFullYear()} Flair Technologies. All rights reserved.</p>
      </footer>
    </main>
  )
}
