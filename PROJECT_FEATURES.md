# 🚀 Project Overview & Features

Welcome to the **Voice-First Task App** – a premium, AI-powered task management platform designed to make capturing and organizing your workflow as effortless as speaking.

## 🛠️ Technology Stack

This application is built using a modern, scalable MERN-style stack augmented with serverless authentication and lightning-fast AI inference.

### Frontend
- **Framework**: [React 18](https://react.dev/) powered by [Vite](https://vitejs.dev/) for rapid development.
- **Language**: [TypeScript](https://www.typescriptlang.org/) for robust and type-safe code.
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) for a utility-first styling approach, combined with custom CSS for a stunning glassmorphism aesthetic.
- **Animations**: [Framer Motion](https://www.framer.com/motion/) for buttery-smooth micro-interactions and page transitions.
- **Data Visualization**: [Recharts](https://recharts.org/) for dynamic, interactive analytics dashboards.
- **Icons**: [Lucide React](https://lucide.dev/) for crisp, consistent iconography.
- **State Management**: Built-in React Context API.
- **HTTP Client**: [Axios](https://axios-http.com/) for streamlined API communication.

### Backend
- **Runtime**: [Node.js](https://nodejs.org/).
- **Framework**: [Express.js](https://expressjs.com/) for RESTful API routing.
- **Language**: [TypeScript](https://www.typescriptlang.org/).
- **Database**: [MongoDB](https://www.mongodb.com/) via [Mongoose](https://mongoosejs.com/) ORM for flexible, document-based data storage.
- **AI Integration**: [Groq SDK](https://groq.com/) for near-instant NLP parsing using massive LLMs like LLaMA 3.
- **File Uploads**: [Multer](https://www.npmjs.com/package/multer) for handling multipart/form-data.

### Authentication & Infrastructure
- **Auth**: [Supabase](https://supabase.com/) for secure, scalable authentication (Email/Password).

---

## ✨ Key Features Implemented

### 1. 🎙️ Voice-to-Text Input
- Leverages the browser's native **Web Speech API** for real-time speech recognition.
- 100% free and runs entirely on the client side, ensuring immediate transcription without network latency.

### 2. 🧠 AI Task Parsing
- The transcribed text is sent to the backend, where it is processed by a high-speed **Groq-hosted LLM**.
- Intelligently extracts structured JSON data: `title`, detailed `description`, and deadlines/due dates.
- Capable of understanding natural language like *"remind me to call John tomorrow at 5 PM"*.

### 3. 🔐 Secure Authentication
- Full user registration and login flow utilizing **Supabase**.
- Protected API endpoints using JWT verification to ensure data privacy.
- Distinct user separation – your tasks are only visible to you.

### 4. 📋 Comprehensive Task Management
- **CRUD Operations**: Create, read, update, and delete tasks.
- **Immutability**: Completed and Cancelled tasks are locked from editing, maintaining data integrity.
- **Delay System**: Custom modal to easily push back task deadlines.
- **Task Confirmation**: A bespoke confirmation flow before tasks are finalized or marked done.

### 5. 📊 Analytics Dashboard
- Interactive charts built with **Recharts** visualizing productivity metrics.
- Displays task completion rates, weekly trends, and active vs. delayed statistics.
- Automatically synchronizes with backend updates.

### 6. 🎨 Premium Modern UI/UX
- **Glassmorphism Aesthetic**: Beautiful transluscent cards, layered depth, and blurred backgrounds.
- **Dark Mode**: High-contrast, sleek design that's easy on the eyes.
- **Micro-Animations**: Fluid staggering lists, hover states, and smooth modal pop-outs via Framer Motion.
- **Responsive Navigation**: A fully mobile-friendly sidebar and grid layout that adapts to any screen size.
