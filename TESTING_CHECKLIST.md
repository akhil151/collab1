# 🧪 TESTING CHECKLIST - Complete Feature Verification

**Date:** December 16, 2025  
**Status:** Ready for Testing

---

## ✅ PRE-TEST SETUP

### 1. Start Services
```bash
# Terminal 1: Start MongoDB
mongod

# Terminal 2: Start Backend
cd c:\collab\collab\server
node server.js

# Terminal 3: Start Frontend
cd c:\collab\collab\client
npm run dev
```

### 2. Verify Services
- [ ] Server shows: "Server running on port 5000"
- [ ] Server shows: "Connected to MongoDB"
- [ ] Client shows: "Local: http://localhost:5173/"
- [ ] No console errors in any terminal

---

## 👤 TEST SCENARIO 1: ADMIN USER WORKFLOW

### Setup
- [ ] Navigate to http://localhost:5173/register
- [ ] Register new user: admin1@test.com / password123
- [ ] Select role: **ADMIN**
- [ ] Click Register
- [ ] Verify redirect to Dashboard

### Feature 1: Create Board
- [ ] Click "Create New Board" button (hero section or top right)
- [ ] Enter title: "Test Board 1"
- [ ] Enter description: "Testing board creation"
- [ ] Select a color
- [ ] Click Create
- [ ] **VERIFY:** Board appears in dashboard
- [ ] **VERIFY:** Click board → opens board page
- [ ] **VERIFY:** Board ID visible in URL

### Feature 2: Admin Collaboration Request
- [ ] Register second admin: admin2@test.com (role: ADMIN)
- [ ] Login as admin2
- [ ] Create board: "Admin2's Board"
- [ ] Logout, login as admin1
- [ ] Click "Collaborate" button
- [ ] **VERIFY:** Dropdown shows "Admin2's Board"
- [ ] Select board, add message: "Let's work together"
- [ ] Click Send Request
- [ ] **VERIFY:** Success alert appears
- [ ] Logout, login as admin2
- [ ] Go to Messages page
- [ ] **VERIFY:** Collaboration request message visible
- [ ] **VERIFY:** Shows admin1's name and board title
- [ ] Click Accept
- [ ] **VERIFY:** Success message
- [ ] Go to Dashboard
- [ ] **VERIFY:** "Admin2's Board" now shows admin1 as member
- [ ] Logout, login as admin1
- [ ] **VERIFY:** "Admin2's Board" appears in your dashboard
- [ ] **VERIFY:** Can open and view the board
- [ ] **VERIFY:** Shows as "member" role (not owner)

### Feature 3: Participants Panel - View Tab
- [ ] Open "Test Board 1"
- [ ] Click "Participants" button
- [ ] **VERIFY:** Panel slides in from right
- [ ] **VERIFY:** Shows 3 tabs (only for owner)
- [ ] **VERIFY:** "Participants" tab is active
- [ ] **VERIFY:** Shows your name with "Owner" badge
- [ ] **VERIFY:** Shows join date

### Feature 4: Send Invitation
- [ ] Click "Send Invite" tab
- [ ] Enter email: user1@test.com
- [ ] Add message: "Join our board!"
- [ ] Click Send Invitation
- [ ] **VERIFY:** Success alert
- [ ] **VERIFY:** Form clears
- [ ] Open new incognito window
- [ ] Register as user1@test.com (role: USER)
- [ ] Go to Messages page
- [ ] **VERIFY:** Invitation message visible
- [ ] **VERIFY:** Shows sender name and board name
- [ ] Click Accept
- [ ] **VERIFY:** Success message
- [ ] Go to Dashboard
- [ ] **VERIFY:** Board appears in dashboard

### Feature 5: Join Request Management
- [ ] Register user2@test.com (role: USER)
- [ ] Copy Board ID from URL of "Test Board 1"
- [ ] Click "Request to Join Board"
- [ ] Paste Board ID
- [ ] Add message: "Please let me join"
- [ ] Click Send Request
- [ ] **VERIFY:** Success alert
- [ ] Switch back to admin1
- [ ] Open "Test Board 1"
- [ ] Click Participants → "Requests" tab
- [ ] **VERIFY:** Shows user2's join request
- [ ] **VERIFY:** Shows name, email, message, date
- [ ] Click Accept
- [ ] **VERIFY:** Success alert
- [ ] **VERIFY:** Request disappears
- [ ] Switch to "Participants" tab
- [ ] **VERIFY:** user2 now listed as Member
- [ ] Switch to user2 account
- [ ] Go to Messages
- [ ] **VERIFY:** "Request Accepted" message
- [ ] Go to Dashboard
- [ ] **VERIFY:** Board appears

### Feature 6: Remove Member
- [ ] Login as admin1
- [ ] Open "Test Board 1"
- [ ] Participants → "Participants" tab
- [ ] Find user2 (member)
- [ ] Click trash icon
- [ ] **VERIFY:** Confirmation dialog
- [ ] Confirm
- [ ] **VERIFY:** Reason prompt appears
- [ ] Enter reason: "Testing removal feature"
- [ ] **VERIFY:** Success alert
- [ ] **VERIFY:** user2 removed from list
- [ ] Switch to user2 account
- [ ] Go to Messages
- [ ] **VERIFY:** "Removed from Board" message
- [ ] **VERIFY:** Shows reason
- [ ] Go to Dashboard
- [ ] **VERIFY:** Board no longer visible

---

## 👥 TEST SCENARIO 2: USER ROLE WORKFLOW

### Setup
- [ ] Login as user1@test.com (or register new USER)
- [ ] Verify Dashboard loads

### Feature 1: Request to Join Board
- [ ] **VERIFY:** "Create New Board" button NOT visible
- [ ] **VERIFY:** "Collaborate" button NOT visible
- [ ] **VERIFY:** "Request to Join Board" button IS visible
- [ ] Click "Request to Join Board"
- [ ] Get Board ID from admin's board
- [ ] Enter Board ID
- [ ] Add message
- [ ] Click Send Request
- [ ] **VERIFY:** Success alert
- [ ] Go to Messages
- [ ] **VERIFY:** Request shows as pending

### Feature 2: Accept Invitation
- [ ] Have admin send invitation to your email
- [ ] Go to Messages page
- [ ] **VERIFY:** Invitation message appears
- [ ] Click Accept
- [ ] **VERIFY:** Success message
- [ ] Go to Dashboard
- [ ] **VERIFY:** Board appears

### Feature 3: Board Access - Allowed Actions
- [ ] Open board (where you're a member)
- [ ] **TEST:** Create new card
  - [ ] Click "Add Card" or similar
  - [ ] **VERIFY:** Can create card
- [ ] **TEST:** Edit card
  - [ ] Click existing card
  - [ ] **VERIFY:** Can edit title/description
- [ ] **TEST:** Delete card
  - [ ] Click delete on card
  - [ ] **VERIFY:** Can delete
- [ ] **TEST:** Drag card between lists
  - [ ] Drag card to different list
  - [ ] **VERIFY:** Card moves successfully

### Feature 4: Board Access - Restricted Actions
- [ ] **TEST:** Delete list
  - [ ] Look for trash icon on list
  - [ ] **VERIFY:** Trash icon NOT visible (if not owner)
  - [ ] Or try API call directly
  - [ ] **VERIFY:** Returns 403 error
- [ ] **TEST:** Participants panel
  - [ ] Click "Participants" button
  - [ ] **VERIFY:** Panel opens
  - [ ] **VERIFY:** Only 1 tab visible ("Participants")
  - [ ] **VERIFY:** No "Send Invite" tab
  - [ ] **VERIFY:** No "Requests" tab
  - [ ] **VERIFY:** No remove buttons on participants
- [ ] **TEST:** Create board
  - [ ] Go to Dashboard
  - [ ] **VERIFY:** No "Create New Board" button

---

## 📨 TEST SCENARIO 3: MESSAGING SYSTEM

### Message Type: Invitation
- [ ] Admin sends invitation to user
- [ ] **VERIFY:** Message appears in user's Messages
- [ ] **VERIFY:** Icon: Mail (blue)
- [ ] **VERIFY:** Title: "Board Invitation"
- [ ] **VERIFY:** Shows sender name, board name
- [ ] **VERIFY:** Accept/Reject buttons visible
- [ ] **VERIFY:** Unread badge on Navbar
- [ ] Click message
- [ ] **VERIFY:** Unread badge decreases

### Message Type: Join Request
- [ ] User sends join request
- [ ] Admin checks Messages
- [ ] **VERIFY:** Message appears
- [ ] **VERIFY:** Icon: UserPlus (purple)
- [ ] **VERIFY:** Title: "Join Request"
- [ ] **VERIFY:** Shows requester name, board name

### Message Type: Request Accepted
- [ ] Admin accepts join request
- [ ] User checks Messages
- [ ] **VERIFY:** Message appears
- [ ] **VERIFY:** Icon: CheckCircle (green)
- [ ] **VERIFY:** Title: "Request Accepted"
- [ ] **VERIFY:** Shows board name

### Message Type: Request Rejected
- [ ] Admin rejects join request with reason
- [ ] User checks Messages
- [ ] **VERIFY:** Message appears
- [ ] **VERIFY:** Icon: XCircle (red)
- [ ] **VERIFY:** Title: "Request Rejected"
- [ ] **VERIFY:** Shows reason

### Message Type: Removed from Board
- [ ] Admin removes member with reason
- [ ] User checks Messages
- [ ] **VERIFY:** Message appears
- [ ] **VERIFY:** Icon: Trash (orange)
- [ ] **VERIFY:** Title: "Removed from Board"
- [ ] **VERIFY:** Shows removal reason

### Message Type: Collaboration Request
- [ ] Admin1 sends collaboration request to Admin2's board
- [ ] Admin2 checks Messages
- [ ] **VERIFY:** Message appears
- [ ] **VERIFY:** Icon: UserCheck (purple)
- [ ] **VERIFY:** Title: "Collaboration Request"
- [ ] **VERIFY:** Shows requester name, board name
- [ ] **VERIFY:** Accept/Reject buttons visible

### Message Type: Collaboration Accepted
- [ ] Admin2 accepts collaboration request
- [ ] Admin1 checks Messages
- [ ] **VERIFY:** Message appears
- [ ] **VERIFY:** Icon: CheckCircle (green)
- [ ] **VERIFY:** Title: "Collaboration Accepted"
- [ ] **VERIFY:** Board now in dashboard

### Message Type: Collaboration Rejected
- [ ] Admin2 rejects collaboration request
- [ ] Admin1 checks Messages
- [ ] **VERIFY:** Message appears
- [ ] **VERIFY:** Icon: XCircle (red)
- [ ] **VERIFY:** Title: "Collaboration Rejected"

### Message Features
- [ ] Click "Mark all as read"
- [ ] **VERIFY:** All unread badges disappear
- [ ] **VERIFY:** Purple background removed from messages
- [ ] Filter: Click "Unread"
- [ ] **VERIFY:** Only unread messages show
- [ ] Filter: Click "Invitations"
- [ ] **VERIFY:** Only invitation messages show
- [ ] Filter: Click "Requests"
- [ ] **VERIFY:** All request types show

---

## 🔒 TEST SCENARIO 4: PERMISSION ENFORCEMENT

### Backend Enforcement Tests

**Test 1: USER Cannot Create Board**
```bash
# Open browser console
const token = localStorage.getItem('token') // while logged in as USER
fetch('http://localhost:5000/api/boards', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({ title: 'Test', description: 'Test' })
})
.then(r => r.json())
.then(console.log)

# Expected: { message: "Only ADMIN users can create boards" }
# Status: 403
```

**Test 2: USER Cannot Delete List**
```bash
# Get list ID from board URL or inspect
const token = localStorage.getItem('token')
const listId = 'LIST_ID_HERE'
fetch(`http://localhost:5000/api/lists/${listId}`, {
  method: 'DELETE',
  headers: { 'Authorization': `Bearer ${token}` }
})
.then(r => r.json())
.then(console.log)

# Expected: { message: "Only board owner can delete lists" }
# Status: 403
```

**Test 3: Non-Owner Cannot Send Invitations**
- [ ] Login as user who is member (not owner) of board
- [ ] Try to send invitation via API
- [ ] **VERIFY:** 403 error returned

**Test 4: Non-Admin Cannot Send Collaboration Request**
- [ ] Login as USER
- [ ] Try to access collaboration endpoint
- [ ] **VERIFY:** 403 error returned

### Frontend Enforcement Tests
- [ ] Login as USER
- [ ] **VERIFY:** "Create New Board" button hidden
- [ ] **VERIFY:** "Collaborate" button hidden
- [ ] Open board as member (not owner)
- [ ] **VERIFY:** Delete list trash icon hidden
- [ ] Open Participants panel
- [ ] **VERIFY:** Only Participants tab visible
- [ ] **VERIFY:** No Send Invite tab
- [ ] **VERIFY:** No Requests tab
- [ ] **VERIFY:** No remove buttons on participants

---

## 🔄 TEST SCENARIO 5: PERSISTENCE & REFRESH

### Test 1: Board Membership Persists
- [ ] Login as user, join board
- [ ] **VERIFY:** Board in dashboard
- [ ] Refresh page (F5)
- [ ] **VERIFY:** Board still in dashboard
- [ ] Close browser, reopen
- [ ] Login again
- [ ] **VERIFY:** Board still in dashboard

### Test 2: Participant List Persists
- [ ] Open board
- [ ] Note participants list
- [ ] Refresh page
- [ ] Open participants panel
- [ ] **VERIFY:** Same participants shown
- [ ] **VERIFY:** Roles correct
- [ ] **VERIFY:** Join dates correct

### Test 3: Messages Persist
- [ ] Check Messages page
- [ ] Note message count
- [ ] Refresh page
- [ ] **VERIFY:** Same messages shown
- [ ] **VERIFY:** Read/unread status preserved
- [ ] Close browser, reopen, login
- [ ] **VERIFY:** Messages still there

### Test 4: Join Request Status Persists
- [ ] Send join request
- [ ] **VERIFY:** Status "pending" in admin's panel
- [ ] Refresh both user and admin browsers
- [ ] **VERIFY:** Status still "pending"
- [ ] Admin accepts
- [ ] Refresh user browser
- [ ] **VERIFY:** Board appears in dashboard

---

## 🌐 TEST SCENARIO 6: REAL-TIME FEATURES

### Test: Real-Time Board Updates
- [ ] Open same board in 2 browser windows
- [ ] Window 1: Create new card
- [ ] **VERIFY:** Window 2 shows new card (refresh if needed)
- [ ] Window 2: Move card to different list
- [ ] **VERIFY:** Window 1 shows card in new position

### Test: Real-Time Participant Updates
- [ ] Admin: Open Participants panel
- [ ] Keep panel open
- [ ] Different window: Admin adds new member
- [ ] **VERIFY:** Panel updates to show new member
- [ ] Different window: Admin removes member
- [ ] **VERIFY:** Panel updates to remove member

---

## 📧 TEST SCENARIO 7: EMAIL NOTIFICATIONS

**Note:** In development, emails log to server console

### Test All Email Types
- [ ] Send board invitation
- [ ] **VERIFY:** Server console shows email log
- [ ] **VERIFY:** Log includes: recipient, subject, body

- [ ] Send join request
- [ ] **VERIFY:** Server console shows email to board owner

- [ ] Accept join request
- [ ] **VERIFY:** Server console shows acceptance email

- [ ] Reject join request with reason
- [ ] **VERIFY:** Server console shows rejection email
- [ ] **VERIFY:** Email includes reason

- [ ] Remove member with reason
- [ ] **VERIFY:** Server console shows removal email
- [ ] **VERIFY:** Email includes reason

- [ ] Send collaboration request
- [ ] **VERIFY:** Server console shows email to board owner

- [ ] Accept collaboration request
- [ ] **VERIFY:** Server console shows acceptance email

- [ ] Reject collaboration request
- [ ] **VERIFY:** Server console shows rejection email

---

## 🐛 ERROR HANDLING TESTS

### Test 1: Invalid Board ID
- [ ] Click "Request to Join Board"
- [ ] Enter invalid ID: "invalid123"
- [ ] Click Send
- [ ] **VERIFY:** Error message displayed
- [ ] **VERIFY:** "Board not found" or similar

### Test 2: Duplicate Join Request
- [ ] Send join request to board
- [ ] Try to send another request to same board
- [ ] **VERIFY:** Error message
- [ ] **VERIFY:** "Request already pending" or similar

### Test 3: Network Error
- [ ] Stop backend server
- [ ] Try to create board
- [ ] **VERIFY:** Error message displayed
- [ ] **VERIFY:** User-friendly error shown

### Test 4: Unauthorized Access
- [ ] Logout
- [ ] Try to access board directly by URL
- [ ] **VERIFY:** Redirects to login

---

## ✅ FINAL VERIFICATION CHECKLIST

### Build & Startup
- [ ] Server starts without errors
- [ ] Client builds without errors
- [ ] MongoDB connects successfully
- [ ] No console errors on page load

### Core Features
- [ ] ADMIN can create boards
- [ ] ADMIN can collaborate with other admins
- [ ] ADMIN can manage participants
- [ ] USER can request to join boards
- [ ] USER can accept invitations
- [ ] USER has proper restrictions

### Data Persistence
- [ ] Board membership survives refresh
- [ ] Messages persist
- [ ] Participants list accurate
- [ ] Request status maintained

### Permissions
- [ ] Backend enforces all role restrictions
- [ ] Frontend hides unauthorized UI
- [ ] API returns proper 403 errors
- [ ] No permission leaks possible

### User Experience
- [ ] No broken buttons
- [ ] No console errors
- [ ] All modals work
- [ ] All forms validate
- [ ] All alerts show proper messages
- [ ] Loading states work
- [ ] Error states work

---

## 🎉 SUCCESS CRITERIA

**ALL tests must pass for production readiness:**

✅ **100% Feature Completion**
- Every requirement implemented
- No placeholders or stubs
- All workflows end-to-end

✅ **Zero Console Errors**
- No errors in browser console
- No errors in server console
- Clean build output

✅ **Full Role Enforcement**
- Backend validates all actions
- Frontend matches backend
- No permission bypasses

✅ **Complete Persistence**
- All state survives refresh
- Database stores all data
- No data loss on reload

✅ **Production Quality**
- Error handling everywhere
- User-friendly messages
- Professional UI/UX
- Fast and responsive

---

**Testing Date:** _______________  
**Tester Name:** _______________  
**Result:** ⬜ PASS | ⬜ FAIL  
**Notes:** _____________________

---

**Status:** Ready for comprehensive testing  
**Last Updated:** December 16, 2025
