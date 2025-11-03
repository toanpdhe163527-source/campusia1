# 🔧 Fix Lỗi Deploy Frontend Trên Render

## ❌ Lỗi: vercel.json

Nếu bạn thấy lỗi mention `vercel.json` khi deploy frontend lên Render:

```
Exited with status 1 while building your code.
==> Publish directory dist does not exist!
```

### ✅ Giải Pháp

Project đã được fix với 2 file mới:

1. **`/render.yaml`** - Config cho Render
2. **`/.node-version`** - Chỉ định Node.js version

### 📝 Các Bước Deploy Lại

#### Option 1: Auto Detection (Khuyến nghị)

1. **Push code mới lên Git:**
   ```bash
   git add .
   git commit -m "fix: Add Render config files"
   git push origin main
   ```

2. **Trong Render Dashboard:**
   - Vào Static Site của bạn
   - Click **Manual Deploy** → **Clear build cache & deploy**
   - Render sẽ tự động phát hiện `render.yaml`

#### Option 2: Manual Configuration

Nếu Render không tự động phát hiện, config thủ công:

1. **Vào Settings tab của Static Site**

2. **Build & Deploy:**
   ```
   Build Command:         npm install && npm run build
   Publish Directory:     dist
   ```

3. **Environment:**
   ```
   NODE_VERSION:          18.20.0
   VITE_API_URL:          https://your-backend.onrender.com
   ```

4. **Advanced:**
   - Auto-Deploy: Yes
   - Branch: main
   - Root Directory: (để trống)

5. **Save Changes** và click **Manual Deploy**

---

## 🔍 Verify Build Config

### Check package.json

Đảm bảo có build script:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

### Check vite.config.ts

Đảm bảo output directory là `dist`:

```typescript
export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
})
```

---

## 🐛 Common Errors & Solutions

### Error 1: "Publish directory dist does not exist"

**Nguyên nhân:** Build failed, không tạo được folder `dist`

**Giải pháp:**
1. Check Build Command: `npm install && npm run build`
2. Check logs để xem lỗi build
3. Test local: `npm run build` → should create `dist/` folder

### Error 2: "Module not found"

**Nguyên nhân:** Dependencies không được install

**Giải pháp:**
1. Đảm bảo `package.json` có đầy đủ dependencies
2. Build Command phải có `npm install` trước `npm run build`
3. Clear build cache và deploy lại

### Error 3: "Build exceeded memory limit"

**Nguyên nhân:** Free tier có giới hạn RAM

**Giải pháp:**
1. Tối ưu dependencies (remove unused packages)
2. Build locally và commit `dist/` folder (không khuyến nghị)
3. Upgrade Render plan

### Error 4: "Environment variable not found"

**Nguyên nhân:** Vite env vars không có prefix `VITE_`

**Giải pháp:**
1. Tất cả env vars cho frontend phải có prefix `VITE_`
2. Example: `VITE_API_URL`, `VITE_APP_NAME`
3. Access trong code: `import.meta.env.VITE_API_URL`

---

## ✅ Verify Deployment

Sau khi deploy thành công:

### 1. Check Build Logs
```
✓ 2525 modules transformed.
✓ built in 6.00s

dist/index.html                   0.42 kB │ gzip:   0.27 kB
dist/assets/index-v0d0fZZ.js    386.00 kB │ gzip: 120.75 kB

✓ Build successful!
```

### 2. Test Frontend URL
```bash
curl https://your-frontend.onrender.com
# Should return HTML
```

### 3. Check Browser
1. Mở URL trong browser
2. F12 → Console → Không có errors màu đỏ
3. F12 → Network → Check API calls

---

## 📊 Render Configuration Summary

### Static Site Settings

```yaml
services:
  - type: web
    name: campusia-frontend
    runtime: static
    buildCommand: npm install && npm run build
    staticPublishPath: ./dist
    envVars:
      - key: NODE_VERSION
        value: 18.20.0
    routes:
      - type: rewrite
        source: /*
        destination: /index.html
```

### Environment Variables

```bash
# Required
NODE_VERSION=18.20.0
VITE_API_URL=https://campusia-backend.onrender.com

# Optional (if using)
VITE_APP_NAME=Campusia
VITE_APP_VERSION=1.0.0
```

---

## 🚀 Final Checklist

Trước khi deploy:

- [x] File `render.yaml` exists trong root
- [x] File `.node-version` exists trong root  
- [x] `package.json` có script `build`
- [x] `vite.config.ts` có `outDir: 'dist'`
- [x] Code đã push lên Git
- [x] Backend đã deploy và có URL

Trong Render:

- [ ] Static Site created
- [ ] Build Command = `npm install && npm run build`
- [ ] Publish Directory = `dist`
- [ ] Environment variable `VITE_API_URL` set đúng backend URL
- [ ] Clear build cache & deploy
- [ ] Wait 3-5 minutes
- [ ] ✅ Deploy successful!

---

## 🆘 Still Having Issues?

### Check Logs

1. Vào Render Dashboard
2. Click vào Static Site
3. Click **Logs** tab
4. Xem detailed error messages

### Common Log Patterns

**Success:**
```
==> Building...
✓ Build successful!
==> Uploading...
==> Deploy live!
```

**Failure:**
```
==> Building...
✗ Build failed
==> Error: ...
```

### Get Help

1. Copy full error log
2. Check [Render Documentation](https://render.com/docs/static-sites)
3. Check [Vite Troubleshooting](https://vitejs.dev/guide/troubleshooting)

---

## 📱 Related Files

- `/render.yaml` - Render configuration
- `/.node-version` - Node version specification
- `/package.json` - Build scripts
- `/vite.config.ts` - Vite build config
- `/RENDER_FULLSTACK.md` - Full deployment guide

---

**Last Updated:** 2025-10-18  
**Status:** ✅ Ready to Deploy
