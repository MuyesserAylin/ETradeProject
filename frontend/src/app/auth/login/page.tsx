'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useLogin } from '@/hooks/useAuth'
import { Loader2, Mail, Lock } from 'lucide-react'
import { toast } from 'sonner'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const login = useLogin()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!email || !password) {
            toast.error('Lütfen tüm alanları doldur.')
            return
        }
        login.mutate(
            { email, password },
            { onError: () => toast.error('E-posta veya şifre hatalı!') }
        )
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
            <div className="w-full max-w-sm">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-semibold tracking-tight mb-2">
                        e<span className="text-emerald-400">trade</span>
                    </h1>
                    <p className="text-white/40 text-sm">Hesabına giriş yap</p>
                </div>

                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs text-white/50 font-medium">E-posta</label>
                            <div className="relative">
                                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="ornek@mail.com"
                                    className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-emerald-500/50 transition-colors"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs text-white/50 font-medium">Şifre</label>
                            <div className="relative">
                                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-emerald-500/50 transition-colors"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={login.isPending}
                            className="w-full py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-medium transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
                        >
                            {login.isPending && <Loader2 size={15} className="animate-spin" />}
                            Giriş yap
                        </button>
                    </form>
                </div>

                <p className="text-center text-sm text-white/30 mt-4">
                    Hesabın yok mu?{' '}
                    <Link href="/auth/register" className="text-emerald-400 hover:text-emerald-300 transition-colors">
                        Kayıt ol
                    </Link>
                </p>
            </div>
        </div>
    )
}