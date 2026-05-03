"use client";

import { Link, Outlet, useLocation } from "react-router-dom";
import { Building2, Code, LayoutDashboard, Package, Tag, LogOut, ShoppingBag } from "lucide-react";

export const AdminLayout = () => {
    const location = useLocation();

    const menuItems = [
        { path: "/admin", label: "Dashboard", icon: LayoutDashboard },
        { path: "/admin/products", label: "Sản phẩm", icon: Package },
        { path: "/admin/categories", label: "Danh mục", icon: Tag },
        { path: "/admin/developers", label: "Nhà phát triển", icon: Code },
        { path: "/admin/publishers", label: "Nhà phát hành", icon: Building2 },
        { path: '/admin/orders', label: 'Đơn hàng', icon: ShoppingBag }
    ];

    return (
        <div className="min-h-screen flex bg-slate-100">

            {/* SIDEBAR */}
            <aside className="w-64 bg-slate-900 text-white flex flex-col">
                <div className="p-6 font-bold text-blue-400 text-lg">
                    🎮 Admin
                </div>

                <nav className="flex-1 p-3 space-y-2">
                    {menuItems.map((item) => {
                        const active = location.pathname.startsWith(item.path);
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition
                                ${active
                                        ? "bg-blue-600 text-white"
                                        : "text-slate-400 hover:bg-slate-800 hover:text-white"
                                    }`}
                            >
                                <Icon size={18} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <button className="flex items-center gap-2 text-red-400">
                        <LogOut size={18} /> Logout
                    </button>
                </div>
            </aside>

            {/* CONTENT */}
            <div className="flex-1 flex flex-col">
                <header className="bg-white p-4 shadow flex justify-between">
                    <h1 className="font-bold">Admin Panel</h1>
                </header>

                <main className="p-6">
                    <div className="bg-white p-6 rounded-2xl shadow">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};