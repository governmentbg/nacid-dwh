using Ch.Models.Dtos.Output;

namespace Ch.Models.Dtos.GroupBy
{
    public class ChGroupByDto
    {
        public List<ChColumnOutputDto> GroupByColumns { get; set; } = new List<ChColumnOutputDto>();
    }
}
