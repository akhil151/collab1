# API Endpoint Test Checklist

## Authentication Endpoints ✅

### POST /api/auth/register
- [x] Creates user with role (ADMIN/USER)
- [x] Returns JWT token
- [x] Returns user object with id, name, email, role

### POST /api/auth/login  
- [x] Validates credentials
- [x] Returns JWT with role
- [x] Returns user object

### GET /api/auth/me
- [x] Requires valid JWT
- [x] Returns user profile
- [x] Returns 401 for invalid token

---

## Board Endpoints ✅

### GET /api/boards
- [x] Returns all boards user has access to
- [x] Includes owned boards
- [x] Includes joined boards

### POST /api/boards (ADMIN only)
- [x] Creates new board
- [x] Sets creator as owner
- [x] Initializes participants array
- [x] Returns 403 for USER role

### GET /api/boards/:id
- [x] Returns board details
- [x] Populates participants with user data
- [x] Includes name, email, role
- [x] Returns 404 for invalid board

### DELETE /api/boards/:id/members/:userId (ADMIN only)
- [x] Removes participant from board
- [x] Requires reason parameter
- [x] Sends email notification
- [x] Creates message notification

---

## Message Endpoints ✅

### GET /api/messages
- [x] Returns all messages for logged-in user
- [x] Populated sender data (name, email)
- [x] Populated board data (title)
- [x] Sorted by createdAt (newest first)

### GET /api/messages/unread-count
- [x] Returns count of unread messages
- [x] Requires authentication

### PUT /api/messages/:messageId/read
- [x] Marks single message as read
- [x] Updates read status
- [x] Returns success message
- [x] Returns 404 for invalid message

### PUT /api/messages/read-all
- [x] Marks all user messages as read
- [x] Updates unread count to 0
- [x] Returns success message

---

## Invitation Endpoints ✅

### POST /api/invitations
- [x] Creates invitation (ADMIN only)
- [x] Validates recipient email exists
- [x] Validates recipient role is USER
- [x] Returns error if ADMIN email (must use collaboration)
- [x] Sends email notification
- [x] Creates message with invitationId

### PUT /api/invitations/:id/accept
- [x] Accepts invitation
- [x] Adds user to board as member
- [x] Updates participants array
- [x] Sends confirmation email
- [x] Emits socket event

### PUT /api/invitations/:id/reject
- [x] Rejects invitation
- [x] Sends rejection email
- [x] Updates invitation status

---

## Join Request Endpoints ✅

### POST /api/join-requests
- [x] Creates join request (USER role)
- [x] Validates board exists
- [x] Sends notification to board owner
- [x] Creates message with joinRequestId

### GET /api/join-requests/board/:boardId
- [x] Returns pending requests for board
- [x] Only board owner can access
- [x] Returns 403 for non-owners

### PUT /api/join-requests/:id/accept
- [x] Accepts join request
- [x] Adds requester to board as member
- [x] Sends email confirmation
- [x] Emits socket event

### PUT /api/join-requests/:id/reject
- [x] Rejects join request
- [x] Accepts optional reason
- [x] Sends rejection email

---

## Collaboration Request Endpoints ✅

### POST /api/collaboration-requests
- [x] Creates collaboration request (ADMIN only)
- [x] Validates target board owner is ADMIN
- [x] Prevents requesting own board
- [x] Sends notification to board owner
- [x] Creates message with collaborationRequestId

### PUT /api/collaboration-requests/:id/accept
- [x] Accepts collaboration request
- [x] Adds requesting admin as member (not owner)
- [x] Sends confirmation email
- [x] Emits socket event

### PUT /api/collaboration-requests/:id/reject
- [x] Rejects collaboration request
- [x] Accepts optional reason
- [x] Sends rejection email

---

## Socket.IO Events ✅

### Connection Events
- [x] `join-user` - User joins personal room
- [x] `join-board` - User joins board room

### Board Events
- [x] `board:created` - New board created
- [x] `board:joined` - User joined board
- [x] `board:removed` - User removed from board

### Participant Events
- [x] `participant:added` - New participant added
- [x] `participant:removed` - Participant removed

### Message Events
- [x] `message:received` - New message notification

### Card/List Events
- [x] `card:created` - New card added
- [x] `card:updated` - Card modified
- [x] `card:moved` - Card moved
- [x] `list:created` - New list added

---

## Error Codes to Check

### 200 - Success
- GET requests return data

### 201 - Created
- POST requests for new resources

### 400 - Bad Request
- Invalid data format
- Missing required fields
- Business rule violations

### 401 - Unauthorized
- Missing token
- Invalid token
- Expired token

### 403 - Forbidden
- Insufficient permissions
- Role restrictions

### 404 - Not Found
- Invalid resource ID
- Deleted resources

### 500 - Server Error
- Database errors
- Unexpected errors

---

## Test Scenarios

### Scenario 1: ADMIN creates board and invites USER
1. ADMIN registers/logs in
2. ADMIN creates board → Should succeed
3. ADMIN sends invitation to USER email → Should succeed
4. USER receives message with Accept/Reject buttons → Should work
5. USER accepts invitation → Should be added to board
6. USER appears in Participants panel → Should show role as "Member"

### Scenario 2: USER requests to join board
1. USER registers/logs in
2. USER sends join request with Board ID → Should succeed
3. ADMIN receives message → Should show Accept/Reject buttons
4. ADMIN accepts request → Should add USER to board
5. USER receives confirmation message → Should work
6. USER can access board → Should succeed

### Scenario 3: ADMIN requests collaboration with another ADMIN
1. ADMIN A creates board
2. ADMIN B sends collaboration request with Board ID → Should succeed
3. ADMIN A receives collaboration request message → Should work
4. ADMIN A accepts → ADMIN B joins as Member (not owner)
5. ADMIN B can view/edit but not remove others → Should be enforced

### Scenario 4: ADMIN removes participant
1. ADMIN opens board
2. ADMIN clicks Participants panel
3. ADMIN sees 3 tabs → Participants, Send Invite, Requests
4. ADMIN clicks remove on a member → Popup asks for reason
5. ADMIN enters reason and confirms → User removed
6. Removed user receives email + message with reason → Should work

---

## Frontend-Backend Sync Checklist

- [x] Dashboard shows correct buttons based on role
- [x] Create Board button only for ADMIN
- [x] Collaborate button only for ADMIN
- [x] Join Request button only for USER
- [x] Messages page shows Accept/Reject buttons
- [x] Participants panel has 3 tabs for ADMIN
- [x] Participants panel is read-only for USER
- [x] Role badge displayed correctly
- [x] Real-time updates via Socket.IO

---

## Console Error Checks

Run through complete flow and verify:
- [ ] No 401 errors on valid requests
- [ ] No 404 errors on valid endpoints
- [ ] No CORS errors
- [ ] No Socket.IO connection errors
- [ ] No undefined property errors
- [ ] No null reference errors

---

## Production Readiness Checklist

- [x] All routes have authentication middleware
- [x] Role-based access control enforced on backend
- [x] Email notifications configured
- [x] Socket.IO CORS configured correctly
- [x] Error messages are user-friendly
- [x] All async operations have try-catch
- [x] Database operations are validated
- [x] JWT secret is environment variable
- [x] All schemas are properly defined
