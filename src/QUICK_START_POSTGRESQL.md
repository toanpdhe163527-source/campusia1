# ⚡ Quick Start - PostgreSQL Migration

## 🎯 TÓM TẮT NGẮN GỌN (3 phút đọc)

Backend đã được migrate sang **PostgreSQL**. Bạn cần làm **5 việc đơn giản** trên Render Dashboard.

---

## 📋 CHECKLIST 5 BƯỚC (15 PHÚT)

### ✅ **BƯỚC 1: Push Code Lên GitHub** (2 phút)

```bash
# Trong terminal, ở thư mục dự án:
git add .
git commit -m "Migrate backend to PostgreSQL"
git push origin main
```

### ✅ **BƯỚC 2: Tạo PostgreSQL Database** (5 phút)

1. Vào: https://dashboard.render.com/
2. Click **"New +"** → **"PostgreSQL"**
3. Settings:
   - Name: `campusia-db`
   - Database: `campusia_events`
   - Region: Singapore
   - Plan: **Free**
4. Click **"Create Database"**
5. Đợi 2-3 phút cho status = "Available"
6. Click vào database → Tab "Connections"
7. **COPY** giá trị **"Internal Database URL"**

### ✅ **BƯỚC 3: Add DATABASE_URL vào Backend** (3 phút)

1. Render Dashboard → Services
2. Click vào **Backend Web Service**
3. Tab **"Environment"**
4. Click **"Add Environment Variable"**
   ```
   Key:   DATABASE_URL
   Value: [PASTE Internal Database URL từ bước 2]
   ```
5. Click **"Save Changes"**

### ✅ **BƯỚC 4: Redeploy Backend** (3 phút)

1. Vẫn ở Backend service page
2. Tab **"Manual Deploy"** (góc phải)
3. Chọn **"Clear build cache & deploy"**
4. Đợi 3-5 phút

### ✅ **BƯỚC 5: Verify** (2 phút)

1. Vào: `https://YOUR-BACKEND-NAME.onrender.com/health`
2. Check response có:
   ```json
   "storage": "PostgreSQL Database",
   "database": "Connected"
   ```

✅ **DONE!** Database của bạn giờ không bao giờ mất data!

---

## 🐛 TROUBLESHOOTING NHANH

| Lỗi | Fix |
|-----|-----|
| `DATABASE_URL is not set` | Quay lại Bước 3, check env variable |
| `Connection refused` | Database chưa ready, đợi 2 phút |
| `Cannot find module 'pg'` | Quay lại Bước 1, push code lên GitHub |
| Backend deploy failed | Check Logs tab, xem lỗi cụ thể |

---

## 📚 CHI TIẾT ĐẦY ĐỦ

Xem file: **`POSTGRESQL_MIGRATION.md`** để hiểu chi tiết hơn.

---

## 🎉 BENEFITS

- ✅ Dữ liệu PERMANENT (không mất khi restart)
- ✅ Auto-backup hàng ngày
- ✅ Production-ready
- ✅ Free tier support 1GB storage
