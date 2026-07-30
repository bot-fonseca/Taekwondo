param([string]$Comando = "")

$PaginasFonte = [ordered]@{
    "seogi"   = "https://www.taekwondopreschool.com/stances.html"
    "jireugi" = "https://www.taekwondopreschool.com/punchesandstrikes.html"
    "makgi"   = "https://www.taekwondopreschool.com/blocks.html"
    "chagi"   = "https://www.taekwondopreschool.com/kicks.html"
}

$TecnicasPorCategoria = [ordered]@{
    "seogi"   = @("sq-charyeot","sq-narani","sq-juchum","sq-ap","sq-apkubi","sq-dwitkubi","sq-beom","sq-koa")
    "jireugi" = @("at-momtong-jireugi","at-eolgul-jireugi","at-arae-jireugi","at-dubeon-jireugi","at-sonnal-chigi","at-deung-jumeok","at-palkup-chigi","at-pyeonsonkeut")
    "makgi"   = @("bl-arae-makgi","bl-momtong-makgi","bl-eolgul-makgi","bl-an-makgi","bl-bakat-makgi","bl-sonnal-makgi","bl-hecho-makgi","bl-gawi-makgi")
    "chagi"   = @("ck-ap-chagi","ck-dollyo-chagi","ck-yeop-chagi","ck-dwit-chagi","ck-naeryeo-chagi","ck-bandal-chagi","ck-huryeo-chagi","ck-dwit-huryeo")
}

$PastaStaging     = ".\downloaded_images"
$PastaPublica     = ".\public\images\techniques"
$FicheiroTemplate = ".\image_mapping_template.json"
$FicheiroMapping  = ".\image_mapping.json"
$IgnorarSeContem  = @("logo","icon","banner","favicon","sprite","button")
$ExtensoeValidas  = @("jpg","jpeg","png","gif","webp")
$Headers = @{ "User-Agent" = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36" }

function Invoke-Download {
    $ImagensPorCategoria = @{}

    foreach ($cat in $PaginasFonte.Keys) {
        $url   = $PaginasFonte[$cat]
        $pasta = Join-Path $PastaStaging $cat
        New-Item -ItemType Directory -Path $pasta -Force | Out-Null
        Write-Host ""
        Write-Host "[$cat] A aceder a: $url"

        try {
            $resp = Invoke-WebRequest -Uri $url -Headers $Headers -UseBasicParsing -TimeoutSec 20
        } catch {
            Write-Host "  ERRO: $_"
            $ImagensPorCategoria[$cat] = @()
            continue
        }

        $ext     = ($ExtensoeValidas -join "|")
        $pattern = "(?i)[`"']([^`"']*\.(?:$ext))[`"']"
        $found   = [regex]::Matches($resp.Content, $pattern)

        $seen   = [System.Collections.Generic.HashSet[string]]::new()
        $links  = foreach ($m in $found) {
            $l = $m.Groups[1].Value
            if ($seen.Add($l)) { $l }
        }

        $descarregados = @()
        foreach ($link in $links) {
            $ll = $link.ToLower()
            if ($IgnorarSeContem | Where-Object { $ll -like "*$_*" }) { continue }

            try {
                $base   = [System.Uri]$url
                $imgUri = [System.Uri]::new($base, $link)
                $imgUrl = $imgUri.AbsoluteUri
            } catch { continue }

            $nome    = ($imgUrl -split "/")[-1] -replace "\?.*",""
            $caminho = Join-Path $pasta $nome

            try {
                Invoke-WebRequest -Uri $imgUrl -Headers $Headers -OutFile $caminho -UseBasicParsing -TimeoutSec 15 | Out-Null
                Write-Host "  [OK] $nome"
                $descarregados += $nome
            } catch {
                Write-Host "  [ERRO] $nome : $_"
            }
        }
        $ImagensPorCategoria[$cat] = $descarregados
    }

    $tecnicasMapping = [ordered]@{}
    foreach ($cat in $TecnicasPorCategoria.Keys) {
        foreach ($tid in $TecnicasPorCategoria[$cat]) {
            $tecnicasMapping[$tid] = $null
        }
    }

    $template = [ordered]@{
        "_instrucoes"         = "Preenche cada ID com o nome do ficheiro descarregado (ex: 'ck-ap-chagi': 'frontKick.jpg'). Deixa null para tecnicas sem imagem. Guarda como image_mapping.json e corre: .\scraper_tkd.ps1 apply"
        "tecnica_para_imagem" = $tecnicasMapping
        "imagens_disponiveis" = $ImagensPorCategoria
    }

    $template | ConvertTo-Json -Depth 5 | Set-Content -Path $FicheiroTemplate -Encoding UTF8

    Write-Host ""
    Write-Host "[DONE] Download concluido."
    Write-Host "   Imagens em:  $PastaStaging"
    Write-Host "   Template em: $FicheiroTemplate"
    Write-Host ""
    Write-Host "Proximo passo:"
    Write-Host "   1. Copia '$FicheiroTemplate' para '$FicheiroMapping'"
    Write-Host "   2. Preenche os IDs com os nomes das imagens certas"
    Write-Host "   3. Corre: .\scraper_tkd.ps1 apply"
}

function Invoke-Apply {
    if (-not (Test-Path $FicheiroMapping)) {
        Write-Host "ERRO: '$FicheiroMapping' nao encontrado."
        Write-Host "Copia '$FicheiroTemplate' para '$FicheiroMapping', preenche-o e tenta de novo."
        exit 1
    }

    $dados   = Get-Content $FicheiroMapping -Encoding UTF8 -Raw | ConvertFrom-Json
    $mapping = $dados.tecnica_para_imagem

    New-Item -ItemType Directory -Path $PastaPublica -Force | Out-Null

    $copiados  = 0
    $ignorados = 0

    foreach ($prop in $mapping.PSObject.Properties) {
        $tid  = $prop.Name
        $nome = $prop.Value

        if (-not $nome) { $ignorados++; continue }

        $origem = $null
        foreach ($cat in $TecnicasPorCategoria.Keys) {
            $c = Join-Path $PastaStaging (Join-Path $cat $nome)
            if (Test-Path $c) { $origem = $c; break }
        }

        if (-not $origem) {
            Write-Host "  [ERRO] Ficheiro nao encontrado: $nome (tecnica: $tid)"
            continue
        }

        $ext     = [System.IO.Path]::GetExtension($nome).ToLower()
        $destino = Join-Path $PastaPublica "$tid$ext"
        Copy-Item -Path $origem -Destination $destino -Force
        Write-Host "  [OK] $tid$ext"
        $copiados++
    }

    Write-Host ""
    Write-Host "[DONE] $copiados imagens copiadas para $PastaPublica"
    if ($ignorados -gt 0) { Write-Host "   $ignorados tecnicas ficaram sem imagem (null no mapping)." }
    Write-Host "   A app carrega automaticamente /images/techniques/{id}.{ext}"
}

switch ($Comando) {
    "download" { Invoke-Download }
    "apply"    { Invoke-Apply }
    default {
        Write-Host "Uso: .\scraper_tkd.ps1 [download|apply]"
        Write-Host "  download  -- descarrega imagens e gera image_mapping_template.json"
        Write-Host "  apply     -- le image_mapping.json e copia imagens para public/"
        exit 1
    }
}
