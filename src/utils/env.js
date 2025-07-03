import process from "process";
import loadEnv from "../config/dotenv.js";

// Load .env file based on NODE_ENV
export const NODE_ENV = process.env.NODE_ENV;
loadEnv(NODE_ENV);

// Export environment variables with defaults where needed
export const API_KEY = process.env.API_KEY;
export const TZ = process.env.TZ || "Asia/Jakarta";
export const PORT = process.env.PORT || 5000;

export const CORS_ORIGIN = process.env.CORS_ORIGIN;
export const CORS_METHOD = process.env.CORS_METHOD;
export const CORS_HEADER = process.env.CORS_HEADER;

export const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
export const GEMINI_MODEL = process.env.GEMINI_MODEL;
export const GOOGLE_EMBEDDING_MODEL = process.env.GOOGLE_EMBEDDING_MODEL;

export const QDRANT_HOST = process.env.QDRANT_HOST;
export const QDRANT_API_KEY = process.env.QDRANT_API_KEY;
