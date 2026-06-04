'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useProduct } from '@/hooks/useProducts'
import { useAddToCart } from '@/hooks/useCart'
import { useAuthStore } from '@/store/authStore'
import Navbar from '@/components/Navbar'
import { ShoppingCart, Package, ArrowLeft, Loader2, Zap } from 'lucide-react'
import { toast } from 'sonner'

export default function ProductDetailPage() {
    const { id } = useParams()
    const router = useRouter()
    const { isLoggedIn, isAdmin } = useAuthStore()
    const [quantity, setQuantity] = useState(1)

    const { data: product, isLoading } = useProduct(Number(id))
    const addToCart = useAddToCart()

    const handleAddToCart = () => {
        if (!isLoggedIn()) {
            toast.error('Sepete eklemek için giriş yapman gerekiyor!')
            router.push('/auth/login')
            return
        }
        if (isAdmin()) {
            toast.error('Admin hesabıyla sepet kullanılamaz.')
            return
        }
        addToCart.mutate(
            { productId: Number(id), quantity },
            {
                onSuccess: () => toast.success('Ürün sepete eklendi!'),
                onError: () => toast.error('Bir hata oluştu.'),
            }
        )
    }

    const handleDirectOrder = () => {
        if (!isLoggedIn()) {
            toast.error('Sipariş vermek için giriş yapman gerekiyor!')
            router.push('/auth/login')
            return
        }
        if (isAdmin()) {
            toast.error('Admin hesabıyla sipariş verilemez.')
            return
        }
        router.push(`/orders/direct?productId=${id}&quantity=${quantity}`)
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a]">
                <Navbar />
                <div className="flex items-center justify-center py-20">
                    <Loader2 size={32} className="animate-spin text-emerald-400" />
                </div>
            </div>
        )
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-[#0a0a0a]">
                <Navbar />
                <div className="flex flex-col items-center justify-center py-20 text-white/30">
                    <Package size={48} className="mb-4" />
                    <p>Ürün bulunamadı.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a]">
            <Navbar />
            <main className="max-w-4xl mx-auto px-4 py-10">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors mb-8"
                >
                    <ArrowLeft size={16} />
                    Geri dön
                </button>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Görsel */}
                    <div className="bg-white/[0.03] border border-white/10 rounded-2xl h-72 flex items-center justify-center">
                        <Package size={64} className="text-white/10" />
                    </div>

                    {/* Bilgiler */}
                    <div className="flex flex-col">
                        <p className="text-xs text-emerald-400 font-medium uppercase tracking-wide mb-2">
                            {product.categoryName}
                        </p>
                        <h1 className="text-2xl font-semibold mb-2">{product.name}</h1>
                        <p className="text-white/40 text-sm mb-6 leading-relaxed">{product.description}</p>

                        <div className="text-3xl font-bold mb-2">
                            {product.price.toLocaleString('tr-TR')}₺
                        </div>
                        <p className={`text-sm mb-6 ${product.stock > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                            {product.stock > 0 ? `${product.stock} adet stokta` : 'Stokta yok'}
                        </p>

                        {/* Adet */}
                        <div className="flex items-center gap-3 mb-6">
                            <span className="text-sm text-white/40">Adet:</span>
                            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="text-white/40 hover:text-white transition-colors text-lg leading-none"
                                >
                                    −
                                </button>
                                <span className="text-sm font-medium w-6 text-center">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                    className="text-white/40 hover:text-white transition-colors text-lg leading-none"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* Butonlar */}
                        <div className="flex gap-3">
                            <button
                                onClick={handleAddToCart}
                                disabled={product.stock === 0 || addToCart.isPending}
                                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 text-sm font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                <ShoppingCart size={16} />
                                Sepete Ekle
                            </button>
                            <button
                                onClick={handleDirectOrder}
                                disabled={product.stock === 0}
                                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                <Zap size={16} />
                                Hemen Al
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}