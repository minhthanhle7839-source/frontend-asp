import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Eye, EyeOff, Gamepad2, User, Mail, Phone, Globe, Check } from "lucide-react";
import axios from "axios";

const API_URL = "https://le-minh-thanh.onrender.com/api";

export default function Register() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        username: "", password: "", confirmPassword: "",
        email: "", phone: "", country: "VN"
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

    const passwordStrength = () => {
        const p = form.password;
        if (!p) return 0;
        let score = 0;
        if (p.length >= 8) score++;
        if (/[A-Z]/.test(p)) score++;
        if (/[0-9]/.test(p)) score++;
        if (/[^A-Za-z0-9]/.test(p)) score++;
        return score;
    };

    const strengthLabel = ['', 'Yếu', 'Trung bình', 'Tốt', 'Mạnh'];
    const strengthColor = ['', 'bg-red-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];
    const strength = passwordStrength();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        if (!form.username.trim()) { setError("Vui lòng nhập tên đăng nhập"); return; }
        if (!form.email.trim()) { setError("Vui lòng nhập email"); return; }
        if (form.password.length < 6) { setError("Mật khẩu ít nhất 6 ký tự"); return; }
        if (form.password !== form.confirmPassword) { setError("Mật khẩu xác nhận không khớp"); return; }

        setLoading(true);
        try {
            await axios.post(`${API_URL}/users`, {
                username: form.username.trim(),
                password: form.password,
                email: form.email.trim(),
                phone: form.phone.trim() || null,
                country: form.country,
                status: 1
            });
            navigate("/login");
        } catch (err: any) {
            const msg = err.response?.data;
            setError(typeof msg === "string" ? msg : "Đăng ký thất bại, vui lòng thử lại");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#080b12] flex" style={{ fontFamily: "'Syne', sans-serif" }}>
            <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />

            {/* Left panel — decorative */}
            <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-[#080b12] to-purple-900/30" />
                <div className="absolute inset-0 opacity-10"
                    style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
                <div className="absolute top-1/4 -left-20 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-0 w-60 h-60 bg-purple-600/15 rounded-full blur-3xl" />

                <div className="relative flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
                    <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-600/30">
                        <Gamepad2 size={22} className="text-white" />
                    </div>
                    <span className="text-2xl font-black tracking-tighter text-white">MT<span className="text-blue-500">STORE</span></span>
                </div>

                <div className="relative space-y-6">
                    <h2 className="text-5xl font-black text-white leading-tight">
                        Tham gia<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                            cộng đồng
                        </span><br />
                        game thủ
                    </h2>
                    <p className="text-gray-500 leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        Hàng nghìn trò chơi chờ bạn khám phá. Tạo tài khoản miễn phí và bắt đầu ngay hôm nay.
                    </p>
                    <div className="flex flex-col gap-3">
                        {['Truy cập thư viện game cá nhân', 'Tải xuống mọi lúc mọi nơi', 'License key độc quyền'].map(f => (
                            <div key={f} className="flex items-center gap-3">
                                <div className="w-5 h-5 rounded-full bg-blue-600/20 border border-blue-500/40 flex items-center justify-center shrink-0">
                                    <Check size={11} className="text-blue-400" />
                                </div>
                                <span className="text-gray-400 text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>{f}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <p className="relative text-gray-700 text-xs" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    © 2026 MT Store. All rights reserved.
                </p>
            </div>

            {/* Right panel — form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
                <div className="w-full max-w-md">
                    {/* Mobile logo */}
                    <div className="flex items-center gap-2 mb-8 lg:hidden cursor-pointer" onClick={() => navigate("/")}>
                        <div className="bg-blue-600 p-1.5 rounded-lg">
                            <Gamepad2 size={18} className="text-white" />
                        </div>
                        <span className="text-xl font-black tracking-tighter">MT<span className="text-blue-500">STORE</span></span>
                    </div>

                    <h1 className="text-3xl font-black text-white mb-1">Tạo tài khoản</h1>
                    <p className="text-gray-600 text-sm mb-8" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        Đã có tài khoản?{" "}
                        <button onClick={() => navigate("/login")} className="text-blue-400 hover:text-blue-300 font-medium transition">
                            Đăng nhập
                        </button>
                    </p>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Username */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-gray-400">Tên đăng nhập *</label>
                            <div className="relative">
                                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600" />
                                <input
                                    placeholder="username"
                                    className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-700 pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/30 transition text-sm"
                                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                                    value={form.username}
                                    onChange={e => set("username", e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-gray-400">Email *</label>
                            <div className="relative">
                                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600" />
                                <input
                                    type="email"
                                    placeholder="email@example.com"
                                    className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-700 pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/30 transition text-sm"
                                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                                    value={form.email}
                                    onChange={e => set("email", e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Phone + Country */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-gray-400">Số điện thoại</label>
                                <div className="relative">
                                    <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600" />
                                    <input
                                        placeholder="0123456789"
                                        className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-700 pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition text-sm"
                                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                                        value={form.phone}
                                        onChange={e => set("phone", e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-gray-400">Quốc gia</label>
                                <div className="relative">
                                    <Globe size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600" />
                                    <select
                                        className="w-full bg-white/5 border border-white/10 text-gray-300 pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition text-sm appearance-none cursor-pointer"
                                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                                        value={form.country}
                                        onChange={e => set("country", e.target.value)}
                                    >
                                        <option value="VN">🇻🇳 Việt Nam</option>
                                        <option value="US">🇺🇸 USA</option>
                                        <option value="JP">🇯🇵 Japan</option>
                                        <option value="KR">🇰🇷 Korea</option>
                                        <option value="SG">🇸🇬 Singapore</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-gray-400">Mật khẩu *</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Ít nhất 6 ký tự"
                                    className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-700 px-4 py-3 pr-12 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition text-sm"
                                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                                    value={form.password}
                                    onChange={e => set("password", e.target.value)}
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-300 transition">
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            {form.password && (
                                <div className="space-y-1.5">
                                    <div className="flex gap-1">
                                        {Array.from({ length: 4 }).map((_, i) => (
                                            <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i < strength ? strengthColor[strength] : 'bg-white/10'}`} />
                                        ))}
                                    </div>
                                    <p className="text-xs text-gray-600" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                        Độ mạnh: <span className={strength >= 3 ? 'text-green-400' : strength >= 2 ? 'text-blue-400' : 'text-red-400'}>{strengthLabel[strength]}</span>
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-gray-400">Xác nhận mật khẩu *</label>
                            <div className="relative">
                                <input
                                    type="password"
                                    placeholder="Nhập lại mật khẩu"
                                    className={`w-full bg-white/5 border text-white placeholder-gray-700 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 transition text-sm ${form.confirmPassword && form.password !== form.confirmPassword
                                            ? 'border-red-500/50 focus:ring-red-500/30'
                                            : form.confirmPassword && form.password === form.confirmPassword
                                                ? 'border-green-500/50 focus:ring-green-500/30'
                                                : 'border-white/10 focus:ring-blue-500/40'
                                        }`}
                                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                                    value={form.confirmPassword}
                                    onChange={e => set("confirmPassword", e.target.value)}
                                />
                                {form.confirmPassword && form.password === form.confirmPassword && (
                                    <Check size={15} className="absolute right-4 top-1/2 -translate-y-1/2 text-green-400" />
                                )}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white font-black py-3.5 rounded-xl transition shadow-lg shadow-blue-600/20 mt-2"
                        >
                            {loading ? <><Loader2 size={17} className="animate-spin" /> Đang tạo tài khoản...</> : 'Tạo tài khoản'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}