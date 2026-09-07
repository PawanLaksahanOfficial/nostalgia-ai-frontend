# Nostalgia AI — Frontend

React single-page app for Nostalgia AI: describe a memory, optionally add a photo, and the
service turns it into a narrated nostalgic video you can preview, download, and share by link.

**Live app:** https://nostalgia-ai-frontend.vercel.app
**API:** https://nostalgia-ai-backend.onrender.com ([backend repo](../nostalgia-ai-backend))

---

## Tech stack

| Concern | Choice |
| --- | --- |
| Framework | React 19 + TypeScript |
| Build tool | Vite 7 |
| Routing | react-router-dom 7 |
| State | Redux Toolkit + react-redux |
| HTTP | axios (with auth + 401 interceptors) |
| Styling | Inline style dictionary + CSS custom properties |
| Responsive | react-responsive + react-merge |
| Auth providers | Google (`@react-oauth/google`), Meta (`react-facebook`) |
| Testing | Vitest + Testing Library + jsdom |
| SVG | vite-plugin-svgr (`?react` imports) |

---

## Getting started

**Prerequisites:** Node.js 20+ and npm.

```bash
npm install
cp .env.example .env    # then fill in the values below
npm run dev             # http://localhost:5173
```

### Environment variables

All variables are read at **build time** and inlined into the bundle, so they are public by
definition — never put a secret in one.

| Variable | Purpose |
| --- | --- |
| `VITE_API_BASE_URL` | Backend origin, no trailing slash (e.g. `https://nostalgia-ai-backend.onrender.com`) |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth client ID for social sign-in |
| `VITE_META_APP_ID` | Meta app ID for social sign-in |

### Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Vite dev server with HMR |
| `npm run build` | Type-check (`tsc -b`) then production build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm test` | Run the Vitest suite once |
| `npm run test:watch` | Vitest in watch mode |
| `npm run lint` | ESLint over the repo |

---

## Project structure

```
src/
  pages/                  Route-level screens (Home, Videos, Watch, Profile, Pricing)
  components/
    common/               Button, InputField, TextArea, Modal, Header, Footer, toasts, errors
    videos/               VideoCard, ShareModal
    userAuthenticate/     Login, Register, ForgotPassword, ResetPassword, social sign-in
    Svg/                  SVGs imported as React components
  services/               API layer (apiClient, userServices, videoServices, homeServices)
  redux/                  Store and slices (auth, style)
  hooks/                  useComponentStyle, useTheme, useToast
  models/                 Shared TypeScript types
styles/                   Per-component style objects + styleDictionary registry
```

### Styling system

Styling does not use CSS modules or a UI library. Each component has a matching file in
`styles/` exporting `{ mobile, desktop }` style objects, registered in
[`styles/styleDictionary.ts`](styles/styleDictionary.ts). Components read them via:

```tsx
const Styles = useComponentStyle("inputField");
```

On mobile the `mobile` object is returned as-is; on desktop `desktop` is merged over `mobile`,
so desktop only needs to declare overrides. Colors come from CSS custom properties
(`var(--color-bg-card)`, `var(--color-text-primary)`, …) so light/dark theming works without
touching the style objects.

> **When adding a component:** create its style file, register it in `styleDictionary.ts`, and
> make sure every key the component reads actually exists. A missing key yields `undefined`,
> and reading a nested property off it throws at render time.

### API layer

[`src/services/apiClient.ts`](src/services/apiClient.ts) exports two axios instances:

- **`apiClient`** — attaches the JWT from `localStorage` to every request, and on a `401`
  from a non-auth endpoint clears the session and redirects to `/signIn?expired=1`.
- **`publicApiClient`** — no auth header and no redirect, used for public share links so an
  anonymous viewer is never bounced to sign-in.

---

## Routes

| Path | Screen | Access |
| --- | --- | --- |
| `/` | Create a memory video | Public (prompts sign-in to generate) |
| `/pricing` | Plans and checkout | Public |
| `/signIn`, `/register` | Authentication | Public (redirects if signed in) |
| `/forgot-password`, `/reset-password` | Password recovery | Public |
| `/videos` | My videos | Authenticated |
| `/profile` | Profile, quota, billing | Authenticated |
| `/s/:token` | Public watch page for a shared link | Public |

---

## Deployment (Vercel)

Build command `npm run build`, output directory `dist`. Set the three `VITE_*` variables in
the Vercel project settings — they are baked in at build time, so **changing one requires a
redeploy**.

### Required: SPA rewrite

This is a client-side-routed SPA. Without a rewrite, Vercel looks for a real file at each path
and returns **404 for every route except `/`** — breaking share links, password-reset emails,
and Stripe's post-checkout redirect. Add `vercel.json` at the repo root:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

The backend's `Frontend:BaseUrl` must match the deployed origin, since it builds share URLs
(`/s/{token}`) and reset links (`/reset-password?token=…`) against it.

---

## Testing

```bash
npm test
```

Vitest with jsdom and Testing Library; setup lives in `src/test/setup.ts`. Tests sit next to
the code they cover (`Button.test.tsx`, `InputField.test.tsx`, `ValidateInputs.test.ts`).
Components that call `useComponentStyle` read from the Redux store, so render them inside a
`<Provider>` — see [`InputField.test.tsx`](src/components/common/InputField.test.tsx).
