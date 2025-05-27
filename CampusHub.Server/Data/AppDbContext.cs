
using CampusHub.Server.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System.Reflection.Emit;

namespace CampusHub.Server.Data
{
    public class AppDbContext : IdentityDbContext<UserAccount>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<Grade>()
                .HasOne(g => g.UserAccount)
                .WithMany(u => u.Grades)
                .HasForeignKey(g => g.UserAccountId)
                .OnDelete(DeleteBehavior.Cascade); // Optional
           builder.Entity<Subject>()
                .HasOne(s => s.Faculty)
                .WithMany(f => f.Subjects)
                .HasForeignKey(s => s.FacultyId)
                .OnDelete(DeleteBehavior.Cascade);
        }



        // Custom tables
        public DbSet<UserAccount> UserAccounts { get; set; }
        public DbSet<UserDetails> UserDetailsSet { get; set; }
        public DbSet<Subject> Subjects { get; set; }
        public DbSet<Grade> Grades { get; set; }
        public DbSet<Document> Documente { get; set; }
        public DbSet<TipDocument> TipuriDocumente { get; set; }
        public DbSet<AcademicYear> AcademicYears { get; set; }
        public DbSet<Semester> Semesters { get; set; }
        public DbSet<Faculty> Faculties { get; set; }

    }
}
