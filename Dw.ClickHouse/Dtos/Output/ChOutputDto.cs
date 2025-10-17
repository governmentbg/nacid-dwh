using Ch.Models.Dtos.Condition;
using Ch.Models.Enums.Output;

namespace Ch.Models.Dtos.Output
{
    public class ChOutputDto : ChColumnOutputDto
    {
        public ChOutputDto SubqueryColumn { get; set; }

        public OutputAction OutputAction { get; set; } = OutputAction.ColumnAdd;
        public ChColumnOutputDto PartitionByColumn { get; set; }
        public List<ChColumnOutputDto> PartitionOverColumns { get; set; } = new List<ChColumnOutputDto>();
        public List<ChColumnOutputDto> SumColumns { get; set; } = new List<ChColumnOutputDto>();
        public AggregateFunction AggregateFunction { get; set; } = AggregateFunction.None;

        public List<ChConditionDto> Conditions { get; set; } = new List<ChConditionDto>();
    }
}
