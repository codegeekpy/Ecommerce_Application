import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Search, SlidersHorizontal, X, RefreshCw, Filter } from 'lucide-react';
import ProductCard from '../components/ProductCard';

export default function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filter states
  const currentCategory = searchParams.get('category') || 'All';
  const currentSearch = searchParams.get('search') || '';
  const currentSort = searchParams.get('sort') || 'latest';
  const currentMinPrice = searchParams.get('minPrice') || '';
  const currentMaxPrice = searchParams.get('maxPrice') || '';

  const [priceRange, setPriceRange] = useState(currentMaxPrice || 100000);

  // Fetch categories
  useEffect(() => {
    axios.get('/api/products/categories')
      .then(res => setCategories(res.data))
      .catch(err => console.error(err));
  }, []);

  // Fetch products based on query params
  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (currentSearch) params.set('search', currentSearch);
    if (currentCategory && currentCategory !== 'All') params.set('category', currentCategory);
    if (currentSort) params.set('sort', currentSort);
    if (currentMinPrice) params.set('minPrice', currentMinPrice);
    if (currentMaxPrice) params.set('maxPrice', currentMaxPrice);

    axios.get(`/api/products?${params.toString()}`)
      .then(res => {
        setProducts(res.data.products || []);
      })
      .catch(err => console.error('Failed to load products:', err))
      .finally(() => setLoading(false));
  }, [currentCategory, currentSearch, currentSort, currentMinPrice, currentMaxPrice]);

  const updateFilter = (key, value) => {
    const nextParams = new URLSearchParams(searchParams);
    if (value && value !== 'All') {
      nextParams.set(key, value);
    } else {
      nextParams.delete(key);
    }
    setSearchParams(nextParams);
  };

  const clearAllFilters = () => {
    setSearchParams({});
    setPriceRange(100000);
  };

  const hasActiveFilters = Boolean(
    (currentCategory && currentCategory !== 'All') ||
    currentSearch ||
    currentMaxPrice ||
    currentSort !== 'latest'
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-400">Precision Equipment</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">Product Catalog</h1>
          <p className="text-xs text-slate-400 mt-1">
            Engineered acoustics, biometric health tracking, and architectural workspace tools.
          </p>
        </div>

        {/* Search & Sort Controls */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 sm:w-64">
            <input
              type="text"
              placeholder="Search products..."
              value={currentSearch}
              onChange={(e) => updateFilter('search', e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl py-2 pl-9 pr-8 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            {currentSearch && (
              <button
                onClick={() => updateFilter('search', '')}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <select
            value={currentSort}
            onChange={(e) => updateFilter('sort', e.target.value)}
            className="bg-slate-900 border border-slate-700/80 rounded-xl py-2 px-3 text-xs text-slate-200 focus:outline-none focus:border-brand-500 cursor-pointer"
          >
            <option value="latest">Newest Releases</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="popular">Most Popular</option>
          </select>

          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="md:hidden flex items-center gap-1.5 px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-200"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Active Filter Chips */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <span className="text-slate-400 font-medium">Active filters:</span>
          {currentCategory && currentCategory !== 'All' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30">
              Category: {currentCategory}
              <button onClick={() => updateFilter('category', 'All')}><X className="w-3 h-3" /></button>
            </span>
          )}
          {currentSearch && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30">
              Search: "{currentSearch}"
              <button onClick={() => updateFilter('search', '')}><X className="w-3 h-3" /></button>
            </span>
          )}
          {currentMaxPrice && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30">
              Under ₹{Number(currentMaxPrice).toLocaleString('en-IN')}
              <button onClick={() => updateFilter('maxPrice', '')}><X className="w-3 h-3" /></button>
            </span>
          )}
          <button
            onClick={clearAllFilters}
            className="text-xs text-slate-400 hover:text-white underline ml-2"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Main Layout: Sidebar Filters + Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <aside className={`md:block ${mobileFilterOpen ? 'block' : 'hidden'} space-y-6 md:sticky md:top-24 h-fit`}>
          {/* Categories */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Category</h3>
            <div className="space-y-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => updateFilter('category', cat)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors flex items-center justify-between ${
                    currentCategory === cat
                      ? 'bg-brand-600 text-white font-bold shadow-glow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <span>{cat}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Max Price</h3>
              <span className="font-mono text-xs font-bold text-brand-400">₹{Number(priceRange).toLocaleString('en-IN')}</span>
            </div>
            <input
              type="range"
              min="5000"
              max="100000"
              step="2500"
              value={priceRange}
              onChange={(e) => {
                setPriceRange(e.target.value);
                updateFilter('maxPrice', e.target.value);
              }}
              className="w-full accent-brand-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>₹5,000</span>
              <span>₹50,000</span>
              <span>₹1,00,000+</span>
            </div>
          </div>
        </aside>

        {/* Product Grid Area */}
        <div className="md:col-span-3 space-y-6">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Showing <strong className="text-white">{products.length}</strong> equipment items</span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-96 rounded-2xl bg-slate-900/60 border border-slate-800 animate-pulse" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 rounded-2xl bg-slate-900/40 border border-slate-800 p-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-800 mx-auto flex items-center justify-center text-slate-400">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-white">No products matched your criteria</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Try loosening your filters, selecting "All" categories, or resetting the price slider.
              </p>
              <button
                onClick={clearAllFilters}
                className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-glow-sm"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
