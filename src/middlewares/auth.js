import { API_KEY } from "../utils/env.js";
import httpStatus from "http-status";

/**
 * Middleware to authenticate requests using API Key.
 * Checks for API Key in 'x-api-key' header or 'api_key' query parameter.
 *
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 */
export const apiKeyAuth = (req, res, next) => {
  // Get API key from header or query
  const key = req.headers["x-api-key"] || req.query.api_key;

  // If API_KEY is not set or does not match, return 401 Unauthorized
  if (!API_KEY || key !== API_KEY) {
    return res
      .status(httpStatus.UNAUTHORIZED)
      .json({ error: "Unauthorized: Invalid API Key" });
  }

  // Continue to next middleware if authenticated
  next();
};
