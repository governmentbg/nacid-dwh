using Ch.Models.Dtos;
using Ch.Models.Dtos.Condition;
using Ch.Models.Dtos.OrderBy;
using Ch.Models.Dtos.Output;
using Ch.Models.Enums;
using Ch.Services;
using Ch.Services.Query;
using Common.Models.Dtos;
using Infrastructure.UserContext.Attributes;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Server.Controllers.ClickHouse
{
    [ApiController]
    [Authorize, AuthorizedDevice, DwClient]
    [Route("api/ch/query")]
    public class ClickHouseQueryController : ControllerBase
    {
        private readonly ClickHouseQueryService clickHouseQueryService;
        private readonly ClickHouseSelectService clickHouseSelectService;
        private readonly ClickHouseWhereService clickHouseWhereService;
        private readonly ClickHouseGroupByService clickHouseGroupByService;
        private readonly ClickHouseOrderByService clickHouseOrderByService;

        public ClickHouseQueryController(
            ClickHouseQueryService clickHouseQueryService,
            ClickHouseSelectService clickHouseSelectService,
            ClickHouseWhereService clickHouseWhereService,
            ClickHouseGroupByService clickHouseGroupByService,
            ClickHouseOrderByService clickHouseOrderByService
            )
        {
            this.clickHouseQueryService = clickHouseQueryService;
            this.clickHouseSelectService = clickHouseSelectService;
            this.clickHouseWhereService = clickHouseWhereService;
            this.clickHouseGroupByService = clickHouseGroupByService;
            this.clickHouseOrderByService = clickHouseOrderByService;
        }

        [HttpPost]
        public async Task<ActionResult<TitledSearchResultDto<dynamic>>> GetQuery([FromBody] ChQueryDto query, CancellationToken cancellationToken)
        {
            await clickHouseQueryService.ValidateQuery(query, cancellationToken);

            return Ok(await clickHouseQueryService.GetQuery(query, true, cancellationToken));
        }

        [HttpPost("string")]
        public async Task<ActionResult<string>> GetQueryString([FromBody] ChQueryDto query, CancellationToken cancellationToken)
        {
            await clickHouseQueryService.ValidateQuery(query, cancellationToken);

            return Ok(clickHouseQueryService.GetQueryString(query));
        }

        [HttpPost("select/{queryType}")]
        public ActionResult<string> GetSelect([FromRoute] QueryType queryType, [FromBody] List<ChOutputDto> output)
        {
            return Ok(clickHouseSelectService.GetSelect(queryType, output));
        }

        [HttpPost("singleSelect/{queryType}")]
        public ActionResult<string> GetSingleSelect([FromRoute] QueryType queryType, [FromBody] ChOutputDto output)
        {
            return Ok(clickHouseSelectService.ConstructSingleSelect(queryType, output));
        }

        [HttpPost("where/{queryType}")]
        public ActionResult<string> GetWhere([FromRoute] QueryType queryType, [FromBody] List<ChConditionDto> condition)
        {
            return Ok(clickHouseWhereService.GetWhere(queryType, condition));
        }

        [HttpPost("groupBy")]
        public ActionResult<string> GetGroupBy([FromBody] ChQueryDto query)
        {
            return Ok(clickHouseGroupByService.GetGroupBy(query.GroupBy, query.Output));
        }

        [HttpPost("orderBy")]
        public ActionResult<string> GetOrderBy([FromBody] List<ChOrderByDto> orderBy)
        {
            return Ok(clickHouseOrderByService.GetOrderBy(orderBy));
        }
    }
}
