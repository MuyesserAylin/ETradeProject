'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAllOrders, useUpdateOrderStatus, useOrderDetail } from '@/hooks/useOrders'
import { useAuthStore } from '@/store/authStore'
import Navbar from '@/components/Navbar'
import { OrderStatusLabel, OrderStatusColor, OrderStatus } from '@/types'
import { ArrowLeft, Loader2, ChevronDown } from 'lucide-react'
import { toast } from 'sonner'

function OrderDetail({ orderId, currentStatus, onStatusChange, isPending }: {
    orderId: number
    currentStatus: OrderStatus
    onStatusChange: (status: OrderStatus) => void
    isPending: boolean
}) {
    const { data: detail, isLoading } = useOrderDetail(orderId)

    if (isLoading) return <div className="flex justify-center py-4"><Loader2 size={20} className="animate-spin text-emerald-400" /></div>

    const canChangeStatus = (newStatus: OrderStatus) => {
        if (currentStatus === OrderStatus.Cancelled) return false
        if (currentStatus === OrderStatus.Delivered) return false
        if (newStatus === OrderStatus.Cancelled) return false
        if (currentStatus === OrderStatus.Shipped && newStatus < OrderStatus.Shipped) return false
        if (currentStatus === OrderStatus.Processing && newStatus < OrderStatus.Processing) return false
        if (currentStatus === OrderStatus.Pending && newStatus < OrderStatus.Pending) return false
        return true
    }

    return (
        <div className="grid md:grid-cols-2 gap-6">
            <div>
                <p className="text-xs text-white/40 mb-3 font-medium uppercase tracking-wide">Ürünler</p>
                <div className="flex flex-col gap-2">
                    {(detail?.orderItems ?? []).map((item, i) => (
                        <div key={i} className="flex justify-between text-sm">
                            <span className="text-white/60">{item.productName} x{item.quantity}</span>
                            <span className="text-white/40">{(item.unitPrice * item.quantity).toLocaleString('tr-TR')}₺</span>
                        </div>
                    ))}
                </div>
                <div className="mt-3 pt-3 border-t border-white/10 text-sm flex flex-col gap-1">
                    <p className="text-white/40">📍 {detail?.shippingAddress || 'Adres bilgisi yok'}</p>
                    <p className="text-white/40">📞 {detail?.customerPhone || 'Telefon bilgisi yok'}</p>
                    <p className="text-white/40">✉️ {detail?.customerEmail || ''}</p>
                </div>
            </div>

            <div>
                <p className="text-xs text-white/40 mb-3 font-medium uppercase tracking-wide">Durum Güncelle</p>
                {currentStatus === OrderStatus.Cancelled ? (
                    <div className="text-sm text-red-400/60 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                        Bu sipariş iptal edilmiş, durum değiştirilemez.
                    </div>
                ) : currentStatus === OrderStatus.Delivered ? (
                    <div className="text-sm text-green-400/60 bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2">
                        Bu sipariş teslim edilmiş, durum değiştirilemez.
                    </div>
                ) : (
                    <div className="flex flex-col gap-2">
                        {Object.entries(OrderStatusLabel)
                            .filter(([key]) => canChangeStatus(Number(key) as OrderStatus))
                            .map(([key, label]) => (
                                <button
                                    key={key}
                                    onClick={() => onStatusChange(Number(key) as OrderStatus)}
                                    disabled={currentStatus === Number(key) || isPending}
                                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm border transition-all disabled:cursor-not-allowed ${currentStatus === Number(key)
                                            ? OrderStatusColor[Number(key) as OrderStatus]
                                            : 'border-white/10 text-white/40 hover:border-white/20 hover:text-white disabled:opacity-30'
                                        }`}
                                >
                                    <span>{label}</span>
                                    {currentStatus === Number(key) && <span className="text-xs">● Mevcut</span>}
                                </button>
                            ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default function AdminOrdersPage() {
    const router = useRouter()
    const { isLoggedIn, isAdmin } = useAuthStore()
    const { data: orders, isLoading } = useAllOrders()
    const updateStatus = useUpdateOrderStatus()
    const [openId, setOpenId] = useState<number | null>(null)
    const [mounted, setMounted] = useState(false)

    useEffect(() => { setMounted(true) }, [])

    useEffect(() => {
        if (mounted && (!isLoggedIn() || !isAdmin())) router.push('/')
    }, [mounted, isLoggedIn, isAdmin, router])

    if (!mounted) return null
    if (!isLoggedIn() || !isAdmin()) return null

    const handleStatusChange = (orderId: number, status: OrderStatus) => {
        updateStatus.mutate(
            { id: orderId, dto: { status } },
            {
                onSuccess: () => toast.success('Sipariş durumu güncellendi!'),
                onError: (err: any) => {
                    const msg = err?.response?.data?.message ?? 'Hata oluştu.'
                    toast.error(msg)
                },
            }
        )
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a]">
            <Navbar />
            <main className="max-w-6xl mx-auto px-4 py-10">
                <button
                    onClick={() => router.push('/admin')}
                    className="flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors mb-8"
                >
                    <ArrowLeft size={16} />
                    Admin Panel
                </button>

                <h1 className="text-2xl font-semibold mb-6">Sipariş Yönetimi</h1>

                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 size={32} className="animate-spin text-emerald-400" />
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {orders?.map((order) => (
                            <div key={order.id} className="bg-white/[0.03] border border-white/10 rounded-xl overflow-hidden">
                                <div
                                    className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-white/[0.02] transition-colors"
                                    onClick={() => setOpenId(openId === order.id ? null : order.id)}
                                >
                                    <div className="flex items-center gap-4">
                                        <span className="font-medium">#{order.id}</span>
                                        <span className="text-sm text-white/30">
                                            {new Date(order.orderDate).toLocaleDateString('tr-TR')}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="font-semibold text-sm">{order.totalAmount.toLocaleString('tr-TR')}₺</span>
                                        <span className={`text-xs px-2.5 py-1 rounded-full border ${OrderStatusColor[order.status]}`}>
                                            {OrderStatusLabel[order.status]}
                                        </span>
                                        <ChevronDown size={16} className={`text-white/30 transition-transform ${openId === order.id ? 'rotate-180' : ''}`} />
                                    </div>
                                </div>

                                {openId === order.id && (
                                    <div className="border-t border-white/10 px-5 py-4">
                                        <OrderDetail
                                            orderId={order.id}
                                            currentStatus={order.status}
                                            onStatusChange={(status) => handleStatusChange(order.id, status)}
                                            isPending={updateStatus.isPending}
                                        />
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