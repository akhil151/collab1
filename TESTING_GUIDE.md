# CollabBoard - Testing & Verification Guide

## Features Implemented

### 1. Role-Based System ✅
**Backend:**
- User model includes `role` field (ADMIN/USER)
- JWT tokens include role claim
- Auth middleware exposes `req.userRole`
- Board creation requires ADMIN role

**Frontend:**
- Registration page has role selection dropdown
- Dashboard conditionally renders "Create Board" button
- ADMIN sees create options, USER sees access request message

**Test Steps:**
1. Register as ADMIN → should see "Create Board" buttons
2. Register as USER → should NOT see create buttons
3. USER tries to create board via API → should get 403

---

### 2. Participants Management ✅
**Backend:**
- Board model has `participants` array with user, role, joinedAt
- When board created, owner added to participants with "owner" role
- When invitation accepted, user added with "member" role
- When join request accepted, user added with "member" role

**Frontend:**
- ParticipantsPanel component with 3 tabs:
  - View Participants: List all with role badges, remove button
  - Send Invitation: Email input, message field
  - Join Requests: View pending, accept/reject

**Test Steps:**
1. Create board as ADMIN
2. Open participants panel (need to add button to Board.jsx)
3. Send invitation to USER email
4. USER checks messages, accepts invitation
5. Refresh board → USER should be in participants list

---

### 3. Invitation System ✅
**Backend:**
- POST /api/invitations - Send invitation (ADMIN only)
- GET /api/invitations - Get user's pending invitations
- PUT /api/invitations/:id/accept - Accept invitation
- PUT /api/invitations/:id/reject - Reject invitation
- Email notifications sent for all actions
- Message notifications created with invitationId in metadata

**Frontend:**
- ParticipantsPanel "Send Invite" tab
- Messages page shows invitations with Accept/Reject buttons
- Navbar shows unread message count

**Test Steps:**
1. ADMIN sends invitation to user@example.com
2. Check console for email log (or actual email if configured)
3. USER logs in, sees message badge in navbar
4. USER clicks Messages, sees invitation
5. USER clicks Accept → should join board
6. Check /api/boards response → USER should be in members and participants

---

### 4. Join Request System ✅
**Backend:**
- POST /api/join-requests - Create join request (any user)
- GET /api/join-requests/board/:boardId - Get board's pending requests (ADMIN)
- PUT /api/join-requests/:id/accept - Accept request (ADMIN)
- PUT /api/join-requests/:id/reject - Reject request with reason (ADMIN)
- Email notifications sent for all actions

**Frontend:**
- ParticipantsPanel "Join Requests" tab (ADMIN only)
- Shows pending requests with Accept/Reject buttons
- Rejection requires reason input

**Test Steps:**
1. USER finds board ID (via dashboard or URL)
2. USER calls POST /api/join-requests with boardId
3. ADMIN opens participants panel → sees request in "Requests" tab
4. ADMIN accepts request
5. USER receives notification
6. Verify USER is now in board members and participants

---

### 5. Messaging System ✅
**Backend:**
- GET /api/messages - Get all user's messages
- GET /api/messages/unread-count - Get unread count
- PUT /api/messages/:id/read - Mark message as read
- PUT /api/messages/read-all - Mark all as read
- Message types: invitation, join_request, request_accepted, request_rejected, removed_from_board

**Frontend:**
- Messages page at /messages route
- Filter by: All, Unread, Invitations, Requests
- Each message shows icon, board name, sender, timestamp
- Invitations have Accept/Reject action buttons
- Click message to mark as read
- "Mark all as read" button

**Test Steps:**
1. Send invitation → recipient should see message
2. Submit join request → board admin should see message
3. Accept request → requester should see accepted message
4. Click message → unread count should decrease
5. Test all filters

---

### 6. CardWorkspace Fixes ✅
**Resize Stability:**
- Fixed calculation to use initial element position
- Handles from top (n, ne, nw) no longer cause jumps
- Elements constrain to canvas bounds (1600x1200)

**Shape Text:**
- Double-click shape to edit text
- Input field appears centered in shape
- Auto-sizes based on shape width
- Saves to backend via socket and autosave

**Connector Persistence:**
- Connectors array saves with fromElementId, toElementId, anchors
- Loads from backend on card fetch
- Survives page refresh

**Test Steps:**
1. Create text box → resize from all 8 handles → should be smooth
2. Create shape → double-click → type text → save
3. Refresh page → text in shape should persist
4. Create connector between elements → refresh → connector should re-render
5. Check no console errors

---

### 7. Email Notifications ✅
**Service Setup:**
- emailService.js with 6 notification functions
- Currently logs to console
- Ready for SendGrid/AWS SES integration

**Notification Types:**
1. sendInvitationEmail - When ADMIN invites USER
2. sendJoinRequestEmail - When USER requests to join
3. sendRequestAcceptedEmail - When request is accepted
4. sendRequestRejectedEmail - When request is rejected
5. sendRemovalEmail - When USER removed from board
6. sendCollaborationRequestEmail - For collaboration requests

**Test Steps:**
1. Trigger each action → check console for email logs
2. Verify all emails have proper subject, recipient, content
3. To enable actual emails:
   - Add SendGrid API key to .env
   - Uncomment SendGrid code in emailService.js
   - Add CLIENT_URL env variable

---

## Integration Points to Complete

### 1. Add Participants Button to Board.jsx
The ParticipantsPanel component exists but needs to be imported and triggered:

```jsx
import ParticipantsPanel from "../components/ParticipantsPanel"

// In Board component:
const [showParticipants, setShowParticipants] = useState(false)

// Add button in header:
<button onClick={() => setShowParticipants(true)}>
  <Users className="w-5 h-5" /> Participants
</button>

// Render panel:
<ParticipantsPanel 
  isOpen={showParticipants} 
  onClose={() => setShowParticipants(false)}
  boardId={board._id}
/>
```

### 2. Socket Events for Participant Changes
Add to socketHandler.js:
```js
socket.on("participant:added", ({ boardId, participant }) => {
  socket.to(`board-${boardId}`).emit("participant:added", { participant })
})

socket.on("participant:removed", ({ boardId, userId }) => {
  socket.to(`board-${boardId}`).emit("participant:removed", { userId })
})
```

### 3. Board Layout 4-Column Fix
Update Board.jsx list rendering to enforce 4 columns:
```jsx
<div className="grid grid-cols-4 gap-4">
  {board.lists.map((list) => (
    <div key={list._id} className="h-[600px] overflow-y-auto">
      {/* list content */}
    </div>
  ))}
</div>
```

### 4. Remove Participant Endpoint
Add to boardController.js:
```js
export const removeParticipant = async (req, res) => {
  // Remove from members and participants arrays
  // Send removal email
  // Create message notification
  // Emit socket event
}
```

---

## Environment Variables Required

### Backend (.env)
```
MONGODB_URI=mongodb://localhost:27017/collaboration-board
JWT_SECRET=your-secret-key
PORT=5000
CLIENT_URL=http://localhost:5173

# Optional for email
SENDGRID_API_KEY=your-sendgrid-key
FROM_EMAIL=noreply@collabboard.com
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

---

## Testing Checklist

### Registration & Auth
- [ ] Register as ADMIN → role saved in DB
- [ ] Register as USER → role saved in DB
- [ ] Login → JWT includes role claim
- [ ] Auth middleware exposes req.userRole

### Board Creation
- [ ] ADMIN can create board via UI
- [ ] USER cannot see create button
- [ ] USER API call returns 403
- [ ] Board.participants has owner on creation

### Invitations
- [ ] ADMIN can send invitation
- [ ] Email notification sent/logged
- [ ] USER receives message notification
- [ ] Message has invitationId in metadata
- [ ] USER can accept invitation
- [ ] USER added to board members and participants
- [ ] USER can reject invitation
- [ ] ADMIN receives acceptance/rejection notification

### Join Requests
- [ ] USER can submit join request
- [ ] ADMIN receives notification
- [ ] ADMIN can view pending requests
- [ ] ADMIN can accept request
- [ ] USER added to board and receives notification
- [ ] ADMIN can reject with reason
- [ ] USER receives rejection notification with reason

### Messages
- [ ] Navbar shows unread count badge
- [ ] Messages page lists all notifications
- [ ] Filters work (All, Unread, Invitations, Requests)
- [ ] Click message marks as read
- [ ] Mark all as read works
- [ ] Accept/Reject buttons functional for invitations

### Participants Panel
- [ ] Participants tab shows all members with roles
- [ ] Owner has crown badge
- [ ] Admin has shield badge
- [ ] Member has user badge
- [ ] Send Invite tab (ADMIN only)
- [ ] Email validation works
- [ ] Requests tab shows pending (ADMIN only)
- [ ] Accept/Reject buttons work
- [ ] Remove button works (ADMIN only, not for owner)

### CardWorkspace
- [ ] Resize from all 8 handles is smooth
- [ ] No jumps from top handles (n, ne, nw)
- [ ] Elements stay within bounds
- [ ] Double-click shape to edit text
- [ ] Shape text persists after save
- [ ] Connectors save with element IDs and anchors
- [ ] Connectors re-render after refresh
- [ ] No console errors

### Persistence
- [ ] All data survives browser refresh
- [ ] Board participants persist
- [ ] Messages persist
- [ ] Invitations persist
- [ ] Join requests persist
- [ ] Card workspace elements persist
- [ ] Connectors persist

### Role Enforcement
- [ ] Backend rejects USER board creation
- [ ] Backend allows ADMIN board creation
- [ ] Only board owner can send invitations
- [ ] Only board owner can accept/reject requests
- [ ] Only board owner can remove participants

---

## Known Issues & Future Enhancements

### TO-DO:
1. Add "Remove Participant" endpoint and socket event
2. Add "Participants" button to Board.jsx header
3. Implement 4-column board layout with fixed height
4. Add socket events for real-time participant updates
5. Integrate actual email service (SendGrid/AWS SES)
6. Add participant role upgrade (member → admin)
7. Add board search/filter in dashboard
8. Add user search for invitations (autocomplete)
9. Add pagination for messages
10. Add notification sound/toast for new messages

### Performance Optimizations:
1. Debounce message polling
2. Cache unread count
3. Lazy load messages
4. Optimize board list queries
5. Add indexes to MongoDB collections

---

## API Endpoints Summary

### Auth
- POST /api/auth/register - Register with role
- POST /api/auth/login - Login, returns JWT with role

### Boards
- POST /api/boards - Create board (ADMIN only)
- GET /api/boards - Get user's boards
- GET /api/boards/:id - Get board details with participants
- PUT /api/boards/:id - Update board
- DELETE /api/boards/:id - Delete board (owner only)

### Invitations
- POST /api/invitations - Send invitation (board owner only)
- GET /api/invitations - Get user's invitations
- PUT /api/invitations/:id/accept - Accept invitation
- PUT /api/invitations/:id/reject - Reject invitation

### Join Requests
- POST /api/join-requests - Submit join request
- GET /api/join-requests/board/:boardId - Get board's requests (owner only)
- PUT /api/join-requests/:id/accept - Accept request (owner only)
- PUT /api/join-requests/:id/reject - Reject request with reason (owner only)

### Messages
- GET /api/messages - Get all messages
- GET /api/messages/unread-count - Get unread count
- PUT /api/messages/:id/read - Mark as read
- PUT /api/messages/read-all - Mark all as read

### Lists & Cards
- POST /api/lists - Create list
- DELETE /api/lists/:id - Delete list
- POST /api/cards - Create card
- PUT /api/cards/:id - Update card (includes elements and connectors)
- DELETE /api/cards/:id - Delete card

---

## Socket Events

### Board Events
- join-board - Join board room
- board:created - New board created
- board:deleted - Board deleted

### List Events
- list:created - New list added
- list:deleted - List removed

### Card Events
- card:created - New card added
- card:updated - Card modified
- card:moved - Card moved between lists

### Workspace Events
- workspace:save - Card workspace saved
- element:add - Element added to workspace
- element:update - Element updated
- element:delete - Element deleted
- connector:add - Connector created
- connector:deleted - Connector removed

### Participant Events (TODO)
- participant:added - User joined board
- participant:removed - User removed from board
- invitation:sent - Invitation sent
- request:accepted - Join request accepted

---

## Troubleshooting

### Issue: Unread count not updating
**Solution:** Check if message polling interval is running, verify API returns correct count

### Issue: Invitation not showing in messages
**Solution:** Check metadata.invitationId is set, verify Message document created

### Issue: USER can't accept invitation
**Solution:** Check if invitation.recipient matches logged-in userId

### Issue: Participants not populating
**Solution:** Verify Board.findById includes .populate("participants.user", "name email")

### Issue: Connectors disappear after refresh
**Solution:** Check Card model has connectors field, verify save includes connectors array

### Issue: Resize causes elements to jump
**Solution:** Verify handleResize uses elementStart position, not current element position

### Issue: Role not enforced
**Solution:** Check middleware sets req.userRole, verify controller checks role before action

---

## Production Deployment Checklist

- [ ] Set secure JWT_SECRET
- [ ] Configure MongoDB connection string
- [ ] Set up SendGrid/AWS SES with API keys
- [ ] Set CLIENT_URL to production domain
- [ ] Enable HTTPS
- [ ] Add rate limiting to auth endpoints
- [ ] Add input validation middleware
- [ ] Set up error logging (Sentry/LogRocket)
- [ ] Add database backups
- [ ] Configure CORS for production domain
- [ ] Add API request logging
- [ ] Set up monitoring (uptime, performance)
- [ ] Add database indexes for queries
- [ ] Implement caching (Redis)
- [ ] Set up CDN for static assets
- [ ] Add comprehensive error handling
- [ ] Implement request throttling for invitations
- [ ] Add spam protection for messages
- [ ] Set up automated tests
- [ ] Configure CI/CD pipeline
- [ ] Add security headers
