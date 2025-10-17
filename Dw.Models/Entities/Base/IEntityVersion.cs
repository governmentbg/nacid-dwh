namespace Dw.Models.Entities.Base
{
    public interface IEntityVersion
    {
        int Id { get; set; }
        int Version { get; set; }
        int ViewOrder { get; set; }
    }
}
