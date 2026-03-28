# Team Energy Audit

A shared real-time 2×2 energy/impact grid for teams.

## How it works
- `index.html` — the full single-page app
- `api/storage.js` — serverless GET/POST endpoint wrapping Vercel KV (falls back to in-memory if KV not connected)
- Polls every 4 seconds so all participants see a live shared board
