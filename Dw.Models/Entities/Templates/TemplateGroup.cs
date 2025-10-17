using Dw.Models.Entities.Attributes;
using Dw.Models.Entities.Base;
using Dw.Models.Enums.Templates;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Dw.Models.Entities.Templates
{
    public class TemplateGroup : EntityVersion
    {
        public string Name { get; set; }
        public string NameAlt { get; set; }

        public string Description { get; set; }
        public string DescriptionAlt { get; set; }

        public TemplateAccessLevel AccessLevel { get; set; } = TemplateAccessLevel.Public;

        public int? AccessUserId { get; set; }

        [SkipUpdate]
        public List<TemplateQuery> TemplateQueries { get; set; } = new List<TemplateQuery>();
    }

    public class TemplateGroupConfiguration : IEntityTypeConfiguration<TemplateGroup>
    {
        public void Configure(EntityTypeBuilder<TemplateGroup> builder)
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

            builder.HasMany(e => e.TemplateQueries)
                .WithOne()
                .HasForeignKey(e => e.TemplateGroupId);
        }
    }
}
