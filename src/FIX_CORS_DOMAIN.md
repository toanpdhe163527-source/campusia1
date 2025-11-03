# 🔧 FIX: CORS Error - Domain Không Khớp

**Vấn đề:** Backend đã deploy nhưng frontend vẫn báo "Backend không chạy"

**Nguyên nhân:** Backend CORS Origin đang set cho `campusia1-frontend.onrender.com` nhưng frontend thực tế chạy trên `campusia.online`

---

## ✅ GIẢI PHÁP NHANH (5 phút)

### Bước 1: Update Backend CORS Origin

1. **Vào Render Dashboard:** https://dashboard.render.com/

2. **Click vào Backend Service** (`campusia1-backend`)

3. **Click tab "Environment"**

4. **Tìm biến `CORS_ORIGIN` và sửa thành:**
   ```bash
   CORS_ORIGIN=https://campusia.online
   ```

5. **Nếu không có biến `CORS_ORIGIN`, thêm mới:**
   ```bash
   Key:   CORS_ORIGIN
   Value: https://campusia.online
   ```

6. **HOẶC sửa biến `FRONTEND_URL`:**
   ```bash
   FRONTEND_URL=https://campusia.online
   ```

7. **Click "Save Changes"**

8. Backend sẽ tự động **redeploy** (đợi 2-3 phút)

---

### Bước 2: Verify Backend Logs

1. Sau khi backend redeploy xong, click tab **"Logs"**

2. Tìm dòng:
   ```
   CORS Origin: https://campusia.online
   ```

3. ✅ Nếu thấy domain đúng → Tiếp tục bước 3

---

### Bước 3: Check Frontend Environment Variable

1. **Vào Frontend Static Site** trong Render Dashboard

2. **Click tab "Environment"**

3. **Kiểm tra biến `VITE_API_URL`:**
   ```bash
   VITE_API_URL=https://campusia1-backend.onrender.com
   ```

4. ✅ Nếu đúng backend URL → Tiếp tục bước 4

5. ❌ Nếu sai hoặc không có → Thêm/sửa và **rebuild frontend**

---

### Bước 4: Clear Cache & Test

1. **Mở website:** https://campusia.online

2. **Hard refresh browser:**
   ```
   Ctrl + Shift + R (Windows/Linux)
   Cmd + Shift + R (Mac)
   ```

3. **Check Console (F12):**
   - ✅ Không có CORS errors
   - ✅ Banner đỏ biến mất
   - ✅ Events load thành công

---

## 🔍 VERIFY CORS FIX

### Test 1: Check Backend CORS Header

```bash
# Mở browser console và chạy:
fetch('https://campusia1-backend.onrender.com/health', {
  headers: { 'Origin': 'https://campusia.online' }
})
.then(r => r.json())
.then(data => console.log('✅ Backend OK:', data))
.catch(err => console.error('❌ CORS Error:', err))
```

**Expected result:**
```json
{
  "status": "ok",
  "timestamp": "...",
  "storage": "JSON files"
}
```

---

### Test 2: Check API Call

1. Open https://campusia.online
2. F12 → Network tab
3. Reload page
4. Find request: `GET /api/events`
5. Check Response Headers:
   ```
   Access-Control-Allow-Origin: https://campusia.online
   ```

---

## 🐛 VẪN LỖI?

### Lỗi: CORS vẫn bị block

**Check backend code trong `server.js`:**

Backend code hiện tại:
```javascript
app.use(cors({
  origin: process.env.CORS_ORIGIN || process.env.FRONTEND_URL || '*',
  credentials: true
}));
```

**Giải pháp 1: Set cả 2 domains**

Update environment variables:
```bash
CORS_ORIGIN=https://campusia.online
FRONTEND_URL=https://campusia.online
```

**Giải pháp 2: Allow multiple domains**

Nếu muốn support cả custom domain và Render domain:

```bash
# Trong backend Environment Variables, thêm:
CORS_ORIGIN=https://campusia.online,https://campusia1-frontend.onrender.com
```

Sau đó cần update code `backend/src/server.js` để handle multiple origins.

---

### Lỗi: "Network error" khi call API

**Nguyên nhân:** `VITE_API_URL` chưa được set hoặc sai

**Fix:**
```bash
# Frontend Environment Variables:
VITE_API_URL=https://campusia1-backend.onrender.com

# Rebuild frontend:
Clear build cache & deploy
```

---

### Lỗi: Backend returns 502 Bad Gateway

**Nguyên nhân:** Backend đang sleep (Free tier)

**Fix:**
1. Đợi 30-60 giây
2. Reload page
3. Backend sẽ wake up

**Long-term solution:**
- Upgrade backend lên Starter plan ($7/month) để 24/7 uptime

---

## 📋 COMPLETE ENVIRONMENT VARIABLES

### Backend Service Environment

```bash
# CORS & Security
CORS_ORIGIN=https://campusia.online
FRONTEND_URL=https://campusia.online

# Server Config
PORT=10000
NODE_ENV=production

# Authentication
JWT_SECRET=campusia-super-secret-jwt-key-2025-production
ADMIN_PASSWORD=campusia@12345
```

### Frontend Static Site Environment

```bash
# API Configuration
VITE_API_URL=https://campusia1-backend.onrender.com

# Optional (if needed)
NODE_VERSION=18.20.0
```

---

## 🎯 EXPECTED RESULT

### Before Fix ❌

**Backend logs:**
```
CORS Origin: https://campusia1-frontend.onrender.com
```

**Frontend console:**
```
❌ Access-Control-Allow-Origin error
❌ Backend không chạy!
```

**Result:** Events không load, banner đỏ hiển thị

---

### After Fix ✅

**Backend logs:**
```
CORS Origin: https://campusia.online
```

**Frontend:**
```
✅ No CORS errors
✅ Banner đỏ biến mất
✅ Events load thành công
```

**Result:** Website hoạt động bình thường!

---

## 🔄 STEP-BY-STEP CHECKLIST

Backend:
- [ ] Vào Backend Service → Environment tab
- [ ] Set `CORS_ORIGIN=https://campusia.online`
- [ ] Set `FRONTEND_URL=https://campusia.online`
- [ ] Save changes
- [ ] Đợi redeploy (2-3 phút)
- [ ] Check logs → Verify CORS Origin correct

Frontend:
- [ ] Vào Frontend Static Site → Environment tab
- [ ] Verify `VITE_API_URL=https://campusia1-backend.onrender.com`
- [ ] Nếu thiếu hoặc sai → Add/Update
- [ ] Save changes → Rebuild nếu cần

Testing:
- [ ] Mở https://campusia.online
- [ ] Hard refresh (Ctrl+Shift+R)
- [ ] F12 → Console → No CORS errors
- [ ] Banner đỏ biến mất
- [ ] Events hiển thị
- [ ] Admin login works

---

## 💡 WHY THIS HAPPENS?

### The Problem

1. **Ban đầu:** Frontend deploy lên `campusia1-frontend.onrender.com`
2. **Backend config:** `CORS_ORIGIN=campusia1-frontend.onrender.com`
3. **Sau đó:** Add custom domain `campusia.online` cho frontend
4. **Result:** Frontend chạy trên `campusia.online` nhưng backend vẫn chỉ allow `campusia1-frontend.onrender.com`
5. **CORS Error:** Browser block vì origin không match!

### The Solution

Update backend CORS to match actual frontend domain:
```
campusia1-frontend.onrender.com → campusia.online
```

---

## 🚀 DEPLOYMENT BEST PRACTICES

### 1. Always Match Domains

```bash
# If frontend uses custom domain:
Frontend URL:    https://campusia.online
Backend CORS:    https://campusia.online

# If frontend uses Render domain:
Frontend URL:    https://app.onrender.com  
Backend CORS:    https://app.onrender.com
```

### 2. Test After Domain Changes

Mỗi khi thay đổi domain:
1. Update backend CORS_ORIGIN
2. Redeploy backend
3. Test CORS trong browser console
4. Verify API calls work

### 3. Use Environment Variables

Đừng hardcode domains trong code. Luôn dùng env vars:
```javascript
// ✅ Good
origin: process.env.CORS_ORIGIN

// ❌ Bad
origin: 'https://campusia1-frontend.onrender.com'
```

---

## 📱 QUICK COMMANDS

### Test Backend Health
```bash
curl https://campusia1-backend.onrender.com/health
```

### Test CORS from Browser Console
```javascript
fetch('https://campusia1-backend.onrender.com/api/events')
  .then(r => r.json())
  .then(data => console.log('Events:', data))
```

### Hard Refresh Browser
```
Windows/Linux: Ctrl + Shift + R
Mac:          Cmd + Shift + R
```

---

## ✅ SUCCESS CRITERIA

Fix thành công khi:

1. ✅ Backend logs show: `CORS Origin: https://campusia.online`
2. ✅ Frontend mở được: https://campusia.online
3. ✅ Không có banner đỏ "Backend không chạy"
4. ✅ F12 Console không có CORS errors
5. ✅ Events hiển thị trên homepage
6. ✅ Admin login works
7. ✅ Tất cả features hoạt động

---

## 📚 Related Docs

- [BACKEND_DEPLOY_FIX.md](BACKEND_DEPLOY_FIX.md) - Backend deployment guide
- [QUICK_FIX_BACKEND.md](QUICK_FIX_BACKEND.md) - Quick fix guide
- [CUSTOM_DOMAIN.md](CUSTOM_DOMAIN.md) - Custom domain setup

---

**Status:** 🚀 Ready to Fix  
**Time Required:** 5 minutes  
**Difficulty:** ⭐ Very Easy  
**Priority:** 🔥 URGENT

**BẮT ĐẦU NGAY:** Update backend CORS_ORIGIN ↑
