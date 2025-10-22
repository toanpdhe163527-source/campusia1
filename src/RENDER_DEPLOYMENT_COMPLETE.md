# ✅ Render Deployment - Complete Guide

## 🎯 OVERVIEW

Bạn có **2 services** cần deploy trên Render:

1. **Frontend** (Static Site) - campusia.online
2. **Backend** (Web Service) - API server với PostgreSQL

---

## 📋 DEPLOYMENT CHECKLIST

### **✅ BƯỚC 1: Backend Migration to PostgreSQL**

**Status:** ✅ Code đã migrate xong!

**Action Required:**
1. Push code lên GitHub
2. Setup PostgreSQL database
3. Deploy backend

**Guide:** Xem file `START_HERE_POSTGRESQL.md`

---

### **✅ BƯỚC 2: Frontend Environment Variable**

**Status:** ⚠️ CẦN KIỂM TRA!

**Vấn đề:** Frontend cần biết backend URL qua `VITE_API_URL`

**Check:**
1. Vào: https://dashboard.render.com/
2. Click vào **Frontend Static Site**
3. Tab **"Environment"**
4. Tìm variable: `VITE_API_URL`

**Nếu CHƯA CÓ:**
1. Click **"Add Environment Variable"**
2. Nhập:
   ```
   Key:   VITE_API_URL
   Value: https://YOUR-BACKEND-NAME.onrender.com
   ```
   (Thay `YOUR-BACKEND-NAME` bằng tên backend thực tế)
3. Save changes
4. Tab **"Manual Deploy"** → **"Clear build cache & deploy"**

**Guide:** Xem file `START_HERE_FIX.md` hoặc `FIX_FAILED_TO_FETCH.md`

---

### **✅ BƯỚC 3: Backend CORS Configuration**

**Status:** ⚠️ CẦN KIỂM TRA!

**Vấn đề:** Backend cần cho phép requests từ `campusia.online`

**Check:**
1. Vào Render Dashboard
2. Click vào **Backend Web Service**
3. Tab **"Environment"**
4. Tìm variables: `CORS_ORIGIN` hoặc `FRONTEND_URL`

**Nếu CHƯA CÓ hoặc SAI:**
1. Add/Update:
   ```
   CORS_ORIGIN=https://campusia.online
   FRONTEND_URL=https://campusia.online
   ```
2. Save changes
3. Backend tự động redeploy

**Guide:** Xem file `FIX_CORS_DOMAIN.md`

---

## 🗺️ COMPLETE DEPLOYMENT MAP

```
┌─────────────────────────────────────────────────────────┐
│                    RENDER DASHBOARD                      │
└─────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  PostgreSQL  │  │   Backend    │  │  Frontend    │
│   Database   │  │ Web Service  │  │ Static Site  │
└──────────────┘  └──────────────┘  └──────────────┘
        │                   │                   │
        │                   │                   │
        ▼                   ▼                   ▼
  campusia-db      backend-abc.      campusia.online
                   onrender.com
        │                   │                   │
        │                   │                   │
        └──────CONNECTION────┘                   │
                            │                    │
                            └──API CALLS─────────┘
```

---

## 🔧 ENVIRONMENT VARIABLES CHECKLIST

### **📍 PostgreSQL Database:**
- ✅ No variables needed (auto-configured)

### **📍 Backend Web Service:**
- [ ] `DATABASE_URL` = [Internal Database URL from PostgreSQL]
- [ ] `CORS_ORIGIN` = `https://campusia.online`
- [ ] `FRONTEND_URL` = `https://campusia.online`
- [ ] `JWT_SECRET` = [random secret string]
- [ ] `ADMIN_PASSWORD` = `campusia@12345`
- [ ] `NODE_ENV` = `production`

### **📍 Frontend Static Site:**
- [ ] `VITE_API_URL` = `https://YOUR-BACKEND-NAME.onrender.com`

---

## 🧪 TESTING WORKFLOW

### **1. Test Backend Standalone:**

```bash
# Health check
curl https://YOUR-BACKEND.onrender.com/health

# Expected response:
{
  "status": "ok",
  "storage": "PostgreSQL Database",
  "database": "Connected"
}
```

### **2. Test Frontend → Backend Connection:**

1. Vào: https://campusia.online
2. Mở DevTools (F12) → Console tab
3. Không có lỗi "Failed to fetch" ✅
4. Mở Network tab → Reload page
5. Tìm request `/api/events`
6. Check URL: Should be `https://YOUR-BACKEND.onrender.com/api/events` ✅

### **3. Test Full Flow:**

1. Homepage loads events ✅
2. Login admin works ✅
3. Create event works ✅
4. Event hiển thị ngay ✅
5. Refresh page → Event vẫn còn ✅
6. **CRITICAL:** Trigger manual deploy backend → Events KHÔNG MẤT ✅

---

## ⚠️ COMMON ISSUES

### **❌ "Backend không chạy" banner:**
**Cause:** Frontend không connect được backend  
**Fix:** Check `VITE_API_URL` trong Frontend environment

### **❌ "Failed to fetch" khi login:**
**Cause:** CORS hoặc wrong API URL  
**Fix:** 
1. Check `VITE_API_URL` đúng
2. Check `CORS_ORIGIN` trong Backend
3. Rebuild Frontend

### **❌ "DATABASE_URL is not set":**
**Cause:** Backend chưa có DATABASE_URL  
**Fix:** Add DATABASE_URL vào Backend environment

### **❌ Events mất sau khi restart:**
**Cause:** Backend vẫn dùng JSON storage  
**Fix:** Follow `START_HERE_POSTGRESQL.md` để migrate

---

## 📚 DOCUMENTATION INDEX

### **🔴 Start Here:**
1. `START_HERE_POSTGRESQL.md` - Deploy backend with PostgreSQL
2. `QUICK_START_POSTGRESQL.md` - Quick 5-step guide
3. `START_HERE_FIX.md` - Fix frontend connection

### **🟡 Troubleshooting:**
4. `FIX_FAILED_TO_FETCH.md` - Fix "Failed to fetch" error
5. `FIX_CORS_DOMAIN.md` - Fix CORS issues
6. `POSTGRESQL_MIGRATION.md` - Detailed migration guide

### **🟢 Reference:**
7. `MIGRATION_SUMMARY.md` - What changed in migration
8. `backend/README.md` - Backend documentation
9. `backend/.env.example` - Environment variables template

---

## ✅ FINAL CHECKLIST

### **Pre-Deploy:**
- [ ] Code pushed to GitHub
- [ ] All documentation read

### **Backend:**
- [ ] PostgreSQL database created
- [ ] DATABASE_URL added to backend
- [ ] Backend deployed successfully
- [ ] `/health` shows PostgreSQL connected

### **Frontend:**
- [ ] VITE_API_URL added
- [ ] Frontend rebuilt and deployed
- [ ] No "backend không chạy" banner
- [ ] No console errors

### **Integration:**
- [ ] Homepage loads events
- [ ] Login works
- [ ] Create/delete events works
- [ ] Data persists after restart

---

## 🎉 SUCCESS!

Khi tất cả checkboxes đều ✅:

```
🎊 DEPLOYMENT COMPLETE! 🎊

✅ Frontend: https://campusia.online
✅ Backend: https://YOUR-BACKEND.onrender.com
✅ Database: PostgreSQL (Persistent)
✅ Data: Never lost
✅ Status: Production Ready
```

---

## 🚀 DEPLOY NOW!

**Ready?** Start with:

1. **Backend:** `START_HERE_POSTGRESQL.md`
2. **Frontend:** `START_HERE_FIX.md`
3. **Test:** Follow "Testing Workflow" above

**Total time:** ~30 phút

**Good luck!** 🚀

---

*Generated by Figma Make AI - 2025-10-22*
