# Clash Lookup

Clash of Clans ka fan website (Next.js 15 + TypeScript). Official CoC API use karta hai.

**Features:** player search (tag se), clan search (naam ya tag se), clan members table, country-wise clan leaderboard.

## Setup

```bash
pnpm install
cp .env.example .env.local     # Windows: copy .env.example .env.local
```

1. [developer.clashofclans.com](https://developer.clashofclans.com) par account banao
2. **Create New Key** karo, aur apna current public IP daalo (google par "what is my ip")
3. Key ko `.env.local` mein `COC_API_TOKEN=` ke aage paste karo

```bash
pnpm dev
```

Browser mein `http://localhost:3000` kholo.

## Common errors

- **403 / API key rejected**: key ka IP aur tumhara current IP match nahi karta. Key edit karke naya IP daalo.
- **404**: tag galat hai.
- `.env.local` change karne ke baad dev server restart karo.

## Deploy (Vercel)

Vercel ka outgoing IP fixed nahi hota, isliye seedhi key kaam nahi karegi. Common solution: RoyaleAPI proxy.

1. developer.clashofclans.com par naya key banao, IP mein RoyaleAPI proxy ka IP daalo (unki docs mein likha hai)
2. Vercel env variables mein `COC_API_TOKEN` aur `COC_API_BASE=https://cocproxy.royaleapi.dev/v1` set karo

Proxy ki current details deploy se pehle unki docs mein check kar lena.

## Structure

```
app/
  page.tsx                  home + search forms
  player/[tag]/page.tsx     player profile
  clan/[tag]/page.tsx       clan profile + members
  search/page.tsx           clan name search results
  leaderboards/page.tsx     country clan rankings
components/                 SearchForms (client), Stat, UnitList, ErrorBox
lib/
  coc.ts                    API fetch helper (server only)
  tag.ts                    tag normalise/validate
  types.ts                  API response types
```

API key sirf server par use hoti hai (`NEXT_PUBLIC_` prefix nahi hai), isliye browser mein leak nahi hoti.
