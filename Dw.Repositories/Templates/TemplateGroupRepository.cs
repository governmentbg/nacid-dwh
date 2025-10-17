using Dw.Models;
using Dw.Models.Entities.Templates;
using Dw.Models.Enums.Common;
using Dw.Models.FilterDtos.Templates;
using Dw.Repositories.Base;
using Microsoft.EntityFrameworkCore;

namespace Dw.Repositories.Templates
{
    public class TemplateGroupRepository : RepositoryBase<TemplateGroup, TemplateGroupFilterDto>, ITemplateGroupRepository
    {
        public TemplateGroupRepository(DwDbContext context)
            : base(context)
        {
        }

        public override Func<IQueryable<TemplateGroup>, IQueryable<TemplateGroup>> ConstructInclude(IncludeType includeType = IncludeType.None)
        {
            return includeType switch
            {
                IncludeType.All => e => e,
                IncludeType.Collections => e => e.Include(e => e.TemplateQueries),
                IncludeType.NavProperties => e => e,
                IncludeType.None => e => e.Include(e => e.TemplateQueries),
                _ => e => e,
            };
        }
    }
}
