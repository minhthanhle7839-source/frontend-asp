import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { productService } from '../../api/productService';
import { categoryService } from '../../api/categoryService';
import { getImageUrl } from '../../utils/image';
import Navbar from '../../components/Navbar';
import { ArrowRight, Zap, TrendingUp, Star, Gamepad2 } from 'lucide-react';

export default function Home() {
    const navigate = useNavigate();

    const { data: products, isLoading } = useQuery({
        queryKey: ['client-products'],
        queryFn: () => productService.getAll().then(res => res.data)
    });

    const { data: categories } = useQuery({
        queryKey: ['categories'],
        queryFn: () => categoryService.getAll().then(res => res.data)
    });

    const featured = products?.[0];
    const recent = products?.slice(1, 7) ?? [];
    const free = products?.filter((p: any) => p.price === 0).slice(0, 4) ?? [];

    return (
        <div className="min-h-screen bg-[#060910] text-gray-100" style={{ fontFamily: "'Syne', sans-serif" }}>
            <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800;900&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap" rel="stylesheet" />

            <Navbar showSearch={false} />

            {/* ── HERO ── */}
            <section className="relative min-h-[92vh] flex flex-col justify-end overflow-hidden">
                {/* BG */}
                {featured && (
                    <>
                        <img
                            src={getImageUrl(featured.images?.[0]?.imageUrl)}
                            className="absolute inset-0 w-full h-full object-cover opacity-40"
                            alt=""
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#060910] via-[#060910]/70 to-[#060910]/20" />
                        <div className="absolute inset-0 bg-gradient-to-r from-[#060910]/90 via-transparent to-transparent" />
                    </>
                )}

                {/* Decorative grid */}
                <div className="absolute inset-0 opacity-5"
                    style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '80px 80px' }} />

                <div className="relative max-w-7xl mx-auto px-6 pb-20 pt-32">
                    <div className="max-w-3xl">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="flex items-center gap-1.5 bg-blue-600 text-white text-xs font-black px-3 py-1.5 rounded-full uppercase tracking-widest">
                                <Zap size={10} /> Nổi bật hôm nay
                            </span>
                            {featured?.developer && (
                                <span className="text-xs text-gray-500 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                                    {featured.developer.name}
                                </span>
                            )}
                        </div>

                        {isLoading ? (
                            <div className="space-y-4 animate-pulse">
                                <div className="h-16 bg-white/5 rounded-2xl w-3/4" />
                                <div className="h-6 bg-white/5 rounded-xl w-1/2" />
                            </div>
                        ) : (
                            <>
                                <h1 className="text-7xl font-black leading-[0.9] tracking-tighter mb-6 text-white">
                                    {featured?.name}
                                </h1>
                                <p className="text-gray-400 text-lg max-w-xl mb-10 leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                    {featured?.description?.slice(0, 120) || 'Khám phá trải nghiệm gaming đỉnh cao nhất cửa hàng.'}
                                </p>
                                <div className="flex items-center gap-4 flex-wrap">
                                    <button
                                        onClick={() => navigate(`/product/${featured?.slug}`)}
                                        className="flex items-center gap-3 bg-white text-black font-black px-8 py-4 rounded-2xl hover:bg-blue-500 hover:text-white transition-all shadow-2xl group"
                                    >
                                        {featured?.price === 0 ? 'Chơi miễn phí' : `Mua ngay · ${featured?.price?.toLocaleString()}đ`}
                                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                    <button
                                        onClick={() => navigate('/store')}
                                        className="flex items-center gap-2 text-gray-400 hover:text-white font-semibold px-6 py-4 transition"
                                    >
                                        Xem tất cả <ArrowRight size={16} />
                                    </button>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Stats strip */}
                    <div className="flex items-center gap-8 mt-16 pt-8 border-t border-white/5">
                        {[
                            { label: 'Trò chơi', value: products?.length ?? '—' },
                            { label: 'Thể loại', value: categories?.length ?? '—' },
                            { label: 'Miễn phí', value: products?.filter((p: any) => p.price === 0).length ?? '—' },
                        ].map(s => (
                            <div key={s.label}>
                                <p className="text-3xl font-black text-white">{s.value}</p>
                                <p className="text-xs text-gray-600 uppercase tracking-widest mt-0.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>{s.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── RECENT RELEASES ── */}
            <section className="max-w-7xl mx-auto px-6 py-20">
                <div className="flex items-end justify-between mb-10">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <TrendingUp size={16} className="text-blue-500" />
                            <span className="text-xs text-blue-500 font-bold uppercase tracking-widest">Mới nhất</span>
                        </div>
                        <h2 className="text-4xl font-black">Trò chơi mới ra mắt</h2>
                    </div>
                    <button onClick={() => navigate('/store')}
                        className="flex items-center gap-2 text-sm text-gray-500 hover:text-white transition font-semibold">
                        Xem tất cả <ArrowRight size={14} />
                    </button>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="animate-pulse">
                                <div className="aspect-[3/4] bg-white/5 rounded-2xl mb-3" />
                                <div className="h-3 bg-white/5 rounded w-3/4 mb-2" />
                                <div className="h-3 bg-white/5 rounded w-1/2" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {recent.map((game: any) => (
                            <div key={game.id} onClick={() => navigate(`/product/${game.slug}`)}
                                className="group cursor-pointer">
                                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-3 bg-white/5">
                                    <img src={getImageUrl(game.images?.[0]?.imageUrl)}
                                        onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=400'; }}
                                        className="w-full h-full object-cover group-hover:scale-110 transition duration-500" alt={game.name} />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition" />
                                    {game.price === 0 && (
                                        <span className="absolute top-2 left-2 bg-green-500/20 text-green-400 border border-green-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                            Miễn phí
                                        </span>
                                    )}
                                </div>
                                <h4 className="font-bold text-sm line-clamp-1 group-hover:text-blue-400 transition">{game.name}</h4>
                                <p className="text-xs text-blue-400 font-bold mt-0.5">
                                    {game.price === 0 ? 'Miễn phí' : `${game.price?.toLocaleString()}đ`}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* ── FREE GAMES ── */}
            {free.length > 0 && (
                <section className="max-w-7xl mx-auto px-6 pb-20">
                    <div className="bg-gradient-to-r from-green-600/10 to-blue-600/10 border border-white/5 rounded-3xl p-10">
                        <div className="flex items-end justify-between mb-8">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <Star size={16} className="text-green-400" />
                                    <span className="text-xs text-green-400 font-bold uppercase tracking-widest">Miễn phí</span>
                                </div>
                                <h2 className="text-4xl font-black">Chơi không mất phí</h2>
                            </div>
                            <button onClick={() => navigate('/store?filter=free')}
                                className="text-sm text-gray-500 hover:text-white transition font-semibold flex items-center gap-2">
                                Xem thêm <ArrowRight size={14} />
                            </button>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                            {free.map((game: any) => (
                                <div key={game.id} onClick={() => navigate(`/product/${game.slug}`)}
                                    className="group cursor-pointer bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl overflow-hidden transition">
                                    <div className="aspect-video overflow-hidden">
                                        <img src={getImageUrl(game.images?.[0]?.imageUrl)}
                                            onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=400'; }}
                                            className="w-full h-full object-cover group-hover:scale-105 transition duration-500" alt={game.name} />
                                    </div>
                                    <div className="p-4">
                                        <h4 className="font-bold text-sm line-clamp-1 mb-1">{game.name}</h4>
                                        <span className="text-xs text-green-400 font-bold">Miễn phí</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ── CATEGORIES ── */}
            {categories && categories.length > 0 && (
                <section className="max-w-7xl mx-auto px-6 pb-20">
                    <div className="flex items-end justify-between mb-8">
                        <h2 className="text-4xl font-black">Thể loại</h2>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        {categories.map((cat: any) => (
                            <button key={cat.id}
                                onClick={() => navigate(`/store?category=${cat.id}`)}
                                className="bg-white/5 hover:bg-blue-600 border border-white/10 hover:border-blue-600 text-gray-400 hover:text-white font-semibold px-6 py-3 rounded-2xl transition text-sm">
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </section>
            )}

            {/* ── FOOTER ── */}
            <footer className="border-t border-white/5 py-10 px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-gray-700 text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    <div className="flex items-center gap-2">
                        <Gamepad2 size={16} className="text-blue-600" />
                        <span>© 2026 <span className="text-gray-400 font-semibold">MT Store</span>. All rights reserved.</span>
                    </div>
                    <div className="flex gap-6 text-gray-600">
                        <button onClick={() => navigate('/store')} className="hover:text-white transition">Cửa hàng</button>
                        <button onClick={() => navigate('/login')} className="hover:text-white transition">Đăng nhập</button>
                    </div>
                </div>
            </footer>
        </div>
    );
}