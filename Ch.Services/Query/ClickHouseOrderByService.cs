using Ch.Models.Dtos.OrderBy;
using Ch.Models.Enums.Order;
using Dapper;

namespace Ch.Services.Query
{
    public class ClickHouseOrderByService
    {
        public string GetOrderBy(List<ChOrderByDto> orderBy)
        {
            if (orderBy.Count > 0)
            {
                string result = "ORDER BY\n";

                foreach (var orderByItem in orderBy)
                {
                    result += $"{ConstructSingleOrderBy(orderByItem)}{(orderByItem != orderBy.Last() ? ",\n" : "\n")}";
                }

                return result;
            }
            else
            {
                return string.Empty;
            }
        }

        public void OrderByBuilder(SqlBuilder sqlBuilder, List<ChOrderByDto> orderBy)
        {
            foreach (var orderByItem in orderBy)
            {
                string orderByItemString = ConstructSingleOrderBy(orderByItem);
                sqlBuilder.OrderBy(orderByItemString);
            }
        }

        private string ConstructSingleOrderBy(ChOrderByDto orderBy)
        {
            return $" `{orderBy.OrderByColumn.ColumnAs.Trim()}` {(orderBy.OrderBy == OrderByType.Asc ? "asc" : "desc")}";
        }
    }
}
