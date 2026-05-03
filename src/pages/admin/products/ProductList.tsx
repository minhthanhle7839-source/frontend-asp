// src/pages/admin/products/ProductList.tsx
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productService } from "../../../api/productService";
import { Trash2, Plus, Pencil, Eye, Search, Gamepad2, X, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { getImageUrl } from "../../../utils/image";

export default function ProductList() {
    const queryClient = useQueryClient();
    const [keyword, setKeyword] = useState("");
    const [statusFilter, setStatusFilter] = useState<'all' | '1' | '0' | '2'>('all');
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const { data: products, isLoading } = useQuery({
        queryKey: ["products"],
        queryFn: () => productService.getAll().then(res => res.data)
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => productService.delete(id),
        onMutate: (id) => setDeletingId(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products"] }),
        onSettled: () => setDeletingId(null)
    });

    const handleDelete = (id: number, name: string) => {
        if (confirm(`Xoá "${name}"? Hành động này không thể hoàn tác.`))
            deleteMutation.mutate(id);
    };

    const filtered = products?.filter(p => {
        const matchSearch = p.name.toLowerCase().includes(keyword.toLowerCase())
            || p.slug?.toLowerCase().includes(keyword.toLowerCase());
        const matchStatus = statusFilter === 'all' ? true : String(p.status) === statusFilter;
        return matchSearch && matchStatus;
    });

    const statusConfig: Record<number, { label: string; class: string }> = {
        1: { label: 'Đang bán', class: 'bg-green-100 text-green-700' },
        0: { label: 'Ngừng bán', class: 'bg-red-100 text-red-600' },
        2: { label: 'Sắp ra mắt', class: 'bg-yellow-100 text-yellow-700' },
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Sản phẩm</h1>
                    <p className="text-slate-500 mt-0.5">
                        {isLoading ? '...' : `${products?.length ?? 0} sản phẩm trong hệ thống`}
                    </p>
                </div>
                <Link
                    to="/admin/products/add"
                    className="flex items-center gap-2 bg-slate-900 hover:bg-blue-600 text-white px-5 py-3 rounded-xl font-bold shadow-lg transition-all"
                >
                    <Plus size={18} /> Thêm sản phẩm
                </Link>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3 flex-wrap">
                <div className="relative flex-1 max-w-sm">
                    <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        placeholder="Tìm theo tên, slug..."
                        value={keyword}
                        onChange={e => setKeyword(e.target.value)}
                        className="w-full pl-10 pr-8 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 outline-none text-sm bg-white"
                    />
                    {keyword && (
                        <button onClick={() => setKeyword('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                            <X size={13} />
                        </button>
                    )}
                </div>
                <div className="flex gap-2">
                    {([['all', 'Tất cả'], ['1', 'Đang bán'], ['2', 'Sắp ra mắt'], ['0', 'Ngừng bán']] as const).map(([val, label]) => (
                        <button key={val}
                            onClick={() => setStatusFilter(val)}
                            className={`px-4 py-2.5 rounded-xl text-sm font-semibold border transition ${statusFilter === val ? 'bg-slate-900 text-white border-slate-900' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}>
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                {isLoading ? (
                    <div className="flex items-center justify-center h-48">
                        <Loader2 className="animate-spin text-blue-500" size={28} />
                    </div>
                ) : (
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="text-left px-5 py-3.5 font-semibold text-slate-500">Sản phẩm</th>
                                <th className="text-left px-5 py-3.5 font-semibold text-slate-500">Developer</th>
                                <th className="text-left px-5 py-3.5 font-semibold text-slate-500">Giá</th>
                                <th className="text-left px-5 py-3.5 font-semibold text-slate-500">Trạng thái</th>
                                <th className="text-right px-5 py-3.5 font-semibold text-slate-500">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {!filtered?.length ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-16">
                                        <Gamepad2 size={36} className="mx-auto mb-3 text-slate-300" />
                                        <p className="text-slate-400 font-medium">Không có sản phẩm nào</p>
                                    </td>
                                </tr>
                            ) : filtered.map(p => (
                                <tr key={p.id} className="hover:bg-slate-50/70 transition group">
                                    {/* Product */}
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-11 h-11 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                                                {(p as any).images?.[0]?.imageUrl ? (
                                                    <img
                                                        src={getImageUrl((p as any).images[0].imageUrl)}
                                                        className="w-full h-full object-cover"
                                                        alt={p.name}
                                                        onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <Gamepad2 size={16} className="text-slate-400" />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-800 group-hover:text-blue-600 transition line-clamp-1">
                                                    {p.name}
                                                </p>
                                                <p className="text-xs text-slate-400 font-mono mt-0.5">{p.slug}</p>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Developer */}
                                    <td className="px-5 py-4 text-slate-600">
                                        {(p as any).developer?.name ?? <span className="text-slate-300">—</span>}
                                    </td>

                                    {/* Price */}
                                    <td className="px-5 py-4">
                                        <span className={`font-bold ${p.price === 0 ? 'text-green-600' : 'text-blue-600'}`}>
                                            {p.price === 0 ? 'Miễn phí' : `${p.price.toLocaleString()}đ`}
                                        </span>
                                    </td>

                                    {/* Status */}
                                    <td className="px-5 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${statusConfig[p.status]?.class ?? 'bg-slate-100 text-slate-600'}`}>
                                            {statusConfig[p.status]?.label ?? p.status}
                                        </span>
                                    </td>

                                    {/* Actions */}
                                    <td className="px-5 py-4">
                                        <div className="flex justify-end items-center gap-1">
                                            <Link to={`/admin/products/${p.id}`}
                                                className="p-2 hover:bg-blue-50 rounded-lg text-slate-400 hover:text-blue-600 transition"
                                                title="Xem chi tiết">
                                                <Eye size={16} />
                                            </Link>
                                            <Link to={`/admin/products/edit/${p.id}`}
                                                className="p-2 hover:bg-yellow-50 rounded-lg text-slate-400 hover:text-yellow-600 transition"
                                                title="Chỉnh sửa">
                                                <Pencil size={16} />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(p.id!, p.name)}
                                                disabled={deletingId === p.id}
                                                className="p-2 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-500 transition disabled:opacity-50"
                                                title="Xoá">
                                                {deletingId === p.id
                                                    ? <Loader2 size={16} className="animate-spin" />
                                                    : <Trash2 size={16} />}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {/* Footer */}
                {!isLoading && filtered && (
                    <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-400">
                        <span>Hiển thị {filtered.length} / {products?.length ?? 0} sản phẩm</span>
                        {keyword && (
                            <button onClick={() => setKeyword('')} className="text-blue-500 hover:text-blue-700 font-medium">
                                Xoá tìm kiếm
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}