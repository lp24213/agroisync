<#
Substitui arquivos mipmap ic_launcher* por `agroisync_logo_png.png` existente.
Faz backup dos arquivos originais em ./scripts/mipmap-backup-<timestamp>
Uso: executar a partir da raiz do repo:
  .\scripts\replace-mipmaps.ps1

AVISO: Isso sobrescreve imagens mipmap; não altera keystore nem AAB. Teste em staging antes de publicar.
#>
Set-StrictMode -Version Latest
Write-Output "== replace mipmaps with agroisync_logo_png.png (backup first) =="
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$resRoot = Join-Path $root "..\frontend\android\app\src\main\res"
$source = Join-Path $resRoot "drawable\agroisync_logo_png.png"
if (-not (Test-Path $source)) { Write-Output "Source logo PNG not found: $source"; exit 1 }

$timestamp = (Get-Date).ToString('yyyyMMddHHmmss')
$backup = Join-Path $root "mipmap-backup-$timestamp"
New-Item -ItemType Directory -Path $backup | Out-Null

$mipmapDirs = Get-ChildItem -Path $resRoot -Directory -Filter 'mipmap*' | Select-Object -ExpandProperty FullName
foreach ($dir in $mipmapDirs) {
    Write-Output "Processing $dir"
    $targets = Get-ChildItem -Path $dir -Include 'ic_launcher.png','ic_launcher_round.png','ic_launcher_foreground.png' -File -ErrorAction SilentlyContinue
    foreach ($t in $targets) {
        $rel = $t.FullName.Substring($resRoot.Length+1)
        $bk = Join-Path $backup ($rel -replace '[\\/]','_')
        Copy-Item -Path $t.FullName -Destination $bk -Force
        Copy-Item -Path $source -Destination $t.FullName -Force
        Write-Output "Replaced $rel (backup: $bk)"
    }
}

Write-Output "Done. Backups are in: $backup"
