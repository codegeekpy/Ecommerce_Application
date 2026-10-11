import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Star, 
  ShoppingBag, 
  Truck, 
  ShieldCheck, 
  RefreshCw, 
  ChevronRight, 
  ArrowLeft,
  Check,
  Plus,
  Minus,
  Zap
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import { formatPrice } from '../utils/formatCurrency';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cartItems } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState('');
  const [qty, setQty] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    setLoading(true);
    axios.get(`/api/products/${id}`)
      .then(res => {
        setProduct(res.data);
        setSelectedImage(res.data.image);
        // Fetch related products in same category
        if (res.data.category) {
          axios.get(`/api/products?category=${encodeURIComponent(res.data.category)}&limit=4`)
            .then(catRes => {
              setRelatedProducts((catRes.data.products || []).filter(p => p._id !== id));
            })
            .catch(() => {});
        }
      })
      .catch(err => {
        console.error('Failed to load product details:', err);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-pulse space-y-8">
        <div className="h-6 w-48 bg-slate-800 rounded" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="aspect-square bg-slate-800 rounded-3xl" />
          <div className="space-y-4">
            <div className="h-8 w-3/4 bg-slate-800 rounded" />
            <div className="h-6 w-1/4 bg-slate-800 rounded" />
            <div className="h-24 bg-slate-800 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-md mx-auto py-24 text-center px-4 space-y-4">
        <h2 className="text-xl font-bold text-white">Product Not Found</h2>
        <p className="text-xs text-slate-400">The product you are looking for may have been retired or moved.</p>
        <Link
          to="/products"
          className="inline-block px-5 py-2.5 rounded-xl bg-brand-600 text-white text-xs font-semibold"
        >
          Return to Catalog
        </Link>
      </div>
    );
  }

  const isInCart = cartItems.some(i => i.product === product._id);
  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleBuyNow = () => {
    addToCart(product, qty);
    navigate('/checkout');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-slate-400">
        <Link to="/" className="hover:text-white transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/products" className="hover:text-white transition-colors">Catalog</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to={`/products?category=${encodeURIComponent(product.category)}`} className="hover:text-white transition-colors">
          {product.category}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-white font-medium truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Showcase Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 aspect-square shadow-2xl group">
            <img
              src={selectedImage || product.image}
              alt={product.name}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            />
            {discountPercent > 0 && (
              <span className="absolute top-4 left-4 px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider bg-rose-500 text-white shadow-lg">
                Save {discountPercent}%
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                    selectedImage === img ? 'border-brand-500 scale-95 shadow-glow-sm' : 'border-slate-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Info & Actions */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <div className="flex items-center justify-between text-xs font-semibold mb-2">
              <span className="text-brand-400 uppercase tracking-widest">{product.brand}</span>
              <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700/60">
                {product.category}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
              {product.name}
            </h1>

            {/* Ratings & Reviews */}
            <div className="flex items-center gap-2 mt-3 text-xs">
              <div className="flex items-center text-amber-400">
                <Star className="w-4 h-4 fill-current" />
                <span className="ml-1 font-bold text-white text-sm">{product.rating}</span>
              </div>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400 underline font-medium">{product.numReviews} Verified Reviews</span>
              <span className="text-slate-500">•</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> In Stock ({product.stock} units)
              </span>
            </div>
          </div>

          {/* Price Card */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex items-baseline justify-between">
            <div>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-white">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-sm text-slate-500 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Taxes included. Free insured delivery included on this item.
              </p>
            </div>

            {discountPercent > 0 && (
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
                Save {formatPrice(product.originalPrice - product.price)}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-sm text-slate-300 leading-relaxed">
            {product.description}
          </p>

          {/* Quantity and Actions */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-4">
              <span className="text-xs font-semibold text-slate-300">Quantity:</span>
              <div className="flex items-center border border-slate-700 rounded-xl bg-slate-900">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="px-3 py-2 text-slate-400 hover:text-white"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-3 text-sm font-mono font-bold text-white">{qty}</span>
                <button
                  onClick={() => setQty(Math.min(product.stock, qty + 1))}
                  className="px-3 py-2 text-slate-400 hover:text-white"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => addToCart(product, qty)}
                disabled={product.stock <= 0}
                className="py-3.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-500 active:scale-98 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-glow-sm hover:shadow-glow transition-all"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{isInCart ? 'Add More To Bag' : 'Add to Bag'}</span>
              </button>

              <button
                onClick={handleBuyNow}
                disabled={product.stock <= 0}
                className="py-3.5 px-4 rounded-xl bg-white hover:bg-slate-200 active:scale-98 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>Instant Checkout</span>
              </button>
            </div>
          </div>

          {/* Value Highlights */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 divide-y divide-slate-800 text-xs">
            <div className="flex items-center gap-3 py-2.5 first:pt-0">
              <Truck className="w-4 h-4 text-brand-400 shrink-0" />
              <span className="text-slate-300">Complimentary 2-3 Day Express Worldwide Shipping</span>
            </div>
            <div className="flex items-center gap-3 py-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-slate-300">2-Year Official Comprehensive Manufacturer Guarantee</span>
            </div>
            <div className="flex items-center gap-3 py-2.5 last:pb-0">
              <RefreshCw className="w-4 h-4 text-purple-400 shrink-0" />
              <span className="text-slate-300">30-Day In-Home Trial With Prepaid Return Label</span>
            </div>
          </div>

          {/* Specifications Table */}
          {product.specs && Object.keys(product.specs).length > 0 && (
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Technical Specifications</h3>
              <div className="rounded-xl border border-slate-800 overflow-hidden divide-y divide-slate-800/80 text-xs">
                {Object.entries(product.specs).map(([key, val]) => (
                  <div key={key} className="flex justify-between py-2.5 px-4 bg-slate-900/40">
                    <span className="text-slate-400 font-medium">{key}</span>
                    <span className="text-slate-200 font-semibold">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="pt-10 border-t border-slate-800 space-y-6">
          <h2 className="text-xl font-bold text-white">Recommended Pairings</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map(p => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
