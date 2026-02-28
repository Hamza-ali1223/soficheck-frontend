# SOFI Check — Frontend

**Software Final Year Project Idea Checker**

Check whether your FYP idea is similar to past university projects from catalogues **16SW–20SW**. The 21SW batch is not included because its catalogue is not available yet.

## Phase 1 — Getting Started

### Prerequisites

- Node.js 18+
- npm

### Setup

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env   # or create .env manually
```

### Environment Variables

Create a `.env` file in the project root:

```env
VITE_API_BASE_URL=http://localhost:8081
```

| Variable             | Description                     | Example                  |
| -------------------- | ------------------------------- | ------------------------ |
| `VITE_API_BASE_URL`  | Backend API base URL (required) | `http://localhost:8081`  |

### Run

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### CORS Note

When deploying the frontend on Vercel (or any other host) while the backend runs on a different origin, the backend must allow CORS requests from the frontend domain.

## Tech Stack

- React 18 + TypeScript
- Vite
- HeroUI component library
- Tailwind CSS v4
