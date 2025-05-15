namespace CampusHub.Server.Models
{
    public class AddGradeModel
    {
        public string UserAccountId { get; set; }  // The student's UserId
        public int SubjectId { get; set; }  // The SubjectId
        public int GradeValue { get; set; }  // The grade value to assign
    }
}
