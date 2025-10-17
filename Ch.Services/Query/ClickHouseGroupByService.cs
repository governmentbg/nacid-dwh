using Ch.Models.Dtos.GroupBy;
using Ch.Models.Dtos.Output;
using Ch.Models.Enums.Output;
using Dapper;

namespace Ch.Services.Query
{
    public class ClickHouseGroupByService
    {
        public string GetGroupBy(List<ChGroupByDto> groupBy, List<ChOutputDto> chOutputs)
        {
            var chNonAggregateOutputs = chOutputs.Where(e => e.OutputAction == OutputAction.ColumnAdd && e.AggregateFunction == AggregateFunction.None).ToList();

            if (groupBy.Count > 0)
            {
                string result = "GROUP BY\n GROUPING SETS(\n{0})";
                string groupingSets = string.Empty;

                foreach (var groupByItem in groupBy)
                {
                    groupingSets += $"{ConstructSingleGroupBy(groupByItem)}{(groupByItem != groupBy.Last() ? ",\n" : "\n")}";
                }

                return string.Format(result, groupingSets);
            }
            else if(chNonAggregateOutputs.Count > 0)
            {
                string result = "GROUP BY";

                foreach (var chOutput in chNonAggregateOutputs)
                {
                    var columnAs = $"`{chOutput.ColumnAs.Trim()}`";
                    result += $"\n {columnAs}{(chOutput != chNonAggregateOutputs.Last() ? "," : string.Empty)}";
                }

                return result;
            }
            else
            {
                return string.Empty;
            }
        }

        public void GroupByBuilder(SqlBuilder sqlBuilder, List<ChGroupByDto> groupBy, List<ChOutputDto> chOutputs)
        {
            if (groupBy.Count > 0)
            {
                string result = "GROUPING SETS(\n{0})";
                string groupingSets = string.Empty;

                foreach (var groupByItem in groupBy)
                {
                    groupingSets += $"{ConstructSingleGroupBy(groupByItem)}{(groupByItem != groupBy.Last() ? ",\n" : "\n")}";
                }

                sqlBuilder.GroupBy(string.Format(result, groupingSets));
            }
            else
            {
                foreach (var chOutputItem in chOutputs.Where(e => e.OutputAction == OutputAction.ColumnAdd && e.AggregateFunction == AggregateFunction.None).ToList())
                {
                    var columnAs = $"`{chOutputItem.ColumnAs.Trim()}`";
                    sqlBuilder.GroupBy(columnAs);
                }
            }
        }

        private string ConstructSingleGroupBy(ChGroupByDto groupBy)
        {
            return $"({string.Join(", ", groupBy.GroupByColumns.Select(e => $"`{e.ColumnAs.Trim()}`"))})";
        }
    }
}
