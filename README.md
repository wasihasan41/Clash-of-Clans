# Clash Of Clans Stats Checker

A fan-made web app for looking up any Clash of Clans player by tag. It shows their profile, heroes, hero equipment, pets, troops and spells with upgrade progress, and a battle log built from the official Clash of Clans API.

Built with Next.js 15 (App Router), TypeScript and MongoDB (optional).

> Unofficial fan project. This content is not affiliated with, endorsed, sponsored or specifically approved by Supercell, and Supercell is not responsible for it. See Supercell's [Fan Content Policy](https://supercell.com/fan-content-policy).

## Features

- **Player search** by tag. Tags are cleaned up automatically (`#2pp`, `2PP` and ` 2pp ` all work).
- **Profile**: name, tag, Town Hall icon, league icon (supports the new `leagueTier` league system), clan name and role, trophies, war stars, donations and more.
- **Upgrade progress** for heroes, hero equipment, pets, troops and spells. Each category shows a progress percentage, a "x/y maxed" count and a level bar per unit. Equipped gear is shown under each hero.
- **Battle log** from `GET /players/{tag}/battlelog`, with Home, Ranked and Legend tabs, stars, destruction, duration, loot, the opponent (linked to their profile) and a "Copy army" link.
- **Battle history (optional)**: the API only returns recent battles, so with MongoDB connected each new battle is saved and the history keeps growing.
- **Server-side API calls**: the API key never reaches the browser.
- Loading skeletons, an error page and a 404 page.

## Tech stack

| Area | Choice |
|---|---|
| Framework | Next.js 15, App Router, React Server Components |
| Language | TypeScript (strict mode) |
| Styling | Plain CSS (`app/globals.css`) |
| Data | Official Clash of Clans API |
| Database | MongoDB (optional, for battle history) |
| Quality | ESLint |
| Package manager | pnpm |

## Getting started

### Prerequisites

- Node.js 20 or newer
- [pnpm](https://pnpm.io)
- A Clash of Clans API key from [developer.clashofclans.com](https://developer.clashofclans.com)
- MongoDB (optional, only needed to save battle history)

### 1. Install

```bash
pnpm install
```

### 2. Create an API key

1. Sign in at [developer.clashofclans.com](https://developer.clashofclans.com).
2. Open **My Account** and choose **Create New Key**.
3. Enter the **public IP address** you are developing from. The key only works from that IP. You can find it with `curl -4 ifconfig.me`.

If your IP changes often, use the proxy option described below.

### 3. Configure environment variables

Copy the example file and fill it in:

```bash
cp .env.example .env.local      # Windows: copy .env.example .env.local
```

| Variable | Required | Description |
|---|---|---|
| `COC_API_TOKEN` | Yes | Your Clash of Clans API key |
| `COC_API_BASE` | No | Alternative API base URL, for example a proxy. Defaults to `https://api.clashofclans.com/v1` |
| `MONGODB_URI` | No | MongoDB connection string. Without it the battle log shows live data only |
| `MONGODB_DB` | No | Database name. Defaults to `coc_lookup` |
| `TRACK_SECRET` | No | Secret that protects the `/api/track` endpoint |
| `TRACK_PLAYER_TAGS` | No | Comma separated player tags that `/api/track` should save battles for, for example `#2PP,#YOURTAG` |

Restart the dev server after changing `.env.local`.

### 4. Run

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) and search for a player tag.

## Scripts

| Command | What it does |
|---|---|
| `pnpm dev` | Start the development server |
| `pnpm build` | Create a production build |
| `pnpm start` | Run the production build |
| `pnpm typecheck` | Type-check the project with TypeScript |
| `pnpm lint` | Lint the code with ESLint |

## How the battle log works

The official API returns a player's recent battles, but each entry has no id. This app therefore:

1. Fetches the battle log when a player page is opened (and when `/api/track` runs).
2. Builds a fingerprint for each entry (type, opponent, stars, destruction, army code and loot).
3. Compares the live list with the latest saved entries and stores only the new ones in MongoDB.

To keep history growing for players you care about, call the tracking endpoint on a schedule:

```bash
curl -H "Authorization: Bearer $TRACK_SECRET" https://your-site.example/api/track
```

It reads the players listed in `TRACK_PLAYER_TAGS`. Any scheduler works (a cron service, GitHub Actions, and so on).

### Things to know

- The API only returns recent battles. Battles that happened while nothing was tracking them cannot be recovered.
- For battles saved by this app, "first seen" is when the app first noticed the battle, not when it happened. When the API provides `battleTimestamp`, that real time is shown instead.
- On defense rows, the army code belongs to the attacker.
- The army code contains the heroes, pets and equipment that were used. The app shows how many were used, but it does not translate their numeric ids into names yet.
- Progress percentages are relative to what is possible at the player's current Town Hall level, so 100% means maxed for that Town Hall, not maxed in the game.

## Using a proxy (changing IP, deployment)

Hosts like Vercel do not have a fixed outgoing IP, so a normal API key will not work there. A common solution is the community-run [RoyaleAPI proxy](https://docs.royaleapi.com/proxy.html):

1. Create an API key and allow the IP address listed in the RoyaleAPI proxy documentation.
2. Set these environment variables:

```
COC_API_TOKEN=your_key_for_the_proxy
COC_API_BASE=https://cocproxy.royaleapi.dev/v1
```

The proxy is a third-party service and your key passes through it, so use a key created only for this project and check its current documentation before relying on it.

## Project structure

```
app/
  page.tsx                   Home page with the player search
  layout.tsx                 Site layout (header, footer)
  loading.tsx                Loading skeleton
  error.tsx                  Error boundary
  not-found.tsx              404 page
  player/[tag]/page.tsx      Player profile and battle log
  api/track/route.ts         Saves new battles to MongoDB (protected by TRACK_SECRET)
components/
  SearchForms.tsx            Player search form (client component)
  UnitList.tsx               Hero, troop, spell, pet and equipment lists with progress
  UnitIcon.tsx               Icon with fallbacks
  BattleLog.tsx              Battle log table with type tabs
  Stat.tsx, ErrorBox.tsx     Small UI pieces
lib/
  coc.ts                     API fetch helper (server only)
  tag.ts                     Tag normalising and validation
  types.ts                   API response types
  icons.ts                   Icon URL helpers
  league.ts                  League helpers (new and old league systems)
  progress.ts                Progress calculation
  battlelog.ts               Battle log helpers (fingerprints, filters, formatting)
  battlelog-store.ts         Fetching and saving battles
  army.ts                    Army code reader
  mongo.ts                   MongoDB connection
```

## Troubleshooting

| Problem | Likely cause |
|---|---|
| `403` or "API key rejected" | The key's allowed IP does not match your current public IP. Create a new key for the current IP, or use the proxy |
| `404` or "Nothing found" | The player tag is wrong |
| `429` | Too many requests. Wait a few seconds |
| "COC_API_TOKEN is not set" | `.env.local` is missing, in the wrong folder, or the server was not restarted |
| Battle log says "Live data only" | MongoDB is not connected. Check `MONGODB_URI` and the terminal output of `pnpm dev` |

## Credits

- Game data from the official [Clash of Clans API](https://developer.clashofclans.com).
- Unit and building icons from [ClashKing Assets](https://github.com/ClashKingInc/ClashKingAssets) (`assets.clashk.ing`).
- Game names, artwork and related content belong to Supercell.