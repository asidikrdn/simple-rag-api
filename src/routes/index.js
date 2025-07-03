import express from "express";
import ragRouter from "./rag.routes.js";
import { apiKeyAuth } from "../middlewares/auth.js";

/**
 * Main API router.
 * Applies API key authentication to all routes.
 */
const router = express.Router();

// Apply API key authentication middleware to all routes
router.use(apiKeyAuth);

// Mount RAG-related routes
router.use(ragRouter);

export default router;
