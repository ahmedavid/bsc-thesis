using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel.DataAnnotations;

namespace webapi.Models
{
    public class User
    {
        public int Id { get; set; }
        public bool IsBookee { get; set; }
        public int SpecialityId { get; set; }
        public virtual Speciality Speciality { get; set; }

        [Required]
        [StringLength(255)]
        public string Username { get; set; }
        [Required]
        [StringLength(255)]
        [EmailAddress]
        public string Email { get; set; }
        
        [Required]
        [StringLength(255)]        
        public string Fullname { get; set; }
        public string Description { get; set; }
        public byte[] PasswordHash { get; set; }
        public byte[] PasswordSalt { get; set; }

        public virtual ICollection<Booking> Bookees { get; set; }
        public virtual ICollection<Booking> Bookers { get; set; }
        public virtual ICollection<Photo> Photos { get; set; }

        public User()
        {
            Photos = new Collection<Photo>();
        }
    }
}