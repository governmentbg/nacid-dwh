using Logs.Entities.Base;
using Logs.Enums;

namespace Logs.Entities
{
    public class ErrorLog : BaseLog
    {
        public ErrorLogType Type { get; set; }

        public string Message { get; set; }
    }
}
