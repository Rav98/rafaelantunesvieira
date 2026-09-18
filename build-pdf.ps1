# Gera os PDFs do portfólio (PT e EN) a partir do site, usando o Edge em modo headless.
# Uso:  .\build-pdf.ps1          (sobe um servidor local temporário na porta 8766)
# Saída: assets/Portfolio-Rafael-Antunes-PT.pdf e assets/Portfolio-Rafael-Antunes-EN.pdf

$ErrorActionPreference = 'Stop'
$root = $PSScriptRoot
$edge = @(
  "$env:ProgramFiles (x86)\Microsoft\Edge\Application\msedge.exe",
  "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe",
  "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe"
) | Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $edge) { throw 'Microsoft Edge não encontrado.' }

$port = 8766
# Perfil temporário limpo a cada execução, para o Edge não usar CSS/JS em cache.
$profile = Join-Path $env:TEMP 'edge-pdf-profile'
if (Test-Path $profile) { Remove-Item $profile -Recurse -Force -ErrorAction SilentlyContinue }
$server = Start-Process python -ArgumentList "-m http.server $port --bind 127.0.0.1" -WorkingDirectory $root -PassThru -WindowStyle Hidden
Start-Sleep -Seconds 1.5

try {
  foreach ($lang in 'pt', 'en') {
    $out = Join-Path $root "assets\Portfolio-Rafael-Antunes-$($lang.ToUpper()).pdf"
    $url = "http://127.0.0.1:$port/index.html?lang=$lang"
    if (Test-Path $out) { Remove-Item $out -Force }
    & $edge --headless=new --disable-gpu --no-pdf-header-footer `
      --virtual-time-budget=8000 `
      --user-data-dir="$profile" `
      --print-to-pdf="$out" $url 2>$null | Out-Null
    # O Edge pode retornar antes de terminar a gravação: aguarda o arquivo estabilizar.
    $last = -1
    for ($i = 0; $i -lt 60; $i++) {
      Start-Sleep -Milliseconds 500
      if (Test-Path $out) {
        $len = (Get-Item $out).Length
        if ($len -gt 0 -and $len -eq $last) { break }
        $last = $len
      }
    }
    if ((Test-Path $out) -and (Get-Item $out).Length -gt 0) { Write-Host "OK  -> $out" } else { Write-Warning "Falhou: $out" }
  }
} finally {
  Stop-Process -Id $server.Id -Force -ErrorAction SilentlyContinue
}
