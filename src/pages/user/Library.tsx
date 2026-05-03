import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../hooks/useAuth";
import { getImageUrl } from "../../utils/image";
import axios from "axios";
import { Download, Library as LibraryIcon, Gamepad2, LogOut, ArrowLeft, Package } from "lucide-react";

const API_URL = "https://le-minh-thanh.onrender.com/api";

export default function Library() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const { data: library, isLoading } = useQuery({
        queryKey: ["library", user?.id],
        queryFn: () => axios.get(`${API_URL}/library/user/${user.id}`).then(r => r.data),
        enabled: !!user
    });

    const handleDownload = (fileUrl: string) => {
        window.open(fileUrl, "_blank");
    };
    if (!user) {
        navigate("/login");
        return null;
    }

    return (
        <div className="min-h-screen bg-[#080b12] text-gray-100" style={{ fontFamily: "'Syne', sans-serif" }}>
            <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />

            {/* NAV */}
            <nav className="sticky top-0 z-50 bg-[#080b12]/80 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center justify-between">
                <button onClick={() => navigate("/")} className="flex items-center gap-2 text-gray-400 hover:text-white transition text-sm">
                    <ArrowLeft size={16} /> Cửa hàng
                </button>
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
                    <Gamepad2 size={20} className="text-blue-500" />
                    <span className="font-black tracking-tighter">MT<span className="text-blue-500">STORE</span></span>
                </div>
                <button onClick={logout} className="flex items-center gap-2 text-sm text-gray-400 hover:text-red-400 transition">
                    <LogOut size={16} /> Đăng xuất
                </button>
            </nav>

            <div className="max-w-6xl mx-auto px-6 py-12">
                {/* Header */}
                <div className="flex items-end justify-between mb-10">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center font-black text-lg">
                                {user.username?.[0]?.toUpperCase()}
                            </div>
                            <div>
                                <p className="text-sm text-gray-500" style={{ fontFamily: "'DM Sans', sans-serif" }}>Xin chào,</p>
                                <p className="font-black text-xl">{user.username}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 mt-4">
                            <LibraryIcon size={22} className="text-blue-500" />
                            <h1 className="text-3xl font-black">Thư viện của tôi</h1>
                        </div>
                        <p className="text-gray-500 text-sm mt-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                            {library?.length || 0} trò chơi
                        </p>
                    </div>
                </div>

                {/* Loading */}
                {isLoading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="animate-pulse bg-white/5 rounded-3xl h-64" />
                        ))}
                    </div>
                )}

                {/* Empty */}
                {!isLoading && library?.length === 0 && (
                    <div className="text-center py-32">
                        <Package size={64} className="mx-auto mb-4 text-gray-700" />
                        <h2 className="text-2xl font-bold text-gray-600 mb-2">Thư viện trống</h2>
                        <p className="text-gray-600 mb-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                            Bạn chưa sở hữu trò chơi nào
                        </p>
                        <button
                            onClick={() => navigate("/")}
                            className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-3 rounded-xl transition"
                        >
                            Khám phá cửa hàng
                        </button>
                    </div>
                )}

                {/* Game grid */}
                {!isLoading && library?.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {library.map((item: any) => {
                            const product = item.product;
                            const versions = product?.versions || [];
                            return (
                                <div key={item.id} className="group bg-[#0f1420] border border-white/10 rounded-3xl overflow-hidden hover:border-blue-500/40 transition-all hover:shadow-2xl hover:shadow-blue-500/5">
                                    {/* Thumbnail */}
                                    <div className="relative aspect-video overflow-hidden">
                                        <img
                                            src={getImageUrl(product?.images?.[0]?.imageUrl)}
                                            className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                                            alt={product?.name}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#0f1420] via-transparent to-transparent" />
                                        <div className="absolute top-3 right-3 bg-green-500/20 border border-green-500/40 text-green-400 text-xs font-bold px-2 py-1 rounded-full">
                                            ✓ Đã sở hữu
                                        </div>
                                    </div>

                                    <div className="p-5 space-y-4">
                                        <div>
                                            <h3 className="font-black text-lg">{product?.name}</h3>
                                            <p className="text-xs text-gray-500 mt-0.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                                {product?.developer?.name}
                                            </p>
                                        </div>

                                        {/* License key */}
                                        {item.licenseKey && (
                                            <div className="bg-white/5 rounded-xl px-3 py-2">
                                                <p className="text-[10px] text-gray-500 mb-1">License Key</p>
                                                <p className="font-mono text-xs text-blue-400 tracking-widest">{item.licenseKey}</p>
                                            </div>
                                        )}

                                        {/* Download versions */}
                                        {versions.length > 0 ? (
                                            <div className="space-y-2">
                                                {versions.map((v: any) => (
                                                    <button
                                                        key={v.id}
                                                        onClick={() => handleDownload(v.fileUrl)}
                                                        className="w-full flex items-center justify-between bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/20 hover:border-blue-500/40 rounded-xl px-4 py-2.5 transition group/btn"
                                                    >
                                                        <div className="text-left">
                                                            <p className="text-sm font-semibold text-blue-300">v{v.version}</p>
                                                            {v.fileSize && (
                                                                <p className="text-xs text-gray-500" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                                                    {(v.fileSize / 1024 / 1024).toFixed(1)} MB
                                                                </p>
                                                            )}
                                                        </div>
                                                        <Download size={16} className="text-blue-400 group-hover/btn:translate-y-0.5 transition-transform" />
                                                    </button>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-xs text-gray-600 text-center py-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                                Chưa có file tải về
                                            </p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}