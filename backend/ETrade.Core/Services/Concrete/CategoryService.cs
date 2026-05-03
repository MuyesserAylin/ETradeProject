using ETrade.Core.DTOs.Requests;
using ETrade.Core.DTOs.Responses;
using ETrade.Core.Entities;
using ETrade.Core.Exceptions;
using ETrade.Core.Repositores.Abstract;
using ETrade.Core.Repositores.Concrete;
using ETrade.Core.Services.Abstract;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ETrade.Core.Services.Concrete
{
    public class CategoryService : ICategoryService
    {
        private readonly ICategoryRepository _categoryRepository;
        public CategoryService(ICategoryRepository categoryRepository) { _categoryRepository = categoryRepository; }

        public async Task<CategoryResponseDto> AddCategoryAsync(CategoryCreateDto request)
        {
            if (await _categoryRepository.IsExistCategoryName(request.Name))
            {
                throw new BadRequestException("Bu category mevcuttur.");
            }

            var newCategory = await _categoryRepository.AddCategoryAsync(new Category { Name = request.Name });
            return new CategoryResponseDto
            {
               Id=newCategory.Id,
               Name=newCategory.Name

            };

        }

        public async  Task<List<CategoryResponseDto>> GetAllCategoriesAsync()
        {
           var categories=await _categoryRepository.GetAllCategoriesAsync();

            return categories.Select(c => new CategoryResponseDto
            {
                Id = c.Id,
                Name = c.Name

            }).ToList();
        }

        public async Task<CategoryResponseDto> GetByIdCategoryAsync(int categoryId)
        {
            var category = await _categoryRepository.GetByIdCategoryAsync(categoryId);
            if (category==null)
            {
                throw new NotFoundException("Aradığınız kategori mevcut değildir.");
            }

            return  new CategoryResponseDto { Name=category.Name, Id=category.Id };
        }

        public async Task<CategoryResponseDto> UpdateCatgeoryAsync(int categoryId, CategoryCreateDto request)
        {
            var category = await _categoryRepository.GetByIdCategoryAsync(categoryId);

            if(category==null)
            {
                throw new NotFoundException("Güncellemek istediğiniz kategori mevcut değildir.");
            }

            var existsCategory=await _categoryRepository.GetByNameCategoryAsync(request.Name);

            if (existsCategory == null)
            {
                category.Name = request.Name;

            }
            else
            {
                if (existsCategory.Id == categoryId)
                {
                    category.Name = request.Name;
                }
                else
                {
                    throw new BadRequestException("Girdiğiniz kategori sistemde mevcuttur.");
                }
            }
            var updatedCategory=await _categoryRepository.UpdateCategoryAsync(category);
            return new CategoryResponseDto
            {
                Name = updatedCategory.Name,
                Id = updatedCategory.Id

            };
        }

    }
}
