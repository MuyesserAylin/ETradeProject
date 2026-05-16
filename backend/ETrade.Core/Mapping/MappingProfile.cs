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


            CreateMap<ProductUpdateDto, Product>();

            CreateMap<AddToCartDto, CartItem>();


            CreateMap<CartItem, CartItemResponseDto>()
                .ForMember(dest => dest.ProductName, opt => opt.MapFrom(src => src.Product!=null ? src.Product.Name:string.Empty))
                .ForMember(dest => dest.UnitPrice, opt => opt.MapFrom(src => src.Product!=null ? src.Product.Price :0))
                 .ForMember(dest=>dest.LinePrice,opt=>opt.MapFrom(src=>src.Product!=null ? src.Product.Price*src.Quantity :0));

            CreateMap<CartItem, OrderItem>()
                .ForMember(dest => dest.UnitPrice, opt => opt.MapFrom(src => src.Product.Price));

            CreateMap<CartItem, OrderItemResponseDto>()
                .ForMember(dest => dest.ProductName, opt => opt.MapFrom(src => src.Product.Name))
                .ForMember(dest => dest.UnitPrice, opt => opt.MapFrom(src => src.Product.Price))
                .ForMember(dest => dest.SubTotal, opt => opt.MapFrom(src => src.Product.Price * src.Quantity));

            CreateMap<Order, OrderResponseDto>()
                .ForMember(dest => dest.OrderItems, opt => opt.Ignore());


        }
    }
}
