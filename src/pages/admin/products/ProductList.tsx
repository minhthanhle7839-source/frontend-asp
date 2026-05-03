"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productService } from "../../../api/productService";
import { Trash2, Plus, Pencil, Eye, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function ProductList() {
    const queryClient = useQueryClient();
    const [keyword, setKeyword] = useState("");

    const { data: products, isLoading } = useQuery({
        queryKey: ["products"],
        queryFn: () => productService.getAll().then(res => res.data)
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => productService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
        }
    });

    const filtered = products?.filter(p =>
        p.name.toLowerCase().includes(keyword.toLowerCase())
    );

    if (isLoading) {
        return <div className="p-6 text-center text-slate-500">⏳ Đang tải...</div>;
    }

    return (
        <div className="space-y-6">

            {/* HEADER */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Quản lý sản phẩm</h1>
                    <p className="text-sm text-slate-500">
                        Tổng: {products?.length || 0} sản phẩm
                    </p>
                </div>

                <Link
                    to="/admin/products/add"
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow transition"
                >
                    <Plus size={18} /> Thêm sản phẩm
                </Link>
            </div>

            {/* SEARCH */}
            <div className="relative max-w-md">
                <Search size={18} className="absolute left-3 top-3 text-slate-400" />
                <input
                    placeholder="Tìm kiếm sản phẩm..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    onChange={e => setKeyword(e.target.value)}
                />
            </div>

            {/* TABLE */}
            <div className="bg-white rounded-2xl shadow overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
                        <tr>
                            <th className="p-4 text-left">Sản phẩm</th>
                            <th className="p-4">Giá</th>
                            <th className="p-4">Trạng thái</th>
                            <th className="p-4 text-right">Hành động</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y">
                        {filtered?.length ? filtered.map(p => (
                            <tr key={p.id} className="hover:bg-slate-50 transition">

                                {/* NAME */}
                                <td className="p-4">
                                    <div className="font-semibold text-slate-800">
                                        {p.name}
                                    </div>
                                    <div className="text-xs text-slate-400">
                                        {p.slug}
                                    </div>
                                </td>

                                {/* PRICE */}
                                <td className="p-4 font-medium text-blue-600">
                                    {p.price === 0
                                        ? "Miễn phí"
                                        : p.price.toLocaleString() + "đ"}
                                </td>

                                {/* STATUS */}
                                <td className="p-4">
                                    <span
                                        className={`px-3 py-1 text-xs rounded-full font-medium
                                        ${p.status === 1
                                                ? "bg-green-100 text-green-700"
                                                : "bg-yellow-100 text-yellow-700"
                                            }`}
                                    >
                                        {p.status === 1 ? "Công khai" : "Bản nháp"}
                                    </span>
                                </td>

                                {/* ACTION */}
                                <td className="p-4 text-right">
                                    <div className="flex justify-end gap-2">

                                        <Link
                                            to={`/admin/products/${p.id}`}
                                            className="p-2 hover:bg-blue-50 rounded-lg text-blue-600"
                                        >
                                            <Eye size={18} />
                                        </Link>

                                        <Link
                                            to={`/admin/products/edit/${p.id}`}
                                            className="p-2 hover:bg-yellow-50 rounded-lg text-yellow-600"
                                        >
                                            <Pencil size={18} />
                                        </Link>

                                        <button
                                            onClick={() => deleteMutation.mutate(p.id!)}
                                            className="p-2 hover:bg-red-50 rounded-lg text-red-600"
                                        >
                                            <Trash2 size={18} />
                                        </button>

                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={4} className="text-center py-10 text-slate-400">
                                    Không có sản phẩm nào
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}