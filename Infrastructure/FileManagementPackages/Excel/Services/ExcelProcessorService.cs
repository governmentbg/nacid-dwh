using Infrastructure.OfficePackages.Excel.Models;
using OfficeOpenXml;

namespace Infrastructure.OfficePackages.Excel.Services
{
    public class ExcelProcessorService
    {
        readonly EnumUtilityService enumUtilityService;

        public ExcelProcessorService(EnumUtilityService enumUtilityService)
        {
            this.enumUtilityService = enumUtilityService;
        }

        public MemoryStream ExportMultiSheet(List<ExcelSheetDto> exportSheets)
        {
            using ExcelPackage package = new();

            foreach (var exportSheet in exportSheets)
            {
                ExcelWorksheet worksheet = package.Workbook.Worksheets.Add(exportSheet.SheetName);

                ConstructSheet(worksheet, exportSheet);
            }

            var stream = new MemoryStream(package.GetAsByteArray());
            return stream;
        }

        private void ConstructSheet(ExcelWorksheet worksheet, ExcelSheetDto exportSheet)
        {
            bool[] isFormatedMaxCols = new bool[exportSheet.Titles.Count];
            int col = 1, row = 1;

            for (int i = 0; i < exportSheet.Titles.Count; i++)
            {

                worksheet.Cells[row, col].Value = exportSheet.Titles[i];
                worksheet.Cells[row, col].Style.Font.Bold = true;

                col++;
            }

            foreach (var item in exportSheet.Items)
            {
                col = 1;
                row++;

                var fields = item as IDictionary<string, object>;

                foreach (var title in exportSheet.Titles)
                {
                    var value = fields[title];
                    var valueType = value?.GetType();

                    if (value != null) {
                        if (valueType == typeof(Enum))
                        {
                            worksheet.Cells[row, col].Value = enumUtilityService.GetDescription(value);
                        } else if (valueType == typeof(bool)
                            || valueType == typeof(bool?))
                        {
                            var obj = (bool)value;
                            string boolValue = "Не";
                            if (obj)
                            {
                                boolValue = "Да";
                            }
                            worksheet.Cells[row, col].Value = boolValue;
                        }
                        else
                        {
                            worksheet.Cells[row, col].Value = value;
                        }

                        worksheet.Cells[row, col].Style.Numberformat.Format = GetCellFormatting(valueType);

                        if (!isFormatedMaxCols[col - 1]
                            && worksheet.Cells[row, col].Value != null)
                        {
                            int cellSize = worksheet.Cells[row, col].Value.ToString().Length;
                            if (cellSize > 80)
                            {
                                worksheet.Column(col).Width = 80;
                                worksheet.Column(col).Style.WrapText = true;
                                isFormatedMaxCols[col - 1] = true;
                            }
                        }
                    }

                    col++;
                }
            }

            for (int i = 0; i <= exportSheet.Titles.Count - 1; i++)
            {
                if (!isFormatedMaxCols[i])
                {
                    worksheet.Column(i + 1).AutoFit();
                }
            }
        }

        private static string GetCellFormatting(Type fieldType)
        {
            if (fieldType == typeof(DateTime)
                || fieldType == typeof(DateTime?))
            {
                return "dd-mm-yyyy";
            }
            else if (fieldType == typeof(double)
                || fieldType == typeof(double?)
                || fieldType == typeof(decimal)
                || fieldType == typeof(decimal?))
            {
                return "0.00";
            }

            return null;
        }
    }
}
