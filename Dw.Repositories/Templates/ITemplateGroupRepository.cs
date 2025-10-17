using Dw.Models.Entities.Templates;
using Dw.Models.FilterDtos.Templates;
using Dw.Repositories.Base;

namespace Dw.Repositories.Templates
{
    public interface ITemplateGroupRepository : IRepositoryBase<TemplateGroup, TemplateGroupFilterDto>
    {
    }
}
