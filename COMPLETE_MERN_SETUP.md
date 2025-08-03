# 🚀 Complete MERN Stack HybridWork Setup Guide

## 📋 Project Overview
A comprehensive hybrid work management system with blue/pink themed UI, real-time collaboration, and free API integrations.

## 🛠️ Tech Stack
- **Frontend**: React + TypeScript + Tailwind CSS (Blue & Pink Theme)
- **Backend**: Node.js + Express + TypeScript
- **Database**: MongoDB with Mongoose
- **Real-time**: Socket.IO
- **Authentication**: JWT + Google OAuth (optional)
- **Email**: Nodemailer with Gmail SMTP (free)
- **Weather**: Open-Meteo API (completely free)
- **File Storage**: Multer + local storage (or Cloudinary free tier)

## 📁 Project Structure
```
hybridwork-mern/
├── client/                     # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/            # Shadcn components
│   │   │   ├── WeatherWidget.tsx
│   │   │   ├── MotivationBoard.tsx
│   │   │   ├── Leaderboard.tsx
│   │   │   ├── AnonymousFeedback.tsx
│   │   │   └── ...
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── utils/
│   │   └── styles/
│   ├── public/
│   └── package.json
├── server/                     # Node.js Backend
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── sockets/
│   │   ├── utils/
│   │   └── types/
│   └── package.json
├── shared/                     # Shared types
└── README.md
```

## 🚀 Step-by-Step Setup

### 1. Create Project Structure
```bash
# Create main directory
mkdir hybridwork-mern
cd hybridwork-mern

# Initialize git
git init

# Create directories
mkdir client server shared
```

### 2. Backend Setup

#### a) Initialize Backend
```bash
cd server
npm init -y

# Install dependencies
npm install express mongoose cors dotenv bcryptjs jsonwebtoken
npm install socket.io nodemailer axios multer helmet morgan
npm install --save-dev @types/node @types/express @types/cors @types/bcryptjs @types/jsonwebtoken @types/multer typescript ts-node nodemon concurrently
```

#### b) Backend Structure
```bash
mkdir -p src/{controllers,models,routes,middleware,sockets,utils,types}
```

#### c) Backend package.json scripts
```json
{
  "scripts": {
    "build": "tsc",
    "start": "node dist/server.js",
    "dev": "nodemon --exec ts-node src/server.ts",
    "client": "cd ../client && npm start",
    "dev:full": "concurrently \"npm run dev\" \"npm run client\""
  }
}
```

#### d) TypeScript config (tsconfig.json)
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### 3. Frontend Setup

#### a) Initialize Frontend
```bash
cd ../client
npx create-react-app . --template typescript

# Install additional dependencies
npm install socket.io-client axios react-router-dom
npm install @tailwindcss/forms tailwindcss postcss autoprefixer
npm install lucide-react react-hot-toast
npm install @radix-ui/react-toast @radix-ui/react-dialog
npm install class-variance-authority clsx tailwind-merge
```

#### b) Setup Tailwind CSS
```bash
npx tailwindcss init -p
```

### 4. Environment Variables

#### server/.env
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hybridwork

# JWT
JWT_SECRET=your_super_secret_jwt_key_make_it_64_characters_long_minimum
JWT_EXPIRE=7d

# Gmail SMTP (Free - use App Password)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-16-character-app-password

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Office Location for Weather
OFFICE_LATITUDE=40.7128
OFFICE_LONGITUDE=-74.0060
OFFICE_LOCATION=New York Office

# OpenAI API (Optional - for enhanced AI features)
OPENAI_API_KEY=your_openai_key_or_leave_empty

# Cloudinary (Optional - for file uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

#### client/.env
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
```

## 🗄️ MongoDB Models

### User Model (server/src/models/User.ts)
```typescript
import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'employee' | 'manager' | 'admin';
  department: string;
  avatar?: string;
  isOnline: boolean;
  lastSeen: Date;
  preferences: {
    emailNotifications: boolean;
    workDays: string[];
  };
  comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
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
    workDays: [{ 
      type: String, 
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'] 
    }]
  }
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(password: string): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

export default mongoose.model<IUser>('User', userSchema);
```

### Schedule Model (server/src/models/Schedule.ts)
```typescript
import mongoose, { Document, Schema } from 'mongoose';

export interface ISchedule extends Document {
  user: mongoose.Types.ObjectId;
  week: string; // YYYY-WW format
  schedule: {
    monday: 'wfo' | 'wfh' | 'off';
    tuesday: 'wfo' | 'wfh' | 'off';
    wednesday: 'wfo' | 'wfh' | 'off';
    thursday: 'wfo' | 'wfh' | 'off';
    friday: 'wfo' | 'wfh' | 'off';
  };
  isSubmitted: boolean;
}

const scheduleSchema = new Schema<ISchedule>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  week: { type: String, required: true },
  schedule: {
    monday: { type: String, enum: ['wfo', 'wfh', 'off'], default: 'wfh' },
    tuesday: { type: String, enum: ['wfo', 'wfh', 'off'], default: 'wfh' },
    wednesday: { type: String, enum: ['wfo', 'wfh', 'off'], default: 'wfh' },
    thursday: { type: String, enum: ['wfo', 'wfh', 'off'], default: 'wfh' },
    friday: { type: String, enum: ['wfo', 'wfh', 'off'], default: 'wfh' }
  },
  isSubmitted: { type: Boolean, default: false }
}, { timestamps: true });

scheduleSchema.index({ user: 1, week: 1 }, { unique: true });

export default mongoose.model<ISchedule>('Schedule', scheduleSchema);
```

### Poll Model (server/src/models/Poll.ts)
```typescript
import mongoose, { Document, Schema } from 'mongoose';

export interface IPoll extends Document {
  title: string;
  description: string;
  createdBy: mongoose.Types.ObjectId;
  department: string;
  options: {
    text: string;
    votes: {
      user: mongoose.Types.ObjectId;
      emoji: string;
    }[];
  }[];
  expiresAt: Date;
  isActive: boolean;
}

const pollSchema = new Schema<IPoll>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  department: { type: String, required: true },
  options: [{
    text: { type: String, required: true },
    votes: [{ 
      user: { type: Schema.Types.ObjectId, ref: 'User' },
      emoji: { type: String, default: '👍' }
    }]
  }],
  expiresAt: { type: Date, required: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model<IPoll>('Poll', pollSchema);
```

### Motivation Post Model (server/src/models/MotivationPost.ts)
```typescript
import mongoose, { Document, Schema } from 'mongoose';

export interface IMotivationPost extends Document {
  author: mongoose.Types.ObjectId;
  message: string;
  type: 'goal' | 'shoutout' | 'motivation';
  likes: mongoose.Types.ObjectId[];
  department: string;
  isAnonymous: boolean;
}

const motivationPostSchema = new Schema<IMotivationPost>({
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true, maxlength: 500 },
  type: { 
    type: String, 
    enum: ['goal', 'shoutout', 'motivation'], 
    required: true 
  },
  likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  department: { type: String, required: true },
  isAnonymous: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model<IMotivationPost>('MotivationPost', motivationPostSchema);
```

### Feedback Model (server/src/models/Feedback.ts)
```typescript
import mongoose, { Document, Schema } from 'mongoose';

export interface IFeedback extends Document {
  message: string;
  category: 'suggestion' | 'concern' | 'praise';
  department: string;
  status: 'new' | 'reviewed' | 'addressed';
  reviewedBy?: mongoose.Types.ObjectId;
  reviewedAt?: Date;
}

const feedbackSchema = new Schema<IFeedback>({
  message: { type: String, required: true, maxlength: 1000 },
  category: { 
    type: String, 
    enum: ['suggestion', 'concern', 'praise'], 
    required: true 
  },
  department: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['new', 'reviewed', 'addressed'], 
    default: 'new' 
  },
  reviewedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  reviewedAt: { type: Date }
}, { timestamps: true });

export default mongoose.model<IFeedback>('Feedback', feedbackSchema);
```

## 🎯 API Routes

### Auth Routes (server/src/routes/auth.ts)
```typescript
import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { protect } from '../middleware/auth';

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
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
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
  } catch (error: any) {
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

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
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
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Get current user
router.get('/me', protect, async (req, res) => {
  res.json({ success: true, user: req.user });
});

// Logout
router.post('/logout', protect, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { isOnline: false });
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
```

### Schedule Routes (server/src/routes/schedules.ts)
```typescript
import express from 'express';
import Schedule from '../models/Schedule';
import { protect } from '../middleware/auth';
import { getWeekNumber } from '../utils/dateUtils';

const router = express.Router();

// Get user's schedule for a specific week
router.get('/week/:week', protect, async (req, res) => {
  try {
    const { week } = req.params;
    
    let schedule = await Schedule.findOne({ 
      user: req.user.id, 
      week 
    });

    if (!schedule) {
      // Create default schedule
      schedule = await Schedule.create({
        user: req.user.id,
        week,
        schedule: {
          monday: 'wfh',
          tuesday: 'wfh', 
          wednesday: 'wfh',
          thursday: 'wfh',
          friday: 'wfh'
        }
      });
    }

    res.json({ success: true, schedule });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Update schedule
router.put('/week/:week', protect, async (req, res) => {
  try {
    const { week } = req.params;
    const { schedule: newSchedule } = req.body;

    const schedule = await Schedule.findOneAndUpdate(
      { user: req.user.id, week },
      { schedule: newSchedule },
      { new: true, upsert: true }
    );

    // Emit real-time update
    req.io?.to(req.user.department).emit('schedule-updated', {
      userId: req.user.id,
      week,
      schedule: newSchedule
    });

    res.json({ success: true, schedule });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Get team schedules
router.get('/team/:week', protect, async (req, res) => {
  try {
    const { week } = req.params;
    
    const schedules = await Schedule.find({ week })
      .populate('user', 'name department role avatar')
      .lean();

    // Filter by department if not admin
    const filteredSchedules = req.user.role === 'admin' 
      ? schedules 
      : schedules.filter(s => s.user.department === req.user.department);

    res.json({ success: true, schedules: filteredSchedules });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
```

## 🔄 Socket.IO Implementation

### Socket Handlers (server/src/sockets/socketHandlers.ts)
```typescript
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import User from '../models/User';

interface AuthenticatedSocket extends Socket {
  user?: any;
}

export const handleConnection = (io: Server) => {
  // Authentication middleware for sockets
  io.use(async (socket: any, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
      const user = await User.findById(decoded.id);
      
      if (!user) {
        return next(new Error('User not found'));
      }

      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket: AuthenticatedSocket) => {
    console.log(`User connected: ${socket.user?.name}`);

    // Join department room
    socket.join(socket.user.department);
    
    // Update user online status
    User.findByIdAndUpdate(socket.user.id, { 
      isOnline: true, 
      lastSeen: new Date() 
    }).exec();

    // Notify department of user online
    socket.to(socket.user.department).emit('user-online', {
      userId: socket.user.id,
      name: socket.user.name
    });

    // Handle schedule updates
    socket.on('schedule-update', (data) => {
      socket.to(socket.user.department).emit('schedule-changed', {
        userId: socket.user.id,
        ...data
      });
    });

    // Handle poll votes
    socket.on('poll-vote', (data) => {
      socket.to(socket.user.department).emit('poll-updated', data);
    });

    // Handle motivation posts
    socket.on('motivation-post', (data) => {
      io.to(socket.user.department).emit('new-motivation-post', {
        ...data,
        author: socket.user.name
      });
    });

    // Handle typing indicators
    socket.on('typing', (data) => {
      socket.to(socket.user.department).emit('user-typing', {
        userId: socket.user.id,
        name: socket.user.name,
        isTyping: data.isTyping
      });
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.user?.name}`);
      
      User.findByIdAndUpdate(socket.user?.id, { 
        isOnline: false, 
        lastSeen: new Date() 
      }).exec();

      socket.to(socket.user?.department).emit('user-offline', {
        userId: socket.user?.id,
        name: socket.user?.name
      });
    });
  });
};
```

## 🌦️ Weather Integration (Free API)

### Weather Service (server/src/utils/weatherService.ts)
```typescript
import axios from 'axios';

export interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
}

export const getWeather = async (): Promise<WeatherData | null> => {
  try {
    const latitude = process.env.OFFICE_LATITUDE || '40.7128';
    const longitude = process.env.OFFICE_LONGITUDE || '-74.0060';
    
    // Using Open-Meteo (completely free, no API key required)
    const response = await axios.get(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m`
    );

    const current = response.data.current_weather;
    const hourly = response.data.hourly;
    
    // Get current hour's humidity
    const currentHour = new Date().getHours();
    const humidity = hourly.relative_humidity_2m[currentHour] || 50;

    const weatherConditions: { [key: number]: string } = {
      0: 'Clear sky',
      1: 'Mainly clear',
      2: 'Partly cloudy',
      3: 'Overcast',
      45: 'Foggy',
      48: 'Depositing rime fog',
      51: 'Light drizzle',
      53: 'Moderate drizzle',
      55: 'Dense drizzle',
      61: 'Slight rain',
      63: 'Moderate rain',
      65: 'Heavy rain',
      80: 'Slight rain showers',
      81: 'Moderate rain showers',
      82: 'Violent rain showers'
    };

    return {
      location: process.env.OFFICE_LOCATION || 'Office',
      temperature: Math.round(current.temperature),
      condition: weatherConditions[current.weathercode] || 'Unknown',
      humidity: Math.round(humidity),
      windSpeed: Math.round(current.windspeed),
      weatherCode: current.weathercode
    };
  } catch (error) {
    console.error('Weather API error:', error);
    return null;
  }
};

// Weather route
export const weatherRoute = async (req: any, res: any) => {
  try {
    const weather = await getWeather();
    if (!weather) {
      return res.status(503).json({ message: 'Weather service unavailable' });
    }
    res.json({ success: true, weather });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
```

## 📧 Email Service (Free Gmail SMTP)

### Email Service (server/src/utils/emailService.ts)
```typescript
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransporter({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    const mailOptions = {
      from: `"HybridWork" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Email send error:', error);
    return false;
  }
};

export const sendScheduleReminder = async (userEmail: string, userName: string, schedule: any) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #3b82f6, #ec4899); padding: 20px; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0;">HybridWork Schedule Reminder</h1>
      </div>
      <div style="background: #f9fafb; padding: 20px; border-radius: 0 0 10px 10px;">
        <h2 style="color: #1f2937;">Hi ${userName}!</h2>
        <p style="color: #4b5563;">This is a friendly reminder about your upcoming office days:</p>
        
        <div style="background: white; padding: 15px; border-radius: 8px; margin: 15px 0;">
          ${Object.entries(schedule).map(([day, status]: [string, any]) => 
            status === 'wfo' ? `<p style="margin: 5px 0;"><strong>${day.charAt(0).toUpperCase() + day.slice(1)}:</strong> 🏢 Office Day</p>` : ''
          ).join('')}
        </div>
        
        <p style="color: #4b5563;">Have a productive week!</p>
        <p style="color: #6b7280; font-size: 14px;">- The HybridWork Team</p>
      </div>
    </div>
  `;

  return await sendEmail(userEmail, 'Weekly Schedule Reminder', html);
};
```

## 🏃‍♂️ Running the Application

### Development Setup
```bash
# 1. Install MongoDB (if local)
# macOS: brew install mongodb-community
# Ubuntu: sudo apt install mongodb
# Windows: Download from MongoDB website

# 2. Start MongoDB
mongod

# 3. Install dependencies
cd server && npm install
cd ../client && npm install

# 4. Start development servers
cd server
npm run dev:full
```

### Alternative: Using Docker
```bash
# docker-compose.yml in root directory
version: '3.8'
services:
  mongodb:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db

  server:
    build: ./server
    ports:
      - "5000:5000"
    depends_on:
      - mongodb
    environment:
      - MONGODB_URI=mongodb://mongodb:27017/hybridwork

  client:
    build: ./client
    ports:
      - "3000:3000"
    depends_on:
      - server

volumes:
  mongodb_data:
```

```bash
# Run with Docker
docker-compose up -d
```

## 🔐 Authentication Setup

### JWT Middleware (server/src/middleware/auth.ts)
```typescript
import jwt from 'jsonwebtoken';
import User from '../models/User';

export const protect = async (req: any, res: any, next: any) => {
  try {
    let token;

    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = await User.findById(decoded.id);
    
    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

export const authorize = (...roles: string[]) => {
  return (req: any, res: any, next: any) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `User role ${req.user.role} is not authorized to access this route` 
      });
    }
    next();
  };
};
```

## 📊 Analytics & Reporting

### Analytics Model (server/src/models/Analytics.ts)
```typescript
import mongoose, { Schema, Document } from 'mongoose';

export interface IAnalytics extends Document {
  date: Date;
  department: string;
  officeAttendance: number;
  homeWorkers: number;
  totalEmployees: number;
  attendanceRate: number;
}

const analyticsSchema = new Schema<IAnalytics>({
  date: { type: Date, required: true },
  department: { type: String, required: true },
  officeAttendance: { type: Number, required: true },
  homeWorkers: { type: Number, required: true },
  totalEmployees: { type: Number, required: true },
  attendanceRate: { type: Number, required: true }
}, { timestamps: true });

export default mongoose.model<IAnalytics>('Analytics', analyticsSchema);
```

## 🚀 Production Deployment

### Deployment Options

#### 1. Heroku (Free Tier)
```bash
# Install Heroku CLI
# Create Procfile in root
echo "web: cd server && npm start" > Procfile

# Deploy
heroku create your-app-name
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your_mongodb_atlas_uri
git push heroku main
```

#### 2. Railway
```bash
# railway.json
{
  "build": {
    "builder": "nixpacks"
  },
  "deploy": {
    "startCommand": "cd server && npm start"
  }
}
```

#### 3. Render
```yaml
# render.yaml
services:
  - type: web
    name: hybridwork-api
    env: node
    buildCommand: cd server && npm install && npm run build
    startCommand: cd server && npm start
```

### Environment Setup for Production
```bash
# Production environment variables
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hybridwork
JWT_SECRET=your_production_jwt_secret
EMAIL_USER=your_production_email
EMAIL_PASS=your_production_email_password
```

## 🔧 Additional Features

### 1. File Upload Service
```typescript
// server/src/utils/fileUpload.ts
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});
```

### 2. Cron Jobs for Reminders
```typescript
// server/src/utils/cronJobs.ts
import cron from 'node-cron';
import User from '../models/User';
import Schedule from '../models/Schedule';
import { sendScheduleReminder } from './emailService';

// Send weekly reminders every Sunday at 6 PM
export const startCronJobs = () => {
  cron.schedule('0 18 * * 0', async () => {
    try {
      const nextWeek = getNextWeek();
      const users = await User.find({ 'preferences.emailNotifications': true });
      
      for (const user of users) {
        const schedule = await Schedule.findOne({ 
          user: user._id, 
          week: nextWeek 
        });
        
        if (schedule) {
          await sendScheduleReminder(user.email, user.name, schedule.schedule);
        }
      }
    } catch (error) {
      console.error('Cron job error:', error);
    }
  });
};
```

## 📝 Testing

### Backend Tests (Jest + Supertest)
```bash
cd server
npm install --save-dev jest @types/jest supertest @types/supertest ts-jest

# jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
  ],
};
```

### Frontend Tests (React Testing Library)
```bash
cd client
npm install --save-dev @testing-library/jest-dom

# Sample test
import { render, screen } from '@testing-library/react';
import WeatherWidget from '../WeatherWidget';

test('renders weather widget', () => {
  render(<WeatherWidget />);
  expect(screen.getByText(/weather/i)).toBeInTheDocument();
});
```

## 🎯 Final Notes

### Free API Services Used:
1. **Open-Meteo**: Free weather API (no key required)
2. **Gmail SMTP**: Free email service (use App Password)
3. **MongoDB Atlas**: Free tier (512MB)
4. **Socket.IO**: Free real-time communication
5. **Cloudinary**: Free tier for file storage

### Performance Optimizations:
1. **Frontend**: React.memo, useMemo, useCallback
2. **Backend**: Database indexing, query optimization
3. **Real-time**: Socket.IO rooms for department isolation
4. **Caching**: Redis for session storage (optional)

### Security Best Practices:
1. **Helmet**: Security headers
2. **Rate Limiting**: Express rate limiter
3. **Input Validation**: Joi or Yup validation
4. **CORS**: Proper CORS configuration
5. **Environment Variables**: All sensitive data in .env

This comprehensive setup gives you a production-ready MERN stack application with modern features, real-time capabilities, and a beautiful blue/pink themed UI. The code is ready to be deployed and scaled as needed.