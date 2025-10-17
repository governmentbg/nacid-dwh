using System.ComponentModel;

namespace Ch.Models.Enums.Output
{
    [Description("Агрегатна функция")]
    public enum AggregateFunction
    {
        [Description("Не е избрана")]
        None = 1,

        [Description("Общ брой")]
        Count = 2,

        [Description("Общ брой с условие")]
        CountIf = 3,

        [Description("Общ брой уникални")]
        CountDistinct = 4,

        [Description("Общ брой уникални с условие")]
        CountDistinctIf = 5,

        [Description("Минимално")]
        Min = 6,

        [Description("Минимално с условие")]
        MinIf = 7,

        [Description("Максимално")]
        Max = 8,

        [Description("Максимално с условие")]
        MaxIf = 9,

        [Description("Сумиране")]
        Sum = 10,

        [Description("Сумиране с условие")]
        SumIf = 11,

        [Description("Средно аритметично")]
        Avg = 12,

        [Description("Средно аритметично с условие")]
        AvgIf = 13
    }
}
