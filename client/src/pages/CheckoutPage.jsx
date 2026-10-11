import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  ShieldCheck, 
  CreditCard, 
  Truck, 
  CheckCircle2, 
  Lock, 
  ArrowLeft,
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { formatPrice } from '../utils/formatCurrency';

export default function CheckoutPage() {
  const { cartItems, subtotal, shipping, tax, total, clearCart } = useCart();
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: user?.name || 'Alexander Wright',
    address: '42 MG Road, Indiranagar',
    city: 'Bengaluru',
    postalCode: '560038',
    country: 'India',
    phone: '+91 98765 43210',
    cardNumber: '•••• •••• •••• 4242',
    cardExp: '12/28',
    cardCvc: '888',
    shippingSpeed: 'standard'
  });

  const [submitting, setSubmitting] = useState(false);

  if (cartItems.length === 0) {
    return (
      <div className="max-w-md mx-auto py-24 text-center px-4 space-y-4">
        <div className="w-16 h-16 rounded-full bg-slate-800 mx-auto flex items-center justify-center text-slate-500">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white">Your Shopping Bag is Empty</h2>
        <p className="text-xs text-slate-400">Please select equipment from our catalog before proceeding to checkout.</p>
        <Link
          to="/products"
          className="inline-block px-5 py-2.5 rounded-xl bg-brand-600 text-white text-xs font-semibold shadow-glow-sm"
        >
          Explore Catalog
        </Link>
      </div>
    );
  }

  const shippingCost = formData.shippingSpeed === 'express' ? shipping + 499 : shipping;
  const finalTotal = subtotal + shippingCost + tax;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const orderPayload = {
        orderItems: cartItems.map(item => ({
          product: item.product,
          name: item.name,
          qty: item.qty,
          image: item.image,
          price: item.price
        })),
        shippingAddress: {
          fullName: formData.fullName,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          country: formData.country,
          phone: formData.phone
        },
        paymentMethod: 'Instant Encrypted Card (Demo)',
        itemsPrice: subtotal,
        shippingPrice: shippingCost,
        taxPrice: tax,
        totalPrice: finalTotal
      };

      const { data } = await axios.post('/api/orders', orderPayload);
      clearCart();
      addToast('Order confirmed! Tracking code generated.', 'success');
      navigate(`/orders/${data._id}`);
    } catch (err) {
      console.error('Order placement failed:', err);
      const msg = err.response?.data?.message || 'Failed to place order. Please check login status.';
      addToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-800">
        <div>
          <Link to="/products" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white mb-2">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Continue Shopping</span>
          </Link>
          <h1 className="text-3xl font-extrabold text-white">Express Secure Checkout</h1>
        </div>
        <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full">
          <Lock className="w-3.5 h-3.5" />
          <span>256-Bit SSL Encrypted Session</span>
        </div>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Form: Shipping & Payment */}
        <div className="lg:col-span-7 space-y-8">
          {/* Shipping Address */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Truck className="w-4 h-4 text-brand-400" />
              <span>1. Delivery Destination</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="sm:col-span-2 space-y-1">
                <label className="text-slate-400 font-medium">Full Recipient Name</label>
                <input
                  type="text"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-slate-400 font-medium">Street Address</label>
                <input
                  type="text"
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-medium">City</label>
                <input
                  type="text"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-medium">Postal / ZIP Code</label>
                <input
                  type="text"
                  name="postalCode"
                  required
                  value={formData.postalCode}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-medium">Country / Region</label>
                <input
                  type="text"
                  name="country"
                  required
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-medium">Contact Phone</label>
                <input
                  type="text"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>
          </div>

          {/* Delivery Speed Options */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <h3 className="text-white font-bold text-sm flex items-center gap-2">
              <Truck className="w-4 h-4 text-brand-400" />
              <span>2. Shipping Speed</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <label className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                formData.shippingSpeed === 'standard'
                  ? 'border-brand-500 bg-brand-500/10'
                  : 'border-slate-800 bg-slate-950/60'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">FedEx Global Express</span>
                  <input
                    type="radio"
                    name="shippingSpeed"
                    value="standard"
                    checked={formData.shippingSpeed === 'standard'}
                    onChange={handleChange}
                    className="accent-brand-500"
                  />
                </div>
                <p className="text-slate-400 mt-2">Delivered in 2-3 business days</p>
                <span className="text-emerald-400 font-bold mt-2">
                  {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                </span>
              </label>

              <label className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                formData.shippingSpeed === 'express'
                  ? 'border-brand-500 bg-brand-500/10'
                  : 'border-slate-800 bg-slate-950/60'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">Priority Overnight</span>
                  <input
                    type="radio"
                    name="shippingSpeed"
                    value="express"
                    checked={formData.shippingSpeed === 'express'}
                    onChange={handleChange}
                    className="accent-brand-500"
                  />
                </div>
                <p className="text-slate-400 mt-2">Guaranteed next morning delivery</p>
                <span className="text-white font-bold mt-2">+ ₹499</span>
              </label>
            </div>
          </div>

          {/* Payment Method */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <CreditCard className="w-4 h-4 text-brand-400" />
                <span>3. Payment Authorization</span>
              </div>
              <span className="text-[10px] text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded font-mono">
                Simulated Sandbox Checkout
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Cardholder Information</span>
                <span className="text-emerald-400 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Demo Card Ready
                </span>
              </div>

              <div>
                <input
                  type="text"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-mono focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  name="cardExp"
                  value={formData.cardExp}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-mono focus:outline-none"
                />
                <input
                  type="text"
                  name="cardCvc"
                  value={formData.cardCvc}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-mono focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Summary Sidebar */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-md space-y-6 sticky top-24 shadow-2xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-brand-400" />
              <span>Order Summary ({cartItems.reduce((acc, i) => acc + i.qty, 0)} items)</span>
            </h3>

            {/* Cart Preview */}
            <div className="max-h-60 overflow-y-auto divide-y divide-slate-800/80 pr-1 space-y-3">
              {cartItems.map(item => (
                <div key={item.product} className="pt-3 first:pt-0 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover bg-slate-950 shrink-0" />
                    <div>
                      <p className="font-semibold text-white line-clamp-1">{item.name}</p>
                      <p className="text-[11px] text-slate-400">Qty: {item.qty} × {formatPrice(item.price)}</p>
                    </div>
                  </div>
                  <span className="font-bold text-white shrink-0">{formatPrice(item.price * item.qty)}</span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="pt-4 border-t border-slate-800 space-y-2.5 text-xs text-slate-300">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-medium text-white">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping & Handling</span>
                <span>{shippingCost === 0 ? <strong className="text-emerald-400">FREE</strong> : formatPrice(shippingCost)}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated GST (18%)</span>
                <span>{formatPrice(tax)}</span>
              </div>
              <div className="pt-3 border-t border-slate-800 flex justify-between text-base font-black text-white">
                <span>Total Amount Due</span>
                <span className="text-brand-300 text-lg">{formatPrice(finalTotal)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 text-white font-extrabold text-sm shadow-glow hover:shadow-glow-accent transition-all duration-300 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <span>Authorizing Order...</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Authorize & Complete Order ({formatPrice(finalTotal)})</span>
                </>
              )}
            </button>

            <div className="pt-2 text-center text-[11px] text-slate-400 flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Full buyer protection & instant order tracking tracking generated</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
