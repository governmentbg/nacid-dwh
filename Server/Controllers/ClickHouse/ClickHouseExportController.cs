using Ch.Models.Dtos;
using Ch.Services;
using Infrastructure.UserContext.Attributes;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Server.Controllers.ClickHouse
{
    [ApiController]
    [Authorize, AuthorizedDevice, DwClient]
    [Route("api/ch/export")]
    public class ClickHouseExportController : ControllerBase
    {
        private readonly ClickHouseExportService clickHouseExportService;

        public ClickHouseExportController(ClickHouseExportService clickHouseExportService)
        {
            this.clickHouseExportService = clickHouseExportService;
        }

        [HttpPost("excel")]
        public async Task<FileStreamResult> ExportExcel([FromBody] ChQueryDto query, CancellationToken cancellationToken)
        {
            var excelStream = await clickHouseExportService.ExportExcel(query, cancellationToken);

            return new FileStreamResult(excelStream, "application/vnd.ms-excel");
        }

        [HttpPost("csv")]
        public async Task<FileContentResult> ExportCsv([FromBody] ChQueryDto query, CancellationToken cancellationToken)
        {
            var csvStream = await clickHouseExportService.ExportCsv(query, cancellationToken);

            return new FileContentResult(csvStream.ToArray(), "text/csv");
        }

        [HttpPost("json")]
        public async Task<ActionResult<List<dynamic>>> ExportJson([FromBody] ChQueryDto query, CancellationToken cancellationToken)
        {
            return Ok(await clickHouseExportService.ExportJson(query, cancellationToken));
        }

        [HttpPost("xml")]
        public async Task<FileContentResult> ExportXml([FromBody] ChQueryDto query, CancellationToken cancellationToken)
        {
            var xmlBytes = await clickHouseExportService.ExportXml(query, cancellationToken);

            return new FileContentResult(xmlBytes, "text/xml");
        }
    }
}
