using Dapper;
using Dw.ClickHouse.FilterDtos.Base;

namespace Dw.ClickHouse.FilterDtos
{
    public class ChTableFilterDto : ChFilterDto
    {
		public string Database { get; set; }

		public override void WhereBuilder(SqlBuilder sqlBuilder)
        {
			sqlBuilder.Where("lowerUTF8(database) = @database", new { database = Database });
            sqlBuilder.Where("lowerUTF8(comment) not like '%#hide%'");

            if (!string.IsNullOrWhiteSpace(TextFilter))
            {
                var textFilter = $"%{TextFilter.Trim()}%";
                sqlBuilder.Where("(name like @textFilter or comment like @textFilter)", new { textFilter });
            }
        }
    }
}
