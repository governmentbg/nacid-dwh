using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;

namespace Infrastructure.UserContext.Attributes
{
    public class AuthorizedDeviceAttribute : Attribute, IAsyncActionFilter
    {
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var httpContext = context.HttpContext;
            var userContext = httpContext.RequestServices.GetService<UserContext>();

            if (!userContext.AuthorizedDeviceId.HasValue)
            {
                context.Result = new UnauthorizedResult();
                return;
            }

            await next();
        }
    }
}
