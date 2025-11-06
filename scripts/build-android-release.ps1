<#
PowerShell helper to build a release AAB (bundle) for the Android app.

Usage:
  1. Run this script from the repo root in PowerShell:
     .\scripts\build-android-release.ps1

  2. The script will ask for keystore path and credentials and will create
     (or update) frontend/android/keystore.properties locally. This file
     must NOT be committed to git.

  3. The script will change directory to frontend/android and invoke Gradle
     wrapper to build the release bundle. On success it prints the path
     to the generated AAB (app-release.aab or the bundle file under app/build/outputs/bundle/).

Security notes:
  - Never paste secrets into chat.
  - Keep the generated keystore.properties local and add it to .gitignore.
#>

param()

Write-Host "This script will create (or update) frontend/android/keystore.properties and then build a release AAB."

$keystorePropsPath = Join-Path -Path $PSScriptRoot -ChildPath "..\frontend\android\keystore.properties" | Resolve-Path -Relative
$androidDir = Join-Path -Path $PSScriptRoot -ChildPath "..\frontend\android" | Resolve-Path

# Ask for values (do not echo passwords)
$storeFile = Read-Host "Absolute path to your keystore file (e.g. C:\keystores\agroisync.jks)"
$keyAlias = Read-Host "Key alias"
$storePassword = Read-Host -AsSecureString "Keystore password (will be written to keystore.properties)"
$keyPassword = Read-Host -AsSecureString "Key password (will be written to keystore.properties)"

# Convert secure strings to plain (we must write them locally). Warn the user.
$plainStorePassword = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($storePassword))
$plainKeyPassword = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($keyPassword))

Write-Host "\nWill write keystore properties to: $keystorePropsPath"
Write-Host "DO NOT commit that file to git. It contains sensitive secrets."

$confirm = Read-Host "Proceed and write file? Type 'yes' to continue"
if ($confirm -ne 'yes') {
    Write-Host "Aborted by user. No files written." -ForegroundColor Yellow
    exit 1
}

# Create directory if not exists
$keystoreDir = Split-Path -Path $keystorePropsPath -Parent
if (!(Test-Path $keystoreDir)) { New-Item -ItemType Directory -Path $keystoreDir -Force | Out-Null }

# Write keystore.properties
$propsContent = @"
storeFile=$storeFile
keyAlias=$keyAlias
storePassword=$plainStorePassword
keyPassword=$plainKeyPassword
"@

Set-Content -Path $keystorePropsPath -Value $propsContent -Encoding UTF8
Write-Host "Wrote keystore.properties (local)."

# Build with gradlew
Push-Location $androidDir
try {
    Write-Host "Running Gradle wrapper to build release bundle (this may take a few minutes)..."
    # Use gradlew.bat on Windows
    $gradlew = Join-Path -Path $androidDir -ChildPath 'gradlew.bat'
    if (!(Test-Path $gradlew)) {
        Write-Host "gradlew.bat not found in $androidDir. Make sure you're in an Android project with the Gradle wrapper." -ForegroundColor Red
        exit 1
    }

    & $gradlew bundleRelease 2>&1 | Tee-Object -Variable gradleOutput
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Gradle build failed. See output above." -ForegroundColor Red
        exit $LASTEXITCODE
    }

    # Locate generated AAB
    $bundleDir = Join-Path -Path $androidDir -ChildPath "app\build\outputs\bundle\release"
    if (Test-Path $bundleDir) {
        $aab = Get-ChildItem -Path $bundleDir -Filter *.aab -Recurse | Sort-Object LastWriteTime -Descending | Select-Object -First 1
        if ($aab) {
            Write-Host "\nBuild succeeded. AAB created at:" -ForegroundColor Green
            Write-Host $aab.FullName
            # Offer to copy to Desktop
            $copy = Read-Host "Deseja copiar o AAB para a sua Área de Trabalho? (yes/no)"
            if ($copy -eq 'yes') {
                $desktop = [Environment]::GetFolderPath('Desktop')
                $dest = Join-Path -Path $desktop -ChildPath $aab.Name
                Copy-Item -Path $aab.FullName -Destination $dest -Force
                Write-Host "Copiado para: $dest" -ForegroundColor Green
            } else {
                Write-Host "Não copiado. Você pode encontrar o AAB em: $($aab.FullName)" -ForegroundColor Cyan
            }
        } else {
            Write-Host "Build succeeded but couldn't find .aab in $bundleDir" -ForegroundColor Yellow
        }
    } else {
        Write-Host "Build succeeded but bundle output directory not found: $bundleDir" -ForegroundColor Yellow
    }
} finally {
    Pop-Location
}

Write-Host "Done. Remember to keep keystore.properties secure and add it to your .gitignore if not already ignored." -ForegroundColor Cyan
