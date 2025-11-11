# Install Android Platform Tools (adb) and run a quick device check
# Usage: Run from PowerShell as Administrator (or normal user). The script will download
# platform-tools to C:\platform-tools and run `adb devices`.
# If you prefer a different destination, edit $InstallDir variable.

$ErrorActionPreference = 'Stop'

$url = 'https://dl.google.com/android/repository/platform-tools-latest-windows.zip'
$InstallDir = 'C:\platform-tools'
$tempZip = Join-Path $env:TEMP 'platform-tools.zip'

Write-Host "Will download Android Platform Tools from: $url" -ForegroundColor Cyan
Write-Host "Destination: $InstallDir" -ForegroundColor Cyan

try {
    Write-Host "Downloading..." -NoNewline
    Invoke-WebRequest -Uri $url -OutFile $tempZip -UseBasicParsing
    Write-Host " done"
} catch {
    Write-Error "Failed to download platform tools. Please open the URL in a browser and download manually: $url"
    throw
}

try {
    if (Test-Path $InstallDir) {
        Write-Host "Removing existing $InstallDir" -ForegroundColor Yellow
        Remove-Item -Recurse -Force $InstallDir
    }
    Write-Host "Extracting to $InstallDir" -NoNewline
    Expand-Archive -Path $tempZip -DestinationPath $InstallDir -Force
    Write-Host " done"
    Remove-Item $tempZip -Force
} catch {
    Write-Error "Failed to extract platform tools: $_"
    throw
}

# Add to PATH for current session
$env:PATH = "$InstallDir;${env:PATH}"

Write-Host "\nRunning: adb version" -ForegroundColor Green
& "$InstallDir\adb.exe" version

Write-Host "\nDetecting connected devices (adb devices):" -ForegroundColor Green
& "$InstallDir\adb.exe" devices

Write-Host "\nIf your device appears as 'unauthorized', check your phone and accept the USB debugging prompt."
Write-Host "To capture logs after device shows as 'device', run the following in PowerShell (one line):" -ForegroundColor Cyan
Write-Host "  & '$InstallDir\adb.exe' logcat AndroidRuntime:E *:S -v time > C:\agroisync_errors.txt" -ForegroundColor White
Write-Host "Then open the app on the phone, reproduce the crash, and press Ctrl+C to stop recording. The file C:\agroisync_errors.txt will be created."

Write-Host "\nDone. If anything fails, paste the error message here and eu te ajudo." -ForegroundColor Green
