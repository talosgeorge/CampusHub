using System.ComponentModel.DataAnnotations;

namespace CampusHub.Server.Models
{
    public class UserDetails
    {
        [Key]
        public int Id { get; set; }
        public string cnp { get; set; }
        public string nrMatricol { get; set; }
        public string facultate { get; set; }
        public string dataNasterii { get; set; }
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
    }
}
