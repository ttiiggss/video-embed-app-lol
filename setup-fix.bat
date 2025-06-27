@echo off
echo Troubleshooting Vite setup...
echo.
echo Checking files...
if exist index.html (echo ✅ index.html found) else (echo ❌ index.html missing)
if exist src\main.jsx (echo ✅ src\main.jsx found) else (echo ❌ src\main.jsx missing)
if exist vite.config.js (echo ✅ vite.config.js found) else (echo ❌ vite.config.js missing)
echo.
echo If you're getting entry point errors, try:
echo 1. copy vite.config.minimal.js vite.config.js
echo 2. npm run dev
echo.
pause 