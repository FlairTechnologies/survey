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

export const MOCK_QUESTIONS: SurveyQuestion[] = [
  {
    id: 'welcome',
    type: 'welcome',
    title: 'Product Research Survey',
    subtitle: 'Help us understand your demographic, tech habits, and the friction in your daily routine.',
  },
  // SECTION 1
  {
    id: 'occupation',
    type: 'single-choice',
    title: 'Which category best describes your current occupation?',
    section: 'SECTION 1: About You',
    sectionDescription: 'Just a quick background to help us understand our demographic and tech habits.',
    options: [
      'Corporate Professional / 9-to-5',
      'Entrepreneur / Business Owner',
      'Freelancer / Remote Tech Worker',
      'Student',
      'Artisan / Blue-collar worker'
    ],
    required: true,
  },
  {
    id: 'industry',
    type: 'text',
    title: 'What industry or field do you work or operate in?',
    placeholder: 'Short Answer',
    required: true,
  },
  {
    id: 'city',
    type: 'text',
    title: 'What city and specific area do you live in? (e.g., Yaba, Lagos; Gwarinpa, Abuja)',
    placeholder: 'Short Answer',
    required: true,
  },
  {
    id: 'age',
    type: 'single-choice',
    title: 'What is your age group?',
    options: [
      '18 - 24',
      '25 - 34',
      '35 - 44',
      '45+'
    ],
    required: true,
  },
  {
    id: 'smartphone',
    type: 'single-choice',
    title: 'What type of smartphone do you primarily use? (Helps us prioritize our app development)',
    options: [
      'Android',
      'iPhone (iOS)'
    ],
    required: true,
  },
  // SECTION 2
  {
    id: 'biggest-expense',
    type: 'single-choice',
    title: 'Outside of rent, which of these takes the biggest chunk of your monthly income?',
    section: 'SECTION 2: Identifying the Friction',
    sectionDescription: 'Help us pinpoint where the biggest headaches are in your daily routine.',
    options: [
      'Transportation / Commuting',
      'Groceries / Food',
      'Power / Fuel for generators',
      'Internet / Data subscriptions'
    ],
    required: true,
  },
  {
    id: 'stress-areas',
    type: 'multiple-choice',
    title: 'Which TWO areas of your daily life cause you the most stress, frustration, or unexpected expenses right now? (Select exactly 2)',
    options: [
      'Daily Commute: Traffic, surge pricing, unsafe/uncomfortable buses.',
      'Cost of Living: Splitting bulk groceries, inflation, power/fuel costs.',
      'Online Trust & Trade: Fear of scams when buying/selling on Instagram/WhatsApp.',
      'Home Services: Finding reliable, honest artisans (plumbers, electricians).',
      'Social Finances: Chasing friends to pay for group events, Aso-ebi, or subscriptions.'
    ],
    required: true,
  },
  {
    id: 'challenge-cost',
    type: 'single-choice',
    title: 'Looking at the areas you just selected, does this challenge cost you more in terms of:',
    options: [
      'Time (Hours wasted)',
      'Money (Overpaying, surge pricing, scams)',
      'Peace of Mind (Anxiety, stress)',
      'All of the above equally'
    ],
    required: true,
  },
  {
    id: 'specific-challenges',
    type: 'textarea',
    title: 'What are the top three specific challenges you face regularly in your work or daily activities regarding these areas?',
    placeholder: 'Paragraph Answer',
    required: true,
  },
  {
    id: 'problem-frequency',
    type: 'single-choice',
    title: 'How often do you experience these problems?',
    options: [
      'Daily',
      'Weekly',
      'Monthly',
      'Rarely'
    ],
    required: true,
  },
  // SECTION 3
  {
    id: 'digital-tools',
    type: 'text',
    title: 'Have you used any digital tools or apps to try and solve these challenges? If yes, which ones?',
    section: 'SECTION 3: Current Solutions & Tech Adoption',
    sectionDescription: 'Tell us how you currently survive these challenges and how you adopt new tech.',
    placeholder: 'Short Answer',
    required: true,
  },
  {
    id: 'tool-dislikes',
    type: 'textarea',
    title: 'What do you dislike most about the tools you currently use?',
    placeholder: 'Paragraph Answer',
    required: true,
  },
  {
    id: 'discovery',
    type: 'single-choice',
    title: 'How do you usually discover new apps or tech solutions in Nigeria?',
    options: [
      'Twitter (X)',
      'Instagram / TikTok',
      'Word of mouth / Referrals from friends',
      'Online Ads'
    ],
    required: true,
  },
  {
    id: 'trust-factor',
    type: 'single-choice',
    title: 'What is the #1 thing that makes you trust a new Nigerian app with your money or personal data?',
    options: [
      'A friend recommended it.',
      'Professional design and bug-free experience.',
      'It requires my BVN/NIN (Makes it feel regulated).',
      'Seeing popular influencers or brands talking about it.'
    ],
    required: true,
  },
  // SECTION 4
  {
    id: 'ideal-product',
    type: 'textarea',
    title: 'If you could have ONE product built to solve your biggest problem, what exactly would it do?',
    section: 'SECTION 4: Your Ideal Product',
    sectionDescription: 'Help us build exactly what you want.',
    placeholder: 'Paragraph Answer',
    required: true,
  },
  {
    id: 'essential-features',
    type: 'textarea',
    title: 'What features would you consider essential in such a product?',
    placeholder: 'Paragraph Answer',
    required: true,
  },
  {
    id: 'try-new-solution',
    type: 'single-choice',
    title: 'Would you be willing to try a new solution if it solved this problem better than your current method?',
    options: [
      'Yes',
      'No',
      'Maybe'
    ],
    required: true,
  },
  {
    id: 'willing-to-pay',
    type: 'single-choice',
    title: 'Would you be willing to pay for such a product?',
    options: [
      'Yes',
      'No',
      'Depends on the exact value/price'
    ],
    required: true,
  },
  {
    id: 'additional-info',
    type: 'textarea',
    title: 'Is there anything else you think we should know before building a solution for you?',
    placeholder: 'Paragraph Answer',
    required: false,
  },
  {
    id: 'contact-info',
    type: 'text',
    title: "(Optional) Leave your email or phone number if you'd like early/free access when we launch.",
    placeholder: 'Short Answer',
    required: false,
  }
]
