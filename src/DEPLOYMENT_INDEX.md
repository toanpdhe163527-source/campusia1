# 🚀 Deployment Documentation - Render Full Stack

Hướng dẫn deploy TOÀN BỘ Campusia (Backend + Frontend) lên Render.

---

## 📚 Bắt Đầu Ngay

### 👉 HƯỚNG DẪN CHÍNH

**📄 [RENDER_FULLSTACK.md](RENDER_FULLSTACK.md)** ⭐ **START HERE**

Đây là file CHÍNH cho deployment. Bao gồm:
- ✅ Deploy Backend lên Render Web Service
- ✅ Deploy Frontend lên Render Static Site
- ✅ Setup environment variables
- ✅ Kết nối Backend ↔ Frontend
- ✅ Testing và troubleshooting
- ✅ **Thời gian: 30 phút**
- ✅ **Chi phí: $0/tháng (Free tier)**

---

## 📖 Tài Liệu Bổ Sung (Optional)

### DEPLOYMENT.md 📖
Hướng dẫn chi tiết và lý thuyết:
- So sánh các platform khác nhau
- Best practices cho production
- Troubleshooting nâng cao
- Monitoring và maintenance

**👉 Đọc SAU KHI deploy thành công để hiểu sâu hơn**

📄 [Đọc DEPLOYMENT.md](DEPLOYMENT.md)

---

### DEPLOY_CHECKLIST.md ✅
Checklist từng bước để đảm bảo không bỏ sót:
- Pre-deployment checklist
- Step-by-step deployment
- Testing checklist
- Security checklist

**👉 Print ra để check từng bước khi deploy**

📄 [Đọc DEPLOY_CHECKLIST.md](DEPLOY_CHECKLIST.md)

---

### CUSTOM_DOMAIN.md 🌐
Setup custom domain cho website (Optional):
- Mua domain
- DNS configuration
- SSL setup
- Email setup

**👉 Đọc SAU KHI deploy thành công nếu muốn domain riêng (ví dụ: campusia.com)**

📄 [Đọc CUSTOM_DOMAIN.md](CUSTOM_DOMAIN.md)

---

## 🎯 Quy Trình Deploy

```
1. Đọc RENDER_FULLSTACK.md
   ↓
2. Follow từng bước trong guide
   ↓
3. Deploy Backend (5-10 phút)
   ↓
4. Deploy Frontend (5-10 phút)
   ↓
5. Kết nối Backend ↔ Frontend (5 phút)
   ↓
6. Testing (TESTING.md)
   ↓
7. XONG! ✅
```

---

## 💰 Chi Phí Deployment

### Free Tier (Development)
```
Backend Service:     $0/month (có sleep sau 15 phút)
Frontend Static:     $0/month
Domain:              $0 (dùng .onrender.com)
---------------------------------
Total:               $0/month
```

**Giới hạn:**
- ⚠️ Backend sleeps sau 15 phút không hoạt động
- ⚠️ Request đầu tiên sau khi sleep sẽ chậm (~30-60s)
- ✅ Bandwidth: 100GB/tháng (đủ cho development)

---

### Paid Tier (Production)
```
Backend Starter:     $7/month (24/7, không sleep)
Frontend Static:     $0/month (miễn phí)
Domain:              $1/month (~$12/năm)
---------------------------------
Total:               ~$8/month
```

**Lợi ích:**
- ✅ Backend không sleep (24/7 uptime)
- ✅ Persistent disk storage
- ✅ Custom domain
- ✅ Hiệu suất tốt hơn

---

## 🔗 Environment Variables Cần Thiết

### Frontend (.env)
```bash
VITE_API_URL=https://campusia-backend.onrender.com
```

### Backend (.env)
```bash
PORT=10000
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key-campusia-2025
ADMIN_PASSWORD=campusia@12345
FRONTEND_URL=https://campusia-frontend.onrender.com
```

⚠️ **LƯU Ý:** Thay `campusia-backend` và `campusia-frontend` bằng tên service của bạn!

---

## ✅ Checklist Deployment Thành Công

- [ ] Backend live tại: `https://your-backend.onrender.com`
- [ ] Frontend live tại: `https://your-frontend.onrender.com`
- [ ] Health check OK: `https://your-backend.onrender.com/health`
- [ ] Homepage loads correctly
- [ ] Events hiển thị
- [ ] Admin login works
- [ ] Tạo event works
- [ ] Không có CORS errors
- [ ] Không có console errors

---

## 🐛 Troubleshooting Nhanh

### Lỗi: Backend không start
➡️ Check Build Command và Start Command trong RENDER_FULLSTACK.md

### Lỗi: CORS errors
➡️ Check `FRONTEND_URL` trong backend env vars khớp với frontend URL

### Lỗi: Frontend build failed
➡️ Check Build Command: `npm install && npm run build`
➡️ Check Publish Directory: `dist`

### Lỗi: Backend chậm/timeout
➡️ Backend đang sleep (Free tier). Đợi 30-60s hoặc upgrade plan.

**Chi tiết troubleshooting:** Xem phần "Troubleshooting" trong RENDER_FULLSTACK.md

---

## 📱 Tài Liệu Khác

### Main Documentation
- 📖 [START_HERE.md](START_HERE.md) - Bắt đầu với project
- 📖 [README.md](README.md) - Hướng dẫn đầy đủ
- 🧪 [TESTING.md](TESTING.md) - Testing guide
- 📝 [CHANGELOG.md](CHANGELOG.md) - Updates

### Backend
- 🔌 [backend/README.md](backend/README.md) - API documentation

---

## 🎉 Sẵn Sàng Deploy?

**Bắt đầu ngay:**

1. 👉 **Mở [RENDER_FULLSTACK.md](RENDER_FULLSTACK.md)**
2. Follow từng bước
3. Deploy trong 30 phút
4. Enjoy! 🚀

---

**Platform:** Render.com (Full Stack)  
**Chi phí:** $0/tháng (Free tier)  
**Thời gian setup:** 30 phút  
**Độ khó:** ⭐⭐ Easy

**Last Updated:** 2025-01-17  
**Status:** ✅ Production Ready
