import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  CreditCard, 
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { formatPrice } from '../utils/formatCurrency';

export default function OrderDetailsPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    axios.get(`/api/orders/${id}`)
      .then(res => setOrder(res.data))
      .catch(err => {
        console.error('Failed to load order:', err);
        setError(err.response?.data?.message || 'Unable to load order details');
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 animate-pulse space-y-6">
        <div className="h-8 w-64 bg-slate-800 rounded" />
        <div className="h-48 bg-slate-800 rounded-3xl" />
        <div className="h-64 bg-slate-800 rounded-3xl" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-md mx-auto py-24 text-center px-4 space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-white">Order Not Found</h2>
        <p className="text-xs text-slate-400">{error || 'Please make sure you have the right order identifier and permissions.'}</p>
        <Link to="/orders" className="inline-block px-5 py-2.5 rounded-xl bg-brand-600 text-white text-xs font-semibold">
          View All My Orders
        </Link>
      </div>
    );
  }

  const steps = [
    { key: 'Pending', label: 'Order Confirmed', icon: CheckCircle2 },
    { key: 'Processing', label: 'Processing in Hub', icon: Clock },
    { key: 'Shipped', label: 'In Transit', icon: Truck },
    { key: 'Delivered', label: 'Delivered', icon: Package }
  ];

  const getStepIndex = (status) => {
    switch (status) {
      case 'Pending': return 0;
      case 'Processing': return 1;
      case 'Shipped': return 2;
      case 'Delivered': return 3;
      case 'Cancelled': return -1;
      default: return 1;
    }
  };

  const currentStepIdx = getStepIndex(order.status);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <Link to="/orders" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Orders</span>
        </Link>
        <span className="text-xs text-slate-400">
          Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
      </div>

      {/* Hero Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6 shadow-2xl backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-brand-400">Order Tracking</span>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
              Order #{order._id.substring(0, 10).toUpperCase()}
            </h1>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
              <span>Carrier: <strong>{order.carrier || 'FedEx Express'}</strong></span>
              <span>•</span>
              <span>Tracking: <strong className="font-mono text-brand-300">{order.trackingNumber || 'AUR-982134'}</strong></span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
              order.status === 'Delivered'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : order.status === 'Cancelled'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                : 'bg-brand-500/20 text-brand-300 border border-brand-500/30 animate-pulse'
            }`}>
              Status: {order.status}
            </span>
          </div>
        </div>

        {/* 4-Step Visual Progress Stepper */}
        {order.status !== 'Cancelled' ? (
          <div className="pt-4">
            <div className="grid grid-cols-4 gap-2 text-center">
              {steps.map((s, idx) => {
                const Icon = s.icon;
                const isPassed = idx <= currentStepIdx;
                const isCurrent = idx === currentStepIdx;

                return (
                  <div key={s.key} className="flex flex-col items-center gap-2">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
                      isCurrent
                        ? 'bg-brand-600 text-white shadow-glow'
                        : isPassed
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-500 border border-slate-700/50'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`text-[11px] font-semibold leading-tight ${
                      isCurrent ? 'text-white' : isPassed ? 'text-slate-300' : 'text-slate-500'
                    }`}>
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs text-center">
            This order was cancelled. Any authorizations have been voided.
          </div>
        )}
      </div>

      {/* Status History Timeline */}
      {order.statusHistory && order.statusHistory.length > 0 && (
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Clock className="w-4 h-4 text-brand-400" />
            <span>Package Milestone History</span>
          </h3>
          <div className="divide-y divide-slate-800/80 text-xs">
            {order.statusHistory.map((item, idx) => (
              <div key={idx} className="py-3 first:pt-0 last:pb-0 flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-white">{item.status}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{item.note}</p>
                </div>
                <span className="text-[11px] text-slate-500 font-mono shrink-0">
                  {new Date(item.timestamp).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grid: Items & Shipping Destination */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Ordered Items */}
        <div className="md:col-span-7 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Package className="w-4 h-4 text-brand-400" />
            <span>Items in this Shipment</span>
          </h3>

          <div className="divide-y divide-slate-800/80">
            {order.orderItems?.map(item => (
              <div key={item.product || item._id} className="py-3 first:pt-0 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover bg-slate-950 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-white">{item.name}</h4>
                    <p className="text-[11px] text-slate-400">Qty: {item.qty} × {formatPrice(item.price)}</p>
                  </div>
                </div>
                <span className="font-bold text-white">{formatPrice(item.price * item.qty)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping & Payment Summary */}
        <div className="md:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3 text-xs">
            <h3 className="font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-brand-400" />
              <span>Shipping Destination</span>
            </h3>
            <div className="text-slate-300 leading-relaxed">
              <p className="font-bold text-white">{order.shippingAddress?.fullName}</p>
              <p>{order.shippingAddress?.address}</p>
              <p>{order.shippingAddress?.city}, {order.shippingAddress?.postalCode}</p>
              <p>{order.shippingAddress?.country}</p>
              <p className="text-slate-400 mt-1">Phone: {order.shippingAddress?.phone}</p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3 text-xs text-slate-300">
            <h3 className="font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-brand-400" />
              <span>Payment Details</span>
            </h3>
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span>Method</span>
                <span className="text-white font-medium">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="text-white font-medium">{formatPrice(order.itemsPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-white font-medium">{formatPrice(order.shippingPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated GST</span>
                <span className="text-white font-medium">{formatPrice(order.taxPrice)}</span>
              </div>
              <div className="pt-2 border-t border-slate-800 flex justify-between font-black text-sm text-white">
                <span>Total Paid</span>
                <span className="text-brand-300">{formatPrice(order.totalPrice)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
