import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { ProductModel } from '../models/productModel.js';
import { UserModel } from '../models/userModel.js';
import { OrderModel } from '../models/orderModel.js';
import { initialProducts, initialUsers } from './seedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '..', '..', 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

export let isMongoConnected = false;

// Helpers for Local JSON Store
function ensureLocalDbFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    const salt = bcrypt.genSaltSync(10);
    const users = initialUsers.map((u, idx) => ({
      _id: `user_${idx + 1}`,
      name: u.name,
      email: u.email,
      password: bcrypt.hashSync(u.password, salt),
      role: u.role,
      avatar: u.avatar || '',
      addresses: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));

    const products = initialProducts.map((p, idx) => ({
      _id: `prod_${idx + 1}`,
      ...p,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));

    const initialData = {
      users,
      products,
      orders: []
    };

    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf8');
  }
}

function readLocalDb() {
  ensureLocalDbFile();
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading local db file, resetting:', err);
    ensureLocalDbFile();
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  }
}

function writeLocalDb(data) {
  ensureLocalDbFile();
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
}

// Connect to MongoDB or activate Local JSON Fallback
export async function initDatabase() {
  ensureLocalDbFile();

  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';
  console.log(`[Database] Attempting connection to MongoDB at: ${mongoUri.replace(/:([^:@]+)@/, ':****@')}`);

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 2500,
    });
    isMongoConnected = true;
    console.log(`[Database] [OK] Connected to MongoDB host: ${conn.connection.host} (Database: ${conn.connection.name})`);

    // Seed Mongo collections if empty
    const productCount = await ProductModel.countDocuments();
    if (productCount === 0) {
      console.log('[Database] MongoDB products collection is empty. Seeding catalog...');
      await ProductModel.insertMany(initialProducts);
      console.log(`[Database] Successfully seeded ${initialProducts.length} products to MongoDB.`);
    }

    const userCount = await UserModel.countDocuments();
    if (userCount === 0) {
      console.log('[Database] MongoDB users collection is empty. Seeding demo accounts...');
      const salt = await bcrypt.genSalt(10);
      const seededUsers = [];
      for (const u of initialUsers) {
        const hashedPassword = await bcrypt.hash(u.password, salt);
        seededUsers.push({
          name: u.name,
          email: u.email,
          password: hashedPassword,
          role: u.role,
          avatar: u.avatar || '',
          addresses: []
        });
      }
      await UserModel.insertMany(seededUsers);
      console.log(`[Database] Successfully seeded ${seededUsers.length} users to MongoDB.`);
    }
  } catch (err) {
    isMongoConnected = false;
    console.warn(`[Database] [OFFLINE] Could not connect to MongoDB server: ${err.message}`);
    console.warn(`[Database] [READY] Activated resilient Local Data Store (${DB_FILE}). Full CRUD, Auth, and Orders functional.`);
    console.warn(`[Database] [INFO] To switch to MongoDB anytime, start MongoDB on port 27017 or provide your MongoDB Atlas URI in server/.env`);
  }
}

// Unified Store Interface
export const store = {
  // PRODUCTS
  async getProducts({ search = '', category = '', sort = 'latest', page = 1, limit = 20, minPrice, maxPrice }) {
    if (isMongoConnected) {
      const query = {};
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { brand: { $regex: search, $options: 'i' } }
        ];
      }
      if (category && category !== 'All') {
        query.category = category;
      }
      if (minPrice !== undefined || maxPrice !== undefined) {
        query.price = {};
        if (minPrice !== undefined) query.price.$gte = Number(minPrice);
        if (maxPrice !== undefined) query.price.$lte = Number(maxPrice);
      }

      let sortQuery = { createdAt: -1 };
      if (sort === 'price-low') sortQuery = { price: 1 };
      if (sort === 'price-high') sortQuery = { price: -1 };
      if (sort === 'rating') sortQuery = { rating: -1 };
      if (sort === 'popular') sortQuery = { numReviews: -1 };

      const total = await ProductModel.countDocuments(query);
      const products = await ProductModel.find(query)
        .sort(sortQuery)
        .skip((page - 1) * limit)
        .limit(Number(limit));

      return { products, total, pages: Math.ceil(total / limit), currentPage: Number(page) };
    } else {
      // Local DB
      const data = readLocalDb();
      let list = [...data.products];

      if (search) {
        const s = search.toLowerCase();
        list = list.filter(p =>
          p.name.toLowerCase().includes(s) ||
          p.description.toLowerCase().includes(s) ||
          p.brand.toLowerCase().includes(s) ||
          (p.tags && p.tags.some(t => t.toLowerCase().includes(s)))
        );
      }
      if (category && category !== 'All') {
        list = list.filter(p => p.category.toLowerCase() === category.toLowerCase());
      }
      if (minPrice !== undefined) {
        list = list.filter(p => p.price >= Number(minPrice));
      }
      if (maxPrice !== undefined) {
        list = list.filter(p => p.price <= Number(maxPrice));
      }

      if (sort === 'price-low') list.sort((a, b) => a.price - b.price);
      else if (sort === 'price-high') list.sort((a, b) => b.price - a.price);
      else if (sort === 'rating') list.sort((a, b) => b.rating - a.rating);
      else if (sort === 'popular') list.sort((a, b) => b.numReviews - a.numReviews);
      else list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      const total = list.length;
      const paginated = list.slice((page - 1) * limit, page * limit);
      return { products: paginated, total, pages: Math.ceil(total / limit) || 1, currentPage: Number(page) };
    }
  },

  async getProductById(id) {
    if (isMongoConnected) {
      if (!mongoose.Types.ObjectId.isValid(id)) return null;
      return await ProductModel.findById(id);
    } else {
      const data = readLocalDb();
      return data.products.find(p => p._id === id || String(p._id) === String(id)) || null;
    }
  },

  async createProduct(productData) {
    if (isMongoConnected) {
      return await ProductModel.create(productData);
    } else {
      const data = readLocalDb();
      const newProduct = {
        _id: `prod_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        ...productData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      data.products.unshift(newProduct);
      writeLocalDb(data);
      return newProduct;
    }
  },

  async updateProduct(id, updateData) {
    if (isMongoConnected) {
      if (!mongoose.Types.ObjectId.isValid(id)) return null;
      return await ProductModel.findByIdAndUpdate(id, updateData, { new: true });
    } else {
      const data = readLocalDb();
      const index = data.products.findIndex(p => p._id === id || String(p._id) === String(id));
      if (index === -1) return null;
      data.products[index] = {
        ...data.products[index],
        ...updateData,
        updatedAt: new Date().toISOString()
      };
      writeLocalDb(data);
      return data.products[index];
    }
  },

  async deleteProduct(id) {
    if (isMongoConnected) {
      if (!mongoose.Types.ObjectId.isValid(id)) return null;
      return await ProductModel.findByIdAndDelete(id);
    } else {
      const data = readLocalDb();
      const index = data.products.findIndex(p => p._id === id || String(p._id) === String(id));
      if (index === -1) return null;
      const deleted = data.products.splice(index, 1)[0];
      writeLocalDb(data);
      return deleted;
    }
  },

  // USERS
  async findUserByEmail(email) {
    if (isMongoConnected) {
      return await UserModel.findOne({ email: email.toLowerCase() });
    } else {
      const data = readLocalDb();
      return data.users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
    }
  },

  async findUserById(id) {
    if (isMongoConnected) {
      if (!mongoose.Types.ObjectId.isValid(id)) return null;
      return await UserModel.findById(id).select('-password');
    } else {
      const data = readLocalDb();
      const u = data.users.find(usr => usr._id === id || String(usr._id) === String(id));
      if (!u) return null;
      const { password, ...safeUser } = u;
      return safeUser;
    }
  },

  async createUser(userData) {
    if (isMongoConnected) {
      return await UserModel.create(userData);
    } else {
      const data = readLocalDb();
      const newUser = {
        _id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        ...userData,
        addresses: userData.addresses || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      data.users.push(newUser);
      writeLocalDb(data);
      return newUser;
    }
  },

  async getAllUsers() {
    if (isMongoConnected) {
      return await UserModel.find().select('-password').sort({ createdAt: -1 });
    } else {
      const data = readLocalDb();
      return data.users.map(({ password, ...u }) => u);
    }
  },

  // ORDERS
  async createOrder(orderData) {
    if (isMongoConnected) {
      return await OrderModel.create(orderData);
    } else {
      const data = readLocalDb();
      const trackingNumber = 'AUR-' + Math.floor(100000 + Math.random() * 900000);
      const newOrder = {
        _id: `ord_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        ...orderData,
        trackingNumber: orderData.trackingNumber || trackingNumber,
        carrier: orderData.carrier || 'FedEx Express Global',
        status: orderData.status || 'Processing',
        isPaid: true,
        paidAt: new Date().toISOString(),
        statusHistory: [
          { status: 'Order Placed', timestamp: new Date().toISOString(), note: 'Payment verified and order confirmed' },
          { status: 'Processing', timestamp: new Date().toISOString(), note: 'Allocated to fulfillment hub' }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      data.orders.unshift(newOrder);

      // Deduct stock in local products
      for (const item of newOrder.orderItems) {
        const prod = data.products.find(p => p._id === item.product || String(p._id) === String(item.product));
        if (prod) {
          prod.stock = Math.max(0, prod.stock - item.qty);
        }
      }

      writeLocalDb(data);
      return newOrder;
    }
  },

  async getOrderById(id) {
    if (isMongoConnected) {
      if (!mongoose.Types.ObjectId.isValid(id)) return null;
      return await OrderModel.findById(id).populate('user', 'name email');
    } else {
      const data = readLocalDb();
      const order = data.orders.find(o => o._id === id || String(o._id) === String(id));
      if (!order) return null;
      const user = data.users.find(u => u._id === order.user || String(u._id) === String(order.user));
      return {
        ...order,
        user: user ? { _id: user._id, name: user.name, email: user.email } : order.user
      };
    }
  },

  async getUserOrders(userId) {
    if (isMongoConnected) {
      return await OrderModel.find({ user: userId }).sort({ createdAt: -1 });
    } else {
      const data = readLocalDb();
      return data.orders.filter(o => o.user === userId || String(o.user) === String(userId))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
  },

  async getAllOrders() {
    if (isMongoConnected) {
      return await OrderModel.find().populate('user', 'name email').sort({ createdAt: -1 });
    } else {
      const data = readLocalDb();
      return data.orders.map(order => {
        const user = data.users.find(u => u._id === order.user || String(u._id) === String(order.user));
        return {
          ...order,
          user: user ? { _id: user._id, name: user.name, email: user.email } : order.user
        };
      }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
  },

  async updateOrderStatus(id, { status, note = '', trackingNumber, carrier }) {
    if (isMongoConnected) {
      if (!mongoose.Types.ObjectId.isValid(id)) return null;
      const update = { status };
      if (trackingNumber) update.trackingNumber = trackingNumber;
      if (carrier) update.carrier = carrier;

      const order = await OrderModel.findById(id);
      if (!order) return null;
      order.status = status;
      if (trackingNumber) order.trackingNumber = trackingNumber;
      if (carrier) order.carrier = carrier;
      order.statusHistory.push({
        status,
        timestamp: new Date(),
        note: note || `Status updated to ${status}`
      });
      if (status === 'Delivered') {
        order.isDelivered = true;
        order.deliveredAt = new Date();
      }
      return await order.save();
    } else {
      const data = readLocalDb();
      const order = data.orders.find(o => o._id === id || String(o._id) === String(id));
      if (!order) return null;
      order.status = status;
      if (trackingNumber) order.trackingNumber = trackingNumber;
      if (carrier) order.carrier = carrier;
      if (!order.statusHistory) order.statusHistory = [];
      order.statusHistory.push({
        status,
        timestamp: new Date().toISOString(),
        note: note || `Status updated to ${status}`
      });
      if (status === 'Delivered') {
        order.isDelivered = true;
        order.deliveredAt = new Date().toISOString();
      }
      order.updatedAt = new Date().toISOString();
      writeLocalDb(data);
      return order;
    }
  },

  // ADMIN ANALYTICS & STATS
  async getDashboardStats() {
    if (isMongoConnected) {
      const totalUsers = await UserModel.countDocuments();
      const totalProducts = await ProductModel.countDocuments();
      const totalOrders = await OrderModel.countDocuments();
      const orders = await OrderModel.find();
      const totalRevenue = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
      const pendingOrders = orders.filter(o => o.status === 'Processing' || o.status === 'Pending').length;
      const recentOrders = await OrderModel.find().populate('user', 'name email').sort({ createdAt: -1 }).limit(5);

      return {
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        totalOrders,
        totalProducts,
        totalUsers,
        pendingOrders,
        recentOrders,
        isMongo: true
      };
    } else {
      const data = readLocalDb();
      const totalUsers = data.users.length;
      const totalProducts = data.products.length;
      const totalOrders = data.orders.length;
      const totalRevenue = data.orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
      const pendingOrders = data.orders.filter(o => o.status === 'Processing' || o.status === 'Pending').length;
      const recentOrders = data.orders.slice(0, 5).map(o => {
        const u = data.users.find(usr => usr._id === o.user || String(usr._id) === String(o.user));
        return {
          ...o,
          user: u ? { _id: u._id, name: u.name, email: u.email } : o.user
        };
      });

      return {
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        totalOrders,
        totalProducts,
        totalUsers,
        pendingOrders,
        recentOrders,
        isMongo: false
      };
    }
  }
};
