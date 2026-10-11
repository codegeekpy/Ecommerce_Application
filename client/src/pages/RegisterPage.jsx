import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await register(name, email, password);
    if (result.success) {
      navigate('/products');
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-3xl bg-slate-900/80 border border-slate-800 p-8 shadow-2xl backdrop-blur-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500 to-indigo-600 flex items-center justify-center mx-auto shadow-glow">
            <User className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-black text-white">Join AURA</h1>
          <p className="text-xs text-slate-400">Create your account for personalized recommendations and instant tracking</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="text-slate-300 font-medium">Full Name</label>
            <div className="relative">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Marcus Sterling"
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl py-2.5 pl-9 pr-3 text-white focus:outline-none focus:border-brand-500"
              />
              <User className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3.5" />
            </div>
          </div>

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
            <label className="text-slate-300 font-medium">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
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
            {loading ? 'Creating Account...' : 'Create Account'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-slate-400">
          <span>Already have an account? </span>
          <Link to="/login" className="text-brand-400 hover:underline font-semibold">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
