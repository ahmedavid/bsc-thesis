using System.ComponentModel.DataAnnotations;

namespace webapi.Dtos
{
    public class UserForLoginDto
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }
}