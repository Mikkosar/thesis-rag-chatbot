# 🖥️ Data Manager FE – RAG Chatbot Admin UI

> Bachelor’s Thesis Project – Haaga-Helia University of Applied Sciences  
> Supporting tool for managing chatbot knowledge and testing the RAG backend

This repository contains the frontend admin interface for the thesis project
“The Possibilities of Artificial Intelligence in Supporting Learning – Chatbot for Special Needs Students”.

While the backend is the main focus of the project, this frontend was built as a supporting tool.
It enables administrators to manage the chatbot’s knowledge base and to test the AI in real time.

---

## 🌟 Purpose

- **Knowledge Management**: Create, edit, and delete text chunks that power the RAG pipeline.
- **AI-Assisted Tools**: Split long documents into smaller chunks with the help of AI.
- **Chat Testing**: Test the chatbot in both streaming and non-streaming modes.

---

## 🏗️ Tech Stack

- React 19 + Vite
- TypeScript
- Redux Toolkit
- Axios
- React Router
- AI SDK (streaming chat)

---

## 📂 Project Structure

The project includes, among others, the following parts:
```
src/
├── components/   # UI components: navigation, chat, CRUD forms, etc.
├── reducer/      # Redux slices and state management logic
├── services/     # API service modules for backend communication
├── types/        # Includes typings for both chunks and chat
├── app.ts        # Main application entry point
└── hooks         # Custom React hooks
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18 or newer
- Running backend server

### Installation
Install dependencies:
```bash
npm install
```

Add a `.env` file at the project root:
```env
VITE_BASE_URL=http://localhost:3000
```

Start the dev server (defaults to `http://localhost:5173`):
```bash
npm run dev
```

Build for production:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

---

## 🔗 API Endpoints

The frontend communicates with the backend using the following endpoints:

### Chunks
- `GET /chunk`
- `POST /chunk`
- `PUT /chunk/:id`
- `DELETE /chunk/:id`
- `POST /chunk/multiple`

### Chat
- `POST /chat`
- `POST /chat/stream`

---

## 🎯 Thesis Context

This admin interface was implemented as part of a Haaga-Helia University of Applied Sciences bachelor’s thesis:
“The Possibilities of Artificial Intelligence in Supporting Learning – Chatbot for Special Needs Students”.

While the backend RAG system is the primary target of the research and implementation, this frontend complements it by providing:

- Easy management for administrators
- The ability to continuously update the chatbot’s knowledge base
- A real-time testing environment

---

## 🧪 Development Features

- React 19 with hot reload
- Strict TypeScript setup
- ESLint for code quality
- Modular component architecture
- Streaming AI chat integration
