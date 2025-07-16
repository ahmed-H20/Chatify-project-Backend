# Chatify Backend

Chatify is a real-time, AI-integrated messaging backend service powering the Chatify app. Built with Node.js and Express.js, the backend handles user authentication, session management, chat messaging, audio processing, and integration with AI models.

---

## 🔧 Key Features

- **User Authentication**
  - OTP-based login
  - JWT token system

- **Chat Management**
  - WebSocket support using Socket.IO
  - Real-time message exchange
  - Typing indicators and status tracking

- **AI Integration**
  - Gemini API for chat and translation
  - Text-to-speech and speech-to-text features

- **Content Analysis**
  - Safe-link classifier using ML model
  - Language detection and translation APIs

---

## 🧱 Tech Stack

- **Backend Framework**: Node.js, Express.js
- **Database**: MongoDB
- **Real-time Engine**: Socket.IO
- **Authentication**: JWT, OTP
- **AI & NLP**: Gemini API, Custom Classifier
- **Deployment**: Render / Railway / VPS

---

## 📡 APIs EndPoints

Below is a summary of the main API endpoints organized by module.

---

### 🔐 Auth APIs

| Endpoint | Method | Description |
|---------|--------|-------------|
| `/api/v1/auth/signup` | POST | Create a new user account |
| `/api/v1/auth/verify-email` | POST | Verify email using OTP |
| `/api/v1/auth/login` | POST | Login with email & password |
| `/api/v1/auth/logout` | POST | Logout a user |
| `/api/v1/auth/google` | POST | Login via Google OAuth |
| `/api/v1/auth/forgetPassword` | POST | Send reset code to email |
| `/api/v1/auth/verifyResetPassword` | POST | Verify reset password code |
| `/api/v1/auth/resetPassword` | POST | Set new password |
| `/api/v1/auth/change-password` | PUT | Change password (logged-in) |
| `/api/v1/auth/resend-code` | POST | Resend email verification code |
| `/api/v1/checkAuth` | GET | Check if user is authorized |

---

### 📸 Story APIs

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/story/createStory` | POST | Create a new story |
| `/api/v1/story/status/` | GET | Get all story statuses |
| `/api/v1/story/user/:userId` | GET | Get stories for a specific user |
| `/api/v1/story/deleteStory/:storyId` | DELETE | Delete a story |

---

### 💬 Chat APIs

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/message/sendMessage/:conversationId` | POST | Send a message |
| `/api/v1/message/getMessages/:conversationId` | GET | Get all messages in conversation |
| `/api/v1/message/getMessages/:userId` | GET | Get messages for user |
| `/api/v1/message/getMessage/:messageId` | GET | Get a specific message (test purpose) |

---

### 🗨️ Conversation APIs

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/conversation/allPrivateConversation` | GET | Get all private conversations |
| `/api/v1/conversation/privateConversation/:userId` | GET | Get private conversation for a user |
| `/api/v1/conversation/room/:id1-:id2` | GET | Get conversation room between 2 users |

## 🔐 Environment Variables (`.env`)

```env
PORT=5000
JWT_SECRET=your_jwt_secret
MONGO_URI=mongodb://localhost:27017/chatify
GEMINI_API_KEY=your_gemini_api_key
```

---

## ⚙️ Setup

1. Clone the repository and navigate to the backend folder:

```bash
cd backend
npm install
```

2. Add your `.env` file as shown above.

3. Run the server:

```bash
npm run dev
```

The server will run at [https://chatify-project-backend.vercel.app](https://chatify-project-backend.vercel.app)

---

## 🤝 Contributors

- Ahmed Hesham (Developer)

---

## 📃 License

Private freelance backend system. For reuse or resale, please contact the developer.

