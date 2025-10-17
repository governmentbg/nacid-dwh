namespace Integrations.SsoIntegration.Dtos
{
    public class TokenResponseDto
    {
        public string Access_token { get; set; }
        public string Expires_in { get; set; }
        public string Token_type { get; set; }
    }
}
