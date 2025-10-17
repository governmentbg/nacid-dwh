using System.ComponentModel;

namespace Ch.Models.Enums.Output
{
    [Description("Действие")]
    public enum OutputAction
    {
        [Description("Добавяне на колона")]
        ColumnAdd = 1,

        [Description("Дял от")]
        PartitionBy = 2,

        [Description("Събиране на колони")]
        SumSelectedColumns = 3
    }
}
