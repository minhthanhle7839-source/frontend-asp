"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productService } from "../../../api/productService";
import { Upload, Trash2, Download, Loader2, X } from "lucide-react";

interface Props {
    productId?: number;
    pendingFile?: File | null;
    pendingVersion?: string;
    onPendingFileChange?: (file: File | null) => void;
    onPendingVersionChange?: (version: string) => void;
}

export const VersionManager = ({
    productId,
    pendingFile,
    pendingVersion,
    onPendingFileChange,
    onPendingVersionChange
}: Props) => {

    const [version, setVersion] = useState("");
    const queryClient = useQueryClient();

    // ================= GET LIST =================
    const { data: versions = [], isLoading } = useQuery({
        queryKey: ["versions", productId],
        queryFn: () => productService.getVersions(productId), // ✔️ KHÔNG .data
        enabled: !!productId
    });

    // ================= UPLOAD =================
    const uploadMutation = useMutation({
        mutationFn: async (file: File) => {
            const fd = new FormData();
            fd.append("file", file);
            fd.append("productId", String(productId));
            fd.append("version", version || "1.0.0");

            await productService.uploadVersion(fd);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["versions", productId] });
            setVersion("");
        }
    });

    // ================= DELETE =================
    const deleteMutation = useMutation({
        mutationFn: (id: number) => productService.deleteVersion(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["versions", productId] });
        }
    });

    // ================= CREATE MODE =================
    if (!productId) {
        return (
            <div className="space-y-3">
                <div className="flex gap-3 items-center flex-wrap">

                    <input
                        placeholder="Tên version (vd: 1.0.0)"
                        className="border p-3 rounded-lg w-44"
                        value={pendingVersion ?? ""}
                        onChange={e => onPendingVersionChange?.(e.target.value)}
                    />

                    <label className="flex items-center gap-2 cursor-pointer bg-green-50 border border-green-200 border-dashed px-4 py-3 rounded-xl">
                        <Upload size={18} className="text-green-500" />
                        <span className="text-green-600 text-sm">
                            {pendingFile ? pendingFile.name : "Chọn file"}
                        </span>
                        <input
                            type="file"
                            hidden
                            onChange={e => onPendingFileChange?.(e.target.files?.[0] ?? null)}
                        />
                    </label>

                    {pendingFile && (
                        <button onClick={() => onPendingFileChange?.(null)}>
                            <X size={16} className="text-red-500" />
                        </button>
                    )}

                </div>
            </div>
        );
    }

    // ================= LOADING =================
    if (isLoading) {
        return (
            <div className="flex gap-2 items-center text-slate-400">
                <Loader2 size={16} className="animate-spin" />
                Đang tải versions...
            </div>
        );
    }

    // ================= EDIT MODE =================
    return (
        <div className="space-y-4 mt-2">

            {/* Upload */}
            <div className="flex gap-3 items-center flex-wrap">

                <input
                    placeholder="Version (vd: 1.0.0)"
                    value={version}
                    onChange={e => setVersion(e.target.value)}
                    className="border px-3 py-2 rounded-xl w-40"
                />

                <label className="flex items-center gap-2 cursor-pointer bg-green-50 border border-green-200 border-dashed px-4 py-2 rounded-xl">
                    <Upload size={18} className="text-green-500" />
                    <span className="text-green-600 text-sm">
                        {uploadMutation.isPending ? "Đang upload..." : "Upload"}
                    </span>
                    <input
                        type="file"
                        hidden
                        onChange={e => {
                            const file = e.target.files?.[0];
                            if (file) uploadMutation.mutate(file);
                        }}
                    />
                </label>

            </div>

            {/* List */}
            <div className="space-y-2">
                {versions.map((v: any) => (
                    <div
                        key={v.id}
                        className="flex justify-between items-center border p-3 rounded-xl"
                    >

                        <div>
                            <p className="font-semibold">{v.version}</p>
                            <p className="text-xs text-slate-500">
                                {v.fileSize
                                    ? `${(v.fileSize / 1024).toFixed(2)} KB`
                                    : ""}
                            </p>
                        </div>

                        <div className="flex gap-2">

                            {/* DOWNLOAD FIX CLOUDINARY */}
                            <a
                                href={v.fileUrl.startsWith("http")
                                    ? v.fileUrl
                                    : `https://le-minh-thanh.onrender.com${v.fileUrl}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 bg-blue-50 text-blue-600 rounded"
                            >
                                <Download size={16} />
                            </a>

                            {/* DELETE */}
                            <button
                                onClick={() => deleteMutation.mutate(v.id)}
                                className="p-2 bg-red-50 text-red-600 rounded"
                            >
                                <Trash2 size={16} />
                            </button>

                        </div>

                    </div>
                ))}
            </div>

        </div>
    );
};