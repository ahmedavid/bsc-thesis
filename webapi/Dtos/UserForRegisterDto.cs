using System.ComponentModel.DataAnnotations;

namespace webapi.Dtos
{
    public class UserForRegisterDto
    {
        [Required]
        [MinLength(3)]
        public string Username { get; set; }

        [Required]
        [MinLength(3)]
        public string Fullname { get; set; }

        [Required]
        public int SpecialityId { get; set; }

        [Required]
        public bool IsBookee { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [MinLength(5)]
        public string Password { get; set; }
    }
}