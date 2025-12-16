# Quick Reference Card - Collaboration Board System

## 🚀 Start Application

```bash
# Backend
cd collab/server && npm start

# Frontend  
cd collab/client && npm run dev
```

---

## 🔑 User Roles

| Role | Can Create Boards | Can Invite Users | Can Manage Board | Can Join Boards |
|------|------------------|------------------|------------------|-----------------|
| ADMIN | ✅ Yes | ✅ Yes (USER only) | ✅ Yes (own boards) | ✅ Via Collaboration |
| USER | ❌ No | ❌ No | ❌ No | ✅ Via Join Request |

---

## 📋 Dashboard Buttons

### ADMIN Dashboard
- **Create New Board** (Purple) → Opens CreateBoardModal
- **Collaborate by Board ID** (White) → Opens CollaborationModal

### USER Dashboard
- **Request to Join Board** (Blue) → Opens JoinRequestModal

---

## 👥 Participants Panel Tabs

### ADMIN (Board Owner) - 3 Tabs
1. **Participants** - View and remove members
2. **Send Invite** - Invite USER by email
3. **Requests** - Accept/reject join requests

### ADMIN (Board Member) / USER - 1 Tab
1. **Participants** - View only (read-only)

---

## 💬 Message Types & Actions

| Message Type | Recipient | Actions | Result |
|-------------|-----------|---------|--------|
| Join Request | Board Owner | Accept / Reject | USER joins as Member |
| Board Invitation | USER | Accept / Reject | USER joins as Member |
| Collaboration Request | Board Owner | Accept / Reject | ADMIN joins as Member |
| Request Accepted | Requester | Read | Confirmation |
| Request Rejected | Requester | Read | With reason |
| Removal Notice | Removed User | Read | With reason |

---

## 🔄 Collaboration Flows

### ADMIN → ADMIN Collaboration
```
ADMIN B → Collaborate Button → Enter ADMIN A's Board ID
→ ADMIN A receives Collaboration Request message
→ ADMIN A accepts → ADMIN B joins as Member (not Owner)
```

### USER → Board Join
```
USER → Join Request Button → Enter Board ID
→ ADMIN receives Join Request message
→ ADMIN accepts → USER joins as Member
```

### ADMIN → USER Invitation
```
ADMIN → Board → Participants → Send Invite Tab → Enter USER email
→ USER receives Invitation message
→ USER accepts → USER joins as Member
```

---

## 🌐 API Endpoints Quick Reference

### Authentication
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Boards
- `GET /api/boards` - Get all accessible boards
- `POST /api/boards` - Create board (ADMIN only)
- `GET /api/boards/:id` - Get board details
- `DELETE /api/boards/:id/members/:userId` - Remove participant

### Messages
- `GET /api/messages` - Get all messages
- `GET /api/messages/unread-count` - Get unread count
- `PUT /api/messages/:id/read` - Mark as read
- `PUT /api/messages/read-all` - Mark all as read

### Invitations
- `POST /api/invitations` - Send invitation (ADMIN only)
- `PUT /api/invitations/:id/accept` - Accept invitation
- `PUT /api/invitations/:id/reject` - Reject invitation

### Join Requests
- `POST /api/join-requests` - Send join request
- `GET /api/join-requests/board/:boardId` - Get board requests
- `PUT /api/join-requests/:id/accept` - Accept request
- `PUT /api/join-requests/:id/reject` - Reject request

### Collaboration Requests
- `POST /api/collaboration-requests` - Send collaboration request
- `PUT /api/collaboration-requests/:id/accept` - Accept request
- `PUT /api/collaboration-requests/:id/reject` - Reject request

---

## 🔌 Socket.IO Events

### Emit from Client
- `join-user` - Join personal room
- `join-board` - Join board room

### Listen on Client
- `board:joined` - Board access granted
- `board:removed` - Removed from board
- `participant:added` - New participant
- `participant:removed` - Participant removed
- `message:received` - New message
- `card:created` - New card
- `card:updated` - Card modified
- `list:created` - New list

---

## 🐛 Debugging Checklist

### Console Errors
- ✅ Check browser console (F12)
- ✅ No red errors should appear
- ✅ Socket connection should show "connected"

### API Errors
- ✅ Check Network tab for failed requests
- ✅ Verify Authorization header has token
- ✅ Check response status codes

### Common Issues

**Participants panel shows 1 tab for ADMIN:**
- Check: `board.owner._id === user.id` comparison
- Fix: Re-login to sync user object

**401 Unauthorized:**
- Check: localStorage has "token"
- Fix: Re-login to get new token

**Socket not connecting:**
- Check: CLIENT_URL in server .env
- Fix: Match frontend URL exactly

**Messages have no action buttons:**
- Check: Message has `metadata.invitationId/joinRequestId/collaborationRequestId`
- Fix: Ensure backend creates message with proper metadata

---

## 📁 File Structure

```
collab/
├── server/
│   ├── controllers/
│   │   ├── authController.js (✅ includes role in JWT)
│   │   ├── boardController.js (✅ populates participants)
│   │   ├── messageController.js (✅ read endpoints exist)
│   │   ├── invitationController.js (✅ validates USER role)
│   │   ├── joinRequestController.js (✅ complete flow)
│   │   └── collaborationRequestController.js (✅ ADMIN-to-ADMIN)
│   ├── models/
│   │   ├── User.js (✅ role field with ADMIN/USER)
│   │   ├── Board.js (✅ participants array with roles)
│   │   └── Message.js (✅ metadata with request IDs)
│   ├── middleware/
│   │   └── auth.js (✅ verifyToken extracts role)
│   └── server.js (✅ CORS configured correctly)
│
├── client/src/
│   ├── pages/
│   │   ├── Dashboard.jsx (✅ role badge, role-based buttons)
│   │   ├── Messages.jsx (✅ action buttons working)
│   │   └── Board.jsx (✅ socket error handling)
│   ├── components/
│   │   ├── ParticipantsPanel.jsx (✅ 3 tabs for ADMIN)
│   │   ├── CollaborationModal.jsx (✅ ADMIN collaboration)
│   │   └── JoinRequestModal.jsx (✅ USER join)
│   └── utils/
│       └── socket.js (✅ connection management)
```

---

## 🎯 Success Criteria

System working correctly when:
- ✅ No console errors during usage
- ✅ Role badge displays on dashboard
- ✅ Correct buttons show based on role
- ✅ Participants panel has correct tabs
- ✅ Messages have action buttons
- ✅ Actions work (accept/reject)
- ✅ Real-time updates work
- ✅ Data persists after refresh

---

## 📚 Documentation Files

1. **CONSOLE_ERRORS_FIXED.md** - All fixes applied
2. **API_TEST_CHECKLIST.md** - API verification
3. **TESTING_GUIDE.md** - Manual testing flows
4. **IMPLEMENTATION_STATUS.md** - Current status
5. **QUICK_REFERENCE.md** - This file

---

## 🔐 Environment Variables

```env
# Server (.env)
PORT=5000
MONGODB_URI=mongodb://localhost:27017/collaboration-board
JWT_SECRET=your-secret-key-here
CLIENT_URL=http://localhost:5173

# Client (.env)
VITE_API_URL=http://localhost:5000
```

---

## 🎓 Key Concepts

1. **Role Enforcement**: Always enforced on backend, UI follows backend
2. **Real-Time**: Socket.IO keeps all clients synchronized
3. **Messaging**: Central communication hub for all requests
4. **Participants**: Dynamic list with role-based permissions
5. **Collaboration**: ADMIN-to-ADMIN via Board ID, downgrade to Member

---

**Last Updated**: December 16, 2025
**Status**: Production Ready (Phases 1-7)
