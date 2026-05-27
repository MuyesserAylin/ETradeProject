using ETrade.Core.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ETrade.Core.DTOs.Requests
{
    public class UpdateOrderStatusDto
    {
        [Required(ErrorMessage ="Bu alan boş bırakılamaz.")]
        public OrderStatus Status { get; set; }

    }
}
