using System;

namespace webapi.Models
{
    public class Booking
    {
        public int Id { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public User Booker { get; set; }
        public int BookerId { get; set; }
        public User Bookee { get; set; }
        public int BookeeId { get; set; }
    }
}
