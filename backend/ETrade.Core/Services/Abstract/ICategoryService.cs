using ETrade.Core.DTOs.Requests;
using ETrade.Core.DTOs.Responses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ETrade.Core.Services.Abstract
{
    public interface ICategoryService
    {
        public Task<CategoryResponseDto> AddCategoryAsync(CategoryCreateDto request);
        public Task<List<CategoryResponseDto>> GetAllCategoriesAsync();
        public Task<CategoryResponseDto> GetByIdCategoryAsync(int categoryId);

        public Task<CategoryResponseDto> UpdateCatgeoryAsync(int categoryId, CategoryCreateDto request);
    }
}
