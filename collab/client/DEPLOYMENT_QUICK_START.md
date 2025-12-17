# 🚀 Quick Deployment Guide

## For Vercel Deployment

### 1️⃣ Set Environment Variable in Vercel
```
Variable: VITE_API_URL
Value: https://your-backend.onrender.com
(No trailing slash!)
```

### 2️⃣ Build Settings
- **Framework Preset**: Vite
- **Build Command**: `npm run build` or `pnpm build`
- **Output Directory**: `dist`
- **Install Command**: `npm install` or `pnpm install`
- **Node Version**: 18.x or higher

### 3️⃣ Deploy
Push to GitHub or run:
```bash
vercel --prod
```

---

## ✅ What Was Fixed

| Issue | Solution |
|-------|----------|
| Hardcoded `localhost:5000` URLs | Removed all hardcoded fallbacks |
| Mixed env vars (`VITE_API_URL` & `VITE_SOCKET_URL`) | Consolidated to `VITE_API_URL` |
| Dev proxy blocking production | Updated Vite config for production compatibility |
| Socket.IO connection issues | Added production-ready configuration |

---

## 🧪 Test Locally First

```bash
cd collab/client

# Install dependencies
npm install

# Test build
npm run build

# Should complete without errors ✅
```

---

## 🔧 Backend Requirements

Your Render backend MUST have:

**1. CORS Configuration**
```javascript
const cors = require('cors')

app.use(cors({
  origin: [
    "https://your-app.vercel.app",  // Your Vercel domain
    "http://localhost:5173"          // Local development
  ],
  credentials: false
}))
```

**2. Socket.IO CORS**
```javascript
const io = socketIO(server, {
  cors: {
    origin: [
      "https://your-app.vercel.app",
      "http://localhost:5173"
    ],
    methods: ["GET", "POST"]
  }
})
```

---

## 📋 Deployment Checklist

- [ ] Environment variable `VITE_API_URL` set in Vercel
- [ ] Backend CORS allows Vercel domain
- [ ] Backend is deployed and running on Render
- [ ] Build command is set correctly
- [ ] Output directory is `dist`
- [ ] Local build test passes (`npm run build`)

---

## 🎯 Expected Result

After deployment:
- ✅ Frontend loads on Vercel
- ✅ Login/Register works
- ✅ Real-time updates work
- ✅ No CORS errors
- ✅ All features functional

---

## 🆘 If Something Goes Wrong

**Build fails**: Check Vercel build logs
**Connection errors**: Verify `VITE_API_URL` value
**CORS errors**: Check backend CORS configuration
**Socket fails**: Verify backend Socket.IO CORS

---

See [VERCEL_DEPLOYMENT_READY.md](VERCEL_DEPLOYMENT_READY.md) for complete details.
