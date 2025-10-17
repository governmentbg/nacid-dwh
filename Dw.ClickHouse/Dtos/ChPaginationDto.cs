namespace Ch.Models.Dtos
{
    public class ChPaginationDto
    {
        public int Limit { get; set; } = 30;
        public int Offset { get; set; } = 0;
    }
}
