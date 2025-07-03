import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { PORT, CORS_ORIGIN, CORS_METHOD, CORS_HEADER } from "./utils/env.js";
import router from "./routes/index.js";
import httpStatus from "http-status"; // Import http-status

const app = express();

// Enable CORS with environment-based configuration
app.use(
  cors({
    origin: CORS_ORIGIN || "*",
    methods: CORS_METHOD || "GET,POST",
    allowedHeaders: CORS_HEADER || "Content-Type,Authorization",
  })
);

// Parse JSON request bodies (limit: 10mb)
app.use(bodyParser.json({ limit: "10mb" }));

// Mount main API router
app.use("/api/rag", router);

/**
 * Health check endpoint
 * @route GET /
 */
app.get("/", (req, res) => {
  res.status(httpStatus.OK).json({ message: "Simple RAG API is running" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
