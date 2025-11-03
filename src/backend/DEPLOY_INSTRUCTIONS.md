# 🚀 Backend Deployment Instructions

## Prerequisites

- ✅ Render PostgreSQL Database đã được tạo
- ✅ Cloudinary account đã được setup
- ✅ Backend code đã được push lên GitHub

---

## 📋 Required Environment Variables on Render

Vào **Render Dashboard** → **Backend Service** → Tab **"Environment"**, thêm các biến sau:

### 1. Database (REQUIRED)

```
DATABASE_URL=<copy-from-render-postgresql-database>
```

**Lấy ở đâu?**: Render Dashboard → PostgreSQL Database → Internal Database URL

### 2. Authentication (REQUIRED)

```
JWT_SECRET=your-super-secret-jwt-key-change-this
ADMIN_PASSWORD=campusia@12345
```

### 3. CORS (REQUIRED)

```
CORS_ORIGIN=https://campusia.online
```

### 4. Cloudinary (REQUIRED - Để ảnh không bị mất)

```
CLOUDINARY_URL=cloudinary://API_KEY:API_SECRET@CLOUD_NAME
```

**Lấy ở đâu?**: https://console.cloudinary.com/ → Dashboard → API Environment variable

### 5. Optional

```
NODE_ENV=production
PORT=5000
MAX_FILE_SIZE=5242880
```

---

## 🔄 Deploy Process

### Step 1: Update dependencies

Đảm bảo `package.json` có:

```json
{
  "dependencies": {
    "cloudinary": "^1.41.0"
  }
}
```

### Step 2: Push code to GitHub

```bash
git add .
git commit -m "Add Cloudinary for persistent image storage"
git push origin main
```

### Step 3: Deploy on Render

Render sẽ tự động detect thay đổi và deploy.

**Hoặc manual deploy**:
1. Vào Render Dashboard → Backend service
2. Tab "Manual Deploy"
3. Click "Deploy latest commit"

---

## ✅ Verify Deployment

### 1. Check Health Endpoint

```bash
curl https://your-backend.onrender.com/health
```

Expected response:
```json
{
  "status": "ok",
  "storage": "PostgreSQL Database",
  "database": "Connected"
}
```

### 2. Check Logs

Vào Render Dashboard → Logs tab, bạn sẽ thấy:

```
✅ Database initialized successfully
✅ Cloudinary configured via CLOUDINARY_URL
🚀 Campusia API Server running on port 5000
💾 Storage: PostgreSQL Database
🗄️  Database: Connected
```

### 3. Test API

```bash
# Get all events
curl https://your-backend.onrender.com/api/events

# Login (test authentication)
curl -X POST https://your-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"password":"campusia@12345"}'
```

---

## 🖼️ Cloudinary Setup Details

Xem hướng dẫn chi tiết tại: **/CLOUDINARY_SETUP.md**

Quick summary:
1. Tạo account: https://cloudinary.com/users/register_free
2. Get CLOUDINARY_URL: https://console.cloudinary.com/
3. Add to Render environment variables
4. Deploy!

---

## 🎯 Final Checklist

- [ ] Database: PostgreSQL created and DATABASE_URL added
- [ ] Cloudinary: Account created and CLOUDINARY_URL added
- [ ] Environment: All required variables added to Render
- [ ] Code: Pushed to GitHub
- [ ] Deploy: Backend deployed successfully
- [ ] Verify: Health check returns "ok"
- [ ] Test: Upload image via Admin → Image appears on Cloudinary
- [ ] Test: Restart backend → Image still exists!

---

## 🆘 Troubleshooting

### Database connection error

**Error**: "Failed to initialize database"

**Fix**: Check DATABASE_URL is correct. Must be Internal Database URL from Render PostgreSQL.

### Cloudinary error

**Error**: "CLOUDINARY_URL environment variable is not configured"

**Fix**: Add CLOUDINARY_URL to Render environment variables.

### CORS error

**Error**: "CORS policy blocked"

**Fix**: Ensure CORS_ORIGIN=https://campusia.online (no trailing slash)

### Image upload fails

**Error**: "Failed to upload image to Cloudinary"

**Fix**: 
1. Verify CLOUDINARY_URL is correct
2. Check Cloudinary account is active
3. Check logs for detailed error message

---

## 📚 Related Documentation

- **/CLOUDINARY_SETUP.md** - Cloudinary setup guide
- **/DEPLOY_CLOUDINARY_NOW.md** - Quick deploy guide
- **/backend/.env.example** - Environment variables example
- **/QUICK_START_POSTGRESQL.md** - PostgreSQL migration guide

---

**Last updated**: {{ current_date }}
