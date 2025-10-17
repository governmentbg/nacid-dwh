using Microsoft.AspNetCore.Http;
using System.Net;
using System.Net.Http.Headers;
using System.Net.Sockets;

namespace Infrastructure.Helpers.Extensions
{
    public static class HttpClientExtensions
    {
        public static void AddXForwardedHeaders(this HttpRequestHeaders headers, IHttpContextAccessor httpContextAccessor)
        {
            IPAddress remoteIpAddress = httpContextAccessor.HttpContext?.Connection?.RemoteIpAddress;

            if (remoteIpAddress != null)
            {
                string xffValue = remoteIpAddress.AddressFamily == AddressFamily.InterNetworkV6 ? $"\"[{remoteIpAddress}]\"" : remoteIpAddress.ToString();
                headers.Add("X-Forwarded-For", xffValue);
            }
        }

        public static void AddUserAgentHeaders(this HttpRequestHeaders headers, IHttpContextAccessor httpContextAccessor)
        {
            var userAgent = httpContextAccessor.HttpContext?.Request?.Headers["User-Agent"].ToString();

            if (!string.IsNullOrWhiteSpace(userAgent))
            {
                headers.Add("User-Agent", userAgent);
            }
        }
    }
}
