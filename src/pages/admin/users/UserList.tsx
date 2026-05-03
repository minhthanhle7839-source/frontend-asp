import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Users, UserCheck, UserX, Search, X, Globe, Phone, Calendar } from 'lucide-react';
import { useState } from 'react';

const API_URL = 'https://le-minh-thanh.onrender.com/api';

export default function UserList() {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | '1' | '0'>('all');

    const { data: users, isLoading } = useQuery({
        queryKey: ['admin-users'],
        queryFn: () => axios.get(`${API_URL}/users`).then(r => r.data)
    });

    const filtered = users?.filter((u: any) => {
        const matchSearch = u.username?.toLowerCase().includes(search.toLowerCase())
            || u.email?.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === 'all' ? true : String(u.status) === statusFilter;
        return matchSearch && matchStatus;
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Người dùng</h2>
                <p className="text-slate-500">Danh sách tài khoản trong hệ thống</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                {[
                    { label: 'Tổng người dùng', value: users?.length ?? 0, icon: Users, color: 'text-blue-600 bg-blue-50' },
                    { label: 'Đang hoạt động', value: users?.filter((u: any) => u.status === 1).length ?? 0, icon: UserCheck, color: 'text-green-600 bg-green-50' },
                    { label: 'Bị khoá', value: users?.filter((u: any) => u.status === 0).length ?? 0, icon: UserX, color: 'text-red-600 bg-red-50' },
                ].map(s => (
                    <div key={s.label} className="bg-white rounded-2xl border p-5 flex items-center gap-4 shadow-sm">
                        <div className={`p-3 rounded-xl ${s.color}`}>
                            <s.icon size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500">{s.label}</p>
                            <p className="text-2xl font-black text-slate-800">{s.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3 flex-wrap">
                <div className="relative flex-1 max-w-sm">
                    <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        placeholder="Tìm theo tên hoặc email..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full border border-slate-200 rounded-xl pl-10 pr-8 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 bg-white"
                    />
                    {search && (
                        <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                            <X size={13} />
                        </button>
                    )}
                </div>
                <div className="flex gap-2">
                    {([['all', 'Tất cả'], ['1', 'Hoạt động'], ['0', 'Bị khoá']] as const).map(([val, label]) => (
                        <button key={val}
                            onClick={() => setStatusFilter(val)}
                            className={`px-4 py-2.5 rounded-xl text-sm font-semibold border transition ${statusFilter === val ? 'bg-slate-900 text-white border-slate-900' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}>
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
                {isLoading ? (
                    <div className="flex items-center justify-center h-40">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500" />
                    </div>
                ) : (
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 border-b">
                            <tr>
                                <th className="text-left px-5 py-3.5 font-semibold text-slate-500">Người dùng</th>
                                <th className="text-left px-5 py-3.5 font-semibold text-slate-500">Liên hệ</th>
                                <th className="text-left px-5 py-3.5 font-semibold text-slate-500">Quốc gia</th>
                                <th className="text-left px-5 py-3.5 font-semibold text-slate-500">Ngày tạo</th>
                                <th className="text-left px-5 py-3.5 font-semibold text-slate-500">Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filtered?.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="text-center py-16 text-slate-400">
                                        Không tìm thấy người dùng nào
                                    </td>
                                </tr>
                            )}
                            {filtered?.map((user: any) => (
                                <tr key={user.id} className="hover:bg-slate-50 transition">
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-black text-sm shrink-0">
                                                {user.username?.[0]?.toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-800">{user.username}</p>
                                                <p className="text-xs text-slate-400">#{user.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="space-y-0.5">
                                            <p className="text-slate-700 flex items-center gap-1.5">
                                                <span className="text-slate-400">@</span> {user.email}
                                            </p>
                                            {user.phone && (
                                                <p className="text-xs text-slate-400 flex items-center gap-1">
                                                    <Phone size={11} /> {user.phone}
                                                </p>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-1.5 text-slate-600">
                                            <Globe size={13} className="text-slate-400" />
                                            {user.country || '—'}
                                        </div>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                                            <Calendar size={12} />
                                            {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                                        </div>
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${user.status === 1 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${user.status === 1 ? 'bg-green-500' : 'bg-red-500'}`} />
                                            {user.status === 1 ? 'Hoạt động' : 'Bị khoá'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {/* Footer count */}
                {filtered && (
                    <div className="px-5 py-3 border-t bg-slate-50 text-xs text-slate-400">
                        Hiển thị {filtered.length} / {users?.length ?? 0} người dùng
                    </div>
                )}
            </div>
        </div>
    );
}