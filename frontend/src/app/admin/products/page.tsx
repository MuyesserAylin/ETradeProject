'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useProducts, useAddProduct, useUpdateProduct, useDeleteProduct } from '@/hooks/useProducts'
import { useCategories } from '@/hooks/useCategories'
import { useAuthStore } from '@/store/authStore'
import Navbar from '@/components/Navbar'
import { Plus, Pencil, Trash2, X, Loader2, ArrowLeft, Package } from 'lucide-react'
import { toast } from 'sonner'
import type { ProductCreateDto, ProductResponseDto } from '@/types'

const emptyForm: ProductCreateDto = { name: '', description: '', price: 0, stock: 0, categoryId: 0 }

export default function AdminProductsPage() {
    const router = useRouter()
    const { isLoggedIn, isAdmin } = useAuthStore()
    const { data: products, isLoading } = useProducts()
    const { data: categories } = useCategories()
    const addProduct = useAddProduct()
    const updateProduct = useUpdateProduct()
    const deleteProduct = useDeleteProduct()

    const [showModal, setShowModal] = useState(false)
    const [editing, setEditing] = useState<ProductResponseDto | null>(null)
    const [form, setForm] = useState<ProductCreateDto>(emptyForm)
    const [mounted, setMounted] = useState(false)

    useEffect(() => { setMounted(true) }, [])

    useEffect(() => {
        if (mounted && (!isLoggedIn() || !isAdmin())) router.push('/')
    }, [mounted, isLoggedIn, isAdmin, router])

    if (!mounted) return null
    if (!isLoggedIn() || !isAdmin()) return null

    const openAdd = () => {
        setEditing(null)
        setForm(emptyForm)
        setShowModal(true)
    }

    const openEdit = (p: ProductResponseDto) => {
        setEditing(p)
        setForm({ name: p.name, description: (p as any).description ?? '', price: p.price, stock: p.stock, categoryId: p.categoryId })
        setShowModal(true)
    }

    const handleSave = () => {
        if (!form.name || !form.categoryId || form.price <= 0) {
            toast.error('Lütfen tüm alanları doldur.')
            return
        }
        if (editing) {
            updateProduct.mutate(
                { id: editing.id, dto: form },
                {
                    onSuccess: () => { toast.success('Ürün güncellendi!'); setShowModal(false) },
                    onError: (err: any) => {
                        const msg = err?.response?.data?.message ?? 'Hata oluştu.'
                        toast.error(msg)
                    },
                }
            )
        } else {
            addProduct.mutate(form, {
                onSuccess: () => { toast.success('Ürün eklendi!'); setShowModal(false) },
                onError: (err: any) => {
                    const msg = err?.response?.data?.message ?? 'Hata oluştu.'
                    toast.error(msg)
                },
            })
        }
    }

    const handleDelete = (id: number, isDeleted: boolean) => {
        if (isDeleted) {
            toast.error('Bu ürün zaten silinmiş!')
            return
        }
        if (!confirm('Bu ürünü silmek istediğine emin misin?')) return
        deleteProduct.mutate(id, {
            onSuccess: () => toast.success('Ürün silindi.'),
            onError: () => toast.error('Hata oluştu.'),
        })
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

                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-semibold">Ürün Yönetimi</h1>
                    <button
                        onClick={openAdd}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-medium transition-all"
                    >
                        <Plus size={16} />
                        Ürün Ekle
                    </button>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 size={32} className="animate-spin text-emerald-400" />
                    </div>
                ) : (
                    <div className="bg-white/[0.03] border border-white/10 rounded-xl overflow-hidden">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="text-left px-4 py-3 text-white/40 font-medium">Ürün</th>
                                    <th className="text-left px-4 py-3 text-white/40 font-medium">Kategori</th>
                                    <th className="text-left px-4 py-3 text-white/40 font-medium">Fiyat</th>
                                    <th className="text-left px-4 py-3 text-white/40 font-medium">Stok</th>
                                    <th className="text-left px-4 py-3 text-white/40 font-medium">Durum</th>
                                    <th className="text-right px-4 py-3 text-white/40 font-medium">İşlem</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products?.map((p) => (
                                    <tr
                                        key={p.id}
                                        className={`border-b border-white/5 transition-colors ${p.isDeleted ? 'bg-red-500/5 opacity-60' : 'hover:bg-white/[0.02]'
                                            }`}
                                    >
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center">
                                                    <Package size={14} className="text-white/20" />
                                                </div>
                                                <span className={`font-medium ${p.isDeleted ? 'line-through text-white/30' : ''}`}>
                                                    {p.name}
                                                </span>
                                                {p.isDeleted && (
                                                    <span className="text-xs px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/20">
                                                        Silindi
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-white/40">{p.categoryName}</td>
                                        <td className="px-4 py-3">{p.price.toLocaleString('tr-TR')}₺</td>
                                        <td className="px-4 py-3">
                                            <span className={p.stock > 0 ? 'text-emerald-400' : 'text-red-400'}>
                                                {p.stock}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            {p.isDeleted ? (
                                                <span className="text-xs text-red-400">Pasif</span>
                                            ) : (
                                                <span className="text-xs text-emerald-400">Aktif</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-end gap-2">
                                                {!p.isDeleted && (
                                                    <button
                                                        onClick={() => openEdit(p)}
                                                        className="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/5 transition-all"
                                                    >
                                                        <Pencil size={14} />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDelete(p.id, p.isDeleted)}
                                                    disabled={p.isDeleted}
                                                    className="p-1.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-20 disabled:cursor-not-allowed"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>

            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
                    <div className="bg-[#111] border border-white/10 rounded-2xl p-6 w-full max-w-md">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="font-semibold">{editing ? 'Ürünü Düzenle' : 'Yeni Ürün'}</h2>
                            <button onClick={() => setShowModal(false)} className="text-white/30 hover:text-white transition-colors">
                                <X size={18} />
                            </button>
                        </div>
                        <div className="flex flex-col gap-3">
                            {[
                                { label: 'Ürün Adı', key: 'name', type: 'text', placeholder: 'Ürün adı' },
                                { label: 'Açıklama', key: 'description', type: 'text', placeholder: 'Açıklama' },
                                { label: 'Fiyat (₺)', key: 'price', type: 'number', placeholder: '0' },
                                { label: 'Stok', key: 'stock', type: 'number', placeholder: '0' },
                            ].map((field) => (
                                <div key={field.key} className="flex flex-col gap-1.5">
                                    <label className="text-xs text-white/50">{field.label}</label>
                                    <input
                                        type={field.type}
                                        value={form[field.key as keyof ProductCreateDto]}
                                        onChange={(e) => setForm({ ...form, [field.key]: field.type === 'number' ? Number(e.target.value) : e.target.value })}
                                        placeholder={field.placeholder}
                                        className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-emerald-500/50 transition-colors"
                                    />
                                </div>
                            ))}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs text-white/50">Kategori</label>
                                <select
                                    value={form.categoryId}
                                    onChange={(e) => setForm({ ...form, categoryId: Number(e.target.value) })}
                                    className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
                                >
                                    <option value={0} disabled>Kategori seç</option>
                                    {categories?.map((c) => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                            <button
                                onClick={handleSave}
                                disabled={addProduct.isPending || updateProduct.isPending}
                                className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-medium transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
                            >
                                {(addProduct.isPending || updateProduct.isPending) && <Loader2 size={14} className="animate-spin" />}
                                {editing ? 'Güncelle' : 'Ekle'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}