"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { productService } from "../../../services/productService";
import { cartService } from "../../../services/cartService";
import { authService } from "../../../services/authService";
import { ProductDetailResponseDto } from "../../../types";

export default function ProductDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [product, setProduct] = useState<ProductDetailResponseDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        const fetchProduct = async () => {
            const result = await productService.getById(Number(params.id));
            if (result.succes) {
                setProduct(result.data);
            }
            setLoading(false);
        };
        fetchProduct();
    }, [params.id]);

    const handleAddToCart = async () => {
        if (!authService.isLoggedIn()) {
            router.push("/login");
            return;
        }
        const result = await cartService.addToCart(product!.id, quantity);
        if (result.succes) {
            alert("Ürün sepete eklendi!");
        } else {
            alert(result.message);
        }
    };

    if (loading) return <div className="text-center mt-20">Yükleniyor...</div>;
    if (!product) return <div className="text-center mt-20">Ürün bulunamadı.</div>;

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            <button
                onClick={() => router.back()}
                className="mb-6 text-blue-600 hover:underline"
            >
                ← Geri
            </button>

            <div className="bg-white rounded-lg shadow p-6">
                <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
                <p className="text-gray-500 mb-4">{product.categoryName}</p>
                <p className="text-gray-700 mb-4">{product.description}</p>
                <p className="text-blue-600 text-3xl font-bold mb-2">{product.price} ₺</p>
                <p className="text-sm text-gray-400 mb-6">Stok: {product.stock}</p>

                <div className="flex items-center gap-4 mb-6">
                    <label className="text-sm font-medium">Adet:</label>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setQuantity(q => Math.max(1, q - 1))}
                            className="w-8 h-8 border rounded hover:bg-gray-100"
                        >-</button>
                        <span className="w-8 text-center">{quantity}</span>
                        <button
                            onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                            className="w-8 h-8 border rounded hover:bg-gray-100"
                        >+</button>
                    </div>
                </div>

                <button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                    {product.stock === 0 ? "Stok Yok" : "Sepete Ekle"}
                </button>
            </div>
        </div>
    );
}