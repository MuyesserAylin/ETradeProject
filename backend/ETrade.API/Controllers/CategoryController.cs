using ETrade.Core.DTOs.Requests;
using ETrade.Core.DTOs.Responses;
using ETrade.Core.Services.Abstract;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.IdentityModel.Tokens;

namespace ETrade.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles ="Admin")]
    public class CategoryController:ControllerBase
    {
        private readonly ICategoryService _categoryService;
        public CategoryController(ICategoryService categoryService) { _categoryService = categoryService; }

        [HttpPost]
        public async Task<IActionResult> AddCategoryAsync(CategoryCreateDto request)
        {
            var result=await _categoryService.AddCategoryAsync(request);
            return StatusCode(201,ApiResponse<CategoryResponseDto>.SuccesResponse(result,"Kategori başarıyla oluşturuldu.",201));
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> GetAllCategoriesAsync()
        {
            var result= await _categoryService.GetAllCategoriesAsync();
            return Ok(ApiResponse<List<CategoryResponseDto>>.SuccesResponse(result, "Kategoriler listeniyor.", 200));
        }

        [HttpGet("{categoryId}")]
        public async Task<IActionResult> GetByIdCategory(int categoryId)
        {
            var result= await _categoryService.GetByIdCategoryAsync(categoryId);
            return Ok(ApiResponse<CategoryResponseDto>.SuccesResponse(result, "Kategori bulundu.", 200));
        }

        [HttpPut("{categoryId}")]
        public async Task<IActionResult> UpdateCategoryAsync(int categoryId,CategoryCreateDto request)
        {
            var result=await _categoryService.UpdateCatgeoryAsync(categoryId,request);
            return Ok(ApiResponse<CategoryResponseDto>.SuccesResponse(result, "Kategori güncellendi.", 200));
        }
    }

      
}
