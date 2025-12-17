# 🚀 Complete Deployment Guide - Step by Step

## ⚠️ IMPORTANT: Deployment Order

**Deploy in this order:**
1. ✅ **Backend FIRST** (Render) - You need the backend URL
2. ✅ **Frontend SECOND** (Vercel) - Uses the backend URL from step 1

---

# PART 1: Deploy Backend to Render (30 minutes)

## Prerequisites
- [ ] GitHub account
- [ ] Render account (free tier works) - [Sign up at render.com](https://render.com)
- [ ] MongoDB database (Atlas free tier) - [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)

---

## Step 1: Prepare Backend for Deployment

### 1.1 Check Backend Files

Make sure your backend has these files:
- ✅ `collab/server/server.js` (main file)
- ✅ `collab/server/package.json`
- ✅ All controller, model, route files

### 1.2 Verify package.json

Open `collab/server/package.json` and ensure it has:

```json
{
  "scripts": {
    "start": "node server.js"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

### 1.3 Update Backend CORS (CRITICAL!)

Open `collab/server/server.js` and find the CORS section. Update it to:

```javascript
const cors = require('cors')

// Define allowed origins
const allowedOrigins = [
  process.env.FRONTEND_URL || 'https://your-app.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000'
]

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true)
    if (allowedOrigins.includes(origin)) {
      return callback(null, true)
    }
    callback(new Error('Not allowed by CORS'))
  },
  credentials: false,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
}))
```

### 1.4 Update Socket.IO CORS (CRITICAL!)

Find your Socket.IO setup and update it:

```javascript
const io = require('socket.io')(server, {
  cors: {
    origin: [
      process.env.FRONTEND_URL || 'https://your-app.vercel.app',
      'http://localhost:5173',
      'http://localhost:3000'
    ],
    methods: ['GET', 'POST'],
    credentials: false
  },
  transports: ['websocket', 'polling']
})
```

---

## Step 2: Push Backend to GitHub

### 2.1 Create a new GitHub repository for backend

Go to [github.com/new](https://github.com/new)
- Repository name: `collab-backend` (or any name)
- Public or Private: Your choice
- **DO NOT** initialize with README
- Click "Create repository"

### 2.2 Push your backend code

Open terminal in `C:/collab/collab/server`:

```bash
# Navigate to server folder
cd C:/collab/collab/server

# Initialize git (if not already)
git init

# Add remote (replace YOUR-USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR-USERNAME/collab-backend.git

# Add all files
git add .

# Commit
git commit -m "Initial backend commit for Render deployment"

# Push to GitHub
git branch -M main
git push -u origin main
```

---

## Step 3: Setup MongoDB (if not already)

### 3.1 Create MongoDB Atlas Account
1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for free
3. Create a new cluster (Free M0 tier)

### 3.2 Get Connection String
1. In Atlas, click "Connect"
2. Choose "Connect your application"
3. Copy the connection string
4. It looks like: `mongodb+srv://username:<password>@cluster0.xxxxx.mongodb.net/`
5. Replace `<password>` with your database password
6. Add database name at the end: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/collab-app`

### 3.3 Whitelist All IPs (for Render)
1. In MongoDB Atlas, go to "Network Access"
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

---

## Step 4: Deploy Backend to Render

### 4.1 Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up (can use GitHub to sign in)
3. Verify your email

### 4.2 Create New Web Service
1. Click "New +" button (top right)
2. Select "Web Service"
3. Connect your GitHub account when prompted
4. Find and select your `collab-backend` repository
5. Click "Connect"

### 4.3 Configure Web Service

Fill in these settings:

| Field | Value |
|-------|-------|
| **Name** | `collab-backend` (or your preferred name) |
| **Region** | Choose closest to you |
| **Branch** | `main` |
| **Root Directory** | Leave empty (or `.` if it asks) |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` or `node server.js` |
| **Instance Type** | `Free` |

### 4.4 Add Environment Variables

Scroll down to "Environment Variables" section. Click "Add Environment Variable" for each:

| Key | Value | Where to get it |
|-----|-------|----------------|
| `MONGODB_URI` | `mongodb+srv://...` | From MongoDB Atlas (Step 3.2) |
| `JWT_SECRET` | `your-super-secret-key-12345` | Make up a random string |
| `PORT` | `5000` | Can use default |
| `NODE_ENV` | `production` | Type this exactly |
| `FRONTEND_URL` | `https://your-app.vercel.app` | You'll update this later |

**Note**: For `FRONTEND_URL`, use a placeholder for now. We'll update it after deploying the frontend.

### 4.5 Deploy!
1. Click "Create Web Service"
2. Wait 5-10 minutes for deployment
3. Watch the logs - should see "Server running on port 5000" or similar

### 4.6 Get Your Backend URL
Once deployed, Render gives you a URL like:
```
https://collab-backend-xxxx.onrender.com
```

**SAVE THIS URL!** You'll need it for the frontend.

### 4.7 Test Your Backend
Open browser and go to:
```
https://collab-backend-xxxx.onrender.com/api/health
```

Should see JSON response or "Cannot GET" (both mean server is running).

---

## Step 5: Common Backend Issues

### Issue: Build fails
- **Check**: Logs in Render dashboard
- **Solution**: Ensure `package.json` has all dependencies

### Issue: Server crashes on startup
- **Check**: Environment variables are set correctly
- **Solution**: Verify MongoDB connection string

### Issue: MongoDB connection fails
- **Check**: IP whitelist includes 0.0.0.0/0
- **Check**: Connection string password is correct
- **Check**: Database name is at the end of connection string

---

# PART 2: Deploy Frontend to Vercel (20 minutes)

## Step 6: Prepare Frontend for Deployment

Your frontend is already prepared! All files were fixed earlier.

### 6.1 Verify .env is not in git

The `.env` file should NOT be pushed to GitHub (it's in `.gitignore`).

Check `.gitignore` includes:
```
.env
.env.local
```

---

## Step 7: Push Frontend to GitHub

### 7.1 Create a new GitHub repository for frontend

Go to [github.com/new](https://github.com/new)
- Repository name: `collab-frontend` (or any name)
- Public or Private: Your choice
- **DO NOT** initialize with README
- Click "Create repository"

### 7.2 Push your frontend code

Open terminal in `C:/collab/collab/client`:

```bash
# Navigate to client folder
cd C:/collab/collab/client

# Initialize git (if not already)
git init

# Add remote (replace YOUR-USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR-USERNAME/collab-frontend.git

# Add all files
git add .

# Commit
git commit -m "Initial frontend commit - Vercel ready"

# Push to GitHub
git branch -M main
git push -u origin main
```

---

## Step 8: Deploy Frontend to Vercel

### 8.1 Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Click "Sign Up"
3. Sign up with GitHub (recommended)
4. Authorize Vercel to access your GitHub

### 8.2 Import Project
1. Click "Add New..." → "Project"
2. Find your `collab-frontend` repository
3. Click "Import"

### 8.3 Configure Project

| Field | Value |
|-------|-------|
| **Framework Preset** | Vite |
| **Root Directory** | `./` (default) |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` |

### 8.4 Add Environment Variable (CRITICAL!)

Before clicking Deploy:

1. Expand "Environment Variables" section
2. Add this variable:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://collab-backend-xxxx.onrender.com` |

**IMPORTANT**: 
- Use YOUR backend URL from Step 4.6
- NO trailing slash at the end
- Must start with `https://`

Example: `https://collab-backend-a1b2.onrender.com`

### 8.5 Deploy!
1. Click "Deploy"
2. Wait 3-5 minutes
3. Vercel will build and deploy your app

### 8.6 Get Your Frontend URL
Vercel will give you URLs like:
```
https://collab-frontend-xxxx.vercel.app (production)
https://collab-frontend-git-main-username.vercel.app (preview)
```

**SAVE THIS URL!**

---

## Step 9: Update Backend with Frontend URL

### 9.1 Update Render Environment Variable
1. Go back to [Render dashboard](https://dashboard.render.com)
2. Click on your backend web service
3. Go to "Environment" tab
4. Find `FRONTEND_URL` variable
5. Click "Edit"
6. Update value to: `https://collab-frontend-xxxx.vercel.app` (your Vercel URL)
7. Click "Save Changes"

### 9.2 Redeploy Backend
1. Render will automatically redeploy
2. Or click "Manual Deploy" → "Deploy latest commit"
3. Wait 2-3 minutes

---

## Step 10: Test Your Deployed Application

### 10.1 Open Your App
Go to your Vercel URL: `https://collab-frontend-xxxx.vercel.app`

### 10.2 Test Basic Functions
1. ✅ Page loads without errors
2. ✅ Register a new account
3. ✅ Login with the account
4. ✅ Create a new board
5. ✅ Create a list
6. ✅ Create a card
7. ✅ Test real-time updates (open in two browser tabs)

### 10.3 Check Browser Console
1. Press F12 to open DevTools
2. Go to Console tab
3. Should see:
   - ✅ "Socket connected successfully"
   - ✅ No CORS errors
   - ✅ No "localhost" references

### 10.4 Check Network Tab
1. Go to Network tab in DevTools
2. Make an API call (like login)
3. Check request URL
4. Should go to: `https://your-backend.onrender.com/api/...`
5. NOT `http://localhost:5000/...`

---

## 🎉 Success Checklist

- [ ] Backend deployed to Render and running
- [ ] MongoDB connected successfully
- [ ] Frontend deployed to Vercel
- [ ] Environment variable `VITE_API_URL` set in Vercel
- [ ] Environment variable `FRONTEND_URL` set in Render
- [ ] Can register new users
- [ ] Can login
- [ ] Can create boards
- [ ] Real-time updates work
- [ ] No CORS errors in console
- [ ] Socket.IO connects successfully

---

## 🐛 Troubleshooting

### Frontend shows "Cannot connect"
1. Check Vercel environment variables
2. Verify `VITE_API_URL` is set correctly
3. Check backend is running on Render

### CORS errors in browser
1. Check backend CORS configuration (Step 1.3)
2. Verify `FRONTEND_URL` in Render matches your Vercel URL
3. Make sure no trailing slashes in URLs

### Socket.IO won't connect
1. Check backend Socket.IO CORS (Step 1.4)
2. Verify Render allows WebSocket connections (should be automatic)
3. Check browser console for specific error

### Backend crashes
1. Check Render logs: Dashboard → Your Service → Logs
2. Verify all environment variables are set
3. Check MongoDB connection string

### MongoDB connection timeout
1. Verify IP whitelist includes 0.0.0.0/0
2. Check connection string is correct
3. Verify database user has read/write permissions

---

## 🔄 Making Updates After Deployment

### Update Frontend
1. Make changes locally
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Your changes"
   git push
   ```
3. Vercel auto-deploys on push (takes 2-3 minutes)

### Update Backend
1. Make changes locally
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Your changes"
   git push
   ```
3. Render auto-deploys on push (takes 5-10 minutes)

### Update Environment Variables
- **Vercel**: Dashboard → Project → Settings → Environment Variables
- **Render**: Dashboard → Service → Environment → Edit

After changing env vars, you need to redeploy!

---

## 📞 Getting Help

### Check Logs
- **Vercel**: Dashboard → Project → Deployments → Click deployment → View Function Logs
- **Render**: Dashboard → Service → Logs

### Common Commands
```bash
# Test frontend build locally
cd C:/collab/collab/client
npm run build
npm run preview

# Test backend locally
cd C:/collab/collab/server
npm start
```

---

## 📋 Quick Reference

### Your URLs (fill these in after deployment)
```
Backend (Render):  https://_____________________________.onrender.com
Frontend (Vercel): https://_____________________________.vercel.app
MongoDB:          mongodb+srv://________________________________
```

### Environment Variables

**Vercel** (Frontend):
```
VITE_API_URL = https://your-backend.onrender.com
```

**Render** (Backend):
```
MONGODB_URI = mongodb+srv://...
JWT_SECRET = your-secret-key
PORT = 5000
NODE_ENV = production
FRONTEND_URL = https://your-app.vercel.app
```

---

## ✨ You're Done!

Your application is now fully deployed and accessible from anywhere in the world! 🎉

**Next Steps**:
- Share your Vercel URL with others
- Monitor Render logs for any issues
- Consider upgrading to paid plans if you need more resources

**Free Tier Limitations**:
- Render: Server sleeps after 15 min of inactivity (takes ~30s to wake up)
- Vercel: 100GB bandwidth per month
- MongoDB Atlas: 512MB storage

These are usually fine for development/portfolio projects!

---

**Deployment Date**: December 17, 2025
**Status**: ✅ Complete Deployment Guide
