using System.Reflection;

namespace Dw.Models.Entities.Attributes
{
    public class SkipUpdateAttribute : Attribute
    {
        public static bool IsDeclared(PropertyInfo propertyInfo)
            => propertyInfo.GetCustomAttribute(typeof(SkipUpdateAttribute)) != null;
    }
}
