# Auction App

This project is an online auction platform for listing items, running bidding sessions, and tracking auction activity in real time. Users can create accounts, add items, start auctions, and place bids while the backend broadcasts updates to connected clients through WebSockets.

## What the app does

- User authentication with sign up, sign in, refresh, and logout flows
- Item management for creating and viewing auctionable items
- Auction creation and ongoing auction tracking
- Bidding support with near real-time updates using WebSockets
- Auction history and item-specific auction records
- Separate frontend and backend services for clean API and UI boundaries

## Application architecture

### Frontend
The frontend is a Next.js application in the frontend folder. It provides the user interface for authentication, item management, and auction browsing.

### Backend
The backend is an Express.js application in the backend folder. It exposes REST routes for auth, items, and auctions, and uses a WebSocket layer to deliver live auction events to clients.

### Data layer
- Database: PostgreSQL
- ORM: Drizzle ORM
- Runtime: Bun for backend development

## Project structure

- backend/
  - src/app.ts: Express app setup
  - src/router/: API routes
  - src/controller/: route handlers
  - src/services/: business logic and token generation
  - src/ws/: live auction WebSocket logic
  - src/db/: database connection and schema definitions
- frontend/
  - src/app/: Next.js pages and app shell
  - src/components/: reusable UI components
  - src/store/: client-side auth state
  - src/utils/: API helpers and frontend utilities

## Tech stack

### Backend
- Bun
- TypeScript
- Express.js
- Drizzle ORM
- PostgreSQL
- WebSockets

### Frontend
- Next.js
- React
- TypeScript
- Axios
- React Hot Toast

## Local setup

### 1. Install dependencies

Backend:

```bash
cd backend
bun install
```

Frontend:

```bash
cd frontend
bun install
```

### 2. Configure environment variables

Create a .env file in the backend folder with the required values:

```env
PORT=4000
DB_STRING=postgresql://username:password@host:port/database
FRONTEND_URL=http://localhost:3000
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
```

### 3. Start the backend

```bash
cd backend
bun run dev
```

### 4. Start the frontend

```bash
cd frontend
bun run dev
```

The frontend typically runs on http://localhost:3000 and the backend runs on the port configured in PORT.

## Core features and flows

### Authentication
The app supports:

- POST /api/auth/signup
- POST /api/auth/signin
- POST /api/auth/refresh
- POST /api/auth/logout

Authentication is handled with access and refresh tokens stored and verified by the backend.

### Item management
Authenticated users can create, list, update, fetch, and delete items.

Routes include:

- POST /api/items
- GET /api/items
- GET /api/items/:id
- PATCH /api/items/:id
- DELETE /api/items/:id

### Auctions
Auction endpoints support creating and tracking auctions for items.

Routes include:

- POST /api/auctions
- GET /api/auctions/ongoing
- GET /api/auctions/history
- GET /api/auctions/:id

### Real-time bidding
The backend WebSocket service keeps connected clients synchronized while auctions are active. This is used to push updated bid information and auction state without requiring full page refreshes.

## Typical user flow

1. Sign up or sign in
2. Add one or more items to the catalog
3. Create an auction for an item
4. View ongoing auctions
5. Place bids as the auction runs
6. Review auction history after the event ends

## Notes for contributors

- Keep frontend and backend concerns separate.
- Use environment variables for secrets and database configuration.
- When changing auction logic, test both REST behavior and WebSocket event flow.
- Database migrations and schema updates should be managed through the Drizzle configuration in the backend.

## License

This project is intended for local development and learning purposes unless otherwise specified by the repository owner.