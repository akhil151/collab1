# Quick Test Guide - Production Fixes

## Test Flow

### 1. Start Application
```bash
# Terminal 1 - Server
cd collab/server
npm start

# Terminal 2 - Client
cd collab/client
npm run dev
```

### 2. Test Socket Connection
- **Start client BEFORE server is fully running**
- Expected: No "socket not connected" warnings
- Events should queue and emit automatically when server starts

### 3. Test Message Actions (USER Role)

**Setup:**
1. Register as USER (user@test.com)
2. Have ADMIN invite you to a board
3. Go to Messages page

**Test Acceptance:**
1. Click "Accept" on invitation
2. ✅ Message disappears immediately
3. ✅ Alert shows "Invitation accepted"
4. ✅ No console errors
5. ✅ No API error messages
6. ✅ Board appears in dashboard

**Test Rejection:**
1. Get another invitation
2. Click "Reject"
3. ✅ Message disappears immediately
4. ✅ Alert shows "Invitation rejected"
5. ✅ No console errors

### 4. Test Message Actions (ADMIN Role)

**Setup:**
1. Register as ADMIN (admin@test.com)
2. Create a board
3. Have another USER request to join
4. Go to Messages page

**Test Accept Join Request:**
1. Click "Accept" on join request
2. ✅ Message disappears immediately
3. ✅ Alert shows "Join request accepted"
4. ✅ No console errors
5. ✅ User appears in Participants Panel

**Test Reject Join Request:**
1. Get another join request
2. Click "Reject"
3. ✅ Message disappears immediately
4. ✅ No console errors

### 5. Test Collaboration Requests (ADMIN to ADMIN)

**Setup:**
1. Two ADMIN accounts
2. ADMIN1 creates board
3. ADMIN2 sends collaboration request
4. ADMIN1 checks Messages

**Test Accept:**
1. Click "Accept" on collaboration request
2. ✅ Message disappears immediately
3. ✅ Alert shows "Collaboration request accepted"
4. ✅ ADMIN2 appears in participants
5. ✅ No console errors

**Test Reject:**
1. Get another collaboration request
2. Click "Reject"
3. ✅ Message disappears immediately
4. ✅ No console errors

### 6. Test Participant Removal

**Setup:**
1. ADMIN owner of board
2. Board has at least one member
3. Go to board → Participants Panel → View Participants tab

**Test Remove:**
1. Click trash icon next to participant
2. Confirm removal
3. ✅ Success alert appears
4. ✅ Participant disappears from list
5. ✅ No "Failed to remove" error
6. ✅ No console errors
7. ✅ Removed user receives notification

### 7. Test Real-time Synchronization

**Setup:**
1. Open app in 2 browser windows
2. Login as different users in each
3. Both on same board

**Test Participant Addition:**
1. Window 1: Accept invitation/join request
2. Window 2: Should see new participant appear immediately
3. ✅ No page refresh needed

**Test Participant Removal:**
1. Window 1: Remove a participant
2. Window 2: Should see participant disappear immediately
3. ✅ No page refresh needed

### 8. Verify Zero Console Errors

**Check console for:**
- ✅ No "socket not connected" warnings
- ✅ No "undefined" errors
- ✅ No 400/500 API errors on successful operations
- ✅ No "message is not defined" errors
- ✅ Clean console output

## Common Issues

### If socket warnings still appear:
- Clear browser cache
- Restart both server and client
- Check server console for connection logs

### If messages don't disappear after action:
- Check network tab for 200 response
- Check console for socket events
- Verify message has metadata fields

### If participant removal fails:
- Check if user is board owner
- Check server logs for errors
- Verify 200 status code returned

## Expected Console Output (Normal)

```
Socket connected successfully
New message received: {...}
Message updated: {...}
Participant added: {...}
```

## Success Criteria

✅ All operations return 200 status code
✅ No console errors or warnings
✅ UI updates immediately without refresh
✅ Messages disappear after accept/reject
✅ Participants update in real-time
✅ Socket events work correctly
✅ No race conditions or timing issues

## If All Tests Pass

The application is production-ready! All critical bugs have been fixed:
- Socket connection timing ✅
- Message action lifecycle ✅
- API response codes ✅
- Participant removal ✅
- Real-time synchronization ✅
- Zero console errors ✅
