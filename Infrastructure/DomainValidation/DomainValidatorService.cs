using Infrastructure.DomainValidation.Models;

namespace Infrastructure.DomainValidation
{
    public class DomainValidatorService
    {
        public void ThrowErrorMessage(Enum errorCode, DomainErrorAction? errorAction = null, string errorText = null, int? errorCount = null)
        {
            throw new DomainErrorException(new DomainErrorMessage(errorCode, errorAction, errorText, errorCount));
        }
    }
}
