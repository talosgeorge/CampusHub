using AngularApp1.Server.Models;

namespace AngularApp1.Server.Data
{

    using Microsoft.EntityFrameworkCore;

    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }
        public DbSet<UserDetails> userDetailSet { get; set; }
        public DbSet<UserAccount> userAccountSet { get; set; }
    }
}