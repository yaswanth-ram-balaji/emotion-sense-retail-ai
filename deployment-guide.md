# Complete Mobile Deployment Guide

## Option 1: Cloud Deployment (Recommended)

### Step 1: Deploy Backend to Railway/Render

#### Using Railway (Free tier available):

1. **Create Railway Account**
   - Go to https://railway.app
   - Sign up with GitHub

2. **Deploy FastAPI Backend**
   - Create new project
   - Connect your GitHub repo or upload `main.py`
   - Railway will auto-detect Python and deploy

3. **Environment Setup**
   ```bash
   # Add these to Railway environment variables
   PORT=8000
   PYTHONPATH=/app
   ```

4. **Update main.py for production**
   ```python
   # Add to main.py
   import os
   from fastapi.middleware.cors import CORSMiddleware
   
   app.add_middleware(
       CORSMiddleware,
       allow_origins=["*"],  # In production, specify your domain
       allow_credentials=True,
       allow_methods=["*"],
       allow_headers=["*"],
   )
   
   if __name__ == "__main__":
       import uvicorn
       port = int(os.environ.get("PORT", 8000))
       uvicorn.run(app, host="0.0.0.0", port=port)
   ```

#### Using Render (Free tier available):

1. **Create Render Account**
   - Go to https://render.com
   - Sign up with GitHub

2. **Create Web Service**
   - New → Web Service
   - Connect repository
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

### Step 2: Update Frontend Configuration

Create a production configuration that points to your deployed backend:

```typescript
// src/config/environment.ts
export const getBackendUrl = () => {
  if (import.meta.env.PROD) {
    // Replace with your deployed backend URL
    return 'https://your-app-name.railway.app'; // or render URL
  }
  return 'http://localhost:8000'; // Development
};
```

### Step 3: Deploy Frontend to Netlify

Your frontend is already deployed, but update it to use the production backend:

1. **Update Environment Variables in Netlify**
   - Go to Netlify dashboard
   - Site settings → Environment variables
   - Add: `VITE_BACKEND_URL=https://your-backend-url.railway.app`

2. **Redeploy Frontend**
   - Push changes to GitHub
   - Netlify will auto-deploy

## Option 2: Local Network Setup (Quick Test)

### Step 1: Make Backend Accessible on Local Network

1. **Find Your Computer's IP Address**
   ```bash
   # Windows
   ipconfig
   
   # Mac/Linux
   ifconfig
   ```

2. **Run Backend with Network Access**
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

3. **Update Frontend for Local Network**
   ```typescript
   // Temporarily update backend URL to your computer's IP
   const backendUrl = "http://192.168.1.XXX:8000"; // Replace XXX with your IP
   ```

### Step 2: Test on Mobile
- Connect mobile to same WiFi
- Visit: `http://192.168.1.XXX:8080` (your computer's IP)

## Option 3: Complete Cloud Solution

### Backend Requirements File
Create `requirements.txt` for your backend:

```txt
fastapi==0.104.1
uvicorn[standard]==0.24.0
python-multipart==0.0.6
pillow==10.1.0
numpy==1.24.3
opencv-python-headless==4.8.1.78
deepface==0.0.79
tensorflow==2.13.0
```

### Dockerfile for Backend (Optional)
```dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY main.py .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## Recommended Deployment Steps

### 1. Quick Start (Railway)
1. Create Railway account
2. Upload your `main.py` and `requirements.txt`
3. Deploy automatically
4. Get your Railway URL (e.g., `https://your-app.railway.app`)

### 2. Update Frontend
1. Update backend URL in your code
2. Push to GitHub
3. Netlify auto-deploys

### 3. Test on Mobile
- Visit: https://cute-lily-7bee8d.netlify.app
- Full functionality should work!

## Cost Breakdown

### Free Tier Options:
- **Railway**: 500 hours/month free
- **Render**: 750 hours/month free
- **Netlify**: Unlimited static hosting
- **Total Cost**: $0/month

### Paid Options (if needed):
- **Railway Pro**: $5/month
- **Render**: $7/month
- **Vercel Pro**: $20/month

## Security Considerations

1. **CORS Configuration**
   - Restrict origins in production
   - Use environment variables for URLs

2. **API Keys**
   - Store sensitive data in environment variables
   - Never commit secrets to GitHub

3. **Rate Limiting**
   - Add rate limiting to prevent abuse
   - Monitor usage

## Next Steps

1. Choose deployment option (Railway recommended)
2. Deploy backend with provided configuration
3. Update frontend with production backend URL
4. Test on mobile device
5. Monitor and optimize performance

Would you like me to help you with any specific deployment platform?