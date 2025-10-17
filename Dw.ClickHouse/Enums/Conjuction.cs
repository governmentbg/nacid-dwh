using System.ComponentModel;

namespace Ch.Models.Enums
{
    [Description("Съчетание")]
    public enum Conjuction
    {
        [Description("И")]
        And = 1,
        [Description("ИЛИ")]
        Or = 2
    }
}
