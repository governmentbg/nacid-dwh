using Microsoft.AspNetCore.Http;

namespace Middlewares
{
    public class RedirectionMiddleware
    {
        private readonly RequestDelegate next;

        public RedirectionMiddleware(RequestDelegate next)
        {
            this.next = next;
        }

        public async Task Invoke(HttpContext context)
        {
            await next(context);

            if (context.Response.StatusCode == 404 &&
            !context.Request.Path.Value.Contains("/api/") &&
            !Path.HasExtension(context.Request.Path.Value))
            {
                context.Request.Path = new PathString("/");
                await next(context);
            }
        }
    }
}
