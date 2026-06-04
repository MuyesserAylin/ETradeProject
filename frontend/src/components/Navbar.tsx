'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { useCart } from '@/hooks/useCart'
import { ShoppingCart, User, LogOut, Package, Shield } from 'lucide-react'

export default function Navbar() {
    const { user, logout, isLoggedIn, isAdmin } = useAuthStore()
    const router = useRouter()
    const { data: cart } = useCart()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const cartCount = cart?.cartItems?.reduce((s, i) => s + i.quantity, 0) ?? 0

    const handleLogout = () => {
        logout()
        router.push('/')
    }

    if (!mounted) {
        return (
            <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/" className="text-xl font-semibold tracking-tight">
                        e<span className="text-emerald-400">trade</span>
                    </Link>
                </div>
            </nav>
        )
    }

    return (
        <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="text-xl font-semibold tracking-tight">
                    e<span className="text-emerald-400">trade</span>
                </Link>

                <div className="flex items-center gap-2">
                    {isLoggedIn() && !isAdmin() && (
                        <Link
                            href="/cart"
                            className="relative flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/5 transition-all"
                        >
                            <ShoppingCart size={18} />
                            <span>Sepet</span>
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                    )}

                    {isLoggedIn() && !isAdmin() && (
                        <Link
                            href="/orders"
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/5 transition-all"
                        >
                            <Package size={18} />
                            <span>Siparişlerim</span>
                        </Link>
                    )}

                    {isAdmin() && (
                        <Link
                            href="/admin"
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 transition-all"
                        >
                            <Shield size={18} />
                            <span>Admin Panel</span>
                        </Link>
                    )}

                    {isLoggedIn() ? (
                        <div className="flex items-center gap-2 ml-2">
                            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 text-sm">
                                <User size={16} className="text-white/50" />
                                <span className="text-white/80">{user?.fullName}</span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white/50 hover:text-red-400 hover:bg-red-500/10 transition-all"
                            >
                                <LogOut size={16} />
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 ml-2">
                            <Link
                                href="/auth/login"
                                className="px-4 py-2 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/5 transition-all"
                            >
                                Giriş yap
                            </Link>
                            <Link
                                href="/auth/register"
                                className="px-4 py-2 rounded-lg text-sm bg-emerald-500 hover:bg-emerald-400 text-white font-medium transition-all"
                            >
                                Kayıt ol
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    )
}