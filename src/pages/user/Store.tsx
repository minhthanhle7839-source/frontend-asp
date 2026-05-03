import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { productService } from '../../api/productService';
import { categoryService } from '../../api/categoryService';
import { getImageUrl } from '../../utils/image';
import Navbar from '../../components/Navbar';
import { Gamepad2, SlidersHorizontal, ChevronRight, X } from 'lucide-react';

export default function Store() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<number | null>(
        searchParams.get('category') ? Number(searchParams.get('category')) : null
    );
    const [priceFilter, setPriceFilter] = useState<'all' | 'free' | 'paid'>('all');
    const [sort, setSort] = useState<'newest' | 'price_asc' | 'price_desc'>('newest');
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        if (searchParams.get('filter') === 'free') setPriceFilter('free');
    }, [searchParams]);

    const { data: products, isLoading } = useQuery({
        queryKey: ['client-products'],
        queryFn: () => productService.getAll().then(res => res.data)
    });

    const { data: categories } = useQuery({
        queryKey: ['categories'],
        queryFn: () => categoryService.getAll().then(res => res.data)
    });

    const filtered = products
        ?.filter((p: any) => {
            const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
            const matchCat = selectedCategory ? p.productCategories?.some((pc: any) => pc.categoryId === selectedCategory) : true;
            const matchPrice = priceFilter === 'free' ? p.price === 0 : priceFilter === 'paid' ? p.price > 0 : true;
            return matchSearch && matchCat && matchPrice;
        })
        ?.sort((a: any, b: any) => {
            if (sort === 'price_asc') return a.price - b.price;
            if (sort === 'price_desc') return b.price - a.price;
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });

    const activeFiltersCount = [selectedCategory, priceFilter !== 'all'].filter(Boolean).length;

    return (
        <div className="min-h-screen bg-[#060910] text-gray-100" style={{ fontFamily: "'Syne', sans-serif" }}>
            <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800;900&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap" rel="stylesheet" />

            <Navbar search={search} onSearchChange={setSearch} showSearch />

            <div className="max-w-7xl mx-auto px-6 py-10">
                {/* Header */}
                <div className="flex items-end justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-black">Cửa hàng</h1>
                        <p className="text-gray-600 mt-1 text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                            {filtered?.length ?? 0} trò chơi
                            {search && ` · Kết quả cho "${search}"`}
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Sort */}
                        <select
                            value={sort}
                            onChange={e => setSort(e.target.value as any)}
                            className="bg-white/5 border border-white/10 text-gray-300 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/40 cursor-pointer"
                            style={{ fontFamily: "'DM Sans', sans-serif" }}
                        >
                            <option value="newest">Mới nhất</option>
                            <option value="price_asc">Giá thấp → cao</option>
                            <option value="price_desc">Giá cao → thấp</option>
                        </select>

                        {/* Filter toggle */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition ${showFilters ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'}`}
                        >
                            <SlidersHorizontal size={15} />
                            Lọc
                            {activeFiltersCount > 0 && (
                                <span className="bg-white text-blue-600 text-xs font-black w-4 h-4 rounded-full flex items-center justify-center">
                                    {activeFiltersCount}
                                </span>
                            )}
                        </button>
                    </div>
                </div>

                {/* Filter panel */}
                {showFilters && (
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 space-y-5">
                        {/* Price filter */}
                        <div>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Giá</p>
                            <div className="flex gap-2">
                                {(['all', 'free', 'paid'] as const).map(f => (
                                    <button key={f}
                                        onClick={() => setPriceFilter(f)}
                                        className={`px-4 py-2 rounded-xl text-sm font-semibold border transition ${priceFilter === f ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'}`}>
                                        {f === 'all' ? 'Tất cả' : f === 'free' ? 'Miễn phí' : 'Trả phí'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Category filter */}
                        <div>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Thể loại</p>
                            <div className="flex flex-wrap gap-2">
                                <button onClick={() => setSelectedCategory(null)}
                                    className={`px-4 py-2 rounded-xl text-sm font-semibold border transition ${!selectedCategory ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'}`}>
                                    Tất cả
                                </button>
                                {categories?.map((cat: any) => (
                                    <button key={cat.id} onClick={() => setSelectedCategory(cat.id === selectedCategory ? null : cat.id)}
                                        className={`px-4 py-2 rounded-xl text-sm font-semibold border transition ${selectedCategory === cat.id ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'}`}>
                                        {cat.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Clear */}
                        {activeFiltersCount > 0 && (
                            <button onClick={() => { setSelectedCategory(null); setPriceFilter('all'); }}
                                className="flex items-center gap-1.5 text-sm text-red-400 hover:text-red-300 transition">
                                <X size={14} /> Xóa bộ lọc
                            </button>
                        )}
                    </div>
                )}

                {/* Grid */}
                {isLoading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                        {Array.from({ length: 15 }).map((_, i) => (
                            <div key={i} className="animate-pulse">
                                <div className="aspect-[3/4] bg-white/5 rounded-2xl mb-3" />
                                <div className="h-4 bg-white/5 rounded mb-2 w-3/4" />
                                <div className="h-3 bg-white/5 rounded w-1/2" />
                            </div>
                        ))}
                    </div>
                ) : filtered?.length === 0 ? (
                    <div className="text-center py-32">
                        <Gamepad2 size={56} className="mx-auto mb-4 text-gray-800" />
                        <p className="text-xl font-bold text-gray-600 mb-2">Không tìm thấy trò chơi nào</p>
                        <button onClick={() => { setSearch(''); setSelectedCategory(null); setPriceFilter('all'); }}
                            className="text-sm text-blue-400 hover:text-blue-300 transition mt-2">
                            Xóa bộ lọc
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                        {filtered?.map((game: any) => (
                            <div key={game.id} onClick={() => navigate(`/product/${game.slug}`)}
                                className="group cursor-pointer">
                                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-3 bg-white/5">
                                    <img
                                        src={getImageUrl(game.images?.[0]?.imageUrl)}
                                        onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=400'; }}
                                        className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                                        alt={game.name}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition" />

                                    {game.status === 2 && (
                                        <span className="absolute top-2.5 left-2.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                                            Sắp ra mắt
                                        </span>
                                    )}
                                    {game.price === 0 && game.status !== 2 && (
                                        <span className="absolute top-2.5 left-2.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
                                            Miễn phí
                                        </span>
                                    )}

                                    <div className="absolute bottom-3 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                                        <span className="bg-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded-full flex items-center gap-1">
                                            Xem chi tiết <ChevronRight size={12} />
                                        </span>
                                    </div>
                                </div>

                                <h4 className="font-bold text-sm line-clamp-1 group-hover:text-blue-400 transition mb-1">
                                    {game.name}
                                </h4>
                                <div className="flex items-center justify-between">
                                    <span className={`text-sm font-bold ${game.price === 0 ? 'text-green-400' : 'text-blue-400'}`}>
                                        {game.price === 0 ? 'Miễn phí' : `${game.price?.toLocaleString()}đ`}
                                    </span>
                                    {game.developer && (
                                        <span className="text-[11px] text-gray-700 truncate ml-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                            {game.developer.name}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <footer className="border-t border-white/5 mt-16 py-8 px-6 text-center text-gray-700 text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                © 2026 MT Store. All rights reserved.
            </footer>
        </div>
    );
}