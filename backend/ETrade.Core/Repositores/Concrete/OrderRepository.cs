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
    public class OrderRepository : IOrderRepository
    {
        private readonly AppDbContext _context;
        public OrderRepository(AppDbContext context) { _context = context; }

        public async Task<Order?> AddOrderAsync(Order order)
        {
            await _context.Orders.AddAsync(order);
            await _context.SaveChangesAsync();
            return order;
        }

        public async Task<OrderItem?> AddOrderItemAsync(OrderItem orderItem)
        {
            await _context.AddAsync(orderItem);
            await _context.SaveChangesAsync();
            return orderItem;
        }

        public async  Task<List<OrderItem>> AddOrderItemsAsync(List<OrderItem> orderItems)
        {
            await _context.OrderItems.AddRangeAsync(orderItems);
            await _context.SaveChangesAsync();
            return orderItems;
        }

        public async Task<List<Order>> GetAllOrdersAsync()
        {
           return  await _context.Orders.ToListAsync();
        }

        public async Task<List<Order>> GetOrdersByUserIdAsync(int userId)
        {
            return await _context.Orders
                .Where(o=>o.UserId==userId)
                .ToListAsync();
        }

        public async Task<Order?> GetOrderWithDetails(int id)
        {
            return await _context.Orders
                .Include(o => o.User)
                .Include(o => o.OrderItems)
                 .ThenInclude(oi => oi.Product)
                .FirstOrDefaultAsync(o => o.Id == id);
        }

        public async Task UpdateOrderAsync(Order order)
        {
            _context.Orders.Update(order);
            await _context.SaveChangesAsync();
        }
    }
}
