# 💻 Local Development Guide

## 🎯 Chạy Backend với PostgreSQL trên máy local

### **Option 1: Dùng Render PostgreSQL (Khuyến nghị)**

**Pros:**
- ✅ Không cần cài PostgreSQL local
- ✅ Dùng chung database với production
- ✅ Test với real data

**Cons:**
- ❌ Cần internet connection
- ❌ Slower response time (network latency)

**Setup:**
```bash
# 1. Tạo PostgreSQL database trên Render (nếu chưa có)
# 2. Copy "Internal Database URL" hoặc "External Database URL"

# 3. Tạo file .env
cd backend
cp .env.example .env

# 4. Edit .env
nano .env

# 5. Paste DATABASE_URL
DATABASE_URL=postgresql://user:pass@host/database

# 6. Install dependencies
npm install

# 7. Run server
npm run dev

# Server runs at: http://localhost:5000
```

---

### **Option 2: PostgreSQL Local**

**Pros:**
- ✅ Faster (no network)
- ✅ Works offline
- ✅ Full control

**Cons:**
- ❌ Cần cài PostgreSQL
- ❌ Setup phức tạp hơn
- ❌ Separate data với production

**Setup:**

#### **macOS:**
```bash
# 1. Install PostgreSQL
brew install postgresql@15
brew services start postgresql@15

# 2. Create database
createdb campusia_events

# 3. Create .env
cd backend
cp .env.example .env

# 4. Update DATABASE_URL
DATABASE_URL=postgresql://localhost:5432/campusia_events

# 5. Install & run
npm install
npm run dev
```

#### **Windows:**
```bash
# 1. Download PostgreSQL installer
# https://www.postgresql.org/download/windows/

# 2. Install PostgreSQL (accept defaults)

# 3. Create database (in pgAdmin or psql)
createdb campusia_events

# 4. Create .env
cd backend
copy .env.example .env

# 5. Update DATABASE_URL (notepad .env)
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/campusia_events

# 6. Install & run
npm install
npm run dev
```

#### **Linux (Ubuntu/Debian):**
```bash
# 1. Install PostgreSQL
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib

# 2. Start service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# 3. Create database
sudo -u postgres createdb campusia_events

# 4. Create .env
cd backend
cp .env.example .env

# 5. Update DATABASE_URL
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/campusia_events

# 6. Install & run
npm install
npm run dev
```

---

## 🧪 Testing

### **1. Health Check:**
```bash
curl http://localhost:5000/health

# Expected response:
{
  "status": "ok",
  "storage": "PostgreSQL Database",
  "database": "Connected"
}
```

### **2. Get Events:**
```bash
curl http://localhost:5000/api/events
```

### **3. Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"password":"campusia@12345"}'

# Save the token from response
```

### **4. Create Event (with auth):**
```bash
TOKEN="YOUR_JWT_TOKEN_HERE"

curl -X POST http://localhost:5000/api/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Test Event",
    "subtitle": "Testing",
    "description": "Test description",
    "date": "2025-03-01",
    "time": "14:00",
    "location": "Hanoi",
    "venue": "Test Venue",
    "category": "Học thuật",
    "eventType": "CLB",
    "organizer": "Test Organizer",
    "registrationUrl": "https://example.com",
    "images": []
  }'
```

---

## 🌱 Seed Sample Data

```bash
# Option 1: Using seed script
npm run seed

# Option 2: Manual SQL
psql $DATABASE_URL < seed.sql
```

---

## 🐛 Troubleshooting

### **Error: "DATABASE_URL is not set"**
```bash
# Check .env file exists
ls -la .env

# Check content
cat .env | grep DATABASE_URL

# Make sure no spaces around =
DATABASE_URL=postgresql://...
```

### **Error: "Connection refused"**
```bash
# Check PostgreSQL is running

# macOS:
brew services list | grep postgresql

# Linux:
sudo systemctl status postgresql

# Windows:
# Check Services app for "PostgreSQL" service
```

### **Error: "password authentication failed"**
```bash
# Check username/password in DATABASE_URL
# Format: postgresql://username:password@host:port/database

# Reset PostgreSQL password (if needed)
# macOS/Linux:
sudo -u postgres psql
ALTER USER postgres PASSWORD 'new_password';
\q
```

### **Error: "database does not exist"**
```bash
# Create database
createdb campusia_events

# Or with psql:
psql -U postgres
CREATE DATABASE campusia_events;
\q
```

---

## 🔧 Development Tips

### **Hot Reload:**
```bash
# Using nodemon (already configured)
npm run dev

# Auto-restart on file changes
```

### **View Database:**
```bash
# Using psql
psql $DATABASE_URL

# Commands:
\dt              # List tables
\d events        # Describe events table
SELECT * FROM events LIMIT 5;
```

### **Clear Database:**
```bash
# Drop all tables
psql $DATABASE_URL -c "DROP TABLE IF EXISTS events, admin CASCADE;"

# Restart server to recreate tables
npm run dev
```

### **Reset Admin Password:**
```bash
# Option 1: Delete admin.json and restart (old)
# Option 2: SQL query (new)
psql $DATABASE_URL -c "
UPDATE admin 
SET password = '\$2a\$10\$your_new_hash'
WHERE username = 'admin';
"

# Or just drop admin table and restart
psql $DATABASE_URL -c "DROP TABLE IF EXISTS admin;"
npm run dev  # Will recreate with default password
```

---

## 📚 Database Tools

### **Recommended:**

1. **pgAdmin** (GUI)
   - Download: https://www.pgadmin.org/
   - Great for visual database management

2. **DBeaver** (GUI)
   - Download: https://dbeaver.io/
   - Cross-platform, free

3. **TablePlus** (GUI - macOS/Windows)
   - Download: https://tableplus.com/
   - Beautiful UI

4. **psql** (CLI)
   - Built-in with PostgreSQL
   - Lightweight, powerful

---

## 🚀 Run with Frontend

### **Full Stack Local:**

```bash
# Terminal 1: Backend
cd backend
npm run dev
# Runs on: http://localhost:5000

# Terminal 2: Frontend
cd ..  # Back to root
npm run dev
# Runs on: http://localhost:5173

# Frontend will connect to backend via VITE_API_URL
# Check .env or vite.config.ts
```

### **Frontend .env:**
```bash
# Create frontend .env (if not exists)
# Root directory (not backend/)
VITE_API_URL=http://localhost:5000
```

---

## 📦 Environment Variables Reference

### **Required:**
```env
DATABASE_URL=postgresql://user:pass@host:port/database
```

### **Optional:**
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=local-dev-secret-key
ADMIN_PASSWORD=campusia@12345
CORS_ORIGIN=http://localhost:5173
FRONTEND_URL=http://localhost:5173
```

---

## ✅ Checklist - Local Setup

- [ ] PostgreSQL installed (or using Render)
- [ ] Database created
- [ ] `.env` file created
- [ ] `DATABASE_URL` configured
- [ ] Dependencies installed (`npm install`)
- [ ] Server starts without errors
- [ ] `/health` returns "Connected"
- [ ] Can login admin
- [ ] Can create events
- [ ] Frontend connects to backend

---

## 🎉 You're Ready!

Local development environment is set up! Happy coding! 🚀

**Next:**
- Make code changes
- Test locally
- Push to GitHub
- Deploy to Render

---

*For production deployment, see: `QUICK_START_POSTGRESQL.md`*
