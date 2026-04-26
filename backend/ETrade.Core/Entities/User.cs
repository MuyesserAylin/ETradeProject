namespace  ETrade.Core.Entities;

public class User
{
    public int Id { get; set; }
    public string FullName { get; set; }=string.Empty;
    public string Email { get; set; }=string.Empty;
    public string PasswordHash { get; set; }=string.Empty;
    public string Role { get; set; } = "Customer";
    public List<CartItem> CartItems { get; set; } = new();
    public List<Order> Orders { get; set; } = new();

}
