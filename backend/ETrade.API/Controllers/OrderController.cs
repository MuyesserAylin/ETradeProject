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
    public class OrderController:ControllerBase
    {
        private readonly IOrderService _orderService;
        public OrderController(IOrderService orderService)
        {
            _orderService = orderService;
        }
        [Authorize(Roles="Customer")]
        [HttpPost]
        public async Task<IActionResult> CreateOrderFromCartAsync([FromBody] CreateOrderRequestDto request)
        {
            var result=await _orderService.CreateOrderFromCartAsync(request);
            return StatusCode(201,ApiResponse<OrderResponseDto>.SuccesResponse(result, "Siparişiniz alındı.", 201));
        }

        [Authorize(Roles = "Customer")]
        [HttpPost("direct")]
        
        public async Task<IActionResult> CreateDirectOrderAsync([FromBody]DirectOrderRequestDto request)
        {
            var result=await _orderService.CreateDirectOrderAsync(request);
            return StatusCode(201,ApiResponse<OrderResponseDto>.SuccesResponse(result, "Siparişiniz alındı.", 201));
        }

        [Authorize(Roles ="Admin")]
        [HttpGet]
        public async Task<IActionResult> GetAllOrdersAsync()
        {
            var result=await _orderService.GetAllOrdersAsync();
            return Ok(ApiResponse<List<OrderSummaryDto>>.SuccesResponse(result, "Tüm siparişler görüntüleniyor.", 200));
        }

        [Authorize(Roles = "Customer")]
        [HttpGet("my")]
        public async Task<IActionResult> GetUserOrderAsync()
        {
            var result = await _orderService.GetUserOrderAsync();
            return Ok(ApiResponse<List<OrderSummaryDto>>.SuccesResponse(result, "Sipariş geçmişiniz görüntüleniyor.", 200));
        }
    }
}
