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
    <div className="text-center py-6 space-y-8 print:p-0">
      {/* 1. Self-drawing SVG checkmark and scale animation */}
      <div className="flex flex-col items-center justify-center gap-4">
        <motion.div
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: 'spring',
            stiffness: 200,
            damping: 15,
            delay: 0.1,
          }}
          className="w-20 h-20 rounded-full bg-gradient-to-br from-[#FFC078] to-[#DA9646] flex items-center justify-center shadow-lg shadow-orange-500/20"
        >
          <svg
            className="w-10 h-10 text-black"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="3.5"
          >
            <motion.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{
                delay: 0.4,
                duration: 0.5,
                ease: 'easeInOut',
              }}
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </motion.div>

        <div className="space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            {isSubmitting ? 'Saving...' : submitError ? 'Submission Failed' : 'Response Submitted Successfully!'}
          </h2>
          <p className="text-muted-foreground text-sm max-w-md mx-auto leading-relaxed">
            {isSubmitting 
              ? 'Please wait while we securely store your feedback...' 
              : submitError 
                ? `There was an issue saving to Supabase. ${submitError}` 
                : 'Thank you for participating. Your feedback has been recorded and will be used to shape our digital roadmaps.'}
          </p>
        </div>
      </div>

      {/* 2. Responses Summary Section */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.4 }}
        className="text-left bg-card/60 backdrop-blur-md rounded-2xl border border-border/60 p-5 space-y-4 max-w-xl mx-auto shadow-sm print:border-none print:shadow-none print:bg-transparent"
      >
        <div className="flex items-center justify-between border-b border-border/40 pb-3">
          <h3 className="font-bold text-base text-foreground flex items-center gap-2">
            <span>Summary of Answers</span>
          </h3>
        </div>

        <div className="divide-y divide-border/30 max-h-72 overflow-y-auto pr-1 scroll-container space-y-3.5">
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
                <h4 className="text-xs font-bold text-muted-foreground tracking-wide uppercase mb-1">
                  {q.title}
                </h4>
                <p className="text-sm font-medium text-foreground leading-relaxed break-words">
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
        className="flex flex-wrap items-center justify-center gap-3 pt-4 print:hidden"
      >
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-foreground text-background hover:bg-foreground/90 transition-all font-semibold text-sm cursor-pointer"
        >
          <Home className="w-4 h-4" />
          <span>Restart Survey</span>
        </button>
      </motion.div>


    </div>
  )
}
