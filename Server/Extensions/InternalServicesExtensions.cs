using AspNet.Security.OpenIdConnect.Primitives;
using AutoMapper;
using Ch.Services;
using Ch.Services.Query;
using Dw.ClickHouse.Services;
using Dw.Models;
using Dw.Repositories.Templates;
using Dw.Services.Auth;
using Dw.Services.Templates;
using Dw.Services.Templates.Profiles;
using Infrastructure.AppSettings;
using Infrastructure.DomainValidation;
using Infrastructure.FileManagementPackages.Xml;
using Infrastructure.OfficePackages.Csv;
using Infrastructure.OfficePackages.Excel.Services;
using Infrastructure.UserContext;
using Infrastructure.UserContext.Permissions;
using Integrations.SsoIntegration;
using Logs;
using Logs.Services;
using Logs.Services.Search;
using Microsoft.EntityFrameworkCore;
using Middlewares;
using OpenIddict.Validation.AspNetCore;

namespace Server.Extensions
{
    public static class InternalServicesExtensions
    {
        public static void ConfigureDbContextService(this IServiceCollection services)
        {
            services
                .AddDbContext<DwDbContext>(o =>
                {
                    o.UseNpgsql(AppSettingsProvider.MainDbConnectionString,
                        e => e.UseQuerySplittingBehavior(QuerySplittingBehavior.SplitQuery));
                })
                .AddDbContext<LogDbContext>(o =>
                {
                    o.UseNpgsql(AppSettingsProvider.LogDbConnectionString,
                        e => e.UseQuerySplittingBehavior(QuerySplittingBehavior.SplitQuery));
                });
        }

        public static void ConfigureRepositories(this IServiceCollection services)
        {
            services
                .AddScoped<ITemplateGroupRepository, TemplateGroupRepository>()
                .AddScoped<ITemplateQueryRepository, TemplateQueryRepository>();
        }

        public static void ConfigureServices(this IServiceCollection services)
        {
            services.AddHttpClient();
            services.AddHttpContextAccessor();

            #region Ch.Services
            services
                .AddScoped<ClickHouseSchemaService>()
                .AddScoped<ClickHouseQueryService>()
                .AddScoped<ClickHouseExportService>()
                .AddScoped<ClickHouseSelectService>()
                .AddScoped<ClickHouseWhereService>()
                .AddScoped<ClickHouseOrderByService>()
                .AddScoped<ClickHouseGroupByService>();
            #endregion

            #region Dw.Services
            services
                .AddScoped<AuthService>()
                .AddScoped<TemplateGroupService>()
                .AddScoped<TemplateQueryService>();
            #endregion

            #region Infrastructure
            services
                .AddScoped<DomainValidatorService>()
                .AddScoped<PermissionService>()
                .AddScoped<ExcelProcessorService>()
                .AddScoped<CsvProcessorService>()
                .AddScoped<EnumUtilityService>()
                .AddScoped<DynamicXmlSerialize>();
            #endregion

            #region Integrations
            services.AddScoped<SsoIntegrationService>();
            #endregion

            #region Logs
            services
                .AddScoped<ActionLogService>()
                .AddScoped<ErrorLogService>()
                .AddScoped<ActionLogSearchService>()
                .AddScoped<ErrorLogSearchService>();
            #endregion

            #region UserContext
            services.AddScoped(typeof(UserContext), (provider) =>
            {
                var httpContext = provider.GetRequiredService<IHttpContextAccessor>().HttpContext;
                var ssoIntegrationService = provider.GetRequiredService<SsoIntegrationService>();

                if (httpContext != null)
                {
                    string clientId = httpContext.User.FindFirst(OpenIdConnectConstants.Claims.ClientId)?.Value;
                    int? userId = int.TryParse(httpContext.User.FindFirst(OpenIdConnectConstants.Claims.Subject)?.Value, out int currentUserId) ? currentUserId : null;

                    if (!string.IsNullOrWhiteSpace(clientId) && userId.HasValue)
                    {
                        var userContext = ssoIntegrationService.GetUserContext(httpContext).Result;

                        return userContext;
                    }
                    else
                    {
                        return new UserContext();
                    }
                }
                else
                {
                    return new UserContext();
                }
            });
            #endregion
        }

        public static void ConfigureAutoMapper(this IServiceCollection services)
        {
            services.AddScoped(provider => new MapperConfiguration(cfg =>
            {
                cfg.AddProfile(new TemplateProfile());
            }).CreateMapper());
        }

        public static void ConfigureOpenIddict(this IServiceCollection services)
        {
            services.AddOpenIddict()
               .AddValidation(options =>
               {
                   options.SetIssuer(AppSettingsProvider.SsoConfiguration.SsoUri);

                   options.UseIntrospection()
                          .SetClientId(AppSettingsProvider.SsoConfiguration.ClientId)
                          .SetClientSecret(AppSettingsProvider.SsoConfiguration.ClientSecret);

                   options.UseSystemNetHttp();
                   options.UseAspNetCore();
               });

            services.AddAuthorization();
            services.AddAuthentication(OpenIddictValidationAspNetCoreDefaults.AuthenticationScheme);
        }

        public static void ConfigureMiddlewares(this WebApplication app)
        {
            app.UseMiddleware<RedirectionMiddleware>();
            app.UseMiddleware<ErrorHandlingMiddleware>();
        }

        public static void ConfigureStaticFiles(this WebApplication app)
        {
            app.UseDefaultFiles();
            app.UseStaticFiles(new StaticFileOptions
            {
                OnPrepareResponse = context =>
                {
                    if (context.File.Name == "index.html")
                    {
                        context.Context.Response.Headers.Append("Cache-Control", "no-cache, no-store");
                        context.Context.Response.Headers.Append("Expires", "-1");
                    }
                }
            });
        }
    }
}
