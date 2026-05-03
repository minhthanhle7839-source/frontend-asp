"use client";

import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryService } from "../../../api/categoryService";
import { ArrowLeft, Pencil, Trash2, Loader2 } from "lucide-react";

export default function CategoryDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: category, isLoading, isError } = useQuery({
        queryKey: ["category", id],
        queryFn: () => categoryService.getById(Number(id)).then(res => res.data),
        enabled: !!id
    });

    const deleteMutation = useMutation({
        mutationFn: () => categoryService.delete(Number(id)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            navigate("/admin/categories");
        }
    });

    if (isLoading) return (
        <div className="flex items-center justify-center h-40">
            <Loader2 className="animate-spin text-blue-500" size={32} />
        </div>
    );

    if (isError || !category) return (
        <div className="text-center py-20 text-red-500">❌ Không tìm thấy danh mục</div>
    );

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            {/* HEADER */}
            <div className="flex justify-between items-start">
                <div>
                    <Link
                        to="/admin/categories"
                        className="text-sm text-slate-500 flex items-center gap-1 hover:text-blue-600"
                    >
                        <ArrowLeft size={16} /> Quay lại
                    </Link>
                    <h1 className="text-3xl font-bold mt-2">{category.name}</h1>
                    <p className="text-sm text-slate-400 font-mono">{category.slug}</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => navigate(`/admin/categories/edit/${id}`)}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700"
                    >
                        <Pencil size={16} /> Chỉnh sửa
                    </button>
                    <button
                        onClick={() => {
                            if (confirm(`Xóa danh mục "${category.name}"?`))
                                deleteMutation.mutate();
                        }}
                        disabled={deleteMutation.isPending}
                        className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600"
                    >
                        {deleteMutation.isPending
                            ? <Loader2 size={16} className="animate-spin" />
                            : <Trash2 size={16} />}
                        Xóa
                    </button>
                </div>
            </div>

            {/* INFO */}
            <div className="bg-white p-6 rounded-2xl shadow border space-y-4">
                <div>
                    <p className="text-sm text-slate-400">Mô tả</p>
                    <p className="mt-1 text-slate-700">
                        {category.description || <span className="text-slate-300 italic">Chưa có mô tả</span>}
                    </p>
                </div>
                <div>
                    <p className="text-sm text-slate-400">Ngày tạo</p>
                    <p className="mt-1">{new Date(category.createdAt!).toLocaleString("vi-VN")}</p>
                </div>
            </div>


        </div>
    );
}