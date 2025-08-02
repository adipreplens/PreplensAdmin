# 🚀 Preplens Admin - Deployment Guide

## 📋 Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [Git](https://git-scm.com/)
- [Vercel CLI](https://vercel.com/cli) (for frontend)
- [Railway CLI](https://railway.app/) (for backend)

## 🎯 Deployment Options

### Option 1: Vercel + Railway (Recommended)

#### Frontend (Vercel)
1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy Frontend:**
   ```bash
   cd preplensadmin
   vercel
   ```

3. **Set Environment Variables in Vercel Dashboard:**
   - `NEXT_PUBLIC_API_URL`: Your Railway backend URL

#### Backend (Railway)
1. **Install Railway CLI:**
   ```bash
   npm i -g @railway/cli
   ```

2. **Deploy Backend:**
   ```bash
   cd preplensadmin/backend
   railway login
   railway init
   railway up
   ```

3. **Set Environment Variables in Railway Dashboard:**
   ```
   MONGODB_URI=mongodb+srv://your-connection-string
   AWS_ACCESS_KEY_ID=your-aws-key
   AWS_SECRET_ACCESS_KEY=your-aws-secret
   AWS_REGION=us-east-1
   S3_BUCKET_NAME=your-bucket-name
   JWT_SECRET=your-secret-key
   ```

### Option 2: Vercel + Render

#### Frontend (Vercel)
Same as above.

#### Backend (Render)
1. **Create Render Account:** [render.com](https://render.com)
2. **Connect GitHub Repository**
3. **Create Web Service:**
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Environment:** Node.js

4. **Set Environment Variables:**
   Same as Railway above.

### Option 3: Full Vercel Deployment

#### Frontend + Backend (Vercel)
1. **Create API Routes:**
   - Move backend logic to `pages/api/` directory
   - Convert Express routes to Next.js API routes

2. **Deploy:**
   ```bash
   vercel
   ```

## 🔧 Environment Variables

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

### Backend (.env)
```env
MONGODB_URI=mongodb+srv://your-connection-string
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
AWS_REGION=us-east-1
S3_BUCKET_NAME=your-bucket-name
JWT_SECRET=your-secret-key
```

## 📊 Database Setup

### MongoDB Atlas
1. **Create Cluster** on [MongoDB Atlas](https://cloud.mongodb.com)
2. **Get Connection String**
3. **Add to Environment Variables**

### AWS S3 Setup
1. **Create S3 Bucket**
2. **Create IAM User** with S3 permissions
3. **Get Access Keys**
4. **Add to Environment Variables**

## 🚀 Quick Deploy Commands

### Option 1: Vercel + Railway
```bash
# Frontend
cd preplensadmin
vercel

# Backend
cd preplensadmin/backend
railway up
```

### Option 2: Manual Deploy
```bash
# Build frontend
cd preplensadmin
npm run build

# Deploy to any hosting service
# Upload the .next folder and package.json
```

## 🔍 Post-Deployment Checklist

- [ ] Frontend loads without errors
- [ ] Backend API endpoints respond
- [ ] Database connection works
- [ ] Image uploads to S3
- [ ] Authentication works
- [ ] Statistics dashboard loads
- [ ] Question upload works
- [ ] Search and filtering works

## 🛠️ Troubleshooting

### Common Issues:
1. **CORS Errors:** Add frontend URL to backend CORS settings
2. **Environment Variables:** Double-check all variables are set
3. **Database Connection:** Verify MongoDB URI is correct
4. **S3 Upload:** Check AWS credentials and bucket permissions

### Debug Commands:
```bash
# Check backend logs
railway logs

# Check frontend build
vercel logs

# Test API endpoints
curl https://your-backend-url.com/statistics
```

## 💰 Cost Estimation

### Vercel (Frontend)
- **Free Tier:** 100GB bandwidth, 100 serverless function executions
- **Pro:** $20/month for unlimited

### Railway (Backend)
- **Free Tier:** $5 credit/month
- **Pro:** $5/month for 1GB RAM, 1GB storage

### MongoDB Atlas
- **Free Tier:** 512MB storage
- **Shared:** $9/month for 2GB storage

### AWS S3
- **Free Tier:** 5GB storage, 20,000 requests/month
- **Standard:** ~$0.023/GB/month

## 🎉 Total Estimated Cost: $15-30/month

## 📞 Support

If you encounter issues:
1. Check the logs in your deployment platform
2. Verify all environment variables are set
3. Test API endpoints individually
4. Check database connectivity

## 🔄 Updates

To update your deployment:
```bash
# Frontend
vercel --prod

# Backend
railway up
```

---

**Your Preplens Admin system is now ready for production! 🚀** 