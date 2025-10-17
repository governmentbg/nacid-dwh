using System.ComponentModel;

namespace Infrastructure.UserContext.Enums
{
    [Description("Потребителски статус")]
    public enum UserAuthorizationState
    {
        [Description("Логнат")]
        Login = 1,

        [Description("Логаутнат")]
        Logout = 2,

        [Description("Зареждане")]
        Loading = 3
    }
}
