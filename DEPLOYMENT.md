# Vercel Deployment Guide for DataDrop

## 🚀 Quick Deploy to Vercel

Your DataDrop application is now configured for Vercel deployment! Here's how to deploy:

### Option 1: Deploy via Vercel CLI (Recommended)

1. **Install Vercel CLI globally:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy from your project directory:**
   ```bash
   vercel
   ```

4. **Follow the prompts:**
   - Link to existing project? → No
   - What's your project name? → `datadrop` (or your preferred name)
   - In which directory is your code located? → `./`

### Option 2: Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New" → "Project"
3. Import your GitHub repository: `https://github.com/25sniper/DataDrop`
4. Vercel will auto-detect the settings
5. Click "Deploy"

## 🔧 Environment Variables

**Important:** You need to set up a database for production. Add these environment variables in Vercel:

### For Neon Database (Recommended):
1. Go to [neon.tech](https://neon.tech) and create a free PostgreSQL database
2. Get your connection string
3. In Vercel Dashboard → Project → Settings → Environment Variables:
   ```
   DATABASE_URL=postgresql://username:password@host/database?sslmode=require
   SESSION_SECRET=your-super-secure-random-string-here
   NODE_ENV=production
   ```

### For Supabase Database:
1. Go to [supabase.com](https://supabase.com) and create a project
2. Get your connection string from Settings → Database
3. Add the same environment variables as above

## 📋 Changes Made for Vercel Deployment

### New Files Created:
- `vercel.json` - Vercel configuration
- `api/index.ts` - Serverless API handler
- `server/routes-vercel.ts` - Modified routes for serverless
- `DEPLOYMENT.md` - This deployment guide

### Key Modifications:
1. **File Storage:** Changed from disk storage to memory storage with base64 encoding
2. **API Routes:** Adapted for Vercel's serverless functions
3. **Build Process:** Simplified for static site generation
4. **Dependencies:** Added @vercel/node for TypeScript support

### File Upload Changes:
- **Before:** Files stored on disk
- **After:** Files stored as base64 in database (5MB limit for serverless)
- **Production Recommendation:** Use cloud storage (AWS S3, Cloudinary) for files

## 🌐 Custom Domain Setup

1. In Vercel Dashboard → Project → Settings → Domains
2. Add your custom domain (e.g., `suscon.vercel.app` or `datadrop.yourdomain.com`)
3. Follow DNS setup instructions

## ⚡ Performance Notes

**Current Setup:**
- ✅ Works great for text/link sharing
- ✅ Small file uploads (< 5MB)
- ⚠️ Files stored in database (not ideal for large files)

**For Production with Large Files:**
- Consider integrating AWS S3, Cloudinary, or UploadThing
- Files would be stored in cloud storage instead of database

## 🔍 Testing Your Deployment

1. Once deployed, your app will be available at: `https://your-project-name.vercel.app`
2. Test all features:
   - Create a room
   - Add text/links
   - Upload small files
   - Share room code

## 🐛 Troubleshooting

**Common Issues:**
- Database connection errors → Check DATABASE_URL environment variable
- File upload failures → Ensure files are under 5MB
- Build errors → Check package.json scripts

**Logs:**
- View deployment logs in Vercel Dashboard
- Check function logs for API errors

## 🎯 Next Steps

After successful deployment:
1. Set up a custom domain
2. Configure cloud file storage for larger files
3. Set up monitoring and analytics
4. Consider adding user authentication
5. Add file sharing expiration features

---

Your DataDrop app is ready to deploy! 🎉
