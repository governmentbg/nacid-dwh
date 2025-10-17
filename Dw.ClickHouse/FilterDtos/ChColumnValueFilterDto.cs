using Ch.Models.Enums.Order;
using Common.Models.FilterDtos;

namespace Ch.Models.FilterDtos
{
    public class ChColumnValueFilterDto : FilterPropDto
    {
        public OrderByType OrderBy { get; set; } = OrderByType.Asc;
    }
}
