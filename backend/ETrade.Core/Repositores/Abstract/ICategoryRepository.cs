
using ETrade.Core.DTOs.Internal;
using ETrade.Core.DTOs.Requests;
using ETrade.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ETrade.Core.Repositores.Abstract
{
    public interface ICategoryRepository
    {
       public Task<bool> IsExistCategoryName(string categoryName);
       public Task<Category> AddCategoryAsync(Category category);
      
        public Task<List<Category>> GetAllCategoriesAsync();
        public Task<Category?> GetByIdCategoryAsync(int CategoryId);
        public Task<Category?> GetByNameCategoryAsync(string CategoryName);
        public Task<Category> UpdateCategoryAsync(Category category);
        public Task<CategoryDeleteCheckDto?> GetCategoryWithProductStatusAsync(int CategoryId);
        public Task DeleteCategoryAsync(Category category);

    }
}
