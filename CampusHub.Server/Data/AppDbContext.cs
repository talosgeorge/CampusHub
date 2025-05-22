using CampusHub.Server.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace CampusHub.Server.Data
{
    public class AppDbContext : IdentityDbContext<UserAccount>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        // Custom tables
        public DbSet<UserDetails> UserDetails { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<UserDetails>(entity =>
            {
                entity.ToTable("UserDetails");

                // mapare coloane
                entity.Property(e => e.Id).HasColumnName("Id"); // doar dacă ai adăugat-o
                entity.Property(e => e.UserId).HasColumnName("UserID");

                // dacă UserID e PK (și nu ai Id)
                // entity.HasKey(e => e.UserId);

                // dacă Id este PK
                entity.HasKey(e => e.Id);

                // relație opțională cu UserAccount (Identity)
                entity.HasOne(e => e.User)
                      .WithOne()
                      .HasForeignKey<UserDetails>(e => e.UserId)
                      .HasPrincipalKey<UserAccount>(u => u.Id)
                      .OnDelete(DeleteBehavior.Cascade);
            });
        }
        public DbSet<Document> Documente { get; set; }
        public DbSet<TipDocument> TipuriDocumente { get; set; }
    }
}
