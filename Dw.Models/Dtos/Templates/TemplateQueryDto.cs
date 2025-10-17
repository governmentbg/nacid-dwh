using Dw.Models.Enums.Templates;
using Dw.Models.Interfaces;
using Infrastructure.DomainValidation;
using Infrastructure.DomainValidation.Models.ErrorCodes;

namespace Dw.Models.Dtos.Templates
{
    public class TemplateQueryDto : IValidate
    {
        public int Id { get; set; }

        public int TemplateGroupId { get; set; }
        public TemplateGroupDto TemplateGroup { get; set; }

        public string Name { get; set; }
        public string NameAlt { get; set; }

        public string Description { get; set; }
        public string DescriptionAlt { get; set; }

        public bool ShowAsSubquery { get; set; } = false;
        public string JsonQuery { get; set; }
        public string RawQuery { get; set; }

        public TemplateAccessLevel AccessLevel { get; set; } = TemplateAccessLevel.Public;
        public int? AccessUserId { get; set; }

        public void ValidateProperties(DomainValidatorService domainValidatorService)
        {
            Name = Name?.Trim();
            NameAlt = NameAlt?.Trim();
            Description = Description?.Trim();
            DescriptionAlt = DescriptionAlt?.Trim();

            if (AccessLevel == TemplateAccessLevel.Private && !AccessUserId.HasValue)
            {
                domainValidatorService.ThrowErrorMessage(TemplateQueryErrorCode.TemplateQuery_AccessPrivate_RequireUser);
            }
        }
    }
}
