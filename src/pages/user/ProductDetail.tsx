// src/pages/user/ProductDetail.tsx
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { productService } from "../../api/productService";
import { useAuth } from "../../hooks/useAuth";
import { getImageUrl } from "../../utils/image";
import axios from "axios";
import {
    ArrowLeft, ShoppingCart, Library,
    Monitor, Globe, Calendar, Gamepad2
} from "lucide-react";

const API_URL = "https://le-minh-thanh.onrender.com/api";

export default function ProductDetail() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { user, isLoggedIn } = useAuth();

    const { data: product, isLoading } = useQuery({
        queryKey: ["product-slug", slug],
        queryFn: () => productService.getBySlug(slug!).then(res => res.data),
        enabled: !!slug
    });

    const { data: ownership } = useQuery({
        queryKey: ["owned", user?.id, product?.id],
        queryFn: () => axios.get(`${API_URL}/library/check?userId=${user!.id}&productId=${product!.id}`)
            .then(r => r.data),
        enabled: !!user && !!product?.id
    });

    if (isLoading) return (
        <div className="min-h-screen bg-[#080b12] flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500" />
        </div>
    );

    if (!product) return (
        <div className="min-h-screen bg-[#080b12] flex items-center justify-center text-gray-400">
            ❌ Không tìm thấy sản phẩm
        </div>
    );

    const handleBuy = () => {
        if (!isLoggedIn) { navigate("/login"); return; }
        navigate(`/checkout/${product.id}`);
    };

    return (
        <div className="min-h-screen bg-[#080b12] text-gray-100" style={{ fontFamily: "'Syne', sans-serif" }}>
            <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />

            {/* NAVBAR */}
            <nav className="sticky top-0 z-50 bg-[#080b12]/80 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center justify-between">
                <button onClick={() => navigate("/")} className="flex items-center gap-2 text-gray-400 hover:text-white transition">
                    <ArrowLeft size={18} /> <span className="text-sm">Quay lại</span>
                </button>
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
                    <Gamepad2 size={20} className="text-blue-500" />
                    <span className="font-black tracking-tighter">MT<span className="text-blue-500">STORE</span></span>
                </div>
                {isLoggedIn ? (
                    <button onClick={() => navigate("/library")} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition">
                        <Library size={16} /> Thư viện
                    </button>
                ) : (
                    <button onClick={() => navigate("/login")} className="text-sm text-gray-400 hover:text-white transition">
                        Đăng nhập
                    </button>
                )}
            </nav>

            {/* HERO */}
            <div className="relative h-[420px] overflow-hidden">
                <img
                    src={getImageUrl(product.images?.[0]?.imageUrl)}
                    className="w-full h-full object-cover"
                    alt={product.name}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#080b12] via-[#080b12]/60 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#080b12]/80 to-transparent" />
            </div>

            <div className="max-w-6xl mx-auto px-6 -mt-32 relative z-10 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                    {/* LEFT */}
                    <div className="lg:col-span-2 space-y-8">
                        <div>
                            <div className="flex flex-wrap gap-2 mb-3">
                                {product.productCategories?.map((pc: any) => (
                                    <span key={pc.categoryId} className="text-xs bg-blue-600/20 text-blue-400 border border-blue-500/30 px-3 py-1 rounded-full">
                                        {pc.category?.name}
                                    </span>
                                ))}
                            </div>
                            <h1 className="text-5xl font-black leading-tight mb-2">{product.name}</h1>
                            <div className="flex items-center gap-4 text-sm text-gray-500" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                {product.developer && <span className="flex items-center gap-1"><Monitor size={14} /> {product.developer.name}</span>}
                                {product.publisher && <span className="flex items-center gap-1"><Globe size={14} /> {product.publisher.name}</span>}
                                {product.releaseDate && <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(product.releaseDate).toLocaleDateString("vi-VN")}</span>}
                            </div>
                        </div>

                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                            <h2 className="font-bold text-lg mb-3">Mô tả</h2>
                            <p className="text-gray-400 leading-relaxed whitespace-pre-line" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                {product.description || "Chưa có mô tả cho sản phẩm này."}
                            </p>
                        </div>

                        {(product.images?.length ?? 0) > 1 && (
                            <div>
                                <h2 className="font-bold text-lg mb-3">Ảnh chụp màn hình</h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {product.images?.slice(1).map((img: any) => (
                                        <img
                                            key={img.id}
                                            src={getImageUrl(img.imageUrl)}
                                            className="w-full aspect-video object-cover rounded-xl border border-white/10"
                                            alt=""
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {(product.versions?.length ?? 0) > 0 && (
                            <div>
                                <h2 className="font-bold text-lg mb-3">Phiên bản</h2>
                                <div className="space-y-2">
                                    {product.versions?.map((v: any) => (
                                        <div key={v.id} className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl p-4">
                                            <div>
                                                <p className="font-semibold">v{v.version}</p>
                                                <p className="text-xs text-gray-500" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                                    {v.changelog || "Không có changelog"}
                                                </p>
                                            </div>
                                            <span className="text-xs text-gray-600">
                                                {v.releaseDate ? new Date(v.releaseDate).toLocaleDateString("vi-VN") : ""}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* RIGHT — Purchase card */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 bg-[#0f1420] border border-white/10 rounded-3xl p-6 space-y-5">
                            <img
                                src={getImageUrl(product.images?.[0]?.imageUrl)}
                                className="w-full aspect-video object-cover rounded-2xl"
                                alt={product.name}
                            />

                            <div>
                                <p className="text-3xl font-black text-white">
                                    {product.price === 0 ? "Miễn phí" : `${product.price?.toLocaleString()}đ`}
                                </p>
                                {product.status === 2 && (
                                    <span className="text-xs text-yellow-400">Sắp ra mắt</span>
                                )}
                            </div>

                            {ownership?.owned ? (
                                <button
                                    onClick={() => navigate("/library")}
                                    className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white font-bold py-3.5 rounded-xl transition"
                                >
                                    <Library size={18} /> Đến thư viện của bạn
                                </button>
                            ) : product.status === 2 ? (
                                <button disabled className="w-full bg-white/10 text-gray-500 font-bold py-3.5 rounded-xl cursor-not-allowed">
                                    Chưa mở bán
                                </button>
                            ) : (
                                <button
                                    onClick={handleBuy}
                                    className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl transition"
                                >
                                    <ShoppingCart size={18} />
                                    {isLoggedIn ? "Mua ngay" : "Đăng nhập để mua"}
                                </button>
                            )}

                            <div className="border-t border-white/10 pt-4 space-y-2 text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                {product.developer && (
                                    <div className="flex justify-between text-gray-500">
                                        <span>Developer</span>
                                        <span className="text-gray-300">{product.developer.name}</span>
                                    </div>
                                )}
                                {product.publisher && (
                                    <div className="flex justify-between text-gray-500">
                                        <span>Publisher</span>
                                        <span className="text-gray-300">{product.publisher.name}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-gray-500">
                                    <span>Trạng thái</span>
                                    <span className={product.status === 1 ? "text-green-400" : "text-yellow-400"}>
                                        {product.status === 1 ? "Đang bán" : product.status === 2 ? "Sắp ra mắt" : "Ngừng bán"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}