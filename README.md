<p align="center">
  <h1 align="center">🎙️ Vox — Voice-First Task Manager</h1>
  <p align="center">
    An AI-powered task management app that turns your voice into organized, actionable tasks.
    <br />
    <strong>Speak it. Parse it. Track it.</strong>
  </p>

  <p align="center">
    <a href="https://vox-by-parth.vercel.app/"><strong>🌐 Live Demo</strong></a> •
    <a href="https://github.com/Parth05d/voice-task-app"><strong>📂 GitHub Repo</strong></a>
  </p>

  <p align="center">
    <img src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white" />
    <img src="https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white" />
    <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white" />
    <img src="https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white" />
    <img src="https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white" />
    <img src="https://img.shields.io/badge/Supabase-Auth-3ECF8E?logo=supabase&logoColor=white" />
    <img src="https://img.shields.io/badge/Groq-AI-FF6B00" />
  </p>
</p>

---

## 📖 About

**Vox** is a premium, full-stack task management application built with a **voice-first** philosophy.  
Instead of typing, simply speak — the app leverages browser-native speech recognition and a Groq-hosted LLM to intelligently parse your words into structured tasks.

✨ Converts voice into:
- Task Title  
- Description  
- Deadline  

Wrapped in a stunning **glassmorphism dark-mode UI** with smooth animations, it delivers a modern, premium experience across devices.

---

## ✨ Key Features

| Feature | Description |
|--------|------------|
| 🎙️ **Voice-to-Task** | Real-time speech-to-text using Web Speech API |
| 🧠 **AI Parsing** | Converts natural language into structured tasks |
| 🔐 **Authentication** | Secure auth using Supabase (JWT-based) |
| 📋 **Task Management** | Full CRUD with edit, delay, delete, status tracking |
| 📊 **Analytics Dashboard** | Visual insights with charts & productivity metrics |
| 🔔 **Notifications** | Real-time task updates and reminders |
| 🎨 **Premium UI/UX** | Glassmorphism UI, animations, mobile responsive |

---

## 🛠️ Tech Stack

### 🚀 Frontend
- React 18 + Vite  
- TypeScript  
- Tailwind CSS  
- Framer Motion  
- Recharts  
- React Router v6  

### ⚙️ Backend
- Node.js + Express  
- TypeScript  
- MongoDB + Mongoose  
- Groq SDK (LLaMA 3)  
- Multer  

### ☁️ Infrastructure
- Supabase (Authentication)

---

## 📂 Project Structure

```

.
├── client/                # React frontend
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   └── types/
│
├── server/                # Express backend
│   ├── src/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── services/
│
├── README.md

````

---

## 🚀 Getting Started

### ✅ Prerequisites
- Node.js v18+
- Git

---

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Parth05d/voice-task-app.git
cd voice-task-app
````

---

### 2️⃣ Install Dependencies

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

---

### 3️⃣ Environment Setup

Create `.env` files:

#### 📁 server/.env

```env
PORT=3001
CLIENT_URL=http://localhost:5173
MONGODB_URI=your_mongodb_uri
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_key
GROQ_API_KEY=your_groq_key
```

#### 📁 client/.env

```env
VITE_API_URL=http://localhost:3001/api
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_key
```

---

### 4️⃣ Run the App

```bash
# Backend
cd server && npm run dev

# Frontend
cd client && npm run dev
```

Open 👉 [http://localhost:5173](http://localhost:5173)

---

## 🎯 Usage

1. Login / Register
2. Tap 🎙️ and speak
3. Confirm AI-generated task
4. Manage tasks
5. View analytics

> ⚠️ Works best on Chrome / Edge (mic required)

---

## 🌟 Highlights (for recruiters)

* Real-world full-stack architecture
* AI-powered feature (voice → structured tasks)
* Clean UI + animations
* Secure authentication
* Production-ready deployment

<p align="center">
  Built with ❤️ by <a href="https://github.com/Parth05d">Parth Darji</a>
</p>
