'use client';

import { useState, useEffect } from 'react';
import ProductCard from './components/ProductCard'; // Senin klasör yapına göre güncellendi
import Navbar from './components/Navbar';       // Eklediğimiz şık üst menü

interface Category {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  categoryName: string;
}

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [sortBy, setSortBy] = useState<string>('default');

  // 1. Sayfa ilk açıldığında Kategorileri ve Tüm Ürünleri Getirir
  useEffect(() => {
    const initLoad = async () => {
      setIsLoading(true);
      try {
        // TODO: İleride burayı kendi API servislerine bağlayacaksın:
        // const categoriesData = await categoryService.getAll();
        // const productsData = await productService.getAll();

        const mockCategories = [
          { id: 1, name: "Elektronik" },
          { id: 2, name: "Giyim & Moda" },
          { id: 3, name: "Ev & Yaşam" },
          { id: 4, name: "Spor & Outdoor" }
        ];
        const mockProducts = [
          { id: 101, name: "Kablosuz Kulaklık", price: 2499, imageUrl: "", categoryName: "Elektronik" },
          { id: 102, name: "Oversize Tişört", price: 599, imageUrl: "", categoryName: "Giyim & Moda" },
          { id: 103, name: "Akıllı Saat v2", price: 4199, imageUrl: "", categoryName: "Elektronik" },
        ];

        setCategories(mockCategories);
        setProducts(mockProducts);
      } catch (error) {
        console.error("Veriler yüklenirken hata oluştu:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initLoad();
  }, []);

  // 2. Kategori seçildiğinde veya Sıralama değiştiğinde tetiklenen fonksiyon
  const handleFilterChange = async (categoryId: number | null, sortOption: string) => {
    setIsLoading(true);
    try {
      // TODO: Backend'deki filtreleme endpoint'ine istek atılacak:
      // const data = await productService.getFiltered(categoryId, sortOption);
      console.log(`Backend Metodu Tetiklendi -> Kategori ID: ${categoryId}, Sıralama: ${sortOption}`);
    } catch (error) {
      console.error("Filtreleme hatası:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategorySelect = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
    handleFilterChange(categoryId, sortBy);
  };

  const handleSortChange = (sortOption: string) => {
    setSortBy(sortOption);
    handleFilterChange(selectedCategory, sortOption);
  };

  return (
    <div className="min-h-screen bg-[#fcfcfd] text-gray-900">
      {/* ÜST MENÜ VE SEPET PANELİ */}
      <Navbar />

      {/* Üst Banner / Hero Alanı */}
      <div className="relative bg-gradient-to-r from-gray-900 to-indigo-950 text-white py-16 px-8 md:px-16 text-center md:text-left overflow-hidden mb-10">
        <div className="max-w-4xl relative z-10">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 bg-indigo-950/60 px-3 py-1.5 rounded-full border border-indigo-800">
            Yeni Sezon Keşfi
          </span>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mt-4 mb-3">
            Aradığın Her Şey <br /><span className="text-indigo-400">Tek Bir Tıkla</span> Kapında.
          </h1>
          <p className="text-gray-400 max-w-md text-sm md:text-base mb-6">
            Yenilenen katmanlı mimarimiz ve ultra hızlı ön yüzümüzle mükemmel alışveriş deneyimini yaşayın.
          </p>
        </div>
      </div>

      {/* Ana İçerik Alanı */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 pb-24 flex flex-col md:flex-row gap-8">

        {/* SOL MENÜ: Kategoriler */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="sticky top-24 bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-50">
              <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
              </svg>
              <h2 className="font-bold text-gray-800 tracking-tight">Kategoriler</h2>
            </div>

            <ul className="space-y-1">
              <li>
                <button
                  onClick={() => handleCategorySelect(null)}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-sm transition-all duration-200 font-medium ${selectedCategory === null
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-indigo-600'
                    }`}
                >
                  Tüm Ürünler
                </button>
              </li>

              {categories.map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => handleCategorySelect(cat.id)}
                    className={`w-full text-left px-4 py-2.5 rounded-xl text-sm transition-all duration-200 font-medium ${selectedCategory === cat.id
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-indigo-600'
                      }`}
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* SAĞ TARAF: Filtreleme Barı ve Ürün Listesi */}
        <main className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              <span>Toplam <strong className="text-gray-800">{products.length}</strong> ürün listeleniyor</span>
            </div>

            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="bg-gray-50 border border-gray-200 text-gray-700 text-xs rounded-xl px-3 py-2 outline-none focus:border-indigo-500 cursor-pointer transition-colors"
            >
              <option value="default">Sıralama Seçiniz</option>
              <option value="price-asc">Fiyata Göre Artan</option>
              <option value="price-desc">Fiyata Göre Azalan</option>
              <option value="newest">En Yeniler</option>
            </select>
          </div>

          {/* ÜRÜN GRID ALANI */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white border border-gray-100 rounded-2xl p-4 animate-pulse">
                  <div className="aspect-square w-full bg-gray-200 rounded-xl mb-4" />
                  <div className="h-3 bg-gray-200 rounded w-1/4 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4" />
                  <div className="h-8 bg-gray-200 rounded w-full" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>

      </div>
    </div>
  );
}