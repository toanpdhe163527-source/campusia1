# 🔧 FIX: Failed to Fetch - Backend Connection Error

**Lỗi hiện tại:**
```
⚠️ Backend is not running. Please start it with: cd backend && npm run dev
Login error: TypeError: Failed to fetch
```

**Nguyên nhân:** Frontend chưa có environment variable `VITE_API_URL`, nên đang cố kết nối đến `http://localhost:5000/api` thay vì backend thực tế trên Render.

**Thời gian fix:** 5 phút

---

## ✅ GIẢI PHÁP (3 BƯỚC)

### Bước 1: Thêm Environment Variable cho Frontend

1. **Vào Render Dashboard:** https://dashboard.render.com/

2. **Click vào Frontend Static Site** (campusia hoặc campusia1-frontend)

3. **Click tab "Environment"**

4. **Click "Add Environment Variable"**

5. **Thêm biến mới:**
   ```
   Key:   VITE_API_URL
   Value: https://campusia1-backend.onrender.com
   ```
   
   ⚠️ **LÀM CHÍNH XÁC:**
   - Tên backend của bạn có thể khác `campusia1-backend`
   - Kiểm tra tên chính xác trong Render Dashboard → Services
   - Không thêm `/api` ở cuối (code sẽ tự thêm)
   - Phải là `https://` không phải `http://`

6. **Click "Save Changes"**

---

### Bước 2: Rebuild Frontend

1. **Vẫn trong Static Site page**

2. **Click "Manual Deploy"** (góc trên bên phải)

3. **Chọn "Clear build cache & deploy"**

4. **Đợi 2-3 phút** để Render rebuild frontend với env var mới

5. **Check logs** để verify build thành công

---

### Bước 3: Verify Backend CORS

1. **Click vào Backend Service** (campusia1-backend)

2. **Click tab "Environment"**

3. **Verify 2 biến sau:**
   ```
   CORS_ORIGIN=https://campusia.online
   FRONTEND_URL=https://campusia.online
   ```

4. **Nếu sai hoặc thiếu:**
   - Update/Add `CORS_ORIGIN=https://campusia.online`
   - Update/Add `FRONTEND_URL=https://campusia.online`
   - Save → Đợi backend redeploy (2 phút)

---

## 🔍 VERIFY FIX THÀNH CÔNG

### Test 1: Check Environment Variable

1. Sau khi frontend rebuild xong
2. Mở https://campusia.online
3. F12 → Console tab
4. Gõ lệnh:
   ```javascript
   // Check if VITE_API_URL was loaded
   console.log('API URL:', import.meta.env.VITE_API_URL)
   ```
5. ✅ Expected: `https://campusia1-backend.onrender.com`
6. ❌ If `undefined` → Rebuild lại frontend

---

### Test 2: Check API Calls

1. F12 → Network tab
2. Reload page (Ctrl+R)
3. Tìm request: `GET /api/events`
4. Check Request URL:
   - ✅ Should be: `https://campusia1-backend.onrender.com/api/events`
   - ❌ Should NOT be: `http://localhost:5000/api/events`

---

### Test 3: Check Backend Response

1. Trong Network tab, click vào request `/api/events`
2. Check Response:
   - ✅ Status: 200 OK
   - ✅ Response body có JSON với events array
   - ❌ If 500/502 → Backend issue
   - ❌ If CORS error → Check bước 3

---

### Test 4: Full Functionality

1. ✅ Banner "Backend không chạy" biến mất
2. ✅ Events hiển thị trên homepage
3. ✅ Click "Admin" → Login form hiển thị
4. ✅ Login với password `campusia@12345` → Thành công
5. ✅ Admin dashboard loads
6. ✅ Có thể tạo/xóa events

---

## 🐛 TROUBLESHOOTING

### Lỗi 1: Vẫn báo "Backend không chạy" sau rebuild

**Nguyên nhân:** Browser cache hoặc build cache

**Fix:**
```bash
# 1. Hard refresh browser
Ctrl + Shift + R (Windows/Linux)
Cmd + Shift + R (Mac)

# 2. Clear browser cache
F12 → Application → Clear storage → Clear site data

# 3. Rebuild lại với clear cache
Render → Static Site → Manual Deploy → Clear build cache & deploy
```

---

### Lỗi 2: "Failed to fetch" vẫn xuất hiện

**Nguyên nhân:** Environment variable chưa được load trong build

**Fix:**
```bash
# 1. Verify environment variable trong Render
VITE_API_URL=https://campusia1-backend.onrender.com

# 2. Check tên variable chính xác (case-sensitive)
# Phải là: VITE_API_URL
# KHÔNG phải: Vite_Api_Url hoặc vite_api_url

# 3. Rebuild với clear cache
Manual Deploy → Clear build cache & deploy

# 4. Đợi 3-5 phút cho build xong

# 5. Hard refresh browser
```

---

### Lỗi 3: CORS error sau khi fix

**Error message:**
```
Access to fetch at 'https://campusia1-backend.onrender.com/api/events' 
from origin 'https://campusia.online' has been blocked by CORS policy
```

**Fix:** Xem [FIX_CORS_DOMAIN.md](FIX_CORS_DOMAIN.md)

```bash
# Quick fix:
# Backend → Environment → Update:
CORS_ORIGIN=https://campusia.online
FRONTEND_URL=https://campusia.online
```

---

### Lỗi 4: Backend 502 Bad Gateway

**Nguyên nhân:** Backend sleeping (free tier)

**Fix:**
```bash
# 1. Đợi 30-60 giây
# Backend sẽ tự động wake up

# 2. Reload page

# 3. API calls sẽ work

# Long-term: Upgrade to Starter plan ($7/month) để tránh sleep
```

---

### Lỗi 5: Environment variable không hiển thị

**Nguyên nhân:** Build process không pick up env vars

**Fix:**
```bash
# 1. Check Render build logs
# Tìm dòng: "VITE_API_URL=..."

# 2. Nếu không thấy → Env var chưa được set
# Quay lại Bước 1 và add lại

# 3. Nếu thấy nhưng vẫn lỗi → Clear cache và rebuild

# 4. Verify trong source code
# Static Site → Settings → Environment
# Phải thấy: VITE_API_URL listed
```

---

## 📋 COMPLETE ENVIRONMENT VARIABLES

### Frontend Static Site

```bash
# Required
VITE_API_URL=https://campusia1-backend.onrender.com

# Optional (nếu cần)
NODE_VERSION=18.20.0
```

⚠️ **QUAN TRỌNG:**
- Tên biến phải là `VITE_API_URL` (chữ hoa)
- Value phải là backend URL đầy đủ
- KHÔNG thêm `/api` ở cuối
- KHÔNG có trailing slash

---

### Backend Web Service

```bash
# CORS Configuration
CORS_ORIGIN=https://campusia.online
FRONTEND_URL=https://campusia.online

# Server Configuration
PORT=10000
NODE_ENV=production

# Authentication
JWT_SECRET=campusia-super-secret-jwt-key-2025-production
ADMIN_PASSWORD=campusia@12345
```

---

## 🎯 EXPECTED RESULT

### Before Fix ❌

**Console errors:**
```
❌ GET http://localhost:5000/api/events net::ERR_CONNECTION_REFUSED
❌ Login error: TypeError: Failed to fetch
```

**Website:**
```
🔴 Banner: "Backend không chạy!"
❌ Events: Empty/Not loading
❌ Admin: Login fails immediately
```

**Network tab:**
```
❌ Requests going to: http://localhost:5000/api/...
```

---

### After Fix ✅

**Console:**
```
✅ No fetch errors
✅ No connection refused errors
✅ API calls successful
```

**Website:**
```
✅ No warning banner
✅ Events load and display
✅ Admin login works
✅ All features functional
```

**Network tab:**
```
✅ Requests going to: https://campusia1-backend.onrender.com/api/...
✅ Status: 200 OK
✅ Response: Valid JSON data
```

---

## 📊 STEP-BY-STEP CHECKLIST

### Preparation
- [ ] Have Render Dashboard open
- [ ] Know backend service name (e.g., `campusia1-backend`)
- [ ] Know frontend site name (e.g., `campusia` or `campusia1-frontend`)

### Frontend Configuration
- [ ] Go to Frontend Static Site
- [ ] Click Environment tab
- [ ] Add `VITE_API_URL=https://campusia1-backend.onrender.com`
- [ ] Verify tên backend chính xác
- [ ] Save changes
- [ ] Click "Manual Deploy"
- [ ] Select "Clear build cache & deploy"
- [ ] Wait for build to complete (2-3 min)

### Backend Configuration
- [ ] Go to Backend Web Service
- [ ] Click Environment tab
- [ ] Verify `CORS_ORIGIN=https://campusia.online`
- [ ] Verify `FRONTEND_URL=https://campusia.online`
- [ ] If missing/wrong → Update
- [ ] Save changes (backend will redeploy)
- [ ] Wait for deployment (2 min)

### Testing
- [ ] Open https://campusia.online
- [ ] Hard refresh (Ctrl+Shift+R)
- [ ] F12 → Console → No errors
- [ ] Banner "Backend không chạy" disappeared
- [ ] Events display on homepage
- [ ] Click Admin → Login form works
- [ ] Login với `campusia@12345` → Success
- [ ] Admin dashboard accessible
- [ ] Can create/delete events

---

## 💡 WHY THIS HAPPENS

### The Problem

```
Frontend build process:
1. Reads environment variables
2. Bundles them into JavaScript
3. At runtime, tries to connect to API

If VITE_API_URL is NOT set:
→ Defaults to http://localhost:5000/api
→ Browser tries to connect to localhost
→ No backend on localhost
→ Connection refused
→ "Failed to fetch" error
```

### The Solution

```
Set VITE_API_URL:
1. Render reads env var during build
2. Vite bundles correct backend URL
3. Frontend connects to real backend
4. API calls succeed
5. Everything works!
```

---

## 🚀 DEPLOYMENT BEST PRACTICES

### 1. Always Set API URL for Production

```bash
# Development (.env.local)
VITE_API_URL=http://localhost:5000

# Production (Render env vars)
VITE_API_URL=https://your-backend.onrender.com
```

### 2. Verify Environment Variables After Each Deployment

```bash
# Check in browser console:
console.log(import.meta.env.VITE_API_URL)

# Should output production URL, not localhost
```

### 3. Use Clear Cache When Changing Env Vars

```bash
# Always clear cache when updating environment variables
# Otherwise old build might still use old values
```

### 4. Document All Required Env Vars

```bash
# Keep a list of required environment variables
# Frontend: VITE_API_URL
# Backend: CORS_ORIGIN, FRONTEND_URL, JWT_SECRET, etc.
```

---

## 📱 QUICK COMMANDS

### Check API URL in Browser Console
```javascript
console.log('API URL:', import.meta.env.VITE_API_URL)
```

### Test Backend Health
```bash
curl https://campusia1-backend.onrender.com/health
```

### Test API Endpoint
```bash
curl https://campusia1-backend.onrender.com/api/events
```

### Hard Refresh Browser
```
Windows/Linux: Ctrl + Shift + R
Mac: Cmd + Shift + R
```

---

## ✅ SUCCESS CRITERIA

Fix thành công khi:

1. ✅ Mở https://campusia.online
2. ✅ KHÔNG thấy banner đỏ "Backend không chạy"
3. ✅ KHÔNG có lỗi "Failed to fetch" trong console
4. ✅ Events hiển thị trên homepage
5. ✅ Network tab shows requests to production backend URL
6. ✅ Admin login works với password `campusia@12345`
7. ✅ Có thể tạo/xóa/edit events
8. ✅ Tất cả features hoạt động bình thường

---

## 📚 RELATED DOCS

- [FIX_CORS_DOMAIN.md](FIX_CORS_DOMAIN.md) - Fix CORS domain mismatch
- [CURRENT_ISSUE.md](CURRENT_ISSUE.md) - Current issue overview
- [BACKEND_DEPLOY_FIX.md](BACKEND_DEPLOY_FIX.md) - Complete backend deployment guide
- [QUICK_FIX_BACKEND.md](QUICK_FIX_BACKEND.md) - Quick backend deploy guide

---

## 🆘 STILL NOT WORKING?

### Debug Steps

1. **Check Render Build Logs**
   ```
   Static Site → Logs tab
   Search for: "VITE_API_URL"
   Should see: Environment variable being used
   ```

2. **Check Backend Logs**
   ```
   Backend Service → Logs tab
   Look for: Server started message
   Check: CORS Origin configuration
   ```

3. **Check Browser Network Tab**
   ```
   F12 → Network
   Look at: Request URLs
   Verify: Going to production backend, not localhost
   ```

4. **Test Backend Directly**
   ```bash
   # In browser, visit:
   https://campusia1-backend.onrender.com/health
   
   # Should see JSON response
   ```

5. **Clear Everything and Start Fresh**
   ```bash
   # 1. Clear browser cache completely
   # 2. Clear Render build cache
   # 3. Rebuild frontend
   # 4. Wait 5 minutes
   # 5. Hard refresh browser
   ```

---

**Priority:** 🔥 CRITICAL  
**Impact:** Website completely non-functional  
**Effort:** 5 minutes  
**Success Rate:** 100% (if done correctly)

**👉 START NOW:** Add `VITE_API_URL` to Render Frontend Environment Variables ↑
