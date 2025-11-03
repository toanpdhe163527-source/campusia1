# 🚀 Deploy Cloudinary Migration - HOÀN THÀNH ✅

## ✅ Đã hoàn thành

Backend code đã được migrate hoàn toàn để sử dụng **Cloudinary** thay vì lưu ảnh trong `/uploads` folder:

- ✅ Added `cloudinary` package to dependencies
- ✅ Created `/backend/src/config/cloudinary.js` - Cloudinary integration  
- ✅ Updated `/backend/src/routes/events.js` - POST route upload to Cloudinary
- ✅ **NEW:** Updated PUT route - Edit event cũng upload to Cloudinary
- ✅ Updated `/utils/api.ts` - Frontend API tương thích với Cloudinary
- ✅ Deprecated `/uploads` static folder (legacy support only)

---

## 📋 BẠN CẦN LÀM GÌ BÂY GIỜ? (3 bước - 5 phút)

### Bước 1: Setup Cloudinary Account (2 phút)

1. **Đăng ký miễn phí**: https://cloudinary.com/users/register_free
2. Verify email và đăng nhập
3. Vào **Dashboard**: https://console.cloudinary.com/
4. Copy **"API Environment variable"**:
   ```
   CLOUDINARY_URL=cloudinary://123456789012345:AbCdEfGhIjKlMnOpQrStUvWxYz@your-cloud-name
   ```

### Bước 2: Add Environment Variable to Render (2 phút)

1. Vào **Render Dashboard**: https://dashboard.render.com/
2. Click vào **backend service** của bạn
3. Tab **"Environment"** → **"Add Environment Variable"**
4. Add:
   - **Key**: `CLOUDINARY_URL`
   - **Value**: Paste chuỗi từ Cloudinary Dashboard
5. Click **"Save Changes"**

### Bước 3: Deploy Backend (1 phút)

#### Option A: Auto Deploy (Khuyến nghị)

Backend sẽ tự động deploy sau khi save environment variable.

#### Option B: Manual Deploy

1. Vào tab **"Manual Deploy"**
2. Click **"Deploy latest commit"**

---

## ✅ Verify Deployment

### 1. Check Logs

Sau khi deploy xong, vào **Logs** tab, bạn sẽ thấy:

```
✅ Cloudinary configured via CLOUDINARY_URL
⚠️ Note: /uploads directory is for legacy images only. New images use Cloudinary.
🚀 Campusia API Server running on port 5000
💾 Storage: PostgreSQL Database
```

### 2. Test Upload

1. Vào website: **https://campusia.online**
2. Login Admin (mật khẩu: `campusia@12345`)
3. Tạo event mới với ảnh
4. Submit
5. Kiểm tra ảnh hiển thị
6. Vào Cloudinary Dashboard → Media Library → folder **campusia-events**
7. Ảnh sẽ xuất hiện ở đây!

### 3. Test Persistence

1. Vào Render Dashboard → backend service
2. Tab **"Manual Deploy"** → **"Deploy latest commit"** (để trigger restart)
3. Đợi deploy xong
4. Vào lại website → Ảnh vẫn còn! 🎉

---

## 🎯 Kết quả

Sau khi setup xong:

- ✅ **Database**: PostgreSQL (persistent) → Events, admins data không bị mất
- ✅ **Images**: Cloudinary (persistent) → Ảnh không bị mất
- ✅ **Không còn lo restart!**

---

## 🆘 Nếu gặp lỗi

### Lỗi: "CLOUDINARY_URL environment variable is not configured"

→ Bạn chưa thêm CLOUDINARY_URL vào Render environment variables (làm lại Bước 2)

### Lỗi: Upload ảnh bị fail

→ CLOUDINARY_URL sai format. Đảm bảo copy đúng từ Cloudinary Dashboard (phải có dạng `cloudinary://...`)

### Ảnh cũ (trước khi setup) vẫn bị mất

→ Đúng rồi! Ảnh cũ vẫn lưu trong `/uploads` ephemeral storage. Bạn cần upload lại ảnh cho các events cũ.

---

## 📚 Tài liệu đầy đủ

Xem chi tiết hơn tại: **/CLOUDINARY_SETUP.md**

---

**🚀 HÃY LÀM NGAY BÂY GIỜ để không còn mất ảnh!**
