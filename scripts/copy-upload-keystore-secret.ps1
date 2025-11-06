# Usage: run this script from PowerShell to copy the Base64 contents of upload-keystore.jks to the clipboard
$base64Path = "$PSScriptRoot\..\frontend\android\upload-keystore.b64"
if(-not (Test-Path $base64Path)){
    Write-Error "Base64 file not found: $base64Path. Run the repo script to generate it or ask me to generate."
    exit 1
}
$content = Get-Content -Raw -Path $base64Path
Set-Clipboard -Value $content
Write-Host "Upload keystore Base64 copied to clipboard. Paste into the GitHub secret 'ANDROID_KEYSTORE_BASE64'."