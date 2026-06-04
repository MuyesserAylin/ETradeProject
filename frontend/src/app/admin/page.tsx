'use client'

import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { useAllOrders } from '@/hooks/useOrders'
import { useProducts } from '@/hooks/useProducts'
import { useCategories } from '@/hooks/useCategories'
import Navbar from '@/components/Navbar'
import { Package, ShoppingBag, Tag, Clock, Loader2 } from 'lucide-react'
import { OrderStatusLabel, OrderStatusColor } from '@/types'

export default function AdminPage() {
    const router = useRouter()
    const { isLoggedIn, isAdmin } = useAuthStore()

    const { data: orders, isLoading: ordersLoading } = useAllOrders()
    const { data: products } = useProducts()
    const { data: categories } = useCategories()

    if (!isLoggedIn() || !isAdmin()) {
        router.push('/')
        return null
    }

    const pendingOrders = orders?.filter((o) => o.status === 0) ?? []

    return (
        <div className="min-h-screen bg-[#0a0a0a]">
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 py-10">
                <h1 className="text-2xl font-semibold mb-8">Admin Panel</h1>

                {/* İstatistikler */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                    {[
                        { label: 'Toplam Ürün', value: products?.length ?? 0, icon: Package, color: 'text-blue-400' },
                        { label: 'Kategori', value: categories?.length ?? 0, icon: Tag, color: 'text-purple-400' },
                        { label: 'Toplam Sipariş', value: orders?.length ?? 0, icon: ShoppingBag, color: 'text-emerald-400' },
                        { label: 'Bekleyen', value: pendingOrders.length, icon: Clock, color: 'text-yellow-400' },
                    ].map((stat) => (
                        <div key={stat.label} className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xs text-white/40">{stat.label}</span>
                                <stat.icon size={16} className={stat.color} />
                            </div>
                            <p className="text-3xl font-semibold">{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* Hızlı erişim */}
                <div className="grid md:grid-cols-3 gap-4 mb-10">
                    <button
                        onClick={() => router.push('/admin/products')}
                        className="bg-white/[0.03] border border-white/10 rounded-xl p-6 text-left hover:border-white/20 transition-all group"
                    >
                        <Package size={24} className="text-blue-400 mb-3" />
                        <h3 className="font-medium mb-1">Ürün Yönetimi</h3>
                        <p className="text-xs text-white/30">Ürün ekle, düzenle, sil</p>
                    </button>
                    <button
                        onClick={() => router.push('/admin/categories')}
                        className="bg-white/[0.03] border border-white/10 rounded-xl p-6 text-left hover:border-white/20 transition-all group"
                    >
                        <Tag size={24} className="text-purple-400 mb-3" />
                        <h3 className="font-medium mb-1">Kategori Yönetimi</h3>
                        <p className="text-xs text-white/30">Kategori ekle, düzenle, sil</p>
                    </button>
                    <button
                        onClick={() => router.push('/admin/orders')}
                        className="bg-white/[0.03] border border-white/10 rounded-xl p-6 text-left hover:border-white/20 transition-all group"
                    >
                        <ShoppingBag size={24} className="text-emerald-400 mb-3" />
                        <h3 className="font-medium mb-1">Sipariş Yönetimi</h3>
                        <p className="text-xs text-white/30">Tüm siparişleri görüntüle, durum güncelle</p>
                    </button>
                </div>

                {/* Son siparişler */}
                <div>
                    <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wide mb-4">Son Siparişler</h2>
                    {ordersLoading ? (
                        <div className="flex items-center justify-center py-10">
                            <Loader2 size={24} className="animate-spin text-emerald-400" />
                        </div>
                    ) : (
                        <div className="bg-white/[0.03] border border-white/10 rounded-xl overflow-hidden">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-white/10">
                                        <th className="text-left px-4 py-3 text-white/40 font-medium">Sipariş</th>
                                        <th className="text-left px-4 py-3 text-white/40 font-medium">Müşteri</th>
                                        <th className="text-left px-4 py-3 text-white/40 font-medium">Tarih</th>
                                        <th className="text-left px-4 py-3 text-white/40 font-medium">Tutar</th>
                                        <th className="text-left px-4 py-3 text-white/40 font-medium">Durum</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders?.slice(0, 10).map((order) => (
                                        <tr key={order.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                            <td className="px-4 py-3 font-medium">#{order.id}</td>
                                            <td className="px-4 py-3 text-white/60">{order.customerFullName}</td>
                                            <td className="px-4 py-3 text-white/40">
                                                {new Date(order.orderDate).toLocaleDateString('tr-TR')}
                                            </td>
                                            <td className="px-4 py-3">{order.totalAmount.toLocaleString('tr-TR')}₺</td>
                                            <td className="px-4 py-3">
                                                <span className={`text-xs px-2 py-0.5 rounded-full border ${OrderStatusColor[order.status]}`}>
                                                    {OrderStatusLabel[order.status]}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}