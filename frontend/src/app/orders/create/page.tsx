"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { orderService } from "../../../services/orderService";

export default function CreateOrderPage() {
    const router = useRouter();
    const [shippingAddress, setShippingAddress] = useState("");
    const [customerPhone, setCustomerPhone] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const result = await orderService.createFromCart(shippingAddress, customerPhone);

        if (result.succes) {
            alert("Siparişiniz alındı!");
            router.push("/orders");
        } else {
            setError(result.message);
        }

        setLoading(false);
    };

    return (
        <div className="max-w-lg mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Sipariş Ver</h1>

            {error && (
                <div className="bg-red-100 text-red-600 p-3 rounded mb-4">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Teslimat Adresi</label>
                    <textarea
                        value={shippingAddress}
                        onChange={(e) => setShippingAddress(e.target.value)}
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={3}
                        required
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium mb-1">Telefon Numarası</label>
                    <input
                        type="tel"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <div className="flex gap-4">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="flex-1 border py-2 rounded hover:bg-gray-50"
                    >
                        Geri
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? "Sipariş veriliyor..." : "Siparişi Onayla"}
                    </button>
                </div>
            </form>
        </div>
    );
}