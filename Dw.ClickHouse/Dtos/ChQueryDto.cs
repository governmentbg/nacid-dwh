using Ch.Models.Dtos.Condition;
using Ch.Models.Dtos.GroupBy;
using Ch.Models.Dtos.OrderBy;
using Ch.Models.Dtos.Output;
using Ch.Models.Enums;

namespace Ch.Models.Dtos
{
    public class ChQueryDto
    {
        public QueryType QueryType { get; set; } = QueryType.FromTable;
        public ChTableDto Table { get; set; }
        public TemplateSubquerySearchDto Subquery { get; set; }
        public ChPaginationDto Pagination { get; set; } = new ChPaginationDto();
        public List<ChOutputDto> Output { get; set; } = new List<ChOutputDto>();
        public List<ChConditionDto> Condition { get; set; } = new List<ChConditionDto>();
        public List<ChGroupByDto> GroupBy { get; set; } = new List<ChGroupByDto>();
        public List<ChOrderByDto> OrderBy { get; set; } = new List<ChOrderByDto>();
    }
}
