using Ch.Models.Dtos.Output;
using Ch.Models.Enums;
using Dw.ClickHouse.Dtos.Output;

namespace Ch.Models.Dtos.Condition
{
    public class ChConditionDto
    {
        public Conjuction? Conjuction { get; set; }
        public bool HasOpeningBracket { get; set; } = false;
        public ChOutputDto SubqueryColumn { get; set; }
        public ChColumnDto Column { get; set; }
        public Operator Operator { get; set; } = Operator.EqualTo;
        public string ExpectedResult { get; set; }
        public List<ChConditionContainDto> Contains { get; set; } = new List<ChConditionContainDto>();
        public bool HasClosingBracket { get; set; } = false;
    }
}
