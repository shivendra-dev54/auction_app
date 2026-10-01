import express, { json } from 'express';
import cors from 'cors';
import cookieparser from 'cookie-parser';

import { errorHandler } from './middleware/error_handler.middleware';
import health_router from './router/health.route';
import auth_router from './router/auth.route';
import item_router from './router/item.route';
import auction_router from './router/auction.route';

const app = express();

app.use(cors({
	origin: process.env.FRONTEND_URL || "http://localhost:3000",
	credentials: true,
}));
app.use(json());
app.use(cookieparser());

// routes
app.use(health_router);
app.use(auth_router);
app.use(item_router);
app.use(auction_router);

// middlewares
app.use(errorHandler);

export default app;