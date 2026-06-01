"use client";

import { useEffect, useState } from "react";
import { productService } from "../services/productService";
import { ProductResponseDto } from "../types";
import { useRouter } from "next/navigation";
import { cartService } from "../services/cartService";
import { authService } from "../services/authService";

export default function HomePage() {
  const router = useRouter();
  const [products, setProducts] = useState<ProductResponseDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const result = await productService.getAll();
      if (result.succes) {
        setProducts(result.data);
      }
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const handleAddToCart = async (productId: number) => {
    if (!authService.isLoggedIn()) {
      router.push("/login");
      return;
    }
    const result = await cartService.addToCart(productId, 1);
    if (result.succes) {
      alert("Ürün sepete eklendi!");
    } else {
      alert(result.message);
    }
  };

  if (loading) return <div className="text-center mt-20">Yükleniyor...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Ürünler</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow p-4 flex flex-col">
            <h2 className="font-semibold text-lg mb-2">{product.name}</h2>
            <p className="text-gray-500 text-sm mb-1">{product.categoryName}</p>
            <p className="text-blue-600 font-bold text-xl mb-2">{product.price} ₺</p>
            <p className="text-sm text-gray-400 mb-4">Stok: {product.stock}</p>
            <div className="mt-auto flex gap-2">
              <button
                onClick={() => router.push(`/products/${product.id}`)}
                className="flex-1 border border-blue-600 text-blue-600 py-2 rounded hover:bg-blue-50"
              >
                Detay
              </button>
              <button
                onClick={() => handleAddToCart(product.id)}
                disabled={product.stock === 0}
                className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {product.stock === 0 ? "Tükendi" : "Sepete Ekle"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}