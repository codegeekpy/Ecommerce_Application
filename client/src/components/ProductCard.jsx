import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingBag, Eye, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/formatCurrency';

export default function ProductCard({ product }) {
  const { addToCart, cartItems } = useCart();
  const isInCart = cartItems.some(i => i.product === product._id);

  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="group relative rounded-2xl bg-slate-900/70 border border-slate-800/80 hover:border-brand-500/50 hover:shadow-glow transition-all duration-300 flex flex-col overflow-hidden backdrop-blur-sm">
      {/* Product Image Container */}
      <Link to={`/products/${product._id}`} className="relative block aspect-square overflow-hidden bg-slate-950">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {discountPercent > 0 && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-rose-500/90 text-white backdrop-blur-md shadow-sm">
              -{discountPercent}% OFF
            </span>
          )}
          {product.featured && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-amber-500/90 text-slate-950 backdrop-blur-md shadow-sm">
              Featured
            </span>
          )}
        </div>

        {/* Stock pill overlay */}
        <div className="absolute top-3 right-3 z-10">
          {product.stock <= 0 ? (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-red-500/80 text-white">
              Sold Out
            </span>
          ) : product.stock < 15 ? (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-amber-500/20 text-amber-300 border border-amber-500/40 backdrop-blur-md">
              Only {product.stock} left
            </span>
          ) : null}
        </div>
      </Link>

      {/* Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Brand */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium mb-1.5">
            <span>{product.brand}</span>
            <span className="text-brand-400/90 bg-brand-500/10 px-2 py-0.5 rounded-full font-semibold">
              {product.category}
            </span>
          </div>

          {/* Product Title */}
          <Link to={`/products/${product._id}`}>
            <h3 className="font-semibold text-slate-100 hover:text-brand-300 transition-colors line-clamp-1 text-sm sm:text-base">
              {product.name}
            </h3>
          </Link>

          {/* Description snippet */}
          <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          {/* Ratings */}
          <div className="flex items-center gap-1.5 mt-2.5">
            <div className="flex items-center text-amber-400">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="ml-1 text-xs font-bold text-slate-200">{product.rating || 5.0}</span>
            </div>
            <span className="text-slate-500 text-[11px]">({product.numReviews || 0} reviews)</span>
          </div>
        </div>

        {/* Price and Add to Cart Action */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-black text-white">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs text-slate-500 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={() => addToCart(product, 1)}
            disabled={product.stock <= 0}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
              product.stock <= 0
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : isInCart
                ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-600/30'
                : 'bg-brand-600 hover:bg-brand-500 text-white shadow-glow-sm hover:shadow-glow active:scale-95'
            }`}
          >
            {isInCart ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>In Bag</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
