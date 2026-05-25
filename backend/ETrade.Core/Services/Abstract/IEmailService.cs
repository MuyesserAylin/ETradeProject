using ETrade.Core.DTOs.Responses;
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

    }
}
