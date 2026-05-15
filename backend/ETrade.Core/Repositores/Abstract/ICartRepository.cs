using ETrade.Core.DTOs.Requests;
using ETrade.Core.DTOs.Responses;
using ETrade.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ETrade.Core.Repositores.Abstract
{
    public interface ICartRepository
    {
        public Task<CartItem?> GetCartItemByUserAndProductAsync(int userId, int productId);
        public Task<CartItem> AddCartItemAsync(CartItem cartItem);
        public Task<CartItem> UpdateCartItemAsync(CartItem cartItem);
        public Task<List<CartItem>> GetAllCartItemAsync(int userId);
        public Task<CartItem?> GetCartItemByIdAsync(int id);
        public Task<CartItem?> GetCartItemByIdWithoutProductAsync(int id);
        public Task DeleteCartItemAsync(CartItem cartItem);
        public Task DeleteAllCartItemsByUserIdAsync(int userId);
        public Task DeleteCartItemByProductIdAsync(int productId);

    }
}
