using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ETrade.Core.DTOs.Requests
{
    public class UpdateCartItemDto
    {
        [Range(1,100000)]
        public int Quantity { get; set; }
    }
}
