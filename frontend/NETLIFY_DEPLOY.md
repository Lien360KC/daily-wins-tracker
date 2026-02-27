# Daily Wins - Netlify Deployment Guide

## Quick Deploy to Netlify

### Option 1: Deploy via GitHub (Recommended)

1. **Push your code to GitHub**
   ```bash
   # In the frontend folder
   cd frontend
   git init
   git add .
   git commit -m "Initial commit - Daily Wins Habit Tracker"
   git remote add origin https://github.com/YOUR_USERNAME/daily-wins.git
   git push -u origin main
   ```

2. **Connect to Netlify**
   - Go to [Netlify](https://app.netlify.com)
   - Click **"Add new site"** > **"Import an existing project"**
   - Select **GitHub** and authorize Netlify
   - Choose your `daily-wins` repository
   - Netlify will auto-detect settings from `netlify.toml`

3. **Deploy**
   - Click **"Deploy site"**
   - Wait for build to complete (~2-3 minutes)
   - Your app will be live at `https://YOUR-SITE-NAME.netlify.app`

### Option 2: Manual Deploy (Drag & Drop)

1. **Build the app locally**
   ```bash
   cd frontend
   npm install   # or yarn install
   npx expo export --platform web
   ```

2. **Upload to Netlify**
   - Go to [Netlify Drop](https://app.netlify.com/drop)
   - Drag the entire `dist` folder into the browser
   - Your app is instantly deployed!

### Option 3: Netlify CLI

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Build and Deploy**
   ```bash
   cd frontend
   npm install
   npx expo export --platform web
   netlify deploy --prod --dir=dist
   ```

## Build Configuration

The `netlify.toml` file is already configured:

| Setting | Value |
|---------|-------|
| Build command | `npx expo export --platform web` |
| Publish directory | `dist` |
| Node version | 18 |

## Files Created for Netlify

- `netlify.toml` - Build configuration and redirects
- `.nvmrc` - Node version specification
- `public/_redirects` - SPA routing fallback

## Troubleshooting

### Build Fails
1. Ensure Node.js version 18+ is being used
2. Clear cache: In Netlify dashboard, go to **Deploys** > **Trigger deploy** > **Clear cache and deploy site**
3. Check build logs for specific errors

### Blank Page After Deploy
- The `netlify.toml` already includes SPA redirects
- If still having issues, verify the `_redirects` file is in the `dist` folder

### Assets Not Loading
- Check browser console for 404 errors
- Verify assets are in `dist/assets` folder after build

## Custom Domain

1. Go to **Site settings** > **Domain management**
2. Click **Add custom domain**
3. Follow DNS configuration instructions

## Environment Variables

This app uses local storage only - no environment variables needed!

## Performance Optimizations

Already configured in `netlify.toml`:
- Asset caching (1 year for static files)
- Security headers (X-Frame-Options, XSS Protection)
- Gzip compression (automatic on Netlify)

---

**Your Daily Wins app is ready for deployment!** 🎉
