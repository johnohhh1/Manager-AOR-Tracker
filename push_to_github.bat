@echo off
cd /d C:\Users\John\Desktop\manager-aor-tracker

echo Initializing git repository...
git init

echo.
echo Adding all files...
git add .

echo.
echo Creating initial commit...
git commit -m "Initial commit - Manager AOR Tracker for Chili's #605"

echo.
echo Adding remote repository...
git remote add origin https://github.com/johnohhh1/Manager-AOR-Tracker.git

echo.
echo Pushing to GitHub...
git branch -M main
git push -u origin main

echo.
echo ========================================
echo Successfully pushed to GitHub!
echo Repository: https://github.com/johnohhh1/Manager-AOR-Tracker
echo ========================================
pause
