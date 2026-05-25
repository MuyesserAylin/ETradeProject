using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ETrade.Core.DTOs.Responses
{
    public class OrderDetailResponseDto:OrderResponseDto
    {
        public string CustomerFullName { get; set; } = null!;
        public string CustomerEmail { get; set; } = null!;
    }
}
