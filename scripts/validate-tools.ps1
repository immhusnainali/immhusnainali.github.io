Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
$repoRootResolved = (Resolve-Path $repoRoot).Path
$siteUrl = "https://immhusnainali.github.io"
$failures = [System.Collections.Generic.List[string]]::new()

function Add-Failure {
  param([string]$Message)
  $failures.Add($Message)
}

function Assert-True {
  param(
    [bool]$Condition,
    [string]$Message
  )

  if (-not $Condition) {
    Add-Failure $Message
  }
}

function Get-RelativePath {
  param([string]$Path)
  $resolvedPath = (Resolve-Path $Path).Path
  if ($resolvedPath.StartsWith($repoRootResolved)) {
    return $resolvedPath.Substring($repoRootResolved.Length).TrimStart("\").Replace("\", "/")
  }

  return $resolvedPath.Replace("\", "/")
}

function Get-RouteFromRelativePath {
  param([string]$RelativePath)

  if ($RelativePath -eq "index.html") {
    return "/"
  }

  if ($RelativePath.EndsWith("/index.html")) {
    return "/" + ($RelativePath -replace "/index\.html$", "/")
  }

  return "/" + $RelativePath
}

function Get-ToolDefinitions {
  $definitions = @()
  $dataFiles = Get-ChildItem (Join-Path $repoRoot "assets/js/tools/data") -Filter "*-tools.js" | Sort-Object Name

  foreach ($file in $dataFiles) {
    $capture = $false
    $blockLines = @()

    foreach ($line in Get-Content $file.FullName) {
      if (-not $capture -and $line -match "createTool\(\{") {
        $capture = $true
        $blockLines = @($line)
        continue
      }

      if ($capture) {
        $blockLines += $line

        if ($line -match "^\s*\}\),?\s*$") {
          $text = $blockLines -join "`n"
          $definition = [ordered]@{}

          foreach ($name in "id", "slug", "translationKey", "category", "status", "controller") {
            $pattern = "(?m)^\s*${name}:\s*""([^""]+)"""
            $match = [regex]::Match($text, $pattern)
            if ($match.Success) {
              $definition[$name] = $match.Groups[1].Value
            } else {
              Add-Failure "Missing '$name' in tool definition from $(Get-RelativePath $file.FullName)."
            }
          }

          foreach ($name in "featured", "live", "supportsLocalProcessingNote") {
            $pattern = "(?m)^\s*${name}:\s*(true|false)"
            $match = [regex]::Match($text, $pattern)
            if ($match.Success) {
              $definition[$name] = [bool]::Parse($match.Groups[1].Value)
            } else {
              Add-Failure "Missing '$name' in tool definition from $(Get-RelativePath $file.FullName)."
            }
          }

          $definitions += [pscustomobject]$definition
          $capture = $false
          $blockLines = @()
        }
      }
    }
  }

  return $definitions
}

function Get-ControllerNamesFromApp {
  $appJs = Get-Content (Join-Path $repoRoot "assets/js/tools/app.js") -Raw
  $matches = [regex]::Matches($appJs, '(?m)^\s*"([^"]+)":\s*mount')
  return $matches | ForEach-Object { $_.Groups[1].Value }
}

function Test-RequiredHtml {
  param(
    [string]$FilePath,
    [string]$ExpectedPageType
  )

  $relativePath = Get-RelativePath $FilePath
  $route = Get-RouteFromRelativePath $relativePath
  $canonicalUrl = "$siteUrl$route"
  $html = Get-Content $FilePath -Raw

  Assert-True ($html -match "<title>.+</title>") "Missing <title> in $relativePath."
  Assert-True ($html -match '<meta name="description" content="[^"]+') "Missing meta description in $relativePath."
  Assert-True ($html -match [regex]::Escape("<link rel=""canonical"" href=""$canonicalUrl""")) "Canonical URL mismatch or missing in $relativePath."
  Assert-True ($html -match "/assets/js/site-shell\.js") "Missing shared shell script in $relativePath."
  Assert-True ($html -match "/assets/js/tools/app\.js") "Missing tools app script in $relativePath."
  Assert-True ($html -match "data-tools-page=""$ExpectedPageType""") "Incorrect or missing data-tools-page in $relativePath."
}

Write-Host "Validating tools hub structure..." -ForegroundColor Cyan

$toolHtmlFiles = Get-ChildItem (Join-Path $repoRoot "tools") -Recurse -Filter "index.html" | Sort-Object FullName
$tools = @(Get-ToolDefinitions)
$expectedToolCount = $tools.Count
$landingPage = $toolHtmlFiles | Where-Object { (Get-RelativePath $_.FullName) -eq "tools/index.html" }
$categoryPages = @()
$toolPages = @()

foreach ($file in $toolHtmlFiles) {
  $relativePath = Get-RelativePath $file.FullName
  $segments = $relativePath.Split("/")

  switch ($segments.Length) {
    2 { }
    3 { $categoryPages += $file }
    4 { $toolPages += $file }
    default { Add-Failure "Unexpected tools route depth: $relativePath." }
  }
}

Assert-True ($null -ne $landingPage) "Missing tools landing page."
Assert-True ($categoryPages.Count -eq 5) "Expected 5 category pages, found $($categoryPages.Count)."
Assert-True ($expectedToolCount -gt 0) "Expected at least one tool definition."
Assert-True ($toolPages.Count -eq $expectedToolCount) "Expected $expectedToolCount tool pages, found $($toolPages.Count)."
Assert-True ($toolHtmlFiles.Count -eq ($expectedToolCount + $categoryPages.Count + 1)) "Tools HTML route count does not match the registry plus category pages and landing page."

foreach ($file in $toolHtmlFiles) {
  $relativePath = Get-RelativePath $file.FullName
  if ($relativePath -eq "tools/index.html") {
    Test-RequiredHtml -FilePath $file.FullName -ExpectedPageType "landing"
    continue
  }

  if ($relativePath.Split("/").Length -eq 3) {
    Test-RequiredHtml -FilePath $file.FullName -ExpectedPageType "category"
  } else {
    Test-RequiredHtml -FilePath $file.FullName -ExpectedPageType "tool"
  }
}

Write-Host "Validating tool registry and controller wiring..." -ForegroundColor Cyan

$controllerNames = @(Get-ControllerNamesFromApp)
$liveTools = @($tools | Where-Object live)
$plannedTools = @($tools | Where-Object { -not $_.live })

Assert-True (($liveTools.Count + $plannedTools.Count) -eq $tools.Count) "Live/planned totals do not match the tool definition count."
Assert-True ($liveTools.Count -gt 0) "At least one live tool is expected."
Assert-True ($plannedTools.Count -gt 0) "At least one planned tool is expected."
Assert-True ((@($liveTools | Where-Object { $_.status -ne "live" }).Count) -eq 0) "Some live tools are not marked with status 'live'."
Assert-True ((@($plannedTools | Where-Object { $_.status -ne "planned" }).Count) -eq 0) "Some planned tools are not marked with status 'planned'."
Assert-True ((@($tools.id | Sort-Object -Unique).Count) -eq $tools.Count) "Tool IDs are not unique."
Assert-True ((@($tools.slug | Sort-Object -Unique).Count) -eq $tools.Count) "Tool slugs are not unique."

$toolPageLookup = @{}
foreach ($file in $toolPages) {
  $relativePath = Get-RelativePath $file.FullName
  $html = Get-Content $file.FullName -Raw
  $match = [regex]::Match($html, 'data-tool-id="([^"]+)"')
  if (-not $match.Success) {
    Add-Failure "Missing data-tool-id in $relativePath."
    continue
  }

  $toolPageLookup[$match.Groups[1].Value] = $relativePath
}

foreach ($tool in $tools) {
  $expectedRelativePath = "tools/$($tool.category)/$($tool.slug)/index.html"
  $absolutePath = Join-Path $repoRoot $expectedRelativePath.Replace("/", "\")

  Assert-True (Test-Path $absolutePath) "Missing tool page file for '$($tool.id)' at $expectedRelativePath."
  Assert-True ($toolPageLookup.ContainsKey($tool.id)) "Missing data-tool-id page entry for '$($tool.id)'."

  if ($toolPageLookup.ContainsKey($tool.id)) {
    Assert-True ($toolPageLookup[$tool.id] -eq $expectedRelativePath) "Tool page path mismatch for '$($tool.id)'."
  }

  $controllerPath = Join-Path $repoRoot "assets/js/tools/controllers/$($tool.controller).js"
  Assert-True (Test-Path $controllerPath) "Missing controller file for '$($tool.id)': assets/js/tools/controllers/$($tool.controller).js."
  Assert-True ($controllerNames -contains $tool.controller) "Controller '$($tool.controller)' is not registered in app.js."

  if ($tool.live) {
    Assert-True ($tool.controller -ne "planned-tool") "Live tool '$($tool.id)' points to planned-tool controller."
    $toolHtml = Get-Content $absolutePath -Raw
    Assert-True ($toolHtml -notmatch 'Planned browser-only') "Live tool '$($tool.id)' still has planned-only HTML metadata."
  }
}

Write-Host "Validating JS imports..." -ForegroundColor Cyan

$jsFiles = Get-ChildItem (Join-Path $repoRoot "assets/js") -Recurse -Filter "*.js"

foreach ($file in $jsFiles) {
  $relativePath = Get-RelativePath $file.FullName
  $content = Get-Content $file.FullName -Raw
  $matches = [regex]::Matches($content, '(?m)^\s*import\s+.+?\s+from\s+["'']([^"'']+)["''];')

  foreach ($match in $matches) {
    $importPath = $match.Groups[1].Value
    if (-not $importPath.StartsWith(".")) {
      continue
    }

    $resolvedPath = [System.IO.Path]::GetFullPath((Join-Path (Split-Path $file.FullName -Parent) $importPath))
    if (-not [System.IO.Path]::HasExtension($resolvedPath)) {
      $resolvedPath += ".js"
    }

    Assert-True (Test-Path $resolvedPath) "Broken import in $relativePath -> $importPath"
  }
}

Write-Host "Validating sitemap, homepage hooks, and responsive CSS markers..." -ForegroundColor Cyan

$homeHtml = Get-Content (Join-Path $repoRoot "index.html") -Raw
Assert-True ($homeHtml -match 'data-tools-spotlight-button') "Homepage tools spotlight block is missing."
Assert-True ($homeHtml -match 'data-tools-entry') "Homepage tools work card link is missing."
Assert-True (([regex]::Matches($homeHtml, '/tools/')).Count -ge 3) "Homepage should link to /tools/ in multiple locations."

$sitemap = Get-Content (Join-Path $repoRoot "sitemap.xml") -Raw
$sitemapUrls = @([regex]::Matches($sitemap, '<loc>([^<]+)</loc>') | ForEach-Object { $_.Groups[1].Value })
$expectedRoutes = @("$siteUrl/")
$expectedRoutes += @($toolHtmlFiles | ForEach-Object {
  "$siteUrl$(Get-RouteFromRelativePath (Get-RelativePath $_.FullName))"
})

Assert-True ($sitemapUrls.Count -eq $expectedRoutes.Count) "Expected $($expectedRoutes.Count) sitemap URLs, found $($sitemapUrls.Count)."
foreach ($url in $expectedRoutes) {
  Assert-True ($sitemapUrls -contains $url) "Sitemap is missing $url"
}

$toolsCss = Get-Content (Join-Path $repoRoot "assets/css/tools.css") -Raw
Assert-True ($toolsCss -match '@media screen and \(max-width: 900px\)') "Missing 900px responsive breakpoint in tools.css."
Assert-True ($toolsCss -match '@media screen and \(max-width: 768px\)') "Missing 768px responsive breakpoint in tools.css."
Assert-True ($toolsCss -match '@media screen and \(max-width: 640px\)') "Missing 640px responsive breakpoint in tools.css."
Assert-True ($toolsCss -match 'tool-form-grid') "Missing tool form grid styles in tools.css."
Assert-True ($toolsCss -match 'tool-dropzone input\[hidden\]') "Missing hidden dropzone input safeguard in tools.css."

$plannedController = Get-Content (Join-Path $repoRoot "assets/js/tools/controllers/planned-tool.js") -Raw
Assert-True ($plannedController -match 'planned-panel') "Planned tool controller no longer renders the planned panel."
Assert-True ($plannedController -notmatch 'tool-input|tool-button') "Planned tool controller should not render fake interactive inputs or buttons."

$toolsApp = Get-Content (Join-Path $repoRoot "assets/js/tools/app.js") -Raw
Assert-True ($toolsApp -match 'getLiveTools') "Tools landing page should import getLiveTools for live counts."
Assert-True ($toolsApp -match 'liveTools\.length') "Tools landing page should show the live tool count."
Assert-True ($toolsApp -match 'liveTools\.map') "Tools landing page should render the live tools collection."

if ($failures.Count -gt 0) {
  Write-Host ""
  Write-Host "Validation failed with $($failures.Count) issue(s):" -ForegroundColor Red
  $failures | ForEach-Object { Write-Host " - $_" -ForegroundColor Red }
  exit 1
}

Write-Host ""
Write-Host "Validation passed." -ForegroundColor Green
Write-Host " - Tools HTML routes: $($toolHtmlFiles.Count)"
Write-Host " - Category pages: $($categoryPages.Count)"
Write-Host " - Tool pages: $($toolPages.Count)"
Write-Host " - Tool definitions: $($tools.Count)"
Write-Host " - Live tools: $($liveTools.Count)"
Write-Host " - Planned tools: $($plannedTools.Count)"
Write-Host " - Sitemap URLs: $($sitemapUrls.Count)"
