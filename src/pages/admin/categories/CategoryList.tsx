"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryService } from "../../../api/categoryService";
import { Pencil, Trash2, Plus, Eye, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CategoryList() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const { data: categories, isLoading } = useQuery({
        queryKey: ["categories"],
        queryFn: () => categoryService.getAll().then(res => res.data)
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => categoryService.delete(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["categories"] })
    });

    return (
        <div className="space-y-6">
            {/* HEADER */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">🗂 Danh mục</h1>
                <button
                    onClick={() => navigate("/admin/categories/add")}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
                >
                    <Plus size={16} /> Thêm danh mục
                </button>
            </div>

            {/* TABLE */}
            <div className="bg-white rounded-2xl shadow border overflow-hidden">
                {isLoading ? (
                    <div className="flex items-center justify-center py-16 text-slate-400">
                        <Loader2 size={24} className="animate-spin mr-2" /> Đang tải...
                    </div>
                ) : categories?.length === 0 ? (
                    <div className="text-center py-16 text-slate-400">
                        Chưa có danh mục nào
                    </div>
                ) : (
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 border-b">
                            <tr>
                                <th className="text-left px-5 py-3 font-semibold text-slate-600">Tên</th>
                                <th className="text-left px-5 py-3 font-semibold text-slate-600">Slug</th>
                                <th className="text-left px-5 py-3 font-semibold text-slate-600">Mô tả</th>
                                <th className="text-left px-5 py-3 font-semibold text-slate-600">Ngày tạo</th>
                                <th className="px-5 py-3"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {categories?.map((c: any) => (
                                <tr key={c.id} className="hover:bg-slate-50 transition">
                                    <td className="px-5 py-3 font-medium">{c.name}</td>
                                    <td className="px-5 py-3 text-xs font-mono text-slate-400">{c.slug}</td>
                                    <td className="px-5 py-3 text-slate-500 max-w-[200px] truncate">
                                        {c.description || <span className="text-slate-300">—</span>}
                                    </td>
                                    <td className="px-5 py-3">

                                    </td>
                                    <td className="px-5 py-3 text-slate-400 text-xs">
                                        {new Date(c.createdAt).toLocaleDateString("vi-VN")}
                                    </td>
                                    <td className="px-5 py-3">
                                        <div className="flex gap-2 justify-end">
                                            <button
                                                onClick={() => navigate(`/admin/categories/${c.id}`)}
                                                className="p-2 bg-slate-50 text-slate-600 rounded-lg hover:bg-slate-100"
                                            >
                                                <Eye size={14} />
                                            </button>
                                            <button
                                                onClick={() => navigate(`/admin/categories/edit/${c.id}`)}
                                                className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
                                            >
                                                <Pencil size={14} />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    if (confirm(`Xóa danh mục "${c.name}"?`))
                                                        deleteMutation.mutate(c.id);
                                                }}
                                                disabled={deleteMutation.isPending}
                                                className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                                            >
                                                {deleteMutation.isPending
                                                    ? <Loader2 size={14} className="animate-spin" />
                                                    : <Trash2 size={14} />}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}