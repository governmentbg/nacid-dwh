using Ch.Models.Dtos.Output;
using Ch.Models.Enums.Order;

namespace Ch.Models.Dtos.OrderBy
{
    public class ChOrderByDto
    {
        public ChColumnOutputDto OrderByColumn { get; set; }
        public OrderByType OrderBy { get; set; } = OrderByType.Asc;
    }
}
