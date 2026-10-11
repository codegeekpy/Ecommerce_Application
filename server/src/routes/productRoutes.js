import express from 'express';
import { store } from '../data/dbStore.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Get list of categories
router.get('/categories', async (req, res) => {
  try {
    const { products } = await store.getProducts({ limit: 1000 });
    const categories = ['All', ...new Set(products.map(p => p.category))];
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving categories' });
  }
});

// Get all products (with search, category, sort, pagination)
router.get('/', async (req, res) => {
  try {
    const { search, category, sort, page, limit, minPrice, maxPrice } = req.query;
    const result = await store.getProducts({
      search,
      category,
      sort,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 20,
      minPrice,
      maxPrice
    });
    res.json(result);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Error retrieving products' });
  }
});

// Get single product by ID or slug
router.get('/:id', async (req, res) => {
  try {
    const product = await store.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving product details' });
  }
});

// Create product (Admin only)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { name, description, price, originalPrice, category, brand, stock, image, images, featured, tags, specs } = req.body;

    if (!name || !price || !category || !image) {
      return res.status(400).json({ message: 'Please provide name, price, category, and image' });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const product = await store.createProduct({
      name,
      slug,
      description: description || 'High-end crafted hardware engineered for durability and peak performance.',
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : Number(price),
      category,
      brand: brand || 'Aura Signature',
      stock: Number(stock) || 10,
      rating: 5,
      numReviews: 0,
      image,
      images: images && images.length ? images : [image],
      featured: Boolean(featured),
      tags: tags || [category.toLowerCase()],
      specs: specs || {}
    });

    res.status(201).json(product);
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Failed to create product' });
  }
});

// Update product (Admin only)
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const updated = await store.updateProduct(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(updated);
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Failed to update product' });
  }
});

// Delete product (Admin only)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const deleted = await store.deleteProduct(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully', id: req.params.id });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Failed to delete product' });
  }
});

export default router;
