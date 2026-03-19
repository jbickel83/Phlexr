# CrowdKue Web Demo

CrowdKue is a mobile-first Expo app for event automation using uploaded or local audio files. This MVP is frontend-only, includes a built-in `Demo Event`, and is prepared for static web deployment on Vercel.

## What you get

- A first-run onboarding screen with `Start Demo` and `Create Your Event`
- A stable `Demo Event` that works without setup
- Shared local state for events, timelines, songs, playlists, announcements, and live mode
- A production web export that can be deployed without a backend

## Requirements

- Node.js 18 or newer
- npm 9 or newer

## Install

From the project root:

```bash
npm install
```

If PowerShell blocks `npm`, use:

```bash
npm.cmd install
```

## Run locally

Start the local web dev server:

```bash
npm run web
```

If PowerShell blocks `npm`, use:

```bash
npm.cmd run web
```

## Open in browser

After the dev server starts, open:

```text
http://localhost:8081
```

If Expo prints a different port, open the exact localhost URL shown in the terminal.

## Test in mobile view

1. Open the app in Chrome or Edge.
2. Open DevTools.
3. Toggle device emulation.
4. Pick a phone-sized viewport such as `iPhone 12 Pro` or `390 x 844`.
5. Keep the viewport in portrait mode.

## Demo flow

1. Open the app.
2. Click `Start Demo`.
3. Explore `Dashboard`, `Events`, `Music`, `Live`, and `Settings`.
4. In `Live Event Mode`, use `Start Event Autopilot` to run the sample event immediately.

The demo includes:

- a full wedding timeline
- assigned songs and playlists
- attached announcements
- live-mode data that works without backend setup

## Production build

Build the static web app with:

```bash
npm run build:web
```

If PowerShell blocks `npm`, use:

```bash
npm.cmd run build:web
```

The exported build output is written to:

```text
dist
```

## Deploy to Vercel

### Option 1: Vercel dashboard

1. Push this project to GitHub.
2. In Vercel, click `Add New Project`.
3. Import the repository.
4. Use these settings:
   - Framework Preset: `Other`
   - Build Command: `npm run build:web`
   - Output Directory: `dist`
5. Deploy.

### Option 2: Vercel CLI

Install the CLI if needed:

```bash
npm install -g vercel
```

Then from the project root:

```bash
vercel
```

For production deployment:

```bash
vercel --prod
```

This project already includes a `vercel.json` file with the correct build and SPA rewrite settings.

## Useful commands

```bash
npm run web
npm run build:web
npm run typecheck
```

## Notes

- No backend is included yet.
- No Spotify, Apple Music, or streaming playback is used.
- Demo Mode is designed to work for first-time visitors without local file setup.
- Local uploaded-file metadata is supported, but public web deployment should rely on the built-in demo flow unless the visitor uploads their own files during the session.
