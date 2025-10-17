using Dw.Models.Enums.Templates;

namespace Dw.Models.Dtos.Templates.Search
{
    public class TemplateGroupSearchDto
    {
        public int Id { get; set; }

        public string Name { get; set; }
        public string NameAlt { get; set; }

        public string Description { get; set; }
        public string DescriptionAlt { get; set; }

        public TemplateAccessLevel AccessLevel { get; set; }

        public int TemplateQueryCount { get; set; }
    }
}
