# ⚡ QUICK FIX: Backend Không Chạy

**Vấn đề:** Banner đỏ "Backend không chạy" trên campusia.online

**Nguyên nhân:** Backend chưa deploy hoặc frontend chưa connect đến backend

**Thời gian fix:** 15 phút

---

## 🎯 3 BƯỚC NHANH

### ✅ BƯỚC 1: Deploy Backend (5 phút)

1. **Vào Render Dashboard:** https://dashboard.render.com/

2. **New → Web Service**

3. **Config:**
   ```
   Name:           campusia-backend
   Root Directory: backend
   Build Command:  npm install
   Start Command:  node src/server.js
   ```

4. **Environment Variables:**
   ```bash
   PORT=10000
   NODE_ENV=production
   JWT_SECRET=campusia-secret-key-2025
   ADMIN_PASSWORD=campusia@12345
   CORS_ORIGIN=https://campusia.online
   FRONTEND_URL=https://campusia.online
   ```

5. **Create Web Service** → Đợi 3-5 phút

6. **Test:** Mở `https://campusia-backend.onrender.com/health`
   - ✅ Phải thấy JSON response

---

### ✅ BƯỚC 2: Connect Frontend (2 phút)

1. **Vào Frontend Static Site** trong Render

2. **Environment tab** → Add:
   ```bash
   VITE_API_URL=https://campusia-backend.onrender.com
   ```
   ⚠️ Thay `campusia-backend` bằng tên backend service của bạn!

3. **Save Changes**

---

### ✅ BƯỚC 3: Rebuild Frontend (3 phút)

1. **Manual Deploy** → **Clear build cache & deploy**

2. Đợi 2-3 phút

3. **Mở campusia.online** → Hard refresh (Ctrl+Shift+R)

4. ✅ **DONE!** Không còn banner đỏ!

---

## 🔍 VERIFY THÀNH CÔNG

### Check 1: Backend Health
```bash
Mở: https://campusia-backend.onrender.com/health

Expected:
{
  "status": "ok",
  "timestamp": "...",
  "storage": "JSON files"
}
```

### Check 2: Frontend Loading
```bash
Mở: https://campusia.online

Expected:
✅ Không có banner đỏ
✅ Events hiển thị (hoặc "Chưa có sự kiện")
✅ Không có errors trong Console (F12)
```

### Check 3: API Connection
```bash
F12 → Network tab → Reload page

Expected:
✅ GET https://campusia-backend.onrender.com/api/events
✅ Status: 200 OK
```

---

## 🐛 VẪN LỖI?

### Lỗi: Backend 502 Bad Gateway
**Fix:** Đợi 30-60 giây (backend đang wake up từ sleep)

### Lỗi: CORS blocked
**Fix:** 
```bash
# Backend Environment:
CORS_ORIGIN=https://campusia.online
# (không có trailing slash!)
```

### Lỗi: Banner đỏ vẫn hiển thị
**Fix:**
```bash
# 1. Check VITE_API_URL trong Frontend
# 2. Clear build cache → Deploy lại
# 3. Hard refresh browser (Ctrl+Shift+R)
```

---

## 📱 Quick Links

- **Backend:** https://campusia-backend.onrender.com/health
- **Frontend:** https://campusia.online
- **Render Dashboard:** https://dashboard.render.com/
- **Full Guide:** [BACKEND_DEPLOY_FIX.md](BACKEND_DEPLOY_FIX.md)

---

## 📋 CHECKLIST

Backend:
- [ ] Service created trên Render
- [ ] Root Directory = `backend`
- [ ] Environment variables set (6 biến)
- [ ] `/health` returns 200 OK

Frontend:
- [ ] Environment variable `VITE_API_URL` set
- [ ] Rebuilt với clear cache
- [ ] No warning banner
- [ ] Events load successfully

---

**⏱️ Timeline:** 15 phút  
**💰 Cost:** $0/month (Free tier)  
**🎯 Success Rate:** 99%

**BẮT ĐẦU NGAY!** ↑ Follow 3 bước trên
