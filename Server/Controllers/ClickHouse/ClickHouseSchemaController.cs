using Ch.Models.Dtos;
using Ch.Models.FilterDtos;
using Common.Models.Dtos;
using Common.Models.FilterDtos;
using Dw.ClickHouse.Dtos.Output;
using Dw.ClickHouse.FilterDtos;
using Dw.ClickHouse.Services;
using Infrastructure.DomainValidation;
using Infrastructure.DomainValidation.Models.ErrorCodes;
using Infrastructure.UserContext.Attributes;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Server.Controllers.ClickHouse
{
    [ApiController]
    [Authorize, AuthorizedDevice, DwClient]
    [Route("api/ch/schema")]
    public class ClickHouseSchemaController : ControllerBase
    {
        private readonly ClickHouseSchemaService clickHouseSchemaService;
        private readonly DomainValidatorService domainValidatorService;

        public ClickHouseSchemaController(
            ClickHouseSchemaService clickHouseSchemaService,
            DomainValidatorService domainValidatorService
            )
        {
            this.clickHouseSchemaService = clickHouseSchemaService;
            this.domainValidatorService = domainValidatorService;
        }

        [HttpPost("tables")]
        public async Task<ActionResult<SearchResultDto<ChTableDto>>> GetTables([FromBody] ChTableFilterDto filter, CancellationToken cancellationToken)
        {
            return Ok(await clickHouseSchemaService.GetTables(filter, cancellationToken));
        }

        [HttpPost("{table}/columns")]
        public async Task<ActionResult<SearchResultDto<ChColumnDto>>> GetTableColumns([FromRoute] string table, [FromBody] ChColumnFilterDto filter, CancellationToken cancellationToken)
        {
            var allTables = await clickHouseSchemaService.GetTables(new ChTableFilterDto(), cancellationToken);

            if (!allTables.Result.Any(e => e.Name == table))
            {
                domainValidatorService.ThrowErrorMessage(ClickHouseErrorCode.ClickHouse_InvalidTable);
            }

            return Ok(await clickHouseSchemaService.GetTableColumns(table, filter, cancellationToken));
        }

        [HttpPost("{table}/{column}/values")]
        public async Task<ActionResult<SearchResultDto<ChColumnValueDto>>> GetColumnValues([FromRoute] string table, [FromRoute] string column, [FromBody] ChColumnValueFilterDto filter, CancellationToken cancellationToken)
        {
            var allTables = await clickHouseSchemaService.GetTables(new ChTableFilterDto(), cancellationToken);

            if (!allTables.Result.Any(e => e.Name == table))
            {
                domainValidatorService.ThrowErrorMessage(ClickHouseErrorCode.ClickHouse_InvalidTable);
            }

            return Ok(await clickHouseSchemaService.GetColumnValues(table, column, filter, cancellationToken));
        }
    }
}
