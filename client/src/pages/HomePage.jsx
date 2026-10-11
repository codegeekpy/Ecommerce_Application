import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  ArrowRight, 
  Sparkles, 
  Layers, 
  Cpu, 
  Zap, 
  ShieldCheck, 
  ChevronRight,
  Headphones,
  Watch,
  Lamp,
  Briefcase
} from 'lucide-react';
import ProductCard from '../components/ProductCard';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/products')
      .then((res) => {
        setFeaturedProducts(res.data.products || []);
      })
      .catch((err) => {
        console.error('Failed to fetch products:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  const categories = [
    {
      name: 'Electronics',
      tagline: 'High-Fidelity Audio & QD-OLED Displays',
      icon: Headphones,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
      link: '/products?category=Electronics'
    },
    {
      name: 'Smart Wearables',
      tagline: 'Titanium Timepieces & Biometric Rings',
      icon: Watch,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
      link: '/products?category=Smart Wearables'
    },
    {
      name: 'Home & Studio',
      tagline: 'Architectural Lighting & Studio Acoustics',
      icon: Lamp,
      image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80',
      link: '/products?category=Home & Studio'
    },
    {
      name: 'Accessories',
      tagline: 'Tuscan Leather & Magnetic MagCore EDC',
      icon: Briefcase,
      image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80',
      link: '/products?category=Accessories'
    }
  ];

  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-16 lg:py-24">
        {/* Ambient Gradient Background Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-brand-600/20 via-purple-600/20 to-pink-600/10 rounded-full blur-[120px] pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-semibold backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-brand-400" />
                <span>Next-Generation 2026 Collection Dropped</span>
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08]">
                Precision Hardware. <br />
                <span className="text-gradient-primary">
                  Designed Without Compromise.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Discover audiophile-grade spatial acoustics, titanium smart wearables, and minimalist workstation tools crafted with architectural symmetry.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  to="/products"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 text-white font-bold text-sm shadow-glow hover:shadow-glow-accent transition-all duration-300 flex items-center justify-center gap-2 group"
                >
                  <span>Explore Catalog</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/products?category=Electronics"
                  className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700/80 text-sm font-semibold transition-all flex items-center justify-center gap-2"
                >
                  <span>Featured Flagships</span>
                </Link>
              </div>

              {/* Floating metrics */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-800/80 max-w-lg mx-auto lg:mx-0">
                <div>
                  <p className="text-2xl font-black text-white">40h+</p>
                  <p className="text-[11px] text-slate-400 uppercase tracking-wider font-medium">Battery ANC Life</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-white">100m</p>
                  <p className="text-[11px] text-slate-400 uppercase tracking-wider font-medium">Titanium Waterproof</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-white">0.03ms</p>
                  <p className="text-[11px] text-slate-400 uppercase tracking-wider font-medium">QD-OLED Latency</p>
                </div>
              </div>
            </div>

            {/* Right Hero Showcase Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md rounded-3xl bg-gradient-to-b from-slate-800/40 to-slate-900/80 p-3 border border-slate-700/60 shadow-2xl backdrop-blur-xl group">
                <div className="relative overflow-hidden rounded-2xl bg-slate-950 aspect-[4/5]">
                  <img
                    src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80"
                    alt="Aura Pro Wireless ANC"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                  
                  {/* Floating Spec Badges */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-500/80 text-white backdrop-blur-md">
                      Flagship Drop
                    </span>
                  </div>

                  <div className="absolute bottom-6 left-6 right-6 space-y-2">
                    <div className="flex items-center justify-between text-xs text-brand-300 font-semibold">
                      <span>Aura Acoustics</span>
                      <span className="text-emerald-400">In Stock • 24 Units</span>
                    </div>
                    <h3 className="text-2xl font-black text-white">Aura Pro Wireless ANC</h3>
                    <p className="text-xs text-slate-300 line-clamp-2">
                      Spatial acoustics with custom 40mm beryllium drivers and zero-distortion amplifier.
                    </p>
                    <div className="pt-2 flex items-center justify-between">
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black text-white">₹29,999</span>
                        <span className="text-xs text-slate-400 line-through">₹34,999</span>
                      </div>
                      <Link
                        to="/products/prod_1"
                        className="px-4 py-2 rounded-xl bg-white text-slate-950 font-bold text-xs hover:bg-slate-200 transition-colors"
                      >
                        Discover
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Grid Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-400">Curated Spaces</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">Explore By Category</h2>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-400 hover:text-brand-300 transition-colors"
          >
            <span>View All Categories</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.name}
                to={cat.link}
                className="group relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800/80 hover:border-brand-500/50 transition-all duration-300 aspect-[4/5] flex flex-col justify-end p-6"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 opacity-50 group-hover:opacity-75"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

                <div className="relative z-10 space-y-1.5">
                  <div className="w-10 h-10 rounded-xl bg-brand-500/20 border border-brand-500/30 text-brand-300 flex items-center justify-center mb-2">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-brand-300 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-300 line-clamp-1">{cat.tagline}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Products Collection */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-400">Flagship Lineup</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">Featured Equipment</h2>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-400 hover:text-brand-300 transition-colors"
          >
            <span>Browse Complete Store</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-96 rounded-2xl bg-slate-900/60 border border-slate-800 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.slice(0, 6).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Editorial Tech Press Testimonial Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-brand-950/60 border border-slate-800 p-8 sm:p-14 relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-brand-600/10 to-transparent pointer-events-none" />

          <div className="max-w-2xl space-y-6">
            <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-brand-500/20 text-brand-300 border border-brand-500/30">
              Architectural Craftsmanship
            </span>
            <h3 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">
              “A masterclass in tactile luxury and acoustic fidelity. Every edge is meticulously deliberate.”
            </h3>
            <p className="text-sm text-slate-400">
              — Reviewed by Sound & Architecture Quarterly, 2026 Innovation Awards
            </p>
            <div className="pt-2 flex items-center gap-4">
              <Link
                to="/products"
                className="px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-glow-sm transition-all"
              >
                Experience Now
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
