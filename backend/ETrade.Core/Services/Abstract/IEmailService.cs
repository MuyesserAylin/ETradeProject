using ETrade.Core.DTOs.Responses;
using ETrade.Core.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ETrade.Core.Services.Abstract
{
    public interface IEmailService
    {
        public Task SendOrderConfirmationAsync(string toEmail, OrderResponseDto order);
        public Task SendOrderCancelledAsync(string toEmail, int orderId);
        public Task SendOrderStatusChangedAsync(string toEmail, int orderId, OrderStatus status);

    }
}
