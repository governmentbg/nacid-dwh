using Infrastructure.UserContext;
using Logs.Entities;
using Logs.Enums;
using Logs.Services.Base;
using Microsoft.AspNetCore.Http;

namespace Logs.Services
{
    public class ErrorLogService : BaseLogService<ErrorLog>
    {
        private readonly LogDbContext context;

        public ErrorLogService(
            LogDbContext context
            )
        {
            this.context = context;
        }

        public async Task LogError(Exception exception, ErrorLogType type, HttpContext httpContext = null, UserContext userContext = null, string entityString = null, string customText = null)
        {
            var errorLog = ConstructLogsInformation(httpContext, userContext, entityString);
            errorLog.Type = type;

            while (exception.InnerException != null)
            { exception = exception.InnerException; }

            var message = $"CustomText: {customText} \n\nType: {exception.GetType().FullName} \n\nMessage: {exception.Message} \n\nStackTrace: {exception.StackTrace}";
            errorLog.Message = message;

            await context.ErrorLogs.AddAsync(errorLog);
            await context.SaveChangesAsync();
        }
    }
}
