import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, ShieldCheck, UserCheck, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, quickDemoLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(email, password);
    if (result.success) {
      navigate(from, { replace: true });
    }
  };

  const handleDemo = async (role) => {
    const result = await quickDemoLogin(role);
    if (result.success) {
      navigate(role === 'admin' ? '/admin' : from, { replace: true });
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-3xl bg-slate-900/80 border border-slate-800 p-8 shadow-2xl backdrop-blur-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500 to-indigo-600 flex items-center justify-center mx-auto shadow-glow">
            <Lock className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-black text-white">Sign In to AURA</h1>
          <p className="text-xs text-slate-400">Access your orders, saved addresses, and profile settings</p>
        </div>

        {/* Demo Fast Buttons */}
        <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2">
          <p className="text-[11px] font-semibold text-slate-400 text-center uppercase tracking-wider">
            ⚡ 1-Click Demo Accounts
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDemo('admin')}
              className="py-2 px-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin View</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemo('user')}
              className="py-2 px-3 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Customer View</span>
            </button>
          </div>
        </div>

        {/* Standard Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="text-slate-300 font-medium">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl py-2.5 pl-9 pr-3 text-white focus:outline-none focus:border-brand-500"
              />
              <Mail className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3.5" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-slate-300 font-medium">Password</label>
            </div>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl py-2.5 pl-9 pr-3 text-white focus:outline-none focus:border-brand-500"
              />
              <Lock className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-xs shadow-glow-sm hover:shadow-glow transition-all flex items-center justify-center gap-2"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-slate-400">
          <span>Don't have an account yet? </span>
          <Link to="/register" className="text-brand-400 hover:underline font-semibold">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
}
