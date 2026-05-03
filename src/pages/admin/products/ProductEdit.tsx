"use client";

import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productService, } from "../../../api/productService";
import { categoryService } from "../../../api/categoryService";
import { developerService } from "../../../api/developerService";
import { publisherService } from "../../../api/publisherService";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { ImageManager } from "./ImageManager";
import { VersionManager } from "./VersionManager";

export default function ProductEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: product, isLoading: loadingProduct } = useQuery({
        queryKey: ["product", id],
        queryFn: () => productService.getById(Number(id)).then(res => res.data)
    });

    const { data: categories } = useQuery({
        queryKey: ["categories"],
        queryFn: () => categoryService.getAll().then(res => res.data)
    });
    const { data: developers } = useQuery({
        queryKey: ["developers"],
        queryFn: () => developerService.getAll().then(res => res.data)
    });
    const { data: publishers } = useQuery({
        queryKey: ["publishers"],
        queryFn: () => publisherService.getAll().then(res => res.data)
    });

    const [formData, setFormData] = useState<any>(null);
    const [error, setError] = useState("");

    useEffect(() => {
        if (product) {
            setFormData({
                ...product,
                categoryIds: product.productCategories?.map((c: any) => c.categoryId) || []
            });
        }
    }, [product]);

    const mutation = useMutation({
        // Trong mutation, thay vì gửi thẳng formData:
        mutationFn: async () => {
            setError("");
            if (!formData.name?.trim()) throw new Error("Tên sản phẩm không được trống");

            // Chỉ gửi các field backend cần
            const payload = {
                name: formData.name?.trim(),
                description: formData.description?.trim() ?? "",
                price: formData.price ?? 0,
                status: formData.status ?? 1,
                developerId: formData.developerId || null,
                publisherId: formData.publisherId || null,
                categoryIds: formData.categoryIds ?? []
            };

            await productService.update(Number(id), payload);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
            queryClient.invalidateQueries({ queryKey: ["product", id] });
            navigate("/admin/products");
        },
        onError: (err: any) => {
            setError(err.message || "Có lỗi xảy ra");
        }
    });

    const toggleCategory = (catId: number, checked: boolean) => {
        setFormData((prev: any) => ({
            ...prev,
            categoryIds: checked
                ? [...prev.categoryIds, catId]
                : prev.categoryIds.filter((x: number) => x !== catId)
        }));
    };

    if (loadingProduct || !formData) return (
        <div className="flex items-center justify-center h-40">
            <Loader2 className="animate-spin text-blue-500" size={32} />
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto">
            <form
                onSubmit={e => { e.preventDefault(); mutation.mutate(); }}
                className="bg-white p-6 rounded-2xl shadow space-y-6"
            >
                <h2 className="text-2xl font-bold">✏️ Chỉnh sửa sản phẩm</h2>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                        {error}
                    </div>
                )}

                {/* TÊN */}
                <div className="space-y-1">
                    <label className="font-medium">Tên sản phẩm *</label>
                    <input
                        className="border p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                        value={formData.name || ""}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                    />
                </div>

                {/* MÔ TẢ */}
                <div className="space-y-1">
                    <label className="font-medium">Mô tả</label>
                    <textarea
                        rows={4}
                        className="border p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                        value={formData.description || ""}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                    />
                </div>

                {/* GIÁ + STATUS */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="font-medium">Giá (VNĐ)</label>
                        <input
                            type="number" min={0}
                            className="border p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                            value={formData.price || 0}
                            onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="font-medium">Trạng thái</label>
                        <select
                            className="border p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                            value={formData.status}
                            onChange={e => setFormData({ ...formData, status: Number(e.target.value) })}
                        >
                            <option value={1}>Đang bán</option>
                            <option value={0}>Ngừng bán</option>
                            <option value={2}>Sắp ra mắt</option>
                        </select>
                    </div>
                </div>

                {/* DEVELOPER + PUBLISHER */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="font-medium">Developer</label>
                        <select
                            className="border p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                            value={formData.developerId || ""}
                            onChange={e => setFormData({ ...formData, developerId: Number(e.target.value) })}
                        >
                            <option value="">-- Chọn Developer --</option>
                            {developers?.map((d: any) => <option key={d.id} value={d.id}>{d.name}</option>)}
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="font-medium">Publisher</label>
                        <select
                            className="border p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                            value={formData.publisherId || ""}
                            onChange={e => setFormData({ ...formData, publisherId: Number(e.target.value) })}
                        >
                            <option value="">-- Chọn Publisher --</option>
                            {publishers?.map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                    </div>
                </div>

                {/* CATEGORY */}
                <div className="space-y-2">
                    <label className="font-medium">Thể loại</label>
                    <div className="flex flex-wrap gap-3">
                        {categories?.map((c: any) => (
                            <label key={c.id} className="flex items-center gap-2 cursor-pointer bg-slate-50 border px-3 py-2 rounded-lg hover:bg-slate-100">
                                <input
                                    type="checkbox"
                                    checked={formData.categoryIds?.includes(c.id) || false}
                                    onChange={e => toggleCategory(c.id, e.target.checked)}
                                />
                                {c.name}
                            </label>
                        ))}
                    </div>
                </div>

                {/* HÌNH ẢNH */}
                <div className="space-y-2">
                    <label className="font-medium">Hình ảnh</label>
                    <ImageManager productId={product?.id} />
                </div>

                {/* PHIÊN BẢN */}
                <div className="space-y-2">
                    <label className="font-medium">Phiên bản</label>
                    <VersionManager productId={product?.id} />
                </div>
                {/* SUBMIT */}
                <div className="flex gap-3 pt-2">
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
                        onClick={() => navigate("/admin/products")}
                        className="px-6 py-2.5 rounded-lg border hover:bg-slate-50 font-medium transition"
                    >
                        Hủy
                    </button>
                </div>
            </form>
        </div>
    );
}