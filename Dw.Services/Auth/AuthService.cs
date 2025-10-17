using Dw.Models.Dtos.Auth;
using Infrastructure.AppSettings;
using Integrations.SsoIntegration;
using Integrations.SsoIntegration.Dtos;

namespace Dw.Services.Auth
{
    public class AuthService
    {
        private readonly SsoIntegrationService ssoIntegrationService;

        public AuthService(
            SsoIntegrationService ssoIntegrationService
            )
        {
            this.ssoIntegrationService = ssoIntegrationService;
        }

        public async Task<TokenResponseDto> LoginWithCode(LoginWithCodeDto loginWithCodeDto)
        {
            var loginContent = ConstructLoginAuthCodeContent(loginWithCodeDto.AuthorizationCode);
            var tokenResponseDto = await ssoIntegrationService.GetToken(loginContent);

            return tokenResponseDto;
        }

        public async Task Logout()
        {
            await ssoIntegrationService.Logout();
        }

        private FormUrlEncodedContent ConstructLoginAuthCodeContent(string authorizationCode)
        {
            var loginKvp = new List<KeyValuePair<string, string>>
            {
                new KeyValuePair<string, string>("grant_type", AppSettingsProvider.SsoConfiguration.CodeGrandType),
                new KeyValuePair<string, string>("client_id", AppSettingsProvider.SsoConfiguration.ClientId),
                new KeyValuePair<string, string>("client_secret", AppSettingsProvider.SsoConfiguration.ClientSecret),
                new KeyValuePair<string, string>("code", authorizationCode)
            };

            return new FormUrlEncodedContent(loginKvp);
        }
    }
}
