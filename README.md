# 🚀 AICH — AI Powered Real-Time Chat Application

AICH is a modern full-stack chat application that combines real-time messaging with an integrated AI assistant. Users can chat with other users, share images, see online status, and use AI directly inside any conversation to rewrite, improve, summarize, or generate content before sending it.

---

## ✨ Features

### 🔐 Authentication

* User Signup & Login
* JWT Authentication
* HTTP-Only Cookie Security
* Protected Routes
* Persistent Login Sessions

### 👤 User Profiles

* Update Profile Information
* Upload Profile Pictures
* Cloudinary Image Storage

### 💬 Real-Time Messaging

* One-to-One Chat
* Instant Message Delivery using Socket.IO
* Online/Offline User Status
* Real-Time Updates Without Refreshing

### 🖼️ Media Sharing

* Send Images in Chat
* Cloudinary Image Uploads
* Preview Before Sending

### 🤖 AI Assistant

Every conversation has its own AI workspace.

Features include:

* AI Chat Sidebar
* Context-Specific AI Conversations
* Rewrite Messages
* Fix Grammar
* Improve Tone
* Summarize Text
* Generate Content
* Insert AI Responses Back Into Chat Input

Example:

Hello bro how are u today? /- Fix grammar

AI Response:

Hello bro, how are you today?

Click the insert button and send it directly.

### 🎨 Modern UI

* Responsive Design
* DaisyUI + Tailwind CSS
* ChatGPT-Style AI Panel
* Resizable AI Sidebar
* Smooth Animations
* Loading Skeletons

---

## 🛠️ Tech Stack

### Frontend

* React
* Zustand
* Tailwind CSS
* DaisyUI
* Axios
* Socket.IO Client
* React Hot Toast

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* Socket.IO
* JWT Authentication
* Cloudinary

### AI

* Gemini API (OpenAI Compatible SDK)

---

## 📁 Project Structure

backend/
├── controllers/
├── middleware/
├── models/
├── routes/
├── lib/
├── server.js

frontend/
├── src/
│ ├── components/
│ ├── pages/
│ ├── store/
│ ├── lib/
│ └── App.jsx

---

## ⚙️ Environment Variables

### Backend (.env)

PORT=5001

MONGODB_URI=your_mongodb_uri

JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name

CLOUDINARY_API_KEY=your_api_key

CLOUDINARY_API_SECRET=your_api_secret

GEMINI_API_KEY=your_gemini_api_key

---

## 🚀 Installation

### Clone Repository

git clone https://github.com/Aditya1-git/AICH---AI-Chat-App

cd aich

### Backend

cd backend

npm install

npm run dev

### Frontend

cd frontend

npm install

npm run dev

---

## 🔌 API Overview

### Authentication

POST /api/auth/signup

POST /api/auth/login

POST /api/auth/logout

GET /api/auth/check

PUT /api/auth/update-profile

### Messages

GET /api/message/users

GET /api/message/:id

POST /api/message/send/:id

### AI

GET /api/ai/:id

POST /api/ai/:id

---

## 🎯 Future Improvements

* Group Chats
* Voice Messages
* Video Calling
* AI Memory
* Conversation Search
* Message Reactions
* Read Receipts
* File Sharing
* AI Generated Images
* AI Conversation Context Memory

---

## 📸 Screenshots

Add screenshots here:

* Login Page
* Chat Interface
* AI Sidebar
* Mobile View

---

## 🤝 Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Open a Pull Request

---

## ⭐ Support

If you found this project useful, consider giving it a star on GitHub.
