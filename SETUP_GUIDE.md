# Comprehensive Setup Guide

This guide will walk you through setting up **MongoDB Atlas**, **Supabase**, and **Groq**, and how to plug their keys into your Voice Task App.

## 1. MongoDB Atlas (Database)
MongoDB Atlas gives you a free, hosted database cluster.

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) and sign up for a free account.
2. Create a **New Cluster** and select the **M0 Free** tier.
3. Once the cluster is created, go to **Database Access** (left sidebar) and create a database user (username and password). Note these down.
4. Go to **Network Access** and click **Add IP Address**. Choose **Allow Access from Anywhere** (or use your specific IP).
5. Go to **Database** > **Connect** > **Drivers** (Node.js).
6. Copy the connection string. It will look something like:
   `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`
7. In the string, replace `<username>` and `<password>` with the user credentials you created in step 3. 
8. Add your custom database name in the URL before `?retryWrites` (e.g., `mongodb+srv://...mongodb.net/voicetasks?retryWrites...`).
9. **Paste this URL** into `server/.env` as `MONGODB_URI`.

---

## 2. Supabase (Authentication & User IDs)
Supabase provides secure user authentication.

1. Go to [Supabase](https://supabase.com/) and create a free project.
2. Wait a minute for the project database to be provisioned.
3. In your project dashboard, go to the **Settings** (gear icon) on the bottom left.
4. Click on **API** in the sidebar. Here you will find your keys:
   - **Project URL**: Start copy-pasting this.
   - **anon / public key**: This goes to the Frontend client.
   - **service_role key**: This secret key goes to the Backend server.
5. In your `client/.env` file, paste:
   - `VITE_SUPABASE_URL=YOUR_PROJECT_URL`
   - `VITE_SUPABASE_ANON_KEY=YOUR_ANON_PUBLIC_KEY`
6. In your `server/.env` file, paste:
   - `SUPABASE_URL=YOUR_PROJECT_URL`
   - `SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY`
   
**Note**: Ensure **Email Authentication** is enabled in Supabase under `Authentication -> Providers`.

---

## 3. Groq (Free Fast AI Inference)
Groq provides blazing fast AI models (like Llama 3) for free, which we use to intelligently extract tasks from your voice.

1. **Note**: The frontend app uses your browser's *built-in* speech recognition (Web Speech API) for the actual Voice-to-Text transcription, which is already 100% free and runs directly in the browser!
2. We use Groq specifically for the **NLP Parsing** (structuring the transcribed text into JSON: title, description, and dates).
3. Go to [GroqCloud Console](https://console.groq.com/).
4. Create an account or log in.
5. Navigate to **API Keys** on the left menu.
6. Click **Create API Key**, give it a name, and copy the key (it starts with `gsk_`).
7. **Paste this key** into your `server/.env` file as `GROQ_API_KEY`.

---

Once you have set all these values in both `.env` files, run `npm install` and then `npm run dev` in both the `server` and `client` directories to start the full stack app!
