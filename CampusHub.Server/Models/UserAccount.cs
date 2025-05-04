using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations.Schema;

namespace CampusHub.Server.Models
{
    public class UserAccount : IdentityUser
    {
        // Poți adăuga aici extra proprietăți dacă ai nevoie (ex: Nume, Prenume etc.)
        public virtual UserDetails UserDetails { get; set; }
    }
}
