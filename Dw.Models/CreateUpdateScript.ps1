# Creates Dotnet migration version + generated SQL script
# Example call from PowerShell: .\CreateUpdateScript.ps1 V1.0.0 V1.0.1

$fromVersion = $args[0]
$version = $args[1]

Write-Host "Creating script $($version) from $($fromVersion) version."

dotnet ef --startup-project ../Server/ migrations add $version --context DwDbContext

dotnet ef --startup-project ../Server/ migrations script $fromVersion --no-transactions --context DwDbContext --output "../Database/Update/$($version).sql"

Write-Host "File ../Database/Update/$($version).sql is succesfully created."
Write-Host "WARNING: Please check created file content!"
