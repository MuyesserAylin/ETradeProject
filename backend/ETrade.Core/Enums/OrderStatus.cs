namespace ETrade.Core.Enums;

public enum OrderStatus
{
    Pending = 0,    // Beklemede
    Processing = 1, // Hazırlanıyor
    Shipped = 2,    // Kargolandı
    Delivered = 3,  // Tamamlandı
    Cancelled = 4   // İptal Edildi
}
