# Urmi Chakraborty — Portfolio & Media Kit

A bespoke editorial portfolio and live media kit for anime content creator and former journalist Urmi Chakraborty ([@uwummie](https://www.instagram.com/uwummie)).

Built with Next.js 16 and Supabase, the site pairs published cultural journalism with real-time audience metrics, motion design, and a direct inquiry pipeline.

---

## Highlights

- **Editorial Showcase** — Curated archive of published anime and manga features written for *The Telegraph Online*.
- **Live Media Kit** — Instagram audience demographics, reach, and engagement metrics powered by scheduled Supabase background syncs (no client-side tokens).
- **Stories in Motion** — Dynamic reel showcase highlighting recent and top-performing video essays with responsive wave layouts.
- **Bespoke Aesthetics** — Editorial typography (Cormorant Garamond, Plus Jakarta Sans, Noto Serif JP), Lenis smooth scrolling, and custom canvas sakura animations.
- **Inquiry Pipeline** — Contact form backed by Supabase storage and automated email delivery via Resend.

## Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router) & [React 19](https://react.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) with bespoke CSS
- **Data & Backend:** [Supabase](https://supabase.com/) (PostgreSQL, Edge Functions, pg_cron)
- **Smooth Scroll & Motion:** [Lenis](https://lenis.darkroom.engineering/) & custom canvas/CSS animations
- **Quality & SEO:** [Biome](https://biomejs.dev/) for linting & formatting, Schema.org JSON-LD structured data

## Getting Started

### Prerequisites

- Node.js 20+
- npm (or pnpm / bun)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/urmi-portfolio-website.git
cd urmi-portfolio-website

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Environment Variables

Create a `.env.local` file in the project root:

```env
# Public Supabase configuration
NEXT_PUBLIC_SUPABASE_URL="https://<project-id>.supabase.co"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="sb_publishable_..."

# Contact pipeline & notifications (server-only)
SUPABASE_SECRET_KEY="sb_secret_..."
RESEND_API_KEY="re_..."
CONTACT_FROM_EMAIL="Urmi Portfolio <hello@urmichakraborty.com>"

# SEO & Canonical URL (defaults to production origin if omitted)
SITE_URL="https://www.urmichakraborty.com"
```

> **Note**: Instagram analytics are aggregated via scheduled Supabase Edge Functions (`supabase/functions/`) and served through cached read-only endpoints. No Meta tokens are required on the client or for local frontend work. See [`supabase/contact-setup.md`](supabase/contact-setup.md) and [`components/reels/README.md`](components/reels/README.md) for backend details.

## Available Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Runs the Next.js development server with Turbopack |
| `npm run build` | Builds the production bundle |
| `npm run start` | Starts the production server |
| `npm run lint` | Runs Biome checks across the codebase |
| `npm run format` | Auto-formats code with Biome |
| `npm run test:seo` | Executes the SEO and structured data test suite |

## License

Private project. All articles, images, and brand assets are copyright of Urmi Chakraborty and their original publishers.
