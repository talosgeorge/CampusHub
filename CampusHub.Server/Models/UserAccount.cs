namespace AngularApp1.Server.Models
{
    public class UserAccount : IdentityUser
    {
        public int id { get; set; }
        public string email { get; set; }
        public string username { get; set; }
        public string parola { get; set; }
    }
}
