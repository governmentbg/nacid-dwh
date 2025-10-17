using AspNet.Security.OpenIdConnect.Primitives;
using Infrastructure.AppSettings;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace Infrastructure.UserContext.Attributes
{
    public class DwClientAttribute : Attribute, IAsyncActionFilter
    {
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            string clientId = context.HttpContext.User.FindFirst(OpenIdConnectConstants.Claims.ClientId)?.Value;

            if (clientId != AppSettingsProvider.SsoConfiguration.ClientId)
            {
                context.Result = new UnauthorizedResult();
                return;
            }

            await next();
        }
    }
}
