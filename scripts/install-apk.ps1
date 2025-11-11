<#
Instala o universal.apk gerado a partir do AAB no dispositivo via adb.
Uso: Execute este script no PowerShell a partir da raiz do repositório.
Exemplo:
  .\scripts\install-apk.ps1

Observações:
- Usa o adb embutido em .\platform-tools\adb.exe se existir; caso contrário espera adb no PATH.
- Não modifica keystore ou AAB originais.
#>
Set-StrictMode -Version Latest
Write-Output "== instalar universal.apk a partir de agroisync.apks =="
$adbLocal = Join-Path $PSScriptRoot "..\platform-tools\adb.exe"
if (Test-Path $adbLocal) { $adb = (Resolve-Path $adbLocal).Path } else { $adb = "adb" }

$unpacked = Join-Path $PSScriptRoot "..\agroisync_apks_unpacked\universal.apk"
if (-not (Test-Path $unpacked)) {
    Write-Output "universal.apk não encontrado em: $unpacked"
    Write-Output "Tente primeiro: java -jar ..\bundletool-all-1.18.2.jar build-apks --bundle=\"C:\\Users\\luisp\\OneDrive\\Área de Trabalho\\agroisync\\agroisync-novo.aab\" --output=..\\agroisync.apks --mode=universal"
    exit 1
}

Write-Output "Usando adb: $adb"
try {
    $devices = & $adb devices | Select-String -Pattern 'device' -NotMatch | Out-String
} catch {
    Write-Output "Falha ao executar adb. Verifique se adb está disponível ou passe o caminho completo para adb.exe.";
    exit 2
}

# List devices properly
$devList = & $adb devices -l | Select-Object -Skip 1 | ForEach-Object { $_.Trim() } | Where-Object { $_ -ne '' }
if (-not $devList -or $devList.Count -eq 0) {
    Write-Output "Nenhum dispositivo/emulador conectado via adb. Conecte um dispositivo e execute novamente."
    exit 3
}

Write-Output "Dispositivos detectados:"; $devList | ForEach-Object { Write-Output " - $_" }

Write-Output "Instalando universal.apk (isso pode demorar alguns segundos)..."
& $adb install -r $unpacked
Write-Output "ExitCode: $LASTEXITCODE"
