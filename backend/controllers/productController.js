import { ProductService, getProducts } from '../services/productService.js';
import fs from 'fs/promises';

export const createProduct = async (req, res) => {
  try {
    const product = await ProductService.createProduct(req.body, req.file);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    // Check for duplicate product
    if (error.code === 11000) {
      if (req.file) {
        try {
          await fs.unlink(req.file.path);
        } catch (_) {}
      }
      return res.status(400).json({
        success: false,
        error: 'A product with the same title and category already exists'
      });
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: Object.values(error.errors).map(err => err.message)
      });
    }

    // Handle custom validation errors from service
    if (error.message) {
      return res.status(400).json({
        success: false,
        error: error.message
      });
    }

    console.error('Product creation error:', error);
    res.status(500).json({
      success: false,
      error: 'Error creating product'
    });
  }
};

export const fetchProducts = async (req, res) => {
  try {
    // Allow public access for product search - no authentication required
    const role = req.user ? req.user.role : 'public';
    const userId = req.user ? req.user.id : null;
    const products = await getProducts(role, userId, req.query);
    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
