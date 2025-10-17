namespace Dw.Models.Entities.SchemaVersion
{
    public class SchemaVersion
    {
        public int Id { get; set; }
        public string Version { get; set; }
        public DateTime Updatedon { get; set; }
        public string Systemname { get; set; }
    }
}
