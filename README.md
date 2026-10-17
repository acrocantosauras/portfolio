This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).
It is built and deployed with **[vinext](https://github.com/vinextjs/vinext)** on Cloudflare Workers
(`wrangler.jsonc`), while `next dev` remains available for local development.

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Next.js dev server on port 3000 (also generates `.next/dev/types`) |
| `npm run dev:vinext` | vinext/Vite dev server on port 3001 (falls back to 3002 if occupied) |
| `npm run build` | Production build (`vinext build` → `dist/`) |
| `npm run start:vinext` | Serve the production build locally |
| `npm run deploy:vinext` | Deploy to Cloudflare Workers (`vinext-cloudflare deploy --skip-build`) |
| `npm run lint` | ESLint (flat config, `eslint.config.mjs`) |
| `npm run typecheck` | Source type check (`tsc --noEmit`) |

## Type checking

`.next/` is a **generated artifact** and this repo has two generators that write
into it with incompatible type vocabularies:

- **vinext** (`npm run build` / `npm run dev:vinext`) writes `.next/types/routes.d.ts`
  declaring `VinextRouteTypes.*` — it exports no `AppRoutes` / `LayoutRoutes` / `ParamMap`.
- **Next.js** (`npm run dev`) writes a self-consistent set (validator + routes) into
  `.next/dev/types/`, which `tsconfig.json` also includes.
- A stale `next build` can leave a Next-generated `validator.ts` inside `.next/types/`
  next to vinext's `routes.d.ts`. That mixture makes `tsc` fail with
  `TS2305: Module "./routes.js" has no exported member 'AppRoutes' | 'LayoutRoutes' | 'ParamMap'`
  even though the source code is correct.

**Do not edit files under `.next/` or suppress these errors.** Regenerate with a single
generator, then type check:

```bash
rm -rf .next
npm run build      # or: npm run dev
npm run typecheck  # tsc --noEmit
```

## Browser verification

A Playwright-style harness lives in `.shots/verify.mjs` (Puppeteer + Chrome). It runs the
full desktop, mobile, and reduced-motion suite (intro sequence, nav targets, pipeline,
dossier, recruiter drawer, honesty labels, links, overflow, console/network errors) and
writes screenshots to `.shots/`.

```bash
npm run dev:vinext                  # start the dev server
node .shots/verify.mjs               # auto-detects the served port (3001 → 3002 → 3000)
VERIFY_PORT=3002 node .shots/verify.mjs
VERIFY_URL=https://example.com node .shots/verify.mjs
```

All checks must report `PASS` (exit code 0).

`node .shots/deeplink.mjs` is a companion suite for hash navigation: deep links
(`/#section`) surviving the intro's scroll lock, heading clearance below the
sticky header, nav/back-forward behavior, and reduced-motion deep links.

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
