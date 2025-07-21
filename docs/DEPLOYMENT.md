# 🚀 Deployment Guide - From GitHub to Live Website

## 🎯 Overview
Once your code is on GitHub, you can deploy it to make it accessible to everyone on the internet.

## 🌐 Frontend Deployment Options

### **Option 1: Vercel (Recommended)**

1. **Go to Vercel**
   - Visit: https://vercel.com/
   - Click "Sign up" and use your GitHub account

2. **Import Repository**
   - Click "New Project"
   - Select "Import Git Repository"
   - Choose your `kushalara-token` repository

3. **Configure Project**
   - Framework Preset: Vite
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - You'll get a URL like: `https://kushalara-token.vercel.app`

### **Option 2: Netlify**

1. **Go to Netlify**
   - Visit: https://netlify.com/
   - Sign up with GitHub

2. **Deploy from GitHub**
   - Click "New site from Git"
   - Choose GitHub and authorize
   - Select your repository

3. **Build Settings**
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/dist`

4. **Deploy**
   - Click "Deploy site"
   - Get your URL like: `https://amazing-name-123456.netlify.app`

### **Option 3: GitHub Pages**

1. **Enable GitHub Pages**
   - Go to your repository settings
   - Scroll to "Pages" section
   - Source: Deploy from a branch
   - Branch: main, folder: `/frontend/dist`

2. **Build Locally**
   - Clone repository
   - `cd frontend && npm install && npm run build`
   - Commit and push the `dist` folder

3. **Access**
   - URL: `https://YOUR_USERNAME.github.io/kushalara-token`

## 🔧 Backend Deployment Options

### **Option 1: Railway (Recommended)**

1. **Go to Railway**
   - Visit: https://railway.app/
   - Sign up with GitHub

2. **Deploy from GitHub**
   - Click "Deploy from GitHub repo"
   - Select your `kushalara-token` repository

3. **Configure**
   - Root directory: `backend`
   - Start command: `python app.py`

4. **Environment Variables**
   - Add your `.env` variables in Railway dashboard:
     ```
     HUBSPOT_API_KEY=your_key
     EMAIL_USERNAME=your_email
     EMAIL_PASSWORD=your_password
     ```

5. **Deploy**
   - Railway will automatically deploy
   - Get URL like: `https://kushalara-backend-production.up.railway.app`

### **Option 2: Render**

1. **Go to Render**
   - Visit: https://render.com/
   - Sign up with GitHub

2. **Create Web Service**
   - Click "New" → "Web Service"
   - Connect your GitHub repository

3. **Configure**
   - Name: `kushalara-backend`
   - Root Directory: `backend`
   - Runtime: Python 3
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `python app.py`

4. **Environment Variables**
   - Add all your environment variables

5. **Deploy**
   - Click "Create Web Service"
   - Get URL like: `https://kushalara-backend.onrender.com`

### **Option 3: Heroku**

1. **Install Heroku CLI**
   - Download from: https://devcenter.heroku.com/articles/heroku-cli

2. **Create Procfile**
   - In `backend/` folder, create file named `Procfile`:
     ```
     web: python app.py
     ```

3. **Deploy**
   ```bash
   cd backend
   heroku create kushalara-backend
   git subtree push --prefix backend heroku main
   ```

## 🔗 Connecting Frontend to Backend

### **Update Frontend URLs**

1. **Edit Application Files**
   - `frontend/src/pages/CitizenshipApplication.jsx`
   - `frontend/src/pages/EResidencyApplication.jsx`

2. **Replace localhost URLs**
   ```javascript
   // OLD:
   fetch('http://localhost:5000/api/applications/citizenship'
   
   // NEW:
   fetch('https://your-backend-url.railway.app/api/applications/citizenship'
   ```

3. **Redeploy Frontend**
   - Commit changes to GitHub
   - Frontend will automatically redeploy

## 🌍 Full Deployment Example

### **Complete Setup**

1. **Deploy Backend to Railway**
   - URL: `https://kushalara-backend-production.up.railway.app`

2. **Update Frontend**
   ```javascript
   const BACKEND_URL = 'https://kushalara-backend-production.up.railway.app'
   
   // In both application files:
   fetch(`${BACKEND_URL}/api/applications/citizenship`, {
   ```

3. **Deploy Frontend to Vercel**
   - URL: `https://kushalara-token.vercel.app`

4. **Test Everything**
   - Visit frontend URL
   - Submit test applications
   - Check backend logs
   - Verify HubSpot integration

## 📱 Custom Domain (Optional)

### **Frontend Custom Domain**

1. **Buy Domain** (GoDaddy, Namecheap, etc.)
2. **Add to Vercel/Netlify**
   - Go to project settings
   - Add custom domain
   - Update DNS records as instructed

### **Backend Custom Domain**

1. **Add to Railway/Render**
   - Go to service settings
   - Add custom domain
   - Update DNS records

## 🔧 Environment Variables

### **Production Environment**

```env
# Backend (.env)
HUBSPOT_API_KEY=your_production_hubspot_key
EMAIL_USERNAME=your_production_email
EMAIL_PASSWORD=your_production_password
FLASK_ENV=production
FLASK_DEBUG=False
DATABASE_URL=your_production_database_url
```

### **Security Considerations**

1. **Never commit `.env` files**
2. **Use different API keys for production**
3. **Enable HTTPS only**
4. **Set strong passwords**
5. **Regularly rotate API keys**

## 📊 Monitoring

### **Frontend Monitoring**
- Vercel Analytics
- Google Analytics
- Error tracking with Sentry

### **Backend Monitoring**
- Railway/Render logs
- Database monitoring
- API response times
- Error tracking

## 🆘 Troubleshooting

### **Common Issues**

#### **Build Failures**
- Check build logs
- Verify dependencies in package.json
- Ensure correct Node.js version

#### **Backend Not Starting**
- Check environment variables
- Verify requirements.txt
- Check Python version compatibility

#### **CORS Errors**
- Verify backend CORS settings
- Check frontend URL in requests
- Ensure backend is accessible

#### **Database Issues**
- Check database URL
- Verify database permissions
- Monitor database logs

## 🎯 Success Checklist

- [ ] Backend deployed and accessible
- [ ] Frontend deployed and accessible
- [ ] Frontend connected to backend
- [ ] Environment variables configured
- [ ] Forms submit successfully
- [ ] HubSpot integration working
- [ ] Email notifications working
- [ ] Admin dashboard accessible
- [ ] Mobile responsive design working
- [ ] Custom domain configured (optional)

## 📞 Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Railway Docs**: https://docs.railway.app/
- **Netlify Docs**: https://docs.netlify.com/
- **Render Docs**: https://render.com/docs

Your KushAlara website is now live and accessible to the world! 🌍

