'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCategories, useAddCategory, useUpdateCategory, useDeleteCategory } from '@/hooks/useCategories'
import { useAuthStore } from '@/store/authStore'
import Navbar from '@/components/Navbar'
import { Plus, Pencil, Trash2, X, Loader2, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'

export default function AdminCategoriesPage() {
    const router = useRouter()
    const { isLoggedIn, isAdmin } = useAuthStore()
    const { data: categories, isLoading } = useCategories()
    const addCategory = useAddCategory()
    const updateCategory = useUpdateCategory()
    const deleteCategory = useDeleteCategory()

    const [showModal, setShowModal] = useState(false)
    const [editingId, setEditingId] = useState<number | null>(null)
    const [name, setName] = useState('')
    const [mounted, setMounted] = useState(false)

    useEffect(() => { setMounted(true) }, [])

    useEffect(() => {
        if (mounted && (!isLoggedIn() || !isAdmin())) router.push('/')
    }, [mounted, isLoggedIn, isAdmin, router])

    if (!mounted) return null
    if (!isLoggedIn() || !isAdmin()) return null

    const openAdd = () => {
        setEditingId(null)
        setName('')
        setShowModal(true)
    }

    const openEdit = (id: number, currentName: string) => {
        setEditingId(id)
        setName(currentName)
        setShowModal(true)
    }

    const handleSave = () => {
        if (!name.trim()) {
            toast.error('Kategori adı boş olamaz.')
            return
        }
        if (editingId) {
            updateCategory.mutate(
                { id: editingId, dto: { name } },
                {
                    onSuccess: () => { toast.success('Kategori güncellendi!'); setShowModal(false) },
                    onError: (err: any) => {
                        const msg = err?.response?.data?.message ?? 'Hata oluştu.'
                        toast.error(msg)
                    },
                }
            )
        } else {
            addCategory.mutate(
                { name },
                {
                    onSuccess: () => { toast.success('Kategori eklendi!'); setShowModal(false) },
                    onError: (err: any) => {
                        const msg = err?.response?.data?.message ?? 'Hata oluştu.'
                        toast.error(msg)
                    },
                }
            )
        }
    }

    const handleDelete = (id: number) => {
        if (!confirm('Bu kategoriyi silmek istediğine emin misin?')) return
        deleteCategory.mutate(id, {
            onSuccess: () => toast.success('Kategori silindi.'),
            onError: (err: any) => {
                console.log('HATA:', JSON.stringify(err?.response?.data))
                const msg = err?.response?.data?.message ??
                    err?.response?.data?.Message ??
                    err?.response?.data?.title ??
                    'Hata oluştu.'
                toast.error(msg)
            },
        })
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a]">
            <Navbar />
            <main className="max-w-3xl mx-auto px-4 py-10">
                <button
                    onClick={() => router.push('/admin')}
                    className="flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors mb-8"
                >
                    <ArrowLeft size={16} />
                    Admin Panel
                </button>

                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-semibold">Kategori Yönetimi</h1>
                    <button
                        onClick={openAdd}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-medium transition-all"
                    >
                        <Plus size={16} />
                        Kategori Ekle
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
                                    <th className="text-left px-4 py-3 text-white/40 font-medium">#</th>
                                    <th className="text-left px-4 py-3 text-white/40 font-medium">Kategori Adı</th>
                                    <th className="text-right px-4 py-3 text-white/40 font-medium">İşlem</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories?.map((c) => (
                                    <tr key={c.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                        <td className="px-4 py-3 text-white/30">{c.id}</td>
                                        <td className="px-4 py-3 font-medium">{c.name}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => openEdit(c.id, c.name)}
                                                    className="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/5 transition-all"
                                                >
                                                    <Pencil size={14} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(c.id)}
                                                    className="p-1.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-all"
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
                    <div className="bg-[#111] border border-white/10 rounded-2xl p-6 w-full max-w-sm">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="font-semibold">{editingId ? 'Kategoriyi Düzenle' : 'Yeni Kategori'}</h2>
                            <button onClick={() => setShowModal(false)} className="text-white/30 hover:text-white transition-colors">
                                <X size={18} />
                            </button>
                        </div>
                        <div className="flex flex-col gap-3">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs text-white/50">Kategori Adı</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Örn: Elektronik"
                                    className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-emerald-500/50 transition-colors"
                                />
                            </div>
                            <button
                                onClick={handleSave}
                                disabled={addCategory.isPending || updateCategory.isPending}
                                className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-medium transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
                            >
                                {(addCategory.isPending || updateCategory.isPending) && <Loader2 size={14} className="animate-spin" />}
                                {editingId ? 'Güncelle' : 'Ekle'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}