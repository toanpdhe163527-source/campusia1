# ⚡ Hướng Dẫn Deploy Nhanh

## 🎯 Checklist Deploy (30 phút)

### ✅ Bước 1: Chuẩn Bị GitHub (5 phút)

```bash
# 1. Khởi tạo Git (nếu chưa có)
git init

# 2. Add tất cả files
git add .

# 3. Commit
git commit -m "Ready for deployment"

# 4. Tạo repo mới trên GitHub
# Truy cập: https://github.com/new
# Tên repo: campusia

# 5. Push lên GitHub
git remote add origin https://github.com/YOUR_USERNAME/campusia.git
git branch -M main
git push -u origin main
```

---

### ✅ Bước 2: Deploy Backend Lên Render (10 phút)

1. **Đăng ký Render**: https://render.com → Sign up with GitHub

2. **Tạo Web Service**:
   - Click **New +** → **Web Service**
   - Chọn repository `campusia`
   
3. **Cấu hình**:
   ```
   Name: campusia-backend
   Region: Singapore
   Branch: main
   Root Directory: backend
   Runtime: Node
   Build Command: npm install
   Start Command: node src/server.js
   Instance Type: Free
   ```

4. **Environment Variables** (Click "Advanced" → "Add Environment Variable"):
   ```
   PORT = 5000
   JWT_SECRET = campusia-secret-2025
   ADMIN_PASSWORD = campusia@12345
   NODE_ENV = production
   FRONTEND_URL = https://YOUR-APP.vercel.app
   ```
   *(Tạm thời để FRONTEND_URL như vậy, sẽ update sau)*

5. **Deploy**: Click **"Create Web Service"**

6. **Lấy URL**: Sau khi deploy xong (3-5 phút), copy URL:
   ```
   https://campusia-backend.onrender.com
   ```

7. **Test**: Truy cập `https://campusia-backend.onrender.com/health`
   - Phải thấy: `{"status":"ok",...}`

---

### ✅ Bước 3: Deploy Frontend Lên Vercel (10 phút)

1. **Đăng ký Vercel**: https://vercel.com → Sign up with GitHub

2. **Import Project**:
   - Click **"Add New..."** → **"Project"**
   - Chọn repository `campusia`
   - Click **"Import"**

3. **Cấu hình**:
   ```
   Framework Preset: Vite
   Root Directory: ./
   Build Command: npm run build (tự động detect)
   Output Directory: dist (tự động detect)
   ```

4. **Environment Variables**:
   - Click **"Environment Variables"**
   - Thêm:
     ```
     Name: VITE_API_URL
     Value: https://campusia-backend.onrender.com
     ```
   *(Thay bằng URL backend của bạn từ Bước 2)*

5. **Deploy**: Click **"Deploy"**

6. **Lấy URL**: Sau khi deploy xong (2-3 phút), copy URL:
   ```
   https://campusia.vercel.app
   ```

---

### ✅ Bước 4: Cập Nhật CORS Backend (5 phút)

1. Quay lại **Render Dashboard**
2. Vào **campusia-backend** → **Environment**
3. Update `FRONTEND_URL`:
   ```
   FRONTEND_URL = https://campusia.vercel.app
   ```
   *(Thay bằng URL frontend của bạn từ Bước 3)*

4. Click **"Save Changes"**
5. Đợi Render auto-redeploy (1-2 phút)

---

### ✅ Bước 5: Kiểm Tra (5 phút)

1. **Test Frontend**:
   - Mở: `https://campusia.vercel.app`
   - Trang chủ hiển thị bình thường ✅

2. **Test Login**:
   - Click **"Đăng nhập Admin"**
   - Password: `campusia@12345`
   - Login thành công → vào Admin Dashboard ✅

3. **Test Tạo Event**:
   - Trong Admin Dashboard, click **"Tạo sự kiện mới"**
   - Điền thông tin và tạo event
   - Event hiển thị trên trang chủ ✅

---

## 🎉 XONG!

Website của bạn đã live tại:
- **Frontend**: https://campusia.vercel.app
- **Backend**: https://campusia-backend.onrender.com

---

## ⚠️ Lưu Ý Quan Trọng

### Free Tier Limitations

**Render Free Tier**:
- Backend sẽ **sleep sau 15 phút** không dùng
- Lần đầu truy cập sau khi sleep mất **30-60 giây** để wake up
- **Giải pháp tạm thời**: Dùng UptimeRobot ping mỗi 5 phút (miễn phí)

**Vercel Free Tier**:
- Không giới hạn, chạy 24/7
- Băng thông: 100GB/tháng (đủ dùng)

### Storage & Uploads

- **Render Free Tier không có persistent storage**
- Upload files (images) sẽ **mất khi redeploy**
- **Giải pháo**: Dùng Cloudinary (free 25GB) cho production

---

## 🚀 Auto Deploy

Mỗi khi bạn push code lên GitHub:

```bash
git add .
git commit -m "Update features"
git push origin main
```

→ Vercel và Render sẽ **tự động deploy** trong vài phút!

---

## 🔧 Nếu Gặp Lỗi

### Lỗi: "Backend không kết nối"
- Đợi 60 giây (backend đang wake up)
- Check CORS: FRONTEND_URL phải đúng
- Check logs trong Render Dashboard

### Lỗi: "404 Not Found"
- Check Environment Variables đã đúng chưa
- Redeploy cả frontend và backend

### Lỗi: "Login failed"
- Check ADMIN_PASSWORD trong Render environment variables
- Default: `campusia@12345`

### Lỗi: "No Output Directory named 'dist' found"
- **Nguyên nhân**: Build command không tạo thư mục dist

- **Giải pháp**:
  1. Đảm bảo có file `vercel.json` ở root project
  2. Build command phải là: `vite build` (KHÔNG phải `tsc && vite build`)
  3. Vercel sẽ tự động detect và build đúng

### Lỗi: TypeScript errors khi build
- **Nguyên nhân**: TypeScript strict mode

- **Giải pháp**:
  1. Build command trong Vercel: `vite build` (bỏ `tsc &&`)
  2. Hoặc fix TypeScript errors trước khi deploy
---

## 📊 Cost Estimate

### Development (Miễn Phí 100%)
- Frontend: Vercel Free
- Backend: Render Free
- **Total: $0/tháng**

### Production (Khuyến nghị)
- Frontend: Vercel Free ($0)
- Backend: Render Starter ($7/tháng)
- Storage: Cloudinary Free ($0)
- **Total: $7/tháng**

---

## 📞 Support

Nếu gặp vấn đề:
1. Check file `DEPLOYMENT.md` (hướng dẫn chi tiết)
2. Check file `TESTING.md` (testing guide)
3. Check logs trên Render/Vercel dashboard

---

**Good luck! 🎉**