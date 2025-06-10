# MongoDB Setup Guide for Windows

This guide will help you install and configure MongoDB to resolve the database connection issues in the Telehealth Platform.

## Option 1: Local MongoDB Installation (Recommended for Development)

### Step 1: Download MongoDB Community Server
1. Visit [MongoDB Download Center](https://www.mongodb.com/try/download/community)
2. Select:
   - Version: Latest (7.0 or higher)
   - Platform: Windows
   - Package: MSI
3. Click "Download"

### Step 2: Install MongoDB
1. Run the downloaded `.msi` file as Administrator
2. Choose "Complete" installation
3. **Important**: Check "Install MongoDB as a Service" (this will auto-start MongoDB)
4. **Important**: Check "Install MongoDB Compass" (GUI tool for database management)
5. Complete the installation

### Step 3: Verify Installation
1. Open Command Prompt as Administrator
2. Run: `mongod --version`
3. If you see version information, MongoDB is installed correctly

### Step 4: Start MongoDB Service
1. Open Command Prompt as Administrator
2. Run: `net start MongoDB`
3. You should see "The MongoDB service was started successfully"

### Step 5: Test Connection
1. Navigate to your project's backend directory
2. Run: `npm run dev`
3. You should see "MongoDB connected successfully" in the console

## Option 2: MongoDB Atlas (Cloud Database)

If you prefer not to install MongoDB locally, you can use MongoDB Atlas (free tier available):

### Step 1: Create Atlas Account
1. Visit [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Sign up for a free account
3. Create a new cluster (choose the free M0 tier)

### Step 2: Configure Database Access
1. Go to "Database Access" in the Atlas dashboard
2. Add a new database user with read/write permissions
3. Note down the username and password

### Step 3: Configure Network Access
1. Go to "Network Access" in the Atlas dashboard
2. Add your IP address (or use 0.0.0.0/0 for development)

### Step 4: Get Connection String
1. Go to "Clusters" and click "Connect"
2. Choose "Connect your application"
3. Copy the connection string
4. Replace `<password>` with your database user password

### Step 5: Update Environment Variables
1. Open `backend/.env`
2. Replace the MONGODB_URI with your Atlas connection string:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/telehealth?retryWrites=true&w=majority
   ```

## Troubleshooting

### MongoDB Service Won't Start
1. Check if port 27017 is already in use:
   ```cmd
   netstat -an | findstr :27017
   ```
2. If another process is using the port, either:
   - Stop that process
   - Change MongoDB port in configuration

### Connection Refused Error
1. Ensure MongoDB service is running:
   ```cmd
   net start MongoDB
   ```
2. Check if MongoDB is listening on the correct port:
   ```cmd
   netstat -an | findstr :27017
   ```

### Permission Issues
1. Run Command Prompt as Administrator
2. Ensure MongoDB data directory has proper permissions

## Verification

Once MongoDB is properly set up, restart your backend server:

```bash
cd backend
npm run dev
```

You should see:
```
✅ MongoDB connected successfully
✅ Server running on port 4000
```

Instead of:
```
❌ MongoDB connection error: connect ECONNREFUSED 127.0.0.1:27017
```

## Next Steps

After MongoDB is working:
1. The database will automatically create collections as needed
2. You can use MongoDB Compass to view and manage your data
3. All database-dependent features (user registration, appointments, etc.) will work

## Need Help?

If you're still having issues:
1. Check the [MongoDB Documentation](https://docs.mongodb.com/manual/installation/)
2. Ensure Windows Defender/Antivirus isn't blocking MongoDB
3. Try restarting your computer after installation
4. Consider using MongoDB Atlas if local installation continues to fail