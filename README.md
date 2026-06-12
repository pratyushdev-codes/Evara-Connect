# Golden Park Residences

A premium apartment-management web app built with **Next.js 14**, designed as a mobile-view website with a bottom navigation bar. White + champagne-gold + espresso palette, Fraunces & DM Sans typography.

## Run it

```bash
npm install
npm run dev
```

Open **http://localhost:3000** — for the intended experience, open your browser DevTools and toggle a mobile viewport (e.g. iPhone 14), or just resize the window narrow. The app shell is capped at mobile width and centers on larger screens.

Production build: `npm run build && npm start`.

## What's inside

- **Home** — hero with dues card (pay flow with breakdown), live gate arrivals you can approve/deny, quick actions, trending announcements with likes & read-more, in-progress stats.
- **Services** — book an electrician, plumber, AC technician, carpenter, painter, pest control, deep cleaning or appliance repair. Pick a date & slot (or emergency 60-min visit), get a technician assigned, cancel anytime.
- **Complaints** — raise categorised tickets (with urgent flag), filter Open/Resolved, mark resolved.
- **Gate Pass** — approve or deny guests, food deliveries and packages waiting at the gate; pre-authorise visitors with a one-time 6-digit gate code (revocable).
- **Market** — order groceries & essentials from the society plaza store with a cart, free resident delivery and order tracking under Account.
- **Account** — profile, dues, activity stats, recent orders, household links and **Reset demo data**.

## Data & persistence

Everything is stored in **localStorage** (keys prefixed `gp_`) — service requests, complaints, gate passes, approvals, cart, orders, dues status and likes. No backend needed. Use **Account → Reset demo data** to start fresh; gate arrivals and a sample pass are re-seeded automatically.

## Stack

Next.js 14 (App Router) · React 18 · Tailwind CSS 3 · lucide-react icons.
