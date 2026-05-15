using ETrade.Core.DTOs.Requests;
using ETrade.Core.DTOs.Responses;
using ETrade.Core.Services.Abstract;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ETrade.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class ProductController : ControllerBase
    {
        private readonly IProductService _productService;
        public ProductController(IProductService productService)
        {
            _productService = productService;
        }
        [HttpPost]
        public async Task<IActionResult> AddProductAsync([FromBody] ProductCreateDto request)
        {
            var result = await _productService.AddProductAsync(request);
            return StatusCode(201, ApiResponse<ProductResponseDto>.SuccesResponse(result, "Ürün eklendi", 201));
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> GetAllProductsAsync([FromQuery] int? categoryId)
        {
            var result = await _productService.GetAllProductsAsync(categoryId);
            return Ok(ApiResponse<List<ProductResponseDto>>.SuccesResponse(result, "Ürünler listelendi", 200));
        }

        [AllowAnonymous]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetProductByIdAsync(int id)
        {
            var result = await _productService.GetProductByIdAsync(id);
            return Ok(ApiResponse<ProductDetailResponseDto>.SuccesResponse(result, "Ürün bilgileri getirildi.", 200));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProductAsync( int id, [FromBody] ProductUpdateDto request)
        {
            var result = await _productService.UpdateProductAsync(id,request);
            return Ok(ApiResponse<ProductResponseDto>.SuccesResponse(result, "Ürün bilgileri güncellendi.", 200));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProductAsync(int id)
        {
            await _productService.DeleteProductAsync(id);
            return StatusCode(200,ApiResponse<object>.SuccesResponse( "Ürün silindi.", 200));
        }
    }
}
