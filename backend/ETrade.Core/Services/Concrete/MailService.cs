using ETrade.Core.DTOs.Responses;
using ETrade.Core.Enums;
using ETrade.Core.Services.Abstract;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Configuration;
using MimeKit;

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
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress(_configuration["EmailSettings:DisplayName"], _configuration["EmailSettings:Email"]));
            message.To.Add(new MailboxAddress("", toEmail));
            message.Subject = $"Siparişiniz Alındı - #{order.Id}";
            var bodyBuilder = new BodyBuilder();
            bodyBuilder.HtmlBody = BuildOrderConfirmationHtml(order);
            message.Body = bodyBuilder.ToMessageBody();
            await SendMailAsync(message);
        }

        public async Task SendOrderCancelledAsync(string toEmail, int orderId)
        {
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress(_configuration["EmailSettings:DisplayName"], _configuration["EmailSettings:Email"]));
            message.To.Add(new MailboxAddress("", toEmail));
            message.Subject = $"Siparişiniz İptal Edildi - #{orderId}";
            var bodyBuilder = new BodyBuilder();
            bodyBuilder.HtmlBody = $@"
        <html>
        <body style='font-family:Arial,sans-serif;max-width:600px;margin:auto;'>
            <h2 style='color:#e74c3c;'>Siparişiniz İptal Edildi 😔</h2>
            <p>#{orderId} numaralı siparişiniz iptal edilmiştir.</p>
            <p>Stoklar iade edilmiştir. Tekrar alışveriş yapabilirsiniz.</p>
        </body>
        </html>";
            message.Body = bodyBuilder.ToMessageBody();
            await SendMailAsync(message);
        }

        public async Task SendOrderStatusChangedAsync(string toEmail, int orderId, OrderStatus status)
        {
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress(_configuration["EmailSettings:DisplayName"], _configuration["EmailSettings:Email"]));
            message.To.Add(new MailboxAddress("", toEmail));
            message.Subject = $"Siparişiniz Güncellendi - #{orderId}";
            var bodyBuilder = new BodyBuilder();
            bodyBuilder.HtmlBody = $@"
        <html>
        <body style='font-family:Arial,sans-serif;max-width:600px;margin:auto;'>
            <h2 style='color:#16213e;'>Sipariş Durumunuz Güncellendi</h2>
            <p>#{orderId} numaralı siparişinizin durumu: <strong>{status}</strong></p>
        </body>
        </html>";
            message.Body = bodyBuilder.ToMessageBody();
            await SendMailAsync(message);
        }

        private async Task SendMailAsync(MimeMessage message)
        {
            using var client = new SmtpClient();
            await client.ConnectAsync(
                _configuration["EmailSettings:Host"],
                int.Parse(_configuration["EmailSettings:Port"]!),
                SecureSocketOptions.StartTls);
            await client.AuthenticateAsync(
                _configuration["EmailSettings:Email"],
                _configuration["EmailSettings:Password"]);
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
