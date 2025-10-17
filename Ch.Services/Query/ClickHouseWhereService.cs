using Ch.Models.Dtos.Condition;
using Ch.Models.Enums;
using Dapper;

namespace Ch.Services.Query
{
    public class ClickHouseWhereService
    {
        public string GetWhere(QueryType queryType, List<ChConditionDto> conditions)
        {
            if (conditions.Count > 0)
            {
                FixConditionBrackets(conditions);
                string result = "WHERE\n" + ConstructSingleCondition("{0}", queryType, conditions);

                return result;
            }
            else
            {
                return string.Empty;
            }
        }

        public void WhereBuilder(SqlBuilder sqlBuilder, QueryType queryType, List<ChConditionDto> conditions)
        {
            if (conditions.Count > 0) {
                FixConditionBrackets(conditions);
                sqlBuilder.Where(ConstructSingleCondition("{0}", queryType, conditions));
            }
        }

        public string ConstructSingleCondition(string baseCondition, QueryType queryType, List<ChConditionDto> conditions)
        {
            string constructedCondition = string.Empty;

            foreach (ChConditionDto condition in conditions)
            {
                var columnName = $"`{(queryType == QueryType.FromTable ? condition.Column.Name : condition.SubqueryColumn.ColumnAs)}`";

                if (condition.Conjuction.HasValue)
                {
                    constructedCondition += condition.Conjuction == Conjuction.And
                        ? "and "
                        : condition.Conjuction == Conjuction.Or
                            ? "or "
                            : string.Empty;
                }

                if (condition.HasOpeningBracket)
                {
                    constructedCondition += "(";
                }

                constructedCondition += condition.Operator switch
                {
                    Operator.EqualTo => $"{columnName} = '{condition.ExpectedResult}' ",
                    Operator.GreaterThan => $"{columnName} > '{condition.ExpectedResult}' ",
                    Operator.LessThan => $"{columnName} < '{condition.ExpectedResult}' ",
                    Operator.GreaterThanOrEqualTo => $"{columnName} >= '{condition.ExpectedResult}' ",
                    Operator.LessThanOrEqualTo => $"{columnName} <= '{condition.ExpectedResult}' ",
                    Operator.NotEqualTo => $"{columnName} <> '{condition.ExpectedResult}' ",
                    Operator.In => $"{columnName} in ({string.Join(", ", condition.Contains.Select(e => $"'{e.ExpectedResult}'"))})",
                    Operator.NotIn => $"{columnName} not in ({string.Join(", ", condition.Contains.Select(e => $"'{e.ExpectedResult}'"))})",
                    Operator.Like => $"{columnName} like '%{condition.ExpectedResult}%' ",
                    Operator.NotLike => $"{columnName} not like '%{condition.ExpectedResult}%' ",
                    Operator.IsNull => $"{columnName} is null ",
                    Operator.IsNotNull => $"{columnName} is not null ",
                    Operator.Empty => $"empty({columnName}) ",
                    Operator.NotEmpty => $"notEmpty({columnName}) ",
                    _ => $"{columnName} = '{condition.ExpectedResult}' "
                };

                if (condition.HasClosingBracket)
                {
                    constructedCondition += ") ";
                }

                constructedCondition += "\n";
            }

            return string.Format(baseCondition, constructedCondition);
        }

        public void FixConditionBrackets(List<ChConditionDto> conditions)
        {
            var openingBrackets = conditions.Select(e => e.HasOpeningBracket).Count(e => e == true);
            var closingBrackets = conditions.Select(e => e.HasClosingBracket).Count(e => e == true);

            if (openingBrackets > closingBrackets)
            {
                var closingBracketsToAdd = openingBrackets - closingBrackets;

                conditions
                    .Where(e => !e.HasClosingBracket)
                    .TakeLast(closingBracketsToAdd)
                    .ToList()
                    .ForEach(e => e.HasClosingBracket = true);
            }
            else if (closingBrackets > openingBrackets)
            {
                var openingBracketsToAdd = closingBrackets - openingBrackets;

                conditions
                    .Where(e => !e.HasOpeningBracket)
                    .TakeLast(openingBracketsToAdd)
                    .ToList()
                    .ForEach(e => e.HasOpeningBracket = true);
            }
        }
    }
}
