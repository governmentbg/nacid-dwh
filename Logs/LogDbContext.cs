using Logs.Entities;
using Microsoft.EntityFrameworkCore;
using System.Reflection;

namespace Logs
{
    public class LogDbContext : DbContext
    {
        public DbSet<ErrorLog> ErrorLogs { get; set; }
        public DbSet<ActionLog> ActionLogs { get; set; }

        public LogDbContext(DbContextOptions<LogDbContext> options)
            : base(options)
        {
            AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            ApplyConfigurations(modelBuilder);
            DisableCascadeDelete(modelBuilder);
            ConfigurePgSqlNameMappings(modelBuilder);
        }

        private static void ApplyConfigurations(ModelBuilder modelBuilder)
        {
            var typesToRegister = Assembly.GetExecutingAssembly().GetTypes()
                   .Where(t => t.GetInterfaces().Any(gi =>
                       gi.IsGenericType
                       && gi.GetGenericTypeDefinition() == typeof(IEntityTypeConfiguration<>)))
                   .ToList();

            foreach (var type in typesToRegister)
            {
                dynamic configurationInstance = Activator.CreateInstance(type);
                modelBuilder.ApplyConfiguration(configurationInstance);
            }
        }

        private static void DisableCascadeDelete(ModelBuilder modelBuilder)
        {
            modelBuilder.Model.GetEntityTypes()
                .SelectMany(t => t.GetForeignKeys())
                .Where(fk => !fk.IsOwnership
                    && fk.DeleteBehavior == DeleteBehavior.Cascade)
            .ToList()
                .ForEach(e => e.DeleteBehavior = DeleteBehavior.Restrict);
        }

        private static void ConfigurePgSqlNameMappings(ModelBuilder modelBuilder)
        {
            foreach (var entity in modelBuilder.Model.GetEntityTypes())
            {
                // Configure pgsql table names convention.
                entity.SetTableName(entity.ClrType.Name.ToLower());

                // Configure pgsql column names convention.
                foreach (var property in entity.GetProperties())
                    property.SetColumnName(property.Name.ToLower());
            }
        }
    }
}
