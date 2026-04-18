import type { Messages } from './types';

const en: Messages = {
  meta: {
    title: 'Impulso BioCycle — AI for bioremediation | Join the waitlist',
    description:
      'We design microbial consortia with frontier AI to close contaminated sites in months, not decades. Join the waitlist.',
    ogTitle: "Contamination isn't inevitable. It's a problem of applied intelligence.",
    ogDescription:
      'AI that designs the exact bacterial recipe for your contaminant and your site. Waitlist open — first 100 get early access.',
  },
  nav: {
    cta: 'Join the waitlist',
    languageToggle: 'ES',
  },
  hero: {
    kicker: "FOR HSE TEAMS WHO CAN'T WAIT 8 MORE YEARS",
    headlineLine1: "Contamination isn't",
    headlineLine1Accent: 'inevitable.',
    headlineLine2: "It's a problem of",
    headlineLine2Accent: 'applied intelligence.',
    sub: 'We design microbial consortia with frontier AI to close contaminated sites in months, not decades. No €230M plants. No beach capsules. Just real science applied to your specific site.',
    emailPlaceholder: 'you@work.com',
    submit: 'Join',
    submitting: 'Submitting...',
    subCta: 'The first 100 get early access + 50% off on the pilot.',
    counter: 'professionals joined from',
    countriesLabel: 'countries this week',
    errors: {
      invalidEmail: "That email doesn't look valid. Try again.",
      generic: 'Something went wrong. Please try again in a moment.',
    },
    successInline: "You're in. Check your inbox and complete the form.",
  },
  socialProof: {
    publishedIn: 'PUBLISHED IN',
    partnerships: 'PARTNERSHIPS IN DISCUSSION',
  },
  problem: {
    h2: 'The problem costs too much already.',
    stats: [
      { value: '$175B', label: 'Projected US PFAS cleanup cost by 2027' },
      { value: '6 months', label: 'Average in "active monitoring" with no progress' },
      { value: '13%', label: 'Of companies on track with the top 4 ESG regulations' },
    ],
    quote:
      "\"Our contractor charged $2M and the site is still contaminated. The VP asked me for a plan. I don't have one he'll like.\"",
    quoteAttribution: '— HSE Manager, mid-size oil & gas, USA',
    sources:
      'Minnesota Pollution Control 2024 · GAO Superfund Report 2024 · A&M ESG Fatigue Report 2025',
  },
  dream: {
    h2: 'Imagine a world where...',
    body: [
      'A Remediation PM in Houston uploads her site contaminant to a platform.',
      'In 90 seconds she receives:',
    ],
    bullets: [
      'The exact BSL-1 microorganism combination that degrades it',
      'The optimal capsule or bioreactor for her conditions',
      'The week-by-week degradation curve, with calibrated uncertainty',
      'A protocol her team executes without external contractor',
      'Auditable data the EPA accepts',
    ],
    closer:
      'In 90 days the site closes. The VP signs the bonus. The team moves to the next site.',
    tagline: "That's what we're building.",
  },
  how: {
    h2: 'How it works',
    steps: [
      {
        number: '01',
        title: 'Describe',
        body: 'Your contaminant + site conditions (pH, T, salinity, volume).',
      },
      {
        number: '02',
        title: 'AI designs',
        body: 'RFDiffusion 2 + ESM-3 + AlphaGo-style search across 800+ BSL-1 strains.',
      },
      {
        number: '03',
        title: 'Deploy',
        body: 'Get the protocol, the predicted curve, and auditable data.',
      },
    ],
  },
  what: {
    h2: "We don't reinvent the science. We integrate it.",
    intro: 'The best biology models in the world were published between 2024 and 2026:',
    stack: [
      { name: 'AlphaFold 3', label: 'predicts enzyme-substrate affinity', source: 'DeepMind' },
      { name: 'RFDiffusion 2/3', label: 'designs de novo enzymes', source: 'Baker Lab' },
      { name: 'ESM-3', label: 'generative protein language model', source: 'EvolutionaryScale' },
      { name: 'AlphaProteo', label: 'designs binders for novel contaminants', source: 'DeepMind' },
    ],
    moat:
      "Our moat isn't building these models. It's applying them to the problem nobody else attacks: AlphaGo-style combinatorial search across 800+ microorganisms to find the 4 that degrade your contaminant under your conditions. The search space is 10¹² combinations.",
    techBriefLink: 'See technical brief',
  },
  founder: {
    h2: "Who's building this",
    bio: 'Biological Engineer · 8 years in applied bioremediation · 2024 National Biotechnology Prize.',
    quote:
      "\"I started this because in 8 years I've seen enough sites that could have closed in months if the right AI existed to design the recipe. Now I'm building it.\"",
  },
  finalCta: {
    headline: 'Not the next contractor.',
    headlineAccent: 'The next paradigm.',
    sub: 'If you close contaminated sites, we want you on the waitlist. The first 100 get early access + 50% off on the pilot.',
    emailPlaceholder: 'you@work.com',
    submit: 'Join',
    counter1: 'professionals joined.',
    counter2: 'early-access spots left.',
  },
  footer: {
    legal: 'LEGAL',
    contact: 'CONTACT',
    follow: 'FOLLOW',
    latest: 'LATEST',
    privacy: 'Privacy',
    terms: 'Terms',
    cookies: 'Cookies',
    forPartners: 'For partners',
    blog: 'Blog (post-launch)',
    newsletter: 'Newsletter',
    rss: 'RSS',
    copyright:
      '© 2026 Impulso BioCycle. Building in public · Red Bull Basement Colombia alumni.',
  },
  thankYou: {
    title: "You're in!",
    sub: "You'll get weekly build-in-public updates and a heads-up when we open early access.",
    formH2: 'Help us prioritize you: 2 minutes that matter.',
    formIntro:
      "We're a small team manually onboarding the first 100 signups who complete this form. Filling it puts you in that queue — plus early access and 50% off on the pilot.",
    progress: '{n} of {total} questions',
    questions: {
      role: {
        label: "What's your current role?",
        options: {
          hseq_manager: 'HSE Manager / Environmental Director',
          env_engineer: 'HSE Coordinator / Environmental Engineer',
          remediation_pm: 'Remediation Project Manager',
          sustainability_director: 'Sustainability Director / CSO',
          env_consultant: 'Environmental Consultant',
          researcher: 'Researcher / Academic',
          founder: 'Founder / CEO / Investor',
          other: 'Other',
        },
      },
      country: {
        label: 'Which country do you work in?',
        placeholder: 'Select country',
      },
      sector: {
        label: 'Which sector?',
        options: {
          oil_gas: 'Oil & Gas',
          chemicals: 'Chemicals',
          mining: 'Mining',
          water_utilities: 'Water utilities',
          manufacturing: 'Manufacturing',
          agriculture: 'Agriculture',
          textile: 'Textile',
          defense: 'Defense / Military',
          consulting: 'Consulting',
          government: 'Government / Public sector',
          academia: 'Academia',
          other: 'Other',
        },
      },
      pain: {
        label:
          "In one sentence: what's your team's biggest environmental headache right now?",
        placeholder:
          "Example: I have a PCB site that's been open for 3 years and the state EPA wants a plan in 60 days.",
      },
      pastMethods: {
        label: 'In the last 12 months, what have you tried for site remediation?',
        options: {
          traditional_bio:
            'Traditional bioremediation (biostimulation / bioaugmentation)',
          incineration: 'Incineration / landfill disposal',
          chemical: 'Chemical oxidation / physical-chemical treatment',
          excavation: 'Excavation + off-site treatment',
          phyto: 'Phytoremediation',
          natural: 'Monitored natural attenuation',
          nothing: 'Nothing yet — still evaluating options',
          other: 'Other',
        },
      },
      timeline: {
        label: 'When do you need to solve this?',
        options: {
          this_week:
            'This week — I have a regulatory deadline / board request',
          three_months: 'In the next 3 months',
          six_to_twelve: 'In 6–12 months',
          next_year: 'Next fiscal year or later',
          no_timeline: 'No clear timeline yet',
        },
      },
      callIntent: {
        label: 'Would you be open to a 20-minute call this week or next?',
        options: {
          yes_now: 'Yes — send me scheduling options now',
          yes_next_week: 'Yes, but next week',
          keep_posted: 'Not right now, but keep me posted',
          wait_early_access: "I'd rather wait until early access opens",
        },
      },
    },
    submit: 'Submit',
    submitting: 'Submitting...',
    successGreen: {
      h2: 'Thanks for sharing. We want to talk this week.',
      body:
        "Based on what you shared, you fit exactly who we're prioritizing for the first pilots. Pick a time below and I'll send context before the call.",
      cta: 'Schedule 20 min now',
      fallback:
        "If now doesn't work, just reply to the email landing in your inbox in the next 2 hours.",
    },
    successOther: {
      h2: 'Thanks.',
      body:
        "You're now on the priority waitlist. You'll get weekly build-in-public updates, a week's notice before early access opens, and an invitation to the first pilot cohort (~Q3 2026). Reply to the confirmation email if you want anything specific before then.",
    },
  },
};

export default en;
