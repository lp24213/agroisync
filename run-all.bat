@echo off
REM Automated build, install and log capture for AgroiSync (one-click)
REM Usage: double-click this file from the project root: C:\Users\luisp\OneDrive\Área de Trabalho\agroisync

setlocal enabledelayedexpansion

echo [1/7] Locating adb inside project platform-tools...
set ADB_PATH=%~dp0platform-tools\adb.exe
if not exist "%ADB_PATH%" (
  echo adb not found at %ADB_PATH%
  echo Please ensure platform-tools is present in the project folder: %~dp0platform-tools
  pause
  exit /b 1
)

echo Using adb: %ADB_PATH%

echo [2/7] Checking connected devices...
"%ADB_PATH%" devices

echo If your device is listed as "unauthorized", unlock the phone and accept USB debugging then press any key to continue.
pause

echo Restarting adb server...
"%ADB_PATH%" kill-server >nul 2>&1
"%ADB_PATH%" start-server >nul 2>&1
"%ADB_PATH%" devices

echo [3/7] Building debug APK (this may take a few minutes)...
cd /d "%~dp0frontend\android"
call gradlew.bat assembleDebug -x lint
if errorlevel 1 (
  echo Build failed. See the Gradle output above for details.
  pause
  exit /b 2
)

echo [4/7] Locating built APK...
set APK_PATH=
for /r "%cd%\app\build\outputs\apk\debug" %%f in (*.apk) do (
  set APK_PATH=%%~ff
  goto :found_apk
)
echo APK not found in expected outputs. Search fallback...
for /r "%cd%" %%f in (*.apk) do (
  set APK_PATH=%%~ff
  goto :found_apk
)
echo APK not found. Aborting.
pause
exit /b 3

:found_apk
echo Found APK: %APK_PATH%

echo [5/7] Installing APK on device...
"%ADB_PATH%" install -r "%APK_PATH%"

echo [6/7] Starting the app (MainActivity)...
"%ADB_PATH%" shell am start -n com.agroisync.app/.MainActivity

echo [7/7] Starting log capture in a new window (C:\agroisync_errors.txt).
echo - A window titled "AgroiSync-Logcat" will open and capture AndroidRuntime errors until you close it.
start "AgroiSync-Logcat" cmd /k "%ADB_PATH% logcat AndroidRuntime:E *:S -v time > C:\agroisync_errors.txt"

echo Done. Reproduce the crash on the device now. When finished, close the "AgroiSync-Logcat" window and attach C:\agroisync_errors.txt here.
pause

endlocal
