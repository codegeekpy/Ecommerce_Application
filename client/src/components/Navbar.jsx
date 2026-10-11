import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  ShoppingBag, 
  Search, 
  User, 
  ShieldCheck, 
  LogOut, 
  Package, 
  Menu, 
  X, 
  Sparkles, 
  Database,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import axios from 'axios';

export default function Navbar() {
  const { user, isAdmin, logout, quickDemoLogin } = useAuth();
  const { cartCount, setIsCartOpen } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dbStatus, setDbStatus] = useState('Checking...');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check DB status
    axios.get('/api/health')
      .then(res => setDbStatus(res.data.database))
      .catch(() => setDbStatus('Offline'));
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#0B0F19]/85 border-b border-white/[0.08] transition-all">
      {/* Top micro banner */}
      <div className="bg-gradient-to-r from-brand-900/60 via-purple-900/40 to-brand-900/60 border-b border-brand-500/10 px-4 py-1.5 text-xs text-center text-slate-300 flex items-center justify-center gap-3">
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-brand-400" />
          <span>Complimentary worldwide express shipping on orders over ₹9,999</span>
        </span>
        <span className="hidden md:inline text-slate-500">|</span>
        <div className="hidden md:flex items-center gap-2">
          <span className="text-slate-400">Demo Quick Switch:</span>
          <button
            onClick={() => quickDemoLogin('admin')}
            className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
              user?.role === 'admin' 
                ? 'bg-brand-500 text-white shadow-glow-sm' 
                : 'bg-white/5 hover:bg-white/10 text-slate-300'
            }`}
          >
            Admin View
          </button>
          <button
            onClick={() => quickDemoLogin('user')}
            className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
              user?.role === 'user' 
                ? 'bg-purple-600 text-white shadow-glow-sm' 
                : 'bg-white/5 hover:bg-white/10 text-slate-300'
            }`}
          >
            Customer View
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 via-indigo-600 to-purple-600 flex items-center justify-center shadow-glow group-hover:scale-105 transition-transform duration-300">
              <span className="font-extrabold text-white text-xl tracking-tighter">A</span>
            </div>
            <div className="flex flex-col">
              <span className="font-black text-lg tracking-wider text-white group-hover:text-brand-300 transition-colors">
                AURA
              </span>
              <span className="text-[10px] tracking-widest uppercase text-slate-400 -mt-1 font-semibold">
                STUDIO
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/products"
              className={`text-sm font-medium transition-colors hover:text-brand-400 ${
                location.pathname === '/products' ? 'text-brand-400 font-semibold' : 'text-slate-300'
              }`}
            >
              Catalog
            </Link>
            <Link
              to="/products?category=Electronics"
              className="text-sm font-medium text-slate-300 hover:text-brand-400 transition-colors"
            >
              Electronics
            </Link>
            <Link
              to="/products?category=Smart Wearables"
              className="text-sm font-medium text-slate-300 hover:text-brand-400 transition-colors"
            >
              Wearables
            </Link>
            <Link
              to="/orders"
              className={`text-sm font-medium transition-colors hover:text-brand-400 ${
                location.pathname === '/orders' ? 'text-brand-400 font-semibold' : 'text-slate-300'
              }`}
            >
              Track Order
            </Link>
          </nav>

          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} className="hidden lg:flex items-center flex-1 max-w-xs relative">
            <input
              type="text"
              placeholder="Search flagship gear..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/80 border border-slate-700/60 rounded-full py-1.5 pl-9 pr-4 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
          </form>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            {/* Database indicator */}
            <div 
              title={`Engine: ${dbStatus}`}
              className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-slate-300"
            >
              <span className={`w-2 h-2 rounded-full ${dbStatus.includes('MongoDB') ? 'bg-emerald-400 animate-pulse' : 'bg-cyan-400 animate-pulse'}`}></span>
              <span className="font-mono text-[10px] text-slate-400">{dbStatus.includes('MongoDB') ? 'MongoDB' : 'JSON DB'}</span>
            </div>

            {/* Cart Trigger Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/60 transition-all group"
              aria-label="View shopping bag"
            >
              <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-brand-500 to-indigo-600 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-glow-sm">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Dropdown */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 p-1.5 pr-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-slate-200 transition-all"
                >
                  <img
                    src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`}
                    alt={user.name}
                    className="w-7 h-7 rounded-lg object-cover ring-1 ring-brand-500/50"
                  />
                  <div className="hidden sm:flex flex-col text-left">
                    <span className="text-xs font-semibold text-slate-200 leading-tight max-w-[100px] truncate">
                      {user.name}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-brand-400">
                      {user.role}
                    </span>
                  </div>
                </button>

                {dropdownOpen && (
                  <div 
                    onMouseLeave={() => setDropdownOpen(false)}
                    className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
                  >
                    <div className="px-4 py-2 border-b border-slate-800">
                      <p className="text-xs text-slate-400">Signed in as</p>
                      <p className="text-sm font-semibold text-white truncate">{user.email}</p>
                      <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        user.role === 'admin' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-brand-500/20 text-brand-300'
                      }`}>
                        {user.role} Account
                      </span>
                    </div>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-amber-300 hover:bg-amber-500/10 transition-colors font-medium"
                      >
                        <ShieldCheck className="w-4 h-4 text-amber-400" />
                        Admin Dashboard
                      </Link>
                    )}

                    <Link
                      to="/orders"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-slate-200 hover:bg-slate-800/60 transition-colors"
                    >
                      <Package className="w-4 h-4 text-slate-400" />
                      Order History & Tracking
                    </Link>

                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-rose-300 hover:bg-rose-500/10 transition-colors text-left border-t border-slate-800 mt-1"
                    >
                      <LogOut className="w-4 h-4 text-rose-400" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-200 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 transition-all"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="hidden sm:inline-flex px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 shadow-glow-sm transition-all"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-800 flex flex-col gap-3">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 pl-9 pr-4 text-sm text-slate-200"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </form>
            <Link
              to="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-2 text-sm text-slate-200 hover:text-brand-400"
            >
              Browse Catalog
            </Link>
            <Link
              to="/orders"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-2 text-sm text-slate-200 hover:text-brand-400"
            >
              Track Orders
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="px-2 py-2 text-sm text-amber-300 font-semibold"
              >
                Admin Dashboard
              </Link>
            )}
            <div className="pt-2 border-t border-slate-800 flex gap-2">
              <button
                onClick={() => { quickDemoLogin('admin'); setMobileMenuOpen(false); }}
                className="flex-1 py-2 text-xs bg-brand-500/20 text-brand-300 rounded-lg text-center"
              >
                Switch to Admin
              </button>
              <button
                onClick={() => { quickDemoLogin('user'); setMobileMenuOpen(false); }}
                className="flex-1 py-2 text-xs bg-purple-500/20 text-purple-300 rounded-lg text-center"
              >
                Switch to User
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
