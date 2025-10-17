dotnet ef --startup-project ../Server/ migrations add V1.0.0 --context DwDbContext

dotnet ef --startup-project ../Server/ database update --context DwDbContext
