@echo off
REM Run the PowerShell capture script (double-click this file to run)
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\capture-adb-log.ps1"
pause
