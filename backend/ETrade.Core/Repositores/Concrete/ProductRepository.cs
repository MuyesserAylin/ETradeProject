using ETrade.Core.Data;
using ETrade.Core.DTOs.Responses;
using ETrade.Core.Entities;
using ETrade.Core.Repositores.Abstract;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Metadata.Ecma335;
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

        public async Task<List<Product>> GetAllProductsAsync(int? categoryId)
        {
            var query =_context.Products
                .Include(p => p.Category)
                .AsQueryable();
            if(categoryId.HasValue)
            {
                query=query.Where(x=>x.CategoryId == categoryId);
            }
            return await query.ToListAsync();

        }

        public async Task<Product?> GetProductByIdAsync(int id)
        {
            return await _context.Products
                 .Include(p => p.Category)
                 .FirstOrDefaultAsync(x => x.Id == id);
        }

        public Task<Product?> GetProductByIdWithoutCategoryAsync(int id)
        {
           return _context.Products.FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<bool> IsExistProductName(string Productname)
        {
            return await _context.Products.AnyAsync(p=>p.Name == Productname);
        }

        public async Task<bool> IsExistProductName(string productName, int id)
        {
            return await _context.Products
                .AnyAsync(x=>x.Name == productName && x.Id!=id);
        }

        public async Task<Product> UpdateProductAsync(Product product)
        {
            _context.Products.Update(product);
            await _context.SaveChangesAsync();
            return product;
        }
    }
}
