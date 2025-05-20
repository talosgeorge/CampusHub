namespace CampusHub.Server.Models
{
    public class Semester
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty; // ex: "Semester 1"

        public int AcademicYearId { get; set; }
        public AcademicYear AcademicYear { get; set; }

        public ICollection<Grade> Grades { get; set; } = new List<Grade>();
    }

}
