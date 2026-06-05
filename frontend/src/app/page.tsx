'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useProducts } from '@/hooks/useProducts'
import { useCategories } from '@/hooks/useCategories'
import { useAddToCart } from '@/hooks/useCart'
import { useAuthStore } from '@/store/authStore'
import Navbar from '@/components/Navbar'
import { ShoppingCart, Package, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export default function HomePage() {
  const router = useRouter()
  const { isLoggedIn, isAdmin } = useAuthStore()
  const [activeCat, setActiveCat] = useState<number | undefined>(undefined)

  const { data: categories, isLoading: catsLoading } = useCategories()
  const { data: products, isLoading: prodsLoading } = useProducts(activeCat)
  const addToCart = useAddToCart()

  const handleAddToCart = (productId: number, productName: string) => {
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
      { productId, quantity: 1 },
      {
        onSuccess: () => toast.success(`${productName} sepete eklendi!`),
        onError: () => toast.error('Bir hata oluştu.'),
      }
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-10">
        {/* Başlık */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight mb-2">Ürünleri Keşfet</h1>
          <p className="text-white/40 text-sm">Kategori seçerek filtreleyebilirsin</p>
        </div>

        {/* Kategoriler */}
        <div className="flex gap-2 flex-wrap mb-8">
          <button
            onClick={() => setActiveCat(undefined)}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${activeCat === undefined
              ? 'bg-emerald-500 border-emerald-500 text-white'
              : 'border-white/10 text-white/50 hover:text-white hover:border-white/30'
              }`}
          >
            Tümü
          </button>
          {catsLoading ? (
            <div className="flex items-center gap-2 text-white/30 text-sm">
              <Loader2 size={14} className="animate-spin" />
              Yükleniyor...
            </div>
          ) : (
            categories?.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCat(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${activeCat === cat.id
                  ? 'bg-emerald-500 border-emerald-500 text-white'
                  : 'border-white/10 text-white/50 hover:text-white hover:border-white/30'
                  }`}
              >
                {cat.name}
              </button>
            ))
          )}
        </div>

        {/* Ürünler */}
        {prodsLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={32} className="animate-spin text-emerald-400" />
          </div>
        ) : products?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-white/30">
            <Package size={48} className="mb-4" />
            <p>Bu kategoride ürün bulunamadı.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {products?.map((product) => (
              <div
                key={product.id}
                className="group bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all"
              >
                {/* Ürün görseli placeholder */}
                <div
                  className="h-44 bg-white/5 flex items-center justify-center cursor-pointer"
                  onClick={() => router.push(`/products/${product.id}`)}
                >
                  <Package size={40} className="text-white/10 group-hover:text-white/20 transition-all" />
                </div>

                <div className="p-4">
                  <p className="text-xs text-emerald-400 font-medium mb-1 uppercase tracking-wide">
                    {product.categoryName}
                  </p>
                  <h3
                    className="text-sm font-medium text-white mb-1 cursor-pointer hover:text-emerald-400 transition-colors line-clamp-2"
                    onClick={() => router.push(`/products/${product.id}`)}
                  >
                    {product.name}
                  </h3>
                  <p className="text-xs text-white/30 mb-3">
                    {product.stock > 0 ? `${product.stock} stokta` : 'Stokta yok'}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold">
                      {product.price.toLocaleString('tr-TR')}₺
                    </span>
                    <button
                      onClick={() => handleAddToCart(product.id, product.name)}
                      disabled={product.stock === 0 || addToCart.isPending}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ShoppingCart size={13} />
                      Ekle
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}