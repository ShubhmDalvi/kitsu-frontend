# Kitsu — URL Shortener (Frontend)

## Overview
A clean, minimal, high-end single-page React + Vite + Tailwind frontend for a URL shortening service named **Kitsu**.

Features:
- Animated wordmark/logo (Framer Motion) on every page load
- Layered drifting radial blobs and floating sakura petals (SVG + CSS)
- Highlighted result box with copy-to-clipboard + toast
- History saved to `localStorage` under key `shortHistory`
- Stats & Delete actions per item (wired to backend API contract)
- Keyboard accessible and mobile-first responsive layout
- Thin black 1px border motif around sections and buttons

## Run locally
1. Copy `.env.example` to `.env` and edit `VITE_API_URL` if needed.
2. `npm install`
3. `npm run dev`

Default API base: `http://localhost:8080` (no trailing slash)

## Notes / Where to change things
- Palette: `src/styles/palette.js`
- Animation timings: `src/config/animations.js`
- Logo animation: `src/components/Logo.jsx`
- Backend wiring: environment variable `VITE_API_URL` (see `.env.example`)

## Mocking the backend (quick)
If you don't have a backend, the UI will still work; it hits the configured endpoints. For local testing, consider running a simple mock server that follows the API contract described in the project brief.

