"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productService } from "../../../api/productService";
import { Trash2, Upload, Loader2 } from "lucide-react";

interface Props {
    productId?: number;                          // undefined = chế độ tạo mới
    pendingFiles?: File[];                       // ảnh chờ upload (tạo mới)
    onPendingChange?: (files: File[]) => void;   // callback cập nhật lên form cha
}

export const ImageManager = ({ productId, pendingFiles, onPendingChange }: Props) => {
    const queryClient = useQueryClient();

    // ── CHẾ ĐỘ ĐÃ CÓ productId (edit / detail) ──
    const { data: images, isLoading } = useQuery({
        queryKey: ["images", productId],
        queryFn: async () => {
            const res = await productService.getImages();
            return res.data.filter((i: any) => i.productId === productId);
        },
        enabled: !!productId
    });

    const uploadMutation = useMutation({
        mutationFn: async (file: File) => {
            const fd = new FormData();
            fd.append("File", file);
            fd.append("ProductId", String(productId));
            await productService.uploadImage(fd);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["images", productId] });
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => productService.deleteImage(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["images", productId] });
        }
    });

    // ── CHẾ ĐỘ PENDING (tạo mới, chưa có productId) ──
    if (!productId) {
        const previews = pendingFiles?.map(f => URL.createObjectURL(f)) ?? [];

        const handleAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
            const files = Array.from(e.target.files || []);
            onPendingChange?.([...(pendingFiles ?? []), ...files]);
        };

        const handleRemove = (i: number) => {
            onPendingChange?.((pendingFiles ?? []).filter((_, idx) => idx !== i));
        };

        return (
            <div className="space-y-3">
                <label className="flex items-center gap-2 cursor-pointer bg-blue-50 border border-blue-200 border-dashed px-4 py-3 rounded-xl w-fit hover:bg-blue-100">
                    <Upload size={18} className="text-blue-500" />
                    <span className="text-blue-600">Chọn ảnh</span>
                    <input type="file" hidden multiple accept="image/*" onChange={handleAdd} />
                </label>

                {previews.length > 0 && (
                    <div className="grid grid-cols-4 gap-3">
                        {previews.map((src, i) => (
                            <div key={i} className="relative group">
                                <img src={src} className="h-24 w-full object-cover rounded-lg border" />
                                <button
                                    type="button"
                                    onClick={() => handleRemove(i)}
                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 hidden group-hover:flex"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    // ── CHẾ ĐỘ EDIT / DETAIL ──
    if (isLoading) return <div className="flex gap-2 items-center text-slate-400"><Loader2 size={16} className="animate-spin" /> Đang tải ảnh...</div>;

    return (
        <div className="space-y-3">
            {/* Upload thêm ảnh */}
            <label className="flex items-center gap-2 cursor-pointer bg-blue-50 border border-blue-200 border-dashed px-4 py-3 rounded-xl w-fit hover:bg-blue-100">
                <Upload size={18} className="text-blue-500" />
                <span className="text-blue-600">
                    {uploadMutation.isPending ? "Đang upload..." : "Thêm ảnh"}
                </span>
                <input
                    type="file"
                    hidden
                    multiple
                    accept="image/*"
                    onChange={e => {
                        Array.from(e.target.files || []).forEach(f => uploadMutation.mutate(f));
                    }}
                />
            </label>

            {/* Grid ảnh hiện tại */}
            {(images?.length ?? 0) > 0 ? (
                <div className="grid grid-cols-4 gap-3">
                    {(images ?? []).map((img: any) => (
                        <div key={img.id} className="relative group">
                            <img
                                src={`https://le-minh-thanh.onrender.com${img.imageUrl}`}
                                className="h-24 w-full object-cover rounded-lg border"
                            />
                            <button
                                type="button"
                                onClick={() => deleteMutation.mutate(img.id)}
                                disabled={deleteMutation.isPending}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 hidden group-hover:flex"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-slate-400 text-sm">Chưa có ảnh</p>
            )}
        </div>
    );
};