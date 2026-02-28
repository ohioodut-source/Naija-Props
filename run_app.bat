@echo off
echo Starting Nigeria Properties App...

:: Start Backend
start "Backend Server" cmd /k "cd backend && python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000"

:: Start Frontend
start "Frontend Server" cmd /k "cd frontend && npm run dev"

echo Application started!
echo Frontend: http://192.168.100.39:5173
echo Backend: http://192.168.100.39:8000
pause
