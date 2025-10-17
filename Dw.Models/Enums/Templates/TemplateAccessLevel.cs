using System.ComponentModel;

namespace Dw.Models.Enums.Templates
{
    [Description("Ниво на достъп на шаблоните")]
    public enum TemplateAccessLevel
    {
        [Description("За всички")]
        Public = 1,

        [Description("Само за мен")]
        Private = 2
    }
}
