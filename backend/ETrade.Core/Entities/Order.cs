using ETrade.Core.Enums;

namespace ETrade.Core.Entities;

public class Order
{
    public int Id { get; set; }
    public DateTime OrderDate { get; set; } = DateTime.UtcNow;
    public OrderStatus Status { get; set; } = OrderStatus.Pending;
    public decimal TotalAmount { get; set; } = 0;
    public string ShippingAddress { get; set; } = null!;
    public string CustomerPhone { get; set; } = null!;  
    public int UserId { get; set; }
    public User User { get; set; } = null!;
    public List<OrderItem> OrderItems { get; set; } = new();
}
