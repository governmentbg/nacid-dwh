namespace Common.Models.Dtos
{
    public class TitledSearchResultDto<T> : SearchResultDto<T>
        where T : class
    {
        public List<string> Titles { get; set; } = new List<string>();
    }
}
