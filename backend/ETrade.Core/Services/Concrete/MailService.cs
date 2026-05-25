using Microsoft.Extensions.Configuration;
using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using ETrade.Core.DTOs.Responses;
using ETrade.Core.Services.Abstract;

namespace ETrade.Core.Services.Concrete
{
    public class MailService : IEmailService
    {
        private readonly IConfiguration _configuration;
        public MailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        public async Task SendOrderConfirmationAsync(string toEmail, OrderResponseDto order)
        {
            var host = _configuration["EmailSettings:Host"];
            var port = int.Parse(_configuration["EmailSettings:Port"]!);
            var email = _configuration["EmailSettings:Email"];
            var password = _configuration["EmailSettings:Password"];
            var displayName = _configuration["EmailSettings:DisplayName"];

            var message = new MimeMessage();
            message.From.Add(new MailboxAddress(displayName, email));
            message.To.Add(new MailboxAddress("", toEmail));
            message.Subject = $"Siparişiniz Alındı - #{order.Id}";

            var bodyBuilder = new BodyBuilder();
            bodyBuilder.HtmlBody = BuildOrderConfirmationHtml(order);
            message.Body = bodyBuilder.ToMessageBody();

            using var client = new SmtpClient();
            await client.ConnectAsync(host, port, SecureSocketOptions.StartTls);
            await client.AuthenticateAsync(email, password);
            await client.SendAsync(message);
            await client.DisconnectAsync(true);

        }
        private string BuildOrderConfirmationHtml(OrderResponseDto order)
        {
            var itemsHtml = string.Join("", order.OrderItems.Select(item => $@"
        <tr>
            <td style='padding:8px;border:1px solid #ddd;'>{item.ProductName}</td>
            <td style='padding:8px;border:1px solid #ddd;text-align:center;'>{item.Quantity}</td>
            <td style='padding:8px;border:1px solid #ddd;text-align:right;'>{item.UnitPrice:C}</td>
            <td style='padding:8px;border:1px solid #ddd;text-align:right;'>{item.SubTotal:C}</td>
        </tr>"));

            return $@"
    <html>
    <body style='font-family:Arial,sans-serif;max-width:600px;margin:auto;'>
        <h2 style='color:#16213e;'>Siparişiniz Alındı! 🎉</h2>
        <p>Siparişiniz başarıyla oluşturuldu.</p>
        
        <table style='width:100%;border-collapse:collapse;margin-top:20px;'>
            <tr style='background:#16213e;color:white;'>
                <th style='padding:8px;'>Ürün</th>
                <th style='padding:8px;'>Adet</th>
                <th style='padding:8px;'>Birim Fiyat</th>
                <th style='padding:8px;'>Toplam</th>
            </tr>
            {itemsHtml}
        </table>

        <h3 style='text-align:right;color:#16213e;'>
            Genel Toplam: {order.TotalAmount:C}
        </h3>

        <p style='color:gray;font-size:12px;'>
            Sipariş No: #{order.Id} | Tarih: {order.OrderDate:dd.MM.yyyy HH:mm}
        </p>
    </body>
    </html>";
        }

    }
}
