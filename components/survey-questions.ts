export interface SurveyQuestion {
  id: string
  type: 'welcome' | 'single-choice' | 'multiple-choice' | 'rating' | 'slider' | 'textarea' | 'text'
  title: string
  subtitle?: string
  placeholder?: string
  options?: string[]
  min?: number
  max?: number
  minLabel?: string
  maxLabel?: string
  required?: boolean
  section?: string
  sectionDescription?: string
}

export interface SurveySection {
  label: string          // e.g. "About You"
  eyebrow: string        // e.g. "Section 1"
  description?: string
  firstStep: number      // index of the section's first question in MOCK_QUESTIONS
  questionIds: string[]
}

/** Derives the survey's sections from question `section` markers. */
export function getSections(questions: SurveyQuestion[] = MOCK_QUESTIONS): SurveySection[] {
  const sections: SurveySection[] = []
  questions.forEach((q, i) => {
    if (q.section) {
      // "SECTION 1: About You" -> label "About You"
      const label = q.section.includes(':') ? q.section.split(':').slice(1).join(':').trim() : q.section.trim()
      sections.push({
        label: label || q.section,
        eyebrow: `Section ${sections.length + 1}`,
        description: q.sectionDescription,
        firstStep: i,
        questionIds: [q.id],
      })
    } else if (q.type !== 'welcome' && sections.length) {
      sections[sections.length - 1].questionIds.push(q.id)
    }
  })
  return sections
}

/** Index of the section that a given step belongs to, or -1 (e.g. the welcome step). */
export function getActiveSectionIndex(sections: SurveySection[], step: number): number {
  let active = -1
  sections.forEach((s, i) => {
    if (s.firstStep <= step) active = i
  })
  return active
}

export const MOCK_QUESTIONS: SurveyQuestion[] = [
  {
    id: 'welcome',
    type: 'welcome',
    title: 'Product Research Survey',
    subtitle: 'Help us understand your everyday pain points and what you need from technology.',
  },
  {
    id: 'q1',
    type: 'single-choice',
    title: 'What everyday task takes more of your time than you think it should?',
    options: [
      'Commuting and sitting in traffic',
      'Power management (switching generators, buying fuel)',
      'Physical banking chores or resolving transaction failures',
      'Sourcing clean water or managing domestic utilities',
      'Grocery shopping and market runs',
      'Others',
    ],
    required: true,
  },
  {
    id: 'q2',
    type: 'single-choice',
    title: 'What service do you find unnecessarily difficult to access in Nigeria?',
    options: [
      "Government documentation (Passport, NIN, driver's license, business registration)",
      'Fast and reliable public healthcare',
      'Affordable, consistent high-speed internet',
      'Credit, loans, or formal business financing',
      'Structured public transport systems',
      'Others',
    ],
    required: true,
  },
  {
    id: 'q3',
    type: 'single-choice',
    title: 'What is something you regularly spend money on that you believe is overpriced?',
    options: [
      'Fuel and electricity',
      'Mobile data and internet subscriptions',
      'Logistics, shipping, and delivery fees',
      'Groceries and essential household items',
      'Rent and upfront property maintenance fees',
      'Others',
    ],
    required: true,
  },
  {
    id: 'q4',
    type: 'single-choice',
    title: 'What is one thing you wish businesses or service providers in Nigeria did better?',
    options: [
      'Customer service responsiveness and empathy',
      'Honesty in pricing (no hidden fees or uncommunicated changes)',
      'Adherence to delivery timelines and promises',
      'Reliable product quality control',
      'Seamless digital payment options',
      'Others',
    ],
    required: true,
  },
  {
    id: 'q5',
    type: 'single-choice',
    title: 'What has been your most frustrating experience with a digital product or service?',
    options: [
      'Money debited for a failed transaction that took days to reverse',
      'App crashing or freezing during a critical task',
      'Poor customer support when a system error occurred',
      'Complicated user interfaces that are hard to navigate',
      'Frequent downtime or unscheduled maintenance hours',
      'Others',
    ],
    required: true,
  },
  {
    id: 'q6',
    type: 'single-choice',
    title: 'What makes you stop using an app after initially downloading it?',
    options: [
      'Too many bugs, crashes, or slow loading times',
      'Intrusive ads or constant, irrelevant notifications',
      'Asking for too much personal information or complex registrations upfront',
      'Large app size that consumes too much phone storage',
      'The app did not actually solve the problem it promised to',
      'Others',
    ],
    required: true,
  },
  {
    id: 'q7',
    type: 'single-choice',
    title: 'What makes you continue using an app for a long period of time?',
    options: [
      'It is lightning-fast and works reliably every time',
      'Clear, simple, and clean visual design',
      'Excellent customer rewards, discounts, or tangible utility',
      'Offline functionality or low data consumption',
      'Exceptional customer support built right into the app',
      'Others',
    ],
    required: true,
  },
  {
    id: 'q8',
    type: 'single-choice',
    title: 'What industry is your business in, and what stage are you at?',
    options: [
      'Industry: Retail/E-commerce | Stage: Idea or Early-stage startup',
      'Industry: Tech/Digital Services | Stage: Scaling or Growth',
      'Industry: Agriculture/Agrotech | Stage: Established brand',
      'Industry: Logistics/Supply Chain | Stage: Idea or Early-stage startup',
      'Industry: Hospitality/Food/Entertainment | Stage: Scaling or Growth',
      'Others',
    ],
    required: true,
  },
  {
    id: 'q9',
    type: 'single-choice',
    title: 'What software tools or systems do you currently rely on to run your business?',
    options: [
      'Basic spreadsheets (Excel, Google Sheets) and WhatsApp Business',
      'Standard accounting software (Wave, QuickBooks, Zoho)',
      'Social media platforms only (Instagram, Facebook Marketplace)',
      'Custom-built internal software or ERP systems',
      'No software tools; we rely entirely on physical ledgers and paper notebooks',
    ],
    required: true,
  },
  {
    id: 'q10',
    type: 'single-choice',
    title: 'On a scale of 1\u20135, how well do your current tools meet your needs?',
    options: [
      '1 \u2014 Poorly (They cause more problems than they solve)',
      '2 \u2014 Barely (We constantly have to use manual workarounds)',
      '3 \u2014 Moderately (They work, but we are outgrowing them fast)',
      '4 \u2014 Well (They do the job with only minor issues)',
      '5 \u2014 Exceptionally (They handle everything perfectly)',
    ],
    required: true,
  },
  {
    id: 'q11',
    type: 'single-choice',
    title: "What's the single biggest operational or technical bottleneck slowing your business down right now?",
    options: [
      'Manual data entry and repetitive paperwork',
      'Slow payment reconciliation and tracking customer transfers',
      'Inventory mismatches and stock tracking errors',
      'Poor team communication or lack of task accountability',
      'Unreliable internet and power infrastructure affecting tool usage',
      'Others',
    ],
    required: true,
  },
  {
    id: 'q12',
    type: 'single-choice',
    title: "Have you ever lost time, money, or customers because of a tool or system that didn't work?",
    options: [
      'Yes, a payment gateway failure caused customers to abandon their carts.',
      'Yes, a spreadsheet error led to wrong pricing or inventory stockouts.',
      'Yes, system downtime prevented us from fulfilling orders on time.',
      'Yes, a data sync error caused us to lose critical client records.',
      'No, we have never experienced major losses due to our tools.',
      'Others',
    ],
    required: true,
  },
  {
    id: 'q13',
    type: 'single-choice',
    title: 'What manual, repetitive tasks are you or your team doing that you wish were automated?',
    options: [
      'Sending payment reminders and invoice receipts to customers',
      'Updating stock levels across different sales channels',
      'Reconciling daily bank transfers with sales records',
      'Copying customer shipping details onto delivery labels',
      'Generating weekly or monthly financial and performance reports',
      'Others',
    ],
    required: true,
  },
  {
    id: 'q14',
    type: 'single-choice',
    title: 'Have you previously looked into building custom software to solve any of these problems? What stopped you?',
    options: [
      'Budget constraints (The development quotes were too high)',
      "Technical knowledge gaps (We didn't know how to screen or manage developers)",
      "Unclear ROI (We weren't sure if the tool would actually save us money)",
      'Time constraints (Building software takes too long; we needed a fix immediately)',
      "Never looked into it; we didn't know custom software was a viable option for us",
      'Others',
    ],
    required: true,
  },
  {
    id: 'q15',
    type: 'single-choice',
    title: 'If a solution existed that solved your top pain point, how much would that be worth to your business?',
    options: [
      'Under \u20a6100,000 per month (or a small one-time fee)',
      '\u20a6100,000 \u2013 \u20a6500,000 per month',
      '\u20a6500,000 \u2013 \u20a61,000,000 per month',
      'Over \u20a61,000,000 per month',
      'Unsure; depends entirely on verified cost savings',
    ],
    required: true,
  },
  {
    id: 'q16',
    type: 'single-choice',
    title: 'How urgently do you need a solution?',
    options: [
      'Extremely urgent (It is costing us money, time, or customers every week)',
      'Moderately urgent (It is a growing headache we need fixed in the coming months)',
      'Nice to have someday (We can manage fine without it for now)',
      'Not a priority at all',
    ],
    required: true,
  },
  {
    id: 'q17',
    type: 'single-choice',
    title: 'Who would be using this software day-to-day?',
    options: [
      'Just me (the business owner)',
      'My internal team or staff members only',
      'Our external customers or clients only',
      'Both our internal team and our customers',
      'Our field agents, delivery drivers, or suppliers',
    ],
    required: true,
  },
  {
    id: 'q18',
    type: 'single-choice',
    title: 'What would make you trust a software development company enough to hand them a project?',
    options: [
      'Seeing a strong portfolio of live, functional apps they have built',
      'Direct referrals or word-of-mouth recommendations from trusted peers',
      'Deep technical experience in my specific industry',
      'Absolute pricing transparency with no hidden costs',
      'Clear milestones with a "no-fix, no-fee" or money-back guarantee',
    ],
    required: true,
  },
  {
    id: 'q19',
    type: 'single-choice',
    title: "What's one past experience you've had working with developers that shaped your current approach?",
    options: [
      'Bad experience: The developer disappeared mid-project or missed deadlines repeatedly.',
      'Bad experience: The final product had too many bugs and did not match what we discussed.',
      'Bad experience: Ghost costs kept appearing after the project started.',
      'Good experience: The developer communicated clearly, delivered on time, and offered great post-launch support.',
      'No experience: We have never hired or worked with developers before.',
    ],
    required: true,
  },
]
