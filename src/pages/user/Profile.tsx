import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import Navbar from "../../components/Navbar";
import { User, Mail, Phone, Globe, Save, Loader2, Library, ShoppingBag, Calendar, Shield } from "lucide-react";

const API_URL = "https://le-minh-thanh.onrender.com/api";

export default function Profile() {
    const navigate = useNavigate();
    const { user, isLoggedIn } = useAuth();
    const [form, setForm] = useState({ username: "", email: "", phone: "", country: "" });
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!isLoggedIn) { navigate("/login"); return; }
        setForm({
            username: user.username ?? "",
            email: user.email ?? "",
            phone: user.phone ?? "",
            country: user.country ?? ""
        });
    }, [user, isLoggedIn]);

    const { data: library } = useQuery({
        queryKey: ["library", user?.id],
        queryFn: () => axios.get(`${API_URL}/library/user/${user.id}`).then(r => r.data),
        enabled: !!user
    });

    const { data: orders } = useQuery({
        queryKey: ["user-orders", user?.id],
        queryFn: () => axios.get(`${API_URL}/orders/user/${user.id}`).then(r => r.data),
        enabled: !!user
    });

    const mutation = useMutation({
        mutationFn: () => axios.put(`${API_URL}/users/${user.id}`, {
            username: form.username,
            email: form.email,
            phone: form.phone || null,
            country: form.country,
            avatar: user.avatar,
            status: user.status
        }),
        onSuccess: (res) => {
            localStorage.setItem("user", JSON.stringify(res.data));
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        },
        onError: () => setError("Cập nhật thất bại, vui lòng thử lại")
    });

    const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

    const totalSpent = orders
        ?.filter((o: any) => o.paymentStatus === 'paid')
        .reduce((sum: number, o: any) => sum + o.totalPrice, 0) ?? 0;

    return (
        <div className="min-h-screen bg-[#060910] text-gray-100" style={{ fontFamily: "'Syne', sans-serif" }}>
            <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />
            <Navbar showSearch={false} />

            <div className="max-w-5xl mx-auto px-6 py-12">
                {/* Header */}
                <div className="flex items-center gap-6 mb-12">
                    <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-4xl font-black shadow-2xl shadow-blue-500/20">
                        {user?.username?.[0]?.toUpperCase()}
                    </div>
                    <div>
                        <h1 className="text-4xl font-black">{user?.username}</h1>
                        <p className="text-gray-500 text-sm mt-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                            {user?.email}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                            <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${user?.status === 1 ? 'bg-green-500/15 text-green-400 border border-green-500/20' : 'bg-red-500/15 text-red-400'}`}>
                                {user?.status === 1 ? '● Hoạt động' : '● Bị khoá'}
                            </span>
                            {user?.country && (
                                <span className="text-xs text-gray-600 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
                                    {user.country}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-10">
                    {[
                        { icon: Library, label: 'Game sở hữu', value: library?.length ?? 0, color: 'text-blue-400 bg-blue-500/10' },
                        { icon: ShoppingBag, label: 'Đơn hàng', value: orders?.length ?? 0, color: 'text-purple-400 bg-purple-500/10' },
                        { icon: ShoppingBag, label: 'Đã chi', value: totalSpent.toLocaleString() + 'đ', color: 'text-green-400 bg-green-500/10' },
                    ].map(s => (
                        <div key={s.label} className="bg-white/5 border border-white/8 rounded-2xl p-5 flex items-center gap-4">
                            <div className={`p-3 rounded-xl ${s.color}`}>
                                <s.icon size={18} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 mb-0.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>{s.label}</p>
                                <p className="text-xl font-black">{s.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Edit form */}
                    <div className="bg-white/5 border border-white/8 rounded-3xl p-8">
                        <h2 className="text-xl font-black mb-6 flex items-center gap-2">
                            <Shield size={18} className="text-blue-400" /> Thông tin cá nhân
                        </h2>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl mb-5 text-sm">
                                {error}
                            </div>
                        )}
                        {saved && (
                            <div className="bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3 rounded-xl mb-5 text-sm flex items-center gap-2">
                                ✓ Đã cập nhật thành công
                            </div>
                        )}

                        <div className="space-y-4">
                            {[
                                { key: 'username', label: 'Tên đăng nhập', icon: User, placeholder: 'username' },
                                { key: 'email', label: 'Email', icon: Mail, placeholder: 'email@example.com' },
                                { key: 'phone', label: 'Số điện thoại', icon: Phone, placeholder: '0123456789' },
                                { key: 'country', label: 'Quốc gia', icon: Globe, placeholder: 'VN' },
                            ].map(f => (
                                <div key={f.key} className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">{f.label}</label>
                                    <div className="relative">
                                        <f.icon size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600" />
                                        <input
                                            placeholder={f.placeholder}
                                            className="w-full bg-white/5 border border-white/10 text-gray-200 placeholder-gray-700 pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition text-sm"
                                            style={{ fontFamily: "'DM Sans', sans-serif" }}
                                            value={(form as any)[f.key]}
                                            onChange={e => set(f.key, e.target.value)}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => mutation.mutate()}
                            disabled={mutation.isPending}
                            className="w-full mt-6 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white font-black py-3 rounded-xl transition"
                        >
                            {mutation.isPending ? <><Loader2 size={16} className="animate-spin" /> Đang lưu...</> : <><Save size={16} /> Lưu thay đổi</>}
                        </button>
                    </div>

                    {/* Recent orders */}
                    <div className="bg-white/5 border border-white/8 rounded-3xl p-8">
                        <h2 className="text-xl font-black mb-6 flex items-center gap-2">
                            <ShoppingBag size={18} className="text-purple-400" /> Đơn hàng gần đây
                        </h2>
                        {!orders || orders.length === 0 ? (
                            <div className="text-center py-10 text-gray-700">
                                <ShoppingBag size={32} className="mx-auto mb-3 opacity-30" />
                                <p className="text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>Chưa có đơn hàng nào</p>
                                <button onClick={() => navigate('/store')}
                                    className="mt-3 text-blue-400 hover:text-blue-300 text-sm transition">
                                    Mua sắm ngay →
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {orders.slice(0, 5).map((order: any) => (
                                    <div key={order.id} className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-3 border border-white/5">
                                        <div>
                                            <p className="text-sm font-semibold">Đơn #{order.id}</p>
                                            <p className="text-xs text-gray-600 flex items-center gap-1 mt-0.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                                <Calendar size={10} /> {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-black text-blue-400">{order.totalPrice?.toLocaleString()}đ</p>
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${order.paymentStatus === 'paid' ? 'bg-green-500/15 text-green-400' : 'bg-yellow-500/15 text-yellow-400'}`}>
                                                {order.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chờ TT'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                                <button onClick={() => navigate('/library')}
                                    className="w-full text-center text-sm text-gray-600 hover:text-gray-400 transition pt-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                    Xem thư viện →
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}