using Common.Models.FilterDtos;
using Dw.Models.Entities.Templates;
using Dw.Models.Enums.Templates;

namespace Dw.Models.FilterDtos.Templates
{
    public class TemplateGroupFilterDto : FilterDto<TemplateGroup>
    {
        public string Name { get; set; }

        public TemplateAccessLevel? AccessLevel { get; set; }
        public int? AccessUserId { get; set; }

        public List<int> ExcludeGroupIds { get; set; } = new List<int>();

        public override IQueryable<TemplateGroup> WhereBuilder(IQueryable<TemplateGroup> query)
        {
            if (!string.IsNullOrWhiteSpace(Name))
            {
                var name = Name.Trim().ToLower();
                query = query.Where(e => e.Name.Trim().ToLower().Contains(name)  || e.NameAlt.Trim().ToLower().Contains(name));
            }

            if (AccessLevel.HasValue)
            {
                query = query.Where(e => e.AccessLevel == AccessLevel);
            }

            if (AccessUserId.HasValue)
            {
                query = query.Where(e => e.AccessLevel == TemplateAccessLevel.Public 
                    || (e.AccessUserId == AccessUserId && e.AccessLevel == TemplateAccessLevel.Private));
            }
            else
            {
                query = query.Where(e => e.AccessLevel == TemplateAccessLevel.Public);
            }

            if (ExcludeGroupIds.Any())
            {
                query = query.Where(e => !ExcludeGroupIds.Contains(e.Id));
            }

            query = ConstructTextFilter(query);

            return query;
        }

        public virtual IQueryable<TemplateGroup> ConstructTextFilter(IQueryable<TemplateGroup> query)
        {
            if (!string.IsNullOrWhiteSpace(TextFilter))
            {
                var textFilter = $"{TextFilter.Trim().ToLower()}";
                query = query.Where(e => e.Name.Trim().ToLower().Contains(textFilter));
            }

            return query;
        }
    }
}
