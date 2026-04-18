# Replit Agent — Handoff Guide for Impulso BioCycle Landing

> **Audience:** the AI agent (Replit Agent / Replit Bounty / human dev) receiving this codebase to deploy on Replit and connect a real database.
>
> **Goal of this doc:** get the landing live at a public URL with persisted waitlist signups, in under 30 minutes, without breaking the bilingual flow or the dev mock mode that lets the team test UI changes locally.

---

## 0. Before you touch anything — read this

This is a **production-ready Next.js 14 landing**. Do not re-architect. The opinionated decisions below were made deliberately and validated against the marketing strategy in `/marketing/` (sibling folder in the monorepo). Specifically:

- **Bilingual EN+ES from day 1** (`/es` and `/en` routes). The avatar is international (see `/marketing/AVATAR-IDEAL.md`).
- **Dark-first B2B aesthetic** (Linear/Vercel/Anthropic-style). Do NOT switch to light mode or add gradients beyond the existing emerald palette — it would break trust with the senior HSE/Sustainability avatar.
- **Server Actions for all mutations** (no API routes). Drizzle ORM, Postgres, native pg driver.
- **`isMockMode` short-circuit** in `lib/db.ts` — when no real DB is connected, server actions log + return simulated success so the UI works for testing. NEVER remove this; instead, set `DATABASE_URL` to switch it off automatically.
- **All copy is validated** against the pivote document at `../../.research-synthesis.md` §11 (forbidden phrases) and `../../marketing/ADS-HOOKS.md` §6. Don't change marketing copy without re-validating.

---

## 1. What's already built (you don't need to touch)

```
artifacts/landing/
├── app/                        ← Next.js 14 App Router
│   ├── layout.tsx              ← root html, metadata, optional Plausible
│   ├── globals.css             ← design tokens (HSL CSS vars), Tailwind base
│   ├── page.tsx                ← / → /es redirect
│   ├── actions.ts              ← Server Actions (signup, form submit, counter)
│   ├── opengraph-image.tsx     ← dynamic OG (Edge runtime)
│   ├── icon.tsx                ← dynamic favicon
│   ├── not-found.tsx
│   └── [lang]/
│       ├── layout.tsx          ← per-locale metadata + hreflang alternates
│       ├── page.tsx            ← landing — composes 9 sections
│       └── thank-you/
│           └── page.tsx        ← reads ?email=, renders form
├── components/
│   ├── sections/               ← Nav, Hero, SocialProof, Problem, Dream, How,
│   │                              What, Founder, FinalCta, Footer
│   ├── thank-you-form.tsx      ← 6-question discovery form, progress bar,
│   │                              client-side state, server-side scoring
│   └── ui/                     ← Button, Input, Label, Textarea, Progress
│                                  (shadcn-style primitives, no dependency on shadcn CLI)
├── drizzle/
│   └── schema.ts               ← waitlist + waitlist_responses tables + Zod
├── lib/
│   ├── db.ts                   ← lazy Postgres pool + isMockMode export
│   ├── i18n.ts                 ← locale resolution
│   ├── scoring.ts              ← score computation → 🟢🟡🔴 tier
│   ├── countries.ts            ← curated country list aligned with avatar regions
│   └── utils.ts                ← cn() helper
├── messages/
│   ├── types.ts                ← Messages type (source of truth for shape)
│   ├── es.ts                   ← Spanish copy
│   └── en.ts                   ← English copy
├── public/                     ← (empty — drop founder.jpg here, see §6)
├── package.json                ← Next 14.2, React 18, Drizzle, pg, Zod, Tailwind
├── next.config.mjs             ← redirects (/) → /es, server actions config
├── tailwind.config.ts          ← design tokens reference globals.css
├── postcss.config.mjs
├── drizzle.config.ts           ← reads DATABASE_URL
├── .replit                     ← Replit config (Node 20, Postgres, autoscale)
├── replit.nix                  ← Nix dependencies
├── .env.example                ← all env vars documented
└── README.md                   ← full guide for human devs (more detailed than this)
```

## 2. What you need to do — step by step

### Step 1 — Install deps

```bash
npm install
```

`pnpm` and `yarn` also work but `package-lock.json` is committed for `npm`. Install takes ~50 seconds.

### Step 2 — Provision Postgres

You have **two equally valid options**. Pick based on the user's plan:

**Option A — Replit built-in Postgres (paid plans only)**
1. Open the Replit "Database" tab in the sidebar.
2. Click "Create a database" → Postgres.
3. Copy the auto-generated `DATABASE_URL` from the connection string field.

**Option B — Neon free tier (recommended for free Replit, scales to 0.5 GB free)**
1. Go to https://neon.tech (no credit card required).
2. "Create new project" → name it `biocycle-waitlist`.
3. Copy the **pooled** connection string (it has `-pooler` in the host).

Either one works. The code in `lib/db.ts` auto-enables SSL when `NODE_ENV=production`, which is what Replit deploys with.

### Step 3 — Configure Replit Secrets

Open the **Secrets** tab (lock icon in the left sidebar). Add the following:

| Key | Value | Required? |
|---|---|---|
| `DATABASE_URL` | (from step 2) | **YES** |
| `NEXT_PUBLIC_SITE_URL` | `https://biocycle.replit.app` (or your custom domain when ready) | **YES** for OG/canonical URLs |
| `NEXT_PUBLIC_CALENDLY_URL` | Founder's Calendly link (e.g. `https://calendly.com/founder/biocycle-discovery`) | Optional — green-tier signups see "Schedule" CTA, falls back to disabled if unset |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | The domain Plausible uses (e.g. `biocycle.ai`) | Optional — turns on Plausible script |
| `NODE_ENV` | `production` | Set automatically by Replit Deploy; manually for testing prod build |

**Do NOT add** `MOCK_DB`. The mock mode auto-disables when `DATABASE_URL` points to a real host.

### Step 4 — Push schema to the database

```bash
npm run db:push
```

This runs `drizzle-kit push` which creates two tables in your Postgres:
- `waitlist` — primary opt-in (email, locale, country, UTMs, user-agent, timestamp)
- `waitlist_responses` — thank-you survey (role, sector, pain, past methods, timeline, call intent, score, tier)

Both use `serial id PK` and `text email` (unique on `waitlist`). See `drizzle/schema.ts` for indexes.

### Step 5 — Smoke test before deploy

```bash
npm run dev
```

Then in your browser (or using Replit's webview) hit these URLs and verify each:

| URL | Expected |
|---|---|
| `/` | Redirects to `/es` |
| `/es` | Spanish landing renders; counter shows ≥25 |
| `/en` | English landing; nav toggle "ES" present |
| Submit `test@example.com` in the hero form | Redirects to `/es/thank-you?email=test@example.com` (or English equivalent) |
| `/es/thank-you?email=foo@bar.com` | 6-question form renders with progress bar |
| Fill all 6 questions, click submit | Success panel renders. If you picked "yes_now" + "this_week" + "Gerente HSEQ" + 3+ past methods + a long pain → green-tier with Calendly CTA. Otherwise yellow/red neutral message. |

If submit doesn't insert into the DB, open the Replit Shell:
```bash
npm run db:studio
```
This launches Drizzle Studio (web UI) at https://local.drizzle.studio — verify the tables exist and check rows.

### Step 6 — Deploy to Replit

In the Replit sidebar: **Deploy** → choose **Autoscale** (recommended for landing pages — scales to zero when idle, ~$1/month when no traffic).

Settings:
- **Build command:** `npm run build`
- **Run command:** `npm run start`
- **Port:** 3000 (already configured in `.replit`)
- **Min instances:** 0
- **Max instances:** 3 (overkill for a waitlist; bump only if traffic spikes)

After ~2 minutes, you get a public URL like `biocycle-xyz.replit.app`. Update `NEXT_PUBLIC_SITE_URL` in Secrets to this URL and **redeploy** (one click) so OG metadata is correct.

### Step 7 — Custom domain (when the founder buys one)

In Replit Deployments → settings → **Custom Domain**.
1. Add the domain (e.g. `biocycle.ai`).
2. Replit gives you a CNAME or A record.
3. Add it in the domain registrar's DNS settings.
4. SSL auto-issues via Let's Encrypt within ~10 min.
5. Update `NEXT_PUBLIC_SITE_URL` in Secrets → redeploy.

---

## 3. Things you should NOT touch (without consulting the founder)

| File / area | Why it's locked |
|---|---|
| All copy in `messages/es.ts` and `messages/en.ts` | Validated against `../../.research-synthesis.md` §11 + `../../marketing/ADS-HOOKS.md` §6. Changing science claims (e.g. "AlphaFold 3 designs your enzyme") would create regulatory/licensing exposure. |
| `lib/scoring.ts` | The 🟢🟡🔴 thresholds were tuned against the avatar in `../../marketing/AVATAR-IDEAL.md`. Don't shift them without re-running discovery interviews. |
| Color tokens in `globals.css` (`--emerald`, `--background`) | Picked to match the B2B premium aesthetic that the avatar (senior HSE manager) responds to. NOT the same palette as the Streamlit app — intentional. |
| `lib/db.ts` `isMockMode` logic | Removing it breaks the "test UI without provisioning Postgres" workflow that the rest of the team relies on. |
| Drizzle schema — DO NOT add columns without a migration plan | Use `npm run db:push` for additive changes; for destructive changes (drop column / rename), generate a SQL migration manually. |

## 4. Things you SHOULD do (founder's pending decisions)

After deploy, ping the founder for these — they were intentionally left as placeholders:

| Item | Where to update |
|---|---|
| **Founder photo** | Drop file at `public/founder.jpg` (square, min 400×400). Then update `components/sections/founder.tsx` to render `<Image src="/founder.jpg" />` in place of the current "B" placeholder. |
| **Founder real name** | Replace `[Nombre]` / `[Name]` in `messages/es.ts` and `messages/en.ts` (in the `founder.bio` string and elsewhere). Search the messages files for `[Nombre]` and `[Name]`. |
| **Calendly link** | Set `NEXT_PUBLIC_CALENDLY_URL` in Secrets. Already wired into the green-tier success panel. |
| **Real social journals/partners** | `components/sections/social-proof.tsx` lists journals (Nature, Science, etc.) and partners (Javeriana, UNAL, UTB) — verify each is OK to display. The README says "in discussion" for partnerships; remove any without written consent. |
| **Domain** | After purchase, follow Step 7 above. |
| **Analytics** | Decide between Plausible ($9/mo, EU-friendly, no cookie banner needed) or GA4 (free, more setup). README has setup notes. |
| **Email automation** | The current flow stores signups in Postgres but does NOT send a welcome email. To wire up: add a webhook call to ConvertKit / Beehiiv / Resend at the end of `signupForWaitlist` in `app/actions.ts`. The marketing/WAITLIST-FORM.md §6 has the welcome-email copy ready in EN+ES. |

## 5. Known limitations (already designed-around, but flag for the team)

1. **Counter baseline of 25.** The Hero/FinalCta show `Math.max(realCount, 25)` so the live counter never displays "0" before the campaign launches. Once you hit 50+ real signups, you can lower this in `components/sections/hero.tsx` and `final-cta.tsx`.
2. **No rate limiting on Server Actions.** Acceptable for a waitlist (the form requires a real email format and idempotent on duplicates). For a public production launch, add Upstash Redis-based rate limit on the `signupForWaitlist` action — simple wrapper, ~30 lines.
3. **No CAPTCHA.** B2B avatar tolerates none → none. If spam becomes >2% of signups in week 1, add Cloudflare Turnstile (invisible).
4. **No dark/light toggle.** Intentional — see §3 above.
5. **OG image is dynamic (Edge runtime).** This works on Replit Autoscale but takes ~200 ms first paint. If LCP gets flagged, switch to a static OG generated at build time.
6. **Drizzle Studio doesn't ship in production.** Use `npm run db:studio` only locally / in Replit Shell. To inspect prod data, use Neon's web console or a SQL client like Postico.

## 6. Useful queries (paste into Drizzle Studio or Neon console)

```sql
-- Top 10 green-tier signups (most likely to close on a pilot)
SELECT r.email, r.role, r.timeline, r.pain, r.score, r.created_at
FROM waitlist_responses r
WHERE r.tier = 'green'
ORDER BY r.score DESC, r.created_at ASC
LIMIT 10;

-- Signups by country (to validate avatar regional split)
SELECT country, COUNT(*) AS n
FROM waitlist
WHERE country IS NOT NULL
GROUP BY country
ORDER BY n DESC;

-- Form completion rate (% of signups who finished the discovery form)
SELECT
  ROUND(
    (SELECT COUNT(*) FROM waitlist_responses) * 100.0 /
    NULLIF((SELECT COUNT(*) FROM waitlist), 0),
    1
  ) AS form_completion_pct,
  (SELECT COUNT(*) FROM waitlist) AS total_signups,
  (SELECT COUNT(*) FROM waitlist_responses) AS total_form_completions;

-- UTM attribution — which ad hooks convert to form completion
SELECT w.utm_content, COUNT(DISTINCT w.email) AS signups,
  COUNT(DISTINCT r.email) AS completions,
  ROUND(COUNT(DISTINCT r.email) * 100.0 / NULLIF(COUNT(DISTINCT w.email), 0), 1) AS pct
FROM waitlist w
LEFT JOIN waitlist_responses r ON r.email = w.email
WHERE w.utm_content IS NOT NULL
GROUP BY w.utm_content
ORDER BY signups DESC;
```

## 7. If something breaks — checklist

1. **`DATABASE_URL is not set`** → check Replit Secrets, restart the deployment.
2. **SSL connection error** → Neon and Replit Postgres both need SSL. Already enabled in `lib/db.ts` for `NODE_ENV=production`.
3. **Hydration mismatch in console** → check that `app/layout.tsx` doesn't render any inline `<style>` blocks. Move them to `globals.css`.
4. **Form submit returns "invalid_input"** → the Zod validators in `drizzle/schema.ts` are strict; check that the role/sector/timeline/callIntent values match the enums.
5. **Counter shows 0** → mock mode is on (DATABASE_URL has "placeholder" in it) or the DB is empty. Check `lib/db.ts:isMockMode`.
6. **TypeScript errors after editing copy** → the `Messages` type in `messages/types.ts` is the source of truth for shape; both `es.ts` and `en.ts` must conform.

## 8. Pre-launch checklist (founder approval needed)

- [ ] DATABASE_URL set, `npm run db:push` ran successfully
- [ ] Smoke test: `/es` → submit → thank-you → form → success — ALL PASS
- [ ] Same for `/en`
- [ ] Founder photo at `/public/founder.jpg`, real name in messages
- [ ] Real Calendly URL in Secrets
- [ ] Custom domain configured + SSL active
- [ ] OG image renders correctly: paste your URL in https://www.opengraph.xyz/
- [ ] Privacy policy + Terms pages (use Termly or Iubenda free generators, link from footer)
- [ ] At least one test signup persisted in Postgres and shows in Drizzle Studio
- [ ] Plausible or GA4 confirmed receiving page views
- [ ] (Optional) Email welcome series wired up to ConvertKit or similar

---

## 9. Where to find more context

| Question | Where to look |
|---|---|
| Why does the landing look like this (Sinek Golden Circle)? | `../../marketing/LANDING-PAGE-SPEC.md` |
| Who is this for, regional breakdown? | `../../marketing/AVATAR-IDEAL.md` |
| What hooks does the team plan to run as ads? | `../../marketing/ADS-HOOKS.md` |
| What does the 7-day launch plan look like? | `../../marketing/LAUNCH-PLAN-7DAYS.md` |
| Why do we mention AlphaFold 3 / RFDiffusion 2 / ESM-3? | `../../marketing/AI-ML-MOAT.md` |
| What CAN'T we promise (forbidden phrases)? | `../../.research-synthesis.md` §11 + `../../marketing/ADS-HOOKS.md` §6 + `../../marketing/AI-ML-MOAT.md` §5 |
| Founder's video script for the hero | `../../marketing/VIDEO-SCRIPT.md` |
| Detailed deploy + monorepo guide | `./README.md` (sibling file, longer than this handoff) |

---

## 10. TL;DR for the agent (paste into your scratchpad)

```
1. npm install
2. Create Postgres (Replit DB or Neon free) → copy connection string to DATABASE_URL secret
3. Add NEXT_PUBLIC_SITE_URL secret = your Replit deployment URL
4. npm run db:push
5. npm run dev — smoke test the 5 URLs in §2 step 5
6. Deploy → Autoscale, build = `npm run build`, run = `npm run start`, port 3000
7. Update NEXT_PUBLIC_SITE_URL to the live URL → redeploy
8. Ping founder for: photo, real name, Calendly URL, partner consent
9. Don't change copy without reading section §3 first
```

If you finish step 6 and the public URL serves `/es` correctly, the deploy is done.
