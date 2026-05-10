using AutoMapper;
using ETrade.Core.DTOs.Requests;
using ETrade.Core.DTOs.Responses;
using ETrade.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ETrade.Core.Mapping
{
    public class MappingProfile:Profile
    {
        public MappingProfile() {

            CreateMap<ProductCreateDto, Product>();

            CreateMap<Product, ProductResponseDto>()
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category.Name));

  
            CreateMap<Product, ProductDetailResponseDto>()
                  .IncludeBase<Product, ProductResponseDto>();
        }
    }
}
