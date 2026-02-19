# AsiaCenter24 Web (FreshMart)

This repository contains the Next.js (App Router) storefront for FreshMart — a demo e‑commerce site for Asia Center 24.

Quick links

- Framework: Next.js 16 (App Router)
- Language: TypeScript / React 19
- Styling: Tailwind CSS
- i18n: react-i18next (client init present)

Getting started (local)

Prerequisites:

- Node 18+ and pnpm installed

Install

```bash
pnpm install
```

Run dev server

```bash
pnpm dev
```

Build (production)

```bash
pnpm build
pnpm start
```

Project structure (high level)

- app/ — Next.js App Router pages & layouts
- src/components — UI and feature components
- src/data — sample product/category data
- public/ — static assets
- next.config.ts — Next.js configuration (image hosts, etc.)

Performance & SEO notes

- Heavy client components (carousel, testimonials) are dynamically loaded to reduce initial JS.
- Hero/critical images use next/image with sizes/priority for better LCP.
- Locale-aware metadata is generated via `generateMetadata`.
- Structured data (JSON-LD) is injected for better search visibility.

Contributing

- Follow existing code style (Tailwind + utility classes).

Author

- Shivam Jha — shivamjha190@gmail.com

License

- MIT

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
