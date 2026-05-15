using ETrade.Core.DTOs.Requests;
using ETrade.Core.DTOs.Responses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ETrade.Core.Services.Abstract
{
    public interface ICartService
    {
        public Task<CartItemResponseDto> AddToCartAsync(AddToCartDto request);
        public Task<CartResponseDto> GetCartAsync();
        public Task<CartItemResponseDto> UpdateCartItemQuantityAsync(int id,UpdateCartItemDto request);
        public Task DeleteCartItemAsync(int id);
        public Task ClearCartAsync();
    }
}
