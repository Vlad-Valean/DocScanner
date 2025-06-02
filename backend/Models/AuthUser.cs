namespace DocScanner.Models
{
    public class AuthUser
    {
        public AuthUser(string username, string password)
        {
            Username = username;
            Password = password;
        }

        public string Username { get; set; }
        public string Password { get; set; }
    }
}
