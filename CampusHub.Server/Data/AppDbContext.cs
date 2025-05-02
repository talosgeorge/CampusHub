using AngularApp1.Server.Models;
using CampusHub.Server.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace AngularApp1.Server.Data
{
    public class AppDbContext : IdentityDbContext<UserAccount>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        // Custom tables
        public DbSet<UserDetails> userDetailSet { get; set; }
        public DbSet<Document> Documente { get; set; }
        public DbSet<TipDocument> TipuriDocumente { get; set; }

    }
}
