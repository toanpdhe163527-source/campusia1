# 🚀 START HERE - Campusia

**Welcome!** This is your quick guide to get Campusia up and running in 3 minutes.

---

## 📖 Documentation

We have **5 main documentation files**. Start with #1:

1. **[README.md](README.md)** 📖 - **START HERE!**
   - Features, Quick Start, Deployment
   - Everything you need to get started

2. **[RENDER_FULLSTACK.md](RENDER_FULLSTACK.md)** 🚀 - **Deploy to Internet**
   - 30-minute deployment guide
   - Deploy full stack on Render (free)

3. **[TESTING.md](TESTING.md)** 🧪
   - Complete testing guide
   - 15 test scenarios

4. **[CHANGELOG.md](CHANGELOG.md)** 📝
   - Bugfixes, updates, roadmap

5. **[backend/README.md](backend/README.md)** 🔌
   - Backend API documentation

---

## ⚡ Quick Start (3 Steps)

### Step 1: Install Dependencies

```bash
# Frontend
npm install

# Backend
cd backend
npm install
cd ..
```

### Step 2: Start Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

Expected: `✅ JSON storage initialized` + `🚀 Server running on port 5000`

**Terminal 2 - Frontend:**
```bash
npm run dev
```

Expected: `➜ Local: http://localhost:3000/`

### Step 3: Initialize Sample Data

1. Open http://localhost:3000
2. Press F12 (open Console)
3. Run:
```javascript
await window.initDB()
```

Expected: `✓ Created event: ...` (5 events created)

### Done! 🎉

- **Frontend:** http://localhost:3000
- **Admin Login:** Password `campusia@12345`

---

## 🎯 What Next?

### Try These Features

1. **View events** - Homepage shows events
2. **Search** - Type in search box
3. **Filter** - Click CLB/Workshop/Exe
4. **Event detail** - Click on event card
5. **Admin login** - Click "Login", password: `campusia@12345`
6. **Create event** - Click "Tạo sự kiện mới"
7. **Toggle featured** - Click star icon
8. **Delete event** - Click trash icon

### Read Documentation

- **Complete guide:** [README.md](README.md)
- **Testing guide:** [TESTING.md](TESTING.md)
- **Bugfixes:** [CHANGELOG.md](CHANGELOG.md)

---

## 🐛 Troubleshooting

### Backend not running?

**Check:**
```bash
curl http://localhost:5000/health
```

**Fix:**
```bash
cd backend
npm run dev
```

### Port 5000 already in use?

**Fix:** Change port in `backend/src/server.js`:
```javascript
const PORT = 5001; // or any free port
```

### No events showing?

**Fix:** Initialize sample data:
```javascript
await window.initDB()
```

### More issues?

Read [README.md - Troubleshooting](README.md#-troubleshooting)

---

## 📂 Project Structure

```
campusia/
│
├── README.md           # 👈 Main documentation
├── TESTING.md          # Testing guide
├── CHANGELOG.md        # Updates & bugfixes
│
├── backend/            # Backend (Node.js + Express)
│   ├── src/
│   │   ├── server.js
│   │   ├── models/
│   │   ├── routes/
│   │   └── middleware/
│   └── data/          # JSON storage (auto-created)
│
├── components/         # React components
├── utils/             # API client & helpers
├── styles/            # CSS
└── App.tsx            # Main app
```

---

## 🔐 Admin Features

### Login

1. Click "Login" (top right)
2. Password: `campusia@12345`
3. Access Admin Dashboard

### Admin Can:

- ✅ Create events (with image upload)
- ✅ Toggle featured (shows in carousel)
- ✅ Delete events
- ✅ View stats

**⚠️ Production:** Change password! See [README.md - Security](README.md#-security)

---

## 🎨 Customization

### Change Password

File: `backend/.env`
```bash
ADMIN_PASSWORD=your-new-password-here
JWT_SECRET=your-random-secret-key
```

Restart backend.

### Change Colors

File: `styles/globals.css`
```css
--color-primary: #9333ea;    /* Purple */
--color-secondary: #ec4899;  /* Pink */
```

### Add Categories

File: `components/CreateEvent.tsx`
```tsx
const categories = [
  'Học thuật',
  'Kinh doanh',
  'Phát triển kĩ năng',
  'Giải trí',
  'Your New Category'  // Add here
]
```

**More customization:** [README.md - Customization](README.md#-customization)

---

## 📦 Deployment

Want to deploy to the Internet? **Easy!**

### 🚀 Quick Deploy (30 minutes)

Follow **[QUICK_DEPLOY.md](QUICK_DEPLOY.md)** for step-by-step guide:

1. Push to GitHub
2. Deploy backend to Render (Free)
3. Deploy frontend to Vercel (Free)
4. Done! 🎉

**Platforms:**
- **Frontend:** Vercel (Free, auto-deploy)
- **Backend:** Render (Free tier available)

**Cost:** $0/month for development, $7/month for production

**Detailed guide:** 
- [QUICK_DEPLOY.md](QUICK_DEPLOY.md) - 30-minute guide
- [DEPLOYMENT.md](DEPLOYMENT.md) - Complete guide

---

## 🆘 Need Help?

1. **Read docs:**
   - [README.md](README.md) - Main guide
   - [TESTING.md](TESTING.md) - Testing
   - [CHANGELOG.md](CHANGELOG.md) - Known fixes

2. **Common issues:**
   - Backend not running → Start it
   - Port conflict → Change port
   - Auth errors → Re-login
   - Images not uploading → Check size < 5MB

3. **Still stuck?**
   - Check browser console (F12)
   - Check backend logs
   - Create GitHub issue

---

## 💡 Tips

### Useful Commands

```bash
# Start backend
cd backend && npm run dev

# Start frontend
npm run dev

# Initialize data
# In browser console:
await window.initDB()

# Check backend health
curl http://localhost:5000/health

# Clear auth token
# In browser console:
localStorage.clear()
```

### Keyboard Shortcuts

- `F5` - Refresh page
- `Ctrl+Shift+I` - Open DevTools
- `Ctrl+C` - Stop server

---

## 📊 Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite 5.x
- Tailwind CSS v4
- Shadcn/ui components

**Backend:**
- Node.js + Express
- JSON file storage (no database!)
- JWT authentication
- Bcrypt password hashing

---

## 🎯 Features

### User Features
- ✅ View events
- ✅ Search & filter
- ✅ Event details with gallery
- ✅ Responsive design

### Admin Features
- ✅ Create/delete events
- ✅ Upload images (max 10, 5MB each)
- ✅ Toggle featured
- ✅ Dashboard with stats

### Technical
- ✅ JWT authentication
- ✅ Password hashing
- ✅ File upload
- ✅ No database needed!

---

## 🚀 You're Ready!

Now you know:
- ✅ How to run the app
- ✅ Where to find documentation
- ✅ How to test features
- ✅ Where to get help

**Start building with Campusia! 🎉**

---

**Next steps:**

1. Read [README.md](README.md) for complete guide
2. Try [TESTING.md](TESTING.md) scenarios
3. Check [CHANGELOG.md](CHANGELOG.md) for updates
4. Customize and deploy!

---

**Quick Links:**

- 📖 [README.md](README.md) - Main docs
- 🚀 [QUICK_DEPLOY.md](QUICK_DEPLOY.md) - Deploy guide
- 🧪 [TESTING.md](TESTING.md) - Testing
- 📝 [CHANGELOG.md](CHANGELOG.md) - Updates
- 🔌 [backend/README.md](backend/README.md) - API docs

---

**Version:** 1.0.0  
**Last Updated:** 2025-01-16  
**Status:** ✅ Production Ready