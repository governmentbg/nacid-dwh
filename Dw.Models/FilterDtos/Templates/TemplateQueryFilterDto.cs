using Common.Models.FilterDtos;
using Dw.Models.Entities.Templates;
using Dw.Models.Enums.Templates;

namespace Dw.Models.FilterDtos.Templates
{
    public class TemplateQueryFilterDto : FilterDto<TemplateQuery>
    {
        public int? TemplateGroupId { get; set; }

        public string Name { get; set; }

        public bool? ShowAsSubquery { get; set; }
        public TemplateAccessLevel? AccessLevel { get; set; }
        public int? AccessUserId { get; set; }

        public override IQueryable<TemplateQuery> WhereBuilder(IQueryable<TemplateQuery> query)
        {
            if (TemplateGroupId.HasValue)
            {
                query = query.Where(e => e.TemplateGroupId == TemplateGroupId.Value);
            }

            if (!string.IsNullOrWhiteSpace(Name))
            {
                var name = Name.Trim().ToLower();
                query = query.Where(e => e.Name.Trim().ToLower().Contains(name)  || e.NameAlt.Trim().ToLower().Contains(name));
            }

            if (ShowAsSubquery.HasValue)
            {
                query = query.Where(e => e.ShowAsSubquery == ShowAsSubquery.Value);
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

            query = ConstructTextFilter(query);

            return query;
        }

        public virtual IQueryable<TemplateQuery> ConstructTextFilter(IQueryable<TemplateQuery> query)
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
