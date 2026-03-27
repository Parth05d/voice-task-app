# ⚙️ Complete Setup Guide

Follow these instructions to run the **Voice-First Task App** locally on your machine. 

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
1. **Node.js**: (v18+ recommended) [Download Node.js](https://nodejs.org/)
2. **Git**: [Download Git](https://git-scm.com/)
3. A terminal or command line interface (e.g., VS Code integrated terminal, Command Prompt, or iTerm).

---

## 🚀 1. Clone & Install Dependencies

First, open your terminal and navigate to the project directory:

```bash
# If you haven't cloned the repository, do so:
# git clone <repository-url>
cd "Voice Task App"
```

The application is split into two folders: `client` (Frontend) and `server` (Backend). You need to install dependencies for both.

**Install Backend Dependencies:**
```bash
cd server
npm install
cd ..
```

**Install Frontend Dependencies:**
```bash
cd client
npm install
cd ..
```

---

## 🔑 2. Environment Variables Configuration

You need to set up free accounts for three external services: **MongoDB**, **Supabase**, and **Groq**. 

### A. MongoDB Atlas (Database)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) and create a free account.
2. Create a **New Cluster** (M0 Free tier).
3. Under **Database Access**, create a user and password. Note these down.
4. Under **Network Access**, click **Add IP Address** and choose **Allow Access from Anywhere**.
5. Go to **Database** -> **Connect** -> **Drivers** (Node.js) and copy the connection string.
6. It looks like: `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`
7. Replace `<username>` and `<password>` with the credentials from step 3. 

### B. Supabase (Authentication)
1. Go to [Supabase](https://supabase.com/) and create a free project.
2. In the dashboard, click the **Settings** (gear icon) -> **API**.
3. Under **Project URL**, copy the URL.
4. Under **Project API Keys**, copy both the `anon` (public) and `service_role` (secret) keys.
5. In Supabase, go to **Authentication -> Settings** and ensure **Enable Email Signup** is toggled ON.

### C. Groq (AI Inference)
1. Go to [GroqCloud Console](https://console.groq.com/).
2. Navigate to **API Keys** and click **Create API Key**.
3. Copy the generated key (starts with `gsk_`).

---

### D. Creating the `.env` Files

Now, create the `.env` files in both the `server` and `client` directories.

**In the `server` directory:**
Create a file named `.env` (`server/.env`) and add the following:
```env
PORT=3001
CLIENT_URL=http://localhost:5173

# Paste your MongoDB connection string here (replace <username> and <password>)
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/voicetasks?retryWrites=true&w=majority

# Supabase Keys
SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL
SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY_SECRET

# Groq API Key
GROQ_API_KEY=YOUR_GROQ_API_KEY
```

**In the `client` directory:**
Create a file named `.env` (`client/.env`) and add the following:
```env
# The URL where your backend is running
VITE_API_URL=http://localhost:3001/api

# Ensure you use your front-end accessible Supabase URL and Anon Key
VITE_SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_PUBLIC_KEY
```

---

## 🚦 3. Running the Application Locally

You need two separate terminal windows (or tabs) to run both the frontend and backend servers simultaneously.

**Terminal 1: Start the Backend Server**
```bash
cd server
npm run dev
```
*You should see a message saying "Server on port 3001" and "MongoDB Connected".*

**Terminal 2: Start the Frontend Client**
```bash
cd client
npm run dev
```
*You should see a message indicating Vite is running and accessible at `http://localhost:5173`.*

---

## 🎉 4. Using the App

1. Open your browser and navigate to `http://localhost:5173/`.
2. Register a new account via the login screen.
3. Allow Chrome/Edge microphone permissions when prompted for voice tasks.
4. Start speaking and watch your tasks magically appear!

**Troubleshooting:**
- **Cannot GET /** on the backend port: This is normal as the backend only serves `/api/...` routes.
- **Voice not working:** Ensure you are using a Chromium-based browser (Chrome, Edge) as the Web Speech API is best supported there, and that you have granted microphone permissions.
