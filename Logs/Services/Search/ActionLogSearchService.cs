using Logs.Entities;
using Logs.FilterDtos;
using Logs.Services.Search.Base;

namespace Logs.Services.Search
{
    public class ActionLogSearchService : BaseLogSearchService<ActionLog, ActionLogFilterDto>
    {
        public ActionLogSearchService(LogDbContext context)
            : base(context)
        { }
    }
}
