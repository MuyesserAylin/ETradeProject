using ETrade.Core.Data;
using ETrade.Core.Entities;
using ETrade.Core.Repositores.Abstract;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ETrade.Core.Repositores.Concrete
{
    public class CartRepository : ICartRepository
    {
        private readonly AppDbContext _context;
        public CartRepository(AppDbContext context)
        {
            _context = context;
        }
        public async Task<CartItem> AddCartItemAsync(CartItem cartItem)
        {
            await _context.AddAsync(cartItem);
            await _context.SaveChangesAsync();
            return cartItem;
        }

        public async Task<CartItem?> GetCartItemByUserAndProductAsync(int userId, int productId)
        {
            return await _context.CartItems.FirstOrDefaultAsync(c=>c.UserId == userId && c.ProductId == productId); 
        }

        public async Task<CartItem> UpdateCartItemAsync(CartItem cartItem)
        {
            _context.Update(cartItem);
            await _context.SaveChangesAsync();
            return cartItem;
        }
    }
}
