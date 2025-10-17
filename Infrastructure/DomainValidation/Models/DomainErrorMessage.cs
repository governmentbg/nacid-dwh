using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace Infrastructure.DomainValidation.Models
{
    public class DomainErrorMessage
    {
        [JsonConverter(typeof(StringEnumConverter))]
        public Enum ErrorCode { get; set; }
        public DomainErrorAction? ErrorAction { get; set; }
        public string ErrorText { get; set; }
        public int? ErrorCount { get; set; }

        public DomainErrorMessage(Enum errorCode, DomainErrorAction? errorAction = null, string errorText = null, int? errorCount = null)
        {
            ErrorCode = errorCode;
            ErrorAction = errorAction ?? DomainErrorAction.None;
            ErrorText = errorText;
            ErrorCount = errorCount;
        }
    }

    public class SsoDomainErrorMessage
    {
        public string ErrorCode { get; set; }
        public DomainErrorAction? ErrorAction { get; set; }
        public string ErrorText { get; set; }
        public int? ErrorCount { get; set; }
    }
}
