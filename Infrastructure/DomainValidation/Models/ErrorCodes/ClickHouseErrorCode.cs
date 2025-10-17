namespace Infrastructure.DomainValidation.Models.ErrorCodes
{
    public enum ClickHouseErrorCode
    {
        ClickHouse_InvalidTable,
        ClickHouse_Query_Empty,
        ClickHouse_Query_TableRequired,
        ClickHouse_Query_OutputEmpty
    }
}
