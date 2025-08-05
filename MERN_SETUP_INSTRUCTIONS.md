# MERN Stack Hybrid Work Planner - Complete Setup Guide

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** (v5 or higher) - [Download here](https://www.mongodb.com/try/download/community)
- **Git** - [Download here](https://git-scm.com/)
- **Gmail Account** (for email notifications)

## Project Structure

```
hybrid-work-planner/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── lib/
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.ts
├── server/                 # Node.js backend
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   ├── server.js
│   ├── package.json
│   └── .env
└── README.md
```

## Step-by-Step Setup

### 1. Clone and Initial Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd hybrid-work-planner

# Install root dependencies (if any)
npm install
```

### 2. Backend Setup

```bash
# Navigate to server directory
cd server

# Install server dependencies
npm install

# Create environment file
cp .env.example .env
```

### 3. Configure Environment Variables

Edit `server/.env` with your actual values:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/hybrid-work-planner

# JWT Secret (generate a secure random string)
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long

# Email Configuration (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password

# Client URL
CLIENT_URL=http://localhost:5173

# Port
PORT=5000

# Weather API
WEATHER_API_URL=https://api.open-meteo.com/v1/forecast
```

#### Setting up Gmail App Password:

1. Go to your Google Account settings
2. Security → 2-Step Verification (enable if not already)
3. App passwords → Generate new password
4. Use this password in EMAIL_PASS

### 4. Start MongoDB

```bash
# Start MongoDB service (varies by OS)

# On macOS with Homebrew:
brew services start mongodb-community

# On Ubuntu/Debian:
sudo systemctl start mongod

# On Windows:
# Start MongoDB service from Services app or run mongod.exe
```

### 5. Start Backend Server

```bash
# From server directory
npm run dev

# Server should start on http://localhost:5000
```

### 6. Frontend Setup

Open a new terminal:

```bash
# Navigate to client directory (project root in this case)
cd ..

# Install frontend dependencies
npm install

# Start frontend development server
npm run dev

# Frontend should start on http://localhost:5173
```

## Testing the Setup

### 1. Check Backend Health

Visit `http://localhost:5000/api/health` - you should see:
```json
{
  "status": "OK",
  "timestamp": "2023-11-XX..."
}
```

### 2. Check Frontend

Visit `http://localhost:5173` - you should see the application interface.

### 3. Test Registration

1. Click "Register" or navigate to registration
2. Fill in user details
3. Check if user is created in MongoDB

### 4. Test Database Connection

```bash
# Connect to MongoDB
mongosh

# Switch to your database
use hybrid-work-planner

# Check collections
show collections

# View users
db.users.find()
```

## Available Scripts

### Backend (server directory)
```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm test           # Run tests
```

### Frontend (root directory)
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Schedules
- `GET /api/schedules` - Get user schedules
- `POST /api/schedules` - Create/update schedule
- `GET /api/schedules/team` - Get team schedules (managers only)

### Polls
- `GET /api/polls` - Get all polls
- `POST /api/polls` - Create new poll
- `POST /api/polls/:id/vote` - Vote on poll

## Database Models

### User Schema
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: ['employee', 'manager', 'admin'],
  department: String,
  preferences: Object,
  lastLogin: Date,
  isActive: Boolean
}
```

### Schedule Schema
```javascript
{
  user: ObjectId (ref: User),
  week: String, // "2023-45"
  schedule: {
    monday: ['wfo', 'wfh', 'off', 'holiday'],
    tuesday: ['wfo', 'wfh', 'off', 'holiday'],
    // ... other days
  },
  status: ['draft', 'submitted', 'approved', 'rejected']
}
```

## Real-time Features (Socket.IO)

The application supports real-time updates for:
- Schedule changes
- Poll voting
- User status updates
- Motivation posts

## Production Deployment

### Backend Deployment Options:
- **Heroku**: `git push heroku main`
- **Railway**: Connect GitHub repo
- **DigitalOcean**: Use App Platform
- **AWS**: Use Elastic Beanstalk or EC2

### Frontend Deployment Options:
- **Vercel**: Connect GitHub repo
- **Netlify**: Connect GitHub repo
- **Firebase Hosting**: `firebase deploy`

### Database Options:
- **MongoDB Atlas** (recommended)
- **DigitalOcean Managed MongoDB**
- **AWS DocumentDB**

### Environment Variables for Production:
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname
JWT_SECRET=your-production-secret-key
CLIENT_URL=https://your-frontend-domain.com
```

## Troubleshooting

### Common Issues:

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check MONGODB_URI in .env
   - Verify firewall settings

2. **CORS Errors**
   - Check CLIENT_URL in server .env
   - Verify frontend is running on correct port

3. **JWT Errors**
   - Ensure JWT_SECRET is set and long enough
   - Check token format in requests

4. **Email Sending Issues**
   - Verify Gmail app password
   - Check EMAIL_USER and EMAIL_PASS

### Getting Help:

1. Check console logs in both frontend and backend
2. Verify environment variables
3. Ensure all dependencies are installed
4. Check MongoDB connection and data

## Security Notes

- Never commit `.env` files
- Use strong JWT secrets (32+ characters)
- Validate all user inputs
- Use HTTPS in production
- Keep dependencies updated
- Implement rate limiting
- Use helmet for security headers

## Additional Features

The application includes:
- JWT Authentication
- Role-based access control
- Real-time notifications
- Email reminders
- Weather integration
- File upload capabilities
- Analytics and reporting

## Next Steps

1. Customize the UI/UX to match your branding
2. Add additional features as needed
3. Set up monitoring and logging
4. Implement automated testing
5. Configure CI/CD pipelines
6. Set up backup strategies

For support or questions, check the documentation or create an issue in the repository.
