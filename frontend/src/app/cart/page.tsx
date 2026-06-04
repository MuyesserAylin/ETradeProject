'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCart, useUpdateCartItem, useDeleteCartItem, useClearCart } from '@/hooks/useCart'
import { useCreateOrder } from '@/hooks/useOrders'
import { useAuthStore } from '@/store/authStore'
import Navbar from '@/components/Navbar'
import { ShoppingCart, Trash2, Loader2, ArrowLeft, Package } from 'lucide-react'
import { toast } from 'sonner'

export default function CartPage() {
    const router = useRouter()
    const { isLoggedIn } = useAuthStore()
    const { data: cart, isLoading } = useCart()
    const updateItem = useUpdateCartItem()
    const deleteItem = useDeleteCartItem()
    const clearCart = useClearCart()
    const createOrder = useCreateOrder()

    const [address, setAddress] = useState('')
    const [phone, setPhone] = useState('')
    const [showOrder, setShowOrder] = useState(false)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    if (!isLoggedIn()) {
        router.push('/auth/login')
        return null
    }

    const handleUpdateQuantity = (productId: number, currentQty: number, delta: number) => {
        const newQty = currentQty + delta
        if (newQty < 1) return
        updateItem.mutate(
            { id: productId, dto: { quantity: newQty } },
            { onError: () => toast.error('Adet güncellenemedi.') }
        )
    }

    const handleOrder = () => {
        if (!address.trim() || !phone.trim()) {
            toast.error('Adres ve telefon numarası gerekli!')
            return
        }
        createOrder.mutate(
            { shippingAddress: address, customerPhone: phone },
            {
                onSuccess: () => {
                    toast.success('Siparişin oluşturuldu!')
                    router.push('/orders')
                },
                onError: (err: any) => {
                    const msg = err?.response?.data?.message ?? 'Sipariş oluşturulurken hata oluştu.'
                    toast.error(msg)
                },
            }
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

                <h1 className="text-2xl font-semibold mb-6 flex items-center gap-3">
                    <ShoppingCart size={24} />
                    Sepetim
                </h1>

                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 size={32} className="animate-spin text-emerald-400" />
                    </div>
                ) : !cart?.cartItems?.length ? (
                    <div className="flex flex-col items-center justify-center py-20 text-white/30">
                        <Package size={48} className="mb-4" />
                        <p className="mb-4">Sepetiniz boş.</p>
                        <button
                            onClick={() => router.push('/')}
                            className="px-4 py-2 rounded-lg bg-emerald-500 text-white text-sm hover:bg-emerald-400 transition-all"
                        >
                            Alışverişe başla
                        </button>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="md:col-span-2 flex flex-col gap-3">
                            {cart.cartItems.map((item) => (
                                <div
                                    key={item.productId}
                                    className="flex items-center gap-4 bg-white/[0.03] border border-white/10 rounded-xl p-4"
                                >
                                    <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Package size={20} className="text-white/20" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">{item.productName}</p>
                                        <p className="text-xs text-white/40">{item.unitPrice.toLocaleString('tr-TR')}₺ / adet</p>
                                    </div>
                                    <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5">
                                        <button
                                            onClick={() => handleUpdateQuantity(item.productId, item.quantity, -1)}
                                            disabled={item.quantity <= 1 || updateItem.isPending}
                                            className="text-white/40 hover:text-white transition-colors disabled:opacity-20 text-lg leading-none"
                                        >
                                            −
                                        </button>
                                        <span className="text-sm w-5 text-center">{item.quantity}</span>
                                        <button
                                            onClick={() => handleUpdateQuantity(item.productId, item.quantity, 1)}
                                            disabled={updateItem.isPending}
                                            className="text-white/40 hover:text-white transition-colors text-lg leading-none"
                                        >
                                            +
                                        </button>
                                    </div>
                                    <p className="text-sm font-semibold w-20 text-right">
                                        {item.linePrice.toLocaleString('tr-TR')}₺
                                    </p>
                                    <button
                                        onClick={() => deleteItem.mutate(item.id)}
                                        className="text-white/20 hover:text-red-400 transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}

                            <button
                                onClick={() => clearCart.mutate()}
                                className="self-start text-xs text-white/30 hover:text-red-400 transition-colors flex items-center gap-1 mt-2"
                            >
                                <Trash2 size={12} />
                                Sepeti temizle
                            </button>
                        </div>

                        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5 h-fit">
                            <h2 className="text-sm font-semibold mb-4">Sipariş Özeti</h2>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-white/40">Ara toplam</span>
                                <span>{cart.totalPrice.toLocaleString('tr-TR')}₺</span>
                            </div>
                            <div className="flex justify-between text-sm mb-4">
                                <span className="text-white/40">Kargo</span>
                                <span className="text-emerald-400">Ücretsiz</span>
                            </div>
                            <div className="border-t border-white/10 pt-4 flex justify-between font-semibold mb-5">
                                <span>Toplam</span>
                                <span>{cart.totalPrice.toLocaleString('tr-TR')}₺</span>
                            </div>

                            {!showOrder ? (
                                <button
                                    onClick={() => setShowOrder(true)}
                                    className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-medium transition-all"
                                >
                                    Siparişi Tamamla
                                </button>
                            ) : (
                                <div className="flex flex-col gap-3">
                                    <input
                                        type="text"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        placeholder="Teslimat adresi"
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-emerald-500/50 transition-colors"
                                    />
                                    <input
                                        type="text"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="Telefon numarası"
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-emerald-500/50 transition-colors"
                                    />
                                    <button
                                        onClick={handleOrder}
                                        disabled={createOrder.isPending}
                                        className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-medium transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {createOrder.isPending && <Loader2 size={14} className="animate-spin" />}
                                        Onayla
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}