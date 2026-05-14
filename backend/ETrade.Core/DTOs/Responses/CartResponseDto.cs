using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ETrade.Core.DTOs.Responses
{
    public class CartResponseDto
    {
        public List<CartItemResponseDto> CartItems { get; set; }=new List<CartItemResponseDto>();
        public decimal TotalPrice { get; set; }

    }
}
