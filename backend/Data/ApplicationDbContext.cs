using DocScanner.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace DocScanner.Data
{
    public class ApplicationDbContext : IdentityDbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.Entity<RomanianId>()
                .HasOne<IdentityUser>(r => r.User)
                .WithMany()
                .HasForeignKey(r => r.UserId);

            builder.Entity<UserSetting>()
                .HasOne<IdentityUser>(s => s.User)
                .WithOne()
                .HasForeignKey<UserSetting>(s => s.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<UserSetting>()
                .Property(u => u.Theme)
                .HasConversion<string>();
        }

        public DbSet<RomanianId> RomanianIds { get; set; }
        public DbSet<MenuItem> MenuItems { get; set; }
        public DbSet<UserSetting> UserSettings { get; set; }
    }
}
