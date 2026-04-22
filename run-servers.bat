@echo off
echo ===================================================
echo Starting CIT-U Inventory System
echo ===================================================

echo Starting Backend (Spring Boot)...
start "Backend Server" cmd /c "cd backend && mvn -Dmaven.compiler.skip=true spring-boot:run"

echo Starting Frontend (Vite/React)...
start "Frontend Server" cmd /k "cd frontend && npm.cmd run dev"

echo.
echo Both servers have been started in separate windows!
echo.
echo -> Access the Frontend at: http://localhost:5173
echo -> Backend API is running on: http://localhost:8080
echo.
echo Note: If you cannot log in, make sure you register an account first.
echo (You can use the 'Request Access' link on the login page).
echo.
pause
