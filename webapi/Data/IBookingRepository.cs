using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using webapi.Models;

namespace webapi.Data
{
    public interface IBookingRepository
    {
         void Add<T>(T Entity) where T: class;
         void Delete<T>(T Entity) where T: class;
         Task<bool> SaveAll();
         Task<Booking> GetBookingById(int bookingId);
         Task<Booking> GetBookingByDateRange(int bookeeId,DateTime start,DateTime end);
         Task<IEnumerable<User>> GetUsers(bool isBookee);
         Task<IEnumerable<Speciality>> GetSpecialities();
         Task<User> GetUser(int id);
         Task<Photo> GetPhoto(int id);
         Task<IEnumerable<Booking>> GetBookingsByBookerId(int bookerId);
         Task<IEnumerable<Booking>> GetBookingsByBookeeId(int bookeeId);
    }
}