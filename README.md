# KickUp - Frontend (Next.js)

Web client for **[KickUp](https://kickup.my)**, a live real-time sports platform where players find, create and join football matches, teams and tournaments.

**Live:** https://kickup.my | **Backend repo:** [kickup](https://github.com/Jony0998/kickup)

## Tech stack

- **Next.js** + **React** (TypeScript)
- GraphQL client for the NestJS API
- WebSocket for live match updates
- Responsive, mobile-first UI with dark mode
- Docker-based deployment (see `docker-compose.yml`)

## Features

- Browse matches by date, level, gender, size and location
- Create and join matches, teams and tournaments
- Stadium / venue pages
- Real-time notifications and updates
- User profiles and admin pages

## Project structure

```
components/   # UI components
contexts/     # React contexts (auth, theme, etc.)
hooks/        # custom hooks
lib/          # API client and helpers
pages/        # Next.js routes
styles/       # global styles
types/        # shared TypeScript types
```

More docs: `SYSTEM_ARCHITECTURE.md`, `LOCAL_DEV.md`, `ADMIN_GUIDE.md`.

## Run locally

```bash
npm install
npm run dev
```

Then open the app on port 3000. The backend must be running (see the kickup repo).

## Author

**Janobiddin Bozorov (Jony)** - Full-Stack Developer
[GitHub](https://github.com/Jony0998) | [LinkedIn](https://www.linkedin.com/in/janobiddin-bozorov-a03429412)
