using Dw.Models.Enums.Templates;
using Dw.Models.Interfaces;
using Infrastructure.DomainValidation;

namespace Dw.Models.Dtos.Templates
{
    public class TemplateGroupDto : IValidate
    {
        public int Id { get; set; }

        public string Name { get; set; }
        public string NameAlt { get; set; }

        public string Description { get; set; }
        public string DescriptionAlt { get; set; }

        public TemplateAccessLevel AccessLevel { get; set; } = TemplateAccessLevel.Public;
        public int? AccessUserId { get; set; }

        public void ValidateProperties(DomainValidatorService domainValidatorService)
        {
            Name = Name?.Trim();
            NameAlt = NameAlt?.Trim();
            Description = Description?.Trim();
            DescriptionAlt = DescriptionAlt?.Trim();
        }
    }
}
