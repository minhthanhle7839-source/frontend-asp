"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryService } from "../../../api/categoryService";
import { Loader2 } from "lucide-react";

function generateSlug(input: string): string {
    return input
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/^-+|-+$/g, "");
}

export default function CategoryEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState("");
    const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

    const { data: category, isLoading } = useQuery({
        queryKey: ["category", id],
        queryFn: () => categoryService.getById(Number(id)).then(res => res.data),
        enabled: !!id
    });

    // Load dữ liệu hiện tại vào form
    useEffect(() => {
        if (category) {
            setName(category.name);
            setSlug(category.slug ?? generateSlug(category.name));
            setDescription(category.description ?? "");
        }
    }, [category]);

    // Auto-generate slug khi đổi tên, trừ khi đã sửa tay
    useEffect(() => {
        if (!slugManuallyEdited) {
            setSlug(generateSlug(name));
        }
    }, [name, slugManuallyEdited]);

    const mutation = useMutation({
        mutationFn: () => categoryService.update(Number(id), {
            name: name.trim(),
            slug: slug.trim(),
            description: description.trim()
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            queryClient.invalidateQueries({ queryKey: ["category", id] });
            navigate("/admin/categories");
        },
        onError: () => setError("Cập nhật thất bại, vui lòng thử lại")
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        if (!name.trim()) { setError("Tên danh mục không được trống"); return; }
        if (!slug.trim()) { setError("Slug không được trống"); return; }
        mutation.mutate();
    };

    const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSlugManuallyEdited(true);
        setSlug(e.target.value);
    };

    const handleResetSlug = () => {
        setSlugManuallyEdited(false);
        setSlug(generateSlug(name));
    };

    if (isLoading) return (
        <div className="flex items-center justify-center h-40">
            <Loader2 className="animate-spin text-blue-500" size={32} />
        </div>
    );

    return (
        <div className="max-w-xl mx-auto">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow space-y-5">
                <h2 className="text-2xl font-bold">✏️ Chỉnh sửa danh mục</h2>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                        {error}
                    </div>
                )}

                <div className="space-y-1">
                    <label className="font-medium">Tên danh mục *</label>
                    <input
                        className="border p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                </div>

                <div className="space-y-1">
                    <div className="flex items-center justify-between">
                        <label className="font-medium">Slug *</label>
                        {slugManuallyEdited && (
                            <button
                                type="button"
                                onClick={handleResetSlug}
                                className="text-xs text-blue-500 hover:text-blue-700 underline"
                            >
                                ↺ Tự động từ tên
                            </button>
                        )}
                    </div>
                    <input
                        className="border p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 font-mono text-sm text-slate-600"
                        value={slug}
                        onChange={handleSlugChange}
                    />

                </div>

                <div className="space-y-1">
                    <label className="font-medium">Mô tả</label>
                    <textarea
                        rows={4}
                        className="border p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                    />
                </div>

                <div className="flex gap-3 pt-1">
                    <button
                        type="submit"
                        disabled={mutation.isPending}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2.5 rounded-lg font-medium transition"
                    >
                        {mutation.isPending && <Loader2 size={16} className="animate-spin" />}
                        {mutation.isPending ? "Đang lưu..." : "Cập nhật"}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate("/admin/categories")}
                        className="px-6 py-2.5 rounded-lg border hover:bg-slate-50 font-medium transition"
                    >
                        Hủy
                    </button>
                </div>
            </form>
        </div>
    );
}