using Infrastructure.UserContext;
using Logs.Entities.Base;
using Microsoft.AspNetCore.Http;

namespace Logs.Services.Base
{
    public abstract class BaseLogService<TLog>
        where TLog : BaseLog, new()
    {
        protected TLog ConstructLogsInformation(HttpContext httpContext = null, UserContext userContext = null, string entity = null)
        {
            var log = new TLog();
            log.LogDate = DateTime.Now;

            log.UserId = userContext?.UserId;
            log.Username = userContext?.UserName;

            if (!string.IsNullOrWhiteSpace(entity))
            {
                log.Body = entity;
            }

            if (httpContext != null && httpContext.Request != null)
            {
                log.Ip = httpContext.Connection.RemoteIpAddress.ToString();
                log.Url = httpContext.Request.Path.ToUriComponent() + httpContext.Request.QueryString.ToUriComponent();
                log.Verb = httpContext.Request.Method;
                log.UserAgent = httpContext.Request.Headers["User-Agent"].ToString();
            }

            return log;
        }
    }
}
