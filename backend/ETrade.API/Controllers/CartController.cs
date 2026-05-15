using ETrade.Core.DTOs.Requests;
using ETrade.Core.DTOs.Responses;
using ETrade.Core.Services.Abstract;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authorization.Infrastructure;
using Microsoft.AspNetCore.Mvc;
using System.Formats.Asn1;

namespace ETrade.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class CartController:ControllerBase
    {
        private readonly ICartService _cartService;
        public CartController(ICartService cartService)
        {
            _cartService = cartService;
        }

        [HttpPost]
        [Authorize(Roles="Customer")]
        public async Task<IActionResult> AddToCartAsync([FromBody]AddToCartDto request)
        {
            var result = await _cartService.AddToCartAsync(request);
            return StatusCode(201, ApiResponse<CartItemResponseDto>.SuccesResponse(result, "Ürün sepetinize eklendi.", 201));
        }

        [HttpGet]
        [Authorize(Roles = "Customer")]
        public async Task<IActionResult> GetCartAsync()
        {
            var result = await _cartService.GetCartAsync();
            return Ok( ApiResponse<CartResponseDto>.SuccesResponse(result, "Sepetiniz görüntüleniyor.", 200));
        }
        [HttpPatch("{id}")]
        [Authorize(Roles = "Customer")]
        public async Task<IActionResult> UpdateCartItemQuantityAsync(int id, [FromBody]UpdateCartItemDto request)
        {
            var result = await _cartService.UpdateCartItemQuantityAsync(id, request);
            return Ok(ApiResponse<CartItemResponseDto>.SuccesResponse(result, "Seçtiğiniz ürünün miktarı güncellendi.", 200));
        }

        [HttpDelete("{id}")]
        [Authorize(Roles ="Customer")]
        public async Task<IActionResult> DeleteCartItemAsync(int id)
        {
            await _cartService.DeleteCartItemAsync(id);
            return StatusCode(200, ApiResponse<object>.SuccesResponse("Ürün sepetten silindi.", 200));
        }

        [HttpDelete]
        [Authorize(Roles ="Customer")]
        public async Task<IActionResult> ClearCartAsync()
        {
            await _cartService.ClearCartAsync();
            return StatusCode(200, ApiResponse<object>.SuccesResponse("Sepetiniz boşaltıldı.", 200));
        }
    }
}
