@echo off
echo Building AgroSync Frontend...
cd frontend
npm install
npm run build
echo.
echo Frontend build completed!
echo Files ready in: frontend/dist/
pause
