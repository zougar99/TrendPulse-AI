@echo off
title TrendPulse AI - Intelligence Engine
color 0D
cls

echo ============================================
echo   TrendPulse AI - Intelligence Engine
echo   21 AI-Powered Features
echo ============================================
echo.

:: Find Python
set PYTHON_CMD=python
where python >nul 2>nul
if %errorlevel% neq 0 (
    if exist "C:\Program Files\Python314\python.exe" set PYTHON_CMD=C:\Program Files\Python314\python.exe
    if exist "C:\Python314\python.exe" set PYTHON_CMD=C:\Python314\python.exe
)

echo [1/2] Checking dependencies...
%PYTHON_CMD% -c "import PyQt6" 2>nul
if %errorlevel% neq 0 (
    echo Installing PyQt6...
    %PYTHON_CMD% -m pip install PyQt6 requests --quiet
)
echo Done!
echo.

echo [2/2] Launching TrendPulse Desktop...
echo.
start "" /B %PYTHON_CMD% -m desktop.runner
echo The TrendPulse AI window should open now.
echo Close the window to stop the application.
echo.
pause
