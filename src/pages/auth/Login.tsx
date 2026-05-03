// src/pages/auth/Login.tsx
"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Eye, EyeOff, Gamepad2 } from "lucide-react";
import axios from "axios";

const API_URL = "https://le-minh-thanh.onrender.com/api";

export default function Login() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ username: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!form.username.trim()) { setError("Vui lòng nhập tên đăng nhập"); return; }
        if (!form.password.trim()) { setError("Vui lòng nhập mật khẩu"); return; }

        setLoading(true);
        try {
            // Lấy user theo username rồi check password
            const res = await axios.get(`${API_URL}/users`);
            const users = res.data;
            const user = users.find(
                (u: any) => u.username === form.username && u.password === form.password
            );

            if (!user) {
                setError("Tên đăng nhập hoặc mật khẩu không đúng");
                return;
            }

            if (user.status === 0) {
                setError("Tài khoản của bạn đã bị khoá");
                return;
            }

            // Lưu user vào localStorage
            localStorage.setItem("user", JSON.stringify(user));
            navigate("/");
        } catch {
            setError("Có lỗi xảy ra, vui lòng thử lại");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
            {/* Background blur blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
            </div>

            <div className="relative w-full max-w-md">
                {/* Card */}
                <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl">

                    {/* Logo */}
                    <div className="flex flex-col items-center mb-8">
                        <div className="bg-blue-600 p-4 rounded-2xl mb-4 shadow-lg shadow-blue-600/30">
                            <Gamepad2 size={36} className="text-white" />
                        </div>
                        <h1 className="text-3xl font-black text-white tracking-tight">GameStore</h1>
                        <p className="text-slate-400 mt-1 text-sm">Đăng nhập để tiếp tục</p>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Username */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">
                                Tên đăng nhập
                            </label>
                            <input
                                type="text"
                                placeholder="Nhập tên đăng nhập"
                                autoComplete="username"
                                className="w-full bg-slate-700/50 border border-slate-600/50 text-white placeholder-slate-500 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition"
                                value={form.username}
                                onChange={e => setForm({ ...form, username: e.target.value })}
                            />
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">
                                Mật khẩu
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Nhập mật khẩu"
                                    autoComplete="current-password"
                                    className="w-full bg-slate-700/50 border border-slate-600/50 text-white placeholder-slate-500 px-4 py-3 pr-12 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition"
                                    value={form.password}
                                    onChange={e => setForm({ ...form, password: e.target.value })}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white font-bold py-3 rounded-xl transition shadow-lg shadow-blue-600/20 mt-2"
                        >
                            {loading && <Loader2 size={18} className="animate-spin" />}
                            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                        </button>
                    </form>

                    {/* Register */}
                    <p className="text-center text-slate-400 text-sm mt-6">
                        Chưa có tài khoản?{" "}
                        <button
                            onClick={() => navigate("/register")}
                            className="text-blue-400 hover:text-blue-300 font-medium transition"
                        >
                            Đăng ký ngay
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}