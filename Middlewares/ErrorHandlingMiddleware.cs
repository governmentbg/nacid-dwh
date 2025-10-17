using Infrastructure.DomainValidation;
using Infrastructure.DomainValidation.Models;
using Infrastructure.DomainValidation.Models.ErrorCodes;
using Infrastructure.UserContext;
using Logs.Enums;
using Logs.Services;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System.Net;
using System.Text;

namespace Middlewares
{
    public class ErrorHandlingMiddleware
    {
        private readonly RequestDelegate next;

        private readonly List<string> NonLog = new List<string>()
        {
            "/api/auth/userinfo",
            "/api/logs/actions",
            "/api/logs/errors"
        };

        private readonly List<string> NonBodyLog = new List<string>()
        {
            "/api/auth/authToken",
            "/api/FileStorage"
        };

        public ErrorHandlingMiddleware(RequestDelegate next)
        {
            this.next = next;
        }

        public async Task Invoke(HttpContext context, ActionLogService actionLogService, ErrorLogService errorLogService, UserContext userContext)
        {
            var requestContent = await ReadRequestBody(context.Request);

            if (context.Request.Path.ToUriComponent().Contains("/api") && !NonLog.Any(s => context.Request.Path.ToUriComponent().StartsWith(s)))
            {
                await actionLogService.LogAction(userContext, requestContent);
            }

            try
            {
                await next(context);
            }
            catch (Exception exception)
            {
                while (exception.InnerException != null)
                { exception = exception.InnerException; }

                if (exception is DomainErrorException domainErrorException)
                {
                    await HandleException(context, HttpStatusCode.UnprocessableEntity, domainErrorException.ErrorMessage);
                }
                else if (exception is TimeoutException)
                {
                    var errorMessage = new DomainErrorMessage(SystemErrorCode.System_QueryTimeout);
                    await HandleException(context, HttpStatusCode.UnprocessableEntity, errorMessage);
                }
                else
                {
                    if (!context.RequestAborted.IsCancellationRequested)
                    {
                        await HandleException(context, HttpStatusCode.InternalServerError);

                        if (context.Request.Path.ToUriComponent().Contains("/api") && !NonLog.Any(s => context.Request.Path.ToUriComponent().StartsWith(s)))
                        {
                            await errorLogService.LogError(exception, ErrorLogType.ServerExceptionLog, context, userContext, requestContent);
                        }
                    }
                }
            }
        }

        private async Task<string> ReadRequestBody(HttpRequest request)
        {
            var requestContent = string.Empty;

            if ((request.Method == HttpMethods.Post || request.Method == HttpMethods.Put)
                && request.ContentLength > 0
                && !NonBodyLog.Any(s => request.Path.ToUriComponent().StartsWith(s)))
            {
                request.EnableBuffering();
                var buffer = new byte[Convert.ToInt32(request.ContentLength)];
                await request.Body.ReadAsync(buffer, 0, buffer.Length);
                requestContent = Encoding.UTF8.GetString(buffer).Replace("\0", "");
                request.Body.Position = 0;
            }

            return requestContent;
        }

        private static Task HandleException(HttpContext context, HttpStatusCode status, DomainErrorMessage errorMessage = null)
        {
            context.Response.Clear();
            context.Response.StatusCode = (int)status;
            context.Response.ContentType = "application/json";
            context.Response.Headers.Append("Access-Control-Allow-Origin", "*");
            return context.Response.WriteAsync(JsonConvert.SerializeObject(errorMessage, new JsonSerializerSettings
            {
                ContractResolver = new CamelCasePropertyNamesContractResolver()
            }));
        }
    }
}
