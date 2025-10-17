using Dw.ClickHouse.Dtos.Output;

namespace Ch.Models.Dtos.Output
{
    public class ChColumnOutputDto
    {
        public ChColumnDto Column { get; set; }
        public string ColumnAs { get; set; }
    }
}
