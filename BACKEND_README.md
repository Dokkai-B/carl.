# Strapi backend (monorepo)

This repository now includes a Strapi v5 backend in `/backend` (TypeScript, SQLite by default).

## Quick start

1. Copy env file:
   - In `backend/`, duplicate `.env.example` to `.env` and replace all `tobemodified` values.
2. Start locally:
   - From `backend/` run `npm run develop`.
3. Create an Admin user at http://localhost:1337/admin.

## Deploying to Strapi Cloud

- Point Strapi Cloud to this repo and set Base Directory to `/backend`.
- Add the environment variables from `.env.example` in the Cloud dashboard.
- After first deploy, create a Read-only API Token (Settings → API Tokens) for the Next.js app.

## Notes

- SQLite database is stored under `backend/.tmp/`. Don’t commit `.tmp`.
- To change database later, configure `config/database.ts` and env vars.