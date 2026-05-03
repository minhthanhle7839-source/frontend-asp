import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { productService } from "../../api/productService";
import { useAuth } from "../../hooks/useAuth";
import { getImageUrl } from "../../utils/image";
import { useState } from "react";
import axios from "axios";
import { ArrowLeft, CreditCard, Shield, Check, Loader2, Gamepad2 } from "lucide-react";

const API_URL = "https://le-minh-thanh.onrender.com/api";

export default function Checkout() {
    const { productId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [paymentMethod, setPaymentMethod] = useState("card");
    const [done, setDone] = useState(false);

    const { data: products } = useQuery({
        queryKey: ["client-products"],
        queryFn: () => productService.getAll().then(res => res.data)
    });

    // ✅ useMutation PHẢI ở đây — trước mọi conditional return
    const mutation = useMutation({
        mutationFn: async () => {
            const product = products?.find((p: any) => p.id === Number(productId));
            if (!product) throw new Error("Không tìm thấy sản phẩm");

            const orderRes = await axios.post(`${API_URL}/orders`, {
                userId: user!.id,
                productIds: [product.id]
            });
            const order = orderRes.data;
            await axios.post(`${API_URL}/payments`, {
                orderId: order.id,
                paymentMethod
            });
        },
        onSuccess: () => {
            setDone(true);
            setTimeout(() => navigate("/library"), 2500);
        }
    });

    // Guards SAU tất cả hooks
    if (!products) return (
        <div className="min-h-screen bg-[#080b12] flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500" />
        </div>
    );

    const product = products?.find((p: any) => p.id === Number(productId));

    if (!product) return (
        <div className="min-h-screen bg-[#080b12] flex items-center justify-center text-gray-400">
            Không tìm thấy sản phẩm
        </div>
    );
    return (
        <div className="min-h-screen bg-[#080b12] text-gray-100" style={{ fontFamily: "'Syne', sans-serif" }}>
            <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />

            {/* SUCCESS OVERLAY */}
            {done && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#080b12]">
                    <div className="text-center space-y-4">
                        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto animate-bounce">
                            <Check size={40} className="text-white" />
                        </div>
                        <h2 className="text-3xl font-black">Thanh toán thành công!</h2>
                        <p className="text-gray-400" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                            Đang chuyển đến thư viện của bạn...
                        </p>
                    </div>
                </div>
            )}

            {/* NAV */}
            <nav className="border-b border-white/5 px-6 py-4 flex items-center justify-between">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-white transition text-sm">
                    <ArrowLeft size={16} /> Quay lại
                </button>
                <div className="flex items-center gap-2" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
                    <Gamepad2 size={18} className="text-blue-500" />
                    <span className="font-black text-sm tracking-tighter">MT<span className="text-blue-500">STORE</span></span>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Shield size={14} className="text-green-400" /> Thanh toán bảo mật
                </div>
            </nav>

            <div className="max-w-4xl mx-auto px-6 py-12">
                <h1 className="text-3xl font-black mb-8">Xác nhận đơn hàng</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* LEFT — Payment method */}
                    <div className="space-y-6">
                        <div>
                            <h2 className="font-bold text-lg mb-4">Phương thức thanh toán</h2>
                            <div className="space-y-3">
                                {[
                                    { id: "card", label: "Thẻ tín dụng / ghi nợ", icon: "💳" },
                                    { id: "momo", label: "Ví MoMo", icon: "🟣" },
                                    { id: "banking", label: "Chuyển khoản ngân hàng", icon: "🏦" }
                                ].map(m => (
                                    <button
                                        key={m.id}
                                        onClick={() => setPaymentMethod(m.id)}
                                        className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition ${paymentMethod === m.id
                                            ? "border-blue-500 bg-blue-600/10"
                                            : "border-white/10 bg-white/5 hover:border-white/20"
                                            }`}
                                    >
                                        <span className="text-2xl">{m.icon}</span>
                                        <span className="font-semibold" style={{ fontFamily: "'DM Sans', sans-serif" }}>{m.label}</span>
                                        {paymentMethod === m.id && (
                                            <Check size={18} className="ml-auto text-blue-400" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Fake card form */}
                        {paymentMethod === "card" && (
                            <div className="space-y-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                <input
                                    placeholder="Số thẻ"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 placeholder-gray-600"
                                    maxLength={19}
                                />
                                <div className="grid grid-cols-2 gap-3">
                                    <input
                                        placeholder="MM/YY"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 placeholder-gray-600"
                                    />
                                    <input
                                        placeholder="CVV"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 placeholder-gray-600"
                                    />
                                </div>
                                <input
                                    placeholder="Tên chủ thẻ"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 placeholder-gray-600"
                                />
                            </div>
                        )}
                    </div>

                    {/* RIGHT — Order summary */}
                    <div>
                        <h2 className="font-bold text-lg mb-4">Tóm tắt đơn hàng</h2>
                        <div className="bg-[#0f1420] border border-white/10 rounded-3xl p-6 space-y-5">
                            <div className="flex gap-4">
                                <img
                                    src={getImageUrl(product.images?.[0]?.imageUrl)}
                                    className="w-20 h-20 object-cover rounded-xl"
                                    alt={product.name}
                                />
                                <div>
                                    <p className="font-bold">{product.name}</p>
                                    <p className="text-sm text-gray-500" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                        {product.developer?.name}
                                    </p>
                                </div>
                            </div>

                            <div className="border-t border-white/10 pt-4 space-y-2 text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                <div className="flex justify-between text-gray-400">
                                    <span>Giá gốc</span>
                                    <span>{product.price === 0 ? "Miễn phí" : `${product.price?.toLocaleString()}đ`}</span>
                                </div>
                                <div className="flex justify-between text-gray-400">
                                    <span>Phí giao dịch</span>
                                    <span>0đ</span>
                                </div>
                                <div className="flex justify-between font-black text-white text-lg pt-2 border-t border-white/10">
                                    <span>Tổng cộng</span>
                                    <span className="text-blue-400">
                                        {product.price === 0 ? "Miễn phí" : `${product.price?.toLocaleString()}đ`}
                                    </span>
                                </div>
                            </div>

                            {mutation.isError && (
                                <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm">
                                    {(mutation.error as any)?.response?.data || "Có lỗi xảy ra, vui lòng thử lại"}
                                </div>
                            )}

                            <button
                                onClick={() => mutation.mutate()}
                                disabled={mutation.isPending}
                                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white font-black py-4 rounded-2xl transition text-lg"
                            >
                                {mutation.isPending
                                    ? <><Loader2 size={20} className="animate-spin" /> Đang xử lý...</>
                                    : <><CreditCard size={20} /> Xác nhận thanh toán</>
                                }
                            </button>

                            <p className="text-center text-xs text-gray-600" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                🔒 Thông tin được mã hóa và bảo mật
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}