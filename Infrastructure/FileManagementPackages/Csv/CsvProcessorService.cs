using CsvHelper;
using System.Globalization;

namespace Infrastructure.OfficePackages.Csv
{
    public class CsvProcessorService
    {
        public MemoryStream ExportCsv(List<dynamic> result)
        {
            using var memoryStream = new MemoryStream();
            using var streamWriter = new StreamWriter(memoryStream);
            using var csvWriter = new CsvWriter(streamWriter, CultureInfo.InvariantCulture);
            csvWriter.WriteRecords(result);

            return memoryStream;
        }
    }
}
