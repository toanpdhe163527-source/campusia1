# ✅ Environment Variables Setup Checklist

**Render Backend Service cần 2 environment variables BẮT BUỘC:**

---

## 🚨 Required (BẮT BUỘC)

### 1. DATABASE_URL ❌ MISSING
**Status:** ❌ Chưa có (đang gây lỗi deploy)

**Lấy từ đâu:**
- Render Dashboard → PostgreSQL Database → Tab "Info"
- Copy "Internal Database URL" hoặc "External Database URL"

**Format:**
```
postgresql://username:password@hostname:5432/database_name
```

**Add vào:**
- Render Dashboard → Backend Service → Tab "Environment"
- Key: `DATABASE_URL`
- Value: (paste connection string)

---

### 2. CLOUDINARY_URL ✅ Should be set
**Status:** ✅ Đã setup (từ migration trước)

**Lấy từ đâu:**
- Cloudinary Dashboard → https://console.cloudinary.com/
- Copy "API Environment variable"

**Format:**
```
cloudinary://api_key:api_secret@cloud_name
```

**Add vào:**
- Render Dashboard → Backend Service → Tab "Environment"
- Key: `CLOUDINARY_URL`
- Value: (paste Cloudinary URL)

---

## ⚠️ Recommended (Khuyến nghị)

### 3. CORS_ORIGIN
**Status:** 🔵 Optional nhưng nên có

**Value:**
```
https://campusia.online
```

**Purpose:** Cho phép frontend gọi API từ custom domain

**Add vào:**
- Render Dashboard → Backend Service → Tab "Environment"
- Key: `CORS_ORIGIN`
- Value: `https://campusia.online`

---

## 🔵 Optional (Tùy chọn)

### 4. ADMIN_PASSWORD
**Status:** 🔵 Optional

**Default:** `campusia@12345` (tự động dùng nếu không set)

**Purpose:** Đổi mật khẩu admin mặc định

**Add nếu muốn:**
- Key: `ADMIN_PASSWORD`
- Value: Your custom password

---

## 🎯 Quick Setup Guide

### Step 1: Get DATABASE_URL

```
Render Dashboard
  → PostgreSQL Database (tìm database, không phải backend!)
  → Tab "Info"
  → Copy "Internal Database URL"
```

### Step 2: Add to Backend

```
Render Dashboard
  → Backend Service (web service của bạn)
  → Tab "Environment"
  → Click "Add Environment Variable"
  
Add these:
  1. DATABASE_URL = postgresql://...
  2. CLOUDINARY_URL = cloudinary://...  (should already exist)
  3. CORS_ORIGIN = https://campusia.online
  
  → Click "Save Changes"
```

### Step 3: Verify Deploy

```
Render sẽ auto-deploy sau khi save

Check Logs tab:
  ✅ PostgreSQL connected successfully
  ✅ Events table ready
  ✅ Admin table ready
  ✅ Cloudinary configured via CLOUDINARY_URL
  🚀 Campusia API Server running on port 5000
```

---

## 🔍 How to Check Current Environment

### Option 1: Render Dashboard
1. Vào Backend Service
2. Tab "Environment"
3. Xem danh sách variables

### Option 2: Backend Logs
Khi backend start, nó sẽ log:
- ✅ = Variable set correctly
- ❌ = Variable missing
- ⚠️ = Variable optional

---

## ✅ Completion Checklist

**Before starting:**
- [ ] Có PostgreSQL database trên Render
- [ ] Có Cloudinary account
- [ ] Có backend service trên Render

**Setup DATABASE_URL:**
- [ ] Found PostgreSQL database on Render
- [ ] Copied "Internal Database URL"
- [ ] Added `DATABASE_URL` to backend environment
- [ ] Saved changes

**Setup CLOUDINARY_URL:**
- [ ] Logged into Cloudinary Dashboard
- [ ] Copied "API Environment variable"
- [ ] Added `CLOUDINARY_URL` to backend environment
- [ ] Saved changes

**Setup CORS_ORIGIN (optional):**
- [ ] Added `CORS_ORIGIN = https://campusia.online`
- [ ] Saved changes

**Verification:**
- [ ] Render auto-deployed backend
- [ ] Checked logs → See PostgreSQL connected
- [ ] Checked logs → See Cloudinary configured
- [ ] Tested health endpoint: `https://your-backend.onrender.com/health`
- [ ] Tested frontend: `https://campusia.online`
- [ ] Can login admin
- [ ] Can create event
- [ ] Images upload to Cloudinary

---

## 🆘 If Still Errors

### Error: DATABASE_URL is not set
→ Bạn chưa add DATABASE_URL. Làm lại Step 1-2.

### Error: Cloudinary upload failed
→ CLOUDINARY_URL sai hoặc chưa có. Check Cloudinary Dashboard.

### Error: CORS policy
→ Add CORS_ORIGIN environment variable.

### Database connection failed
→ DATABASE_URL sai format hoặc database chưa ready.

---

## 📊 Final Environment Variables Summary

| Variable | Status | Required | Where to Get |
|----------|--------|----------|--------------|
| `DATABASE_URL` | ❌ MISSING | ✅ YES | PostgreSQL database → Info tab |
| `CLOUDINARY_URL` | ✅ Should exist | ✅ YES | Cloudinary Dashboard |
| `CORS_ORIGIN` | ⚠️ Recommended | 🔵 Optional | `https://campusia.online` |
| `ADMIN_PASSWORD` | 🔵 Optional | ❌ No | Custom password (default: `campusia@12345`) |
| `PORT` | ✅ Auto | ℹ️ Auto | Render sets automatically |
| `NODE_ENV` | ✅ Auto | ℹ️ Auto | Render sets to `production` |

---

**🚀 HÃY SETUP DATABASE_URL NGAY BÂY GIỜ để backend chạy được!**

**Tóm tắt:**
1. Render → PostgreSQL Database → Copy DATABASE_URL
2. Render → Backend Service → Environment → Add DATABASE_URL
3. Save → Auto-deploy → ✅ Done!
