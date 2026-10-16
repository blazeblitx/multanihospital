# Multani Plastic Surgery Centre

The website for **Multani Plastic Surgery Centre**, a plastic surgery practice in Jalandhar, Punjab. It is a responsive, multi-page site for learning about the centre and its services, viewing clinic media, and getting in touch.

## Features

- Around 30 standalone pages covering the centre, treatment categories and individual treatments, contact, videos, social updates, article archives, and legal policies.
- Responsive navigation, homepage carousel, and animated visual components.
- Contact and consultation enquiry form.
- Optional AI information assistant for general site and clinic information. It is not a medical advice or diagnostic service.
- Video gallery and social previews for Facebook and Instagram.
- Consent controls and privacy, terms, cookies, and refunds pages.
- Static HTML, CSS, and vanilla JavaScript, with select React components bundled by Vite.
- Small Node.js server for the AI chat and social feed API endpoints.

## Requirements

- Node.js 20 or newer (see `package.json`).
- npm.

## Run locally

```sh
npm install
cp .env.example .env.local
# Add the integrations you want to use to .env.local (see Environment variables).
npm run build
npm start
```

Open <http://127.0.0.1:4174>. The server serves the built site from `outputs/`; run the build after changing the bundled React components. `PORT` can change the listening port. The server binds to `127.0.0.1` for local preview.

The static site can also be previewed with any local static file server pointed at `outputs/`, but the AI chat and social feed require the Node API server (or equivalent deployed endpoints).

## Build

```sh
npm run build
```

This runs both Vite library builds:

1. `vite.config.js` bundles the site components.
2. `vite.ai-doctor.config.js` bundles the AI assistant icon.

Both write into the existing `outputs/` directory without clearing it, preserving the HTML pages and their assets.

## Environment variables

Copy `.env.example` to `.env.local` for local development. The server reads `.env.local` if present, while existing process environment variables take precedence. Keep `.env.local` and all credentials private; do not put API tokens in frontend files or commit them.

| Variable | Required | Purpose |
| --- | --- | --- |
| `GEMINI_API_KEY` | For AI chat | Server-side Google Gemini API key. Without it the assistant returns an unavailable response. |
| `GEMINI_MODEL` | No | Gemini model name; defaults to `gemini-3.8-flash` in `server.mjs`. |
| `PORT` | No | Local Node server port; defaults to `4174`. |
| `META_GRAPH_API_VERSION` | No | Meta Graph API version; defaults to `v26.0`. |
| `META_PAGE_ID` | For live social feed | Facebook Page ID. |
| `META_PAGE_ACCESS_TOKEN` | For live social feed | Private Page access token, used only by the server. |
| `META_IG_USER_ID` | No | Instagram professional account ID. If omitted, the server attempts to read it from the connected Page. |

Facebook and Instagram previews are optional. Without Meta credentials, the social feed endpoint reports that it is not connected. See [AI-ASSISTANT-SETUP.md](AI-ASSISTANT-SETUP.md) for additional assistant setup details.

## Project structure

```text
.
├── outputs/                 # Published HTML pages, styles, scripts, and media
│   └── assets/              # Shared and page-specific image/video assets
├── src/                     # React components and their styles
├── server.mjs               # Local Node server and /api endpoints
├── vite.config.js           # Main site-component bundle
├── vite.ai-doctor.config.js # AI assistant icon bundle
├── package.json             # Scripts, dependencies, and Node requirement
├── .env.example             # Safe environment-variable template
├── AI-ASSISTANT-SETUP.md    # AI assistant setup notes
└── LEGAL-REVIEW.md          # Legal content review notes
```

The HTML pages are in `outputs/` and link to assets in that directory. The source React components live in `src/`; their compiled bundles are also written into `outputs/`.

## Deployment

The included `server.mjs` is a long-running Node HTTP server and is suitable for a Node host that supports persistent server processes. Configure that host to install dependencies, run `npm run build`, and start with `npm start`. Set integration credentials as private server environment variables in the hosting dashboard.

The repository does not currently include a Vercel configuration or serverless functions. To deploy on Vercel, deploy `outputs/` as the static site and add Vercel Functions (or another server-side API) implementing `POST /api/ai-chat` and `GET /api/social-feed`. Configure the same environment variables in Vercel's project settings and ensure the build runs `npm run build`. A static-only Vercel deployment serves the pages but will not provide those API features through `server.mjs`.

## Development and contributions

- Edit page markup and static assets under `outputs/`; edit React components and styles under `src/`.
- Rebuild with `npm run build` after changing bundled components.
- Keep API credentials server-side and update `.env.example` with variable names only when configuration changes.
- Keep navigation, page links, and shared visual behavior consistent across the HTML pages.
- Before opening a pull request, describe the pages or behavior changed and any setup required. Check the affected pages and API integrations in a local preview.

## Medical information

Website content and the AI assistant provide general information only. They are not a substitute for an individual consultation with a qualified clinician. For personal medical decisions, contact the centre directly.
