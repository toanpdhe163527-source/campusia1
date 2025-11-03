# 🐘 PostgreSQL Migration Guide - Campusia Backend

## ✅ HOÀN TẤT! Code đã được migrate sang PostgreSQL

Backend của bạn đã được **hoàn toàn chuyển đổi** từ JSON storage sang PostgreSQL Database. Dữ liệu sẽ **KHÔNG BAO GIỜ MẤT** khi Render restart!

---

## 📋 NHỮNG GÌ ĐÃ THAY ĐỔI

### ✅ **Backend Code:**
- ✅ Added `pg` (PostgreSQL client) dependency
- ✅ Created `/backend/src/config/db.js` - Database connection module
- ✅ Updated `/backend/src/models/Event.js` - PostgreSQL queries
- ✅ Updated `/backend/src/models/Admin.js` - PostgreSQL queries  
- ✅ Updated `/backend/src/server.js` - Auto-initialize database on startup
- ✅ Updated all routes to use async/await with database

### ✅ **Database Schema:**
```sql
-- Events Table
CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  subtitle TEXT,
  description TEXT NOT NULL,
  date VARCHAR(50) NOT NULL,
  time VARCHAR(50) NOT NULL,
  location VARCHAR(255) NOT NULL,
  venue VARCHAR(255) NOT NULL,
  image TEXT,
  images TEXT[],
  category VARCHAR(50) NOT NULL,
  event_type VARCHAR(50) NOT NULL,
  organizer VARCHAR(255) NOT NULL,
  rating NUMERIC(2, 1) DEFAULT 4.5,
  attendees INTEGER DEFAULT 0,
  highlights TEXT[],
  registration_url TEXT NOT NULL,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admin Table
CREATE TABLE admin (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🚀 RENDER DEPLOYMENT - 5 BƯỚC (15 PHÚT)

### **📍 BƯỚC 1: Tạo PostgreSQL Database (5 phút)**

1. Đăng nhập: https://dashboard.render.com/
2. Click nút **"New +"** (góc phải trên)
3. Chọn **"PostgreSQL"**
4. Điền thông tin:
   ```
   Name:         campusia-db
   Database:     campusia_events
   User:         campusiauser
   Region:       Singapore (hoặc gần bạn nhất)
   Plan:         Free (0$/month)
   ```
5. Click **"Create Database"**
6. **ĐỢI 2-3 PHÚT** để database khởi tạo
7. Sau khi "Available", click vào database name **"campusia-db"**
8. Tìm section **"Connections"**
9. **COPY** giá trị của **"Internal Database URL"** (Quan trọng!)
   - Ví dụ: `postgresql://campusiauser:***@dpg-xyz/campusia_events`

---

### **📍 BƯỚC 2: Add DATABASE_URL vào Backend (3 phút)**

1. Vẫn ở Render Dashboard
2. Trong menu bên trái, click **"Dashboard"** hoặc **"Services"**
3. Tìm và click vào **Backend Web Service**
   - Tên có thể là: `campusia1-backend`, `campusia-backend`, etc.
4. Click tab **"Environment"** (bên trái)
5. Click **"Add Environment Variable"**
6. Nhập CHÍNH XÁC:
   ```
   Key:   DATABASE_URL
   Value: [PASTE Internal Database URL từ bước 1]
   ```
   ⚠️ **QUAN TRỌNG:**
   - Paste CHÍNH XÁC URL từ bước 1
   - Phải là **"Internal Database URL"** (không phải External)
   - Bắt đầu bằng `postgresql://`
   - Không thêm khoảng trắng

7. Click **"Save Changes"**

---

### **📍 BƯỚC 3: Update Backend Dependencies (2 phút)**

Backend code đã được update, nhưng cần install `pg` package trên server.

**QUAN TRỌNG:** Bạn cần commit và push code mới lên GitHub:

```bash
# Trong terminal, ở thư mục dự án:
cd backend
git add .
git commit -m "Migrate to PostgreSQL database"
git push origin main
```

Render sẽ tự động detect changes và redeploy.

---

### **📍 BƯỚC 4: Trigger Manual Deploy (3 phút)**

1. Vẫn ở trang Backend Web Service
2. Tab **"Manual Deploy"** (góc phải)
3. Chọn **"Clear build cache & deploy"**
4. Click **"Deploy"**
5. Đợi 3-5 phút
6. Xem tab **"Logs"** - Tìm các dòng sau:

   **✅ SUCCESS LOGS:**
   ```
   🔄 Initializing database tables...
   ✅ Events table ready
   ✅ Admin table ready
   ✅ Default admin created
   ✅ Database initialization complete!
   ✅ Database ready
   🚀 Campusia API Server running on port 10000
   💾 Storage: PostgreSQL Database
   ```

   **❌ ERROR LOGS (nếu có):**
   ```
   ❌ DATABASE_URL is not set!
   → Quay lại Bước 2, check environment variable
   
   ❌ Connection refused
   → Database chưa ready, đợi 2 phút rồi deploy lại
   ```

---

### **📍 BƯỚC 5: Verify Database Working (2 phút)**

1. Mở browser
2. Vào: `https://YOUR-BACKEND-NAME.onrender.com/health`
   - Thay `YOUR-BACKEND-NAME` bằng tên backend thực tế
3. Check response:

   **✅ EXPECTED RESPONSE:**
   ```json
   {
     "status": "ok",
     "timestamp": "2025-01-XX...",
     "uptime": 123.45,
     "storage": "PostgreSQL Database",
     "database": "Connected"
   }
   ```

4. Test tạo event:
   - Vào frontend: https://campusia.online
   - Login admin
   - Tạo 1 event mới
   - Refresh page → Event vẫn còn ✅

---

## 🔍 TROUBLESHOOTING

### ❌ **Error: "DATABASE_URL is not set"**
**Fix:**
- Check Bước 2
- Verify environment variable tên chính xác: `DATABASE_URL`
- Redeploy backend

### ❌ **Error: "Connection refused" / "ECONNREFUSED"**
**Fix:**
- Database chưa sẵn sàng
- Vào Render Dashboard → PostgreSQL service
- Check status = "Available"
- Đợi 2-3 phút rồi redeploy

### ❌ **Error: "password authentication failed"**
**Fix:**
- DATABASE_URL sai
- Copy lại "Internal Database URL" từ PostgreSQL service
- Paste lại vào environment variable
- Save changes

### ❌ **Backend deploy failed - "Cannot find module 'pg'"**
**Fix:**
- Code chưa được push lên GitHub
- Run:
  ```bash
  cd backend
  git add package.json
  git commit -m "Add pg dependency"
  git push origin main
  ```

---

## ✅ VERIFY MIGRATION SUCCESS

### **Test Checklist:**

- [ ] Backend health check shows: `"storage": "PostgreSQL Database"`
- [ ] Backend health check shows: `"database": "Connected"`
- [ ] Login admin works
- [ ] Tạo event mới works
- [ ] Event hiển thị trên trang chủ
- [ ] **CRITICAL:** Trigger manual deploy backend → Events KHÔNG MẤT ✅

---

## 💡 MIGRATION BENEFITS

### **Trước đây (JSON Storage):**
❌ Dữ liệu mất mỗi khi Render restart  
❌ Không scale được  
❌ Không có backup  
❌ Concurrent writes có thể corrupt data

### **Bây giờ (PostgreSQL):**
✅ Dữ liệu PERMANENT - không bao giờ mất  
✅ Auto-backup mỗi ngày (Render Free tier)  
✅ Scale được khi cần  
✅ ACID transactions  
✅ Production-ready  

---

## 📊 DATABASE MANAGEMENT

### **Xem dữ liệu trong Database:**

1. Vào Render Dashboard
2. Click vào PostgreSQL service **"campusia-db"**
3. Click tab **"Shell"** (bên trái)
4. Chạy các lệnh SQL:

```sql
-- Xem tất cả events
SELECT id, title, event_type, featured FROM events;

-- Xem số lượng events
SELECT COUNT(*) FROM events;

-- Xem featured events
SELECT title, event_type FROM events WHERE featured = true;

-- Xem admin info
SELECT username, last_login FROM admin;
```

### **Backup Database (Manual):**

1. Vào PostgreSQL service
2. Tab **"Backups"**
3. Click **"Create Backup"**
4. Download `.sql` file

---

## 🎉 DONE!

Bạn đã hoàn tất migration! Database của bạn giờ là:
- ✅ Persistent (không mất data)
- ✅ Scalable (có thể mở rộng)
- ✅ Production-ready
- ✅ Auto-backup

**Next Steps:**
1. Test toàn bộ chức năng
2. Migrate dữ liệu cũ (nếu có)
3. Setup monitoring
4. Enjoy! 🎊
