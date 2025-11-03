# 🚨 FIX: DATABASE_URL Not Set - URGENT

## ❌ Lỗi hiện tại

```
❌ DATABASE_URL is not set!
Please add DATABASE_URL to your environment variables.
==> Exited with status 1
```

Backend đang tìm `DATABASE_URL` environment variable để connect với PostgreSQL database nhưng không tìm thấy.

---

## 🎯 Giải pháp (3 phút)

### Bước 1: Lấy DATABASE_URL từ PostgreSQL database

1. **Vào Render Dashboard**: https://dashboard.render.com/
2. **Tìm PostgreSQL database** (không phải backend service!)
   - Tên có thể là: `campusia-db`, `campusia-postgres`, hoặc tương tự
3. **Click vào database** → Tab **"Info"**
4. **Scroll xuống tìm "Internal Database URL"** hoặc **"External Database URL"**
5. **Copy DATABASE_URL** - Nó có dạng:
   ```
   postgresql://username:password@hostname:5432/database_name
   ```
   hoặc:
   ```
   postgres://username:password@hostname:5432/database_name
   ```

### Bước 2: Add DATABASE_URL vào Backend Service

1. **Vào Render Dashboard** → Click vào **backend service** (không phải database!)
2. **Tab "Environment"** → Click **"Add Environment Variable"**
3. **Add variable:**
   - **Key:** `DATABASE_URL`
   - **Value:** Paste chuỗi từ Bước 1
4. **Click "Save Changes"**

### Bước 3: Verify & Deploy

Render sẽ tự động trigger deploy mới sau khi save environment variable.

**Check Logs:**
1. Vào **"Logs"** tab
2. Đợi deploy hoàn tất
3. Bạn sẽ thấy:
   ```
   🔄 Initializing database tables...
   ✅ PostgreSQL connected successfully
   ✅ Events table ready
   ✅ Admin table ready
   ✅ Database initialization complete!
   ✅ Cloudinary configured via CLOUDINARY_URL
   🚀 Campusia API Server running on port 5000
   💾 Storage: PostgreSQL Database
   ```

---

## 🔍 Nếu chưa có PostgreSQL Database

### Option A: Create PostgreSQL Database on Render

1. **Vào Render Dashboard** → **"New +"** → **"PostgreSQL"**
2. **Config:**
   - **Name:** `campusia-postgres`
   - **Database:** `campusia_db`
   - **User:** `campusia_user`
   - **Region:** Same as backend (e.g., Singapore)
   - **Plan:** Free
3. **Click "Create Database"**
4. **Đợi provisioning** (1-2 phút)
5. **Lấy DATABASE_URL** từ "Internal Database URL"
6. **Add vào Backend** (làm theo Bước 2 ở trên)

### Option B: Use External PostgreSQL (Supabase, Neon, etc.)

Nếu bạn dùng PostgreSQL từ provider khác:

1. **Lấy connection string** từ provider
2. **Format chuẩn:**
   ```
   postgresql://username:password@host:port/database?sslmode=require
   ```
3. **Add vào Render** (Bước 2 ở trên)

---

## ✅ Environment Variables cần thiết

Sau khi setup xong, backend cần **3 environment variables chính:**

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `DATABASE_URL` | ✅ YES | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `CLOUDINARY_URL` | ✅ YES | Cloudinary cloud storage | `cloudinary://key:secret@cloud` |
| `CORS_ORIGIN` | ⚠️ Recommended | Frontend domain | `https://campusia.online` |
| `ADMIN_PASSWORD` | 🔵 Optional | Default admin password | `campusia@12345` (default) |

---

## 🔄 Current Environment Status

**Check your Render backend service Environment tab:**

- [ ] `DATABASE_URL` - ❌ MISSING (CAUSING ERROR)
- [ ] `CLOUDINARY_URL` - ✅ Should be set (from previous setup)
- [ ] `CORS_ORIGIN` - ⚠️ Optional (recommended: `https://campusia.online`)
- [ ] `PORT` - ℹ️ Auto-set by Render (default: 10000)
- [ ] `NODE_ENV` - ℹ️ Auto-set by Render (production)

---

## 🎯 Quick Checklist

### Before fixing:
- [ ] Tìm PostgreSQL database trên Render Dashboard
- [ ] Copy DATABASE_URL từ database

### Fixing:
- [ ] Vào backend service → Environment
- [ ] Add DATABASE_URL variable
- [ ] Save changes
- [ ] Wait for auto-deploy

### After fixing:
- [ ] Check logs → See "PostgreSQL connected"
- [ ] Test API: https://your-backend.onrender.com/health
- [ ] Test frontend: https://campusia.online
- [ ] Login admin → Create event → Should work!

---

## 🆘 Troubleshooting

### Lỗi: "Connection refused"
```
Error: connect ECONNREFUSED
```
→ **Fix:** DATABASE_URL sai. Đảm bảo copy đúng từ PostgreSQL database Info tab.

### Lỗi: "password authentication failed"
```
Error: password authentication failed for user "username"
```
→ **Fix:** Username/password trong DATABASE_URL không đúng. Lấy lại từ database.

### Lỗi: "SSL required"
```
Error: no pg_hba.conf entry for host
```
→ **Fix:** Thêm `?sslmode=require` vào cuối DATABASE_URL:
```
postgresql://user:pass@host:5432/db?sslmode=require
```

### Database connection timeout
```
Error: Connection timeout
```
→ **Fix:** 
1. Kiểm tra database có đang running không
2. Kiểm tra region của backend và database có giống nhau không
3. Thử dùng "Internal Database URL" thay vì "External"

---

## 📚 Related Files

- Backend config: `/backend/src/config/db.js`
- Server startup: `/backend/src/server.js`
- Database models: `/backend/src/models/Event.js`, `/backend/src/models/Admin.js`

---

## 🚀 After Fix

Sau khi fix xong, backend sẽ:

1. ✅ Connect PostgreSQL successfully
2. ✅ Auto-create tables (events, admin)
3. ✅ Auto-create default admin (password: `campusia@12345`)
4. ✅ Ready to serve API requests
5. ✅ Frontend can create/edit/delete events
6. ✅ Data persists after restart

---

**🎯 ACTION: Làm ngay bây giờ để backend hoạt động!**

**Step-by-step:**
1. Render Dashboard → PostgreSQL database → Copy DATABASE_URL
2. Render Dashboard → Backend service → Environment → Add DATABASE_URL
3. Save → Wait for deploy → Check logs → ✅ Done!
