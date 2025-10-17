using System.ComponentModel;

namespace Ch.Models.Enums.Order
{
    [Description("Вид на подредбата")]
    public enum OrderByType
    {
        [Description("Възходящ")]
        Asc = 1,
        [Description("Низходящ")]
        Desc = 2
    }
}
