# 🚀 Campusia Backend API

Backend API cho hệ thống quản lý sự kiện Campusia, sử dụng **PostgreSQL Database**.

---

## ✨ Tính năng

- ✅ **PostgreSQL Database** - Dữ liệu persistent, không bao giờ mất
- ✅ **Authentication với JWT** - Bảo mật admin dashboard
- ✅ **CRUD operations cho Events** - Quản lý sự kiện đầy đủ
- ✅ **Upload và serve images** - Base64 và URL support
- ✅ **Auto-initialize database** - Setup tables tự động
- ✅ **CORS configuration** - Tích hợp frontend seamless
- ✅ **Production-ready** - Deploy trên Render

---

## 📋 Yêu cầu

- Node.js >= 14.0.0
- npm >= 6.0.0
- PostgreSQL database (Render Free tier hoặc local)

---

## 🔧 Cài đặt

### **Local Development:**

```bash
# 1. Clone repository và vào thư mục backend
cd backend

# 2. Cài đặt dependencies
npm install

# 3. Tạo file .env
cp .env.example .env

# 4. Chỉnh sửa .env với PostgreSQL connection
nano .env
```

### **File `.env` cần có:**

```env
DATABASE_URL=postgresql://username:password@localhost:5432/campusia_events
PORT=5000
NODE_ENV=development
JWT_SECRET=your-secret-key
ADMIN_PASSWORD=campusia@12345
CORS_ORIGIN=http://localhost:5173
```

---

## ▶️ Chạy Server

### **Development:**
```bash
npm run dev
```

### **Production:**
```bash
npm start
```

Server chạy tại: `http://localhost:5000`

---

## 🗄️ Database Setup

### **Option 1: Render PostgreSQL (Khuyến nghị cho production)**

Xem hướng dẫn chi tiết trong: **`POSTGRESQL_MIGRATION.md`**

**TL;DR:**
1. Tạo PostgreSQL database trên Render
2. Copy "Internal Database URL"
3. Add vào environment variable `DATABASE_URL`
4. Database tự động initialize khi server start

### **Option 2: Local PostgreSQL**

```bash
# Install PostgreSQL
# macOS: brew install postgresql
# Ubuntu: sudo apt-get install postgresql

# Create database
createdb campusia_events

# Update .env
DATABASE_URL=postgresql://localhost:5432/campusia_events
```

### **Seed Sample Data (Optional):**

```bash
npm run seed
```

Lệnh này sẽ tạo 5 sự kiện mẫu trong database.

---

## 📡 API Endpoints

### **Health Check**
- `GET /health` - Kiểm tra trạng thái server và database

### **Authentication**
- `POST /api/auth/login` - Đăng nhập admin
  ```json
  { "password": "campusia@12345" }
  ```
- `GET /api/auth/verify` - Xác thực JWT token
- `POST /api/auth/change-password` - Đổi mật khẩu (requires auth)

### **Events**
- `GET /api/events` - Lấy tất cả sự kiện
- `GET /api/events/:id` - Lấy chi tiết sự kiện
- `GET /api/events/type/:eventType` - Lấy sự kiện theo loại (CLB/Workshop/Exe)
- `GET /api/events/featured/list` - Lấy sự kiện nổi bật
- `POST /api/events` - Tạo sự kiện mới (requires auth)
- `PUT /api/events/:id` - Cập nhật sự kiện (requires auth)
- `DELETE /api/events/:id` - Xóa sự kiện (requires auth)
- `POST /api/events/:id/toggle-featured` - Toggle featured status (requires auth)

---

## 📁 Cấu trúc thư mục

```
backend/
├── src/
│   ├── config/
│   │   └── db.js              # PostgreSQL connection & initialization
│   ├── models/
│   │   ├── Event.js           # Event model (PostgreSQL)
│   │   └── Admin.js           # Admin model (PostgreSQL)
│   ├── routes/
│   │   ├── events.js          # Event routes
│   │   └── auth.js            # Auth routes
│   ├── middleware/
│   │   ├── auth.js            # JWT middleware
│   │   └── upload.js          # Image upload middleware
│   ├── scripts/
│   │   └── seed-database.js   # Sample data seeder
│   └── server.js              # Main server file
├── uploads/                    # Uploaded images (auto-generated)
├── .env.example               # Environment variables template
├── package.json
└── README.md
```

---

## 🗃️ Database Schema

### **Events Table:**
```sql
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
```

### **Admin Table:**
```sql
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

## 🔐 Default Admin

- **Username:** `admin`
- **Password:** `campusia@12345` (hoặc theo `ADMIN_PASSWORD` trong .env)

Admin account được tự động tạo khi database khởi tạo lần đầu.

---

## 🌐 CORS Configuration

Backend đã được cấu hình CORS để kết nối với:
- `https://campusia.online` (Production frontend)
- Hoặc domain được chỉ định trong `CORS_ORIGIN`/`FRONTEND_URL`

---

## 🚀 Deployment trên Render

### **Quick Steps:**

1. **Push code lên GitHub**
2. **Tạo PostgreSQL database** trên Render
3. **Add DATABASE_URL** vào Backend environment
4. **Deploy backend**

**Chi tiết:** Xem file **`QUICK_START_POSTGRESQL.md`**

---

## 🐛 Troubleshooting

### **Error: "DATABASE_URL is not set"**
➡️ Check file `.env` hoặc Render environment variables

### **Error: "Connection refused"**
➡️ PostgreSQL chưa sẵn sàng, đợi vài phút

### **Error: "Cannot find module 'pg'"**
➡️ Chạy `npm install` hoặc push code lên GitHub (cho Render)

---

## 📊 Database Management

### **Xem dữ liệu:**

Trên Render PostgreSQL service → Tab "Shell":

```sql
-- Xem tất cả events
SELECT id, title, event_type, featured FROM events;

-- Đếm số events
SELECT COUNT(*) FROM events;

-- Xem featured events
SELECT title FROM events WHERE featured = true;
```

### **Backup:**

Render Free tier tự động backup hàng ngày. Manual backup:
1. PostgreSQL service → Tab "Backups"
2. Click "Create Backup"

---

## 📚 Tài liệu bổ sung

- **`POSTGRESQL_MIGRATION.md`** - Chi tiết migration từ JSON sang PostgreSQL
- **`QUICK_START_POSTGRESQL.md`** - Hướng dẫn nhanh deploy
- **`.env.example`** - Environment variables mẫu

---

## 🎉 Benefits của PostgreSQL

| Trước (JSON) | Sau (PostgreSQL) |
|-------------|------------------|
| ❌ Data mất khi restart | ✅ Persistent storage |
| ❌ Không backup | ✅ Auto-backup |
| ❌ Không scale | ✅ Scalable |
| ❌ Concurrent issues | ✅ ACID transactions |

---

## 📄 License

MIT

---

Made with ❤️ in Vietnam
