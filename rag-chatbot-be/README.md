# 🎓 RAG Chatbot for Educational Support

> **Intelligent AI-powered chatbot system designed for special needs students, accessible to all students**

A sophisticated Retrieval-Augmented Generation (RAG) chatbot system that provides personalized educational support, academic guidance, and institutional service information. The system is specifically designed to support special needs students while remaining accessible to all students. It can be easily configured for any educational institution, with Haaga-Helia University serving as a demonstration example.

## 🌟 Features

### 🤖 **Intelligent AI Assistant**
- **Special Needs Focus**: Specifically designed to support special needs students with accessible communication
- **Inclusive Design**: Accessible to all students while prioritizing special needs support
- **Multi-language Support**: Configurable language capabilities (Finnish, English, Swedish, and more)
- **Context-Aware**: Maintains conversation context and provides relevant follow-up suggestions
- **Empathetic Communication**: Designed with student well-being and learning support in mind

### �� **Advanced RAG System**
- **Vector Search**: Semantic search through institutional knowledge base
- **Real-time Information**: Access to up-to-date institutional services and contact information
- **Query Optimization**: Intelligent query processing for better search results

### 🛡️ **Safety & Ethics**
- **Crisis Support**: Automatic redirection to appropriate support services
- **Privacy Protection**: No storage or sharing of personal student information
- **Academic Integrity**: Encourages independent learning without completing assignments
- **Accessibility**: Clear, simple language and comprehensive support for special education needs
- **Inclusive Support**: Designed to accommodate various learning differences and accessibility requirements

## 🏗️ Architecture

### **Tech Stack**
- **Backend**: Node.js with Express.js
- **Language**: TypeScript for type safety
- **Database**: MongoDB with Mongoose ODM
- **AI Integration**: OpenAI API with AI SDK
- **Authentication**: JWT-based user authentication
- **Vector Search**: Custom embedding and similarity search implementation

### **Project Structure**
```
src/
├── config/                 # Database configuration
├── middleware/             # Express middleware (error handling, auth)
├── models/                 # MongoDB data models (User, ChatLog, Chunk)
├── router/                 # API route definitions
│   ├── chat-log.ts             # Handles chat log storage and retrieval
│   ├── chat.ts                 # Chat-related API endpoints and logic
│   ├── chunk.ts                # Document chunking and chunk management
│   ├── index.ts                # Router entry point for API routes
│   └── user.ts                 # User authentication and management
├── services/               # AI integration, embedding and vector search
│   ├── generate-chat/          # Chat generation services
│   ├── stream-chat/            # Real-time chat streaming
│   ├── chunk-creation.ts       # Document chunking for RAG
│   ├── embedding.ts            # Vector embedding generation
│   └── vector-search.ts        # Semantic search functionality
├── types/                  # TypeScript type definitions
├── utils/                  # Utility functions
├── app.ts                  # Express application setup
└── index.ts                # Application entry point
```

## 🚀 Quick Start

### **Prerequisites**
- Node.js (v18 or higher).
- MongoDB Atlas account.
- OpenAI API key.

### **Installation**

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd thesis-rag-chatbot-for-ed
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   PORT=3000
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/rag-chatbot
   OPENAI_API_KEY=your_openai_api_key
   JWT_SECRET=your_jwt_secret_key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:3000`

## 🗄️ Database Configuration (Vector Index Creation)

To enable efficient vector search, you need to create a vector index in your MongoDB database. This can be done by running the following command:
```bash
npm run vector-index
```


## 📚 API Documentation

> **Note!** All endpoints that require authentication expect the request to include an `Authorization` header with the logged-in user's token in the following format:  
>  
> ```
> Authorization: Bearer <token>
> ```
>  
> You can obtain a token by logging in via the `/api/user/login` endpoint. Without a valid token, access is limited to public operations only.

### **Authentication Endpoints**
- `POST /api/user/register` - User registration
    ```json
    {
        "firstName": "John",
        "lastName": "Doe", 
        "email": "john.doe@example.com",
        "password": "securepassword"
    }
    ```
    Returns:
     ```json
    {
        "firstName": "John",
        "lastName": "Doe", 
        "email": "john.doe@example.com",
    }
    ```

 - `POST /api/user/login` - User authentication
    ```json
    {
        "email": "jane.doe@example.com",
        "password": "securepassword"
    }
    ```
    Returns: 
    ```json
    {
        "token": "token...",
        "firstname": "Jane",
        "email": "jane.doe@example.com"
    }
    ```


### **Chat Endpoints**
> **Note!** If you want to take advantage of the real-time chat streaming feature (`POST /api/chat/stream`), I recommend using the [AI SDK](https://sdk.vercel.ai/docs/api-reference/use-chat) `useChat` hook in your frontend. This allows you to receive and display messages to the user in real time, providing a better user experience compared to the traditional non-streaming endpoint (`POST /api/chat`).

## 🧩 Chat Flowchart

```mermaid
flowchart TD

A[Start] --> B[User sends message to /stream route]

B --> C{Messages exist?}
C -->|No| E[Return error: 'Messages are required']
C -->|Yes| F[Format messages for database]

F --> G[Initialize stream]
G --> H{User authenticated?}

H -->|No| I[Skip chat log creation]
H -->|Yes| M[Create or Update ChatLog]

M --> J

I --> J[Call Streamtext]
J --> K[Stream Resonse]
K --> N[Save Resonse and update ChatLog if authenticated]
N --> L[END]

```
- `POST /api/chat/stream` - Stream chat responses (real-time)
    ```json
    {
        "messages": [
            {
                "role": "user",
                "id": "1",
                "parts": [
                    {
                        "type": "text",
                        "text": "Tarvitsen apua opintojen suunnittelussa"
                    }
                ]
            }
        ],
        "chatLogId": "optional-chat-log-id"
    }
    ```
    The `/api/chat/stream` endpoint enables real-time streaming of chat responses. When you send a request to this endpoint, the server streams the assistant's reply back to the client as it is generated, allowing for a more interactive and responsive chat experience. This is especially useful for frontend applications that want to display the assistant's answer incrementally, as it is being produced.
    

    **Authentication and Chat Log Handling:**

    - If the user is authenticated (i.e., the request includes an `Authorization` header with a valid Bearer token), the server will create a new chat log in the database for the conversation. The chat log will include the user's question and the assistant's streamed response.
    - If the request also includes an existing `chatLogId` (and the user is authenticated), the server will append the new question and the assistant's response to the existing chat log in the database, rather than creating a new one.
    - If the user is not authenticated (no valid token), the chat response will still be streamed, but no chat log will be created or updated in the database.

    **Example streaming response:**

    The response is streamed as a sequence of events/messages, not as a single JSON object. The client should be able to handle streamed data (for example, using the [AI SDK's `useChat` hook](https://sdk.vercel.ai/docs/api-reference/use-chat)).

    **Summary:**
    - Real-time streaming of assistant responses.
    - Authenticated users with a Bearer token will have their chat logs created or updated in the database.
    - If a `chatLogId` is provided and valid, the new message and response are appended to the existing log; otherwise, a new log is created.
    - Unauthenticated users receive streamed responses, but no chat logs are saved.

- `POST /api/chat` - Generate chat response (non-streaming)
    ```json
    {
        "messages": [
        {
            "role": "user", 
            "content": "Tarvitsen apua opintojen suunnittelussa"
        }
        ],
        "chatLogId": "optional-chat-log-id"
    }
    ```
    Returns:
    ```json
    {
        "messages": [
        {
            "role": "assistant", 
            "content": "Vastaus"
        }
        ],
        "chatLogId": "optional-chat-log-id"
    }
    ```
    **Authentication and Chat Log Handling:**

    - If the user is authenticated (i.e., the request includes an `Authorization` header with a valid Bearer token), the server will create a new chat log in the database for the conversation. The chat log will include the user's question and the assistant's streamed response.
    - If the request also includes an existing `chatLogId` (and the user is authenticated), the server will append the new question and the assistant's response to the existing chat log in the database, rather than creating a new one.
    - If the user is not authenticated (no valid token), the chat response will still be streamed, but no chat log will be created or updated in the database.

- `GET /api/chatlog` - Get chat logs
    > **Note:**  
    > Authentication is required for this endpoint. You must include a valid Bearer token in the `Authorization` header to access `/api/chatLog`.

    ```json
    [    
        {
            "messages": [
                {
                    "_id": "123123123",
                    "role": "user", 
                    "content": "Tarvitsen apua opintojen suunnittelussa"
                },
                {
                    "_id": "68c0534a46554a9ce57c6f37",
                    "role": "assistant",
                    "content": "Vastaus"
                }
            ],
            "userId": "...",
            "createdAt": "2025-09-24T10:07:19.412Z",
            "id": "..."
        }
    ...
    ]
    ```
- `GET /api/chatlog/:id` - Delete chat log
    > **How does deleting a chat log work?**  
    > To delete a chat log, send a `DELETE` request to `/api/chatLog/:id`, where `:id` is the ID of the chat log you want to remove.  
    > 
    > - **Authentication is required:** You must include a valid Bearer token in the `Authorization` header.  
    > - The server will verify that the chat log belongs to the authenticated user before deleting it.  
    > - If the deletion is successful, the server responds with a confirmation message:
    >     ```json
    >     {
    >         "message": "Chat log deleted successfully"
    >     }
    >     ```
    > - If the chat log does not exist or does not belong to the user, an error will be returned.


### **Data Management**
- `POST /api/chunk` - Create chunks for RAG
    ```json
    {
        "title": "Erityisopetus",
        "content": "Ota näissä tilanteissa matalalla kynnyksellä yhteys erityisopettajaan..."
    }
    ```
    Returns:
    ```json
    {
        "title": "Erityisopetus",
        "content": "Ota näissä tilanteissa matalalla kynnyksellä yhteys erityisopettajaan..."
    }
    ```

- `POST /api/chunk/multiple` - Create chunks from document for RAG using AI
    > **What does this do?**  
    > This endpoint uses AI to automatically split a longer document into smaller, meaningful "chunks" that can be used for retrieval-augmented generation (RAG). You send a long text, and the server returns an array of chunked sections, making it easier to search and retrieve relevant information from large documents.
    ```json
    {
        "text": "Pidempi dokumentti"
    }
    ```
    Returns:
    ```json
    {
        "chunks": [
            {
                "chunk": "Ota yhteys erityisopettajaan, kun tarvitset apua..."
            },
            {
                "chunk": "Voit varata ajan erityisopettajalle helposti verkossa..."
            }
        ]
    }
    ```

- `GET /api/chunk` - Search document chunks
    > **What does this do?**  
    > This endpoint returns all document chunks stored in the database. It allows you to retrieve the full list of available chunks, which can be useful for browsing, searching, or managing the knowledge base used for retrieval-augmented generation (RAG).

- `GET /api/ping` - Health check endpoint

## 🔧 Configuration

### **Environment Variables**
| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `PORT` | Server port | No | 3000 |
| `MONGO_URI` | MongoDB connection string | Yes | - |
| `OPENAI_API_KEY` | OpenAI API key | Yes | - |
| `JWT_SECRET` | JWT signing secret | Yes | - |


### **AI Model Configuration**
The system uses OpenAI's GPT models with customizable system prompts designed for educational support, with special focus on accessibility and special needs support. The AI assistant can be configured for any institution with:

- **Personality**: Empathetic, patient, and encouraging (configurable)
- **Communication**: Multi-language support (Finnish, English, Swedish, and more)
- **Accessibility**: Clear, simple language designed for special needs students
- **Scope**: Configurable institutional services and academic support
- **Safety**: Built-in crisis detection and support redirection
- **Academic Integrity**: Refuses to complete assignments but guides learning
- **Special Needs Support**: Tailored responses for various learning differences and accessibility needs

*Note: The current configuration demonstrates Haaga-Helia University integration as an example, with special focus on supporting special needs students while remaining accessible to all students.*

### **Institution Configuration**
To adapt the chatbot for your own educational institution:

1. **Update AI Prompts**: Modify prompts in `src/types/ai-prompts.ts` to reflect your institution's services and policies
2. **Configure Knowledge Base**: Replace Haaga-Helia specific content with your institution's documentation
3. **Language Settings**: Configure supported languages based on your institution's needs

### **Vector Search Setup**
- Uses MongoDB Atlas Vector Search for semantic document retrieval
- Documents are chunked and embedded using OpenAI embeddings
- Vector index: `vector_index` on `embedding` field
- Search configuration: 10 candidates, 5 results limit

## 🧪 Development

### **Available Scripts**
```bash
npm run dev          # Start development server with hot reload (tsx watch)
npm run build        # Build TypeScript to JavaScript
npm run start        # Start production server
```

### **Code Quality**
- **TypeScript**: Strict type checking enabled
- **Modular Architecture**: Clean separation of concerns
- **Error Handling**: Comprehensive error management with custom error types
- **Authentication**: JWT-based with bcrypt password hashing
- **Database**: Mongoose ODM with proper schema validation

### **Development Features**
- Hot reload with tsx
- Path aliases (`@/*` for src directory)
- Comprehensive error handling
- Request logging
- CORS enabled for frontend integration

## 🔒 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Request validation and sanitization
- **Error Handling**: Secure error responses without sensitive data exposure
- **CORS Configuration**: Controlled cross-origin resource sharing

*This project is part of a thesis on RAG-based educational chatbots for university student support, with special focus on supporting special needs students. The system is designed to be easily configurable for any educational institution, with Haaga-Helia University serving as a demonstration example.*