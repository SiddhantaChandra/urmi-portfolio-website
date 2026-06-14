# Urmi Chakraborty - Portfolio Website

Portfolio and blog website for Urmi Chakraborty — entertainment journalist and content writer. Features a custom CMS for managing all site content.

## Tech Stack

| Category | Technology |
|---|---|
| **Framework** | Next.js 15 (App Router, SSR) |
| **Database** | PostgreSQL (Neon) via Prisma ORM |
| **Auth** | Neon Auth |
| **File Storage** | Cloudflare R2 (S3-compatible) |
| **CMS** | Custom-built (`/cms/dashboard`) |
| **Rich Text Editor** | BlockNote |
| **Styling** | Tailwind CSS, Dark Mode |
| **UI Libraries** | Mantine, Aceternity UI, Framer Motion |
| **Icons** | Phosphor Icons, Tabler Icons, React Icons |
| **Validation** | Zod |
| **Analytics** | Google Analytics |
| **Deployment** | Vercel |

## Custom CMS

The built-in CMS (`/cms/dashboard`) is auth-protected (admin only) and provides management for:

- **Hero** — profile, badge, title, subtitle, description, image
- **About** — skills, differentiators, brand logos
- **Experience** — work history with achievements and skills
- **Articles** — full CRUD with BlockNote editor, tags, categories, slug generation
- **Resources** — downloadable files (resume, etc.)
- **Socials** — contact info and links

## Database Models

Prisma models: `Profile`, `Skill`, `Differentiator`, `Brand`, `Experience`, `ExperienceAchievement`, `ExperienceSkill`, `ContactInfo`, `Resource`, `Article`, `ArticleTag`, `ArticleTagRelation`, `ArticleContentBlock`

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (Neon recommended)
- Cloudflare R2 bucket for file storage

### Setup

1. Clone the repo and install dependencies:

```bash
npm install
```

2. Copy `.env` and configure:

```bash
cp .env.example .env
```

Required env vars: `DATABASE_URL`, `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`, `R2_ENDPOINT`, `R2_PUBLIC_URL`, `NEON_AUTH_URL`, `NEON_AUTH_COOKIE_SECRET`

3. Run database migrations:

```bash
npx prisma migrate deploy
```

4. Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The CMS dashboard is at `/cms/dashboard`.

## Deployment

Deployed on [Vercel](https://vercel.com). Push to the main branch to auto-deploy.