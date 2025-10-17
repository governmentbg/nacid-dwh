namespace Common.Models.FilterDtos
{
    public class FilterPropDto : IFilterPropDto
    {
        public int Limit { get; set; } = 30;
        public int Offset { get; set; }
        public bool GetAllData { get; set; } = false;

        public string TextFilter { get; set; }

        public bool? IsActive { get; set; }
    }
}
