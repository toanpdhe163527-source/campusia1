# 🔧 FIX: Backend Không Chạy Sau Khi Deploy

**Tình trạng hiện tại:** Frontend đã deploy thành công trên `campusia.online`, nhưng backend chưa chạy.

**Nguyên nhân:** Backend chưa được deploy lên Render hoặc frontend chưa được cấu hình kết nối đến backend.

---

## ✅ GIẢI PHÁP: 3 BƯỚC

### Bước 1: Deploy Backend Lên Render

#### 1.1. Tạo Web Service cho Backend

1. Vào **Render Dashboard**: https://dashboard.render.com/
2. Click **New** → **Web Service**
3. Connect Git repository của bạn
4. Cấu hình:

```
Name:              campusia-backend
Region:            Singapore (gần VN nhất)
Branch:            main
Root Directory:    backend
Runtime:           Node
Build Command:     npm install
Start Command:     node src/server.js
Instance Type:     Free
```

#### 1.2. Thêm Environment Variables cho Backend

Trong tab **Environment**, thêm:

```bash
PORT=10000
NODE_ENV=production
JWT_SECRET=campusia-super-secret-jwt-key-2025-production
ADMIN_PASSWORD=campusia@12345
CORS_ORIGIN=https://campusia.online
FRONTEND_URL=https://campusia.online
```

⚠️ **QUAN TRỌNG:** 
- `CORS_ORIGIN` phải là domain chính xác của frontend
- Không có trailing slash: ✅ `https://campusia.online`
- Có trailing slash: ❌ `https://campusia.online/`

#### 1.3. Deploy Backend

1. Click **Create Web Service**
2. Đợi 3-5 phút để Render build và deploy
3. Backend sẽ có URL: `https://campusia-backend.onrender.com`

#### 1.4. Test Backend

Mở trình duyệt và truy cập:

```
https://campusia-backend.onrender.com/health
```

**Expected response:**
```json
{
  "status": "ok",
  "timestamp": "2025-10-18T...",
  "uptime": 123.456,
  "storage": "JSON files"
}
```

✅ Nếu thấy response này = Backend đã chạy thành công!

---

### Bước 2: Kết Nối Frontend với Backend

#### 2.1. Update Environment Variable trong Frontend

1. Vào **Render Dashboard** → **Static Site** (campusia-frontend)
2. Click vào tab **Environment**
3. Thêm hoặc update biến:

```bash
VITE_API_URL=https://campusia-backend.onrender.com
```

⚠️ **QUAN TRỌNG:** 
- Tên backend URL phải chính xác
- Không thêm `/api` ở cuối (code sẽ tự thêm)
- Đúng: ✅ `https://campusia-backend.onrender.com`
- Sai: ❌ `https://campusia-backend.onrender.com/api`

#### 2.2. Rebuild Frontend

1. Vẫn trong Static Site settings
2. Click **Manual Deploy** → **Clear build cache & deploy**
3. Đợi 2-3 phút để rebuild

---

### Bước 3: Verify Kết Nối

#### 3.1. Mở Website

```
https://campusia.online
```

#### 3.2. Check Console

1. Nhấn **F12** để mở DevTools
2. Vào tab **Console**
3. Reload page (Ctrl+R)

**Nếu thành công:**
- ✅ Không có lỗi màu đỏ về backend
- ✅ Không còn banner warning "Backend không chạy"
- ✅ Events được load và hiển thị

**Nếu vẫn lỗi:**
- ❌ Vẫn thấy banner đỏ → Xem troubleshooting bên dưới

#### 3.3. Check Network Tab

1. F12 → tab **Network**
2. Reload page
3. Tìm request đến backend:
   - `GET https://campusia-backend.onrender.com/api/events`

**Expected:**
- Status: `200 OK`
- Response: JSON với array events

---

## 🐛 TROUBLESHOOTING

### Lỗi 1: "Backend không chạy" vẫn hiển thị

**Nguyên nhân:** Frontend chưa có `VITE_API_URL` hoặc build cache cũ

**Giải pháp:**
```bash
# 1. Check environment variable trong Render
VITE_API_URL=https://campusia-backend.onrender.com

# 2. Clear build cache và deploy lại
Render Dashboard → Static Site → Manual Deploy → Clear build cache & deploy

# 3. Đợi build xong (2-3 phút)

# 4. Hard refresh browser
Ctrl + Shift + R (hoặc Cmd + Shift + R trên Mac)
```

---

### Lỗi 2: CORS Error trong Console

**Error message:**
```
Access to fetch at 'https://campusia-backend.onrender.com/api/events' 
from origin 'https://campusia.online' has been blocked by CORS policy
```

**Nguyên nhân:** Backend chưa cho phép frontend domain

**Giải pháp:**
```bash
# 1. Vào Backend Service → Environment
# 2. Check biến CORS_ORIGIN:
CORS_ORIGIN=https://campusia.online

# Phải chính xác, không có trailing slash!

# 3. Save changes → Backend auto redeploy

# 4. Đợi 2-3 phút

# 5. Reload frontend
```

---

### Lỗi 3: Backend shows "Application failed to respond"

**Nguyên nhân:** Start command sai hoặc port không đúng

**Giải pháp:**
```bash
# 1. Vào Backend Service → Settings
# 2. Check Start Command:
Start Command: node src/server.js

# 3. Check Environment:
PORT=10000

# 4. Check Root Directory:
Root Directory: backend

# 5. Manual Deploy → Deploy
```

---

### Lỗi 4: Events không hiển thị (Empty)

**Nguyên nhân:** Database mới, chưa có events

**Giải pháp:**

**Option A: Tạo events qua Admin UI**
1. Mở `https://campusia.online`
2. Click **Admin** (góc phải)
3. Login với password: `campusia@12345`
4. Click **Tạo sự kiện mới**
5. Nhập thông tin và tạo events

**Option B: Import sample data (Advanced)**
1. SSH vào Render backend (nếu có paid plan)
2. Hoặc tạo route `/api/init-data` để seed sample events

---

### Lỗi 5: 502 Bad Gateway

**Nguyên nhân:** Backend service bị sleep (Free tier)

**Giải pháp:**
```bash
# 1. Đợi 30-60 giây để backend wake up
# Free tier sleep sau 15 phút không activity

# 2. Reload page

# 3. Nếu cần 24/7 uptime:
# Upgrade backend lên Starter plan ($7/month)
```

---

## 📊 CHECKLIST: Verify Deployment

### Backend Checklist
- [ ] Backend service created trên Render
- [ ] Root Directory = `backend`
- [ ] Build Command = `npm install`
- [ ] Start Command = `node src/server.js`
- [ ] Environment variables đã set:
  - [ ] `PORT=10000`
  - [ ] `NODE_ENV=production`
  - [ ] `JWT_SECRET=...`
  - [ ] `ADMIN_PASSWORD=campusia@12345`
  - [ ] `CORS_ORIGIN=https://campusia.online`
  - [ ] `FRONTEND_URL=https://campusia.online`
- [ ] `/health` endpoint returns 200 OK
- [ ] Service status = "Live" (màu xanh)

### Frontend Checklist
- [ ] Static site deployed trên Render
- [ ] Environment variable set:
  - [ ] `VITE_API_URL=https://campusia-backend.onrender.com`
- [ ] Build successful
- [ ] Site accessible tại `https://campusia.online`
- [ ] Không có banner warning màu đỏ
- [ ] Events được load từ backend

### Connection Checklist
- [ ] F12 → Console → Không có CORS errors
- [ ] F12 → Network → API calls status 200
- [ ] Homepage hiển thị events
- [ ] Admin login works
- [ ] Create event works

---

## 🎯 EXPECTED RESULT

### Before Fix ❌
```
Frontend: ✅ https://campusia.online (deployed)
Backend:  ❌ Not deployed
Status:   ❌ "Backend không chạy" warning
Events:   ❌ Empty list
```

### After Fix ✅
```
Frontend: ✅ https://campusia.online
Backend:  ✅ https://campusia-backend.onrender.com
Status:   ✅ No warnings
Events:   ✅ Loaded from backend
Admin:    ✅ Can login and manage events
```

---

## 📱 Quick Reference: URLs

### Your Deployment
```
Frontend URL:    https://campusia.online
Backend URL:     https://campusia-backend.onrender.com
Backend Health:  https://campusia-backend.onrender.com/health
Backend API:     https://campusia-backend.onrender.com/api/*
```

### Render Dashboard
```
Dashboard:       https://dashboard.render.com/
Backend Service: https://dashboard.render.com/web/[your-backend-id]
Frontend Site:   https://dashboard.render.com/static/[your-frontend-id]
```

---

## 💡 PRO TIPS

### Tip 1: Check Logs để Debug
```bash
# Trong Render Dashboard:
1. Click vào Service (Backend hoặc Frontend)
2. Click tab "Logs"
3. Xem real-time logs để debug
```

### Tip 2: Test Backend trước khi Connect Frontend
```bash
# Test health endpoint
curl https://campusia-backend.onrender.com/health

# Test events endpoint  
curl https://campusia-backend.onrender.com/api/events

# Nếu cả 2 đều OK → Backend ready!
```

### Tip 3: Hard Refresh Browser để Clear Cache
```bash
# Windows/Linux
Ctrl + Shift + R

# Mac
Cmd + Shift + R

# Hoặc clear cache trong DevTools:
F12 → Network tab → Disable cache (checkbox)
```

---

## 🆘 VẪN CHƯA FIX ĐƯỢC?

### Debug Steps

1. **Check Backend Logs**
   ```
   Render → Backend Service → Logs tab
   Xem có errors không?
   ```

2. **Check Frontend Build Logs**
   ```
   Render → Frontend Static Site → Logs tab
   Xem VITE_API_URL có được set không?
   ```

3. **Check Browser Console**
   ```
   F12 → Console tab
   Copy full error message
   ```

4. **Test Backend Directly**
   ```bash
   # Open in browser:
   https://campusia-backend.onrender.com/health
   
   # Should see JSON response
   # If 404 or error → Backend có vấn đề
   ```

5. **Verify Environment Variables**
   ```bash
   # Backend:
   CORS_ORIGIN=https://campusia.online (chính xác?)
   
   # Frontend:
   VITE_API_URL=https://campusia-backend.onrender.com (chính xác?)
   ```

---

## 📚 Related Files

- `/backend/src/server.js` - Backend server code
- `/utils/api.ts` - Frontend API client
- `/App.tsx` - Health check logic
- `/RENDER_FULLSTACK.md` - Full deployment guide

---

## ⏱️ Timeline

```
⏱️ 00:00 - Deploy backend lên Render (5 phút)
⏱️ 00:05 - Set environment variables (2 phút)
⏱️ 00:07 - Test backend /health endpoint (1 phút)
⏱️ 00:08 - Update frontend VITE_API_URL (1 phút)
⏱️ 00:09 - Rebuild frontend (3 phút)
⏱️ 00:12 - Test website + verify (3 phút)
⏱️ 00:15 - DONE! ✅
```

**Tổng thời gian:** 15 phút

---

## ✅ SUCCESS CRITERIA

Bạn biết fix thành công khi:

1. ✅ Không còn banner đỏ "Backend không chạy"
2. ✅ Homepage hiển thị events (hoặc "Chưa có sự kiện")
3. ✅ F12 Console không có errors về API
4. ✅ Admin login works
5. ✅ Có thể tạo events mới từ admin panel
6. ✅ Events mới hiển thị ngay trên homepage

---

**Status:** 🚀 Ready to Fix  
**Time Required:** 15 minutes  
**Difficulty:** ⭐⭐ Easy

**BẮT ĐẦU NGAY:** Deploy backend theo Bước 1 ↑
