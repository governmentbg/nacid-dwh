namespace Ch.Models.Dtos
{
    public class TemplateSubquerySearchDto
    {
        public int Id { get; set; }

        public string Name { get; set; }
        public string NameAlt { get; set; }

        public ChQueryDto ChQuery { get; set; }
    }
}
