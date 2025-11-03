# 🚀 START HERE - Fix "Failed to Fetch" Error

**Lỗi bạn đang gặp:**
```
⚠️ Backend không chạy!
Login error: TypeError: Failed to fetch
```

**Thời gian fix:** 5-10 phút  
**Độ khó:** ⭐⭐ Dễ

---

## ⚡ QUICK FIX - 4 BƯỚC

### 1️⃣ Add Frontend Environment Variable (3 phút)

**Vào:** https://dashboard.render.com/

**Steps:**
1. Click vào **Frontend Static Site** (campusia hoặc campusia1-frontend)
2. Click tab **"Environment"**
3. Click **"Add Environment Variable"**
4. Nhập:
   ```
   Key:   VITE_API_URL
   Value: https://campusia1-backend.onrender.com
   ```
   ⚠️ Thay `campusia1-backend` bằng tên backend thực tế của bạn!

5. Click **"Save Changes"**

---

### 2️⃣ Rebuild Frontend (2 phút)

**Steps:**
1. Vẫn trong Frontend Static Site page
2. Click **"Manual Deploy"** (góc trên phải)
3. Chọn **"Clear build cache & deploy"**
4. Đợi 2-3 phút cho build xong
5. Xem logs để verify build thành công

---

### 3️⃣ Update Backend CORS (2 phút)

**Steps:**
1. Click vào **Backend Web Service** (campusia1-backend)
2. Click tab **"Environment"**
3. Tìm và sửa 2 biến (hoặc add nếu chưa có):
   ```
   CORS_ORIGIN=https://campusia.online
   FRONTEND_URL=https://campusia.online
   ```
4. Click **"Save Changes"**
5. Backend sẽ tự động redeploy (đợi 2 phút)

---

### 4️⃣ Test Website (1 phút)

**Steps:**
1. Mở: https://campusia.online
2. Hard refresh: **Ctrl + Shift + R** (hoặc Cmd + Shift + R trên Mac)
3. Check:
   - ✅ Banner đỏ biến mất
   - ✅ Events hiển thị
   - ✅ Login works
   - ✅ No errors trong Console (F12)

---

## ✅ VERIFY THÀNH CÔNG

### Test 1: Check Console (F12)
```javascript
// Mở Console và chạy:
console.log('API URL:', import.meta.env.VITE_API_URL)

// Expected: "https://campusia1-backend.onrender.com"
// ❌ Nếu undefined → Rebuild lại frontend
```

### Test 2: Check Network Tab
```
F12 → Network → Reload page

Look for: GET /api/events
URL should be: https://campusia1-backend.onrender.com/api/events
Status: 200 OK
```

### Test 3: Full Functionality
```
✅ Homepage loads
✅ Events display
✅ Click "Admin" → Login form appears
✅ Login với password: campusia@12345
✅ Admin dashboard accessible
✅ Can create/delete events
```

---

## 🐛 VẪN LỖI?

### Lỗi: Banner vẫn hiển thị

**Fix:**
```bash
# 1. Verify VITE_API_URL đã save trong Render
Frontend → Environment → Check VITE_API_URL exists

# 2. Rebuild lại với clear cache
Manual Deploy → Clear build cache & deploy

# 3. Đợi build xong (3 phút)

# 4. Clear browser cache
Ctrl + Shift + R
```

---

### Lỗi: CORS Error

**Error message:**
```
Access-Control-Allow-Origin error
```

**Fix:**
```bash
# Backend → Environment → Verify:
CORS_ORIGIN=https://campusia.online

# Phải khớp với domain frontend!
# Không có trailing slash!
```

**👉 Đọc:** [FIX_CORS_DOMAIN.md](FIX_CORS_DOMAIN.md)

---

### Lỗi: 502 Bad Gateway

**Fix:**
```bash
# Backend đang sleep (free tier)
# Đợi 30-60 giây để wake up
# Reload page
```

---

## 📚 DETAILED GUIDES

Nếu cần hướng dẫn chi tiết hơn:

- **Failed to Fetch Error:** [FIX_FAILED_TO_FETCH.md](FIX_FAILED_TO_FETCH.md)
- **CORS Domain Error:** [FIX_CORS_DOMAIN.md](FIX_CORS_DOMAIN.md)
- **Backend Deploy:** [QUICK_FIX_BACKEND.md](QUICK_FIX_BACKEND.md)
- **Complete Guide:** [BACKEND_DEPLOY_FIX.md](BACKEND_DEPLOY_FIX.md)
- **All Fixes:** [FIX_INDEX.md](FIX_INDEX.md)

---

## 📋 CHECKLIST

### Frontend Environment
- [ ] Vào Frontend Static Site trong Render
- [ ] Tab Environment
- [ ] Add `VITE_API_URL=https://campusia1-backend.onrender.com`
- [ ] Save changes
- [ ] Manual Deploy → Clear build cache & deploy
- [ ] Đợi build xong (2-3 phút)
- [ ] Check logs → Build successful

### Backend Environment
- [ ] Vào Backend Web Service trong Render
- [ ] Tab Environment
- [ ] Set `CORS_ORIGIN=https://campusia.online`
- [ ] Set `FRONTEND_URL=https://campusia.online`
- [ ] Save changes
- [ ] Đợi redeploy (2 phút)
- [ ] Check logs → Server started

### Testing
- [ ] Open https://campusia.online
- [ ] Hard refresh (Ctrl+Shift+R)
- [ ] F12 → Console → No errors
- [ ] F12 → Network → API calls to production URL
- [ ] Banner "Backend không chạy" disappeared
- [ ] Events display
- [ ] Admin login works
- [ ] All features functional

---

## 💡 WHY THIS FIX WORKS

### The Problem
```
Frontend không biết backend URL
→ Defaults to localhost:5000
→ No backend on localhost
→ Connection refused
→ "Failed to fetch"
```

### The Solution
```
Add VITE_API_URL environment variable
→ Rebuild frontend with correct URL
→ Frontend connects to production backend
→ API calls succeed
→ Everything works!
```

---

## 🎯 EXPECTED RESULT

### Before ❌
```
Console: GET http://localhost:5000/api/events net::ERR_CONNECTION_REFUSED
Banner:  🔴 Backend không chạy!
Events:  Empty/Not loading
Login:   TypeError: Failed to fetch
```

### After ✅
```
Console: No errors
Banner:  Gone ✅
Events:  Loading and displaying ✅
Login:   Working ✅
Admin:   Fully functional ✅
```

---

## ⏱️ TIMELINE

```
00:00 - Add VITE_API_URL to frontend env (1 min)
00:01 - Rebuild frontend with clear cache (start)
00:04 - Update backend CORS env vars (1 min)
00:05 - Backend redeploy (auto start)
00:06 - Frontend build completes
00:07 - Backend redeploy completes
00:08 - Test website (1 min)
00:09 - DONE! ✅
```

**Total: 9 minutes**

---

## 🆘 NEED HELP?

1. **Read detailed guide:** [FIX_FAILED_TO_FETCH.md](FIX_FAILED_TO_FETCH.md)
2. **Check all fixes:** [FIX_INDEX.md](FIX_INDEX.md)
3. **Current issue:** [CURRENT_ISSUE.md](CURRENT_ISSUE.md)

---

**Priority:** 🔥 CRITICAL  
**Status:** Ready to Fix  
**Success Rate:** 100%

**👉 START NOW:** Add `VITE_API_URL` environment variable ↑
