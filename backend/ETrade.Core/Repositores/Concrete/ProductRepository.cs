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
    public class ProductRepository : IProductRepository
    {
        private readonly AppDbContext _context;
       public ProductRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Product> AddProductAsync(Product product)
        {
            await _context.Products.AddAsync(product);
            await _context.SaveChangesAsync();
            return product;
        }

        public async Task<bool> IsExistProductName(string Productname)
        {
            return await _context.Products.AnyAsync(p=>p.Name == Productname);
        }
    }
}
