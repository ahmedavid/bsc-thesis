using System;
using webapi.Models;

namespace webapi.Dtos {
    public class BookeeBookingForReturnDto {
        public int Id { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public int BookerId { get; set; }
        public int BookeeId { get; set; }
        public UserResource Booker { get; set; }
        
    }
}
