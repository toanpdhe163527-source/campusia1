# 🚀 Deploy Cả Backend + Frontend Trên Render

Hướng dẫn deploy TOÀN BỘ project (backend + frontend) lên Render.com

---

## 📊 So Sánh Phương Án

### Phương Án 1: Vercel (Frontend) + Render (Backend) ⭐ KHUYẾN NGHỊ
**Ưu điểm:**
- ✅ Frontend trên Vercel = tốc độ nhanh nhất (Edge CDN toàn cầu)
- ✅ Build time nhanh hơn
- ✅ Free tier rộng rãi
- ✅ Auto deploy từ Git cực mượt
- ✅ Vercel chuyên cho React/Vite

**Nhược điểm:**
- ⚠️ Phải quản lý 2 platforms

**Chi phí:**
- Frontend (Vercel): $0/tháng
- Backend (Render): $0/tháng (có sleep) hoặc $7/tháng
- **Tổng: $0-7/tháng**

---

### Phương Án 2: Render Full Stack (Cả Frontend + Backend)
**Ưu điểm:**
- ✅ Tất cả ở 1 nơi = dễ quản lý
- ✅ Chỉ cần 1 account
- ✅ Không lo CORS (cùng domain)

**Nhược điểm:**
- ⚠️ Frontend chậm hơn (không có global CDN như Vercel)
- ⚠️ Build time lâu hơn
- ⚠️ Free tier chỉ cho 1 web service (phải trả tiền cho service thứ 2)

**Chi phí:**
- Backend service: $0/tháng (có sleep) hoặc $7/tháng
- Frontend service: $7/tháng (không có free tier cho service thứ 2)
- **Tổng: $7-14/tháng**

---

## 🎯 Lựa Chọn Của Bạn

### Nên chọn Vercel + Render nếu:
- ✅ Muốn miễn phí hoàn toàn
- ✅ Muốn tốc độ loading frontend tối ưu
- ✅ OK với việc quản lý 2 platforms

### Nên chọn Render Full Stack nếu:
- ✅ Muốn tất cả ở 1 nơi
- ✅ OK với việc trả $7-14/tháng
- ✅ Không quan tâm tốc độ frontend quá nhiều

---

## 🔧 PHƯƠNG ÁN 1: Vercel + Render (KHUYẾN NGHỊ)

👉 **Đọc:** [QUICK_DEPLOY.md](QUICK_DEPLOY.md)

Đây là phương án được recommend trong tất cả tài liệu deployment hiện tại.

**Thời gian:** 30 phút  
**Chi phí:** $0/tháng  
**Độ khó:** ⭐⭐ Dễ

---

## 🔧 PHƯƠNG ÁN 2: Render Full Stack

### Tổng Quan

Bạn sẽ tạo 2 Web Services riêng biệt trên Render:
1. **Backend Service** - Node.js/Express API
2. **Frontend Service** - Static Site (Vite build)

---

## 📝 Bước 1: Chuẩn Bị Code

### 1.1. Tạo file build config cho frontend

Tạo file `/build.sh` trong root project:

```bash
#!/bin/bash
# Build script for frontend on Render

echo "Installing frontend dependencies..."
npm install

echo "Building frontend..."
npm run build

echo "Build complete! Output in dist/"
```

Chmod executable:
```bash
chmod +x build.sh
```

### 1.2. Cập nhật package.json

Đảm bảo có script:
```json
{
  "scripts": {
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

### 1.3. Push code lên Git

```bash
git add .
git commit -m "feat: Add Render full stack deployment config"
git push origin main
```

---

## 🚀 Bước 2: Deploy Backend Lên Render

### 2.1. Tạo Web Service cho Backend

1. Vào **Render Dashboard** → **New** → **Web Service**
2. Connect Git repository của bạn
3. Cấu hình:

| Setting | Value |
|---------|-------|
| **Name** | `campusia-backend` |
| **Region** | Singapore (gần VN nhất) |
| **Branch** | `main` |
| **Root Directory** | `backend` |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `node src/server.js` |

### 2.2. Environment Variables cho Backend

Thêm trong **Environment** tab:

```bash
PORT=10000
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key-campusia-2025
ADMIN_PASSWORD=campusia@12345
FRONTEND_URL=https://campusia-frontend.onrender.com
```

⚠️ **LƯU Ý:** `FRONTEND_URL` sẽ update sau khi deploy frontend!

### 2.3. Deploy Backend

1. Click **Create Web Service**
2. Đợi 3-5 phút build và deploy
3. Lưu lại URL: `https://campusia-backend.onrender.com`

### 2.4. Test Backend

```bash
curl https://campusia-backend.onrender.com/health
# Kết quả: {"status":"ok","timestamp":"..."}
```

✅ Backend đã live!

---

## 🎨 Bước 3: Deploy Frontend Lên Render

### 3.1. Tạo Static Site cho Frontend

⚠️ **QUAN TRỌNG:** Project đã có file `render.yaml` và `.node-version` để tự động config!

1. Vào **Render Dashboard** → **New** → **Static Site**
2. Connect cùng Git repository
3. Render sẽ **TỰ ĐỘNG PHÁT HIỆN** config từ `render.yaml`
4. Nếu không tự động, cấu hình thủ công:

| Setting | Value |
|---------|-------|
| **Name** | `campusia-frontend` |
| **Region** | Singapore |
| **Branch** | `main` |
| **Root Directory** | (để trống hoặc `./`) |
| **Build Command** | `npm install && npm run build` |
| **Publish Directory** | `dist` |

### 3.2. Environment Variables cho Frontend

Thêm trong **Environment** tab:

```bash
VITE_API_URL=https://campusia-backend.onrender.com
```

⚠️ **Thay** `campusia-backend` bằng tên backend service của bạn!

### 3.3. Deploy Frontend

1. Click **Create Static Site**
2. Đợi 3-5 phút build và deploy
3. Lưu lại URL: `https://campusia-frontend.onrender.com`

---

## 🔗 Bước 4: Kết Nối Backend ↔ Frontend

### 4.1. Update Backend FRONTEND_URL

1. Vào **Backend Service** → **Environment** tab
2. Sửa `FRONTEND_URL`:
   ```bash
   FRONTEND_URL=https://campusia-frontend.onrender.com
   ```
3. Click **Save Changes**
4. Backend sẽ tự động redeploy

### 4.2. Verify CORS

Backend đã config CORS cho frontend URL này, check file `backend/src/server.js`:

```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
```

✅ CORS sẽ work!

---

## ✅ Bước 5: Testing

### 5.1. Test Frontend

1. Mở `https://campusia-frontend.onrender.com`
2. ✅ Homepage loads
3. ✅ Hero carousel hiển thị
4. ✅ Events hiển thị

### 5.2. Test Backend Connection

1. Mở **Chrome DevTools** (F12) → **Network** tab
2. Reload page
3. Check các API calls:
   - ✅ `GET https://campusia-backend.onrender.com/api/events`
   - ✅ Status 200 OK

### 5.3. Test Admin Login

1. Click **Admin** button
2. Login với:
   - Password: `campusia@12345`
3. ✅ Login thành công
4. ✅ Admin dashboard hiển thị

### 5.4. Test Create Event

1. Tạo event mới trong Admin Dashboard
2. ✅ Event được tạo thành công
3. ✅ Event hiển thị trên homepage

---

## 💰 Chi Phí Deployment

### Free Tier
```
Backend Service (Free):     $0/month
Frontend Static Site:       $0/month
--------------------------------
Tổng:                       $0/month
```

**⚠️ Limitations:**
- Backend sleeps sau 15 phút không activity
- Bandwidth: 100GB/tháng
- Build minutes: 500 phút/tháng

**Khi nào cần upgrade?**
- Traffic cao (>100GB/tháng)
- Cần 24/7 uptime (không sleep)
- Cần persistent storage

### Paid Plan (Starter)
```
Backend Service (Starter):  $7/month
Frontend Static Site:       $0/month
--------------------------------
Tổng:                       $7/month
```

**Benefits:**
- ✅ Không sleep (24/7 uptime)
- ✅ Persistent disk storage
- ✅ Priority support
- ✅ More resources

---

## 🔄 Auto Deploy Setup

### Render Auto Deploy

Render tự động deploy khi bạn push code lên Git:

```bash
# 1. Make changes
git add .
git commit -m "Update feature"

# 2. Push to GitHub
git push origin main

# 3. Render auto detects and deploys
# Frontend: rebuilds trong 2-3 phút
# Backend: rebuilds trong 1-2 phút
```

### Deploy Branches

Render cho phép deploy nhiều branches:

- `main` → Production
- `develop` → Staging
- `feature-x` → Preview

Setup trong **Settings** → **Deploy** tab.

---

## 🐛 Troubleshooting

### Lỗi 1: Frontend build failed

**Error:** `No output directory 'dist' found`

**Giải pháp:**
1. Check Build Command: `npm install && npm run build`
2. Check Publish Directory: `dist`
3. Check `package.json` có script `build`
4. Redeploy

---

### Lỗi 2: Backend không start

**Error:** `Application failed to respond`

**Giải pháp:**
1. Check Start Command: `node src/server.js`
2. Check Root Directory: `backend`
3. Check logs trong **Logs** tab
4. Verify `PORT` environment variable = `10000`

---

### Lỗi 3: API calls fail (CORS)

**Error:** `CORS policy: No 'Access-Control-Allow-Origin' header`

**Giải pháp:**
1. Check backend `FRONTEND_URL` đúng với frontend URL
2. Không có trailing slash: ✅ `https://app.onrender.com`
3. Có trailing slash: ❌ `https://app.onrender.com/`
4. Redeploy backend sau khi sửa

---

### Lỗi 4: Backend sleeps (Free tier)

**Error:** First request sau 15 phút rất chậm

**Giải pháp Option 1 (Free):**
- Setup cron job để ping backend mỗi 10 phút
- Dùng https://cron-job.org

**Giải pháp Option 2 (Paid):**
- Upgrade lên Starter plan ($7/month)
- Không sleep, 24/7 uptime

---

### Lỗi 5: Environment variables không work

**Error:** `Cannot read properties of undefined (reading 'VITE_API_URL')`

**Giải pháp:**
1. Check Environment Variables đã save chưa
2. Frontend: Phải có prefix `VITE_`
3. Sau khi thêm env vars, phải redeploy
4. Clear browser cache và reload

---

## 📊 Render vs Vercel Comparison

| Feature | Render Full Stack | Vercel + Render |
|---------|------------------|-----------------|
| **Setup Complexity** | ⭐⭐ Dễ hơn | ⭐⭐⭐ Phức tạp hơn |
| **Management** | ✅ 1 platform | ⚠️ 2 platforms |
| **Frontend Speed** | ⭐⭐⭐ OK | ⭐⭐⭐⭐⭐ Rất nhanh |
| **Free Tier** | ⚠️ Limited | ✅ Generous |
| **Cost (Free)** | $0/month | $0/month |
| **Cost (Paid)** | $7-14/month | $7/month |
| **CORS Issues** | ✅ Ít hơn | ⚠️ Phải config |
| **Global CDN** | ❌ No | ✅ Yes (Vercel) |

---

## 🎯 Khuyến Nghị Cuối Cùng

### Cho Development/Testing
👉 **Render Full Stack**
- Dễ setup hơn
- Tất cả ở 1 nơi
- $0/month

### Cho Production
👉 **Vercel + Render**
- Frontend nhanh nhất
- Best practices
- Tối ưu chi phí

---

## 📱 Quick Links

### Render Documentation
- 🔗 [Render Docs](https://render.com/docs)
- 🔗 [Static Sites](https://render.com/docs/static-sites)
- 🔗 [Web Services](https://render.com/docs/web-services)

### Project Documentation
- 📖 [QUICK_DEPLOY.md](QUICK_DEPLOY.md) - Vercel + Render
- 📖 [DEPLOYMENT.md](DEPLOYMENT.md) - Detailed guide
- 🔧 [VERCEL_FIX.md](VERCEL_FIX.md) - Fix Vercel errors

---

## ✅ Deployment Checklist

### Pre-Deployment
- [ ] Code đã push lên Git
- [ ] `npm run build` works locally
- [ ] Backend starts với `node backend/src/server.js`

### Backend Deployment
- [ ] Web Service created
- [ ] Root Directory = `backend`
- [ ] Environment variables set
- [ ] `/health` endpoint returns 200

### Frontend Deployment
- [ ] Static Site created
- [ ] Root Directory = `./`
- [ ] Publish Directory = `dist`
- [ ] `VITE_API_URL` set correctly

### Post-Deployment
- [ ] Frontend accessible
- [ ] Backend health check OK
- [ ] API calls working (check Network tab)
- [ ] No CORS errors
- [ ] Admin login works
- [ ] Create event works

---

## 🎉 Xong!

Bạn đã deploy thành công cả backend và frontend lên Render!

**URLs của bạn:**
- 🌐 Frontend: `https://campusia-frontend.onrender.com`
- 🔌 Backend: `https://campusia-backend.onrender.com`

**Next Steps:**
1. Test kỹ tất cả features
2. Setup custom domain (optional) - xem [CUSTOM_DOMAIN.md](CUSTOM_DOMAIN.md)
3. Upgrade plan nếu cần 24/7 uptime

---

**Last Updated:** 2025-01-17  
**Status:** ✅ Production Ready
