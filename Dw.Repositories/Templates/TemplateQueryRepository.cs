using Dw.Models;
using Dw.Models.Entities.Templates;
using Dw.Models.Enums.Common;
using Dw.Models.FilterDtos.Templates;
using Dw.Repositories.Base;

namespace Dw.Repositories.Templates
{
    public class TemplateQueryRepository : RepositoryBase<TemplateQuery, TemplateQueryFilterDto>, ITemplateQueryRepository
    {
        public TemplateQueryRepository(DwDbContext context)
            : base(context)
        {
        }

        public override Func<IQueryable<TemplateQuery>, IQueryable<TemplateQuery>> ConstructInclude(IncludeType includeType = IncludeType.None)
        {
            return includeType switch
            {
                IncludeType.All => e => e,
                IncludeType.Collections => e => e,
                IncludeType.NavProperties => e => e,
                IncludeType.None => e => e,
                _ => e => e,
            };
        }
    }
}
