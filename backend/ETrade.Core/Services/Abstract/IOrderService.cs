using ETrade.Core.DTOs.Requests;
using ETrade.Core.DTOs.Responses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ETrade.Core.Services.Abstract
{
    public interface IOrderService
    {
        public Task<OrderResponseDto> CreateOrderFromCartAsync(CreateOrderRequestDto request);

        public Task<OrderResponseDto> CreateDirectOrderAsync(DirectOrderRequestDto request);
        public Task<List<OrderSummaryDto>> GetAllOrdersAsync();
        public Task<List<OrderSummaryDto>> GetUserOrderAsync();
    }
}
