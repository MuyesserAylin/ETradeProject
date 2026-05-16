using ETrade.Core.DTOs.Requests;
using ETrade.Core.DTOs.Responses;
using ETrade.Core.Services.Abstract;
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
            return Ok(ApiResponse<OrderResponseDto>.SuccesResponse(result, "Siparişiniz alındı.", 200));
        }
    }
}
