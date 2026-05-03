// src/pages/admin/entities/EntityList.tsx
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { developerService } from '../../../api/developerService';
import { publisherService } from '../../../api/publisherService';
import { Globe, Building2, Plus, ExternalLink, Calendar, Trash2, Loader2 } from 'lucide-react';

interface Props {
    type: 'developer' | 'publisher';
}

const EntityList = ({ type }: Props) => {
    const isDev = type === 'developer';
    const service = isDev ? developerService : publisherService;
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const basePath = isDev ? '/admin/developers' : '/admin/publishers';
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const { data: entities, isLoading } = useQuery({
        queryKey: [type],
        queryFn: () => service.getAll().then(res => res.data)
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => service.delete(id),
        onMutate: (id) => setDeletingId(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: [type] }),
        onSettled: () => setDeletingId(null)
    });

    const handleDelete = (id: number, name: string) => {
        if (confirm(`Xoá "${name}"? Hành động này không thể hoàn tác.`)) {
            deleteMutation.mutate(id);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-40">
                <Loader2 className="animate-spin text-blue-500" size={32} />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* HEADER */}
            <div className="flex items-end justify-between">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                        {isDev ? 'Nhà phát triển' : 'Nhà phát hành'}
                    </h2>
                    <p className="text-slate-500">
                        Quản lý đối tác và đơn vị sản xuất nội dung
                    </p>
                </div>

                <button
                    onClick={() => navigate(`${basePath}/add`)}
                    className="bg-slate-900 hover:bg-blue-600 text-white p-3 rounded-xl transition-all shadow-lg"
                >
                    <Plus size={24} />
                </button>
            </div>

            {/* LIST */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {entities?.map((item: any) => (
                    <div
                        key={item.id}
                        className="group bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:shadow-slate-200/50 transition-all border-b-4 hover:border-b-blue-500"
                    >
                        {/* TOP */}
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-2xl ${isDev ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                                <Building2 size={24} />
                            </div>

                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded">
                                ID: #{item.id}
                            </span>
                        </div>

                        {/* NAME */}
                        <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">
                            {item.name}
                        </h3>

                        {/* DESCRIPTION */}
                        <p className="text-slate-500 text-sm line-clamp-2 mb-6 h-10 italic">
                            {'description' in item && item.description
                                ? item.description
                                : 'Chưa có thông tin mô tả chi tiết về đơn vị này.'}
                        </p>

                        {/* INFO */}
                        <div className="space-y-3 border-t border-slate-50 pt-4">
                            {item.website && (
                                <a
                                    href={item.website}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-2 text-sm text-blue-500 hover:underline font-medium"
                                >
                                    <Globe size={14} />
                                    Website chính thức
                                    <ExternalLink size={12} />
                                </a>
                            )}

                            <div className="flex items-center gap-2 text-xs text-slate-400">
                                <Calendar size={14} />
                                Gia nhập:{' '}
                                {item.createdAt
                                    ? new Date(item.createdAt).toLocaleDateString('vi-VN')
                                    : 'N/A'}
                            </div>
                        </div>

                        {/* ACTIONS */}
                        <div className="mt-6 flex gap-2">
                            <button
                                onClick={() => navigate(`${basePath}/edit/${item.id}`)}
                                className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold py-2 rounded-lg text-sm transition-colors"
                            >
                                Sửa
                            </button>

                            <button
                                onClick={() => handleDelete(item.id!, item.name)}
                                disabled={deletingId === item.id}
                                className="px-3 bg-red-50 hover:bg-red-500 hover:text-white text-red-500 rounded-lg transition-all disabled:opacity-50"
                            >
                                {deletingId === item.id ? (
                                    <Loader2 size={16} className="animate-spin" />
                                ) : (
                                    <Trash2 size={16} />
                                )}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* EMPTY */}
            {entities?.length === 0 && (
                <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                    <p className="text-slate-400">
                        Chưa có dữ liệu. Hãy thêm mới ngay!
                    </p>
                </div>
            )}
        </div>
    );
};

export default EntityList;