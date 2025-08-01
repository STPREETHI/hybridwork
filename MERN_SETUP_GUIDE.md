# Complete MERN Stack Hybrid Work Planner Setup Guide

## 🚀 Project Structure
```
hybrid-work-planner/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── utils/
│   │   └── styles/
│   ├── public/
│   └── package.json
├── server/                 # Node.js Backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── sockets/
│   └── package.json
├── shared/                 # Shared types/utils
└── README.md
```

## 📋 Prerequisites
- Node.js 18+ and npm
- MongoDB (local or Atlas)
- Git
- Gmail account (for email notifications)

## 🛠️ Setup Instructions

### 1. Clone and Initialize Project
```bash
# Create project directory
mkdir hybrid-work-planner
cd hybrid-work-planner

# Initialize git
git init

# Create main directories
mkdir client server shared
```

### 2. Backend Setup (server/)
```bash
cd server
npm init -y

# Install dependencies
npm install express mongoose cors dotenv bcryptjs jsonwebtoken
npm install socket.io nodemailer axios
npm install --save-dev nodemon concurrently
```

### 3. Frontend Setup (client/)
```bash
cd ../client
npx create-react-app . --template typescript
npm install socket.io-client axios react-router-dom
npm install @tailwindcss/forms tailwindcss postcss autoprefixer
npm install lucide-react react-hot-toast
npm install @headlessui/react @heroicons/react
```

### 4. Environment Variables

**server/.env**
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hybridwork
JWT_SECRET=your_jwt_secret_here_make_it_strong
JWT_EXPIRE=7d

# Gmail SMTP (Free)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-app-password

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Weather API (Free)
WEATHER_API_KEY=get_from_openweathermap_free_tier
OFFICE_LOCATION=New York,US

# OpenAI or HuggingFace (Optional)
OPENAI_API_KEY=your_openai_key_or_leave_empty
HUGGINGFACE_API_KEY=your_hf_key_or_leave_empty
```

**client/.env**
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
```

## 🗄️ Database Models (MongoDB Schemas)

### User Model (server/models/User.js)
```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['employee', 'manager', 'admin'], 
    default: 'employee' 
  },
  department: { type: String, required: true },
  avatar: { type: String, default: '' },
  isOnline: { type: Boolean, default: false },
  lastSeen: { type: Date, default: Date.now },
  preferences: {
    emailNotifications: { type: Boolean, default: true },
    workDays: [{ type: String, enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'] }]
  }
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
```

### Schedule Model (server/models/Schedule.js)
```javascript
const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  week: { type: String, required: true }, // YYYY-WW format
  schedule: {
    monday: { type: String, enum: ['wfo', 'wfh', 'off'], default: 'wfh' },
    tuesday: { type: String, enum: ['wfo', 'wfh', 'off'], default: 'wfh' },
    wednesday: { type: String, enum: ['wfo', 'wfh', 'off'], default: 'wfh' },
    thursday: { type: String, enum: ['wfo', 'wfh', 'off'], default: 'wfh' },
    friday: { type: String, enum: ['wfo', 'wfh', 'off'], default: 'wfh' }
  }
}, { timestamps: true });

scheduleSchema.index({ user: 1, week: 1 }, { unique: true });

module.exports = mongoose.model('Schedule', scheduleSchema);
```

### Poll Model (server/models/Poll.js)
```javascript
const mongoose = require('mongoose');

const pollSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  department: { type: String, required: true },
  options: [{
    text: { type: String, required: true },
    votes: [{ 
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      emoji: { type: String, default: '👍' }
    }]
  }],
  expiresAt: { type: Date, required: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Poll', pollSchema);
```

## 🎯 API Routes

### Auth Routes (server/routes/auth.js)
```javascript
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, department } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ name, email, password, role, department });
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE
    });

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE
    });

    // Update online status
    user.isOnline = true;
    await user.save();

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get current user
router.get('/me', protect, async (req, res) => {
  res.json({ success: true, user: req.user });
});

module.exports = router;
```

## 🔄 Socket.IO Implementation

### Socket Server (server/sockets/socketHandlers.js)
```javascript
const User = require('../models/User');

const handleConnection = (io) => {
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Join user to their department room
    socket.on('join-department', (department) => {
      socket.join(department);
      socket.to(department).emit('user-online', socket.userId);
    });

    // Handle schedule updates
    socket.on('schedule-updated', (data) => {
      socket.to(data.department).emit('schedule-changed', data);
    });

    // Handle poll votes
    socket.on('poll-vote', (data) => {
      socket.to(data.department).emit('poll-updated', data);
    });

    // Handle user status
    socket.on('user-status', async (userId) => {
      await User.findByIdAndUpdate(userId, { 
        isOnline: true, 
        lastSeen: new Date() 
      });
      
      socket.userId = userId;
      socket.broadcast.emit('user-online', userId);
    });

    // Handle disconnect
    socket.on('disconnect', async () => {
      if (socket.userId) {
        await User.findByIdAndUpdate(socket.userId, { 
          isOnline: false, 
          lastSeen: new Date() 
        });
        socket.broadcast.emit('user-offline', socket.userId);
      }
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};

module.exports = handleConnection;
```

## 🎨 Frontend Components

### Main App Component (client/src/App.tsx)
```typescript
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { io, Socket } from 'socket.io-client';

import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import ProtectedRoute from './components/ProtectedRoute';

const socket: Socket = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000');

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50">
      <AuthProvider>
        <SocketProvider socket={socket}>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
            </Routes>
          </Router>
          <Toaster position="top-right" />
        </SocketProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
```

### Tailwind Config (client/tailwind.config.js)
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          900: '#1e3a8a',
        },
        pink: {
          50: '#fdf2f8',
          100: '#fce7f3',
          500: '#ec4899',
          600: '#db2777',
        },
        wfo: '#3b82f6',  // Blue for Work From Office
        wfh: '#10b981',  // Green for Work From Home
        off: '#6b7280',  // Gray for Day Off
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
```

## 🚀 Running the Application

### Package.json Scripts

**server/package.json**
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "client": "cd ../client && npm start",
    "dev:full": "concurrently \"npm run dev\" \"npm run client\""
  }
}
```

### Start Commands
```bash
# Install all dependencies
cd server && npm install
cd ../client && npm install

# Start MongoDB (if local)
mongod

# Start development (from server directory)
npm run dev:full

# Or start separately:
# Terminal 1: cd server && npm run dev
# Terminal 2: cd client && npm start
```

## 🔑 Free API Integrations

### Weather Integration (OpenWeatherMap Free Tier)
```javascript
// server/utils/weather.js
const axios = require('axios');

const getWeather = async (location) => {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${process.env.WEATHER_API_KEY}&units=metric`
    );
    return response.data;
  } catch (error) {
    console.error('Weather API error:', error);
    return null;
  }
};

module.exports = { getWeather };
```

### Email Notifications (Nodemailer + Gmail)
```javascript
// server/utils/email.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransporter({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendReminder = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html
    });
  } catch (error) {
    console.error('Email send error:', error);
  }
};

module.exports = { sendReminder };
```

## 📱 Additional Features Code

I'll provide the complete implementation for:
- AI Work Assistant with HuggingFace
- Team Motivation Board
- Anonymous Feedback System
- Leaderboard Component
- Real-time notifications

Would you like me to continue with the complete code for these features?

## 🔐 Security Notes
- Always use environment variables for sensitive data
- Implement rate limiting for APIs
- Validate all inputs
- Use HTTPS in production
- Keep dependencies updated

## 🚀 Deployment
- Frontend: Netlify/Vercel
- Backend: Heroku/Railway/Render
- Database: MongoDB Atlas (free tier)
- File Storage: Cloudinary (free tier)