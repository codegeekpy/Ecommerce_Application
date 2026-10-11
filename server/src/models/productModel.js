import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, unique: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, default: 0 },
    category: { type: String, required: true },
    brand: { type: String, required: true },
    stock: { type: Number, required: true, default: 0, min: 0 },
    rating: { type: Number, default: 5, min: 0, max: 5 },
    numReviews: { type: Number, default: 0 },
    image: { type: String, required: true },
    images: [{ type: String }],
    featured: { type: Boolean, default: false },
    tags: [{ type: String }],
    specs: { type: Map, of: String, default: {} }
  },
  { timestamps: true }
);

export const ProductModel = mongoose.model('Product', productSchema);
