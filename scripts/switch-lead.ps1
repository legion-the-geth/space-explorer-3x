Write-Host "🧐 Activation du mode TECH LEAD (Focus Review & Qualité)..." -ForegroundColor Magenta
Copy-Item -Path ".roles\gemini_tech-lead\GEMINI.md" -Destination ".\GEMINI.md" -Force
Write-Host "✅ Théo est maintenant en mode TECH LEAD !" -ForegroundColor Green
