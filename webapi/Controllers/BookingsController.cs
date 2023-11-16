using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using webapi.Data;
using webapi.Dtos;
using webapi.Models;

namespace webapi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookingsController : ControllerBase
    {
        private readonly IBookingRepository _repo;
        private readonly IMapper _mapper;

        public BookingsController(IBookingRepository repo,IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }

        [HttpGet("users")]
        public async Task<IActionResult> GetUsers([FromQuery] bool isBookee)
        {
            var bookees = await _repo.GetUsers(isBookee);
            return Ok(bookees);
        }

        [HttpGet("specialities")]
        public async Task<IActionResult> GetSpecialities()
        {
            var specialities = await _repo.GetSpecialities();
            return Ok(specialities);
        }
        [HttpGet("users/{id}")]
        public async Task<IActionResult> GetUser(int id)
        {
            var doctor = await _repo.GetUser(id);
            return Ok(doctor);
        }

        [HttpPost]
        public async Task<IActionResult> MakeBooking(BookingForCreateDto bookingForCreateDto)
        {
            var slot = await _repo.GetBookingByDateRange(bookingForCreateDto.BookeeId,bookingForCreateDto.StartTime,bookingForCreateDto.EndTime);
            if(slot == null)
            {
                var newBooking = _mapper.Map<Booking>(bookingForCreateDto);
                _repo.Add(newBooking);
                if(await _repo.SaveAll())
                    return Ok(newBooking);
            }
            return BadRequest("Slot is occupied");
        }

        [HttpDelete("{bookingId}")]
        public async Task<IActionResult> DeleteBooking(int bookingId)
        {
            var booking = await _repo.GetBookingById(bookingId);
            if(booking == null) {
                return NotFound("No Booking Found with this id" + bookingId);
            }

            _repo.Delete<Booking>(booking);
            if(await _repo.SaveAll())
                return Ok(new {message = "Deleted booking:" + booking.Id});        
            return BadRequest("Something went wrong with deleting");    
        }


        [HttpGet("bookers/{bookerId}")]
        public async Task<IActionResult> GetBookerBookings(int bookerId)
        {
            var bookings = await _repo.GetBookingsByBookerId(bookerId);
            var mapped = _mapper.Map<IEnumerable<Booking>,IEnumerable<BookerBookingForReturnDto>>(bookings);
            return Ok(mapped);
        }

        [HttpGet("bookees/{bookeeId}")]
        public async Task<IActionResult> GetBookeeBookings(int bookeeId)
        {
            var bookings = await _repo.GetBookingsByBookeeId(bookeeId);
            var mapped = _mapper.Map<IEnumerable<Booking>,IEnumerable<BookeeBookingForReturnDto>>(bookings);
            return Ok(mapped);
        }
    }
}