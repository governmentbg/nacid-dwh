using AspNet.Security.OpenIdConnect.Primitives;
using Dw.Models.Dtos.Auth;
using Dw.Services.Auth;
using Infrastructure.AppSettings;
using Infrastructure.UserContext;
using Infrastructure.UserContext.Enums;
using Integrations.SsoIntegration.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Server.Controllers.Auth
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly UserContext userContext;
        private readonly AuthService authService;

        public AuthController(
            UserContext userContext,
            AuthService authService
        )
        {
            this.userContext = userContext;
            this.authService = authService;
        }

        [HttpGet("userinfo")]
        public ActionResult<UserContext> GetUserInfo()
        {
            string clientId = HttpContext.User.FindFirst(OpenIdConnectConstants.Claims.ClientId)?.Value;

            userContext.AuthorizationState = (AppSettingsProvider.SsoConfiguration.ClientId == clientId && userContext.UserId.HasValue)
                ? UserAuthorizationState.Login
                : UserAuthorizationState.Logout;

            return Ok(userContext);
        }

        [HttpPost("authToken")]
        public async Task<ActionResult<TokenResponseDto>> LoginWithCode([FromBody] LoginWithCodeDto loginWithCodeDto)
        {
            var tokenResponseDto = await authService.LoginWithCode(loginWithCodeDto);
            return Ok(tokenResponseDto);
        }

        [HttpDelete("logout")]
        [AllowAnonymous]
        public async Task<ActionResult> Logout()
        {
            await authService.Logout();

            return Ok();
        }
    }
}
