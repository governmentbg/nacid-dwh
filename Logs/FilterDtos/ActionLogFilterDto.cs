using Common.Models.FilterDtos;
using Logs.Entities;
using Logs.Enums;


namespace Logs.FilterDtos
{
    public class ActionLogFilterDto : FilterDto<ActionLog>
    {
        public string Ip { get; set; }
        public string Url { get; set; }
        public Verb? Verb { get; set; }
        public DateTime? LogDate { get; set; }

        public override IQueryable<ActionLog> WhereBuilder(IQueryable<ActionLog> query)
        {
            if (!string.IsNullOrWhiteSpace(Ip))
            {
                query = query.Where(e => e.Ip == Ip);
            }

            if (!string.IsNullOrWhiteSpace(Url))
            {
                query = query.Where(e => e.Url.ToLower().Trim().Contains(Url.ToLower().Trim()));
            }

            if (Verb.HasValue)
            {
                query = query.Where(e => e.Verb == Verb.ToString());
            }

            if (LogDate.HasValue)
            {
                query = query.Where(e => e.LogDate.Date == LogDate.Value.Date);
            }


            return query;
        }
    }
}
