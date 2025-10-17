using Infrastructure.AppSettings.SsoConfiguration;
using Microsoft.Extensions.Configuration;

namespace Infrastructure.AppSettings
{
    public static class AppSettingsProvider
    {
        public static string MainDbConnectionString { get; private set; }
        public static string LogDbConnectionString { get; private set; }
        public static string ClickHouseDbConnectionString { get; private set; }
        public static SsoConfigurationSettings SsoConfiguration { get; private set; }

        public static void AddAppSettings(IConfiguration configuration)
        {
            if (configuration.GetSection("mainDbConnectionString").Exists())
            {
                MainDbConnectionString = configuration.GetSection("mainDbConnectionString").Get<string>();
            }

            if (configuration.GetSection("logDbConnectionString").Exists())
            {
                LogDbConnectionString = configuration.GetSection("logDbConnectionString").Get<string>();
            }

            if (configuration.GetSection("clickHouseDbConnectionString").Exists())
            {
                ClickHouseDbConnectionString = configuration.GetSection("clickHouseDbConnectionString").Get<string>();
            }

            if (configuration.GetSection("ssoConfiguration").Exists())
            {
                SsoConfiguration = configuration.GetSection("ssoConfiguration").Get<SsoConfigurationSettings>();
            }
        }
    }
}
