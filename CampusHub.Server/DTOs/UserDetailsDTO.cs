using System.ComponentModel.DataAnnotations;

namespace CampusHub.Server.DTOs
{
    public class UserDetailsDto
    {
        [Required]
        public int Id { get; set; }
        [Required]
        [StringLength(13, MinimumLength = 13)]
        public string Cnp { get; set; }

        [Required]
        public string NrMatricol { get; set; }

        [Required]
        public string Facultate { get; set; }

        [Required]
        [DataType(DataType.Date)]
        [DisplayFormat(DataFormatString = "{0:yyyy-MM-dd}",ApplyFormatInEditMode =true)]
        public DateTime DataNasterii { get; set; }

        [Required]
        public string Nume { get; set; }

        [Required]
        public string Prenume { get; set; }

        public string PrenumeTata { get; set; }
        public string PrenumeMama { get; set; }

        [Required]
        public string Sex { get; set; }

        [Required]
        public string JudetulNasterii { get; set; }

        [Required]
        public string LocalitateaNasterii { get; set; }

        [Required]
        public string Nationalitate { get; set; }

        [Required]
        public string SeriaBuletin { get; set; }

        [Required]
        public string NumarBuletin { get; set; }

        [Required]
        public string Adresa { get; set; }
    }
}