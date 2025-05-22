using System.ComponentModel.DataAnnotations;

namespace CampusHub.Server.Models
{
    public class UserDetails
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public virtual UserAccount User { get; set; }
        [Required]
        [StringLength(13, MinimumLength = 13)]
        public string cnp { get; set; }
        public string nrMatricol { get; set; }
        public string facultate { get; set; }
        public DateTime dataNasterii { get; set; }
        public string nume { get; set; }
        public string prenume { get; set; }
        public string prenumeTata { get; set; }
        public string prenumeMama { get; set; }
        public string sex { get; set; }
        public string judetulNasterii { get; set; }
        public string localitateaNasterii { get; set; }
        public string nationalitate { get; set; }
        public string seriaBuletin { get; set; }
        public string numarBuletin { get; set; }
        public string adresa { get; set; }
        public string? Handicap { get; set; }
    }
}
