# Duality Sale Synthesis

One repo. Dual personalities. Cloudflare Workers + Workflows for turning ideas into structured sales.

**Solan** sparks the hyphy idea mix. **Lumari** locks the durable structure so the sale actually executes.

## Quick Start (Solopreneur Steps)

1. Clone this repo.
2. `npm install`
3. `npx wrangler login` (connect your Cloudflare account)
4. `npx wrangler deploy`
5. Visit the URL. Use the dual UI or hit `/synthesize?idea=your-idea&source=solan`

## How It Gets the Sale

- Idea in → Workflow starts
- Synthesize step (creative mix)
- Nurture sleep (realistic timing)
- Score + route (hot/warm)
- Execute structure (ready for Stripe / HubSpot / Buffer hooks)

## Telemetry

Every request writes to Analytics Engine dataset `duality_sale_events`.

Query later with SQL API for audit logs.

## Hidden Gem

The dual mirror: same idea, two directions, one durable execution path. Nothing scrapped — refined and parked.
