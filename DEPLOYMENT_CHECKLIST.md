# 🚀 Deployment Checklist

## ✅ **Pre-Deployment (COMPLETED)**
- [x] Code pushed to GitHub
- [x] Repository cleaned (no node_modules)
- [x] Backend tested locally
- [x] Frontend tested locally
- [x] Environment variables ready

## 🔧 **Backend Deployment (Render)**

### Step 1: Create Render Account
- [ ] Go to https://dashboard.render.com
- [ ] Sign in with GitHub

### Step 2: Create Web Service
- [ ] Click "New +" → "Web Service"
- [ ] Connect repository: `adipreplens/PreplensAdmin`
- [ ] Configure:
  ```
  Name: preplens-backend
  Root Directory: backend
  Runtime: Node
  Build Command: npm install
  Start Command: node index.js
  ```

### Step 3: Add Environment Variables
- [ ] Add these variables:
  ```
  MONGODB_URI=mongodb+srv://shreyashchaudhary81:hfOYtcA7zywQsxJP@preplensadmin.mmrvf6s.mongodb.net/Preplensadmin?retryWrites=true&w=majority&appName=Preplensadmin
  AWS_ACCESS_KEY_ID=YOUR_AWS_ACCESS_KEY
  AWS_SECRET_ACCESS_KEY=YOUR_AWS_SECRET_KEY
  AWS_REGION=us-east-1
  S3_BUCKET_NAME=preplens-assets-prod
  ```

### Step 4: Deploy
- [ ] Click "Create Web Service"
- [ ] Wait for deployment to complete
- [ ] Copy the URL (e.g., https://preplens-backend.onrender.com)

## 🌐 **Frontend Deployment (Vercel)**

### Step 1: Create Vercel Account
- [ ] Go to https://vercel.com/dashboard
- [ ] Sign in with GitHub

### Step 2: Import Project
- [ ] Click "New Project"
- [ ] Import repository: `adipreplens/PreplensAdmin`
- [ ] Configure:
  ```
  Root Directory: ./
  Framework Preset: Next.js
  Build Command: npm run build
  Output Directory: .next
  ```

### Step 3: Add Environment Variables
- [ ] Add this variable:
  ```
  NEXT_PUBLIC_API_URL=https://your-render-backend-url.onrender.com
  ```

### Step 4: Deploy
- [ ] Click "Deploy"
- [ ] Wait for deployment to complete
- [ ] Copy the URL (e.g., https://preplens-admin.vercel.app)

## ✅ **Post-Deployment Checklist**
- [ ] Test backend API endpoints
- [ ] Test frontend functionality
- [ ] Verify image uploads work
- [ ] Test question creation and listing
- [ ] Check statistics dashboard
- [ ] Test bulk upload functionality

## 🔧 **Troubleshooting**
- [ ] Check Render logs for backend errors
- [ ] Check Vercel logs for frontend errors
- [ ] Verify environment variables are set correctly
- [ ] Test API connectivity between frontend and backend 