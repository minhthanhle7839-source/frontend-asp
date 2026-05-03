// src/pages/admin/Dashboard.tsx
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ArrowUpRight, Users, ShoppingCart, DollarSign, Gamepad2, Activity, Star, TrendingUp, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API_URL = 'https://le-minh-thanh.onrender.com/api';

export default function Dashboard() {
    const navigate = useNavigate();

    const { data: products } = useQuery({
        queryKey: ['admin-products-dash'],
        queryFn: () => axios.get(`${API_URL}/Product`).then(r => r.data)
    });

    const { data: users } = useQuery({
        queryKey: ['admin-users-dash'],
        queryFn: () => axios.get(`${API_URL}/users`).then(r => r.data)
    });

    const { data: orders } = useQuery({
        queryKey: ['admin-orders-dash'],
        queryFn: () => axios.get(`${API_URL}/orders`).then(r => r.data)
    });

    const totalRevenue = orders
        ?.filter((o: any) => o.paymentStatus === 'paid')
        .reduce((sum: number, o: any) => sum + o.totalPrice, 0) ?? 0;

    const completedOrders = orders?.filter((o: any) => o.orderStatus === 'completed').length ?? 0;
    const pendingOrders = orders?.filter((o: any) => o.orderStatus === 'processing').length ?? 0;
    const activeUsers = users?.filter((u: any) => u.status === 1).length ?? 0;

    // Top sản phẩm bán chạy (đếm theo orderItems)
    const productSalesMap: Record<number, { name: string; count: number; image: string }> = {};
    orders?.forEach((order: any) => {
        order.items?.forEach((item: any) => {
            const pid = item.productId;
            if (!productSalesMap[pid]) {
                productSalesMap[pid] = {
                    name: item.product?.name ?? `#${pid}`,
                    count: 0,
                    image: item.product?.images?.[0]?.imageUrl ?? ''
                };
            }
            productSalesMap[pid].count++;
        });
    });
    const topProducts = Object.values(productSalesMap)
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

    // Orders theo tháng (12 tháng gần nhất)
    const monthlyData = Array.from({ length: 12 }, (_, i) => {
        const d = new Date();
        d.setMonth(d.getMonth() - (11 - i));
        const month = d.getMonth();
        const year = d.getFullYear();
        const count = orders?.filter((o: any) => {
            const od = new Date(o.createdAt);
            return od.getMonth() === month && od.getFullYear() === year;
        }).length ?? 0;
        return { label: `T${d.getMonth() + 1}`, count };
    });
    const maxMonthly = Math.max(...monthlyData.map(m => m.count), 1);

    const recentOrders = [...(orders ?? [])].sort((a: any, b: any) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ).slice(0, 6);

    const stats = [
        {
            label: 'Tổng doanh thu',
            value: totalRevenue.toLocaleString() + 'đ',
            icon: DollarSign,
            color: 'bg-emerald-500',
            sub: `${completedOrders} đơn hoàn thành`
        },
        {
            label: 'Người dùng',
            value: (users?.length ?? 0).toLocaleString(),
            icon: Users,
            color: 'bg-blue-500',
            sub: `${activeUsers} đang hoạt động`
        },
        {
            label: 'Đơn hàng',
            value: (orders?.length ?? 0).toLocaleString(),
            icon: ShoppingCart,
            color: 'bg-purple-500',
            sub: `${pendingOrders} đang xử lý`
        },
        {
            label: 'Sản phẩm',
            value: (products?.length ?? 0).toLocaleString(),
            icon: Gamepad2,
            color: 'bg-orange-500',
            sub: `${products?.filter((p: any) => p.status === 1).length ?? 0} đang bán`
        },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Tổng quan hệ thống</h2>
                    <p className="text-slate-500 font-medium">Dữ liệu thực tế từ cơ sở dữ liệu</p>
                </div>
                <button
                    onClick={() => navigate('/admin/orders')}
                    className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-blue-600 transition-all flex items-center gap-2"
                >
                    <Activity size={18} /> Xem đơn hàng
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((item) => (
                    <div key={item.label} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                        <div className={`absolute top-0 right-0 w-32 h-32 ${item.color} opacity-[0.04] -mr-10 -mt-10 rounded-full transition-transform group-hover:scale-150`} />
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-2xl text-white ${item.color} shadow-lg`}>
                                <item.icon size={22} />
                            </div>
                            <ArrowUpRight size={16} className="text-slate-300" />
                        </div>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">{item.label}</p>
                        <h3 className="text-2xl font-black text-slate-800 mt-1 mb-1">{item.value}</h3>
                        <p className="text-xs text-slate-400">{item.sub}</p>
                    </div>
                ))}
            </div>

            {/* Chart + Top Products */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Monthly Orders Chart */}
                <div className="lg:col-span-2 bg-slate-900 rounded-3xl p-8 text-white">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-black flex items-center gap-2">
                                <TrendingUp size={18} className="text-blue-400" />
                                Đơn hàng theo tháng
                            </h3>
                            <p className="text-slate-500 text-xs mt-0.5">12 tháng gần nhất</p>
                        </div>
                        <span className="text-xs bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2.5 py-1 rounded-full font-bold">
                            {orders?.length ?? 0} tổng đơn
                        </span>
                    </div>

                    <div className="flex items-end gap-2 h-44">
                        {monthlyData.map((m, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-1.5 group">
                                <span className="text-[10px] text-slate-600 opacity-0 group-hover:opacity-100 transition font-bold">
                                    {m.count}
                                </span>
                                <div className="w-full relative">
                                    <div
                                        style={{ height: `${Math.max((m.count / maxMonthly) * 160, m.count > 0 ? 8 : 4)}px` }}
                                        className={`w-full rounded-t-lg transition-all ${m.count > 0 ? 'bg-gradient-to-t from-blue-600 to-blue-400 group-hover:from-blue-400 group-hover:to-cyan-300' : 'bg-slate-800'}`}
                                    />
                                </div>
                                <span className="text-[10px] text-slate-600 font-bold">{m.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Products */}
                <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
                    <h3 className="text-lg font-black mb-5 flex items-center gap-2">
                        <Star size={16} className="text-yellow-500" fill="currentColor" />
                        Game bán chạy
                    </h3>

                    {topProducts.length === 0 ? (
                        <div className="text-center py-10 text-slate-400">
                            <Package size={32} className="mx-auto mb-2 opacity-30" />
                            <p className="text-sm">Chưa có dữ liệu</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {topProducts.map((p, i) => (
                                <div key={i} className="flex items-center gap-3 group cursor-pointer"
                                    onClick={() => navigate('/admin/products')}>
                                    <span className={`text-xs font-black w-5 text-center ${i === 0 ? 'text-yellow-500' : i === 1 ? 'text-slate-400' : i === 2 ? 'text-orange-400' : 'text-slate-300'}`}>
                                        {i + 1}
                                    </span>
                                    <div className="w-10 h-10 rounded-xl bg-slate-100 overflow-hidden shrink-0">
                                        {p.image ? (
                                            <img src={p.image.startsWith('http') ? p.image : `https://le-minh-thanh.onrender.com${p.image}`}
                                                className="w-full h-full object-cover" alt={p.name} />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Gamepad2 size={14} className="text-slate-400" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-slate-800 text-sm truncate group-hover:text-blue-600 transition">{p.name}</p>
                                        <p className="text-xs text-slate-400">{p.count} lượt mua</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <button onClick={() => navigate('/admin/products')}
                        className="w-full mt-6 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 text-sm font-bold rounded-xl transition">
                        Xem tất cả sản phẩm
                    </button>
                </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
                    <h3 className="font-black text-lg">Đơn hàng gần đây</h3>
                    <button onClick={() => navigate('/admin/orders')}
                        className="text-sm text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1">
                        Xem tất cả <ArrowUpRight size={14} />
                    </button>
                </div>
                <table className="w-full text-sm">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th className="text-left px-6 py-3.5 font-semibold text-slate-500">ID</th>
                            <th className="text-left px-6 py-3.5 font-semibold text-slate-500">Khách hàng</th>
                            <th className="text-left px-6 py-3.5 font-semibold text-slate-500">Tổng tiền</th>
                            <th className="text-left px-6 py-3.5 font-semibold text-slate-500">Thanh toán</th>
                            <th className="text-left px-6 py-3.5 font-semibold text-slate-500">Trạng thái</th>
                            <th className="text-left px-6 py-3.5 font-semibold text-slate-500">Ngày</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {recentOrders.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="text-center py-12 text-slate-400">Chưa có đơn hàng</td>
                            </tr>
                        ) : recentOrders.map((order: any) => (
                            <tr key={order.id} className="hover:bg-slate-50 transition">
                                <td className="px-6 py-4 font-mono text-slate-400 text-xs">#{order.id}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-black shrink-0">
                                            {order.user?.username?.[0]?.toUpperCase() ?? 'U'}
                                        </div>
                                        <span className="font-semibold text-slate-700">{order.user?.username ?? `User #${order.userId}`}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 font-black text-blue-600">{order.totalPrice?.toLocaleString()}đ</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                        {order.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chờ TT'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${order.orderStatus === 'completed' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                                        {order.orderStatus === 'completed' ? 'Hoàn thành' : 'Đang xử lý'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-slate-400 text-xs">
                                    {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}