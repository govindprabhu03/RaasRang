# Raas Rang — Event Website

Navratri event site with ticket purchasing (Razorpay).

## Structure
- `client/` — React (Vite) frontend
- `server/` — Express backend (ticket types, Razorpay orders, verification)

## Setup

**Server:**
```bash
cd server
cp .env.example .env   # fill in RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET
npm run dev
```

**Client:**
```bash
cd client
cp .env.example .env
npm run dev
```

## To do before launch
- [ ] Add real event details in `client/src/eventConfig.js` (dates, venue, contact, Instagram)
- [ ] Add 2025 photos to `client/src/assets/gallery/`
- [ ] Update ticket types/prices in `server/tickets.js`
- [ ] Get live Razorpay keys and set them in `server/.env`
- [ ] Add an email/SMS confirmation on successful payment (not implemented yet)
- [ ] Protect `/api/admin/orders` with auth before deploying
- [ ] Point `VITE_API_BASE` at your deployed server URL
