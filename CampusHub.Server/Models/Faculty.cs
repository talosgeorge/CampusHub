namespace CampusHub.Server.Models
{
    public class Faculty
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;

        public ICollection<UserAccount> Users { get; set; } = new List<UserAccount>();
        public ICollection<Subject> Subjects { get; set; } = new List<Subject>();
    }

}
