using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ETrade.Core.DTOs.Requests
{
    public class CategoryCreateDto
    {
        [Required(ErrorMessage = "Kategori adınızı giriniz.")]
        public string Name { get; set; } = null!;

    }
}
