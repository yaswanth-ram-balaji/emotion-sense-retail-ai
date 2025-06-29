# Railway Deployment Guide

## Step 1: Prepare Your Backend

1. **Copy the production files**:
   - Copy `main-production.py` to `main.py` (replace existing)
   - Use the provided `requirements.txt`

2. **Test locally** (optional):
   ```bash
   pip install -r requirements.txt
   uvicorn main:app --host 0.0.0.0 --port 8000
   ```

## Step 2: Deploy to Railway

1. **Create Railway Account**:
   - Go to https://railway.app
   - Sign up with GitHub

2. **Create New Project**:
   - Click "New Project"
   - Choose "Deploy from GitHub repo" or "Empty Project"

3. **Upload Files**:
   - If using empty project, upload:
     - `main.py` (the production version)
     - `requirements.txt`

4. **Configure Environment**:
   - Go to Variables tab
   - Add: `PORT=8000` (Railway will auto-assign)

5. **Deploy**:
   - Railway auto-detects Python and deploys
   - Wait for deployment to complete
   - Copy your Railway URL (e.g., `https://your-app.railway.app`)

## Step 3: Update Frontend

1. **Update environment config**:
   ```typescript
   // In src/config/environment.ts
   // Replace 'your-backend-url-here.railway.app' with your actual Railway URL
   ```

2. **Set Netlify Environment Variable**:
   - Go to Netlify dashboard
   - Site settings → Environment variables
   - Add: `VITE_BACKEND_URL=https://your-app.railway.app`

3. **Redeploy Frontend**:
   - Push changes to GitHub
   - Netlify auto-deploys

## Step 4: Test on Mobile

1. Visit: https://cute-lily-7bee8d.netlify.app
2. Test all features on your mobile device
3. Camera, emotion detection, and analytics should all work!

## Troubleshooting

- **Backend not responding**: Check Railway logs
- **CORS errors**: Verify frontend URL in CORS settings
- **Camera not working**: Check browser permissions

Your app will now work fully on mobile with permanent cloud hosting!