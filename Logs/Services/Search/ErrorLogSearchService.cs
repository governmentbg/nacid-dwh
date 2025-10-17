using Logs.Entities;
using Logs.FilterDtos;
using Logs.Services.Search.Base;

namespace Logs.Services.Search
{
    public class ErrorLogSearchService : BaseLogSearchService<ErrorLog, ErrorLogFilterDto>
    {
        public ErrorLogSearchService(LogDbContext context)
            : base(context)
        { }
    }
}
