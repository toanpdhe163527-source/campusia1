# 🌐 Custom Domain Setup (Optional)

Hướng dẫn setup custom domain cho website Campusia của bạn.

---

## Tổng Quan

Thay vì dùng:
- ❌ `https://campusia.vercel.app`
- ❌ `https://campusia-backend.onrender.com`

Bạn sẽ có:
- ✅ `https://campusia.com` (hoặc domain của bạn)
- ✅ `https://api.campusia.com`

---

## 📋 Yêu Cầu

1. **Domain name** đã mua (từ Namecheap, GoDaddy, Google Domains, etc.)
2. Website đã deploy thành công trên Vercel + Render
3. Quyền truy cập DNS settings của domain

**Chi phí:** 
- Domain: ~$10-15/năm
- Vercel custom domain: **FREE**
- Render custom domain: **FREE**

---

## 🎯 Setup Frontend Domain (Vercel)

### Bước 1: Thêm Domain Vào Vercel

1. Truy cập Vercel Dashboard
2. Chọn project **campusia**
3. Vào tab **Settings** → **Domains**
4. Nhập domain của bạn: `campusia.com`
5. Click **Add**

### Bước 2: Cấu Hình DNS

Vercel sẽ yêu cầu bạn thêm DNS records:

**Option A: Apex Domain (campusia.com)**

Thêm **A Record**:
```
Type: A
Name: @ (or leave blank)
Value: 76.76.21.21
TTL: Auto or 3600
```

**Option B: Subdomain (www.campusia.com)**

Thêm **CNAME Record**:
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: Auto or 3600
```

### Bước 3: Verify & SSL

1. Đợi DNS propagate (5-30 phút)
2. Vercel tự động issue SSL certificate (miễn phí)
3. Domain của bạn sẽ có HTTPS tự động!

---

## 🔌 Setup Backend Domain (Render)

### Bước 1: Thêm Custom Domain

1. Truy cập Render Dashboard
2. Chọn service **campusia-backend**
3. Vào tab **Settings** → **Custom Domains**
4. Click **Add Custom Domain**
5. Nhập: `api.campusia.com`
6. Click **Save**

### Bước 2: Cấu Hình DNS

Thêm **CNAME Record** trong DNS provider:

```
Type: CNAME
Name: api
Value: campusia-backend.onrender.com
TTL: Auto or 3600
```

### Bước 3: Verify & SSL

1. Đợi DNS propagate (5-30 phút)
2. Render tự động issue SSL certificate
3. Backend sẽ available tại `https://api.campusia.com`

---

## 🔧 Cập Nhật Environment Variables

### Update Frontend (Vercel)

1. Vào Vercel → **Settings** → **Environment Variables**
2. Update `VITE_API_URL`:
   ```
   Old: https://campusia-backend.onrender.com
   New: https://api.campusia.com
   ```
3. Click **Save**
4. Redeploy frontend

### Update Backend (Render)

1. Vào Render → **Environment**
2. Update `FRONTEND_URL`:
   ```
   Old: https://campusia.vercel.app
   New: https://campusia.com
   ```
3. Click **Save Changes**
4. Đợi auto-redeploy

---

## ✅ Verify Setup

1. **Test Frontend:**
   - Truy cập `https://campusia.com`
   - Trang chủ load bình thường ✅

2. **Test Backend:**
   - Truy cập `https://api.campusia.com/health`
   - Thấy `{"status":"ok"}` ✅

3. **Test CORS:**
   - Đăng nhập admin
   - Tạo event mới
   - Không có CORS errors ✅

---

## 🎨 Subdomain Strategy

### Khuyến nghị setup:

```
campusia.com          → Frontend (Vercel)
www.campusia.com      → Redirect to campusia.com
api.campusia.com      → Backend (Render)
admin.campusia.com    → Admin panel (optional)
```

### Setup Redirect (www → non-www)

**Trong DNS:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

**Trong Vercel:**
- Thêm cả 2 domains: `campusia.com` và `www.campusia.com`
- Set `campusia.com` là **Primary Domain**
- Vercel sẽ tự động redirect `www` → non-www

---

## 🐛 Troubleshooting

### DNS chưa propagate

**Problem:** Domain không load

**Solution:**
1. Đợi 5-30 phút (thường < 10 phút)
2. Check DNS với: https://dnschecker.org
3. Clear browser cache: `Ctrl+Shift+Delete`

### SSL certificate pending

**Problem:** "Not Secure" warning

**Solution:**
1. Đợi 5-10 phút để Vercel/Render issue cert
2. Force HTTPS trong settings
3. Clear browser cache

### CORS errors sau khi đổi domain

**Problem:** "CORS policy error"

**Solution:**
1. Check `FRONTEND_URL` trong Render environment
2. Phải là `https://campusia.com` (không có trailing slash)
3. Redeploy backend

### Mixed content (HTTP/HTTPS)

**Problem:** Some assets load over HTTP

**Solution:**
1. Check all API calls use `https://`
2. Update `VITE_API_URL` với `https://`
3. Force HTTPS trong production

---

## 💰 Cost Breakdown

### Development
```
Domain: $0 (chưa cần)
Vercel: $0 (free tier)
Render: $0 (free tier)
-----------------
Total: $0/month
```

### Production with Custom Domain
```
Domain: ~$1/month ($12/year)
Vercel: $0 (custom domain free!)
Render: $7/month (Starter plan)
-----------------
Total: ~$8/month
```

---

## 📊 DNS Records Summary

Tất cả records bạn cần thêm:

```
# Frontend (campusia.com)
Type: A
Name: @
Value: 76.76.21.21

# Frontend www redirect
Type: CNAME
Name: www
Value: cname.vercel-dns.com

# Backend API
Type: CNAME
Name: api
Value: campusia-backend.onrender.com
```

---

## 🔐 Email Setup (Bonus)

Nếu muốn email `admin@campusia.com`:

### Option 1: Google Workspace
- $6/user/month
- Professional email + Drive + Meet

### Option 2: Zoho Mail (Free)
- Free tier: 5 users
- 5GB storage/user
- Setup: https://www.zoho.com/mail/

### Option 3: Cloudflare Email Routing (Free)
- Miễn phí hoàn toàn
- Chỉ forward email (không có inbox)
- Setup: Cloudflare Dashboard → Email Routing

---

## 🌟 Best Practices

### 1. Always Use HTTPS
```javascript
// In production config
if (window.location.protocol === 'http:') {
  window.location.href = window.location.href.replace('http:', 'https:')
}
```

### 2. Environment-based URLs
```javascript
// utils/api.ts
const getApiUrl = () => {
  if (import.meta.env.PROD) {
    return 'https://api.campusia.com/api'
  }
  return 'http://localhost:5000/api'
}
```

### 3. CDN for Static Assets
- Use Vercel's built-in CDN (automatic)
- Or Cloudflare CDN (free tier available)

### 4. Monitoring
- Setup UptimeRobot (miễn phí) để monitor uptime
- Ping `https://api.campusia.com/health` mỗi 5 phút

---

## 📝 Checklist

- [ ] Domain đã mua
- [ ] DNS records đã thêm
- [ ] Vercel domain đã verify
- [ ] Render domain đã verify
- [ ] SSL certificates đã issue
- [ ] Environment variables đã update
- [ ] Frontend redeploy thành công
- [ ] Backend redeploy thành công
- [ ] Test trên custom domain
- [ ] CORS working
- [ ] Login/Admin working
- [ ] Images loading

---

## 🎉 Done!

Website của bạn giờ đã có domain chuyên nghiệp!

**Before:**
- https://campusia.vercel.app

**After:**
- https://campusia.com
- https://api.campusia.com

---

## 📚 References

- [Vercel Custom Domains](https://vercel.com/docs/concepts/projects/custom-domains)
- [Render Custom Domains](https://render.com/docs/custom-domains)
- [DNS Propagation Checker](https://dnschecker.org)
- [SSL Labs](https://www.ssllabs.com/ssltest/) - Test SSL

---

**Good luck with your custom domain! 🚀**
