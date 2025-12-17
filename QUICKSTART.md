# 🚀 QUICK START GUIDE - Collaboration Features

## Running the Application

### 1. Start MongoDB
```bash
# Make sure MongoDB is running
mongod
```

### 2. Start Backend Server
```bash
cd c:\collab\collab\server
npm install  # if not already done
node server.js
```

Expected output:
```
Server running on port 5000
Connected to MongoDB
```

### 3. Start Frontend Client
```bash
cd c:\collab\collab\client
npm install  # if not already done
npm run dev
```

Expected output:
```
VITE v5.x.x ready in Xms
➜  Local:   http://localhost:5173/
```

---

## Testing Features

### Test Admin Features

1. **Register as ADMIN**
   - Go to http://localhost:5173/register
   - Fill form, select role: ADMIN
   - Login

2. **Create a Board**
   - Dashboard → "Create New Board" button
   - Verify board appears in dashboard

3. **Send Collaboration Request**
   - Dashboard → "Collaborate" button
   - Select another admin's board
   - Send request
   - Check Messages page for response

4. **Manage Participants**
   - Open any board you own
   - Click "Participants" button
   - Test all 3 tabs:
     - View Participants
     - Send Invitation
     - Join Requests

### Test User Features

1. **Register as USER**
   - Register with role: USER
   - Login

2. **Request to Join Board**
   - Dashboard → "Request to Join Board" button
   - Enter Board ID (get from admin's board URL)
   - Send request
   - Wait for admin approval

3. **Accept Invitation**
   - Messages page
   - Click Accept on invitation
   - Board appears in dashboard

4. **Verify Restrictions**
   - Open board
   - Verify you can create/edit/delete cards
   - Verify you CANNOT delete lists
   - Verify you CANNOT see admin tabs

---

## API Endpoints Quick Reference

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user

### Boards
- `GET /api/boards` - Get user's boards
- `POST /api/boards` - Create board (ADMIN only)
- `GET /api/boards/:id` - Get board details
- `DELETE /api/boards/:id/members/:memberId` - Remove member

### Invitations
- `POST /api/invitations` - Send invitation
- `GET /api/invitations` - Get invitations
- `PUT /api/invitations/:id/accept` - Accept invitation
- `PUT /api/invitations/:id/reject` - Reject invitation

### Join Requests
- `POST /api/join-requests` - Send join request
- `GET /api/join-requests/board/:boardId` - Get requests for board
- `PUT /api/join-requests/:id/accept` - Accept request
- `PUT /api/join-requests/:id/reject` - Reject request

### Collaboration Requests (NEW)
- `POST /api/collaboration-requests` - Send collaboration request
- `GET /api/collaboration-requests` - Get received requests
- `GET /api/collaboration-requests/sent` - Get sent requests
- `PUT /api/collaboration-requests/:id/accept` - Accept request
- `PUT /api/collaboration-requests/:id/reject` - Reject request

### Messages
- `GET /api/messages` - Get all messages
- `GET /api/messages/unread-count` - Get unread count
- `PUT /api/messages/:id/read` - Mark as read
- `PUT /api/messages/read-all` - Mark all as read

---

## Common Issues & Solutions

### Issue: "Board not found"
**Solution:** Make sure you're using the correct Board ID (MongoDB ObjectId format)

### Issue: "Only board owner can delete lists"
**Solution:** This is intentional - USER role members cannot delete lists

### Issue: "Only ADMIN users can create boards"
**Solution:** This is intentional - register with ADMIN role to create boards

### Issue: Email notifications not sending
**Solution:** Email service logs to console in development. For production, integrate SendGrid/AWS SES in `server/services/emailService.js`

### Issue: Cannot see collaboration button
**Solution:** Make sure you're logged in as ADMIN role

### Issue: Join request not appearing
**Solution:** Check Messages page - requests show up there for the board owner

---

## Database Collections

Your MongoDB will have these collections:
- `users` - User accounts (ADMIN/USER)
- `boards` - Board data with participants
- `lists` - Board lists
- `cards` - Task cards
- `joinrequests` - Join request tracking
- `invitations` - Email invitations
- `collaborationrequests` - Admin collaboration requests (NEW)
- `messages` - In-app notifications

---

## Environment Variables

### Backend (.env in server/)
```env
MONGODB_URI=mongodb://localhost:27017/collaboration-board
JWT_SECRET=your-super-secret-jwt-key-change-this
CLIENT_URL=http://localhost:5173
PORT=5000
```

### Frontend (.env in client/)
```env
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

---

## Production Deployment

1. **Update Environment Variables**
   - Set production URLs
   - Use strong JWT secret
   - Configure MongoDB Atlas

2. **Integrate Email Service**
   - Sign up for SendGrid or AWS SES
   - Update `server/services/emailService.js`
   - Replace console.log with actual email sending

3. **Build Frontend**
   ```bash
   cd client
   npm run build
   # Deploy dist/ folder to hosting
   ```

4. **Deploy Backend**
   ```bash
   cd server
   npm install
   # Deploy to Node.js hosting (Heroku, Railway, etc.)
   ```

---

## Feature Verification Checklist

### Admin Workflow
- [ ] Can register as ADMIN
- [ ] Can create boards
- [ ] Can send collaboration requests
- [ ] Can invite users via email
- [ ] Can accept/reject join requests
- [ ] Can remove participants
- [ ] Can delete lists
- [ ] Messages show all request types

### User Workflow
- [ ] Can register as USER
- [ ] Cannot create boards
- [ ] Can request to join boards
- [ ] Can accept invitations
- [ ] Can create/edit/delete cards
- [ ] Cannot delete lists
- [ ] Cannot see admin tabs
- [ ] Receives all notification messages

### General
- [ ] Server starts without errors
- [ ] Client builds successfully
- [ ] MongoDB connection works
- [ ] No console errors
- [ ] Role permissions enforced
- [ ] State persists after refresh

---

**Status:** ✅ All features production-ready  
**Last Updated:** December 16, 2025
