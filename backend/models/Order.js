import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      name: String,
      quantity: Number,
      price: Number,      // unit price
      subtotal: Number,   // price * quantity
    },
  ],
  subTotal: Number,       // sum of all item subtotals
  tax: { type: Number, default: 0 },
  totalAmount: Number,    // subTotal + tax
  status: {
    type: String,
    default: 'Pending',
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']
  },
  createdAt: { type: Date, default: Date.now },
});

const Order = mongoose.model('Order', orderSchema);
export default Order;
