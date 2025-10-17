namespace Common.Models.FilterDtos
{
    public interface IFilterPropDto
    {
        int Limit { get; set; }
        int Offset { get; set; }
        bool GetAllData { get; set; }
        string TextFilter { get; set; }
    }
}
