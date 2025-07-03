import { QdrantVectorStore } from "@langchain/qdrant";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { createRetrievalChain } from "langchain/chains/retrieval";
import {
  getQdrantClient,
  getGoogleEmbeddings,
  getLLM,
} from "../utils/langchain.js";

// Initialize embeddings, vector DB client, and LLM
const embeddings = getGoogleEmbeddings();
const qdrantClient = getQdrantClient();
const llm = getLLM();

/**
 * Ask a question based on documents stored in Qdrant.
 * @param {string} question - User's question.
 * @param {string} collectionName - Qdrant collection name.
 * @returns {Promise<{answer: string, references: Array}>}
 */
export const askQuestion = async (question, collectionName) => {
  const vectorStore = await QdrantVectorStore.fromExistingCollection(
    embeddings,
    { client: qdrantClient, collectionName }
  );

  const prompt = ChatPromptTemplate.fromTemplate(`
    Jawablah pertanyaan pengguna hanya berdasarkan konteks berikut.
    Jika informasi tidak ditemukan dalam konteks, katakan "Maaf, saya tidak dapat menemukan informasi tersebut dalam dokumen."
    Tanggapi salam dan ucapan terima kasih dengan positif dan dorong interaksi lebih lanjut.
    Jawab dengan bahasa yang sama seperti pertanyaan.

    Konteks:
    {context}

    Pertanyaan: {input}
  `);

  const documentChain = await createStuffDocumentsChain({ llm, prompt });
  const retriever = vectorStore.asRetriever({ k: 10 });
  const retrievalChain = await createRetrievalChain({
    combineDocsChain: documentChain,
    retriever,
  });

  const result = await retrievalChain.invoke({ input: question });

  const references = Array.isArray(result?.context)
    ? result.context.map((doc) => ({
        docId: doc.metadata?.docId,
        metadata: doc.metadata,
        preview: doc.pageContent?.slice(0, 200),
      }))
    : [];

  return { answer: result.answer, references };
};

/**
 * Ingest a document from a file into Qdrant.
 * @param {string} filePath - Path to the document file.
 * @param {string} docId - Document ID for metadata.
 * @param {string} collectionName - Qdrant collection name.
 */
export const ingestDocumentFromFile = async (
  filePath,
  docId,
  collectionName
) => {
  const loader = new TextLoader(filePath);
  const docs = await loader.load();
  await ingestDocuments(docs, docId, collectionName);
  console.log(
    `File ${filePath} (docId: ${docId}) ingested into collection '${collectionName}'.`
  );
};

/**
 * Ingest a document from text into Qdrant.
 * @param {string} text - Document content.
 * @param {string} docId - Document ID for metadata.
 * @param {string} collectionName - Qdrant collection name.
 */
export const ingestDocumentFromText = async (text, docId, collectionName) => {
  const docs = [{ pageContent: text, metadata: { docId } }];
  await ingestDocuments(docs, docId, collectionName);
  console.log(
    `Text document (docId: ${docId}) ingested into collection '${collectionName}'.`
  );
};

/**
 * Helper to split and ingest documents into Qdrant.
 * @private
 */
const ingestDocuments = async (docs, docId, collectionName) => {
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });
  const splits = await textSplitter.splitDocuments(docs);

  splits.forEach((doc) => {
    doc.metadata = { ...(doc.metadata || {}), docId };
  });

  await QdrantVectorStore.fromDocuments(splits, embeddings, {
    client: qdrantClient,
    collectionName,
  });
};

/**
 * List all unique documents in a collection.
 * @param {string} collectionName - Qdrant collection name.
 * @returns {Promise<Array>}
 */
export const listDocuments = async (collectionName) => {
  const result = await qdrantClient.scroll(collectionName, {
    with_payload: true,
    limit: 10000,
  });
  const docs = (result.points || [])
    .map((pt) => ({
      docId: pt.payload?.metadata?.docId,
      metadata: pt.payload?.metadata,
      id: pt.id,
      preview: pt.payload?.content?.slice(0, 200) + "...",
    }))
    .filter((d) => d.docId);

  const unique = Object.values(
    docs.reduce((acc, d) => {
      acc[d.docId] = d;
      return acc;
    }, {})
  );
  return unique;
};

/**
 * Get all chunks for a document by docId.
 * @param {string} collectionName - Qdrant collection name.
 * @param {string} docId - Document ID.
 * @returns {Promise<Object|null>}
 */
export const getDocument = async (collectionName, docId) => {
  const result = await qdrantClient.scroll(collectionName, {
    with_payload: true,
    filter: { must: [{ key: "metadata.docId", match: { value: docId } }] },
    limit: 1000,
  });
  if (!result.points?.length) return null;
  const first = result.points[0];
  return {
    docId,
    metadata: first.payload?.metadata,
    id: first.id,
    preview: first.payload?.content?.slice(0, 200) + "...",
    chunks: result.points.map((pt) => ({
      id: pt.id,
      metadata: pt.payload?.metadata,
      pageContent: pt.payload?.content,
    })),
  };
};

/**
 * Upsert (insert or update) a document by docId.
 * @param {string} text - Document content.
 * @param {string} docId - Document ID.
 * @param {string} collectionName - Qdrant collection name.
 */
export const upsertDocument = async (text, docId, collectionName) => {
  await deleteDocument(docId, collectionName);
  await ingestDocumentFromText(text, docId, collectionName);
};

/**
 * Delete all chunks for a document by docId.
 * @param {string} docId - Document ID.
 * @param {string} collectionName - Qdrant collection name.
 */
export const deleteDocument = async (docId, collectionName) => {
  const result = await qdrantClient.scroll(collectionName, {
    with_payload: false,
    filter: { must: [{ key: "metadata.docId", match: { value: docId } }] },
    limit: 1000,
  });
  if (result.points?.length) {
    const ids = result.points.map((pt) => pt.id);
    await qdrantClient.delete(collectionName, { points: ids });
  }
};
