# Shopeasy Backend — Deploy & Connect to Frontend

This document explains how to deploy the backend and connect your frontend to the deployed URL.

Prerequisites
- Node.js (for local testing)
- A MongoDB connection (Atlas recommended)
- Account on hosting provider (Render, Heroku, or container host)

Required environment variables
- `MONGO_URI` — MongoDB connection string
- `JWT_SECRET` — secret for signing tokens
- `OWNER_EMAIL` and `OWNER_PASSWORD` — optional owner login credentials
- `PORT` — optional (hosting platform usually sets this)

Quick local test
```powershell
cd f:\backend\Shopeasy-backend
npm install
$env:MONGO_URI = 'mongodb+srv://<user>:<pass>@clusters.gx7mp9n.mongodb.net/<db>?retryWrites=true&w=majority'
$env:JWT_SECRET = 'your_jwt_secret'
npm run dev
```

Deploy to Render (recommended for simplicity)
1. Create a new Web Service on Render and connect the repo.
2. Set the Build Command to: `npm install`
3. Set the Start Command to: `npm start` (or leave as default `node server.js`).
4. Set environment variables in Render (MONGO_URI, JWT_SECRET, OWNER_EMAIL, OWNER_PASSWORD).
5. Deploy — Render will give you a URL like `https://your-backend.onrender.com`.

Deploy to Heroku
1. Install Heroku CLI and login.
2. `heroku create your-app-name`
3. Push your repo: `git push heroku main`
4. Set config vars: `heroku config:set MONGO_URI='...' JWT_SECRET='...'`
5. Ensure `Procfile` is present (this repo includes one). App will be available at `https://your-app-name.herokuapp.com`.

Container deployment (Docker)
1. Build image: `docker build -t shopeasy-backend .`
2. Run: `docker run -e MONGO_URI='...' -e JWT_SECRET='...' -p 10000:10000 shopeasy-backend`

Frontend integration
1. After backend is deployed, note the backend URL, e.g. `https://your-backend.example`.
2. In your frontend, set `BASE_URL` to the backend URL (in `script.js` currently it is a constant). For local testing you can set `const BASE_URL = 'http://localhost:10000'`.
3. Ensure frontend requests include credentials if you want to persist cookies/clientId:
   - When using `fetch`, add `credentials: 'include'` to requests that should send cookies.
   - Example:
```js
fetch(`${BASE_URL}/cart/add`, {
  method: 'POST',
  credentials: 'include',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload)
});
```

Security recommendations before production
- Make the frontend send `Authorization: Bearer <token>` after login (update frontend to save token in localStorage and send in headers). Then revert `auth` middleware to require JWTs.
- Use HTTPS and a secure JWT secret.
- Protect owner endpoints with a strong auth system.

Health and testing
- Health check: `GET /health` returns `{ status: 'ok' }`.
- Seed data: `node seed.js` (ensure `MONGO_URI` set).

If you want, I can:
- Patch the frontend repo to send `Authorization` and `credentials: 'include'` (recommended).
- Create a GitHub Actions workflow to automatically deploy to Render/Heroku on push.
