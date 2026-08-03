# MOCA — Mobicom Opportunity & Capital Access

Africa's AI-powered entrepreneurship ecosystem — connecting youth, SMMEs, farmers, startups
and investors with funding opportunities, business knowledge and growth tools.

Built by **Mobicom Business Solutions (Pty) Ltd** (Reg. 2016/207169/23), Sekhukhune District, Limpopo.

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, React Router |
| Backend | Supabase (PostgreSQL, Auth, Storage) |
| AI | OpenAI API via Netlify Functions (key never exposed client-side) |
| Hosting | Netlify, deployed from GitHub |

## Project structure

```
src/
  components/
    layout/       Navbar, Footer, ProtectedRoute
    ui/            Button, Card, Badge, Input, Select, Skeleton, EmptyState
  pages/            One file per route (Landing, Funding, Insights, Dashboard, ...)
  hooks/            useAuth (Supabase auth context)
  services/         Data-access layer — Supabase queries with demo-data fallback
  lib/              supabase client, utils (formatting, wa.me links, cn())
  types/            Domain types + generated-style Database types
  data/             Local fallback/demo dataset (used until Supabase is populated)
netlify/functions/  ai-match.ts — server-side OpenAI call
supabase/
  schema.sql        Tables, indexes, RLS policies, storage buckets
  seed.sql          Optional demo data matching the frontend's mock dataset
```

## Pages

| Route | Page |
|---|---|
| `/` | Landing — hero, how it works, funding, success stories, learning, newsletter |
| `/funding` | Funding Marketplace — search + sector filters |
| `/insights` | MOCA Insights blog, filterable by category |
| `/insights/:slug` | Article detail |
| `/academy` | Learning Academy — course catalogue |
| `/community` | Entrepreneur community — posts + questions |
| `/dashboard` | Entrepreneur dashboard (protected) — MOCA Score, applications, AI Advisor |
| `/ai-assistant` | MOCA AI Assistant — funding match engine (protected) |
| `/admin` | Admin panel (protected) — users, funding, articles, courses, analytics |
| `/login`, `/signup` | Supabase email/password auth |

## Getting started

```bash
npm install
cp .env.example .env   # fill in Supabase + WhatsApp values
npm run dev
```

The app **runs and renders fully without Supabase configured** — every page falls back to
realistic demo data (`src/data/mockData.ts`) so you can preview the whole product immediately.
Wire up Supabase to make it live.

## Setting up Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. In the SQL editor, run `supabase/schema.sql`, then optionally `supabase/seed.sql`.
3. Copy your Project URL and anon key into `.env`:
   ```
   VITE_SUPABASE_URL=https://xxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=xxxx
   ```
4. To create your first admin user: sign up normally through `/signup`, then in the SQL editor:
   ```sql
   update public.users set role = 'admin' where email = 'you@mobicom.co.za';
   ```

### Schema overview

`users` · `business_profiles` · `funding_opportunities` · `articles` · `courses` ·
`applications` · `investors` · `community_posts` · `newsletter_subscribers`

All tables have Row Level Security enabled. Public content (open funding, published articles,
courses, community posts) is readable by anyone; personal data (business profiles, applications)
is owner-only; writes to funding/articles/courses are admin-only via the `is_admin()` helper.
Storage buckets (`avatars`, `article-covers`, `course-media`, `funding-logos`) are pre-created
with matching policies.

## AI Assistant (OpenAI)

The AI matching engine calls `/.netlify/functions/ai-match`, a serverless function that holds
`OPENAI_API_KEY` server-side and returns funding matches, a document checklist, and business
recommendations as JSON. In local dev without a key configured, the frontend falls back to a
local heuristic match so the UI is always demonstrable.

Set `OPENAI_API_KEY` in Netlify's environment variables (Site settings → Environment variables) —
never commit it or prefix it with `VITE_`.

## Deploying

1. Push this repository to GitHub.
2. In Netlify: **Add new site → Import an existing project**, select the repo.
3. Build command `npm run build`, publish directory `dist` (already set in `netlify.toml`).
4. Add environment variables in Netlify: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`,
   `OPENAI_API_KEY`, `VITE_WHATSAPP_NUMBER`.
5. Deploy. `netlify.toml` includes the SPA redirect so React Router routes resolve on refresh.

## Design system

- **Palette** — dark charcoal background (`#111417`), Mobicom green (`#00A651`), gold (`#D4AF37`),
  white typography.
- **Type** — Space Grotesk (display), Inter (body), IBM Plex Mono (data/labels), matching the
  established Mobicom Design Studios identity.
- **Inspiration** — LinkedIn's content density, Y Combinator's confidence, and an African
  development-finance marketplace's trust signals.

## WhatsApp

All WhatsApp links use `https://wa.me/27648132233` with `encodeURIComponent`, never the
`whatsapp://` scheme, per Mobicom's standing convention — see `whatsappLink()` in `src/lib/utils.ts`.

## License

Proprietary — Mobicom Business Solutions (Pty) Ltd.
