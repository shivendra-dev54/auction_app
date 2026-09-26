import express, { json } from 'express';
import cors from 'cors';
import cookieparser from 'cookie-parser';

import { errorHandler } from './middleware/error_handler.middleware';
import health_router from './router/health.route';
import auth_router from './router/auth.route';
import item_router from './router/item.route';

const app = express();

app.use(cors());
app.use(json());
app.use(cookieparser());

// routes
app.use(health_router);
app.use(auth_router);
app.use(item_router);

// middlewares
app.use(errorHandler);

export default app;