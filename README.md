# TeamItaka Frontend

React-based frontend for TeamItaka. This app handles user flows like onboarding, registration, email verification, project browsing/management, and member evaluations.

## Tech Stack

- React 18
- React Router DOM 7
- Redux Toolkit
- SASS (SCSS)
- Swiper

## Requirements

- Node.js: 20 LTS recommended (to match engine requirements of react-router-dom@7)
- npm: 10+

You can check your versions with:

```bash
node -v
npm -v
```

## Getting Started

1) Install dependencies

```bash
npm ci
```

2) Create environment file

Create `.env.local` at the project root:

```
# API base for backend (Supabase Edge Function reverse-proxy or direct)
REACT_APP_API_BASE_URL=https://<your-project>.supabase.co/functions/v1/teamitaka-api

# Supabase anon key used for calling Edge Functions
REACT_APP_SUPABASE_ANON_KEY=your_anon_key_here

# Optional environment flag
REACT_APP_ENV=development
```

3) Start the dev server

```bash
npm start
```

The app runs at http://localhost:3000

## Scripts

- `npm start` — Start development server
- `npm run build` — Production build to `build/`
- `npm test` — Run tests

## Project Structure (high level)

```
src/
  components/        # UI components
  pages/             # Route-level pages
  services/          # API calls (auth, rating, etc.)
  contexts/          # React Context (e.g., AuthContext)
  utils/             # Helpers and utilities
  styles/            # Global styles and variables
```

## Environment Variables

- `REACT_APP_API_BASE_URL`: Base URL for API. For Supabase Edge Functions, it looks like `https://<project>.supabase.co/functions/v1/teamitaka-api`.
- `REACT_APP_SUPABASE_ANON_KEY`: Supabase anon key sent as `Authorization` and `apikey` headers when calling Edge Functions.
- `REACT_APP_ENV`: Optional flag (`development` | `production`).

Do not commit `.env*` files. They are gitignored.

## Email Verification (Frontend API usage)

All functions are in `src/services/auth.js` and use a shared helper that sets headers and base URL from environment variables.

```js
import { sendVerificationCode, verifyCode, resendVerificationCode } from './services/auth';

// Send verification code
await sendVerificationCode('user@example.com');

// Verify code
await verifyCode('user@example.com', '123456');

// Resend code
await resendVerificationCode('user@example.com');
```

These functions:
- Validate email format on the client
- Retry transient failures (HTTP 408/429/5xx) up to 3 times with backoff
- Throw user-friendly errors

Response (success):

```json
{
  "success": true,
  "message": "인증번호가 이메일로 전송되었습니다.",
  "data": { "email": "user@example.com", "expiresIn": 180 }
}
```

## Deployment (Vercel)

Recommended config:

- Build Command: `npm run build`
- Install Command: `npm ci`
- Output Directory: `build`
- Node version: set Project Setting → Environment → `NODE_VERSION` = `20`
- Environment variables (Production):
  - `REACT_APP_API_BASE_URL`
  - `REACT_APP_SUPABASE_ANON_KEY`

Note: Supabase Edge Function code is deployed in Supabase, not in this repo. Ensure the function is deployed and reachable.

## Security & Secrets

- Never commit secrets. Keep `REACT_APP_*` values in Vercel project env vars.
- If a secret was exposed, rotate it immediately in Supabase and Vercel.

## Troubleshooting

- CORS error on send-verification:
  - Check the Edge Function handles `OPTIONS` and returns 200 with `Access-Control-Allow-*` headers.
  - Ensure the function is actually deployed and the path matches `/api/auth/send-verification`.

- 401 Missing authorization/Invalid JWT:
  - Confirm `REACT_APP_SUPABASE_ANON_KEY` is set in env and exposed at build time.
  - Calls to `*.supabase.co/functions` automatically include `apikey` and `Authorization` headers from the anon key.

- Email not received:
  - In Supabase Edge Function: verify `SENDGRID_API_KEY` and a verified sender (Single Sender or Domain Auth) in SendGrid.
  - Check Supabase → Functions → Logs for SendGrid responses.

- Build errors (Node engine):
  - Use Node 20 on CI/hosting to satisfy engines for router v7.
  - Clear lockfile and reinstall if needed: `rm -rf node_modules package-lock.json && npm ci`.

## Branching & Commit Convention

- Branches: `feature/*`, `bugfix/*`, `hotfix/*`, `refactor/*`
- Commits: Conventional Commits
  - `feat: ...`, `fix: ...`, `refactor: ...`, `docs: ...`, `test: ...`, `chore: ...`

## License

See `LICENSE` in the repository.
