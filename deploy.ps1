# PowerShell deployment script
Write-Host "🚀 Starting deployment process..." -ForegroundColor Blue
Write-Host ""

# Step 1: Git add all changes
Write-Host "📦 Adding all changes to git..." -ForegroundColor Blue
git add .

# Check if there are changes to commit
$status = git status --porcelain
if (-not $status) {
    Write-Host "❌ No changes to commit" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Step 2: Show status and get commit message
Write-Host ""
Write-Host "📋 Current git status:" -ForegroundColor Blue
git status --short
Write-Host ""

$commitMessage = Read-Host "✏️ Enter your commit message"

# Check if commit message is not empty
if ([string]::IsNullOrWhiteSpace($commitMessage)) {
    Write-Host "❌ Commit message cannot be empty" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Step 3: Commit with the message
Write-Host ""
Write-Host "💾 Committing changes..." -ForegroundColor Blue
git commit -m $commitMessage

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Commit failed" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Step 4: Push to remote
Write-Host ""
Write-Host "🌐 Pushing to remote repository..." -ForegroundColor Blue
git push

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Deployment successful! 🎉" -ForegroundColor Green
} else {
    Write-Host "❌ Push failed" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Read-Host "Press Enter to exit"