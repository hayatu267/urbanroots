# UrbanRoots

A sneaker storefront built with React (client) + Express/MongoDB (server), now with
a working newsletter signup, an admin login, and an admin dashboard to manage the
shoe catalog.

## What changed in this update

- `server.js` now actually loads `.env`, connects via `config/db.js`, and mounts
  `/api/auth`, `/api/products`, and `/api/newsletter`.
- Added `Product` model + full CRUD API (admin-only for create/update/delete).
- Added `role` field to `User` (`user` / `admin`) and JWT-based `protect` +
  `adminOnly` middleware.
- Added `/api/auth/login` and `/api/auth/me`.
- Added `server/seed.js` — a one-time script to create your admin account and
  seed a few starter products.
- Frontend: `Products.js` now fetches shoes from the backend instead of using a
  hardcoded list. Added `Login` page, `AdminDashboard` page (add/edit/delete shoes),
  and `ProtectedRoute` so only an admin can reach `/admin`.
- Routed the previously-orphaned `Shop` and `Contact` pages.
- API base URL is now read from `REACT_APP_API_URL` instead of being hardcoded
  to `localhost:5000`, so it's ready for deployment.
- Added `.gitignore` files so `node_modules/` and `.env` don't get committed.

## Project structure

```
urbanroots/
├── client/   React storefront (CRA)
└── server/   Express + MongoDB API
```

## 1. Local setup

You need Node.js and a MongoDB instance (local `mongod`, or a free MongoDB
Atlas cluster).

### Backend

```bash
cd server
npm install
```

Edit `server/.env`:

```
MONGO_URI=mongodb://localhost:27017/urbanroots
JWT_SECRET=replace_with_a_long_random_string
PORT=5000

ADMIN_NAME=Admin
ADMIN_EMAIL=you@example.com
ADMIN_PASSWORD=choose_a_strong_password
```

Create your admin account (and a few starter products) once:

```bash
node seed.js
```

Then start the API:

```bash
npm start
```

It runs on `http://localhost:5000`.

### Frontend

```bash
cd client
npm install
```

Check `client/.env` has:

```
REACT_APP_API_URL=http://localhost:5000
```

Then:

```bash
npm start
```

It runs on `http://localhost:3000`.

## 2. Using the admin dashboard

1. Go to `http://localhost:3000/login`.
2. Log in with the `ADMIN_EMAIL` / `ADMIN_PASSWORD` you set before running `seed.js`.
3. You'll land on `/admin`, where you can add, edit, or delete shoes. Changes
   show up immediately on the storefront (`/` and `/shop`), since both read
   live from the `/api/products` endpoint.

Regular visitors never see the admin link do anything but lead to the login
page — there's no public sign-up for admin accounts. To add a second admin,
either run `seed.js` again with different `ADMIN_*` values, or change a user's
`role` to `"admin"` directly in MongoDB.

## 3. Deploying

**Backend** — deploy `server/` to a Node host (Render, Railway, Fly.io, a VPS, etc.):
- Set the same environment variables (`MONGO_URI`, `JWT_SECRET`, `PORT`) in
  that host's dashboard — don't commit `.env`.
- Point `MONGO_URI` at a MongoDB Atlas connection string for production.
- Run `node seed.js` once (e.g. via the host's shell/console) to create your
  production admin account.

**Frontend** — deploy `client/`:
```bash
npm run build
```
Deploy the resulting `build/` folder to Vercel, Netlify, or similar. Set
`REACT_APP_API_URL` in that platform's environment variables to your deployed
backend's URL (e.g. `https://urbanroots-api.onrender.com`) before building.

## Notes / things worth doing next

- Product images currently come from external URLs you paste into the admin
  form. For production you may want real image uploads (e.g. to S3 or
  Cloudinary) instead.
- There's no checkout/payment flow yet — the cart is a local wishlist that
  persists in `localStorage`.
- Consider rate-limiting `/api/auth/login` to slow down brute-force attempts.
