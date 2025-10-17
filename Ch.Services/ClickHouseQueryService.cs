using Ch.Models.Dtos;
using Ch.Models.Enums;
using Ch.Services.Query;
using ClickHouse.Client.ADO;
using Common.Models.Dtos;
using Dapper;
using Dw.ClickHouse.FilterDtos;
using Dw.ClickHouse.Services;
using Infrastructure.AppSettings;
using Infrastructure.DomainValidation;
using Infrastructure.DomainValidation.Models.ErrorCodes;

namespace Ch.Services
{
    public class ClickHouseQueryService
    {
        private readonly ClickHouseSchemaService clickHouseSchemaService;
        private readonly ClickHouseSelectService clickHouseSelectService;
        private readonly ClickHouseWhereService clickHouseWhereService;
        private readonly ClickHouseGroupByService clickHouseGroupByService;
        private readonly ClickHouseOrderByService clickHouseOrderByService;
        private readonly DomainValidatorService domainValidatorService;

        public ClickHouseQueryService(
            ClickHouseSchemaService clickHouseSchemaService,
            ClickHouseSelectService clickHouseSelectService,
            ClickHouseWhereService clickHouseWhereService,
            ClickHouseGroupByService clickHouseGroupByService,
            ClickHouseOrderByService clickHouseOrderByService,
            DomainValidatorService domainValidatorService)
        {
            this.clickHouseSchemaService = clickHouseSchemaService;
            this.clickHouseSelectService = clickHouseSelectService;
            this.clickHouseWhereService = clickHouseWhereService;
            this.clickHouseGroupByService = clickHouseGroupByService;
            this.clickHouseOrderByService = clickHouseOrderByService;
            this.domainValidatorService = domainValidatorService;
        }


        public async Task ValidateQuery(ChQueryDto query, CancellationToken cancellationToken)
        {
            var allTables = await clickHouseSchemaService.GetTables(new ChTableFilterDto(), cancellationToken);

            if (query == null)
            {
                domainValidatorService.ThrowErrorMessage(ClickHouseErrorCode.ClickHouse_Query_Empty);
            }

            if (query.QueryType == QueryType.FromTable ? query.Table == null : query.Subquery.ChQuery.Table == null)
            {
                domainValidatorService.ThrowErrorMessage(ClickHouseErrorCode.ClickHouse_Query_TableRequired);
            }

            if (query.QueryType == QueryType.FromTable ? !allTables.Result.Any(e => e.Name == query.Table.Name) : !allTables.Result.Any(e => e.Name == query.Subquery.ChQuery.Table.Name))
            {
                domainValidatorService.ThrowErrorMessage(ClickHouseErrorCode.ClickHouse_InvalidTable);
            }

            if (!query.Output.Any())
            {
                domainValidatorService.ThrowErrorMessage(ClickHouseErrorCode.ClickHouse_Query_OutputEmpty);
            }
        }

        public async Task<TitledSearchResultDto<dynamic>> GetQuery(ChQueryDto query, bool exportRowCount, CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();
            using var clickHouseConnection = new ClickHouseConnection(AppSettingsProvider.ClickHouseDbConnectionString);

            var sqlBuilder = new SqlBuilder();
            var builderTemplate = sqlBuilder.AddTemplate($"select {(exportRowCount ? "count() OVER () AS RowCount, " : string.Empty)} /**select**/ from {(query.QueryType == QueryType.FromTable ? $"students.{query.Table.Name}" : $"({GetQueryString(query.Subquery.ChQuery)})")} /**where**/ /**groupby**/ /**orderby**/ {(query.Pagination.Limit > 0 ? $"limit {query.Pagination.Limit} offset {query.Pagination.Offset}" : $"offset {query.Pagination.Offset}")}");
            var titles = clickHouseSelectService.SelectBuilder(sqlBuilder, query.QueryType, query.Output);
            clickHouseWhereService.WhereBuilder(sqlBuilder, query.QueryType, query.Condition);
            clickHouseGroupByService.GroupByBuilder(sqlBuilder, query.GroupBy, query.Output);
            clickHouseOrderByService.OrderByBuilder(sqlBuilder, query.OrderBy);

            var rawResult = await clickHouseConnection.QueryAsync<dynamic>(builderTemplate.RawSql, builderTemplate.Parameters);
            var result = rawResult.ToList();
            int totalCount = exportRowCount ? Convert.ToInt32(result.FirstOrDefault()?.RowCount ?? 0) : 0;

            var titledSearchResult = new TitledSearchResultDto<dynamic>
            {
                Titles = titles,
                Result = result,
                TotalCount = totalCount
            };

            return titledSearchResult;
        }

        public string GetQueryString(ChQueryDto query)
        {
            return $"{clickHouseSelectService.GetSelect(query.QueryType, query.Output)}FROM {(query.QueryType == QueryType.FromTable ? $"students.{query.Table.Name}" : $"({GetQueryString(query.Subquery.ChQuery)})")}\n{clickHouseWhereService.GetWhere(query.QueryType, query.Condition)}{clickHouseGroupByService.GetGroupBy(query.GroupBy, query.Output)}\n{clickHouseOrderByService.GetOrderBy(query.OrderBy)}";
        }
    }
}
