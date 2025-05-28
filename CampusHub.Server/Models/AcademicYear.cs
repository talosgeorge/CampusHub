using System.Text.Json.Serialization;

namespace CampusHub.Server.Models
{
    public class AcademicYear
    {
        public int Id { get; set; }
        public string YearLabel { get; set; } = string.Empty; // ex: "2023-2024"
        [JsonIgnore]
        public ICollection<Semester> Semesters { get; set; } = new List<Semester>();
    }
}
