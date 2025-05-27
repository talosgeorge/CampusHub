using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace CampusHub.Server.Models
{
    public class Subject
    {
        [Key]
        public int SubjectId { get; set; }
        public string SubjectName { get; set; }
        public int Credits { get; set; }
        public int FacultyId { get; set; }
        [ForeignKey("FacultyId")]

        [JsonIgnore]
        public Faculty? Faculty { get; set; }

    }
}