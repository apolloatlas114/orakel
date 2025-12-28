## Orakel — Prediction & Content Intelligence

Premium dashboard + bot UX (ZEUS‑X inspired) for prediction markets. The UI is live immediately; DB-backed auth requires Postgres.

## Getting Started

### Local dev (UI-only, no DB required)

```bash
npm install
npm run dev
```

Open:
- `http://localhost:3000` (landing)
- `http://localhost:3000/demo` (ZEUS‑style demo dashboard)

### Enable registration/login (requires Postgres + env vars)

1) Create a Postgres DB (recommended: Vercel Postgres) and set:
- `DATABASE_URL`
- `AUTH_SECRET` (a long random string)

You can copy `env.example` into your local `.env.local` (do not commit secrets).

2) Run the DB migration once (or let Vercel run it on deploy via the build step):

```bash
node scripts/migrate.mjs
```

### Deploy on Vercel

- Add **Vercel Postgres** to the project (it will inject `DATABASE_URL`)
- Set `AUTH_SECRET` in Vercel → Project → Settings → Environment Variables
- Deploy (build runs `node scripts/migrate.mjs && next build`)

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
