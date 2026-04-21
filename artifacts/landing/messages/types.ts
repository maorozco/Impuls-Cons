/**
 * Messages shape — central type for all locale dictionaries.
 * Lives separately so es.ts and en.ts both implement it identically without literal-narrowing.
 */

export type StackItem = {
  name: string;
  label: string;
  source: string;
  status: string;
};
export type StatItem = { value: string; label: string };
export type StepItem = { number: string; title: string; body: string };
export type SolutionCard = {
  icon: string;
  title: string;
  body: string;
  badge: string;
};
export type FounderMember = {
  name: string;
  initial: string;
  bio: string;
  quote: string;
};

export type Messages = {
  meta: {
    title: string;
    description: string;
    ogTitle: string;
    ogDescription: string;
  };
  nav: {
    cta: string;
    languageToggle: string;
  };
  hero: {
    kicker: string;
    headlineLine1: string;
    headlineLine1Accent: string;
    headlineLine2: string;
    headlineLine2Accent: string;
    sub: string;
    emailPlaceholder: string;
    submit: string;
    submitting: string;
    subCta: string;
    counterPrefix: string;
    counter: string;
    countriesLabel: string;
    errors: {
      invalidEmail: string;
      generic: string;
    };
    successInline: string;
  };
  socialProof: {
    publishedIn: string;
  };
  problem: {
    h2Prefix: string;
    h2Accent: string;
    h2Suffix: string;
    stats: StatItem[];
  };
  video: {
    h2: string;
    h2Accent: string;
    placeholderLabel: string;
  };
  dream: {
    h2: string;
    body: string[];
    bullets: string[];
    closer: string;
    tagline: string;
  };
  whatYouGet: {
    intro: string;
    subtitle: string;
    bullets: string[];
  };
  solutions: {
    tagline: string;
    h2: string;
    cards: SolutionCard[];
  };
  how: {
    h2: string;
    steps: StepItem[];
  };
  what: {
    h2: string;
    intro: string;
    stack: StackItem[];
    moat: string;
    techBriefLink: string;
  };
  founder: {
    h2: string;
    members: FounderMember[];
  };
  alliances: {
    h2: string;
    nationalLabel: string;
    nationalItems: string[];
    internationalLabel: string;
    internationalItems: string[];
    disclaimer: string;
  };
  finalCta: {
    headline: string;
    headlineAccent: string;
    sub: string;
    fine: string;
    emailPlaceholder: string;
    submit: string;
    counter1: string;
    counter2: string;
  };
  footer: {
    legal: string;
    contact: string;
    follow: string;
    latest: string;
    privacy: string;
    terms: string;
    cookies: string;
    forPartners: string;
    blog: string;
    newsletter: string;
    rss: string;
    copyright: string;
  };
  thankYou: {
    title: string;
    sub: string;
    formH2: string;
    formIntro: string;
    progress: string;
    questions: {
      role: { label: string; options: Record<string, string> };
      country: { label: string; placeholder: string };
      sector: { label: string; options: Record<string, string> };
      pain: { label: string; placeholder: string };
      pastMethods: { label: string; options: Record<string, string> };
      timeline: { label: string; options: Record<string, string> };
      callIntent: { label: string; options: Record<string, string> };
    };
    submit: string;
    submitting: string;
    successGreen: {
      h2: string;
      body: string;
      cta: string;
      fallback: string;
    };
    successOther: {
      h2: string;
      body: string;
    };
  };
};
