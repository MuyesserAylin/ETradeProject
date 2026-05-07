using ETrade.Core.Data;
using ETrade.Core.DTOs.Requests;
using ETrade.Core.DTOs.Responses;
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
    public class CategoryRepository:ICategoryRepository
    {
        private readonly AppDbContext _context;
        public CategoryRepository(AppDbContext context) { _context = context; }

        public async Task<bool> IsExistCategoryName(string categoryName)
        {
            return await  _context.Categories.AnyAsync(c=>c.Name== categoryName);
        }

        public async Task<Category> AddCategoryAsync(Category category)
        {
            await _context.Categories.AddAsync(category);
            await _context.SaveChangesAsync();
            return category;

        }
        public async Task<List<Category>> GetAllCategoriesAsync()
        {
            return await _context.Categories.ToListAsync();
        }

        public async Task<Category?> GetByIdCategoryAsync(int categoryId)
        {
            return await _context.Categories.FindAsync(categoryId);
        }
        public async Task<Category?> GetByNameCategoryAsync(string categoryName)
        {
            return await _context.Categories.FirstOrDefaultAsync(c=>c.Name== categoryName);
        }

        public async Task<Category> UpdateCategoryAsync(Category category)
        {
            _context.Categories.Update(category);
            await _context.SaveChangesAsync();
            return category;
        }

        public async Task<CategoryDeleteCheckDto?> GetCategoryWithProductStatusAsync(int categoryId)
        {
            return await _context.Categories
                  .Where(c => c.Id == categoryId)
                  .Select(c => new CategoryDeleteCheckDto
                  {
                      Category = new Category { Id=c.Id,Name=c.Name },
                      HasProducts = c.Products!=null && c.Products.Any()
                  })
                  .FirstOrDefaultAsync();
        }

        public async Task DeleteCategoryAsync(Category category)
        {
             _context.Remove(category);
            await _context.SaveChangesAsync();
        }
    }
}
