using AutoMapper;
using ETrade.Core.DTOs.Requests;
using ETrade.Core.DTOs.Responses;
using ETrade.Core.Entities;
using ETrade.Core.Exceptions;
using ETrade.Core.Repositores.Abstract;
using ETrade.Core.Services.Abstract;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ETrade.Core.Services.Concrete
{
    public class CartService : BaseService, ICartService
    {
        private readonly IProductRepository _productRepository;
        private readonly ICartRepository _cartRepository;
        private readonly IMapper _mapper;
        public CartService(IHttpContextAccessor httpContextAccessor,IProductRepository productRepository
            ,ICartRepository cartRepository
            ,IMapper mapper)
            : base(httpContextAccessor)
        {
            _productRepository = productRepository;
            _cartRepository = cartRepository;
            _mapper = mapper;
        }

        public async Task<CartItemResponseDto> AddToCartAsync(AddToCartDto request)
        {
            var product = await _productRepository.GetProductByIdWithoutCategoryAsync(request.ProductId);
            if (product == null) { throw new NotFoundException("Sepetinize eklemek istediğiniz ürün mevcut değildir."); }
            if (product.Stock <= 0) { throw new BadRequestException("Bu ürün stokta bulunmamaktadır."); }

            var userId=GetUserId();
            var cartItem=await _cartRepository.GetCartItemByUserAndProductAsync(userId,product.Id);
            if (cartItem != null)
            {
                if ((cartItem.Quantity + request.Quantity) <= product.Stock)
                {
                    cartItem.Quantity += request.Quantity;
                    cartItem = await _cartRepository.UpdateCartItemAsync(cartItem);
                }
                else
                {
                    throw new BadRequestException("Talep ettiğiniz miktarda ürün stok bulunmamaktadır." +
                        "Lütfen ürün miktarınızı güncelleyiniz.");
                }

            }
            else
            {
                if (request.Quantity <= product.Stock)
                {

                    cartItem = _mapper.Map<CartItem>(request);
                    cartItem.UserId = userId;
                    cartItem = await _cartRepository.AddCartItemAsync(cartItem);
                }
                else
                {
                    throw new BadRequestException("İstediğiniz miktarda ürün stokta yoktur." +
                       "Lütfen ürün miktarını güncelleyiniz.");
                }
                
            }

            var response = _mapper.Map<CartItemResponseDto>(cartItem);
            response.ProductName = product.Name;
            response.UnitPrice = product.Price;
            response.LinePrice = response.UnitPrice * response.Quantity;
            return response;


        }

        public async Task<CartResponseDto> GetCartAsync()
        {
            var cartItems=await _cartRepository.GetAllCartItemAsync(GetUserId());
            var response=new CartResponseDto();
            response.CartItems = _mapper.Map<List<CartItemResponseDto>>(cartItems);
            response.TotalPrice=response.CartItems.Sum(x=>x.LinePrice);
            return response;

        }

        public async Task<CartItemResponseDto> UpdateCartItemQuantityAsync(int id,UpdateCartItemDto request)
        {
           var cartItem=await _cartRepository.GetCartItemByIdAsync(id);
            if(cartItem == null) { throw new NotFoundException("Ürün mevcut değildir."); }
            if (cartItem.UserId != GetUserId()) { throw new UnauthorizedException("Bu işlem için yetkiniz yoktur."); }
            if (request.Quantity > cartItem.Product.Stock) { throw new BadRequestException("Talep ettiğiniz miktarda ürün stokta bulunmamaktadır."); }
            cartItem.Quantity = request.Quantity;
            cartItem=await _cartRepository.UpdateCartItemAsync(cartItem);
            var response=_mapper.Map<CartItemResponseDto>(cartItem);
            return response;
        }
    }
}
