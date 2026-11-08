# VoteSpace
A simple web-based polling/voting application built for the DevOps Engineering module.

## Tech Stack
- Frontend: React
- Backend: Node.js, Express, MongoDB

## Team
- Harshan J.J.      - EG/2023/5629
- Hasanthi R.A.M.A. - EG/2023/5630

## Setup Instructions

## Features
- Register and log in (JWT authentication)
- Logged-in users create polls and get a shareable link
- Anyone with the link can vote without logging in and sees live results

## Setup Instructions

### Option 1: Run with Docker (recommended)

Requirements: Docker and Docker Compose.

```bash
git clone https://github.com/justinharshan7/Polling_App.git
cd Polling_App
docker compose up --build
```

Use `sudo` in front if your account isn't in the `docker` group.

When it finishes, open:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

To use it from another computer on the same network, open `http://<host-pc-ip>:3000`. Find the IP with `hostname -I`.

To stop the containers:
```bash
docker compose down
```

The database is stored in the `mongo-data` volume, so it survives restarts. Don't run `docker compose down -v` unless you want to wipe the data.

### Option 2: Run without Docker

Requirements: Node.js 20 or newer and MongoDB running locally.

**Backend**
```bash
cd backend
npm install
```
Create `backend/.env` using `.env.example` as a template:
```
MONGO_URI=mongodb://localhost:27017/pollingapp
PORT=5000
JWT_SECRET=your_secret_here
```
Then start it:
```bash
npm start
```

**Frontend** (in a second terminal)
```bash
cd frontend
npm install
npm start
```

### API Endpoints

| Method | Route | Description | Login required |
|---|---|---|---|
| POST | `/auth/register` | Create an account | No |
| POST | `/auth/login` | Log in and receive a token | No |
| POST | `/polls` | Create a poll | Yes |
| GET | `/polls/:id` | Get a poll and its results | No |
| POST | `/polls/:id/vote` | Vote on a poll | No |

### Environment Variables

| Variable | Purpose |
|---|---|
| `MONGO_URI` | MongoDB connection string |
| `PORT` | Backend port (default 5000) |
| `JWT_SECRET` | Secret used to sign login tokens |
