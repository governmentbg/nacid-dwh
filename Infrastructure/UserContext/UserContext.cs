using Infrastructure.UserContext.Enums;

namespace Infrastructure.UserContext
{
    public class UserContext
    {
        public string ClientId { get; set; }
        public int? UserId { get; set; }
        public int? AuthorizedDeviceId { get; set; }
        public string UserName { get; set; }
        public string FullName { get; set; }
        public string PhoneNumber { get; set; }
        public UserAuthorizationState AuthorizationState { get; set; }

        public List<OrganizationalUnitContext> OrganizationalUnits { get; set; } = new List<OrganizationalUnitContext>();

        public UserContext()
        {
            ClientId = null;
            UserId = null;
            AuthorizedDeviceId = null;
            UserName = string.Empty;
            FullName = string.Empty;
            PhoneNumber = null;
            AuthorizationState = UserAuthorizationState.Logout;
        }
    }
}
