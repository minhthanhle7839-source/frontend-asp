// src/pages/admin/entities/EntityForm.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { developerService } from "../../../api/developerService";
import { publisherService } from "../../../api/publisherService";
import type { Developer } from "../../../api/developerService";
import type { Publisher } from "../../../api/publisherService";

interface Props {
    type: 'developer' | 'publisher';
}

export default function EntityForm({ type }: Props) {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const isEdit = !!id;
    const isDev = type === 'developer';
    const backPath = isDev ? '/admin/developers' : '/admin/publishers';
    const label = isDev ? 'Nhà phát triển' : 'Nhà phát hành';

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [website, setWebsite] = useState("");
    const [error, setError] = useState("");

    const { data: entity, isLoading } = useQuery({
        queryKey: [type, id],
        queryFn: () => isDev
            ? developerService.getById(Number(id)).then(res => res.data)
            : publisherService.getById(Number(id)).then(res => res.data),
        enabled: isEdit
    });

    useEffect(() => {
        if (entity) {
            setName(entity.name);
            setWebsite(entity.website ?? "");
            if ('description' in entity) {
                setDescription((entity as Developer).description ?? "");
            }
        }
    }, [entity]);

    const mutation = useMutation({
        mutationFn: () => {
            if (isDev) {
                const payload: Omit<Developer, 'id' | 'createdAt'> = {
                    name: name.trim(),
                    description: description.trim(),
                    website: website.trim()
                };
                return isEdit
                    ? developerService.update(Number(id), payload)
                    : developerService.create(payload);
            } else {
                const payload: Omit<Publisher, 'id' | 'createdAt'> = {
                    name: name.trim(),
                    website: website.trim()
                };
                return isEdit
                    ? publisherService.update(Number(id), payload)
                    : publisherService.create(payload);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [type] });
            if (isEdit) queryClient.invalidateQueries({ queryKey: [type, id] });
            navigate(backPath);
        },
        onError: () => setError(`${isEdit ? 'Cập nhật' : 'Tạo'} thất bại, vui lòng thử lại`)
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        if (!name.trim()) { setError("Tên không được trống"); return; }
        mutation.mutate();
    };

    if (isEdit && isLoading) return (
        <div className="flex items-center justify-center h-40">
            <Loader2 className="animate-spin text-blue-500" size={32} />
        </div>
    );

    return (
        <div className="max-w-xl mx-auto">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow space-y-5">
                <h2 className="text-2xl font-bold">
                    {isEdit ? '✏️ Chỉnh sửa' : '➕ Thêm'} {label}
                </h2>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                        {error}
                    </div>
                )}

                <div className="space-y-1">
                    <label className="font-medium">Tên *</label>
                    <input
                        placeholder={`Nhập tên ${label.toLowerCase()}`}
                        className="border p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                </div>

                {isDev && (
                    <div className="space-y-1">
                        <label className="font-medium">Mô tả</label>
                        <textarea
                            placeholder="Nhập mô tả (tuỳ chọn)"
                            rows={4}
                            className="border p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                        />
                    </div>
                )}

                <div className="space-y-1">
                    <label className="font-medium">Website</label>
                    <input
                        placeholder="https://example.com"
                        type="url"
                        className="border p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                        value={website}
                        onChange={e => setWebsite(e.target.value)}
                    />
                </div>

                <div className="flex gap-3 pt-1">
                    <button
                        type="submit"
                        disabled={mutation.isPending}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2.5 rounded-lg font-medium transition"
                    >
                        {mutation.isPending && <Loader2 size={16} className="animate-spin" />}
                        {mutation.isPending ? "Đang lưu..." : isEdit ? "Cập nhật" : "Lưu"}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate(backPath)}
                        className="px-6 py-2.5 rounded-lg border hover:bg-slate-50 font-medium transition"
                    >
                        Hủy
                    </button>
                </div>
            </form>
        </div>
    );
}