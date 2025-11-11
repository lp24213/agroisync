<#
Capture ADB AndroidRuntime errors to a file and show tail.

Usage:
  Open PowerShell as Administrator (recommended), cd to project root and run:
    Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
    .\scripts\capture-adb-log.ps1

This script will locate adb, show devices, then prompt you to start a capture.
When capturing: open the app on the phone and reproduce the crash. Return and press Enter
to stop capture. The script will then print the last 300 lines from the capture file.

Output file: C:\agroisync_errors.txt
#>

Set-StrictMode -Version Latest

function Find-ADB {
    $candidates = @(
        "C:\platform-tools\adb.exe",
        "$env:USERPROFILE\platform-tools\adb.exe",
        "$env:USERPROFILE\Downloads\platform-tools\adb.exe",
        "$env:USERPROFILE\Downloads\adb.exe",
        "$env:USERPROFILE\Downloads\platform-tools\platform-tools\adb.exe"
    )

    # Also check for a platform-tools folder inside the project (adjacent to the scripts folder)
    try {
        $scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
        $projectPlatform = Join-Path $scriptRoot "..\platform-tools\adb.exe"
        $projectPlatformResolved = Resolve-Path -Path $projectPlatform -ErrorAction SilentlyContinue
        if ($projectPlatformResolved) { $candidates = ,$projectPlatformResolved.Path + $candidates }
    } catch {}

    foreach ($p in $candidates) {
        if (Test-Path $p) { return (Resolve-Path $p).Path }
    }

    # fallback: search Downloads for adb.exe (fast)
    try {
        $found = Get-ChildItem -Path "$env:USERPROFILE\Downloads" -Filter adb.exe -Recurse -ErrorAction SilentlyContinue | Select-Object -First 1
        if ($found) { return $found.FullName }
    } catch {}

    return $null
}

$adb = Find-ADB
if (-not $adb) {
    Write-Host "adb not found. Por favor extraia o platform-tools em C:\platform-tools ou na sua pasta Downloads." -ForegroundColor Red
    Write-Host "Se preferir, rode o script 'install-platform-tools.ps1' que está em .\scripts" -ForegroundColor Yellow
    exit 2
}

Write-Host "Usando adb: $adb" -ForegroundColor Green

try {
    & "$adb" version
} catch {
    Write-Host "Falha ao executar adb version: $_" -ForegroundColor Red
}

Write-Host "Detectando dispositivos (adb devices):" -ForegroundColor Green
& "$adb" devices

Write-Host "\nQuando o aparelho aparecer como 'device', pressione Enter para iniciar a captura de erros.\n" -ForegroundColor Cyan
Read-Host -Prompt "Pressione Enter para iniciar a captura (abra o app no celular e reproduza o crash)"

$outFile = 'C:\agroisync_errors.txt'
if (Test-Path $outFile) { Remove-Item $outFile -Force }

Write-Host "Iniciando captura -> $outFile" -ForegroundColor Green

# Start as background job so the script can wait for user input to stop
$job = Start-Job -ScriptBlock {
    param($adbPath, $out)
    & $adbPath logcat AndroidRuntime:E *:S -v time > $out
} -ArgumentList $adb, $outFile

Write-Host "Capturando... Abra o app e reproduza o erro. Quando terminar, volte aqui e pressione Enter para parar." -ForegroundColor Yellow
Read-Host -Prompt "Pressione Enter para PARAR a captura"

Write-Host "Parando captura..." -ForegroundColor Green
Stop-Job $job | Out-Null
Receive-Job $job | Out-Null
Remove-Job $job | Out-Null

if (Test-Path $outFile) {
    Write-Host "Exibindo as últimas 300 linhas do arquivo de erros:" -ForegroundColor Cyan
    Get-Content $outFile -Tail 300
} else {
    Write-Host "Arquivo de captura não encontrado: $outFile" -ForegroundColor Red
}

Write-Host "\nSe vir 'FATAL EXCEPTION' ou 'AndroidRuntime' cole o bloco aqui para que eu analise." -ForegroundColor Green
