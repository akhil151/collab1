# 🚀 Quick Deployment Cheat Sheet

## 📋 DEPLOYMENT ORDER
```
1️⃣ Backend (Render)  →  Get backend URL
2️⃣ Frontend (Vercel)  →  Use backend URL
3️⃣ Update Backend  →  Add frontend URL
```

---

## 🔴 PART 1: BACKEND (Render) - 30 mins

### Before You Start
✅ MongoDB Atlas account & connection string
✅ GitHub account
✅ Render account

### Quick Steps

**1. Push to GitHub**
```bash
cd C:/collab/collab/server
git init
git remote add origin https://github.com/YOUR-USERNAME/collab-backend.git
git add .
git commit -m "Deploy to Render"
git push -u origin main
```

**2. Deploy on Render**
- Go to [render.com](https://render.com)
- New → Web Service
- Connect GitHub repo: `collab-backend`
- Settings:
  - Build: `npm install`
  - Start: `npm start`
  - Instance: Free

**3. Environment Variables in Render**
```
MONGODB_URI = mongodb+srv://user:pass@cluster.mongodb.net/dbname
JWT_SECRET = any-random-secret-string-12345
PORT = 5000
NODE_ENV = production
FRONTEND_URL = https://placeholder.com (update later)
```

**4. Save Backend URL**
```
https://collab-backend-xxxx.onrender.com
```
**Write this down!** ⬆️

---

## 🔵 PART 2: FRONTEND (Vercel) - 20 mins

### Quick Steps

**1. Push to GitHub**
```bash
cd C:/collab/collab/client
git init
git remote add origin https://github.com/YOUR-USERNAME/collab-frontend.git
git add .
git commit -m "Deploy to Vercel"
git push -u origin main
```

**2. Deploy on Vercel**
- Go to [vercel.com](https://vercel.com)
- New Project
- Import: `collab-frontend`
- Settings:
  - Framework: Vite
  - Build: `npm run build`
  - Output: `dist`

**3. Environment Variable in Vercel**
```
VITE_API_URL = https://collab-backend-xxxx.onrender.com
```
☝️ Use YOUR backend URL from Part 1

**4. Save Frontend URL**
```
https://collab-frontend-xxxx.vercel.app
```

---

## 🟢 PART 3: UPDATE BACKEND - 5 mins

**1. Go back to Render**
- Dashboard → Your backend service
- Environment tab
- Edit `FRONTEND_URL`
- New value: `https://collab-frontend-xxxx.vercel.app`
- Save → Auto redeploys

---

## ✅ TESTING

Open: `https://collab-frontend-xxxx.vercel.app`

Test:
- [ ] Page loads
- [ ] Register account
- [ ] Login
- [ ] Create board
- [ ] No console errors
- [ ] Socket.IO connects

---

## 🆘 QUICK FIXES

### "Cannot connect to backend"
→ Check `VITE_API_URL` in Vercel env vars

### CORS error
→ Check `FRONTEND_URL` in Render matches Vercel URL

### MongoDB error
→ Whitelist all IPs (0.0.0.0/0) in MongoDB Atlas

### Backend crashed
→ Check Render logs for error details

---

## 📝 YOUR DEPLOYMENT INFO

Fill this in as you go:

```
GitHub Backend:  https://github.com/_________________/collab-backend
GitHub Frontend: https://github.com/_________________/collab-frontend

Render Backend:  https://________________________________.onrender.com
Vercel Frontend: https://________________________________.vercel.app

MongoDB URI:     mongodb+srv://________________________________
JWT Secret:      ________________________________
```

---

## 🔄 MAKING UPDATES

**Update code:**
```bash
git add .
git commit -m "your changes"
git push
```
→ Auto-deploys on both platforms!

**Update env variables:**
- Vercel: Settings → Environment Variables
- Render: Environment tab
→ Must redeploy after changing!

---

## 📚 FULL GUIDE

For detailed steps, see:
`C:/collab/collab/COMPLETE_DEPLOYMENT_GUIDE.md`

---

**Status**: Ready to deploy! 🚀
**Time**: ~1 hour total
**Cost**: $0 (free tiers)
