# Telehealth Platform - Troubleshooting Guide

This guide addresses the current limitations and provides step-by-step solutions to get your telehealth platform fully functional.

## 🔧 Current Issues and Solutions

### 1. MongoDB Connection Error ❌

**Error Message:**
```
MongoDB connection error: connect ECONNREFUSED 127.0.0.1:27017
```

**Root Cause:** MongoDB is not installed or not running on your system.

**Solutions:**

#### Option A: Install MongoDB Locally (Recommended for Development)
1. **Quick Setup:** Run the automated setup script:
   ```cmd
   setup-windows.bat
   ```

2. **Manual Setup:** Follow the detailed [MongoDB Setup Guide](./MONGODB_SETUP_GUIDE.md)

#### Option B: Use MongoDB Atlas (Cloud Database)
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a cluster and get your connection string
3. Update `backend/.env`:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/telehealth?retryWrites=true&w=majority
   ```

**Verification:**
After setup, restart the backend server. You should see:
```
✅ MongoDB connected successfully
```

### 2. Twilio Initialization Error ❌

**Error Message:**
```
Twilio initialization failed: accountSid must start with AC
```

**Root Cause:** Invalid Twilio credentials in environment variables.

**Solution:**
This has been **automatically fixed** in the latest update. The system now:
- ✅ Gracefully handles placeholder Twilio credentials
- ✅ Only initializes Twilio with valid credentials
- ✅ Provides clear status messages

**To Enable SMS Features (Optional):**
1. Sign up at [Twilio Console](https://console.twilio.com/)
2. Get your Account SID and Auth Token
3. Update `backend/.env`:
   ```env
   TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   TWILIO_AUTH_TOKEN=your_actual_auth_token
   TWILIO_PHONE_NUMBER=+1234567890
   ```

**Current Status:**
```
ℹ️ Twilio disabled - SMS features unavailable
```

### 3. Frontend URL Mismatch ⚠️

**Issue:** Frontend runs on port 3000, but backend expects port 3001.

**Solution:** **Already Fixed** ✅
- Updated `FRONTEND_URL=http://localhost:3000` in `.env`
- CORS configuration now matches frontend port

## 🚀 Quick Fix Summary

The following issues have been **automatically resolved**:

1. ✅ **Twilio Error Fixed:** No more "accountSid must start with AC" errors
2. ✅ **Frontend URL Fixed:** CORS and URL configuration corrected
3. ✅ **Environment Variables:** Improved with safe defaults
4. ✅ **Error Handling:** Better error messages and graceful degradation

## 🔄 Restart Instructions

After applying the fixes:

1. **Stop current servers** (Ctrl+C in both terminals)

2. **Restart Backend:**
   ```cmd
   cd backend
   npm run dev
   ```
   Expected output:
   ```
   ℹ️ Twilio disabled - SMS features unavailable
   ✅ MongoDB connected successfully (if MongoDB is installed)
   ✅ Server running on port 4000
   ```

3. **Restart Frontend:**
   ```cmd
   cd frontend
   npm run dev
   ```
   Expected output:
   ```
   ✅ Ready on http://localhost:3000
   ```

## 🎯 What Works Now

### ✅ Fully Functional (No Database Required)
- Frontend UI and navigation
- Static pages and components
- Client-side routing
- Basic API endpoints
- Real-time communication setup (Socket.io)

### ⚠️ Requires MongoDB for Full Functionality
- User registration and authentication
- Appointment booking and management
- Patient and doctor profiles
- Medical records storage
- Appointment history

### 📱 Optional Features (Requires Configuration)
- SMS notifications (requires Twilio setup)
- Payment processing (requires Stripe setup)

## 🔍 Verification Checklist

Run through this checklist to ensure everything is working:

- [ ] Backend starts without errors
- [ ] Frontend loads at http://localhost:3000
- [ ] No Twilio initialization errors
- [ ] MongoDB connection (if installed) or graceful fallback
- [ ] CORS errors resolved
- [ ] Socket.io connection established

## 🆘 Still Having Issues?

### Check Logs
1. **Backend logs:** Look for error messages in the backend terminal
2. **Frontend logs:** Check browser console (F12) for errors
3. **Network tab:** Check for failed API requests

### Common Solutions
1. **Clear npm cache:**
   ```cmd
   npm cache clean --force
   ```

2. **Reinstall dependencies:**
   ```cmd
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Check port conflicts:**
   ```cmd
   netstat -an | findstr :3000
   netstat -an | findstr :4000
   ```

4. **Restart with clean slate:**
   - Close all terminals
   - Restart your code editor
   - Run setup script again

## 📞 Support

If you're still experiencing issues:
1. Check the error messages carefully
2. Refer to the specific setup guides
3. Ensure all prerequisites are installed
4. Try the automated setup script first

---

**Last Updated:** After fixing Twilio initialization and MongoDB connection handling