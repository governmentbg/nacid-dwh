using Ch.Models.Dtos;
using Dw.Models.Interfaces;
using Infrastructure.DomainValidation;
using Infrastructure.DomainValidation.Models.ErrorCodes;

namespace Dw.Models.Dtos.Templates
{
    public class TemplateQueryCreateDto : IValidate
    {
        public TemplateQueryDto TemplateQuery { get; set; }
        public ChQueryDto ChQuery { get; set; }

        public void ValidateProperties(DomainValidatorService domainValidatorService)
        {
            if (TemplateQuery == null)
            {
                domainValidatorService.ThrowErrorMessage(TemplateQueryErrorCode.TemplateQuery_Basic_Required);
            }

            if (ChQuery == null)
            {
                domainValidatorService.ThrowErrorMessage(TemplateQueryErrorCode.TemplateQuery_ChQuery_Required);
            }

            TemplateQuery.ValidateProperties(domainValidatorService);
        }
    }
}
