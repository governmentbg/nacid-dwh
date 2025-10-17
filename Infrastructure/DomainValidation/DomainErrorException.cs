using Infrastructure.DomainValidation.Models;

namespace Infrastructure.DomainValidation
{
    public class DomainErrorException : Exception
    {
        public DomainErrorMessage ErrorMessage { get; set; }

        public DomainErrorException(DomainErrorMessage errorMessage)
        {
            ErrorMessage = errorMessage;
        }
    }
}
