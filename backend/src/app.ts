import express, { json } from 'express';
import cors from 'cors';
import cookieparser from 'cookie-parser';

import { errorHandler } from './middlewares/error_handler.middleware';
import health_router from './routers/health.router';
import auth_router from './routers/auth.router';

const app = express();

app.use(cors());
app.use(json());
app.use(cookieparser());

// routes
app.use(health_router);
app.use(auth_router);

// middlewares
app.use(errorHandler);

export default app;