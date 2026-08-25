<p align="center">
  <img src="./assets/news-app-banner.svg" width="100%" alt="NewsMag React News Application" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=111827" alt="React 18.3" />
  <img src="https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite 5.4" />
  <img src="https://img.shields.io/badge/Framer_Motion-12-111827?style=for-the-badge&logo=framer&logoColor=white" alt="Framer Motion" />
  <img src="https://img.shields.io/badge/NewsAPI-Required-DC2626?style=for-the-badge" alt="NewsAPI required" />
</p>

## Overview

**NewsMag** is a responsive React application for searching, filtering, reading, and saving current news stories from NewsAPI.

The project focuses on component-based UI development, asynchronous data handling, persistent browser preferences, responsive layouts, and polished loading states.

## Features

| Area | Capability |
| --- | --- |
| **Discovery** | Top headlines, category filtering, search, and featured stories |
| **Reading** | Article cards with source, time, image fallback, and external links |
| **Saved stories** | Browser-based bookmarks stored in `localStorage` |
| **Experience** | Skeleton loaders, empty states, responsive navigation, and animation |
| **Personalization** | Light and dark themes saved across sessions |
| **Navigation** | Desktop and mobile menus with saved-article view |

## Technology stack

| Layer | Technology |
| --- | --- |
| **UI** | React 18.3 |
| **Build tool** | Vite 5.4 |
| **Animation** | Framer Motion |
| **Icons** | Lucide React |
| **Data source** | NewsAPI |
| **State** | React hooks and browser local storage |
| **Styling** | Custom responsive CSS with theme variables |

## Project structure

```text
News-App/
├── News-app/
│   ├── src/
│   │   ├── Components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── NewsBoard.jsx
│   │   │   ├── NewsItem.jsx
│   │   │   └── ErrorBoundary.jsx
│   │   ├── hooks/
│   │   │   └── useNews.js
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
├── assets/
│   └── news-app-banner.svg
└── README.md
```

## Run locally

### 1. Clone and install

```bash
git clone https://github.com/nuru999/News-App.git
cd News-App/News-app
npm install
```

### 2. Configure NewsAPI

Create an account at [newsapi.org](https://newsapi.org), then copy the example environment file.

```bash
cp .env.example .env.local
```

Set your development key:

```env
VITE_API_KEY=your_newsapi_key
```

### 3. Start the development server

```bash
npm run dev
```

Open the local URL printed by Vite, normally [http://localhost:5173](http://localhost:5173).

## Available scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Create a production bundle |
| `npm run preview` | Preview the bundle locally |
| `npm run lint` | Run ESLint |

## API-key and deployment warning

Vite environment variables are inserted into the browser bundle. Using `.env.local` keeps a key out of Git history, but it **does not make the key private after deployment**.

For a safe public deployment:

1. Create a small backend or serverless proxy.
2. Store the NewsAPI key only on the server.
3. Restrict allowed request parameters and add rate limiting.
4. Have the React app call the proxy instead of NewsAPI directly.
5. Confirm that the selected NewsAPI plan permits production browser use.

The repository currently has no working GitHub Pages deployment, so the project is presented as a local development application until that proxy and deployment configuration are added.

## Current technical improvements

- Wire the existing `ErrorBoundary` into the application root.
- Consolidate fetching logic so `NewsBoard` and `useNews` do not duplicate responsibilities.
- Add unit tests for search, saved stories, and API error states.
- Add request cancellation for rapidly changing searches.
- Add a secure proxy and deployment workflow.
- Add pagination or controlled infinite loading.

## Data and attribution

Article content, images, authors, and source names belong to their respective publishers and are retrieved through NewsAPI. The application links readers to the original publisher pages.

---

<p align="center">
  Built by <a href="https://github.com/nuru999">Nuru Amudi</a>.
</p>