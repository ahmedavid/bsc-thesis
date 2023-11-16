namespace webapi.Dtos {
    public class UserResource {

        public int Id { get; set; }
        public bool IsBookee { get; set; }
        public string Speciality { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string Fullname { get; set; }
        public string Description { get; set; }
        public string PhotoUrl { get; set; }
    }
}