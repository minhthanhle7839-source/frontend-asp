import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Gamepad2, Library, User, LogOut, LogIn, Search, X } from 'lucide-react';

interface NavbarProps {
    search?: string;
    onSearchChange?: (v: string) => void;
    showSearch?: boolean;
}

export default function Navbar({ search, onSearchChange, showSearch = true }: NavbarProps) {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, isLoggedIn, logout } = useAuth();
    const [showMenu, setShowMenu] = useState(false);

    const navLinks = [
        { path: '/', label: 'Trang chủ' },
        { path: '/store', label: 'Cửa hàng' },
    ];

    return (
        <nav className="sticky top-0 z-50 bg-[#080b12]/90 backdrop-blur-xl border-b border-white/5">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-6">
                {/* Logo */}
                <div onClick={() => navigate('/')} className="flex items-center gap-2 cursor-pointer shrink-0">
                    <div className="bg-blue-600 p-1.5 rounded-lg shadow-lg shadow-blue-600/30">
                        <Gamepad2 size={18} className="text-white" />
                    </div>
                    <span className="text-lg font-black tracking-tighter text-white">MT<span className="text-blue-500">STORE</span></span>
                </div>

                {/* Nav links */}
                <div className="hidden md:flex items-center gap-1">
                    {navLinks.map(l => (
                        <button
                            key={l.path}
                            onClick={() => navigate(l.path)}
                            className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${location.pathname === l.path
                                ? 'bg-white/10 text-white'
                                : 'text-gray-500 hover:text-gray-200 hover:bg-white/5'
                                }`}
                        >
                            {l.label}
                        </button>
                    ))}
                </div>

                {/* Search */}
                {showSearch && onSearchChange && (
                    <div className="flex-1 max-w-md hidden md:block">
                        <div className="relative">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600" size={15} />
                            <input
                                type="text"
                                placeholder="Tìm kiếm trò chơi..."
                                value={search}
                                onChange={e => onSearchChange(e.target.value)}
                                className="w-full bg-white/5 border border-white/8 rounded-xl py-2.5 pl-10 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition placeholder-gray-700 text-gray-200"
                                style={{ fontFamily: "'DM Sans', sans-serif" }}
                            />
                            {search && (
                                <button onClick={() => onSearchChange('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-300">
                                    <X size={13} />
                                </button>
                            )}
                        </div>
                    </div>
                )}

                <div className="ml-auto flex items-center gap-3 shrink-0">
                    {isLoggedIn ? (
                        <div className="relative">
                            <button
                                onClick={() => setShowMenu(!showMenu)}
                                className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-3 py-2 transition"
                            >
                                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-xs font-black">
                                    {user.username?.[0]?.toUpperCase()}
                                </div>
                                <span className="text-sm font-medium hidden sm:block text-gray-200">{user.username}</span>
                            </button>
                            {showMenu && (
                                <div className="absolute right-0 top-full mt-2 w-48 bg-[#0f1623] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50">
                                    <button onClick={() => { navigate('/library'); setShowMenu(false); }}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-white/5 transition text-left text-gray-300">
                                        <Library size={15} className="text-blue-400" /> Thư viện của tôi
                                    </button>
                                    <button onClick={() => { navigate('/profile'); setShowMenu(false); }}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-white/5 transition text-left text-gray-300">
                                        <User size={15} className="text-gray-400" /> Trang cá nhân
                                    </button>
                                    <div className="border-t border-white/5" />
                                    <button onClick={() => { logout(); setShowMenu(false); }}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-red-500/10 text-red-400 transition text-left">
                                        <LogOut size={15} /> Đăng xuất
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button onClick={() => navigate('/login')}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition shadow-lg shadow-blue-600/20">
                            <LogIn size={15} /> Đăng nhập
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
}