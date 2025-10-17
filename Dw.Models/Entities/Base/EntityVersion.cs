namespace Dw.Models.Entities.Base
{
    public class EntityVersion : IEntityVersion
    {
        public int Id { get; set; }
        public int Version { get; set; }
        public int ViewOrder { get; set; }
    }
}
