Write-Host "🎭 Activation du mode DEVELOPPEUR (Focus Feature & TDD)..." -ForegroundColor Cyan
Copy-Item -Path ".roles\gemini_dev\GEMINI.md" -Destination ".\GEMINI.md" -Force
Write-Host "✅ Théo est maintenant en mode DEV !" -ForegroundColor Green
