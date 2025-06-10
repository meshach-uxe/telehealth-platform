@echo off
echo ========================================
echo Telehealth Platform Setup for Windows
echo ========================================
echo.

echo [1/5] Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)
echo Node.js is installed

echo.
echo [2/5] Checking if MongoDB is installed...
mongod --version >nul 2>&1
if %errorlevel% neq 0 (
    echo MongoDB is not installed. Please follow these steps:
    echo 1. Download MongoDB Community Server from https://www.mongodb.com/try/download/community
    echo 2. Install MongoDB with default settings
    echo 3. Add MongoDB bin directory to your PATH environment variable
    echo 4. Run this script again
    echo.
    echo Alternative: Use MongoDB Atlas (cloud) by updating MONGODB_URI in .env
    pause
    exit /b 1
)
echo MongoDB is installed

echo.
echo [3/5] Starting MongoDB service...
net start MongoDB >nul 2>&1
if %errorlevel% neq 0 (
    echo Warning: Could not start MongoDB service automatically
    echo Please start MongoDB manually or ensure it's running
)

echo.
echo [4/5] Installing backend dependencies...
cd backend
npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install backend dependencies
    pause
    exit /b 1
)

echo.
echo [5/5] Installing frontend dependencies...
cd ..\frontend
npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install frontend dependencies
    pause
    exit /b 1
)

cd ..
echo.
echo ========================================
echo Setup completed successfully!
echo ========================================
echo.
echo Next steps:
echo 1. Configure your .env file in the backend directory
echo 2. Add your Twilio credentials (optional for SMS features)
echo 3. Run 'npm run dev' in both backend and frontend directories
echo.
echo For MongoDB Atlas (cloud database):
echo - Update MONGODB_URI in backend/.env with your Atlas connection string
echo.
pause