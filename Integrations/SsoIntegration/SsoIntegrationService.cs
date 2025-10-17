using Infrastructure.AppSettings;
using Infrastructure.DomainValidation;
using Infrastructure.DomainValidation.Models;
using Infrastructure.DomainValidation.Models.SsoErrorCodes;
using Infrastructure.Helpers.Extensions;
using Infrastructure.UserContext;
using Integrations.SsoIntegration.Dtos;
using Logs.Enums;
using Logs.Services;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using System.Net;

namespace Integrations.SsoIntegration
{
    public class SsoIntegrationService
    {
        private readonly IHttpClientFactory httpClientFactory;
        private readonly IHttpContextAccessor httpContextAccessor;
        private readonly DomainValidatorService domainValidatorService;
        private readonly ErrorLogService errorLogService;

        public SsoIntegrationService(
            IHttpClientFactory httpClientFactory,
            IHttpContextAccessor httpContextAccessor,
            DomainValidatorService domainValidatorService,
            ErrorLogService errorLogService
            )
        {
            this.httpClientFactory = httpClientFactory;
            this.httpContextAccessor = httpContextAccessor;
            this.domainValidatorService = domainValidatorService;
            this.errorLogService = errorLogService;
        }

        public async Task<UserContext> GetUserContext(HttpContext context)
        {
            var requestMessage = new HttpRequestMessage
            {
                Method = HttpMethod.Get,
                RequestUri = new Uri($"{AppSettingsProvider.SsoConfiguration.SsoUri}api/auth/userinfo")
            };

            requestMessage.Headers.AddXForwardedHeaders(httpContextAccessor);
            requestMessage.Headers.AddUserAgentHeaders(httpContextAccessor);

            var authHeader = context.Request.Headers["Authorization"].FirstOrDefault();

            if (!string.IsNullOrWhiteSpace(authHeader))
            {
                requestMessage.Headers
                        .Add("Authorization", authHeader);
            }

            var client = httpClientFactory.CreateClient();

            using var responseMessage = await client.SendAsync(requestMessage);

            if (responseMessage.IsSuccessStatusCode)
            {
                var userContext = JsonConvert.DeserializeObject<UserContext>(await responseMessage.Content.ReadAsStringAsync());
                return userContext ?? new UserContext();
            }
            else
            {
                return new UserContext();
            }
        }

        public async Task<TokenResponseDto> GetToken(FormUrlEncodedContent loginContent)
        {
            var requestMessage = new HttpRequestMessage
            {
                Content = loginContent,
                Method = HttpMethod.Post,
                RequestUri = new Uri($"{AppSettingsProvider.SsoConfiguration.SsoUri}api/auth/token")
            };

            requestMessage.Headers.AddXForwardedHeaders(httpContextAccessor);
            requestMessage.Headers.AddUserAgentHeaders(httpContextAccessor);

            var client = httpClientFactory.CreateClient();

            using var responseMessage = await client.SendAsync(requestMessage);

            if (responseMessage.IsSuccessStatusCode)
            {
                var tokenResponseDto = JsonConvert.DeserializeObject<TokenResponseDto>(await responseMessage.Content.ReadAsStringAsync());
                return tokenResponseDto;
            }
            else
            {
                if (responseMessage.StatusCode == HttpStatusCode.UnprocessableEntity)
                {
                    var ssoDomainErrorMessage = JsonConvert.DeserializeObject<SsoDomainErrorMessage>(await responseMessage.Content.ReadAsStringAsync());
                    var errorCode = Enum.IsDefined(typeof(SsoErrorCode), ssoDomainErrorMessage.ErrorCode) ? (SsoErrorCode)Enum.Parse(typeof(SsoErrorCode), ssoDomainErrorMessage.ErrorCode) : SsoErrorCode.Auth_UndefinedDomainError;

                    domainValidatorService.ThrowErrorMessage(errorCode, ssoDomainErrorMessage.ErrorAction, ssoDomainErrorMessage.ErrorText, ssoDomainErrorMessage.ErrorCount);
                }
                else
                {
                    await errorLogService.LogError(new Exception("SSO connection problem"), ErrorLogType.IntegrationExceptionLog, httpContextAccessor.HttpContext, null);
                    domainValidatorService.ThrowErrorMessage(SsoErrorCode.Auth_CommunicationExceptionWithSso);
                }

                return null;
            }
        }

        public async Task Logout()
        {
            var requestMessage = new HttpRequestMessage
            {
                Method = HttpMethod.Delete,
                RequestUri = new Uri($"{AppSettingsProvider.SsoConfiguration.SsoUri}api/auth/logout")
            };

            requestMessage.Headers.AddXForwardedHeaders(httpContextAccessor);
            requestMessage.Headers.AddUserAgentHeaders(httpContextAccessor);

            var authHeader = httpContextAccessor.HttpContext.Request.Headers["Authorization"].FirstOrDefault();
            requestMessage.Headers
                        .Add("Authorization", authHeader);

            var client = httpClientFactory.CreateClient();

            using var responseMessage = await client.SendAsync(requestMessage);
        }
    }
}
