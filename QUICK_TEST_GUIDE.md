# Quick Testing Checklist

## 🚀 Start the Application

### Terminal 1 - Start Backend:
```bash
cd c:\collab\collab\server
node server.js
```
Expected output:
```
Server running on port 5000
Connected to MongoDB
```

### Terminal 2 - Start Frontend:
```bash
cd c:\collab\collab\client
npm run dev
```
Expected output:
```
Local: http://localhost:5173/
```

---

## ✅ Test Scenarios

### 1. Admin Collaboration (Board ID Input)

**Steps:**
1. Create two ADMIN accounts (or use existing)
2. Login as Admin 1 → Create a board → Copy the Board ID from URL
3. Logout → Login as Admin 2
4. Click "Collaborate" button on Dashboard
5. **Paste the Board ID** (not select from dropdown)
6. Add optional message → Submit
7. Logout → Login as Admin 1
8. Go to Messages → See collaboration request
9. Click "Accept" button
10. Check Dashboard → Admin 2's board should appear

**Expected Results:**
✅ Board ID input field (not dropdown)  
✅ Message appears in Admin 1's inbox  
✅ Accept button works  
✅ Admin 2 added as "member" role  
✅ Board appears in Admin 2's dashboard  
✅ Email logged in server console  

---

### 2. Message Actions - All Types

**Test Invitation (Admin → User):**
1. Login as ADMIN
2. Open any board → Participants Panel
3. Tab "Send Invite" → Enter USER email
4. Submit
5. Logout → Login as USER
6. Go to Messages → See invitation
7. **Check for Accept/Reject buttons**
8. Click Accept
9. Check Dashboard → Board should appear

**Expected Results:**
✅ Accept/Reject buttons visible  
✅ Buttons are functional  
✅ On accept: Board added to user  
✅ Email notification logged  
✅ Message marked as read  

**Test Join Request (User → Admin):**
1. Login as USER
2. Dashboard → "Join Board"
3. Enter board ID → Submit
4. Logout → Login as ADMIN (board owner)
5. Go to Messages → See join request
6. **Check for Accept/Reject buttons**
7. Click Accept (or Reject with reason)
8. User receives notification

**Expected Results:**
✅ Accept/Reject buttons visible  
✅ Reject prompts for reason  
✅ On accept: User added to board  
✅ On reject: Reason included in notification  

**Test Collaboration Request (Admin → Admin):**
1. Admin A sends collaboration request (via Board ID)
2. Admin B receives message
3. **Check for Accept/Reject buttons**
4. Test both actions

**Expected Results:**
✅ Accept/Reject buttons visible  
✅ Both actions work correctly  
✅ Real-time updates  

---

### 3. Participant Panel - Full Admin Controls

**Test Tab 1 - View Participants:**
1. Login as board owner (ADMIN)
2. Open board → Click Participants icon
3. Should see all participants with:
   - Name, email, role badges
   - Join date
   - Remove button (except for owner)
4. Click Remove on a non-owner participant
5. **Enter removal reason in prompt**
6. Confirm removal

**Expected Results:**
✅ All participant details visible  
✅ Remove button only for non-owners  
✅ Reason prompt appears  
✅ Participant removed immediately  
✅ Real-time update (no refresh)  

**Test Tab 2 - Send Invitation:**
1. Enter existing USER email → Submit
   ✅ Should succeed
2. Enter ADMIN email → Submit
   ❌ Error: "This email belongs to an admin. Use collaboration instead."
3. Enter non-existent email → Submit
   ❌ Error: "Email ID not available"
4. Send to same user twice
   ❌ Error: "An invitation has already been sent to this user"
5. Invite someone already on board
   ❌ Error: "User is already a member of this board"

**Expected Results:**
✅ All validation messages work  
✅ Only USERs can be invited  
✅ Duplicate prevention works  

**Test Tab 3 - Join Requests:**
1. Have a USER send join request
2. Should appear in this tab
3. Click Accept or Reject
4. Count badge updates
5. List refreshes

**Expected Results:**
✅ Pending requests visible  
✅ Badge shows count  
✅ Accept/Reject work  
✅ Real-time updates  

**Test USER View (Read-Only):**
1. Login as USER who is board member
2. Open board → Participants Panel
3. Should only see participants list
4. **Tabs should be hidden**
5. No admin controls visible

**Expected Results:**
✅ Only participants list visible  
✅ No tabs for invite/requests  
✅ No remove buttons  
✅ Read-only view  

---

### 4. Real-Time Updates (Multi-Tab Test)

**Setup:**
1. Open browser tab 1 → Login as ADMIN
2. Open browser tab 2 → Login as USER
3. Keep Participant Panel open in tab 1

**Test:**
1. In tab 2 (USER), accept an invitation
2. **Watch tab 1 (ADMIN) without refreshing**
3. Participant should appear immediately

**Test 2:**
1. In tab 1 (ADMIN), remove a participant
2. **Watch removed user's browser**
3. Should receive notification immediately

**Expected Results:**
✅ Participant panel updates in real-time  
✅ Dashboard board list updates  
✅ Message count updates  
✅ No manual refresh needed  

---

### 5. Console Error Check

**During all tests, monitor browser console:**

**Should NOT see:**
❌ 401 Unauthorized errors  
❌ 404 Not Found errors  
❌ 500 Server errors  
❌ Undefined function errors  
❌ React key warnings  

**Should see (normal):**
✅ Socket connected messages  
✅ Successful API responses  
✅ "Participant added" logs  
✅ "Message received" logs  

---

### 6. Email Notifications (Server Console)

**During tests, check server terminal for:**

```
📧 Email Notification:
To: user@example.com
Subject: You've been invited to join "My Board"
Body: ...
```

**Expected for each action:**
✅ Invitation sent → Email logged  
✅ Join request sent → Email logged  
✅ Request accepted → Email logged  
✅ Request rejected → Email logged  
✅ User removed → Email logged  
✅ Collaboration request → Email logged  

---

## 🔍 Verification Checklist

After all tests:

- [ ] Zero console errors
- [ ] All buttons functional
- [ ] All validations working
- [ ] Real-time updates working
- [ ] Email notifications logged
- [ ] Participant panel updates
- [ ] Dashboard updates
- [ ] Message counts update
- [ ] Role enforcement works
- [ ] No silent failures

---

## 🐛 Common Issues & Solutions

### Issue: "Socket not connecting"
**Solution:** Check server is running on port 5000

### Issue: "Messages not appearing"
**Solution:** Check MongoDB connection, verify user logged in

### Issue: "Participant panel not updating"
**Solution:** Check socket listeners, verify board ID in events

### Issue: "Accept button does nothing"
**Solution:** Check browser console for errors, verify API routes

### Issue: "Email not logged"
**Solution:** Check server console, verify emailService.js

---

## 📊 Performance Check

**Expected Response Times:**
- Board load: < 1 second
- Message load: < 500ms
- Accept/Reject: < 1 second
- Real-time update: Immediate (< 100ms)

**Expected Build Time:**
```bash
npm run build
# Should complete in 4-6 seconds
```

---

## ✅ Success Criteria

All tests pass with:
- ✅ Zero errors
- ✅ All features working
- ✅ Real-time updates functioning
- ✅ Proper role enforcement
- ✅ Clear user feedback
- ✅ Email notifications sent
- ✅ State persists after refresh

---

_Ready for production deployment once email service is integrated._
