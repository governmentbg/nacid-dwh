using Ch.Models.Dtos;
using Ch.Models.Enums.Order;
using Ch.Models.FilterDtos;
using ClickHouse.Client.ADO;
using Common.Models.Dtos;
using Dapper;
using Dw.ClickHouse.Dtos.Output;
using Dw.ClickHouse.FilterDtos;
using Dw.ClickHouse.FilterDtos.Base;
using Infrastructure.AppSettings;
using static Dapper.SqlBuilder;

namespace Dw.ClickHouse.Services
{
    public class ClickHouseSchemaService
    {
        public async Task<SearchResultDto<ChTableDto>> GetTables(ChTableFilterDto filter, CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();
            using var clickHouseConnection = new ClickHouseConnection(AppSettingsProvider.ClickHouseDbConnectionString);

			filter.Database = "students";
			var builderTemplate = BuildInitialSchemaTemplate(filter, "SELECT name, comment FROM system.tables /**where**/ ORDER BY comment ASC");

            var result = await clickHouseConnection.QueryAsync<ChTableDto>(builderTemplate.RawSql, builderTemplate.Parameters);

			var searchResult = new SearchResultDto<ChTableDto>
            {
                Result = result.ToList(),
                TotalCount = result.Count()
            };

            return searchResult;
        }

        public async Task<SearchResultDto<ChColumnDto>> GetTableColumns(string table, ChColumnFilterDto filter, CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();
            using var clickHouseConnection = new ClickHouseConnection(AppSettingsProvider.ClickHouseDbConnectionString);

            filter.Database = "students";
            filter.Table = table;
            var builderTemplate = BuildInitialSchemaTemplate(filter, $"SELECT name, type, comment from system.columns /**where**/");

            var result = await clickHouseConnection.QueryAsync<ChColumnDto>(builderTemplate.RawSql, builderTemplate.Parameters);

            var searchResult = new SearchResultDto<ChColumnDto>
            {
                Result = result.Select(e => new ChColumnDto
                {
                    Name = e.Name,
                    Comment = e.Comment,
                    Type = $"({e.Type
                        .Replace("LowCardinality", "")
                        .Replace("Nullable(", "Nullable - ")
                        .Replace("Enum8(", "Enum: ")
                        .TrimStart('(')
                        .TrimEnd(')')})"
                }).ToList(),
                TotalCount = result.Count()
            };

            return searchResult;
        }

        public async Task<SearchResultDto<ChColumnValueDto>> GetColumnValues(string table, string column, ChColumnValueFilterDto filter, CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();
            using var clickHouseConnection = new ClickHouseConnection(AppSettingsProvider.ClickHouseDbConnectionString);

            var sqlBuilder = new SqlBuilder();
            var builderTemplate = sqlBuilder.AddTemplate($"select count() OVER () AS RowCount, /**select**/ from students.{table} /**where**/ /**groupby**/ /**orderby**/ {(filter.Limit > 0 ? $"limit {filter.Limit} offset {filter.Offset}" : $"offset {filter.Offset}")}");

            sqlBuilder.Select($"{column} as StringValue");

            if (!string.IsNullOrWhiteSpace(filter.TextFilter))
            {
                var textFilter = $"%{filter.TextFilter.Trim()}%";
                sqlBuilder.Where($"lowerUTF8(StringValue) like lowerUTF8(@textFilter)", new { textFilter });
            }

            sqlBuilder.GroupBy("StringValue");

            if (filter.OrderBy == OrderByType.Asc)
            {
                sqlBuilder.OrderBy("StringValue asc");
            } 
            else
            {
                sqlBuilder.OrderBy("StringValue desc");
            }

            var rawResult = await clickHouseConnection.QueryAsync<ChColumnValueDto>(builderTemplate.RawSql, builderTemplate.Parameters);
            var result = rawResult.ToList();
            int totalCount = Convert.ToInt32(result.FirstOrDefault()?.RowCount ?? 0);

            var searchResult = new SearchResultDto<ChColumnValueDto>
            {
                Result = result,
                TotalCount = totalCount
            };

            return searchResult;
        }

        private Template BuildInitialSchemaTemplate<TFilter>(TFilter filter, string template)
        where TFilter : ChFilterDto
        {
            var sqlBuilder = new SqlBuilder();
            var builderTemplate = sqlBuilder.AddTemplate(template);
            filter.WhereBuilder(sqlBuilder);

            return builderTemplate;
        }
    }
}
