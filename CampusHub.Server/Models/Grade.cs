using System.ComponentModel.DataAnnotations.Schema;

namespace CampusHub.Server.Models;

    public class Grade
    {
        public int GradeId { get; set; }
        public int Value { get; set; }
        public DateTime Date { get; set; }
        public int SubjectId { get; set; } 
        [ForeignKey("SubjectId")]
        public Subject Subject { get; set; } // Navigation property

        public string UserAccountId { get; set; }

        [ForeignKey("UserAccountId")]
        public UserAccount UserAccount { get; set; } // Navigation property
    public int SemesterId { get; set; }
    [ForeignKey("SemesterId")]
    public Semester Semester { get; set; }



}

