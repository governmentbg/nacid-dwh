namespace Logs.Entities.Base
{
    public abstract class BaseLog
    {
        public int Id { get; set; }

        public int? UserId { get; set; }
        public string Username { get; set; }

        public DateTime LogDate { get; set; }

        public string Ip { get; set; }
        public string Verb { get; set; }
        public string Url { get; set; }
        public string UserAgent { get; set; }

        public string Body { get; set; }
    }
}
