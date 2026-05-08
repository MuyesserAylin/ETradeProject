using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ETrade.Core.DTOs.Requests
{
    public class ProductCreateDto
    {

        [Required(ErrorMessage = "Ürün adınızı giriniz.")]
        [StringLength(100, MinimumLength = 3, ErrorMessage = "Ürün adı 3 ile 100 karakter arasında olmalıdır.")]
        public string Name { get; set; } = null!;

        [Required(ErrorMessage = "Ürün tanımınızı giriniz.")]
        public string Description { get; set; } = null!;
        [Range(0.01, 999999, ErrorMessage = "Fiyat 0'dan büyük olmalıdır.")]
        public decimal Price { get; set; }
        [Range(0, 10000, ErrorMessage = "Stok miktarı negatif olamaz.")]
        public int Stock { get; set; }
        [Range(1, int.MaxValue, ErrorMessage = "Lütfen geçerli bir kategori seçiniz.")]
        public int CategoryId { get; set; }


    }
}
