'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useOrders, useCancelOrder, useOrder } from '@/hooks/useOrders'
import { useAuthStore } from '@/store/authStore'
import Navbar from '@/components/Navbar'
import { OrderStatusLabel, OrderStatusColor, OrderStatus } from '@/types'
import { Package, ArrowLeft, Loader2, X, ChevronDown, MapPin, Phone } from 'lucide-react'
import { toast } from 'sonner'

function OrderDetail({ orderId }: { orderId: number }) {
    const { data: detail, isLoading } = useOrder(orderId)
    if (isLoading) return <div className="flex justify-center py-4"><Loader2 size={18} className="animate-spin text-emerald-400" /></div>
    return (
        <>
            <p className="text-xs text-white/40 font-medium uppercase tracking-wide mb-3">Ürünler</p>
            <div className="flex flex-col gap-2 mb-4">
                {(detail?.orderItems ?? []).map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                        <span className="text-white/60">{item.productName} × {item.quantity}</span>
                        <span className="text-white/40">{(item.unitPrice * item.quantity).toLocaleString('tr-TR')}₺</span>
                    </div>
                ))}
            </div>
            <div className="flex flex-col gap-2 pt-3 border-t border-white/10">
                <div className="flex items-center gap-2 text-sm text-white/40">
                    <MapPin size={14} />
                    <span>{detail?.shippingAddress || 'Adres bilgisi yok'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-white/40">
                    <Phone size={14} />
                    <span>{detail?.customerPhone || 'Telefon bilgisi yok'}</span>
                </div>
            </div>
        </>
    )
}

export default function OrdersPage() {
    const router = useRouter()
    const { isLoggedIn } = useAuthStore()
    const { data: orders, isLoading } = useOrders()
    const cancelOrder = useCancelOrder()
    const [mounted, setMounted] = useState(false)
    const [openId, setOpenId] = useState<number | null>(null)

    useEffect(() => { setMounted(true) }, [])

    useEffect(() => {
        if (mounted && !isLoggedIn()) router.push('/auth/login')
    }, [mounted, isLoggedIn, router])

    if (!mounted) return null
    if (!isLoggedIn()) return null

    const isCancellable = (status: any) => {
        const s = Number(status)
        return s === OrderStatus.Pending || s === OrderStatus.Processing
    }

    const handleCancel = (id: number) => {
        cancelOrder.mutate(id, {
            onSuccess: () => toast.success('Sipariş iptal edildi.'),
            onError: (err: any) => {
                const msg = err?.response?.data?.message ?? 'Sipariş iptal edilemedi.'
                toast.error(msg)
            },
        })
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a]">
            <Navbar />
            <main className="max-w-3xl mx-auto px-4 py-10">
                <button
                    onClick={() => router.push('/')}
                    className="flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors mb-8"
                >
                    <ArrowLeft size={16} />
                    Ana sayfa
                </button>

                <h1 className="text-2xl font-semibold mb-6 flex items-center gap-3">
                    <Package size={24} />
                    Siparişlerim
                </h1>

                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 size={32} className="animate-spin text-emerald-400" />
                    </div>
                ) : !orders?.length ? (
                    <div className="flex flex-col items-center justify-center py-20 text-white/30">
                        <Package size={48} className="mb-4" />
                        <p className="mb-4">Henüz siparişin yok.</p>
                        <button
                            onClick={() => router.push('/')}
                            className="px-4 py-2 rounded-lg bg-emerald-500 text-white text-sm hover:bg-emerald-400 transition-all"
                        >
                            Alışverişe başla
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {orders.map((order) => (
                            <div key={order.id} className="bg-white/[0.03] border border-white/10 rounded-xl overflow-hidden">
                                <div
                                    className="flex items-center justify-between p-5 cursor-pointer hover:bg-white/[0.02] transition-colors"
                                    onClick={() => setOpenId(openId === order.id ? null : order.id)}
                                >
                                    <div>
                                        <p className="text-sm font-medium">Sipariş #{order.id}</p>
                                        <p className="text-xs text-white/30 mt-0.5">
                                            {new Date(order.orderDate).toLocaleDateString('tr-TR', {
                                                day: 'numeric', month: 'long', year: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${OrderStatusColor[Number(order.status) as OrderStatus]}`}>
                                            {OrderStatusLabel[Number(order.status) as OrderStatus]}
                                        </span>
                                        <span className="font-semibold text-sm">{order.totalAmount.toLocaleString('tr-TR')}₺</span>
                                        <ChevronDown size={16} className={`text-white/30 transition-transform ${openId === order.id ? 'rotate-180' : ''}`} />
                                    </div>
                                </div>

                                {openId === order.id && (
                                    <div className="border-t border-white/10 p-5">
                                        <OrderDetail orderId={order.id} />
                                        <div className="border-t border-white/10 pt-4 mt-4 flex items-center justify-between">
                                            <span className="font-semibold">{order.totalAmount.toLocaleString('tr-TR')}₺</span>
                                            {isCancellable(order.status) && (
                                                <button
                                                    onClick={() => handleCancel(order.id)}
                                                    disabled={cancelOrder.isPending}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-red-400 border border-red-500/20 hover:bg-red-500/10 transition-all disabled:opacity-50"
                                                >
                                                    <X size={12} />
                                                    İptal et
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    )
}