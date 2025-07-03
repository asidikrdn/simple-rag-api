# Simple RAG API

A simple Retrieval-Augmented Generation (RAG) API using Gemini, LangChain, and Qdrant. Supports document ingestion, retrieval, update, and deletion with API key authentication.

## Features

- Ingest documents (text or file) to Qdrant vector DB
- Ask questions (RAG) with Gemini LLM
- List, get, update (upsert), and delete documents by `docId`
- API key authentication
- File upload support
- Docker & docker-compose ready
- Modular codebase for easy extension
- Logging and error handling for debugging

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Environment Variables](#2-environment-variables)
- [Running Locally](#3-running-locally)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [Error Handling](#error-handling)
- [Postman Collection](#postman-collection)
- [Contributing](#contributing)
- [Author](#author)
- [License](#license)

## Project Structure

Struktur direktori utama project ini:

```text
simple-rag-api/
├── src/
│   ├── config/           # Dotenv configuration
│   ├── controllers/      # API endpoint handlers
│   ├── middlewares/      # Middlewares (auth, upload, etc.)
│   ├── routes/           # API routing
│   ├── services/         # Business logic (RAG, Qdrant, Gemini, etc.)
│   ├── utils/            # Helper utilities (env, langchain, etc.)
│   └── server.js         # Application entry point
├── uploads/              # Document upload folder
├── Dockerfile
├── docker-compose.yml
├── .env.example
├── eslint.config.json
├── package.json
├── LICENSE
├── README.md
└── postman_collection.json
```

- **src/config/**: Dotenv and environment configuration.
- **src/controllers/**: REST API endpoint handlers.
- **src/middlewares/**: Middlewares for authentication, file upload, etc.
- **src/routes/**: API routing definitions.
- **src/services/**: Core business logic (Qdrant, Gemini integration, etc).
- **src/utils/**: Utility functions (env, langchain, etc).
- **uploads/**: File upload folder (ignored by git & docker).
- **Dockerfile & docker-compose.yml**: For Docker-based deployment.
- **.env.example**: Example environment variable configuration.

## Quick Start

### 1. Clone & Install

```bash
# Clone repo
$ git clone <repo-url>
$ cd simple-rag-api

# Install dependencies
$ npm install
```

### 2. Environment Variables

Copy `.env.example` to one of the following files depending on your environment:

- `.env.development.local` for local development
- `.env.production.local` for production

Example commands:

```bash
cp .env.example .env.development.local
# or
cp .env.example .env.production.local
```

Edit the selected file as needed for your configuration.

### 3. Running Locally

Start the server locally with:

```bash
npm run local:dev
```

> **Note:**  
> The `Dockerfile` is only used to build the image if you want to run the application in production with Docker.

### 4. Running with Docker

Build and run the application using Docker Compose:

```bash
docker-compose up -d
```

## API Endpoints

All endpoints require `x-api-key` header.

### Ingest Document (Text)

```text
POST /api/rag/:collectionName/ingest/text
Content-Type: application/json
x-api-key: <your_api_key>
{
  "text": "Isi dokumen...",
  "docId": "doc-001"
}
```

### Ingest Document (File)

```text
POST /api/rag/:collectionName/ingest/file
Content-Type: multipart/form-data
x-api-key: <your_api_key>
file: <file>
docId: <doc-001>
```

### List Documents

```text
GET /api/rag/:collectionName/documents
x-api-key: <your_api_key>
```

### Get Document by docId

```text
GET /api/rag/:collectionName/documents/:docId
x-api-key: <your_api_key>
```

### Update/Upsert Document

```text
PUT /api/rag/:collectionName/documents/:docId
Content-Type: application/json
x-api-key: <your_api_key>
{
  "text": "Isi dokumen baru..."
}
```

### Delete Document

```text
DELETE /api/rag/:collectionName/documents/:docId
x-api-key: <your_api_key>
```

### Ask Question (RAG)

```text
POST /api/rag/:collectionName/ask
Content-Type: application/json
x-api-key: <your_api_key>
{
  "question": "Apa isi dokumen ini?"
}
```

## Authentication

All API requests must include the `x-api-key` header with a valid API key as specified in your environment variables.

## Error Handling

API responses use standard HTTP status codes. On error, the response body contains a JSON object with an `error` message. Example:

```json
{
  "error": "Document not found"
}
```

## Postman Collection

Import `postman_collection.json` into Postman to try all endpoints.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for improvements or bug fixes.

## License

[ISC License](LICENSE.md)

---

**Author:** Ahmad Sidik Rudini
