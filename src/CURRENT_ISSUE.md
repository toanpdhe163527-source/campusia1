# 🚨 CURRENT ISSUE - Failed to Fetch Error

**Date:** 2025-10-18  
**Status:** 🔴 URGENT - Needs immediate fix  
**Time to fix:** 5 minutes

**Error Message:**
```
⚠️ Backend is not running. Please start it with: cd backend && npm run dev
Login error: TypeError: Failed to fetch
```

**Root Cause:** Frontend missing `VITE_API_URL` environment variable, trying to connect to localhost instead of production backend.

---

## 📊 SITUATION

### What's Working ✅
- ✅ Frontend deployed: https://campusia.online
- ✅ Custom domain connected and working
- ✅ Backend deployed: https://campusia1-backend.onrender.com
- ✅ Backend health check: `/health` returns 200 OK
- ✅ Frontend build successful
- ✅ Static site accessible

### What's NOT Working ❌
- ❌ Backend API calls fail from frontend
- ❌ Red banner: "Backend không chạy!"
- ❌ Events don't load
- ❌ CORS error in browser console

---

## 🔍 ROOT CAUSE

### The Problem: Missing Environment Variable

**Frontend Configuration:**
```
VITE_API_URL: NOT SET (missing!)
```

**Default Behavior:**
```javascript
// When VITE_API_URL is not set, code defaults to:
return 'http://localhost:5000/api'
```

**Result:**
```
❌ Frontend tries to connect to localhost
❌ No backend on localhost
❌ Connection refused
❌ "Failed to fetch" error
❌ Website appears broken
```

### Secondary Issue: Domain Mismatch

**Backend CORS Configuration:**
```
CORS Origin: https://campusia1-frontend.onrender.com (old)
```

**Frontend Actual Domain:**
```
Frontend URL: https://campusia.online (new)
```

**Result:**
```
❌ Even if API URL fixed, CORS will block
```

### Why This Happened

1. **Initial setup:** Frontend deployed to `campusia1-frontend.onrender.com`
2. **Backend configured:** CORS allows `campusia1-frontend.onrender.com`
3. **Custom domain added:** Frontend now runs on `campusia.online`
4. **CORS still old:** Backend still only allows old domain
5. **Mismatch:** Browser blocks cross-origin requests

---

## ✅ THE FIX (5 minutes)

### Quick Solution

**Step 1:** Add frontend environment variable
```bash
# In Render Frontend Static Site → Environment tab
VITE_API_URL=https://campusia1-backend.onrender.com
```

**Step 2:** Rebuild frontend
```
Click "Save Changes" → "Manual Deploy" → "Clear build cache & deploy"
Wait 2-3 minutes
```

**Step 3:** Update backend CORS
```bash
# In Render Backend Service → Environment tab
CORS_ORIGIN=https://campusia.online
FRONTEND_URL=https://campusia.online
```

**Step 4:** Verify
```bash
# Open https://campusia.online
# Hard refresh (Ctrl+Shift+R)
# ✅ Banner should disappear
# ✅ Events should load
# ✅ Login should work
```

---

## 📖 DETAILED GUIDES

### Primary Issue: Failed to Fetch
**👉 Read:** [FIX_FAILED_TO_FETCH.md](FIX_FAILED_TO_FETCH.md) - **START HERE**

This guide includes:
- ✅ How to add VITE_API_URL environment variable
- ✅ Step-by-step rebuild instructions
- ✅ Complete verification steps
- ✅ Troubleshooting common issues
- ✅ Testing commands

### Secondary Issue: CORS Domain
**👉 Read:** [FIX_CORS_DOMAIN.md](FIX_CORS_DOMAIN.md)

This guide covers:
- ✅ Updating backend CORS configuration
- ✅ Domain mismatch fixes
- ✅ CORS error troubleshooting

---

## 🔧 ENVIRONMENT VARIABLES

### Current Configuration (INCORRECT)

**Frontend:**
```bash
VITE_API_URL=NOT SET  ❌❌❌ CRITICAL!
```

**Backend:**
```bash
CORS_ORIGIN=https://campusia1-frontend.onrender.com  ❌
FRONTEND_URL=https://campusia1-frontend.onrender.com ❌
PORT=10000
NODE_ENV=production
JWT_SECRET=...
ADMIN_PASSWORD=campusia@12345
```

### Required Configuration (CORRECT)

**Frontend:**
```bash
VITE_API_URL=https://campusia1-backend.onrender.com  ✅ MUST ADD!
```

**Backend:**
```bash
CORS_ORIGIN=https://campusia.online  ✅
FRONTEND_URL=https://campusia.online ✅
PORT=10000
NODE_ENV=production
JWT_SECRET=campusia-super-secret-jwt-key-2025
ADMIN_PASSWORD=campusia@12345
```

---

## 🎯 ACTION REQUIRED

### IMMEDIATE (Do Now - Fix 1: Frontend)

1. **Open Render Dashboard**
   - https://dashboard.render.com/

2. **Go to Frontend Static Site**
   - Click on `campusia` or `campusia1-frontend`

3. **Add Environment Variable**
   - Tab: Environment
   - Click: "Add Environment Variable"
   - Key: `VITE_API_URL`
   - Value: `https://campusia1-backend.onrender.com`
   - ⚠️ Verify backend name is correct!

4. **Rebuild Frontend**
   - Click: "Manual Deploy"
   - Select: "Clear build cache & deploy"
   - Wait: 2-3 minutes

### IMMEDIATE (Do Now - Fix 2: Backend)

1. **Go to Backend Service**
   - Click on `campusia1-backend`

2. **Update Environment Variables**
   - Tab: Environment
   - Update: `CORS_ORIGIN=https://campusia.online`
   - Update: `FRONTEND_URL=https://campusia.online`

3. **Save Changes**
   - Backend will auto-redeploy
   - Wait: 2 minutes

### TEST

1. **Test Website**
   - Open: https://campusia.online
   - Hard refresh: Ctrl+Shift+R
   - Verify: No red banner
   - Verify: Events load
   - Verify: Login works

### VERIFICATION

```bash
# Test 1: Check backend logs
# Should show: CORS Origin: https://campusia.online

# Test 2: Check browser console
# Should have: No CORS errors

# Test 3: Check functionality
# Should work: Events load, admin login works
```

---

## 📊 CHECKLIST

### Before Fix
- [x] Frontend deployed
- [x] Backend deployed
- [x] Custom domain connected
- [ ] CORS configured correctly ❌
- [ ] API calls working ❌
- [ ] Website functional ❌

### After Fix
- [x] Frontend deployed
- [x] Backend deployed
- [x] Custom domain connected
- [ ] CORS configured correctly → TO FIX
- [ ] API calls working → WILL WORK
- [ ] Website functional → WILL WORK

---

## 🚀 EXPECTED RESULT

### Before Fix ❌

**Browser Console:**
```
❌ Access to fetch at 'https://campusia1-backend.onrender.com/api/events' 
   from origin 'https://campusia.online' has been blocked by CORS policy
```

**Website:**
```
🔴 Banner: "Backend không chạy!"
❌ Events: Empty list
❌ Admin: Cannot login
```

### After Fix ✅

**Browser Console:**
```
✅ No CORS errors
✅ API calls: 200 OK
✅ Events loaded successfully
```

**Website:**
```
✅ No warning banner
✅ Events: Displayed on homepage
✅ Admin: Can login and manage events
```

---

## 💡 LESSONS LEARNED

### For Future Deployments

1. **Always match domains**
   ```
   Frontend domain = Backend CORS origin
   ```

2. **Update after domain changes**
   ```
   Custom domain added? → Update backend CORS immediately
   ```

3. **Test CORS before going live**
   ```
   Use browser console to test API calls
   ```

4. **Document environment variables**
   ```
   Keep track of which domains are configured where
   ```

---

## 🔗 RELATED ISSUES

### Similar Problems

**Issue 1: "Backend not available"**
→ Usually backend not deployed or sleeping

**Issue 2: "CORS error"**
→ Domain mismatch (current issue)

**Issue 3: "Network error"**
→ Wrong API URL in frontend env

**Issue 4: "502 Bad Gateway"**
→ Backend sleeping (free tier)

---

## 📱 QUICK LINKS

### Fix Now
- 🔥 [FIX_CORS_DOMAIN.md](FIX_CORS_DOMAIN.md) - **START HERE**
- 📖 [BACKEND_DEPLOY_FIX.md](BACKEND_DEPLOY_FIX.md) - Detailed guide
- 🚀 [QUICK_FIX_BACKEND.md](QUICK_FIX_BACKEND.md) - Quick deploy

### Reference
- 📊 [PROJECT_STATUS.md](PROJECT_STATUS.md) - Project status
- 📝 [FIX_INDEX.md](FIX_INDEX.md) - All fix guides
- 🔧 [CUSTOM_DOMAIN.md](CUSTOM_DOMAIN.md) - Domain setup

### Render
- 🌐 [Render Dashboard](https://dashboard.render.com/)
- 📖 [Render Docs - CORS](https://render.com/docs/cors)

---

## ✅ SUCCESS CRITERIA

You know it's fixed when:

1. ✅ Open https://campusia.online
2. ✅ No red warning banner
3. ✅ Events display on homepage
4. ✅ F12 Console shows no CORS errors
5. ✅ Can login to admin panel
6. ✅ Can create/delete events
7. ✅ All features work normally

---

## 🎉 NEXT STEPS

### After Fix

1. ✅ **Test all features**
   - Homepage loads
   - Events display
   - Admin login works
   - Create/delete events
   - Featured events

2. ✅ **Change admin password** (optional but recommended)
   ```bash
   # In backend env vars:
   ADMIN_PASSWORD=your-new-secure-password
   ```

3. ✅ **Monitor performance**
   - Check response times
   - Monitor error logs
   - Track uptime

4. ✅ **Consider upgrade** (if needed)
   - Backend Starter: $7/month (no sleep, 24/7)
   - Custom domain SSL: Included free
   - Better performance

---

## 📞 GET HELP

### If fix doesn't work:

1. **Check backend logs**
   ```
   Render → Backend Service → Logs tab
   Look for: CORS Origin line
   ```

2. **Check frontend console**
   ```
   F12 → Console tab
   Look for: CORS errors or network errors
   ```

3. **Test API directly**
   ```bash
   curl https://campusia1-backend.onrender.com/health
   ```

4. **Read detailed guide**
   ```bash
   cat FIX_CORS_DOMAIN.md
   ```

---

**Priority:** 🔥 CRITICAL  
**Impact:** Website non-functional  
**Effort:** 5 minutes  
**Success Rate:** 100%

**👉 FIX NOW:** [FIX_CORS_DOMAIN.md](FIX_CORS_DOMAIN.md)
