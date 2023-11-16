using AutoMapper;
using System.Linq;
using webapi.Dtos;

namespace webapi.Models
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Booking,BookingForCreateDto>().ReverseMap();
            CreateMap<Photo,PhotoForReturnDto>();
            CreateMap<PhotoForCreationDto,Photo>();

            CreateMap<Booking,BookeeBookingForReturnDto>();
            CreateMap<Booking,BookerBookingForReturnDto>();
            CreateMap<User,UserResource>()
                .ForMember(ur => ur.PhotoUrl,opt=>opt.MapFrom(u => u.Photos.FirstOrDefault().Url))
                .ForMember(ur => ur.Speciality,opt=>opt.MapFrom(u => u.Speciality.Name));
        }
    }
}