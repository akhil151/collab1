# Backend Requirements for Frontend Deployment

## Overview

For the frontend deployed on Vercel to work correctly, your backend on Render must be properly configured to accept requests from the Vercel domain.

---

## ✅ Required Backend Configuration

### 1. CORS Configuration

Your backend must allow requests from your Vercel frontend URL.

**File**: `server/server.js` (or main server file)

```javascript
const cors = require('cors')
const express = require('express')
const app = express()

// Define allowed origins
const allowedOrigins = [
  process.env.FRONTEND_URL || 'https://your-app.vercel.app',  // Production Vercel URL
  'http://localhost:5173',                                      // Local development
  'http://localhost:3000',                                      // Alternative local port
]

// Apply CORS middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true)
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.'
      return callback(new Error(msg), false)
    }
    return callback(null, true)
  },
  credentials: false,  // Must match frontend Socket.IO config
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
```

### 2. Socket.IO Configuration

Your backend Socket.IO must allow connections from Vercel.

**File**: `server/server.js` or `server/sockets/socketHandler.js`

```javascript
const { Server } = require('socket.io')
const socketIO = require('socket.io')

// Create Socket.IO server with CORS
const io = socketIO(server, {
  cors: {
    origin: [
      process.env.FRONTEND_URL || 'https://your-app.vercel.app',
      'http://localhost:5173',
      'http://localhost:3000',
    ],
    methods: ['GET', 'POST'],
    credentials: false,  // Must be false to match frontend
    allowedHeaders: ['Content-Type', 'Authorization']
  },
  transports: ['websocket', 'polling'],  // Enable both transports
  pingTimeout: 60000,
  pingInterval: 25000
})
```

### 3. Environment Variables on Render

Set these in your Render dashboard:

| Variable | Value | Example |
|----------|-------|---------|
| `FRONTEND_URL` | Your Vercel URL | `https://your-app.vercel.app` |
| `PORT` | Server port | `5000` (or Render's default) |
| `MONGODB_URI` | MongoDB connection | Your MongoDB URI |
| `JWT_SECRET` | JWT secret key | Random secure string |

---

## 🧪 Testing Backend CORS

### Test 1: Health Check Endpoint

Create a test endpoint:

```javascript
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Backend is running',
    cors: req.headers.origin 
  })
})
```

Test from browser console on Vercel:
```javascript
fetch('https://your-backend.onrender.com/api/health')
  .then(r => r.json())
  .then(console.log)
```

**Expected**: Should return JSON without CORS error

---

### Test 2: CORS Headers

```bash
curl -H "Origin: https://your-app.vercel.app" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     https://your-backend.onrender.com/api/health
```

**Expected Headers**:
```
Access-Control-Allow-Origin: https://your-app.vercel.app
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

---

### Test 3: Socket.IO Connection

From browser console on Vercel:
```javascript
const socket = io('https://your-backend.onrender.com')
socket.on('connect', () => console.log('Connected!'))
socket.on('connect_error', (err) => console.error('Error:', err))
```

**Expected**: Should log "Connected!" without errors

---

## ⚠️ Common Backend Issues

### Issue 1: CORS Error
```
Access to XMLHttpRequest at 'https://backend.onrender.com/api/...' 
from origin 'https://your-app.vercel.app' has been blocked by CORS policy
```

**Solution**: Add Vercel domain to `allowedOrigins` array

---

### Issue 2: Socket.IO Connection Refused
```
WebSocket connection to 'wss://backend.onrender.com/socket.io/' failed
```

**Causes**:
1. Socket.IO CORS not configured
2. Render web service not allowing WebSocket connections
3. Firewall blocking WebSocket traffic

**Solution**:
```javascript
// Ensure both transports are enabled
const io = socketIO(server, {
  cors: { /* ... */ },
  transports: ['websocket', 'polling'],  // Important!
})
```

---

### Issue 3: Credentials Mismatch
```
The value of the 'Access-Control-Allow-Credentials' header in the response 
is '' which must be 'true' when the request's credentials mode is 'include'
```

**Solution**: Ensure both frontend and backend have matching credentials setting:
```javascript
// Backend
cors({ credentials: false })
socketIO(server, { cors: { credentials: false } })

// Frontend (already fixed)
io(url, { withCredentials: false })
```

---

### Issue 4: Preflight Request Fails
```
Response to preflight request doesn't pass access control check
```

**Solution**: Ensure OPTIONS method is allowed:
```javascript
app.use(cors({
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
}))
```

---

## 📋 Backend Deployment Checklist

### Before Deployment
- [ ] CORS middleware configured with Vercel domain
- [ ] Socket.IO CORS configured with Vercel domain
- [ ] Environment variables defined
- [ ] Both websocket and polling transports enabled
- [ ] Credentials setting matches frontend (false)

### After Deployment on Render
- [ ] Environment variable `FRONTEND_URL` set
- [ ] Backend is accessible via public URL
- [ ] Health check endpoint works
- [ ] CORS headers present in responses
- [ ] Socket.IO accepts connections from Vercel

### Verification
- [ ] Test API calls from Vercel frontend
- [ ] Test Socket.IO connection from Vercel frontend
- [ ] No CORS errors in browser console
- [ ] Real-time features work
- [ ] All features functional end-to-end

---

## 🔧 Backend Code Examples

### Minimal Working Example

```javascript
const express = require('express')
const cors = require('cors')
const socketIO = require('socket.io')
const http = require('http')

const app = express()
const server = http.createServer(app)

// CORS for Express routes
app.use(cors({
  origin: [
    process.env.FRONTEND_URL,
    'http://localhost:5173'
  ],
  credentials: false
}))

// Socket.IO with CORS
const io = socketIO(server, {
  cors: {
    origin: [
      process.env.FRONTEND_URL,
      'http://localhost:5173'
    ],
    credentials: false
  }
})

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

// Socket.IO events
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id)
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id)
  })
})

const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
```

---

## 🚀 Render-Specific Configuration

### Environment Variables in Render

1. Go to your Render dashboard
2. Select your Web Service
3. Navigate to **Environment** tab
4. Add:
   ```
   Key: FRONTEND_URL
   Value: https://your-app.vercel.app
   ```
5. Save and redeploy

### Render Build Settings

- **Build Command**: `npm install`
- **Start Command**: `node server.js` (or your main file)
- **Environment**: `Node`

---

## 📞 Troubleshooting

### Debug CORS Issues

Add logging to see what's being blocked:
```javascript
app.use((req, res, next) => {
  console.log('Request from:', req.headers.origin)
  console.log('Method:', req.method)
  next()
})
```

### Debug Socket.IO Issues

```javascript
io.on('connection', (socket) => {
  console.log('✅ Socket connected:', socket.id)
  console.log('From origin:', socket.handshake.headers.origin)
})

io.engine.on('connection_error', (err) => {
  console.error('❌ Connection error:', err)
})
```

---

## ✅ Success Criteria

Your backend is correctly configured when:
1. ✅ API calls from Vercel succeed without CORS errors
2. ✅ Socket.IO connects from Vercel without errors
3. ✅ Real-time features work end-to-end
4. ✅ No errors in browser console
5. ✅ All features function as expected

---

## 🔗 Related Documentation

- Frontend: [VERCEL_DEPLOYMENT_READY.md](VERCEL_DEPLOYMENT_READY.md)
- Quick Start: [DEPLOYMENT_QUICK_START.md](DEPLOYMENT_QUICK_START.md)
- Environment Variables: [ENVIRONMENT_VARIABLES.md](ENVIRONMENT_VARIABLES.md)

---

**Status**: Backend configuration guide complete
**Next**: Deploy backend to Render with these settings
