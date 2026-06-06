# Aich — Chat App

This repository contains a simple chat application with a Node/Express backend and a React frontend. This README documents what exists in the codebase today — the features you have implemented, how the parts work, and how to run and extend the project.

---

## Quick summary (what you have so far)
- User authentication (signup, login, logout) using JWT stored in an HTTP-only cookie.
- User profile updates with image upload via Cloudinary.
- Contacts list (sidebar) showing other users.
- 1:1 messaging: fetch conversation between two users and send messages (text + optional image).
- Frontend state managed with Zustand stores (`useAuthStore`, `useChatStore`).
- Basic UI components: Sidebar, ChatContainer, ChatHeader, MessageInput, Navbar, skeletons.
- No realtime layer yet (Socket.IO not integrated) — there's a TODO in the backend message controller.

---

## Quick start

Backend

1. Open a terminal and run:

```bash
cd backend
npm install
# set .env variables (see list below)
node server.js
```

Frontend

```bash
cd frontend
npm install
npm run dev
```

By default the frontend expects the backend at `http://localhost:5001/api` (see `frontend/src/lib/axios.js`).

### Required backend environment variables
- `MONGODB_URI` — MongoDB connection string
- `JWT_SECRET` — JWT signing secret
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` — Cloudinary creds
- `PORT` — server port (e.g. `5001`)

---

## Backend — files & how they work

- `server.js` — Express app entry. Configures `express`, `cors`, JSON parsing, `cookie-parser`, mounts routes, and starts server after `connectDB()` from `lib/db.js`.
- `lib/db.js` — `connectDB()` establishes the Mongoose connection using `MONGODB_URI`.
- `lib/cloudinary.js` — Cloudinary v2 configuration for image uploads.
- `lib/utils.js` — `generateToken(userId, res)` creates a JWT and sets it as an `httpOnly` cookie named `jwt` on `res`.
- `middleware/protect.js` — `protect` middleware reads the `jwt` cookie, verifies it, loads the user (without password), and attaches `req.user`.

Models
- `models/userModel.js` — `User` schema: `email`, `fullName`, `password`, `profilePic` with `timestamps`.
- `models/messageModel.js` — `Message` schema: `senderId`, `receiverId`, `text`, `image`, and `timestamps`.

Controllers
- `controllers/authController.js`:
  - `signup(req, res)` — validates input, hashes password with bcrypt, creates a `User`, issues JWT cookie via `generateToken`, and returns user data.
  - `login(req, res)` — authenticates a user and issues JWT cookie.
  - `logout(req, res)` — clears the `jwt` cookie.
  - `updateProfile(req, res)` — protected; uploads a base64 image to Cloudinary and updates `User.profilePic`.
  - `checkAuth(req, res)` — protected; returns `req.user`.

- `controllers/messageController.js`:
  - `getUsersForSidebar(req, res)` — returns all users except the logged-in user.
  - `getMesssagesofaUser(req, res)` — returns all messages between the logged-in user and the user id in `:id`.
  - `sendMessages(req, res)` — accepts `{ text, image }`. If `image` present, uploads to Cloudinary then creates and returns a `Message` document.

Routes
- `routes/authRoute.js` — mounts auth endpoints under `/api/auth` (signup, login, logout, update-profile, check).
- `routes/messageRoute.js` — mounts message endpoints under `/api/message` (users, conversation by id, send/:id).

---

## Frontend — files & how they work

- `src/lib/axios.js` — `axiosInstance` with `baseURL: http://localhost:5001/api` and `withCredentials: true` so cookies are sent.
- `src/lib/utils.js` — small date utility used to format message times (ensure it validates the date input to avoid `Invalid Date`).

Zustand stores
- `src/store/useAuthStore.js` — manages `authUser` and auth flows: `checkAuth()`, `signup()`, `login()`, `logout()`, `updateProfile()`.
- `src/store/useChatStore.js` — manages chat data: `getUsers()`, `getMessages(userId)`, `sendMessage(messageData)`, `setSelectedUser()`.

Key components
- `src/components/Sidebar.jsx` — lists contacts, supports an online-only filter, and calls `setSelectedUser(user)` when a contact is selected.
- `src/components/ChatContainer.jsx` — when a `selectedUser` is set it loads messages via `getMessages(selectedUser._id)` and renders messages, avatars, and the formatted time from `utils.js`.
- `src/components/ChatHeader.jsx` — displays selected user's info and online/offline status.
- `src/components/MessageInput.jsx` — handles composing messages, converting selected images to data-URLs via `FileReader`, and sending them to backend via `sendMessage`.

---

## API reference (quick)

- `POST /api/auth/signup` — body `{ fullName, email, password }` → creates a user, sets cookie, returns user fields.
- `POST /api/auth/login` — body `{ email, password }` → sets cookie, returns user.
- `POST /api/auth/logout` — clears cookie.
- `PUT /api/auth/update-profile` — protected — body `{ profilePic }` (data URL) → updates user picture.
- `GET /api/auth/check` — protected — returns current user.

- `GET /api/message/users` — protected — returns other users for sidebar.
- `GET /api/message/:id` — protected — returns conversation messages between current user and `:id`.
- `POST /api/message/send/:id` — protected — body `{ text?, image? }` — create message to user `:id`.

---

## Notes, current limitations & suggested next steps

- Realtime: Not implemented. Add Socket.IO for live message delivery: emit new message from server after saving and listen on client to append to messages without refreshing.
- Pagination: `getMesssagesofaUser` returns all messages; consider adding pagination for long conversations.
- Large images: Currently images are uploaded as base64 from client to backend then to Cloudinary. For larger files, implement direct upload to Cloudinary or use multipart uploads.
- Validation & UX: Ensure `formateMessageTime` handles invalid inputs to avoid `Invalid Date` (return empty string or placeholder).
- Error handling: API returns `{ message: ... }` on error in many places. Continue to ensure all backend errors include this field for consistent frontend toast messages.

---

## Where to look in code
- Backend: `backend/server.js`, `backend/controllers/*`, `backend/routes/*`, `backend/models/*`, `backend/lib/*`.
- Frontend: `frontend/src/store/*`, `frontend/src/components/*`, `frontend/src/lib/*`.

---

If you'd like, I can:
- Add a short `CONTRIBUTING.md` with steps for adding realtime messaging via Socket.IO.
- Add code snippets for integrating Socket.IO on server and client.
- Add a troubleshooting section for issues you've seen (e.g., `Invalid Date`).

Tell me which of those you'd like next.
