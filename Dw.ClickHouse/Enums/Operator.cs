using System.ComponentModel;

namespace Ch.Models.Enums
{
    [Description("Оператор")]
    public enum Operator
    {
        [Description("=")]
        EqualTo = 1,

        [Description(">")]
        GreaterThan = 2,

        [Description("<")]
        LessThan = 3,

        [Description(">=")]
        GreaterThanOrEqualTo = 4,

        [Description("<=")]
        LessThanOrEqualTo = 5,

        [Description("<>")]
        NotEqualTo = 6,

        [Description("in")]
        In = 7,

        [Description("not in")]
        NotIn = 8,

        [Description("like")]
        Like = 9,

        [Description("not like")]
        NotLike = 10,

        [Description("is null")]
        IsNull = 11,

        [Description("is not null")]
        IsNotNull = 12,

        [Description("empty")]
        Empty = 13,

        [Description("notEmpty")]
        NotEmpty = 14
    }
}
