# Ahmed Magdy — Portfolio

A production-ready personal portfolio built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, **Framer Motion**, and **lucide-react**.

## Stack

- Next.js 14 (App Router, React 18)
- Tailwind CSS with a custom dark, glow-accented design system
- Framer Motion for entrance animations, animated filter tabs and an SVG network diagram
- lucide-react for iconography

## Getting started

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`.

## Project structure

```
app/
  layout.tsx        Root layout, fonts, metadata, Navbar/Footer
  page.tsx           Section composition
  globals.css        Design tokens, base styles, reduced-motion handling
components/
  Navbar.tsx
  Hero.tsx
  NetworkGraphic.tsx Animated SVG distributed-systems diagram
  StatsCounter.tsx   Count-up stats on scroll
  SkillsMatrix.tsx   Categorized skills grid
  ProjectsGrid.tsx   Filterable, animated project grid + case study modal state
  ProjectCard.tsx    Card with animated image carousel / gradient placeholder
  ProjectCaseStudyModal.tsx  Framer Motion modal: gallery, architecture, challenges, links
  Timeline.tsx       Education & training timeline
  Contact.tsx        Async contact form (loading + success/error states)
  CopyBadge.tsx
  SectionHeading.tsx
  Footer.tsx
lib/
  data.ts            All content: profile, skills, projects, stats, timeline
  types.ts           Shared TypeScript types
  constants.ts       Filter categories, per-category accent colors, icons & placeholder gradients
  utils.ts           Small `cn()` classnames helper
app/
  api/contact/route.ts  Contact form submission endpoint
public/
  projects/          Project screenshots (see public/projects/README.md)
```

## Editing content

Everything you'll want to change day-to-day — bio, contact details, skills, projects, timeline, stats — lives in `lib/data.ts`. Nothing else needs to change to update copy.

## Deploying to Vercel

1. Push this project to a GitHub repository.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository.
3. Framework preset: **Next.js** (auto-detected). No environment variables are required.
4. Deploy — Vercel will run `npm install` and `npm run build` automatically.

## Before you deploy

- `app/layout.tsx` sets `metadataBase` to a placeholder domain (`https://ahmedmagdy.dev`). Update it to your real domain (or your `*.vercel.app` URL) once you have one, so social share previews resolve correctly.

## Notes

- The contact form submits asynchronously to `app/api/contact/route.ts` (no page reload, no `mailto:`), with a loading spinner and an animated success state. The route validates the payload and responds with success/failure today, but **doesn't send an email until you wire in a provider** — see the commented options (Resend, SendGrid, Nodemailer) inside `route.ts`.
- Project cards and the case study modal read image paths from each project's `images` array in `lib/data.ts`. Drop matching files into `public/projects/` (see `public/projects/README.md`) — until then, everything falls back automatically to a gradient placeholder with tech badges, so nothing is broken in the meantime.
- The Play Store link for **Desert Maps & Offline GPS** is a placeholder (`#`) — update it in `lib/data.ts` once the listing is live.
- Reduced-motion preferences are respected globally via `globals.css`.
