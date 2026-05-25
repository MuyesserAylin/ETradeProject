using ETrade.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ETrade.Core.Repositores.Abstract
{
    public interface IOrderRepository
    {
        public Task<List<OrderItem>> AddOrderItemsAsync(List<OrderItem> orderItems);
        public Task<Order?> AddOrderAsync(Order order);
        public Task UpdateOrderAsync(Order order);
        public Task <OrderItem?> AddOrderItemAsync(OrderItem orderItem);
        public Task<List<Order>> GetAllOrdersAsync();
        public Task<List<Order>> GetOrdersByUserIdAsync(int userId);
        public Task<Order?> GetOrderWithDetails(int id);

     }
}
