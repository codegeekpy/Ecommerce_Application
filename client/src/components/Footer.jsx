import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, RefreshCw, Headphones, ArrowRight, Globe, MessageSquare, Send } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 text-slate-400 text-sm mt-20">
      {/* Value Proposition Highlights */}
      <div className="border-b border-slate-800/80 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Express Global Delivery</h4>
                <p className="text-xs text-slate-400 mt-0.5">Complimentary express shipping on all orders over ₹9,999</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">2-Year Official Warranty</h4>
                <p className="text-xs text-slate-400 mt-0.5">Comprehensive hardware protection on every device</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 shrink-0">
                <RefreshCw className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">30-Day Hassle-Free Returns</h4>
                <p className="text-xs text-slate-400 mt-0.5">Unconditional return policy with instant prepaid labels</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 shrink-0">
                <Headphones className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">24/7 Concierge Support</h4>
                <p className="text-xs text-slate-400 mt-0.5">Direct access to product engineers and audio specialists</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-indigo-600 flex items-center justify-center shadow-glow-sm">
                <span className="font-extrabold text-white text-lg">A</span>
              </div>
              <span className="font-black text-xl text-white tracking-wider">AURA</span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              AURA engineers precision hardware, minimalist studio tools, and smart personal technology. Designed with architectural symmetry and built for discerning creators.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="#" className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 transition-colors">
                <Globe className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 transition-colors">
                <MessageSquare className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 transition-colors">
                <Send className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Catalog Columns */}
          <div>
            <h5 className="font-bold text-white text-xs uppercase tracking-wider mb-4">Collections</h5>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/products?category=Electronics" className="hover:text-brand-400 transition-colors">Electronics & Audio</Link></li>
              <li><Link to="/products?category=Smart Wearables" className="hover:text-brand-400 transition-colors">Smart Wearables</Link></li>
              <li><Link to="/products?category=Home & Studio" className="hover:text-brand-400 transition-colors">Home & Studio</Link></li>
              <li><Link to="/products?category=Accessories" className="hover:text-brand-400 transition-colors">Everyday Carry</Link></li>
              <li><Link to="/products" className="hover:text-brand-400 transition-colors">Complete Catalog</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-white text-xs uppercase tracking-wider mb-4">Customer Care</h5>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/orders" className="hover:text-brand-400 transition-colors">Track Live Order</Link></li>
              <li><a href="#shipping" className="hover:text-brand-400 transition-colors">Shipping Rates & Speed</a></li>
              <li><a href="#warranty" className="hover:text-brand-400 transition-colors">Warranty & Claims</a></li>
              <li><a href="#returns" className="hover:text-brand-400 transition-colors">Returns & Exchanges</a></li>
              <li><a href="#faq" className="hover:text-brand-400 transition-colors">Help Center & FAQ</a></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-white text-xs uppercase tracking-wider mb-4">Experience AURA</h5>
            <p className="text-xs text-slate-400 mb-3">Join our newsletter for limited production releases and member previews.</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter email"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
              />
              <button className="px-3 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white shrink-0 transition-colors">
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-10 mt-10 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© 2026 AURA Technologies Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#privacy" className="hover:text-slate-300">Privacy Policy</a>
            <a href="#terms" className="hover:text-slate-300">Terms of Service</a>
            <a href="#security" className="hover:text-slate-300">Security</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
