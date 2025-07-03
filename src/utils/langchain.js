/**
 * Utility functions for LangChain integration:
 * - Text splitting
 * - Qdrant client and vector store
 * - Google Generative AI embeddings
 */

import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { QdrantClient } from "@qdrant/js-client-rest";
import { QdrantVectorStore } from "@langchain/qdrant";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import {
  QDRANT_HOST,
  QDRANT_API_KEY,
  GOOGLE_EMBEDDING_MODEL,
  GEMINI_API_KEY,
  GEMINI_MODEL,
} from "./env.js";

/**
 * Split text into chunks using RecursiveCharacterTextSplitter.
 * @param {string} text - The input text to split.
 * @param {number} [chunkSize=1000] - Maximum size of each chunk.
 * @param {number} [chunkOverlap=200] - Overlap size between chunks.
 * @returns {Promise<string[]>} - Array of text chunks.
 */
export const splitText = (text, chunkSize = 1000, chunkOverlap = 200) => {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize,
    chunkOverlap,
  });
  return splitter.splitText(text);
};

/**
 * Get or create a Qdrant vector store for a collection.
 * @param {string} collectionName - Name of the Qdrant collection.
 * @param {object} embeddings - Embeddings instance.
 * @returns {Promise<QdrantVectorStore>} - Qdrant vector store instance.
 */
export const getQdrantVectorStore = async (collectionName, embeddings) => {
  return new QdrantVectorStore(embeddings, {
    url: QDRANT_HOST,
    apiKey: QDRANT_API_KEY,
    collectionName,
  });
};

/**
 * Create a Google Generative AI Embeddings instance.
 * @param {object} [options={}] - Additional options.
 * @returns {GoogleGenerativeAIEmbeddings} - Embeddings instance.
 */
export const getGoogleEmbeddings = (options = {}) =>
  new GoogleGenerativeAIEmbeddings({
    model: GOOGLE_EMBEDDING_MODEL,
    apiKey: GEMINI_API_KEY,
    ...options,
  });

/**
 * Create a Qdrant client instance.
 * @returns {QdrantClient} - Qdrant client.
 */
export const getQdrantClient = () =>
  new QdrantClient({ url: QDRANT_HOST, apiKey: QDRANT_API_KEY });

/**
 * Create a Google Generative AI LLM instance.
 * @returns {Promise<ChatGoogleGenerativeAI>} - LLM instance.
 */
export const getLLM = async () => {
  const { ChatGoogleGenerativeAI } = await import("@langchain/google-genai");
  return new ChatGoogleGenerativeAI({
    apiKey: GEMINI_API_KEY,
    model: GEMINI_MODEL,
    temperature: 0.7,
    maxRetries: 3,
  });
};
