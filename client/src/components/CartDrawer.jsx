import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, Truck, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/formatCurrency';

export default function CartDrawer() {
  const { 
    cartItems, 
    isCartOpen, 
    setIsCartOpen, 
    updateQty, 
    removeFromCart, 
    subtotal, 
    shipping, 
    tax, 
    total 
  } = useCart();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const freeShippingThreshold = 9999;
  const progressToFreeShipping = Math.min((subtotal / freeShippingThreshold) * 100, 100);
  const remainingForFree = Math.max(0, freeShippingThreshold - subtotal);

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity duration-300"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-slate-900 border-l border-slate-800 text-white flex flex-col shadow-2xl">
          {/* Header */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-brand-400" />
              <h2 className="font-bold text-lg text-white">Your Shopping Bag</h2>
              <span className="text-xs bg-brand-500/20 text-brand-300 px-2 py-0.5 rounded-full font-semibold">
                {cartItems.reduce((acc, i) => acc + i.qty, 0)} items
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="bg-slate-950/60 p-3.5 border-b border-slate-800 text-xs">
            <div className="flex items-center justify-between text-slate-300 mb-1.5">
              <span className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-brand-400" />
                {subtotal >= freeShippingThreshold ? (
                  <span className="text-emerald-400 font-semibold">Free Express Shipping Unlocked!</span>
                ) : (
                  <span>Add <strong className="text-white">{formatPrice(remainingForFree)}</strong> more for Free Express</span>
                )}
              </span>
              <span className="font-mono text-[10px] text-slate-400">{Math.round(progressToFreeShipping)}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-brand-500 to-emerald-400 transition-all duration-500" 
                style={{ width: `${progressToFreeShipping}%` }}
              />
            </div>
          </div>

          {/* Item List */}
          <div className="flex-1 overflow-y-auto p-5 divide-y divide-slate-800/80">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                <div className="w-16 h-16 rounded-full bg-slate-800/80 flex items-center justify-center mb-4 text-slate-500">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-semibold text-slate-200">Your bag is empty</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-xs">
                  Discover our flagship collection of acoustic gear, smart rings, and studio hardware.
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/products');
                  }}
                  className="mt-6 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-glow-sm transition-all"
                >
                  Explore Catalog
                </button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div key={item.product} className="py-4 first:pt-0 last:pb-0 flex gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 rounded-xl object-cover bg-slate-950 shrink-0 border border-slate-800"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-semibold text-white line-clamp-1">{item.name}</h4>
                        <button
                          onClick={() => removeFromCart(item.product)}
                          className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5">{item.category}</p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      {/* Quantity stepper */}
                      <div className="flex items-center border border-slate-700/80 rounded-lg bg-slate-950/60">
                        <button
                          onClick={() => updateQty(item.product, item.qty - 1)}
                          className="p-1 hover:text-brand-400 text-slate-400 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-mono text-slate-200">{item.qty}</span>
                        <button
                          onClick={() => updateQty(item.product, item.qty + 1)}
                          disabled={item.qty >= item.stock}
                          className="p-1 hover:text-brand-400 text-slate-400 transition-colors disabled:opacity-30"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Line total */}
                      <div className="text-right">
                        <span className="text-sm font-bold text-white">
                          {formatPrice(item.price * item.qty)}
                        </span>
                        <p className="text-[10px] text-slate-500">{formatPrice(item.price)} each</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Summary */}
          {cartItems.length > 0 && (
            <div className="p-5 border-t border-slate-800 bg-slate-950/80 backdrop-blur-md">
              <div className="space-y-2 text-xs text-slate-300 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-white">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Shipping</span>
                  <span>{shipping === 0 ? <strong className="text-emerald-400">FREE</strong> : formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated GST (18%)</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                <div className="pt-2 border-t border-slate-800 flex justify-between text-sm font-black text-white">
                  <span>Total</span>
                  <span className="text-brand-300 text-base">{formatPrice(total)}</span>
                </div>
              </div>

              <button
                onClick={handleProceedToCheckout}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-glow hover:shadow-glow-accent transition-all duration-200"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 mt-3">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>256-Bit SSL Encrypted & Guaranteed Delivery</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
