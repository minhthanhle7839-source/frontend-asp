import { ArrowUpRight, Users, ShoppingCart, DollarSign, Gamepad2, Activity, Star } from 'lucide-react';

const Dashboard = () => {
    const stats = [
        { label: 'Tổng doanh thu', value: '128.450.000đ', icon: <DollarSign size={24} />, trend: '+12.5%', color: 'bg-emerald-500' },
        { label: 'Người dùng mới', value: '1,240', icon: <Users size={24} />, trend: '+5.2%', color: 'bg-blue-500' },
        { label: 'Đơn hàng', value: '458', icon: <ShoppingCart size={24} />, trend: '+18.1%', color: 'bg-purple-500' },
        { label: 'Sản phẩm', value: '86', icon: <Gamepad2 size={24} />, trend: '+2', color: 'bg-orange-500' },
    ];

    return (
        <div className="space-y-8">
            {/* 1. Header & Quick Action */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Tổng quan hệ thống</h2>
                    <p className="text-slate-500 font-medium">Dữ liệu được cập nhật thực tế từ Store của bạn.</p>
                </div>
                <button className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-slate-200 hover:bg-blue-600 transition-all flex items-center gap-2">
                    <Activity size={18} /> Xuất báo cáo
                </button>
            </div>

            {/* 2. Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((item, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                        <div className={`absolute top-0 right-0 w-24 h-24 ${item.color} opacity-[0.03] -mr-8 -mt-8 rounded-full transition-transform group-hover:scale-150`}></div>
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-2xl text-white ${item.color} shadow-lg shadow-inherit/20`}>
                                {item.icon}
                            </div>
                            <span className="flex items-center gap-1 text-emerald-600 text-sm font-bold bg-emerald-50 px-2 py-1 rounded-lg">
                                {item.trend} <ArrowUpRight size={14} />
                            </span>
                        </div>
                        <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">{item.label}</p>
                        <h3 className="text-2xl font-black text-slate-800 mt-1">{item.value}</h3>
                    </div>
                ))}
            </div>

            {/* 3. Charts & Popular Games Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Giả lập biểu đồ - Cột trái rộng hơn */}
                <div className="lg:col-span-2 bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                            Biểu đồ tăng trưởng <span className="text-[10px] bg-blue-500 px-2 py-0.5 rounded uppercase">Live</span>
                        </h3>
                        {/* Fake Chart Bars */}
                        <div className="flex items-end justify-between h-48 gap-2">
                            {[40, 70, 45, 90, 65, 80, 50, 95, 60, 75, 85, 100].map((h, i) => (
                                <div key={i} className="flex-1 group relative">
                                    <div
                                        style={{ height: `${h}%` }}
                                        className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg transition-all group-hover:from-blue-400 group-hover:to-white"
                                    ></div>
                                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-slate-900 text-[10px] font-bold py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                        {h}%
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between mt-4 text-slate-500 text-xs font-bold uppercase">
                            <span>Tháng 1</span>
                            <span>Tháng 6</span>
                            <span>Tháng 12</span>
                        </div>
                    </div>
                </div>

                {/* Popular Games - Cột phải */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6">
                    <h3 className="text-lg font-black mb-6">Game bán chạy</h3>
                    <div className="space-y-6">
                        {[
                            { name: 'Cyberpunk 2077', sales: 120, img: 'https://images.unsplash.com/photo-1605898835373-02f74446e8ca?w=100' },
                            { name: 'Elden Ring', sales: 95, img: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=100' },
                            { name: 'Valorant', sales: 84, img: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=100' },
                        ].map((game, i) => (
                            <div key={i} className="flex items-center gap-4 group cursor-pointer">
                                <img src={game.img} className="w-12 h-12 rounded-xl object-cover ring-2 ring-slate-100 group-hover:ring-blue-500 transition-all" alt="" />
                                <div className="flex-1">
                                    <p className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{game.name}</p>
                                    <p className="text-xs text-slate-400 font-medium">{game.sales} bản đã bán</p>
                                </div>
                                <div className="flex text-yellow-400"><Star size={12} fill="currentColor" /></div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-8 py-3 bg-slate-50 text-slate-600 text-sm font-bold rounded-xl hover:bg-slate-100 transition-colors">
                        Xem tất cả sản phẩm
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;