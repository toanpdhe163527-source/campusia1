# 🖼️ Cloudinary Setup - Giải quyết vấn đề mất ảnh khi Render restart

## ❌ Vấn đề
- Backend PostgreSQL đã giải quyết vấn đề mất **dữ liệu text** (events, admins)
- Nhưng **ảnh vẫn bị mất** vì lưu trong `/uploads` folder (ephemeral storage)
- Khi Render restart container → toàn bộ file trong `/uploads` bị xóa

## ✅ Giải pháp: Cloudinary Cloud Storage

Cloudinary là dịch vụ lưu trữ ảnh trên cloud (free tier 25GB):
- ✅ Ảnh được lưu persistent (không bị mất khi restart)
- ✅ CDN tốc độ cao
- ✅ Free tier generous
- ✅ Dễ integrate

---

## 📋 Hướng dẫn setup (5 phút)

### Bước 1: Tạo tài khoản Cloudinary (Miễn phí)

1. Truy cập: **https://cloudinary.com/users/register_free**
2. Sign up (dùng email hoặc Google)
3. Verify email
4. Đăng nhập vào Dashboard

### Bước 2: Lấy CLOUDINARY_URL

1. Vào **Dashboard** → https://console.cloudinary.com/
2. Tìm phần **"Account Details"**
3. Copy **"API Environment variable"**:
   ```
   CLOUDINARY_URL=cloudinary://123456789012345:AbCdEfGhIjKlMnOpQrStUvWxYz@your-cloud-name
   ```

### Bước 3: Add vào Render Backend Service

#### 3.1. Vào Render Dashboard
- Truy cập: **https://dashboard.render.com/**
- Click vào **Backend service** của bạn (campusia-backend)

#### 3.2. Add Environment Variable
- Click tab **"Environment"** bên trái
- Click **"Add Environment Variable"**
- Thêm:
  - **Key**: `CLOUDINARY_URL`
  - **Value**: Paste chuỗi `cloudinary://...` từ bước 2
- Click **"Save Changes"**

#### 3.3. Deploy lại
Backend sẽ tự động deploy lại sau khi thêm environment variable.

---

## ✅ Kiểm tra hoạt động

### 1. Check Backend Logs
Sau khi deploy xong, vào **Logs** tab, bạn sẽ thấy:
```
✅ Cloudinary configured via CLOUDINARY_URL
🚀 Campusia API Server running on port 5000
💾 Storage: PostgreSQL Database
```

### 2. Test Upload ảnh
1. Đăng nhập Admin
2. Tạo event mới với ảnh
3. Submit
4. Check ảnh có hiển thị không
5. **Trigger manual deploy** hoặc đợi Render restart
6. Kiểm tra lại → ảnh vẫn còn! 🎉

### 3. Xem ảnh trên Cloudinary
- Vào: https://console.cloudinary.com/console/media_library
- Folder: **campusia-events**
- Tất cả ảnh đã upload sẽ xuất hiện ở đây

---

## 🔄 Migrate ảnh cũ (nếu có)

Nếu bạn đã có ảnh trong `/uploads` folder (trên local hoặc backend tạm):

### Option 1: Upload lại qua Admin Dashboard (Khuyến nghị)
1. Đăng nhập Admin
2. Edit từng event
3. Upload lại ảnh
4. Save

### Option 2: Upload manual lên Cloudinary
1. Vào Cloudinary Dashboard
2. Media Library → Upload
3. Chọn folder **campusia-events**
4. Upload ảnh
5. Copy URL và update vào database

---

## 🎯 Hoàn thành!

Từ giờ:
- ✅ **Database (PostgreSQL)**: Lưu dữ liệu events, admins → persistent
- ✅ **Images (Cloudinary)**: Lưu ảnh → persistent
- ✅ **Không còn mất dữ liệu** khi Render restart!

---

## 🆘 Troubleshooting

### Lỗi: "CLOUDINARY_URL environment variable is not configured"

**Nguyên nhân**: Chưa thêm CLOUDINARY_URL vào Render environment variables

**Giải pháp**:
1. Vào Render Dashboard → Backend service
2. Tab "Environment"
3. Add `CLOUDINARY_URL` với value từ Cloudinary Dashboard
4. Save và đợi redeploy

### Ảnh upload bị lỗi 401/403

**Nguyên nhân**: CLOUDINARY_URL sai hoặc expired

**Giải pháp**:
1. Vào Cloudinary Dashboard
2. Copy lại CLOUDINARY_URL mới
3. Update trên Render
4. Redeploy

### Ảnh cũ (trước khi setup Cloudinary) vẫn bị mất

**Nguyên nhân**: Ảnh cũ vẫn lưu trong `/uploads` ephemeral storage

**Giải pháp**: Upload lại ảnh (xem section "Migrate ảnh cũ" ở trên)

---

## 📊 Cloudinary Free Tier Limits

- ✅ **25 GB** storage
- ✅ **25 GB** bandwidth/month
- ✅ **25 credits/month** (transformations)
- ✅ Unlimited uploads

**→ Đủ cho hàng ngàn events!**

---

## 🚀 Next Steps

1. ✅ Setup Cloudinary (làm theo hướng dẫn trên)
2. ✅ Test upload ảnh mới
3. ✅ Upload lại ảnh cũ (nếu cần)
4. ✅ Verify không còn mất ảnh sau restart

---

## 📝 Technical Notes

### Code changes đã được implement:

1. **Package**: Added `cloudinary@^1.41.0` to dependencies
2. **Config**: `/backend/src/config/cloudinary.js` - Cloudinary setup
3. **Routes**: `/backend/src/routes/events.js` - Upload to Cloudinary thay vì disk
4. **Server**: Deprecated `/uploads` static folder (legacy support only)

### Cách hoạt động:

```javascript
// Trước (mất ảnh khi restart):
saveBase64Image(image) → /uploads/abc123.jpg → Ephemeral storage ❌

// Sau (persistent):
uploadBase64Image(image) → Cloudinary CDN → https://res.cloudinary.com/... ✅
```

---

**Tạo bởi**: Campusia Development Team  
**Cập nhật**: {{ current_date }}
