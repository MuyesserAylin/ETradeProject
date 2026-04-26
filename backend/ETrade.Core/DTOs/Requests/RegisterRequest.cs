using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;

namespace ETrade.Core.DTOs.Requests
{
    public class RegisterRequest
    {
        [Required(ErrorMessage ="Ad ve soyad zorunludur.")]
        public string FullName { get; set; } = null!;
        [Required(ErrorMessage ="Mail adresi zorunludur.")]
        [EmailAddress(ErrorMessage ="Lütfen geçerli mail adresi giriniz.")]
        public string Email { get; set; } = null!;
        [Required(ErrorMessage = "Şifre zorunludur")]
        [MinLength(6, ErrorMessage = "Şifre en az 6 karakter olmalıdır")]
        public string Password { get; set; } = null!;

    }
}
