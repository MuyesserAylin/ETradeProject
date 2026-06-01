"use client";

import { useRouter } from "next/navigation";
import { authService } from "../services/authService";
import { useEffect, useState } from "react";

export default function Navbar() {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [role, setRole] = useState<string | null>(null);
    const [fullName, setFullName] = useState<string | null>(null);

    useEffect(() => {
        setIsLoggedIn(authService.isLoggedIn());
        setRole(authService.getRole());
        setFullName(authService.getFullName());
    }, []);

    const handleLogout = () => {
        authService.logout();
        router.push("/");
        window.location.reload();
    };

    return (
        <nav className="bg-blue-600 text-white px-6 py-4 flex items-center justify-between">
            <a href="/" className="text-xl font-bold">ETrade</a>

            <div className="flex items-center gap-4">
                {isLoggedIn ? (
                    <>
                        <span className="text-sm">Merhaba, {fullName}</span>
                        {role === "Customer" && (
                            <>
                                <a href="/cart" className="hover:underline">Sepet</a>
                                <a href="/orders" className="hover:underline">Siparişlerim</a>
                            </>
                        )}
                        {role === "Admin" && (
                            <a href="/admin" className="hover:underline">Admin Panel</a>
                        )}
                        <button
                            onClick={handleLogout}
                            className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-100"
                        >
                            Çıkış
                        </button>
                    </>
                ) : (
                    <>
                        <a href="/login" className="hover:underline">Giriş Yap</a>
                        <a href="/register" className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-100">
                            Kayıt Ol
                        </a>
                    </>
                )}
            </div>
        </nav>
    );
}