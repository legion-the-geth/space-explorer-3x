Write-Host "💭 Activation du mode PRODUCT DESIGN (Focus fonctionnalités et UX/UI)..." -ForegroundColor Magenta
Copy-Item -Path ".roles\gemini_product-design\GEMINI.md" -Destination ".\GEMINI.md" -Force
Write-Host "✅ Théo est maintenant en mode PRODUCT DESIGN !" -ForegroundColor Green