using Infrastructure.DomainValidation;

namespace Dw.Models.Interfaces
{
    public interface IValidate
    {
        void ValidateProperties(DomainValidatorService domainValidatorService);
    }
}
