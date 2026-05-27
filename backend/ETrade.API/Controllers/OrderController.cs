using ETrade.Core.DTOs.Requests;
using ETrade.Core.DTOs.Responses;
using ETrade.Core.Services.Abstract;
using ETrade.Core.Services.Concrete;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ETrade.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class OrderController : ControllerBase
    {
        private readonly IOrderService _orderService;
        public OrderController(IOrderService orderService)
        {
            _orderService = orderService;
        }
        [Authorize(Roles = "Customer")]
        [HttpPost]
        public async Task<IActionResult> CreateOrderFromCartAsync([FromBody] CreateOrderRequestDto request)
        {
            var result = await _orderService.CreateOrderFromCartAsync(request);
            return StatusCode(201, ApiResponse<OrderResponseDto>.SuccesResponse(result, "Siparişiniz alındı.", 201));
        }

        [Authorize(Roles ="Customer")]
        [HttpPost("direct")]
        public async Task<IActionResult> CreateDirectOrderAsync([FromBody]DirectOrderRequestDto request)
        {
            var result=await _orderService.CreateDirectOrderAsync(request);
            return StatusCode(201, ApiResponse<OrderResponseDto>.SuccesResponse(result, "Siparişiniz alındı.", 201));
        }

       
        [HttpGet]
        public async Task<IActionResult> GetAllOrdersAsync()
        {
            var result=await _orderService.GetAllOrdersAsync();
            return Ok(ApiResponse<List<OrderSummaryDto>>.SuccesResponse(result,"Tüm siparişler listelendi",200));
        }

        

        [HttpGet("{id}")]
        public async Task<IActionResult> GetOrderByIdAsync(int id)
        {
            var result=await _orderService.GetOrderByIdAsync(id);
            return Ok(ApiResponse<OrderDetailResponseDto>.SuccesResponse(result, "Siparişin detayı görüntüleniyor",200));
        }

        [Authorize(Roles = "Admin")]
        [HttpPatch("{id}/status")]
        public async Task<IActionResult> UpdateOrderStatusAsync(int id, [FromBody] UpdateOrderStatusDto request)
        {
            var result = await _orderService.UpdateOrderStatusAsync(id, request);
            return Ok(ApiResponse<OrderDetailResponseDto>.SuccesResponse(result, "Sipariş durumu güncellendi.", 200));
        }

        [Authorize(Roles ="Customer")]
        [HttpPatch("{id}/cancel")]
        public async Task<IActionResult> CancelOrderAsync(int id)
        {
            var result=await _orderService.CancelOrderAsync(id);
            return Ok(ApiResponse<OrderDetailResponseDto>.SuccesResponse(result, "Sipariş durumu güncellendi.", 200));
        }

    }
}
