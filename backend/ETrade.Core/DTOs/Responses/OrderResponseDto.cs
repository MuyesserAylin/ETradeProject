using ETrade.Core.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ETrade.Core.DTOs.Responses
{
    public class OrderResponseDto
    {
        public int Id { get; set; }
        public DateTime OrderDate {  get; set; }
        public OrderStatus Status { get; set; }
        public decimal TotalAmount { get; set; }
        public string ShippingAddress { get; set; } =null!;
        public string CustomerPhone { get; set; } = null!;
        public List<OrderItemResponseDto> OrderItems { get; set; } = new List<OrderItemResponseDto>();

    }
}
