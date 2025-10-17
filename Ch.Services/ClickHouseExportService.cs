using Ch.Models.Dtos;
using Infrastructure.FileManagementPackages.Xml;
using Infrastructure.OfficePackages.Csv;
using Infrastructure.OfficePackages.Excel.Models;
using Infrastructure.OfficePackages.Excel.Services;
using System.Text;
using System.Xml;
using System.Xml.Serialization;

namespace Ch.Services
{
    public class ClickHouseExportService
    {
        private readonly ClickHouseQueryService clickHouseQueryService;
        private readonly ExcelProcessorService excelProcessorService;
        private readonly CsvProcessorService csvProcessorService;
        private readonly DynamicXmlSerialize dynamicXmlSerialize;

        public ClickHouseExportService(
            ClickHouseQueryService clickHouseQueryService,
            ExcelProcessorService excelProcessorService,
            CsvProcessorService csvProcessorService,
            DynamicXmlSerialize dynamicXmlSerialize
            )
        {
            this.clickHouseQueryService = clickHouseQueryService;
            this.excelProcessorService = excelProcessorService;
            this.csvProcessorService = csvProcessorService;
            this.dynamicXmlSerialize = dynamicXmlSerialize;
        }

        public async Task<MemoryStream> ExportExcel(ChQueryDto query, CancellationToken cancellationToken)
        {
            await clickHouseQueryService.ValidateQuery(query, cancellationToken);

            query.Pagination = new ChPaginationDto
            {
                Limit = 500000,
                Offset = 0
            };

            var result = await clickHouseQueryService.GetQuery(query, false, cancellationToken);

            var sheets = new List<ExcelSheetDto>
            {
                new ExcelSheetDto
                {
                    SheetName = "Report",
                    Titles = result.Titles,
                    Items = result.Result
                }
            };

            var excelStream = excelProcessorService.ExportMultiSheet(sheets);

            return excelStream;
        }

        public async Task<MemoryStream> ExportCsv(ChQueryDto query, CancellationToken cancellationToken)
        {
            await clickHouseQueryService.ValidateQuery(query, cancellationToken);

            query.Pagination = new ChPaginationDto
            {
                Limit = 500000,
                Offset = 0
            };

            var result = await clickHouseQueryService.GetQuery(query, false, cancellationToken);

            return csvProcessorService.ExportCsv(result.Result);
        }

        public async Task<List<dynamic>> ExportJson(ChQueryDto query, CancellationToken cancellationToken)
        {
            await clickHouseQueryService.ValidateQuery(query, cancellationToken);

            query.Pagination = new ChPaginationDto
            {
                Limit = 500000,
                Offset = 0
            };

            var result = await clickHouseQueryService.GetQuery(query, false, cancellationToken);

            return result.Result;
        }

        public async Task<byte[]> ExportXml(ChQueryDto query, CancellationToken cancellationToken)
        {
            await clickHouseQueryService.ValidateQuery(query, cancellationToken);

            query.Pagination = new ChPaginationDto
            {
                Limit = 500000,
                Offset = 0
            };

            var result = await clickHouseQueryService.GetQuery(query, false,cancellationToken);

            dynamicXmlSerialize.Result = result.Result;

            XmlSerializer xsSubmit = new XmlSerializer(typeof(DynamicXmlSerialize));

            using var sww = new StringWriter();
            using var writers = XmlWriter.Create(sww);
            xsSubmit.Serialize(writers, dynamicXmlSerialize);

            return Encoding.UTF8.GetBytes(sww.ToString());
        }
    }
}
