import express from 'express'
import { health_controller } from '../controller/health.controller';

const health_router = express.Router();

health_router.route("/api/health").get(health_controller);

export default health_router;