using System.Collections.Generic;
using Newtonsoft.Json;
using webapi.Models;

namespace webapi.Data
{
    public class Seed
    {
        private readonly DataContext _context;

        public Seed(DataContext context)
        {
            _context = context;
        }

        public void SeedUsers()
        {
            var photoUrls = new List<string>()
            {
                "https://res.cloudinary.com/doykscuig/image/upload/v1572325044/doctors/1.jpg",
                "https://res.cloudinary.com/doykscuig/image/upload/v1572325043/doctors/2.jpg",
                "https://res.cloudinary.com/doykscuig/image/upload/v1572325044/doctors/3.jpg",
                "https://res.cloudinary.com/doykscuig/image/upload/v1572325044/doctors/4.jpg",
                "https://res.cloudinary.com/doykscuig/image/upload/v1572325046/doctors/5.jpg",
                "https://res.cloudinary.com/doykscuig/image/upload/v1572325044/doctors/7.jpg"
            };

            var userData = System.IO.File.ReadAllText("Data/UserSeedData.json");
            var specData = System.IO.File.ReadAllText("Data/SpecialitySeedData.json");
            var users = JsonConvert.DeserializeObject<List<User>>(userData);
            var specs = JsonConvert.DeserializeObject<List<Speciality>>(specData);

            foreach (var spec in specs)
            {
                _context.Add(spec);
            }

            int i=0;
            
            foreach (var user in users)
            {
                byte[] passwordHash,passwordSalt;
                CreatePasswordHash("password",out passwordHash,out passwordSalt);
                user.PasswordHash = passwordHash;
                user.PasswordSalt = passwordSalt;
                user.Username = user.Username.ToLower();
                user.Photos.Add(new Photo{Url=photoUrls[i]});
                i++;
                _context.Users.Add(user);
            }

            _context.SaveChanges();
        }

        private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using (var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            } 
        }
    }
}