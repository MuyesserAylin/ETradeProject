'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useProduct } from '@/hooks/useProducts'
import { useDirectOrder } from '@/hooks/useOrders'
import { useAuthStore } from '@/store/authStore'
import Navbar from '@/components/Navbar'
import { Loader2, ArrowLeft, Package, Zap } from 'lucide-react'
import { toast } from 'sonner'

export default function DirectOrderPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { isLoggedIn } = useAuthStore()

    const productId = Number(searchParams.get('productId'))
    const quantity = Number(searchParams.get('quantity')) || 1

    const { data: product, isLoading } = useProduct(productId)
    const directOrder = useDirectOrder()

    const [address, setAddress] = useState('')
    const [phone, setPhone] = useState('')
    const [mounted, setMounted] = useState(false)

    useEffect(() => { setMounted(true) }, [])

    useEffect(() => {
        if (mounted && !isLoggedIn()) router.push('/auth/login')
    }, [mounted, isLoggedIn, router])

    if (!mounted) return null
    if (!isLoggedIn()) return null

    const handleOrder = () => {
        if (!address.trim() || !phone.trim()) {
            toast.error('Adres ve telefon numarası gerekli!')
            return
        }
        directOrder.mutate(
            { productId, quantity, shippingAddress: address, customerPhone: phone },
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
            <main className="max-w-lg mx-auto px-4 py-10">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors mb-8"
                >
                    <ArrowLeft size={16} />
                    Geri dön
                </button>

                <h1 className="text-2xl font-semibold mb-6 flex items-center gap-3">
                    <Zap size={24} className="text-emerald-400" />
                    Hemen Al
                </h1>

                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 size={32} className="animate-spin text-emerald-400" />
                    </div>
                ) : (
                    <>
                        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4 mb-6 flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center">
                                <Package size={20} className="text-white/20" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium">{product?.name}</p>
                                <p className="text-xs text-white/40">{quantity} adet × {product?.price.toLocaleString('tr-TR')}₺</p>
                            </div>
                            <p className="font-semibold">
                                {((product?.price ?? 0) * quantity).toLocaleString('tr-TR')}₺
                            </p>
                        </div>

                        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5 flex flex-col gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs text-white/50 font-medium">Teslimat Adresi</label>
                                <input
                                    type="text"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    placeholder="Adres giriniz"
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-emerald-500/50 transition-colors"
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs text-white/50 font-medium">Telefon Numarası</label>
                                <input
                                    type="text"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="05XX XXX XX XX"
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-emerald-500/50 transition-colors"
                                />
                            </div>

                            <div className="border-t border-white/10 pt-4 flex justify-between font-semibold">
                                <span>Toplam</span>
                                <span>{((product?.price ?? 0) * quantity).toLocaleString('tr-TR')}₺</span>
                            </div>

                            <button
                                onClick={handleOrder}
                                disabled={directOrder.isPending}
                                className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-medium transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {directOrder.isPending && <Loader2 size={14} className="animate-spin" />}
                                Siparişi Onayla
                            </button>
                        </div>
                    </>
                )}
            </main>
        </div>
    )
}