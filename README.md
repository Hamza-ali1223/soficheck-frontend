# SOFI Check Frontend

Frontend for **SOFI Check**, a Final Year Project idea checker that lets students submit a project abstract and technology stack, sends that input to the backend, and presents a similarity analysis against archived FYP catalogues.

This project is built with React, TypeScript, Vite, Tailwind CSS v4, HeroUI, and Framer Motion.

## What This Frontend Does

The application is a single-page interface where a user can:

- enter a project abstract and optional core technologies
- send the idea to the backend using `POST /api/query`
- see a parsed similarity result, including:
  - similarity rating
  - similar projects
  - AI-generated explanation
  - full raw backend response
- check whether the backend is reachable using `GET /api/health`
- revisit previous queries stored in browser `localStorage`
- continue unfinished input through draft autosave
- switch between light and dark theme

## Current App Flow

At runtime, the frontend behaves like this:

1. `src/main.tsx` mounts the app inside `HeroUIProvider` and enables Vercel Speed Insights.
2. `src/App.tsx` renders the shared shell:
   - animated particle background
   - sticky header
   - main dashboard
   - footer
3. `src/components/Dashboard.tsx` manages the main user flow:
   - loads saved draft from `localStorage`
   - validates the abstract before submission
   - calls the backend through `queryIdea()`
   - stores successful queries in local history
   - restores old queries when selected from history
4. `src/components/AnalysisResultCard.tsx` parses backend text and turns it into a user-friendly result card.
5. `src/lib/parse.ts` extracts:
   - similarity rating
   - similar projects
   - explanation text

## Tech Stack

- React 18
- TypeScript
- Vite 6
- Tailwind CSS v4
- HeroUI
- Framer Motion
- ESLint + Prettier
- Vercel Speed Insights

## Project Structure

```text
soficheck_frontend/
├── public/
│   └── gallery/
│       └── homepage-preview.png
├── src/
│   ├── components/
│   │   ├── AnalysisResultCard.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Header.tsx
│   │   ├── LoadingOverlay.tsx
│   │   ├── ParticlesBackground.tsx
│   │   ├── ProjectDetailsCard.tsx
│   │   ├── QueryHistory.tsx
│   │   ├── ServiceDown.tsx
│   │   └── ServerStatus.tsx
│   ├── lib/
│   │   ├── api.ts
│   │   ├── config.ts
│   │   ├── parse.ts
│   │   └── useHistory.ts
│   ├── styles/
│   │   └── globals.css
│   ├── App.tsx
│   └── main.tsx
├── .env.example
├── eslint.config.mjs
├── package.json
├── vercel.json
└── vite.config.ts
```

## Main Files Explained

### `src/main.tsx`

- bootstraps the React application
- wraps the app with `HeroUIProvider`
- injects Vercel Speed Insights

### `src/App.tsx`

- renders the top-level layout
- includes `Header`, `ParticlesBackground`, `Dashboard`, and footer
- supports an optional maintenance override by trying to load `src/components/ServiceDown.tsx`

### `src/components/Dashboard.tsx`

This is the core container for the app.

Responsibilities:

- reads `VITE_API_BASE_URL`
- blocks the UI with a configuration error if the API base URL is missing
- keeps form state for:
  - `abstract`
  - `technologies`
- autosaves the current form draft to `localStorage` under `sofi-draft`
- checks backend availability through `ServerStatus`
- submits the idea using `queryIdea()`
- saves successful responses to query history
- restores previous searches from history
- clears the form and removes saved draft when requested

### `src/components/ProjectDetailsCard.tsx`

Handles the left-side input panel:

- text input for core technologies
- textarea for project abstract
- minimum abstract length validation of `30` characters
- clear button
- submit button with loading state

### `src/components/AnalysisResultCard.tsx`

Handles the right-side results panel.

It shows:

- loading overlay while the request is in progress
- error state when the request fails
- empty state before first submission
- parsed result state after a successful response

Parsed sections include:

- a similarity score ring
- a result label such as:
  - `Likely Unique`
  - `Some Overlap`
  - `High Similarity`
- up to 3 similar projects
- extracted AI explanation
- a collapsible view of the full raw response
- copy-to-clipboard for the raw backend output

### `src/components/QueryHistory.tsx`

Displays recent successful queries saved in the browser.

Behavior:

- stores up to `10` entries
- each entry contains:
  - abstract
  - technologies
  - backend response
  - timestamp
- selecting an item restores that query into the form and result area
- history can be cleared from the UI

### `src/components/ServerStatus.tsx`

Checks whether the backend is reachable by calling:

```http
GET /api/health
```

UI states:

- `checking`
- `online`
- `offline`

The component treats any successful network response as proof that the backend is reachable.

### `src/lib/api.ts`

Defines `queryIdea(abstract, technologies)`.

Request details:

- method: `POST`
- endpoint: `/api/query`
- content type: `application/json`
- body:

```json
{
  "abstract": "string",
  "technologies": "string"
}
```

Network behavior:

- request timeout: `60` seconds
- retries on network failure or `5xx` response
- maximum retries: `2`
- exponential backoff:
  - first retry after `2s`
  - second retry after `4s`
- does not retry `4xx` responses

### `src/lib/config.ts`

- reads `VITE_API_BASE_URL`
- builds normalized URLs through `buildUrl(path)`
- removes duplicate slashes from the final URL

### `src/lib/parse.ts`

Parses plain-text backend responses into structured UI data.

It currently extracts:

- similarity rating
- label and color for the rating
- up to 3 similar project blocks
- explanation section

This means the frontend expects the backend response to contain recognizable text patterns such as:

- `Similarity Rating:`
- `Project 1:`
- `Title:`
- `Catalogue:`
- `Page:`
- `Description:`
- `Explanation:`

If the backend response format changes, this file will likely need updates.

### `src/lib/useHistory.ts`

Custom hook for query history persistence.

Storage details:

- `localStorage` key: `sofi-history`
- maximum entries: `10`

## Environment Variables

Create a `.env` file in the project root. A sample is already provided in `.env.example`.

```env
VITE_API_BASE_URL=http://localhost:8081
VITE_GITHUB_URL=https://github.com/Hamza-ali1223
VITE_CONTACT_EMAIL=your-email@example.com
```

### Variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `VITE_API_BASE_URL` | Yes | Base URL of the backend API |
| `VITE_GITHUB_URL` | No | GitHub link shown in the footer |
| `VITE_CONTACT_EMAIL` | No | Contact email shown in the footer |

## Local Development

### Prerequisites

- Node.js 18+
- npm

### Install

```bash
npm install
```

### Configure environment

```bash
cp .env.example .env
```

Then update `VITE_API_BASE_URL` if your backend runs on a different host or port.

### Start the dev server

```bash
npm run dev
```

The Vite dev server is configured in `vite.config.ts` to run on:

```text
http://localhost:5174
```

## Available Scripts

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

### What they do

- `npm run dev`: starts the Vite development server
- `npm run build`: runs TypeScript compilation checks and creates a production build
- `npm run lint`: runs ESLint with `--fix`
- `npm run preview`: previews the production build locally

## Backend Contract

This frontend depends on a backend that exposes at least:

### Health endpoint

```http
GET /api/health
```

Used for:

- server status indicator on the homepage

### Query endpoint

```http
POST /api/query
Content-Type: application/json
```

Request body:

```json
{
  "abstract": "Detailed project abstract",
  "technologies": "React, Node.js, MongoDB"
}
```

Expected response:

- plain text
- includes a similarity rating and project details in a predictable format

Because the parser is text-based, the backend response format matters a lot. Once you provide the backend README, this section can be tightened to match the exact contract.

## Browser Persistence

This frontend stores two kinds of user data in the browser:

### Draft form data

- key: `sofi-draft`
- purpose: preserve unfinished abstract and technologies input

### Query history

- key: `sofi-history`
- purpose: preserve recent successful checks
- limit: `10` entries

No frontend database is used; persistence is browser-local only.

## Styling and UI Notes

- Tailwind CSS v4 is imported through `src/styles/globals.css`
- custom theme tokens are defined in `@theme`
- dark mode is controlled by toggling the `dark` class on `document.documentElement`
- Framer Motion is used for result animations and transitions
- the background particle canvas is purely decorative and sits behind the main app content

## Deployment Notes

### Vercel

`vercel.json` rewrites all routes to `/`, which supports SPA routing behavior on deployment.

### CORS

If the frontend and backend are deployed on different origins, the backend must allow requests from the frontend domain.

### Environment variables in production

Make sure at least `VITE_API_BASE_URL` is configured in the hosting platform before building or deploying.

## Known Implementation Notes

- The README previously referenced port `5173`, but the current Vite config uses `5174`.
- The current UI says the checker works against catalogues `16SW–21SW`.
- The parser relies on backend plain-text formatting rather than JSON.

## Recommended Next Step

Once you share the backend README, this frontend README can be refined further with:

- exact API contract documentation
- request and response examples from the real backend
- deployment instructions for running both services together
- architecture notes covering frontend-backend integration end to end
