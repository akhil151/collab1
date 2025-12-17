# Environment Variables Configuration

## Overview

This application uses a single environment variable for all backend communications:
- **API calls**: HTTP/HTTPS requests to backend endpoints
- **Socket.IO**: WebSocket connections for real-time features

## Environment Variables

### `VITE_API_URL` (Required)

The base URL of your backend server.

**Format**: `protocol://domain:port` (no trailing slash)

#### Local Development
```bash
VITE_API_URL=http://localhost:5000
```

#### Production (Vercel → Render)
```bash
VITE_API_URL=https://your-backend-name.onrender.com
```

---

## Setup Instructions

### Local Development

1. **Copy the example file**:
   ```bash
   cp .env.example .env
   ```

2. **Default value** (for local backend):
   ```
   VITE_API_URL=http://localhost:5000
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

### Vercel Production Deployment

#### Option 1: Vercel Dashboard (Recommended)

1. Go to your project in [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to: **Settings** → **Environment Variables**
3. Add new variable:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://your-backend.onrender.com`
   - **Environments**: ✅ Production, ✅ Preview, ✅ Development
4. Click **Save**
5. Redeploy your application

#### Option 2: Vercel CLI

```bash
vercel env add VITE_API_URL
# Enter: https://your-backend.onrender.com
# Select: Production

vercel --prod
```

#### Option 3: Environment File (Not Recommended for Production)

⚠️ **Warning**: Don't commit production URLs to `.env.production`

Edit `.env.production`:
```bash
VITE_API_URL=https://your-backend.onrender.com
```

---

## Validation

### How to Verify Configuration

#### During Build
The build will succeed, but runtime will fail if:
- Variable is not set
- Variable has incorrect format
- Backend is not accessible

#### In Browser Console (Production)
```javascript
// Should output your backend URL
console.log(import.meta.env.VITE_API_URL)
// Example: "https://your-backend.onrender.com"

// Should NOT be undefined
console.log(import.meta.env.VITE_API_URL !== undefined)
// Should output: true
```

#### Network Tab
All API requests should go to your configured URL:
```
✅ https://your-backend.onrender.com/api/auth/login
✅ https://your-backend.onrender.com/api/boards
❌ http://localhost:5000/api/... (means env var not set)
```

---

## Common Issues

### ❌ Issue: Application shows "Cannot connect"

**Possible Causes**:
1. `VITE_API_URL` not set in Vercel
2. Backend URL is incorrect
3. Backend is not running

**Solution**:
```bash
# Check Vercel environment variables
vercel env ls

# Should show VITE_API_URL with correct value
```

### ❌ Issue: Socket.IO connection fails

**Possible Causes**:
1. Backend doesn't allow CORS from Vercel domain
2. Backend Socket.IO not configured correctly

**Backend Solution** (server.js):
```javascript
const io = socketIO(server, {
  cors: {
    origin: [
      process.env.FRONTEND_URL,           // Your Vercel URL
      "http://localhost:5173"             // Local development
    ],
    methods: ["GET", "POST"],
    credentials: false
  }
})
```

### ❌ Issue: CORS errors in console

**Backend Solution** (server.js):
```javascript
const cors = require('cors')

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173"
]

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: false
}))
```

---

## Environment Variable Format Examples

### ✅ Correct Formats
```bash
VITE_API_URL=http://localhost:5000
VITE_API_URL=https://my-backend.onrender.com
VITE_API_URL=https://api.myapp.com
VITE_API_URL=http://192.168.1.100:5000
```

### ❌ Incorrect Formats
```bash
VITE_API_URL=localhost:5000              # Missing protocol
VITE_API_URL=http://localhost:5000/      # Trailing slash
VITE_API_URL=http://localhost:5000/api   # Path included
VITE_API_URL="http://localhost:5000"     # Quotes (unnecessary)
```

---

## Testing

### Test Environment Variables Locally

```bash
# Build with production mode
npm run build

# Preview production build
npm run preview

# Check console - should show your env var
```

### Test on Vercel

After deployment:
1. Open browser console on your Vercel URL
2. Type: `import.meta.env.VITE_API_URL`
3. Should show your backend URL (not `undefined`)

---

## Security Notes

### ✅ Safe to Expose
- `VITE_API_URL` is safe to expose in client-side code
- It's the public endpoint of your backend
- Users can see it in network requests anyway

### ❌ Never Include in Frontend
- Database connection strings
- API keys/secrets
- JWT secret keys
- Admin passwords

These belong in **backend** environment variables only.

---

## Migration from Old Format

### Old Configuration (Before Fix)
```bash
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000   # ❌ Removed
```

### New Configuration (After Fix)
```bash
VITE_API_URL=http://localhost:5000      # ✅ One variable for everything
```

**Why**: Socket.IO and API calls use the same backend server, so one variable is sufficient and reduces configuration complexity.

---

## Files That Use This Variable

### API Calls
- All `axios` requests use `${import.meta.env.VITE_API_URL}/api/...`
- Located in: pages, components, store

### Socket.IO Connections
- `src/utils/socket.js` - Connection utility
- `src/pages/Board.jsx` - Board real-time updates
- `src/pages/Dashboard.jsx` - Dashboard notifications
- `src/pages/Messages.jsx` - Real-time messaging
- `src/pages/CardWorkspace.jsx` - Collaborative workspace
- `src/pages/profile.jsx` - Profile updates
- `src/components/ParticipantsPanel.jsx` - Participant management

---

## Support

If you encounter issues:

1. **Verify environment variable is set**:
   ```bash
   vercel env ls
   ```

2. **Check build logs** in Vercel dashboard

3. **Test backend directly**:
   ```bash
   curl https://your-backend.onrender.com/api/health
   ```

4. **Check browser console** for specific error messages

5. **Verify backend CORS** configuration includes your Vercel domain

---

**Last Updated**: After fixing Vercel deployment blockers
**Status**: ✅ Production Ready
