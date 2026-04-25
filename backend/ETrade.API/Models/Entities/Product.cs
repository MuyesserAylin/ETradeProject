namespace ETrade.API.Models.Entities
{
    public class Product
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int Stock { get; set; }
        public string Description { get; set; } = string.Empty;

        public bool IsDeleted { get; set; } = false;

        public int CategoryId { get; set; }
        public Category Category { get; set; } = null!;
        public List<CartItem> CartItems { get; set; } = new();
       




    }
}
