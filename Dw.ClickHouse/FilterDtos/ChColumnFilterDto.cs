using Dapper;
using Dw.ClickHouse.FilterDtos.Base;

namespace Dw.ClickHouse.FilterDtos
{
    public class ChColumnFilterDto : ChFilterDto
    {
        public string Table { get; set; }
        public string Database { get; set; }

        public override void WhereBuilder(SqlBuilder sqlBuilder)
        {
            sqlBuilder.Where("lowerUTF8(database) = @database", new { database = Database });
            sqlBuilder.Where("lowerUTF8(table) = lowerUTF8(@table)", new { table = Table });
            sqlBuilder.Where("lowerUTF8(comment) not like '%#hide%'");

            if (!string.IsNullOrWhiteSpace(TextFilter))
            {
                var textFilter = $"%{TextFilter.Trim()}%";
                sqlBuilder.Where("(lowerUTF8(name) like lowerUTF8(@textFilter) or lowerUTF8(comment) like lowerUTF8(@textFilter))", new { textFilter });
            }
        }
    }
}
