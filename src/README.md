# 🎉 Campusia - Website Bán Vé Sự Kiện

Website bán vé sự kiện tiếng Việt với thiết kế hiện đại, light theme, purple accent colors.

## ✨ Tính năng

### 🌟 Người dùng
- ✅ Xem danh sách sự kiện (CLB, Workshop, Exe)
- ✅ Hero carousel với sự kiện nổi bật
- ✅ Tìm kiếm và filter theo category, ngày, địa điểm
- ✅ Xem chi tiết sự kiện với gallery ảnh
- ✅ Responsive design (mobile, tablet, desktop)

### 🔐 Admin
- ✅ Đăng nhập với password: `campusia@12345`
- ✅ Dashboard quản lý sự kiện
- ✅ Tạo sự kiện mới với upload ảnh (max 10, 5MB/ảnh)
- ✅ Đánh dấu sự kiện nổi bật (hiển thị ở carousel)
- ✅ Xóa sự kiện
- ✅ Xem thống kê

## 🚀 Quick Start

### 1. Clone & Install

```bash
# Clone project (hoặc download zip)
git clone <your-repo-url>
cd campusia

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 2. Chạy Backend

```bash
cd backend
npm run dev
```

**Expected output:**
```
✅ JSON storage initialized
🚀 Campusia API Server running on port 5000
```

### 3. Chạy Frontend

Mở terminal mới:

```bash
npm run dev
```

**Expected output:**
```
VITE v5.0.12  ready in 500 ms
➜  Local:   http://localhost:3000/
```

### 4. Khởi tạo dữ liệu mẫu

Mở http://localhost:3000, mở Console (F12), chạy:

```javascript
await window.initDB()
```

**Expected:**
```
Starting database initialization...
Logged in as admin successfully
✓ Created event: 2025 HỒ CHÍ MINH
✓ Created event: VSTRA
✓ Created event: LẠC DƯƠNG YANGHỞ
✓ Created event: MIURE QUE SANG
✓ Created event: TẤT
Initialization complete! Success: 5 events
```

### 5. Xong! 🎉

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000/api
- **Admin Login:** Password `campusia@12345`

## 📁 Cấu trúc Project

```
campusia/
│
├── backend/                    # 🔌 Backend (Node.js + Express)
│   ├── src/
│   │   ├── server.js          # Main server
│   │   ├── models/            # Data models (Admin, Event)
│   │   ├── routes/            # API routes (auth, events)
│   │   └── middleware/        # Auth middleware
│   ├── data/                  # JSON storage (auto-created)
│   │   ├── events.json
│   │   └── admin.json
│   ├── package.json
│   └── README.md
│
├── components/                 # ⚛️ React components
│   ├── Navigation.tsx
│   ├── HeroCarousel.tsx
│   ├── EventCard.tsx
│   ├── EventDetail.tsx
│   ├── AdminDashboard.tsx
│   ├── CreateEvent.tsx
│   ├── Login.tsx
│   └── ui/                    # Shadcn/ui components (43)
│
├── utils/                      # 🛠️ Utilities
│   ├── api.ts                 # API client
│   ├── filterEvents.ts
│   └── initializeData.ts      # Sample data generator
│
├── data/                       # 📝 TypeScript types
│   └── events.ts
│
├── styles/                     # 🎨 Global CSS
│   └── globals.css
│
├── App.tsx                     # Main app component
├── package.json
├── vite.config.ts
└── README.md                   # 👈 You are here
```

## 🔧 Tech Stack

### Backend
- **Node.js** 14+
- **Express** 4.18
- **JSON Storage** (no database needed!)
- **JWT** authentication
- **Bcrypt** password hashing
- **CORS** enabled

### Frontend
- **React** 18 + TypeScript
- **Vite** 5.x
- **Tailwind CSS** v4
- **Shadcn/ui** components
- **Motion** (Framer Motion) animations
- **Lucide** icons

## 📖 API Documentation

### Auth Endpoints

```bash
POST /api/auth/login
Body: { "password": "campusia@12345" }
Response: { "success": true, "token": "jwt_token" }

GET /api/auth/verify
Headers: Authorization: Bearer <token>
Response: { "valid": true, "user": {...} }
```

### Event Endpoints

```bash
GET /api/events
Response: { "events": [...] }

GET /api/events/:id
Response: { "event": {...} }

POST /api/events (Auth required)
Body: { event data with images }
Response: { "success": true, "event": {...} }

DELETE /api/events/:id (Auth required)
Response: { "success": true }

POST /api/events/:id/toggle-featured (Auth required)
Response: { "success": true, "event": {...} }
```

Chi tiết: Xem [backend/README.md](backend/README.md)

## 🧪 Testing

### Basic Tests

1. **Homepage loads:** http://localhost:3000
2. **Events display:** After init data
3. **Search works:** Type in search box
4. **Filter works:** Click CLB/Workshop/Exe
5. **Event detail:** Click on event card
6. **Login:** Password `campusia@12345`
7. **Admin dashboard:** After login
8. **Create event:** Click "Tạo sự kiện mới"
9. **Toggle featured:** Click star icon
10. **Delete event:** Click trash icon

Chi tiết: Xem [TESTING.md](TESTING.md)

## 🐛 Troubleshooting

### Backend không chạy

**Symptoms:** Red banner "Backend không chạy!"

**Fix:**
```bash
cd backend
npm run dev
```

### Port 5000 đã được sử dụng

**Fix:**
```bash
# Đổi port trong backend/src/server.js
const PORT = 5001; // hoặc port khác
```

### Không tạo được sự kiện

**Check:**
1. Đã login chưa?
2. Backend có chạy không?
3. Có upload ít nhất 1 ảnh chưa?
4. Ảnh < 5MB?

### Console errors

**Fix:** Xem [CHANGELOG.md](CHANGELOG.md) - đã fix các lỗi phổ biến

## 📦 Deployment

### Backend

**Option 1: Heroku**
```bash
cd backend
heroku create campusia-api
git push heroku main
```

**Option 2: Railway**
```bash
railway init
railway up
```

**Option 3: VPS**
```bash
# PM2 for process management
npm install -g pm2
cd backend
pm2 start src/server.js --name campusia-api
```

### Frontend

**Option 1: Vercel**
```bash
npm install -g vercel
vercel
```

**Option 2: Netlify**
```bash
npm run build
# Drag & drop dist/ folder to Netlify
```

**Environment Variables:**
```bash
# Update API URL
VITE_API_URL=https://your-backend-url.com/api
```

## 🔐 Security

### Production Checklist

- [ ] Change admin password (default: `campusia@12345`)
- [ ] Change JWT secret in `backend/.env`
- [ ] Enable HTTPS
- [ ] Add rate limiting
- [ ] Setup CORS whitelist
- [ ] Regular backups of `backend/data/`

### Change Admin Password

```bash
# In backend folder
cd backend

# Create .env file
echo "ADMIN_PASSWORD=your-new-secure-password-here" > .env
echo "JWT_SECRET=your-random-secret-key-here" >> .env

# Restart backend
npm run dev
```

## 📊 Data Storage

Tất cả data được lưu trong JSON files:

```
backend/data/
├── events.json      # Danh sách sự kiện
└── admin.json       # Admin credentials
```

**Backup:** Chỉ cần copy folder `backend/data/`

**Restore:** Paste lại vào `backend/data/`

## 🎨 Customization

### Đổi màu chủ đạo

File: `styles/globals.css`

```css
/* Tìm và thay đổi */
--color-primary: #9333ea;    /* Purple */
--color-secondary: #ec4899;  /* Pink */
```

### Đổi logo

File: `components/Navigation.tsx`

```tsx
// Tìm và thay thế SVG icon
<div className="flex items-center space-x-3">
  {/* Your logo here */}
  <span>Campusia</span>
</div>
```

### Thêm category mới

File: `components/CreateEvent.tsx`

```tsx
const categories = [
  'Học thuật',
  'Kinh doanh',
  'Phát triển kĩ năng',
  'Giải trí',
  'Your New Category'  // Thêm ở đây
]
```

## 📚 Documentation Files

| File | Mục đích |
|------|----------|
| [README.md](README.md) | Main documentation (👈 you are here) |
| [TESTING.md](TESTING.md) | Testing guide & scenarios |
| [CHANGELOG.md](CHANGELOG.md) | Bugfixes & updates |
| [backend/README.md](backend/README.md) | Backend API docs |

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repo
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project uses:
- **Shadcn/ui** components (MIT License)
- **Unsplash** photos (Unsplash License)

See [Attributions.md](Attributions.md)

## 💡 Tips

### Phím tắt
- `Ctrl+Shift+I` - Mở DevTools
- `F5` - Refresh trang
- `Ctrl+C` - Stop server

### Console Commands
```javascript
// Clear localStorage
localStorage.clear()

// Re-init database
await window.initDB()

// Check token
localStorage.getItem('admin_token')
```

### VSCode Extensions (khuyến nghị)
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript

## 🆘 Support

**Issues?**
1. Check [TESTING.md](TESTING.md)
2. Check [CHANGELOG.md](CHANGELOG.md) for known fixes
3. Check backend logs
4. Check browser console (F12)
5. Create GitHub issue

**Common Issues:**
- ❌ Backend not running → `cd backend && npm run dev`
- ❌ Port conflict → Change port in `backend/src/server.js`
- ❌ Auth errors → Re-login with password
- ❌ Images not uploading → Check size < 5MB

## 🎯 Roadmap

### v1.1 (Current)
- [x] JWT authentication
- [x] JSON file storage
- [x] Image upload
- [x] Featured events
- [x] Admin dashboard

### v1.2 (Planned)
- [ ] Email notifications
- [ ] QR code tickets
- [ ] Payment integration
- [ ] Event analytics

### v2.0 (Future)
- [ ] MongoDB migration
- [ ] Mobile app
- [ ] Multi-language
- [ ] Advanced analytics

---

## 🎊 Kết luận

**Campusia** là một website bán vé sự kiện hoàn chỉnh với:

✅ **No database required** - Chỉ cần Node.js  
✅ **Production ready** - JWT auth, security, error handling  
✅ **Easy to deploy** - Vercel, Netlify, Heroku  
✅ **Well documented** - 4 detailed docs  
✅ **Modern stack** - React, TypeScript, Tailwind  

**Bắt đầu ngay:**
```bash
cd backend && npm install && npm run dev
# Terminal mới:
npm install && npm run dev
```

---

**Made with ❤️ for Campusia**

**Version:** 1.0.0  
**Last Updated:** 2025-01-16
