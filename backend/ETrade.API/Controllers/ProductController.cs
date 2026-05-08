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
    public class ProductController:ControllerBase
    {
        private readonly IProductService _productService;
        public ProductController(IProductService productService)
        {
            _productService = productService;
        }
        [HttpPost]
        public async Task<IActionResult> AddProductAsync([FromBody] ProductCreateDto request)
        {
            var result=await _productService.AddProductAsync(request);
            return StatusCode(201, ApiResponse<ProductResponseDto>.SuccesResponse(result, "Ürün eklendi", 201));
        }


    }
}
