// src/pages/admin/orders/OrderList.tsx
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ShoppingBag, User, CreditCard, Clock, CheckCircle, XCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

const API_URL = 'https://le-minh-thanh.onrender.com/api';

export default function OrderList() {
    const [expandedId, setExpandedId] = useState<number | null>(null);

    const { data: orders, isLoading } = useQuery({
        queryKey: ['admin-orders'],
        queryFn: () => axios.get(`${API_URL}/orders`).then(r => r.data)
    });

    const statusColor = (status: string) => {
        if (status === 'completed') return 'bg-green-100 text-green-700';
        if (status === 'processing') return 'bg-yellow-100 text-yellow-700';
        return 'bg-red-100 text-red-700';
    };

    const paymentColor = (status: string) => {
        if (status === 'paid') return 'bg-green-100 text-green-700';
        if (status === 'pending') return 'bg-yellow-100 text-yellow-700';
        return 'bg-red-100 text-red-700';
    };

    if (isLoading) return (
        <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500" />
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Đơn hàng</h2>
                <p className="text-slate-500">Danh sách tất cả đơn hàng trong hệ thống</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Tổng đơn', value: orders?.length ?? 0, icon: ShoppingBag, color: 'text-blue-600 bg-blue-50' },
                    { label: 'Hoàn thành', value: orders?.filter((o: any) => o.orderStatus === 'completed').length ?? 0, icon: CheckCircle, color: 'text-green-600 bg-green-50' },
                    { label: 'Đang xử lý', value: orders?.filter((o: any) => o.orderStatus === 'processing').length ?? 0, icon: Clock, color: 'text-yellow-600 bg-yellow-50' },
                    {
                        label: 'Doanh thu',
                        value: (orders?.filter((o: any) => o.paymentStatus === 'paid').reduce((sum: number, o: any) => sum + o.totalPrice, 0) ?? 0).toLocaleString() + 'đ',
                        icon: CreditCard,
                        color: 'text-purple-600 bg-purple-50'
                    },
                ].map((stat) => (
                    <div key={stat.label} className="bg-white rounded-2xl border p-5 flex items-center gap-4 shadow-sm">
                        <div className={`p-3 rounded-xl ${stat.color}`}>
                            <stat.icon size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500">{stat.label}</p>
                            <p className="text-xl font-black text-slate-800">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-slate-50 border-b">
                        <tr>
                            <th className="text-left px-5 py-3.5 font-semibold text-slate-600">ID</th>
                            <th className="text-left px-5 py-3.5 font-semibold text-slate-600">Người dùng</th>
                            <th className="text-left px-5 py-3.5 font-semibold text-slate-600">Tổng tiền</th>
                            <th className="text-left px-5 py-3.5 font-semibold text-slate-600">Thanh toán</th>
                            <th className="text-left px-5 py-3.5 font-semibold text-slate-600">Trạng thái</th>
                            <th className="text-left px-5 py-3.5 font-semibold text-slate-600">Ngày tạo</th>
                            <th className="px-5 py-3.5" />
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {orders?.length === 0 && (
                            <tr>
                                <td colSpan={7} className="text-center py-16 text-slate-400">
                                    Chưa có đơn hàng nào
                                </td>
                            </tr>
                        )}
                        {orders?.map((order: any) => (
                            <>
                                <tr
                                    key={order.id}
                                    className="hover:bg-slate-50 transition cursor-pointer"
                                    onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
                                >
                                    <td className="px-5 py-4 font-mono text-slate-500">#{order.id}</td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                                                {order.user?.username?.[0]?.toUpperCase() ?? 'U'}
                                            </div>
                                            <span className="font-medium text-slate-700">{order.user?.username ?? `User #${order.userId}`}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 font-bold text-blue-600">
                                        {order.totalPrice?.toLocaleString()}đ
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${paymentColor(order.paymentStatus)}`}>
                                            {order.paymentStatus === 'paid' ? 'Đã thanh toán' : order.paymentStatus === 'pending' ? 'Chờ thanh toán' : order.paymentStatus}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColor(order.orderStatus)}`}>
                                            {order.orderStatus === 'completed' ? 'Hoàn thành' : order.orderStatus === 'processing' ? 'Đang xử lý' : order.orderStatus}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 text-slate-500">
                                        {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                                    </td>
                                    <td className="px-5 py-4 text-slate-400">
                                        {expandedId === order.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                    </td>
                                </tr>

                                {/* Expanded row — order items */}
                                {expandedId === order.id && (
                                    <tr key={`${order.id}-detail`}>
                                        <td colSpan={7} className="bg-slate-50 px-5 py-4 border-t border-slate-100">
                                            <div className="space-y-2">
                                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Sản phẩm trong đơn</p>
                                                {order.items?.length === 0 && (
                                                    <p className="text-slate-400 text-sm">Không có sản phẩm</p>
                                                )}
                                                {order.items?.map((item: any) => (
                                                    <div key={item.id} className="flex items-center justify-between bg-white rounded-xl px-4 py-3 border border-slate-200">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                                                                <ShoppingBag size={14} className="text-blue-500" />
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold text-slate-700">{item.product?.name ?? `Product #${item.productId}`}</p>
                                                                <p className="text-xs text-slate-400">ID: {item.productId}</p>
                                                            </div>
                                                        </div>
                                                        <span className="font-bold text-blue-600">{item.price?.toLocaleString()}đ</span>
                                                    </div>
                                                ))}

                                                {/* Payment info */}
                                                {order.payment && (
                                                    <div className="mt-3 pt-3 border-t border-slate-200 flex items-center gap-6 text-xs text-slate-500">
                                                        <span><strong>Phương thức:</strong> {order.payment.paymentMethod}</span>
                                                        <span><strong>Mã GD:</strong> {order.payment.transactionId}</span>
                                                        <span><strong>Thời gian:</strong> {new Date(order.payment.createdAt).toLocaleString('vi-VN')}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}