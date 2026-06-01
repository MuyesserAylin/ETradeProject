"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { orderService } from "../../services/orderService";
import { authService } from "../../services/authService";
import { OrderSummaryDto } from "../../types";

export default function OrdersPage() {
    const router = useRouter();
    const [orders, setOrders] = useState<OrderSummaryDto[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authService.isLoggedIn()) {
            router.push("/login");
            return;
        }
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        const result = await orderService.getMyOrders();
        if (result.succes) {
            setOrders(result.data);
        }
        setLoading(false);
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case "Pending": return "Beklemede";
            case "Processing": return "Hazırlanıyor";
            case "Shipped": return "Kargoda";
            case "Delivered": return "Teslim Edildi";
            case "Cancelled": return "İptal Edildi";
            default: return status;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Pending": return "bg-yellow-100 text-yellow-700";
            case "Processing": return "bg-blue-100 text-blue-700";
            case "Shipped": return "bg-purple-100 text-purple-700";
            case "Delivered": return "bg-green-100 text-green-700";
            case "Cancelled": return "bg-red-100 text-red-700";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    if (loading) return <div className="text-center mt-20">Yükleniyor...</div>;

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Siparişlerim</h1>

            {orders.length === 0 ? (
                <div className="text-center text-gray-500 mt-20">
                    <p>Henüz siparişiniz yok.</p>
                    <a href="/" className="text-blue-600 hover:underline mt-2 block">Alışverişe Başla</a>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-white rounded-lg shadow p-4 flex items-center justify-between">
                            <div>
                                <p className="font-semibold">Sipariş #{order.id}</p>
                                <p className="text-sm text-gray-500">
                                    {new Date(order.orderDate).toLocaleDateString("tr-TR")}
                                </p>
                            </div>

                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                                {getStatusText(order.status)}
                            </span>

                            <p className="font-bold text-blue-600">{order.totalAmount} ₺</p>

                            <button
                                onClick={() => router.push(`/orders/${order.id}`)}
                                className="border border-blue-600 text-blue-600 px-4 py-1 rounded hover:bg-blue-50"
                            >
                                Detay
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}