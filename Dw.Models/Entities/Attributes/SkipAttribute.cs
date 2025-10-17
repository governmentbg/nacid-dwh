using System.Reflection;

namespace Dw.Models.Entities.Attributes
{
    public class SkipAttribute : Attribute
    {
        public static bool IsDeclared(PropertyInfo propertyInfo)
            => propertyInfo.GetCustomAttribute(typeof(SkipAttribute)) != null;
    }
}
