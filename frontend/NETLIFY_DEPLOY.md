# Daily Wins - Netlify Deployment Guide

## Quick Deploy

1. **Push to GitHub**
   - Create a new repository on GitHub
   - Push the `frontend` folder contents

2. **Connect to Netlify**
   - Go to [Netlify](https://app.netlify.com)
   - Click "Add new site" > "Import an existing project"
   - Connect your GitHub repository
   - Netlify will auto-detect the `netlify.toml` configuration

3. **Deploy**
   - Click "Deploy site"
   - Wait for build to complete (~2-3 minutes)

## Manual Deploy (Drag & Drop)

1. **Build locally**
   ```bash
   cd frontend
   npm install
   npx expo export --platform web
   ```

2. **Upload to Netlify**
   - Go to [Netlify Drop](https://app.netlify.com/drop)
   - Drag the `dist` folder to deploy

## Build Configuration

- **Build command**: `npx expo export --platform web`
- **Publish directory**: `dist`
- **Base directory**: `frontend` (if using monorepo structure)

## Environment Variables (if needed)

Set these in Netlify dashboard under Site settings > Environment variables:

- `NODE_VERSION`: `18`

## Features

- Static site hosting (SPA)
- Automatic HTTPS
- Global CDN
- SPA routing configured (all routes redirect to index.html)
- Asset caching optimized

## Troubleshooting

If build fails:
1. Check Node version is 18+
2. Ensure all dependencies are in package.json
3. Check Netlify build logs for specific errors
