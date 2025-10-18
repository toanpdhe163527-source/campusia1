# Campusia Backend

Backend API cho Campusia Event Platform sử dụng JSON File Storage - không cần MongoDB!

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy environment file
cp .env.example .env

# 3. Run server
npm run dev
```

Server sẽ chạy tại: `http://localhost:5000`

## 📦 Tech Stack

- **Node.js 14+** - Runtime
- **Express 4** - Web framework
- **JSON Files** - Data storage (No database!)
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Multer** - File upload

## 📁 Project Structure

```
backend/
├── src/
│   ├── server.js              # Entry point
│   ├── models/
│   │   ├── Event.js           # Event model & CRUD
│   │   └── Admin.js           # Admin model & auth
│   ├── routes/
│   │   ├── auth.js            # Auth endpoints
│   │   └── events.js          # Event endpoints
│   └── middleware/
│       ├── auth.js            # JWT verification
│       └── upload.js          # File upload handling
├── data/                      # JSON storage (auto-created)
│   ├── events.json            # Events data
│   ├── admin.json             # Admin credentials
│   └── counter.json           # Auto-increment IDs
├── uploads/                   # Uploaded images (auto-created)
├── .env                       # Environment variables
└── package.json
```

## 🔐 Environment Variables

Copy `.env.example` to `.env` and configure:

```env
PORT=5000
NODE_ENV=development
CORS_ORIGIN=*
JWT_SECRET=your-secret-key
ADMIN_PASSWORD=campusia@12345
```

**⚠️ Important:** Change `JWT_SECRET` and `ADMIN_PASSWORD` in production!

## 📝 API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/login` | Admin login | No |
| GET | `/api/auth/verify` | Verify JWT token | Yes |
| POST | `/api/auth/change-password` | Change password | Yes |

### Events

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/events` | Get all events | No |
| GET | `/api/events/:id` | Get event by ID | No |
| POST | `/api/events` | Create event | Yes |
| PUT | `/api/events/:id` | Update event | Yes |
| DELETE | `/api/events/:id` | Delete event | Yes |
| POST | `/api/events/:id/toggle-featured` | Toggle featured | Yes |

## 🎯 Features

- ✅ No database required - uses JSON files
- ✅ Auto-create JSON files on startup
- ✅ JWT authentication
- ✅ Password hashing with bcrypt
- ✅ File upload support (base64 & multipart)
- ✅ Auto-increment IDs
- ✅ CORS enabled
- ✅ Request logging
- ✅ Error handling

## 💾 Data Storage

Data is stored in JSON files:

- `data/events.json` - Array of events
- `data/admin.json` - Admin credentials
- `data/counter.json` - Auto-increment counter

**Backup:** Just copy the `data/` folder!

## 🧪 Testing

```bash
# Health check
curl http://localhost:5000/health

# Get events
curl http://localhost:5000/api/events

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"password":"campusia@12345"}'
```

## 🚀 Deployment

### Vercel

```bash
vercel
```

### Railway

```bash
railway up
```

### Environment Variables (Production)

Set these in your hosting platform:
- `JWT_SECRET` - Random secure string (32+ chars)
- `ADMIN_PASSWORD` - Strong password
- `CORS_ORIGIN` - Your frontend domain
- `NODE_ENV=production`

## 📚 Documentation

- [API Docs](../docs/README.md#api-documentation)
- [Setup Guide](../docs/SETUP.md)
- [Architecture](../docs/ARCHITECTURE.md)

## 🔒 Security

- Passwords are hashed with bcrypt (10 rounds)
- JWT tokens expire after 7 days
- CORS can be restricted to specific origins
- Input validation on all endpoints

## 🐛 Troubleshooting

**Port already in use:**
```bash
# Change PORT in .env
PORT=3001
```

**JSON files not created:**
- Check folder permissions
- Ensure Node.js can write files
- Check logs for errors

**Login fails:**
- Verify password in `.env`
- Check `data/admin.json` exists
- Try deleting `admin.json` and restart

## 📞 Support

- GitHub Issues: [Create issue](https://github.com/YOUR_USERNAME/campusia/issues)
- Email: contact@campusia.com

---

Made with ❤️ in Vietnam | No database required!
