# Impulso BioCycle — Landing + Waitlist

Production-grade Next.js 14 landing page with bilingual EN+ES support, waitlist capture, thank-you discovery form, and Postgres persistence via Drizzle ORM.

Built for **Replit deployment** with Postgres (Neon free tier or Replit Database).

## Stack

- **Next.js 14** App Router · React Server Components + Server Actions
- **TypeScript** strict mode
- **Tailwind CSS** + shadcn-style primitives (no external UI library)
- **Drizzle ORM** + Postgres (`pg` driver)
- **Zod** validation
- **Edge runtime** for OG images
- **Plausible Analytics** optional

## File map

```
artifacts/landing/
├── app/
│   ├── layout.tsx            ← root html/body, font vars, optional Plausible script
│   ├── page.tsx              ← / → redirects to /es
│   ├── globals.css           ← Tailwind base + design tokens (HSL CSS vars)
│   ├── opengraph-image.tsx   ← dynamic OG (Edge runtime)
│   ├── icon.tsx              ← dynamic favicon
│   ├── actions.ts            ← Server Actions: signupForWaitlist, submitWaitlistResponse
│   ├── not-found.tsx
│   └── [lang]/
│       ├── layout.tsx        ← per-locale metadata, hreflang alternates
│       ├── page.tsx          ← landing (composes all sections)
│       └── thank-you/
│           └── page.tsx      ← reads ?email=, renders form
├── components/
│   ├── sections/             ← Nav, Hero, SocialProof, Problem, Dream, How, What, Founder, FinalCta, Footer
│   ├── thank-you-form.tsx    ← 6-question discovery form with progress + scoring
│   └── ui/                   ← Button, Input, Label, Textarea, Progress (shadcn-style)
├── drizzle/
│   └── schema.ts             ← waitlist + waitlist_responses tables
├── lib/
│   ├── db.ts                 ← singleton Drizzle pool
│   ├── i18n.ts               ← locale resolution
│   ├── scoring.ts            ← discovery score → 🟢🟡🔴 tier
│   ├── countries.ts          ← curated country list
│   └── utils.ts              ← cn() helper
├── messages/
│   ├── es.ts                 ← Spanish copy (source of truth)
│   └── en.ts                 ← English copy (typed against es)
├── public/                   ← static assets (founder photo, etc.)
├── package.json
├── next.config.js
├── tailwind.config.ts
├── drizzle.config.ts
├── .replit                   ← Replit config (Nix modules, build/run)
├── replit.nix
└── .env.example
```

## Local development (macOS / Linux)

```bash
cd artifacts/landing

# 1. Install deps (use pnpm if you use it elsewhere; npm works fine)
npm install

# 2. Set DATABASE_URL — easiest is a free Neon project
cp .env.example .env.local
# Edit .env.local with your Neon connection string

# 3. Push schema to your Postgres
npm run db:push

# 4. Run dev server
npm run dev
# → http://localhost:3000  (redirects to /es)
```

## Deploying to Replit

The Streamlit app already lives on Replit. Add this landing as a **separate Repl**:

### Option A — import from GitHub (recommended)

1. Push this `artifacts/landing/` folder to its own GitHub repo (or keep it in the monorepo and use Replit's "Import from GitHub" pointing at the subfolder).
2. On Replit, **Create Repl → Import from GitHub** → paste repo URL.
3. Replit reads `.replit` and provisions Node 20 + Postgres automatically.
4. Open **Secrets** tab and add:
   - `DATABASE_URL` (use Replit's built-in Postgres, click the Database tab and copy the connection string, OR use a Neon free Postgres)
   - `NEXT_PUBLIC_SITE_URL` = your final domain (e.g., `https://biocycle.replit.app` or `https://biocycle.ai`)
   - `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` (optional)
   - `NEXT_PUBLIC_CALENDLY_URL` (optional, for green-tier signups)
5. Open the **Shell** tab and run:
   ```bash
   npm install
   npm run db:push
   ```
6. Click **Run**. Replit serves on port 3000, exposed externally on 80.
7. To deploy production: **Deploy → Autoscale** (recommended for landing pages — scales to zero on no traffic).

### Option B — drag-and-drop the folder

1. On Replit, **Create Repl → Node.js**.
2. Drag `artifacts/landing/` contents into the file tree.
3. Same Secrets + db:push + Run as above.

### Replit Database vs external Postgres

- **Replit Database (built-in)** — key-value only. NOT suitable for our schema (we need queries by tier, score ordering). Skip.
- **Replit Postgres (built-in, paid plans)** — works perfectly with our Drizzle setup. Just paste the connection string.
- **Neon free tier** — 0.5 GB / 1 project free, supports `pg` driver. Recommended for waitlist scale (<50K rows). Sign up at https://neon.tech, create project, copy connection string.

### Custom domain on Replit

Replit Deployments → settings → Custom Domain. Point your DNS A/CNAME at Replit's load balancer. SSL auto-issued via Let's Encrypt.

## Database schema

Two tables (see `drizzle/schema.ts`):

- **`waitlist`** — primary opt-in: email, locale, country, UTM params, user agent, timestamp. Email is unique.
- **`waitlist_responses`** — thank-you survey: email, role, sector, pain text, past methods (jsonb array), timeline, call intent, computed score + tier (green/yellow/red).

Linked by email (not foreign key) so users can fill the form later from a different session.

## Scoring logic

See `lib/scoring.ts`. Score is computed server-side from the form submission:

| Question | Max points |
|---|---|
| Role (HSEQ Manager / Remediation PM / Sustainability Director) | +2 |
| Pain text length + regulatory keywords | +2 |
| Past methods tried (3+) | +2 |
| Timeline (this week) | +3 |
| Call intent (yes now) | +3 |

Tier mapping: ≥5 = 🟢 green · 2–4 = 🟡 yellow · ≤1 = 🔴 red.

🟢 signups see Calendly CTA on success page; others see neutral thank-you with newsletter promise.

## Querying the data

Once you have signups, query directly via Drizzle Studio:

```bash
npm run db:studio
# Opens https://local.drizzle.studio
```

Or write SQL in Replit's Database tab:

```sql
-- Top 10 green-tier signups
SELECT r.email, r.role, r.timeline, r.pain, r.score
FROM waitlist_responses r
WHERE r.tier = 'green'
ORDER BY r.score DESC, r.created_at ASC
LIMIT 10;

-- Signups by country
SELECT country, COUNT(*) AS n
FROM waitlist
GROUP BY country
ORDER BY n DESC;

-- Conversion rate: form completion / total signups
SELECT
  (SELECT COUNT(*) FROM waitlist_responses) * 100.0 /
  NULLIF((SELECT COUNT(*) FROM waitlist), 0)
  AS form_completion_pct;
```

## Customization checklist before launch

- [ ] Replace founder placeholder in `components/sections/founder.tsx` with real photo (drop into `/public/founder.jpg`)
- [ ] Update `messages/es.ts` and `messages/en.ts` founder bio with real name
- [ ] Verify all hooks in `messages/*.ts` against `marketing/ADS-HOOKS.md` §6 (frases prohibidas)
- [ ] Update Calendly URL in env var
- [ ] Add Plausible domain to `.env`
- [ ] Replace journal/partner names in `components/sections/social-proof.tsx` only with verified ones
- [ ] Update `metadataBase` URL in `app/layout.tsx` to final domain
- [ ] Test signup → thank-you → form submission end-to-end on staging
- [ ] Verify OG image renders correctly: `https://your-domain/opengraph-image`

## Common issues

**`DATABASE_URL is not set`** — add to `.env.local` (dev) or Replit Secrets (prod). Restart the dev server.

**SSL connection error** — Neon and most managed Postgres require SSL. The `lib/db.ts` enables it automatically when `NODE_ENV=production`. For local dev with a self-hosted Postgres, set `NODE_ENV=development`.

**`@/...` import errors** — make sure your Replit workspace uses Node 20+ with TypeScript path resolution.

**Geist font not loading** — we deliberately use a system-font stack (`ui-sans-serif, system-ui, ...`) to avoid extra round-trips. To use real Geist, install `geist` npm package and update `app/layout.tsx`.

## A/B test: variants A and B

Two landing aesthetics run side by side on the same app, sharing the same copy (`messages/es.ts` + `messages/en.ts`) and the same waitlist plumbing. Only visual DNA differs.

| Variant | Route | Aesthetic |
|---|---|---|
| A (original) | `/es`, `/en` | Dark B2B — Linear/Vercel/Anthropic vibes, sans-serif, emerald accent, grid background |
| B (editorial) | `/es/v2`, `/en/v2` | Light editorial — cream paper, serif display (italic accent), moss green, hairline rules |

Signups are tagged in the `waitlist.variant` column (`'a'` or `'b'`), so conversion can be compared with a single SQL query:

```sql
SELECT variant, COUNT(*) AS signups
FROM waitlist
GROUP BY variant
ORDER BY variant;
```

The v2 hero and final-CTA both send `variant: 'b'` through `signupForWaitlist`; the v1 forms omit it (defaults to `'a'`). The thank-you form is shared, the `waitlist_responses` table is unchanged.

To run the smoke tests:

```bash
npm run dev          # terminal 1
npm run test:e2e     # terminal 2 — runs both landing.spec.ts (A) and variant-b.spec.ts (B)
```

## What's NOT included (intentionally)

- Email automation (welcome series) — wire to ConvertKit/Beehiiv via webhook from `signupForWaitlist`
- LinkedIn/X social proof embeds — add a `<Posts />` section if useful
- Traffic-split middleware — point paid campaigns at `/es` vs `/es/v2` directly (or add a UTM-based redirect later)
- Analytics dashboard — query Postgres directly or pipe to Metabase/Retool

## License

Internal — not open source.
