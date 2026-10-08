# Outline — Auth Backend

Simple Express + MongoDB backend covering signup and login with
httpOnly-cookie JWT sessions.

## 1. Install

```bash
cd backend
npm install
```

## 2. Configure

Copy `.env.example` to `.env` and fill in real values:

```bash
cp .env.example .env
```

- `MONGO_URI` — a local MongoDB (`mongodb://127.0.0.1:27017/outline`) or a
  free MongoDB Atlas connection string.
- `JWT_SECRET` — any long random string (e.g. run
  `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`).
- `CLIENT_URL` — your frontend's URL (Vite default is
  `http://localhost:5173`), needed so CORS allows the cookie through.

## 3. Run

```bash
npm run dev
```

Server starts on `http://localhost:5000` (or whatever `PORT` you set).

## API

All responses are JSON. On signup/login, the server sets an `httpOnly`
cookie named `token` — the browser handles it automatically, you don't
read or store it in JS.

### POST `/api/auth/signup`
```json
{
  "fullName": "Ada Lovelace",
  "username": "ada",
  "email": "ada@example.com",
  "password": "supersecret123",
  "agreedToTerms": true
}
```
Returns `201` with `{ user }`, or `400`/`409` with `{ message }` on
validation errors or duplicate email/username.

### POST `/api/auth/login`
```json
{ "email": "ada@example.com", "password": "supersecret123" }
```
Returns `200` with `{ user }`, or `401` with `{ message: "Invalid email or password" }`.

### POST `/api/auth/logout`
Clears the session cookie. Returns `200`.

### GET `/api/auth/me`
Protected — requires the `token` cookie. Returns the logged-in user, or
`401` if not authenticated. Call this on app load to restore a session.

## Calling it from the frontend

Every request needs `credentials: "include"` so the cookie is sent:

```js
const res = await fetch("http://localhost:5000/api/auth/signup", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  credentials: "include",
  body: JSON.stringify({ fullName, username, email, password, agreedToTerms }),
});
const data = await res.json();
```

## What's intentionally left out for now

- Email verification
- Password reset flow
- Rate limiting on login attempts
- Refresh tokens (current token just lives for `JWT_EXPIRES_IN`)

These are natural next steps once the basic flow is working end to end.