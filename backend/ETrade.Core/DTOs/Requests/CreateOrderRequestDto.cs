using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ETrade.Core.DTOs.Requests
{
    public class CreateOrderRequestDto
    {
        [StringLength(200, MinimumLength = 10, ErrorMessage = "Adres en az 10 karakter olmalıdır.")]
        public string ShippingAddress { get; set; } = null!;
        [RegularExpression(@"^\d{10,11}$", ErrorMessage = "Geçerli bir telefon numarası giriniz.")]
        public string CustomerPhone { get; set; } = null!;
    }
}
