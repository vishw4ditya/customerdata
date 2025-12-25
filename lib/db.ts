import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/customer-management';

if (!mongoose.connections[0].readyState) {
  mongoose.connect(MONGODB_URI).catch((err: any) => console.error('MongoDB connection error:', err));
}

const AdminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  adminID: { type: String, required: true, unique: true },
  role: { type: String, enum: ['superadmin', 'admin'], default: 'admin' },
  createdAt: { type: Date, default: Date.now },
});

const CustomerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  addedBy: { type: String, required: true },
  lastUpdatedBy: { type: String },
  count: { type: Number, default: 1 },
  followUpDate: { type: String }, // Store as YYYY-MM-DD for easy comparison
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Compound index for duplicate check
CustomerSchema.index({ name: 1, phone: 1 });

export const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);
export const Customer = mongoose.models.Customer || mongoose.model('Customer', CustomerSchema);

// For backward compatibility during migration
export const adminsDb = Admin;
export const customersDb = Customer;
