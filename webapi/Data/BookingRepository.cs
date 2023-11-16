using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using webapi.Models;

namespace webapi.Data
{
    public class BookingRepository : IBookingRepository
    {
        private readonly DataContext _context;
        public BookingRepository(DataContext context)
        {
            _context = context;
        }

        public void Add<T>(T Entity) where T : class
        {
            _context.Add(Entity);
        }

        public void Delete<T>(T Entity) where T : class
        {
            _context.Remove(Entity);
        }

        public async Task<Booking> GetBookingByDateRange(int bookeeId,DateTime start, DateTime end)
        {
            return await _context.Bookings.Where(b => b.BookeeId == bookeeId).FirstOrDefaultAsync(b => b.StartTime == start && b.EndTime == end);
        }

        public async Task<Booking> GetBookingById(int bookingId)
        {
            return await _context.Bookings.FirstOrDefaultAsync(b => b.Id == bookingId);
        }

        public async Task<IEnumerable<Booking>> GetBookingsByBookeeId(int bookeeId)
        {
            return await _context.Bookings
            .Where(b => b.BookeeId == bookeeId)
            .Include(b => b.Booker).ThenInclude(b => b.Photos).ToListAsync();
        }

        public async Task<IEnumerable<Booking>> GetBookingsByBookerId(int bookerId)
        {
            return await _context.Bookings
            .Where(b => b.BookerId == bookerId)
            .Include(b => b.Bookee).ThenInclude(b => b.Photos)
            .Include(b => b.Bookee).ThenInclude(b => b.Speciality)
            .ToListAsync();
        }

        public async Task<User> GetUser(int id)
        {
            return await _context.Users.Include(u => u.Photos).Include(u => u.Speciality).FirstOrDefaultAsync(u => u.Id == id);
        }
        public async Task<Photo> GetPhoto(int id)
        {
            return await _context.Photos.FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<IEnumerable<User>> GetUsers(bool isBookee)
        {
            return await _context.Users.Where(u => u.IsBookee == isBookee).Include(p => p.Photos).Include(p => p.Speciality).ToListAsync();
        }
        public async Task<IEnumerable<Speciality>> GetSpecialities()
        {
            return await _context.Specialities.ToListAsync();
        }

        public async Task<bool> SaveAll()
        {
            return await _context.SaveChangesAsync() > 0;
        }
    }
}