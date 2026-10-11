import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Package, Truck, ChevronRight, ShoppingBag, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/formatCurrency';

export default function MyOrdersPage() {
  const { user, quickDemoLogin } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    axios.get('/api/orders/myorders')
      .then(res => setOrders(res.data || []))
      .catch(err => console.error('Failed to load orders:', err))
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-24 text-center px-4 space-y-6">
        <div className="w-16 h-16 rounded-full bg-slate-800 mx-auto flex items-center justify-center text-slate-400">
          <Clock className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-white">Track Your Shipments</h2>
          <p className="text-xs text-slate-400">
            Sign in to your account to review live delivery status, receipts, and order histories.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <Link to="/login" className="px-5 py-2.5 rounded-xl bg-brand-600 text-white text-xs font-semibold shadow-glow-sm">
            Sign In
          </Link>
          <button
            onClick={() => quickDemoLogin('user')}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
          >
            Switch to Demo User
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-brand-400">Account Dashboard</span>
        <h1 className="text-3xl font-extrabold text-white mt-1">Order History & Tracking</h1>
        <p className="text-xs text-slate-400 mt-1">Real-time status, milestone tracking, and invoices for your orders.</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 rounded-2xl bg-slate-900/60 border border-slate-800 animate-pulse" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-slate-900/40 border border-slate-800 space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-800 mx-auto flex items-center justify-center text-slate-500">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-white">No active orders found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            You haven't placed any orders yet. Discover our latest collection and enjoy complimentary shipping.
          </p>
          <Link
            to="/products"
            className="inline-block px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-glow-sm"
          >
            Explore Catalog
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div
              key={order._id}
              className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-brand-500/40 transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-6 group"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold text-brand-300">
                    #{order._id.substring(0, 10).toUpperCase()}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    order.status === 'Delivered'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : order.status === 'Cancelled'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : 'bg-brand-500/20 text-brand-300 border border-brand-500/30'
                  }`}>
                    {order.status}
                  </span>
                </div>

                <p className="text-xs text-slate-400">
                  Ordered on {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  {' '} • Tracking: <span className="font-mono text-slate-300">{order.trackingNumber || 'Pending'}</span>
                </p>

                {/* Items thumbnail list */}
                <div className="flex items-center gap-2 pt-1">
                  {order.orderItems?.slice(0, 4).map((item, idx) => (
                    <img
                      key={idx}
                      src={item.image}
                      alt={item.name}
                      title={`${item.name} (Qty: ${item.qty})`}
                      className="w-10 h-10 rounded-lg object-cover bg-slate-950 border border-slate-800"
                    />
                  ))}
                  {order.orderItems?.length > 4 && (
                    <span className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-300">
                      +{order.orderItems.length - 4}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                <div className="text-left sm:text-right">
                  <p className="text-xs text-slate-400">Total Amount</p>
                  <p className="text-base font-black text-white">{formatPrice(order.totalPrice)}</p>
                </div>

                <Link
                  to={`/orders/${order._id}`}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-brand-600 text-slate-200 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
                >
                  <Truck className="w-3.5 h-3.5" />
                  <span>Track Package</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
