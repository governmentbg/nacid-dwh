namespace Infrastructure.OfficePackages.Excel.Models
{
    public class ExcelSheetDto
    {
        public string SheetName { get; set; }
        public List<string> Titles { get; set; } = new List<string>();
        public List<object> Items { get; set; } = new List<object>();
    }
}
