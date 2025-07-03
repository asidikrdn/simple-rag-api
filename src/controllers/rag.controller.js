import httpStatus from "http-status";
import * as ragService from "../services/rag.service.js";

/**
 * Ask a question to the RAG service.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const askQuestion = async (req, res) => {
  try {
    const { question } = req.body;
    const { collectionName } = req.params;
    if (!question || !collectionName) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: httpStatus.BAD_REQUEST,
        error: "question and collectionName are required",
      });
    }
    const { answer, references } = await ragService.askQuestion(
      question,
      collectionName
    );
    res.status(httpStatus.OK).json({
      status: httpStatus.OK,
      answer,
      references,
      collectionName,
    });
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      error: err.message,
    });
  }
};

/**
 * Ingest a document from an uploaded file.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const ingestDocumentFile = async (req, res) => {
  try {
    const { docId } = req.body;
    const { collectionName } = req.params;
    const filePath = req.file?.path;
    if (!filePath || !docId || !collectionName) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: httpStatus.BAD_REQUEST,
        error: "file, docId, and collectionName are required",
      });
    }
    await ragService.ingestDocumentFromFile(filePath, docId, collectionName);
    res.status(httpStatus.OK).json({
      status: httpStatus.OK,
      message: `Document file ${filePath} ingested successfully`,
      docId,
      collectionName,
    });
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      error: err.message,
    });
  }
};

/**
 * Ingest a document from raw text.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const ingestDocumentText = async (req, res) => {
  try {
    let { text, docId } = req.body;
    const { collectionName } = req.params;
    if (typeof text === "object") text = JSON.stringify(text);
    if (!text || !docId || !collectionName) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: httpStatus.BAD_REQUEST,
        error: "text, docId, and collectionName are required",
      });
    }
    await ragService.ingestDocumentFromText(text, docId, collectionName);
    res.status(httpStatus.OK).json({
      status: httpStatus.OK,
      message: "Document text ingested successfully",
      docId,
      collectionName,
    });
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      error: err.message,
    });
  }
};

/**
 * List all documents in a collection.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const listDocuments = async (req, res) => {
  try {
    const { collectionName } = req.params;
    const documents = await ragService.listDocuments(collectionName);
    res.status(httpStatus.OK).json({
      status: httpStatus.OK,
      documents,
      collectionName,
    });
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      error: err.message,
    });
  }
};

/**
 * Get a specific document by ID.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const getDocument = async (req, res) => {
  try {
    const { collectionName, docId } = req.params;
    const document = await ragService.getDocument(collectionName, docId);
    if (!document) {
      return res.status(httpStatus.NOT_FOUND).json({
        status: httpStatus.NOT_FOUND,
        error: "Document not found",
      });
    }
    res.status(httpStatus.OK).json({
      status: httpStatus.OK,
      document,
      collectionName,
    });
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      error: err.message,
    });
  }
};

/**
 * Upsert (insert or update) a document.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const upsertDocument = async (req, res) => {
  try {
    let { text } = req.body;
    const { collectionName, docId } = req.params;
    if (typeof text === "object") text = JSON.stringify(text);
    if (!text || !docId || !collectionName) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: httpStatus.BAD_REQUEST,
        error: "text, docId, and collectionName are required",
      });
    }
    await ragService.upsertDocument(text, docId, collectionName);
    res.status(httpStatus.OK).json({
      status: httpStatus.OK,
      message: "Document upserted successfully",
      docId,
      collectionName,
    });
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      error: err.message,
    });
  }
};

/**
 * Delete a document by ID.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const deleteDocument = async (req, res) => {
  try {
    const { collectionName, docId } = req.params;
    await ragService.deleteDocument(docId, collectionName);
    res.status(httpStatus.OK).json({
      status: httpStatus.OK,
      message: "Document deleted successfully",
      docId,
      collectionName,
    });
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      error: err.message,
    });
  }
};
