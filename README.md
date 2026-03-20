# Team Energy Audit

A shared real-time 2×2 energy/impact grid for teams.

## Deploy to Vercel (60 seconds)

### Option A — Vercel CLI
```bash
npm i -g vercel
cd energy-audit
vercel --prod
```

### Option B — Drag & Drop (no CLI needed)
1. Go to [vercel.com/new](https://vercel.com/new)
2. Drag the `energy-audit` folder onto the page
3. Click **Deploy**
4. Done — share the URL with your team

## Enable persistent shared storage (optional but recommended)

Without this step the board still works, but resets if the serverless function cold-starts.
With Vercel KV the data persists forever.

1. In your Vercel project dashboard → **Storage** tab → **Create Database** → **KV**
2. Connect it to your project
3. Vercel auto-injects the `KV_REST_API_URL` and `KV_REST_API_TOKEN` env vars
4. Redeploy — done

## Local dev
```bash
npm install
npx vercel dev
```
Open http://localhost:3000

## How it works
- `index.html` — the full single-page app
- `api/storage.js` — serverless GET/POST endpoint wrapping Vercel KV (falls back to in-memory if KV not connected)
- Polls every 4 seconds so all participants see a live shared board
