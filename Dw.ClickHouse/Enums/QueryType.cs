using System.ComponentModel;

namespace Ch.Models.Enums
{
    [Description("Тип на заявката")]
    public enum QueryType
    {
        [Description("Таблица")]
        FromTable = 1,

        [Description("Подзаявка")]
        FromSubquery = 2
    }
}
