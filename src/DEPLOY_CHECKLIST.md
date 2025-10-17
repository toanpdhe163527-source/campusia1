# ✅ Deployment Checklist

Sử dụng checklist này để đảm bảo deploy thành công!

---

## 📝 Pre-Deployment

### Code Preparation
- [ ] Code chạy tốt trên local (frontend + backend)
- [ ] Đã test tất cả features (xem TESTING.md)
- [ ] Không có errors trong console
- [ ] Images upload working
- [ ] Login/Admin working

### Git Setup
- [ ] Đã tạo `.gitignore` file
- [ ] Đã commit all changes
- [ ] Repository clean (không có uncommitted changes)

### Files Check
- [ ] File `.env.example` đã tạo (frontend root)
- [ ] File `.env.example` đã tạo (backend/)
- [ ] File `DEPLOYMENT.md` đã đọc
- [ ] File `QUICK_DEPLOY.md` đã đọc

---

## 🚀 GitHub

- [ ] Tạo repository mới trên GitHub
- [ ] Repository name: `campusia` (hoặc tên bạn muốn)
- [ ] Push code lên GitHub:
  ```bash
  git init
  git add .
  git commit -m "Ready for deployment"
  git remote add origin https://github.com/YOUR_USERNAME/campusia.git
  git branch -M main
  git push -u origin main
  ```
- [ ] Verify: Code hiển thị trên GitHub

---

## 🔌 Backend Deployment (Render)

### Account Setup
- [ ] Đăng ký tài khoản Render: https://render.com
- [ ] Sign up with GitHub
- [ ] Authorize GitHub access

### Create Web Service
- [ ] Click "New +" → "Web Service"
- [ ] Chọn repository `campusia`
- [ ] Name: `campusia-backend`
- [ ] Region: Singapore
- [ ] Branch: `main`
- [ ] Root Directory: `backend`
- [ ] Runtime: `Node`
- [ ] Build Command: `npm install`
- [ ] Start Command: `node src/server.js`
- [ ] Instance Type: `Free`

### Environment Variables
- [ ] `PORT` = `5000`
- [ ] `JWT_SECRET` = `campusia-secret-2025` (đổi trong production!)
- [ ] `ADMIN_PASSWORD` = `campusia@12345`
- [ ] `NODE_ENV` = `production`
- [ ] `FRONTEND_URL` = `https://YOUR-APP.vercel.app` (update sau)

### Deploy & Verify
- [ ] Click "Create Web Service"
- [ ] Đợi 3-5 phút
- [ ] Check logs: Không có errors
- [ ] Copy backend URL: `https://campusia-backend.onrender.com`
- [ ] Test health: `https://campusia-backend.onrender.com/health`
- [ ] Response: `{"status":"ok"}`

---

## 🎨 Frontend Deployment (Vercel)

### Account Setup
- [ ] Đăng ký tài khoản Vercel: https://vercel.com
- [ ] Sign up with GitHub
- [ ] Authorize GitHub access

### Import Project
- [ ] Click "Add New..." → "Project"
- [ ] Chọn repository `campusia`
- [ ] Click "Import"

### Configuration
- [ ] Framework Preset: `Vite` (auto-detect)
- [ ] Root Directory: `./`
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `dist`

### Environment Variables
- [ ] Click "Environment Variables"
- [ ] Add variable:
  - Name: `VITE_API_URL`
  - Value: `https://campusia-backend.onrender.com` (backend URL của bạn)

### Deploy & Verify
- [ ] Click "Deploy"
- [ ] Đợi 2-3 phút
- [ ] Check build logs: Success
- [ ] Copy frontend URL: `https://campusia.vercel.app`
- [ ] Test: Mở URL trong browser
- [ ] Trang chủ hiển thị bình thường

---

## 🔧 Update CORS

### Update Backend
- [ ] Vào Render Dashboard
- [ ] Chọn `campusia-backend`
- [ ] Tab "Environment"
- [ ] Update `FRONTEND_URL` = `https://campusia.vercel.app` (frontend URL của bạn)
- [ ] Click "Save Changes"
- [ ] Đợi auto-redeploy (1-2 phút)

---

## ✅ Testing Production

### Frontend Tests
- [ ] Trang chủ load bình thường
- [ ] Hero carousel hiển thị (nếu có featured events)
- [ ] Event cards hiển thị
- [ ] Search box hoạt động
- [ ] Navigation menu hoạt động
- [ ] Click vào event → Event detail page
- [ ] Responsive trên mobile

### Backend Tests
- [ ] Health check: `https://YOUR-BACKEND.onrender.com/health`
- [ ] Events API: `https://YOUR-BACKEND.onrender.com/api/events`

### Admin Tests
- [ ] Click "Đăng nhập Admin"
- [ ] Password: `campusia@12345`
- [ ] Login thành công → Admin Dashboard
- [ ] Dashboard stats hiển thị
- [ ] Click "Tạo sự kiện mới"
- [ ] Điền form và submit
- [ ] Event được tạo thành công
- [ ] Event hiển thị trên trang chủ
- [ ] Toggle featured (star icon)
- [ ] Featured event hiển thị trong carousel
- [ ] Delete event
- [ ] Event bị xóa khỏi trang chủ

### Error Checks
- [ ] Không có CORS errors
- [ ] Không có 404 errors
- [ ] Không có console errors
- [ ] Images load correctly

---

## 📱 Mobile Testing

- [ ] Test trên mobile browser
- [ ] Responsive layout OK
- [ ] Touch interactions work
- [ ] Images scale correctly
- [ ] Navigation menu works

---

## 🔐 Security Checklist

### Production Security
- [ ] Đổi `JWT_SECRET` thành random string
- [ ] Đổi `ADMIN_PASSWORD` thành password mạnh
- [ ] HTTPS enabled (tự động trên Vercel/Render)
- [ ] CORS configured correctly
- [ ] Sensitive data không có trong GitHub

### Recommended Changes
```bash
# Strong password examples:
ADMIN_PASSWORD=Campusia2025!@SecurePass
JWT_SECRET=a8f5f167f44f4964e6c998dee827110c
```

Generate JWT_SECRET:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 📊 Performance Checklist

- [ ] Vercel build time < 2 minutes
- [ ] Render deploy time < 5 minutes
- [ ] Frontend load time < 2 seconds
- [ ] Backend response time < 500ms
- [ ] Images optimized (< 5MB each)

---

## 📝 Documentation

- [ ] Update `README.md` với production URLs
- [ ] Update team với URLs mới
- [ ] Lưu credentials an toàn
- [ ] Backup environment variables

---

## 🎉 Post-Deployment

### Share Your Site
- [ ] Test trên nhiều browsers (Chrome, Firefox, Safari)
- [ ] Test trên nhiều devices (Desktop, Mobile, Tablet)
- [ ] Share với team/friends để test
- [ ] Collect feedback

### Monitoring Setup (Optional)
- [ ] UptimeRobot: Ping health check mỗi 5 phút
- [ ] Google Analytics: Track visitors
- [ ] Sentry: Error monitoring

### Backup
- [ ] Export events data (download JSON)
- [ ] Backup images
- [ ] Save environment variables securely

---

## 🔄 Auto-Deploy Setup

Verified auto-deploy working:

- [ ] Push code to GitHub
  ```bash
  git add .
  git commit -m "Update feature"
  git push origin main
  ```
- [ ] Vercel auto-deploys frontend (check dashboard)
- [ ] Render auto-deploys backend (check dashboard)
- [ ] Wait 2-5 minutes
- [ ] Test changes on production

---

## 🐛 Common Issues

### Backend sleep (Render Free Tier)
**Problem:** First request takes 30-60 seconds

**Solution:**
- [ ] Upgrade to Render Starter ($7/month)
- OR
- [ ] Setup UptimeRobot to ping every 5 minutes (keeps it awake)

### Images not persisting (Render Free Tier)
**Problem:** Uploaded images disappear after redeploy

**Solution:**
- [ ] Use Cloudinary for image storage (free 25GB)
- OR
- [ ] Upgrade to Render plan with persistent disk

### CORS errors
**Problem:** "CORS policy" error in console

**Solution:**
- [ ] Check `FRONTEND_URL` in Render environment
- [ ] Must match exact Vercel URL (no trailing slash)
- [ ] Redeploy backend after change

---

## 📞 Support

Nếu gặp vấn đề:

1. **Check documentation:**
   - [ ] DEPLOYMENT.md
   - [ ] QUICK_DEPLOY.md
   - [ ] TESTING.md

2. **Check logs:**
   - [ ] Vercel dashboard → Deployments → Logs
   - [ ] Render dashboard → Logs

3. **Common fixes:**
   - [ ] Clear browser cache
   - [ ] Redeploy frontend
   - [ ] Redeploy backend
   - [ ] Check environment variables

---

## ✨ Success Criteria

Deployment thành công khi:

- ✅ Frontend live tại Vercel URL
- ✅ Backend live tại Render URL
- ✅ Health check returns OK
- ✅ Events load on homepage
- ✅ Admin login works
- ✅ Create event works
- ✅ Featured events show in carousel
- ✅ No console errors
- ✅ No CORS errors
- ✅ Mobile responsive works

---

## 🎯 Production URLs

**Lưu lại URLs của bạn:**

```
Frontend: https://__________________.vercel.app
Backend:  https://__________________.onrender.com

Admin Password: ____________________
JWT Secret:     ____________________

Deployed Date: ____________________
```

---

## 🚀 Next Steps

Sau khi deploy thành công:

- [ ] Read CUSTOM_DOMAIN.md (nếu muốn custom domain)
- [ ] Setup monitoring
- [ ] Add more events
- [ ] Customize design
- [ ] Add features
- [ ] Share với users!

---

**Chúc mừng bạn đã deploy thành công! 🎉**

Website của bạn đã live trên Internet!
