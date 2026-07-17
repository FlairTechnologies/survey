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
}

export const MOCK_QUESTIONS: SurveyQuestion[] = [
  {
    id: 'welcome',
    type: 'welcome',
    title: 'Digital Transformation & Collaboration Survey',
    subtitle: 'Help us understand your workspace needs and technological challenges. This survey takes about 2 minutes to complete.',
  },
  {
    id: 'stage',
    type: 'single-choice',
    title: "How would you describe your company's stage of digital maturity?",
    subtitle: 'Select the option that best represents your current internal operations.',
    options: [
      'Early-stage (Ad-hoc manual processes & spreadsheet dependency)',
      'Growing (Basic tools adopted, but systems feel disconnected)',
      'Mature (Standardized digital processes & cloud-centric solutions)',
      'Enterprise-grade (Custom integrated workflows, telemetry, & AI integration)',
    ],
    required: true,
  },
  {
    id: 'solutions',
    type: 'multiple-choice',
    title: 'Which digital solutions are you interested in implementing?',
    subtitle: 'Select all solutions that align with your roadmap over the next 12 months.',
    options: [
      'Generative AI / ML Automation Agents',
      'Custom Enterprise Platforms & ERPs',
      'Dynamic Customer-Facing Web & Mobile Apps',
      'Cloud Infrastructure Scaling & Cost Optimization',
      'Real-Time Team Collaboration & Telemetry Dashboards',
    ],
    required: false,
  },
  {
    id: 'ai-importance',
    type: 'rating',
    title: 'How critical is AI adoption to your business goals over the next year?',
    subtitle: 'Rate the urgency and importance from 1 (Not Critical) to 10 (Extremely Critical).',
    min: 1,
    max: 10,
    minLabel: 'Not Critical',
    maxLabel: 'Extremely Critical',
    required: true,
  },
  {
    id: 'automation-percent',
    type: 'slider',
    title: 'What percentage of your daily operational tasks are currently automated?',
    subtitle: 'Drag the slider to estimate the automation level in your team.',
    min: 0,
    max: 100,
    minLabel: 'Fully Manual (0%)',
    maxLabel: 'Fully Automated (100%)',
    required: true,
  },
  {
    id: 'challenges',
    type: 'textarea',
    title: 'What is the single biggest technological challenge your team currently faces?',
    subtitle: 'Please share any specific bottlenecks, integration issues, or resource constraints.',
    placeholder: 'Type your response here... (min 10 characters)',
    required: false,
  },
]
