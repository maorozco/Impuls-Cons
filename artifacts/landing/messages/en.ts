import type { Messages } from './types';

const en: Messages = {
  meta: {
    title: "Impulso BioCycle — Waste management doesn't have to hurt anymore",
    description:
      "We're building the AI that designs the exact microbial consortium for each site. Integrating multi-agent AI systems and science published between 2024 and 2026. Join the first 100.",
    ogTitle: "Waste management doesn't have to hurt anymore",
    ogDescription:
      'Not another consulting firm — the AI that designs the exact microbial recipe for your contaminant and your site. Waitlist open for the first 100.',
  },
  nav: {
    cta: 'Join the waitlist',
    languageToggle: 'ES',
  },
  hero: {
    kicker: 'IMPULSO BIOCYCLE · WAITLIST OPEN',
    headlineLine1: 'Waste management is still a headache.',
    headlineLine1Accent: '',
    headlineLine2: 'Your contractor has been at it 3 years and',
    headlineLine2Accent: 'the site is still contaminated.',
    sub: "We're not launching another consulting firm. We're building the AI that designs the exact microbial consortium for each site — integrating multi-agent AI systems and the science published between 2024 and 2026. The product is currently being validated. The first 100 see it born from the inside.",
    emailPlaceholder: 'you@work.com',
    submit: 'Join',
    submitting: 'Submitting...',
    subCta:
      'Reserved for those who believe science can close what contractors left open.',
    counter: 'professionals joined from',
    countriesLabel: 'countries this week',
    errors: {
      invalidEmail: "That email doesn't look valid. Try again.",
      generic: 'Something went wrong. Please try again in a moment.',
    },
    successInline: "You're in. Check your inbox and complete the form.",
  },
  socialProof: {
    publishedIn:
      'Simulation based on peer-reviewed scientific articles published in:',
  },
  problem: {
    h2Prefix: "Today's problem ",
    h2Accent: 'already',
    h2Suffix: " costs too much. It doesn't have to stay this way.",
    stats: [
      {
        value: '79%',
        label:
          'of global waste is NOT properly managed (UNEP). It ends up in landfills or released into the environment.',
      },
      {
        value: '80%',
        label:
          'of global industrial wastewater is discharged without adequate treatment, contaminating rivers, lakes and oceans (UNESCO).',
      },
      {
        value: '33%',
        label:
          "of the planet's soils are degraded by chemical contamination, pesticides and unsustainable practices (FAO).",
      },
      {
        value: '$47M+',
        label:
          "USD in average annual environmental fines in Colombia. Companies pay up to 100,000 SMMLV for non-compliance (Law 2387/2024).",
      },
    ],
  },
  video: {
    h2: "Why we're building this (and why it can't wait)",
    placeholderLabel: 'Video coming soon',
  },
  dream: {
    h2: 'Imagine a world where...',
    body: [
      'A Remediation PM in Houston uploads her site contaminant to a platform.',
      'In 90 seconds she gets the exact recipe for her case.',
    ],
    bullets: [],
    closer:
      'In 90 days the site closes. The VP signs the bonus. The team moves to the next site.',
    tagline: "That's what we're building.",
  },
  whatYouGet: {
    intro:
      'In 90 seconds, with a single click after entering YOUR specific contaminant and the specific conditions of YOUR environment into the platform.',
    subtitle: 'You receive:',
    bullets: [
      'The exact combination of BSL-1 microorganisms (human-safe) that degrade it.',
      'The optimal capsule or bioreactor for your conditions.',
      'The week-by-week degradation curve, with calibrated uncertainty.',
      'An execution protocol and the success percentage.',
      'Cost comparison of conventional processes vs bioremediation.',
      'Recommendations based on the specific conditions of your environment.',
      'Regulatory support information.',
      'Up-to-date information backed by scientific and field reports for YOUR specific case.',
    ],
  },
  solutions: {
    h2: 'Three ways to join the change:',
    cards: [
      {
        icon: '🔬',
        title: 'Discoveries',
        body: 'Find the latest bioremediation strategies by waste type. Constant updates with papers published worldwide.',
        badge: 'For everyone',
      },
      {
        icon: '🧬',
        title: 'Design your own consortium',
        body: 'Simulation platform for labs and producers of bioremediation products. Design custom consortia with AI and verify inter-species compatibility.',
        badge: 'For labs and producers',
      },
      {
        icon: '🏭',
        title: 'Manage your waste',
        body: 'For industries that want to handle their own waste. Finished product with success rate for your industry type and specific conditions. Solution ready to deploy.',
        badge: 'For enterprises and industries',
      },
    ],
  },
  how: {
    h2: 'How it works',
    steps: [
      {
        number: '01',
        title: 'Describe',
        body: 'Your contaminant + site conditions (pH, temperature, salinity, volume, medium type).',
      },
      {
        number: '02',
        title: 'AI designs',
        body: 'Our Machine Learning model analyzes 800+ catalogued BSL-1 microorganisms, verifies inter-species compatibility, and designs the optimal consortium with success prediction based on peer-reviewed papers.',
      },
      {
        number: '03',
        title: 'Receive your complete solution',
        body: 'Designed consortium with specific microorganisms and optimized ratios. Capsule formulation or bioreactor configuration. Week-by-week predicted degradation curve. Step-by-step execution protocol. Calibrated success percentage. Cost comparison vs conventional methods. Recommendations based on your environment. Applicable regulatory information. All backed by published science.',
      },
    ],
  },
  what: {
    h2: "We don't reinvent the science. We integrate it.",
    intro:
      'The best biology models in the world were published between 2024 and 2026.',
    stack: [
      {
        name: 'AlphaFold 3',
        label: 'Predicts 3D protein structure and enzyme-substrate affinity',
        source: 'DeepMind',
        status: 'Open source',
      },
      {
        name: 'RFDiffusion 2',
        label: 'Designs proteins and enzymes de novo with generative diffusion',
        source: 'Baker Lab, U. Washington',
        status: 'Open source on GitHub',
      },
      {
        name: 'ESM-3',
        label: 'Generative protein language model',
        source: 'EvolutionaryScale',
        status: 'Available via API',
      },
      {
        name: 'Gradient Boosting + PINN',
        label:
          'Our own degradation prediction model trained with data from real papers',
        source: 'Impulso BioCycle',
        status: 'Proprietary model',
      },
    ],
    moat:
      'Our moat is not building these models. It is applying them to the problem nobody else attacks — delivering intelligent information on 800+ microorganisms to find the perfect match that degrades your contaminant under your conditions. The search space is 10¹² combinations. Our AI navigates it in seconds.',
    techBriefLink: 'See technical brief',
  },
  founder: {
    h2: "Who's building this",
    members: [
      {
        name: 'Manuela Orozco',
        initial: 'M',
        bio: 'Biological Engineer and Analytics Engineer. 5 years searching for science as a solution for a better world.',
        quote:
          '"I started this because I couldn\'t find a better moment for science and technology to come together to find what humanity has been searching for so long."',
      },
      {
        name: 'Justin Jiménez',
        initial: 'J',
        bio: 'Data Engineer / AI Engineer. ~5 years building data systems at scale.',
        quote:
          '"After working with industry giants like Disney, AT&T and the national government, I understood how data can drive real change for our planet — if we use it strategically."',
      },
    ],
  },
  alliances: {
    h2: "Who we're building with",
    nationalLabel: 'National',
    nationalItems: [
      'MinCiencias Colombia',
      'ANLA',
      'iNNpulsa Colombia',
      'Universidad Nacional de Colombia',
      'Universidad de los Andes',
      'Pontificia Universidad Javeriana',
      'Universidad de Antioquia',
      'BogotaBio',
    ],
    internationalLabel: 'International',
    internationalItems: [
      'UNEP',
      'EPA (USA)',
      'Addgene (MIT)',
      'BRENDA (Germany)',
      'CONICET (Argentina)',
      'CONACYT (Mexico)',
      'Horizon Europe (EU)',
      'Red Bull Basement 2026',
    ],
    disclaimer:
      'Institutions identified as potential allies in outreach phase',
  },
  finalCta: {
    headline: 'Not the next contractor.',
    headlineAccent: 'The next paradigm.',
    sub: "The first 100 aren't customers. They're the ones shaping how this is born. Join before we close the circle.",
    fine: 'The first 100 receive detailed information about this system and access to the pilot.',
    emailPlaceholder: 'you@work.com',
    submit: 'I want to be part of the change',
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
      body: "Based on what you shared, you fit exactly who we're prioritizing for the first pilots. Pick a time below and I'll send context before the call.",
      cta: 'Schedule 20 min now',
      fallback:
        "If now doesn't work, just reply to the email landing in your inbox in the next 2 hours.",
    },
    successOther: {
      h2: 'Thanks.',
      body: "You're now on the priority waitlist. You'll get weekly build-in-public updates, a week's notice before early access opens, and an invitation to the first pilot cohort (~Q3 2026). Reply to the confirmation email if you want anything specific before then.",
    },
  },
};

export default en;
