using System.ComponentModel.DataAnnotations;

namespace CampusHub.Server.Models
{
    public class Subject
    {
        [Key]
        public int SubjectId { get; set; }
        public string SubjectName { get; set; }
        public int Credits { get; set; }
    }
}