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

        public async Task DeleteAllCartItemsByUserIdAsync(int userId)
        {
            var cartItems = _context.CartItems.Where(c => c.UserId == userId);
            _context.RemoveRange(cartItems);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteCartItemAsync(CartItem cartItem)
        {
             _context.CartItems.Remove(cartItem);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteCartItemByProductIdAsync(int productId)
        {
            var cartItems=_context.CartItems.Where(c=>c.ProductId == productId);
            _context.RemoveRange(cartItems);
            await _context.SaveChangesAsync();
        }

        public async Task<List<CartItem>> GetAllCartItemAsync(int userId)
        {
            return await _context.CartItems
                 .Where(c => c.UserId == userId)
                 .Include(w => w.Product)
                 .ToListAsync();
        }

        public async Task<CartItem?> GetCartItemByIdAsync(int id)
        {
           return await _context.CartItems
                 .Include(w => w.Product)
                .FirstOrDefaultAsync(c=>c.Id == id);
        }

        public async Task<CartItem?> GetCartItemByIdWithoutProductAsync(int id)
        {
            return await _context.CartItems
                .FirstOrDefaultAsync(p=>p.Id == id);
        }

        public async Task<CartItem?> GetCartItemByUserAndProductAsync(int userId, int productId)
        {
            return await _context.CartItems
                .FirstOrDefaultAsync(c=>c.UserId == userId && c.ProductId == productId); 
        }
        public async Task<CartItem?> GetCartItemByUserAndProductWithProductAsync(int userId, int productId)
        {
            return await _context.CartItems
                .Include(w=>w.Product)
                .FirstOrDefaultAsync(c => c.UserId == userId && c.ProductId == productId);
        }

        public async Task<CartItem> UpdateCartItemAsync(CartItem cartItem)
        {
            _context.Update(cartItem);
            await _context.SaveChangesAsync();
            return cartItem;
        }
    }
}
