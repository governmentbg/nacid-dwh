using Infrastructure.UserContext;
using Logs.Entities;
using Logs.Services.Base;
using Microsoft.AspNetCore.Http;

namespace Logs.Services
{
    public class ActionLogService : BaseLogService<ActionLog>
    {
        private readonly LogDbContext context;
        private readonly IHttpContextAccessor httpContextAccessor;

        public ActionLogService(
            LogDbContext context,
            IHttpContextAccessor httpContextAccessor
            )
        {
            this.context = context;
            this.httpContextAccessor = httpContextAccessor;
        }

        public async Task LogAction(UserContext userContext = null, string entityString = null)
        {
            var actionLog = ConstructLogsInformation(httpContextAccessor.HttpContext, userContext, entityString);

            await context.ActionLogs.AddAsync(actionLog);
            await context.SaveChangesAsync();
        }
    }
}
