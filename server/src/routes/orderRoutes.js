import express from 'express';
import { store } from '../data/dbStore.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Create new order (checkout)
router.post('/', protect, async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items specified' });
    }
    if (!shippingAddress || !shippingAddress.address || !shippingAddress.city) {
      return res.status(400).json({ message: 'Valid shipping address required' });
    }

    const order = await store.createOrder({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod: paymentMethod || 'Instant Credit Card Checkout',
      itemsPrice: Number(itemsPrice),
      taxPrice: Number(taxPrice) || 0,
      shippingPrice: Number(shippingPrice) || 0,
      totalPrice: Number(totalPrice),
      isPaid: true,
      paidAt: new Date(),
      status: 'Processing',
      carrier: 'FedEx Express Courier'
    });

    res.status(201).json(order);
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Failed to place order' });
  }
});

// Get user orders
router.get('/myorders', protect, async (req, res) => {
  try {
    const orders = await store.getUserOrders(req.user._id);
    res.json(orders);
  } catch (error) {
    console.error('Get my orders error:', error);
    res.status(500).json({ message: 'Failed to retrieve orders' });
  }
});

// Get all orders (Admin only)
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const orders = await store.getAllOrders();
    res.json(orders);
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ message: 'Failed to retrieve system orders' });
  }
});

// Get order by ID
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await store.getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check ownership or admin
    const orderUserId = typeof order.user === 'object' ? order.user._id : order.user;
    if (String(orderUserId) !== String(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    res.json(order);
  } catch (error) {
    console.error('Get order by id error:', error);
    res.status(500).json({ message: 'Failed to retrieve order' });
  }
});

// Update order status (Admin only)
router.put('/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const { status, note, trackingNumber, carrier } = req.body;
    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    const updated = await store.updateOrderStatus(req.params.id, {
      status,
      note,
      trackingNumber,
      carrier
    });

    if (!updated) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(updated);
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Failed to update order status' });
  }
});

export default router;
