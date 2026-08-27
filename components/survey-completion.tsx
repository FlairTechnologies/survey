'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Home } from 'lucide-react'
import { SurveyQuestion } from './survey-questions'
import { supabase } from '@/lib/supabase'

interface SurveyCompletionProps {
  questions: SurveyQuestion[]
  answers: Record<string, any>
  onReset: () => void
}

export default function SurveyCompletion({
  questions,
  answers,
  onReset,
}: SurveyCompletionProps) {
  const [isSubmitting, setIsSubmitting] = useState(true)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const hasSubmitted = useRef(false)

  useEffect(() => {
    if (hasSubmitted.current) return
    hasSubmitted.current = true

    const submitToSupabase = async () => {
      try {
        const { error } = await supabase
          .from('survey_responses')
          .insert([
            { responses: answers }
          ])

        if (error) throw error
      } catch (err: any) {
        console.error('Error submitting survey:', err)
        setSubmitError(err.message || 'Failed to submit response to the database.')
      } finally {
        setIsSubmitting(false)
      }
    }

    submitToSupabase()
  }, [answers])

  // Filter out welcome step and ensure we display valid responses
  const activeQuestions = questions.filter((q) => q.type !== 'welcome')



  return (
    <div className="space-y-7 print:p-0">
      {/* 1. Header */}
      <div className="flex flex-col gap-5">
        <motion.div
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
          className={`flex h-16 w-16 items-center justify-center rounded-2xl shadow-float ${submitError ? 'bg-destructive' : 'flair-gradient'}`}
        >
          {isSubmitting ? (
            <span className="h-6 w-6 animate-spin rounded-full border-2 border-black/25 border-t-black" />
          ) : (
            <svg className={`h-9 w-9 ${submitError ? 'text-white' : 'text-black'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3.5">
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 0.4, duration: 0.5, ease: 'easeInOut' }}
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </motion.div>

        <div className="space-y-2">
          <h2 className="text-3xl md:text-[2.4rem] font-extrabold leading-tight tracking-tight text-foreground">
            {isSubmitting ? 'Saving your responses…' : submitError ? 'We couldn’t save that' : 'All done — thank you!'}
          </h2>
          <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
            {isSubmitting
              ? 'Hang tight while we securely store your feedback.'
              : submitError
                ? `Something went wrong saving your response. ${submitError}`
                : 'Your feedback has been recorded and will directly shape what we build next.'}
          </p>
        </div>
      </div>

      {/* 2. Responses Summary Section */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.4 }}
        className="space-y-4 rounded-2xl border border-border/60 bg-secondary/40 p-5 text-left print:border-none print:bg-transparent print:shadow-none"
      >
        <div className="flex items-center justify-between border-b border-border/50 pb-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Your answers
          </h3>
        </div>

        <div className="scroll-container thin-scroll max-h-72 space-y-3.5 divide-y divide-border/40 overflow-y-auto pr-1.5">
          {activeQuestions.map((q) => {
            const val = answers[q.id]
            let displayVal = 'No response'

            if (val !== undefined && val !== null) {
              if (Array.isArray(val)) {
                displayVal = val.length > 0 ? val.join(', ') : 'None selected'
              } else if (typeof val === 'number') {
                if (q.type === 'slider') {
                  displayVal = `${val}%`
                } else {
                  displayVal = `${val} / ${q.max || 10}`
                }
              } else {
                displayVal = String(val)
              }
            }

            return (
              <div key={q.id} className="pt-3.5 first:pt-0">
                <h4 className="text-[11px] font-semibold text-muted-foreground/80 mb-1 leading-snug">
                  {q.title}
                </h4>
                <p className="text-sm font-semibold text-foreground leading-relaxed break-words">
                  {displayVal}
                </p>
              </div>
            )
          })}
        </div>
      </motion.div>

      {/* 3. Action Buttons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="flex flex-wrap items-center gap-3 pt-1 print:hidden"
      >
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 rounded-full bg-foreground px-5 py-2.5 text-[13px] font-semibold text-background transition-opacity hover:opacity-90 cursor-pointer flair-focus"
        >
          <Home className="h-3.5 w-3.5" />
          <span>Start over</span>
        </button>
      </motion.div>
    </div>
  )
}
