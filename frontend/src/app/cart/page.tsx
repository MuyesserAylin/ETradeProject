
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { cartService } from "../../services/cartService";
import { authService } from "../../services/authService";
import { CartResponseDto } from "../../types";

export default function CartPage() {
    const router = useRouter();
    const [cart, setCart] = useState<CartResponseDto | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authService.isLoggedIn()) {
            router.push("/login");
            return;
        }
        fetchCart();
    }, []);

    const fetchCart = async () => {
        const result = await cartService.getCart();
        if (result.succes) {
            setCart(result.data);
        }
        setLoading(false);
    };

    const handleRemove = async (id: number) => {
        await cartService.removeFromCart(id);
        fetchCart();
    };

    const handleUpdateQuantity = async (productId: number, quantity: number) => {
        await cartService.updateQuantity(productId, quantity);
        fetchCart();
    };

    const handleClearCart = async () => {
        await cartService.clearCart();
        fetchCart();
    };

    const handleOrder = () => {
        router.push("/orders/create");
    };

    if (loading) return <div className="text-center mt-20">Yükleniyor...</div>;

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Sepetim</h1>

            {!cart || cart.cartItems.length === 0 ? (
                <div className="text-center text-gray-500 mt-20">
                    <p>Sepetiniz boş.</p>
                    <a href="/" className="text-blue-600 hover:underline mt-2 block">Alışverişe Başla</a>
                </div>
            ) : (
                <>
                    <div className="space-y-4">
                        {cart.cartItems.map((item) => (
                            <div key={item.id} className="bg-white rounded-lg shadow p-4 flex items-center justify-between">
                                <div>
                                    <h3 className="font-semibold">{item.productName}</h3>
                                    <p className="text-blue-600">{item.unitPrice} ₺</p>
                                </div>

                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                        disabled={item.quantity <= 1}
                                        className="w-8 h-8 border rounded hover:bg-gray-100 disabled:opacity-50"
                                    >-</button>
                                    <span>{item.quantity}</span>
                                    <button
                                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                        className="w-8 h-8 border rounded hover:bg-gray-100"
                                    >+</button>
                                </div>

                                <p className="font-bold">{item.linePrice} ₺</p>

                                <button
                                    onClick={() => handleRemove(item.id)}
                                    className="text-red-500 hover:text-red-700"
                                >Sil</button>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 bg-white rounded-lg shadow p-4">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-lg font-semibold">Toplam:</span>
                            <span className="text-2xl font-bold text-blue-600">{cart.totalPrice} ₺</span>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={handleClearCart}
                                className="flex-1 border border-red-500 text-red-500 py-2 rounded hover:bg-red-50"
                            >Sepeti Temizle</button>
                            <button
                                onClick={handleOrder}
                                className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                            >Sipariş Ver</button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}