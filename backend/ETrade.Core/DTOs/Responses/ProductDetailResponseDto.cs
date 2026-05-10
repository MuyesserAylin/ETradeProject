using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ETrade.Core.DTOs.Responses
{
    public class ProductDetailResponseDto:ProductResponseDto
    {
       
        public string Description { get; set; } =string.Empty!;
    }
}
