import express from "express";
import {
  askQuestion,
  ingestDocumentFile,
  ingestDocumentText,
  listDocuments,
  getDocument,
  upsertDocument,
  deleteDocument,
} from "../controllers/rag.controller.js";
import { upload } from "../middlewares/upload.js";

const ragRouter = express.Router();

/**
 * @route POST /:collectionName/ingest/file
 * @desc Ingest a document file into the collection
 */
ragRouter.post(
  "/:collectionName/ingest/file",
  upload.single("file"),
  ingestDocumentFile
);

/**
 * @route POST /:collectionName/ingest/text
 * @desc Ingest a document as plain text into the collection
 */
ragRouter.post("/:collectionName/ingest/text", ingestDocumentText);

/**
 * @route POST /:collectionName/ask
 * @desc Ask a question to the collection
 */
ragRouter.post("/:collectionName/ask", askQuestion);

/**
 * @route GET /:collectionName/documents
 * @desc List all documents in the collection
 */
ragRouter.get("/:collectionName/documents", listDocuments);

/**
 * @route GET /:collectionName/documents/:docId
 * @desc Get a specific document by ID
 */
ragRouter.get("/:collectionName/documents/:docId", getDocument);

/**
 * @route PUT /:collectionName/documents/:docId
 * @desc Update or insert a document by ID
 */
ragRouter.put("/:collectionName/documents/:docId", upsertDocument);

/**
 * @route DELETE /:collectionName/documents/:docId
 * @desc Delete a document by ID
 */
ragRouter.delete("/:collectionName/documents/:docId", deleteDocument);

export default ragRouter;
