@echo off
title Rename Folder
echo Renaming "youtube follofw" to "TrendPulse"...
cd /d "%~dp0"
if exist "TrendPulse" (
    echo ERROR: A folder named "TrendPulse" already exists on Desktop.
    pause
    exit /b 1
)
if exist "youtube follofw" (
    ren "youtube follofw" "TrendPulse"
    echo Done! Folder renamed to TrendPulse.
    echo.
    echo Now open "TrendPulse" folder and double-click START.bat
) else (
    echo ERROR: "youtube follofw" folder not found.
)
pause
