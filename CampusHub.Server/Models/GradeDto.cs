namespace CampusHub.Server.Models
{
    public class GradeDto
    {
        public int GradeId { get; set; }
        public int Value { get; set; }
        public DateTime Date { get; set; }
        public int SemesterId { get; set; }
        public string SubjectName { get; set; } = string.Empty;
        public int Credits { get; set; }
    }


}
