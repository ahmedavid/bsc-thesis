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
    public class ScheduleEvent {
        public int Id { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public string Subject { get; set; }
        public bool IsAllDay { get; set; }
    }

    [Route("api/[controller]")]
    [ApiController]
    public class DemoController : ControllerBase
    {

        [HttpGet]
        public async Task<IActionResult> GetUsers([FromQuery] bool isBookee)
        {
            var events = new List<ScheduleEvent>(){
                new ScheduleEvent
                {
                    Id = 1,
                    StartTime = DateTime.Now,
                    EndTime = DateTime.Now.AddHours(1),
                    Subject = "Test",
                    IsAllDay = false
                },
                new ScheduleEvent
                {
                    Id = 2,
                    StartTime = DateTime.Now.AddHours(3),
                    EndTime = DateTime.Now.AddHours(5),
                    Subject = "Test 2",
                    IsAllDay = false
                },
            };
            return Ok(events);
        }
    }
}