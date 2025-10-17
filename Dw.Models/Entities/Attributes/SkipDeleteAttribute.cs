using System.Reflection;

namespace Dw.Models.Entities.Attributes
{
    public class SkipDeleteAttribute : Attribute
    {
        public static bool IsDeclared(PropertyInfo propertyInfo)
            => propertyInfo.GetCustomAttribute(typeof(SkipDeleteAttribute)) != null;
    }
}
