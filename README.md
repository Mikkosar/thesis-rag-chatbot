## 🎓 RAG Chatbot for Educational Support – Thesis Project

Bachelor’s Thesis Project – Haaga-Helia University of Applied Sciences
Exploring AI’s potential to support learning – Chatbot for special needs students

This repository contains a full-stack monorepo for a Retrieval-Augmented Generation (RAG) based AI chatbot. The system was developed as a functional bachelor’s thesis project at Haaga-Helia University of Applied Sciences, with a primary focus on special needs students, while remaining accessible to all learners.

**⚡ The core of this thesis project is the backend service** – a RAG-powered REST API implementing the chatbot logic, vector search, and AI integration.
The frontend serves as a supporting admin interface, allowing knowledge management and testing of the chatbot in real time.

### 🌟 Key Objectives

- **Backend-Centric Development**: Design and implement a robust RAG-enabled API as the main contribution of the thesis.
- **Special Needs Focus**: Provide an accessible AI assistant tailored for diverse learning needs.
- **Educational Accessibility**: Ensure all students benefit from the chatbot’s empathetic and supportive communication style.
- **Configurable Deployment**: Institutions can connect their own MongoDB database and knowledge base with minimal setup.
- **Practical Research Tool**: Demonstrate how RAG-based AI systems can enhance learning support in higher education.

### 🏗️ Repository Structure

This monorepo includes both backend and frontend projects, with backend as the primary deliverable:

```
.
├── rag-chatbot-be/      # RAG Chatbot REST API (main focus of thesis)
│   └── README.md        # Comprehensive backend documentation
├── data-manager-fe/     # Data Manager Admin UI (supporting tool)
│   └── README.md        # Frontend documentation
└── README.md            # Root-level overview (this file)
```

### 🔧 Technologies

**Backend (Main Focus)**

- Node.js + Express.js
- TypeScript
- MongoDB (Atlas) with Mongoose ODM
- OpenAI API (LLM + embeddings)
- Custom Vector Search & Chunking
- JWT Authentication & Security

**Frontend (Supporting Tool)**

- React 19 + Vite
- TypeScript
- Redux Toolkit
- AI SDK for Streaming Chat
- Axios + React Router

### 📚 Subproject Documentation

**Backend – RAG Chatbot REST API**

- Main focus of the thesis: Implements chatbot logic, RAG pipeline, authentication, and vector search.

**Frontend – Data Manager Admin UI**

- Supporting tool: Provides a management dashboard for editing knowledge chunks and testing the chatbot.

### 🚀 Quick Start (Monorepo)

**Prerequisites**

- Node.js (v18+)
- MongoDB Atlas account
- OpenAI API key

**Clone the repository**

```bash
git clone <repository-url>
cd thesis-rag-chatbot
```

**Setup Backend (Main Focus)**

```bash
cd rag-chatbot-be
npm install
cp .env.example .env   # configure MongoDB, OpenAI API key, JWT secret, PORT
npm run dev
```

**Setup Frontend (Optional Admin UI)**

```bash
cd data-manager-fe
npm install
cp .env.example .env   # set backend base URL (e.g., http://localhost:3000/api)
npm run dev
```

- Backend runs on `http://localhost:3000` (or the `PORT` set in `.env`)
- Frontend runs on `http://localhost:5173`

### 🎯 Thesis Context

This project was developed as part of a Bachelor’s Thesis at Haaga-Helia University of Applied Sciences, titled:
“The Possibilities of Artificial Intelligence in Supporting Learning – Chatbot for Special Needs Students”

The thesis emphasizes the design and implementation of the backend RAG-based chatbot system.
The frontend admin interface was developed as a support tool for data management and testing.

### 🔒 Ethics & Accessibility

- **Privacy First**: No personal student data stored.
- **Crisis Detection**: Redirects to appropriate support services if needed.
- **Inclusive Design**: Clear, empathetic communication, accessible for diverse learners.
- **Academic Integrity**: Guides learning, does not complete assignments.

### 🧪 Development Highlights

- Backend-Centric RAG Pipeline
- Streaming AI responses
- AI-assisted document chunking
- TypeScript strict typing
- Hot reload & DX-friendly setup
- Modular monorepo structure