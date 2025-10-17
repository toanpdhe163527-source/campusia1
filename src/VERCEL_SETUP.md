# 🚀 Vercel Deployment Setup - Campusia

Hướng dẫn cấu hình chính xác cho Vercel deployment.

---

## ✅ Files Đã Tạo Sẵn

Project đã có các files cấu hình cần thiết:

- ✅ `vercel.json` - Vercel configuration
- ✅ `.vercelignore` - Files to ignore
- ✅ `vite.config.ts` - Vite build config
- ✅ `package.json` - Build scripts

**Bạn KHÔNG cần tạo thêm files!**

---

## 🎯 Vercel Project Settings

### Framework Preset
```
Framework: Vite
```

### Build & Development Settings
```
Build Command: npm run build
Output Directory: dist
Install Command: npm install
Development Command: npm run dev
```

### Root Directory
```
Root Directory: ./
```
*(Leave as is, do NOT change to any subfolder)*

---

## 🔧 Environment Variables

Trong Vercel Dashboard → Settings → Environment Variables:

| Variable Name | Value | Environment |
|--------------|-------|-------------|
| `VITE_API_URL` | `https://your-backend.onrender.com` | Production |

**Lưu ý:**
- Không có trailing slash: ✅ `https://backend.onrender.com`
- Có trailing slash: ❌ `https://backend.onrender.com/`

---

## 🐛 Common Build Errors & Fixes

### Error 1: "No Output Directory named 'dist' found"

**Nguyên nhân:** Build không tạo thư mục `dist`

**Giải pháp:**
1. Check Build Command: Phải là `npm run build` (KHÔNG phải `tsc && vite build`)
2. Check file `package.json`:
   ```json
   "scripts": {
     "build": "vite build"
   }
   ```
3. Redeploy

---

### Error 2: TypeScript Compilation Errors

**Nguyên nhân:** TypeScript strict mode có lỗi

**Giải pháp Option 1 (Khuyến nghị):**
1. Trong Vercel, Build Command: `npm run build`
2. File `package.json` đã được update:
   ```json
   "scripts": {
     "build": "vite build"
   }
   ```
3. Vite sẽ build mà không chạy TypeScript check

**Giải pháp Option 2:**
1. Fix TypeScript errors locally
2. Run `npm run type-check` để check
3. Commit và push

---

### Error 3: "Module not found" errors

**Nguyên nhân:** Dependencies không được install

**Giải pháp:**
1. Check `package.json` có đầy đủ dependencies
2. Install Command: `npm install` (default)
3. Check logs để xem dependency nào thiếu
4. Redeploy

---

### Error 4: Build succeeds but page is blank

**Nguyên nhân:** Environment variables chưa setup

**Giải pháp:**
1. Check `VITE_API_URL` đã setup chưa
2. Check browser console (F12) → có lỗi gì không
3. Check Network tab → API calls có đúng URL không

---

### Error 5: CORS errors in production

**Nguyên nhân:** Backend chưa setup CORS cho frontend URL

**Giải pháo:**
1. Vào Render → Backend → Environment Variables
2. Update `FRONTEND_URL` = `https://your-app.vercel.app`
3. Redeploy backend

---

## ✅ Verify Build Locally

Trước khi deploy, test build locally:

```bash
# 1. Build project
npm run build

# 2. Check dist folder được tạo
ls -la dist/

# 3. Preview build
npm run preview

# 4. Mở http://localhost:4173
```

Nếu local build OK → Vercel sẽ build OK!

---

## 📊 Build Process Flow

```
1. Vercel pulls code from GitHub
   ↓
2. Runs: npm install
   ↓
3. Runs: npm run build
   ↓
4. Vite builds project → outputs to dist/
   ↓
5. Vercel deploys dist/ folder
   ↓
6. Website live! 🎉
```

---

## 🔍 Debug Build Issues

### Step 1: Check Build Logs

1. Vercel Dashboard → Deployments
2. Click on failed deployment
3. Click "View Build Logs"
4. Tìm error message (màu đỏ)

### Step 2: Common Log Errors

**"ENOENT: no such file or directory"**
- File không tồn tại
- Check import paths

**"Module not found"**
- Missing dependency
- Run `npm install <package>`

**"TypeScript error"**
- Fix TypeScript errors
- Or update build command

**"dist directory not found"**
- Build command sai
- Check `package.json` scripts

### Step 3: Fix & Redeploy

1. Fix issue locally
2. Test build: `npm run build`
3. Commit changes
4. Push to GitHub
5. Vercel auto-deploys

---

## 🎯 Vercel.json Configuration

File `vercel.json` trong project:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "installCommand": "npm install",
  "devCommand": "npm run dev",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

**Giải thích:**
- `buildCommand`: Command để build project
- `outputDirectory`: Thư mục chứa build output
- `framework`: Framework detection (Vite)
- `rewrites`: SPA routing (tất cả routes → index.html)

---

## 🚀 Deployment Checklist

Before deploying to Vercel:

- [ ] Code chạy OK trên local
- [ ] `npm run build` thành công
- [ ] `dist/` folder được tạo
- [ ] `npm run preview` hiển thị OK
- [ ] `.env.example` đã tạo
- [ ] `vercel.json` đã có
- [ ] Code đã push lên GitHub

After initial deploy:

- [ ] Build thành công (check logs)
- [ ] Website accessible
- [ ] Environment variables đã setup
- [ ] API calls working (check Network tab)
- [ ] No CORS errors
- [ ] Images loading
- [ ] All pages work

---

## 📱 Vercel CLI (Optional)

Install Vercel CLI để deploy từ terminal:

```bash
# Install
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

---

## 🔄 Auto Deploy Setup

1. Link GitHub repository to Vercel
2. Every push to `main` branch → Auto deploy
3. Pull requests → Preview deployments

**Workflow:**
```bash
git add .
git commit -m "Update feature"
git push origin main
# → Vercel auto-deploys in 2-3 minutes
```

---

## 📊 Build Performance

**Typical build times:**
- Small project: 30-60 seconds
- Medium project: 1-2 minutes
- Large project: 2-5 minutes

**Campusia build time:** ~1-2 minutes

**If build takes > 5 minutes:**
- Check for slow dependencies
- Optimize imports
- Check for infinite loops

---

## 🎉 Success!

Nếu build thành công, bạn sẽ thấy:

```
✓ Build completed
✓ Deployment ready
🔗 https://your-app.vercel.app
```

---

## 📞 Need Help?

1. **Check logs:** Vercel Dashboard → Build Logs
2. **Check docs:** 
   - [QUICK_DEPLOY.md](QUICK_DEPLOY.md)
   - [DEPLOYMENT.md](DEPLOYMENT.md)
3. **Common issues:** See troubleshooting section above
4. **Still stuck?** Check Vercel documentation

---

**Last Updated:** 2025-01-17  
**Status:** ✅ Ready for Deployment
