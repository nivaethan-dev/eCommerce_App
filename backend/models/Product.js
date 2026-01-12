import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Product title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  // Single image field - designed for simple product display
  // Future scalability: To support multiple images, change this to:
  // images: [{ type: String, required: true, validate: { ... } }]
  image: {
    type: String,
    required: [true, 'Product image is required'],
    validate: {
      validator: function(value) {
        // Accept either legacy local uploads path OR a full URL (Cloudinary)
        if (typeof value !== 'string') return false;
        return (
          value.startsWith('uploads/products/product_') ||
          value.startsWith('http://') ||
          value.startsWith('https://') ||
          value.startsWith('data:')
        );
      },
      message: 'Invalid image path format'
    }
  },
  // Cloudinary publicId for cleanup on update/delete (optional for legacy products)
  imagePublicId: {
    type: String
  },
  stock: {
    type: Number,
    required: [true, 'Product stock is required'],
    min: [0, 'Stock cannot be negative'],
    validate: {
      validator: Number.isInteger,
      message: 'Stock must be a whole number'
    }
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Compound unique index: title + category
productSchema.index({ title: 1, category: 1 }, { unique: true });

// Update timestamp on save
productSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Update timestamp on findOneAndUpdate (used by findByIdAndUpdate)
productSchema.pre('findOneAndUpdate', function(next) {
  this.set({ updatedAt: Date.now() });
  next();
});

const Product = mongoose.model('Product', productSchema);
export default Product;
