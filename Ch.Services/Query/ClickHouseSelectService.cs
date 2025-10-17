using Ch.Models.Dtos.Output;
using Ch.Models.Enums;
using Ch.Models.Enums.Output;
using Dapper;
using Infrastructure.Helpers.Extensions;

namespace Ch.Services.Query
{
    public class ClickHouseSelectService
    {
        private readonly ClickHouseWhereService clickHouseWhereService;

        public ClickHouseSelectService(ClickHouseWhereService clickHouseWhereService)
        {
            this.clickHouseWhereService = clickHouseWhereService;
        }

        public string GetSelect(QueryType queryType, List<ChOutputDto> output)
        {
            if (output.Count > 0)
            {
                string result = "SELECT\n";

                foreach (var outputItem in output)
                {
                    result += $"{ConstructSingleSelect(queryType, outputItem)}{(outputItem != output.Last() ? ",\n" : "\n")}";
                }

                return result;
            }
            else
            {
                return string.Empty;
            }
        }

        public List<string> SelectBuilder(SqlBuilder sqlBuilder, QueryType queryType, List<ChOutputDto> output)
        {
            var titles = output.Select(e => e.ColumnAs.Trim()).ToList();

            foreach (var outputItem in output)
            {
                string outputItemSelect = ConstructSingleSelect(queryType, outputItem);

                sqlBuilder.Select(outputItemSelect);
            }

            return titles;
        }

        public string ConstructSingleSelect(QueryType queryType, ChOutputDto outputItem)
        {
            string outputItemSelect = string.Empty;

            var columnAs = $"`{outputItem.ColumnAs?.Trim() ?? (queryType == QueryType.FromTable ? outputItem.Column?.Comment : outputItem.SubqueryColumn?.ColumnAs)}`";

            if (outputItem.OutputAction != OutputAction.SumSelectedColumns)
            {
                outputItemSelect += ConstructConditionsAggregateFunctions(outputItemSelect, queryType, outputItem);

                if (outputItem.OutputAction == OutputAction.PartitionBy)
                {
                    string partitionOverString = string.Join(", ", outputItem.PartitionOverColumns.Select(e => $"`{e.ColumnAs.Trim()}`"));
                    outputItemSelect += $" OVER (PARTITION BY {partitionOverString})";
                }
            }
            else
            {
                outputItemSelect += ConstructSumColumns(outputItemSelect, outputItem);
            }

            if (!string.IsNullOrWhiteSpace(columnAs))
            {
                outputItemSelect += $" as {columnAs}";
            }

            return outputItemSelect;
        }

        private string ConstructConditionsAggregateFunctions(string outputItemSelect, QueryType queryType, ChOutputDto outputItem)
        {
            if (outputItem.Conditions.Count > 0)
            {
                clickHouseWhereService.FixConditionBrackets(outputItem.Conditions);
            }

            switch (outputItem.AggregateFunction)
            {
                case AggregateFunction.None:
                    outputItemSelect = ConstructAggregateFunction(queryType, outputItem.AggregateFunction, outputItem);
                    break;
                case AggregateFunction.Count:
                    outputItemSelect = $"count({ConstructAggregateFunction(queryType, outputItem.AggregateFunction, outputItem)})";
                    break;
                case AggregateFunction.CountIf:
                    outputItemSelect = clickHouseWhereService
                        .ConstructSingleCondition("countIf(" + ConstructAggregateFunction(queryType, outputItem.AggregateFunction, outputItem) + ", {0})", queryType, outputItem.Conditions);
                    break;
                case AggregateFunction.CountDistinct:
                    outputItemSelect = $"countDistinct({ConstructAggregateFunction(queryType, outputItem.AggregateFunction, outputItem)})";
                    break;
                case AggregateFunction.CountDistinctIf:
                    outputItemSelect = clickHouseWhereService
                        .ConstructSingleCondition("countDistinctIf(" + ConstructAggregateFunction(queryType, outputItem.AggregateFunction, outputItem) + ", {0})", queryType, outputItem.Conditions);
                    break;
                case AggregateFunction.Min:
                    outputItemSelect = $"min({ConstructAggregateFunction(queryType, outputItem.AggregateFunction, outputItem)})";
                    break;
                case AggregateFunction.MinIf:
                    outputItemSelect = clickHouseWhereService
                        .ConstructSingleCondition("minIf(" + ConstructAggregateFunction(queryType, outputItem.AggregateFunction, outputItem) + ", {0})", queryType, outputItem.Conditions);
                    break;
                case AggregateFunction.Max:
                    outputItemSelect = $"max({ConstructAggregateFunction(queryType, outputItem.AggregateFunction, outputItem)})";
                    break;
                case AggregateFunction.MaxIf:
                    outputItemSelect = clickHouseWhereService
                        .ConstructSingleCondition("maxIf(" + ConstructAggregateFunction(queryType, outputItem.AggregateFunction, outputItem) + ", {0})", queryType, outputItem.Conditions);
                    break;
                case AggregateFunction.Sum:
                    outputItemSelect = $"sum({ConstructAggregateFunction(queryType, outputItem.AggregateFunction, outputItem)})";
                    break;
                case AggregateFunction.SumIf:
                    outputItemSelect = clickHouseWhereService
                        .ConstructSingleCondition("sumIf(" + ConstructAggregateFunction(queryType, outputItem.AggregateFunction, outputItem) + ", {0})", queryType, outputItem.Conditions);
                    break;
                case AggregateFunction.Avg:
                    outputItemSelect = $"avg({ConstructAggregateFunction(queryType, outputItem.AggregateFunction, outputItem)})";
                    break;
                case AggregateFunction.AvgIf:
                    outputItemSelect = clickHouseWhereService
                        .ConstructSingleCondition("avgIf(" + ConstructAggregateFunction(queryType, outputItem.AggregateFunction, outputItem) + ", {0})", queryType, outputItem.Conditions);
                    break;
                default:
                    outputItemSelect = ConstructAggregateFunction(queryType, AggregateFunction.None, outputItem);
                    break;
            }

            return outputItemSelect;
        }

        private string ConstructAggregateFunction(QueryType queryType, AggregateFunction aggregateFunction, ChOutputDto outputItem)
        {
            if (aggregateFunction == AggregateFunction.None)
            {
                return queryType == QueryType.FromTable ? $"`{outputItem.Column.Name}`" : $"`{outputItem.SubqueryColumn.ColumnAs}`";
            } 
            else
            {
                return outputItem.OutputAction == OutputAction.ColumnAdd
                        ? (queryType == QueryType.FromTable ? $"`{outputItem.Column.Name}`" : $"`{outputItem.SubqueryColumn.ColumnAs}`")
                        : outputItem.OutputAction == OutputAction.PartitionBy
                            ? $"`{outputItem.PartitionByColumn.ColumnAs.Trim()}`"
                            : string.Empty;
            }
        }

        private string ConstructSumColumns(string outputItemSelect, ChOutputDto outputItem)
        {
            outputItemSelect += string.Join(" + ", outputItem.SumColumns.Select(e => $"`{e.ColumnAs.Trim()}`"));

            return outputItemSelect;
        }
    }
}
