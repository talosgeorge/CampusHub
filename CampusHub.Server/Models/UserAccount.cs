using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations.Schema;

namespace CampusHub.Server.Models
{
    public class UserAccount : IdentityUser
    {
        // Additional properties can be added here (e.g., FirstName, LastName, etc.)  

        public ICollection<Grade> Grades { get; set; }
        //public int? UserDetailsId { get; set; }
        //[ForeignKey("UserDetailsId")]
        //public UserDetails? UserDetails { get; set; }
    }
}
