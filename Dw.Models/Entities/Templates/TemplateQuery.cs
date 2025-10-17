using Dw.Models.Entities.Attributes;
using Dw.Models.Entities.Base;
using Dw.Models.Enums.Templates;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Dw.Models.Entities.Templates
{
    public class TemplateQuery : EntityVersion
    {
        public int TemplateGroupId { get; set; }

        public string Name { get; set; }
        public string NameAlt { get; set; }

        public string Description { get; set; }
        public string DescriptionAlt { get; set; }

        public bool ShowAsSubquery { get; set; } = false;

        public string JsonQuery { get; set; }
        public string RawQuery { get; set; }

        [SkipUpdate]
        public TemplateAccessLevel AccessLevel { get; set; } = TemplateAccessLevel.Public;
        [SkipUpdate]
        public int? AccessUserId { get; set; }
    }

    public class TemplateQueryConfiguration : IEntityTypeConfiguration<TemplateQuery>
    {
        public void Configure(EntityTypeBuilder<TemplateQuery> builder)
        {
            builder.Property(e => e.Name)
                .HasMaxLength(250)
                .IsRequired();

            builder.Property(e => e.NameAlt)
                .HasMaxLength(250);

            builder.Property(e => e.Description)
                .HasMaxLength(500);

            builder.Property(e => e.DescriptionAlt)
                .HasMaxLength(500);

            builder.Property(e => e.JsonQuery)
                .IsRequired();

            builder.Property(e => e.RawQuery)
                .IsRequired();
        }
    }
}
