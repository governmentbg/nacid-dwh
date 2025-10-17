dotnet ef --startup-project ../Server/ migrations add V1.0.0 --context LogDbContext

dotnet ef --startup-project ../Server/ database update --context LogDbContext
