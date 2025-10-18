# 🚀 Hướng Dẫn Deploy Website Campusia Lên Internet

## Tổng Quan

Website Campusia bao gồm 2 phần:
- **Frontend**: React + Vite (port 3000) 
- **Backend**: Node.js + Express với JSON storage (port 5000)

Chúng ta sẽ deploy:
- Frontend → **Vercel** (miễn phí, tự động deploy từ GitHub)
- Backend → **Render** (miễn phí với free tier)

## 📋 Chuẩn Bị

### 1. Tạo GitHub Repository

```bash
# Khởi tạo Git (nếu chưa có)
git init

# Tạo .gitignore
echo "node_modules
dist
.env
.DS_Store
backend/data
uploads" > .gitignore

# Commit code
git add .
git commit -m "Initial commit"

# Push lên GitHub
git remote add origin https://github.com/YOUR_USERNAME/campusia.git
git branch -M main
git push -u origin main
```

### 2. Cài Đặt Environment Variables

Tạo file `.env.example` trong thư mục root:
```env
VITE_API_URL=http://localhost:5000
```

Tạo file `.env.example` trong thư mục `backend/`:
```env
PORT=5000
JWT_SECRET=your-secret-key-here
ADMIN_PASSWORD=campusia@12345
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

---

## 🎯 Phần 1: Deploy Backend Lên Render

### Bước 1: Tạo Tài Khoản Render
1. Truy cập: https://render.com
2. Sign up with GitHub
3. Authorize Render to access your repositories

### Bước 2: Tạo Web Service Mới
1. Click **"New +"** → **"Web Service"**
2. Chọn repository `campusia`
3. Cấu hình như sau:

**Basic Settings:**
- **Name**: `campusia-backend`
- **Region**: Singapore (gần Việt Nam nhất)
- **Branch**: `main`
- **Root Directory**: `backend`
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `node src/server.js`

**Instance Type:**
- Chọn **Free** (đủ dùng để test)

### Bước 3: Thêm Environment Variables
Trong phần **Environment**, thêm:

| Key | Value |
|-----|-------|
| `PORT` | `5000` |
| `JWT_SECRET` | `campusia-secret-key-2025` |
| `ADMIN_PASSWORD` | `campusia@12345` |
| `NODE_ENV` | `production` |
| `FRONTEND_URL` | `https://campusia.vercel.app` (sẽ cập nhật sau) |

### Bước 4: Deploy
1. Click **"Create Web Service"**
2. Đợi 3-5 phút để Render build và deploy
3. Sau khi xong, bạn sẽ có URL như: `https://campusia-backend.onrender.com`

### Bước 5: Kiểm Tra
Truy cập: `https://campusia-backend.onrender.com/health`

Nếu thấy `{"status":"ok"}` là thành công! ✅

---

## 🎨 Phần 2: Deploy Frontend Lên Vercel

### Bước 1: Tạo Tài Khoản Vercel
1. Truy cập: https://vercel.com
2. Sign up with GitHub
3. Import project `campusia`

### Bước 2: Cấu Hình Project
**Framework Preset**: Vite
**Root Directory**: `./` (root)
**Build Command**: `npm run build`
**Output Directory**: `dist`

### Bước 3: Thêm Environment Variable
Trong **Environment Variables**, thêm:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://campusia-backend.onrender.com` |

*Thay URL bằng URL backend của bạn từ Render*

### Bước 4: Deploy
1. Click **"Deploy"**
2. Đợi 2-3 phút
3. Bạn sẽ có URL như: `https://campusia.vercel.app`

### Bước 5: Cập Nhật CORS Backend
Quay lại Render, cập nhật environment variable:
- `FRONTEND_URL`: `https://campusia.vercel.app`

Sau đó **Manual Deploy** lại backend để apply changes.

---

## ✅ Kiểm Tra Deployment

1. **Test Frontend**: Truy cập `https://campusia.vercel.app`
2. **Test Backend**: Truy cập `https://campusia-backend.onrender.com/health`
3. **Test Login**: Đăng nhập admin với password `campusia@12345`
4. **Test Tạo Event**: Thử tạo một sự kiện mới

---

## ⚙️ Cấu Hình Tự Động Deploy

### Auto Deploy khi Push Code

**Vercel**: Tự động deploy khi bạn push code lên GitHub (đã setup sẵn)

**Render**: Tự động deploy khi bạn push code lên GitHub (đã setup sẵn)

Workflow:
```bash
git add .
git commit -m "Update feature"
git push origin main
# → Tự động trigger deploy trên cả Vercel và Render
```

---

## 🔧 Troubleshooting

### Lỗi: Backend không kết nối được
**Nguyên nhân**: Render free tier sẽ sleep sau 15 phút không dùng

**Giải pháp**:
1. Lần đầu truy cập sẽ mất 30-60 giây để backend "wake up"
2. Hoặc nâng cấp lên Render paid plan ($7/tháng)

### Lỗi: CORS Error
**Nguyên nhân**: FRONTEND_URL không đúng

**Giải pháp**:
1. Kiểm tra FRONTEND_URL trong Render environment variables
2. Redeploy backend sau khi update

### Lỗi: Images không hiển thị
**Nguyên nhân**: Upload folder không persist trên Render free tier

**Giải pháp**:
1. Sử dụng Cloudinary hoặc AWS S3 cho production
2. Hoặc nâng cấp Render plan có persistent disk

---

## 📊 So Sánh Các Platform Deploy

| Platform | Frontend | Backend | Giá | Ưu điểm | Nhược điểm |
|----------|----------|---------|-----|---------|------------|
| **Vercel** | ✅ Tuyệt vời | ❌ Không hỗ trợ | Miễn phí | Nhanh, CDN toàn cầu | Chỉ deploy frontend |
| **Render** | ✅ Tốt | ✅ Tốt | Free tier | Deploy cả FE + BE | Free tier sleep sau 15 phút |
| **Railway** | ✅ Tốt | ✅ Tốt | $5/tháng | Không sleep, đơn giản | Không có free tier |
| **Netlify** | ✅ Tuyệt vời | ⚠️ Serverless | Miễn phí | Tương tự Vercel | Backend phải là serverless |

---

## 🌟 Khuyến Nghị

### Development (Miễn Phí)
- Frontend: **Vercel** 
- Backend: **Render Free Tier**
- Lưu ý: Backend sẽ sleep, phù hợp cho demo/test

### Production (Trả Phí)
- Frontend: **Vercel** (miễn phí vẫn đủ)
- Backend: **Render Starter** ($7/tháng) hoặc **Railway** ($5/tháng)
- Storage: **Cloudinary** cho images

---

## 🔗 Useful Links

- [Render Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [GitHub Actions for CI/CD](https://docs.github.com/en/actions)

---

## 📝 Next Steps

Sau khi deploy thành công:
1. ✅ Test toàn bộ tính năng trên production
2. ✅ Setup custom domain (optional)
3. ✅ Setup monitoring (UptimeRobot để ping backend mỗi 5 phút tránh sleep)
4. ✅ Setup analytics (Google Analytics)
5. ✅ Backup data định kỳ

---

**Chúc bạn deploy thành công! 🎉**

Nếu gặp vấn đề, tham khảo phần Troubleshooting hoặc check logs trên Render/Vercel dashboard.
