import Product from '../models/Product.js';
import fs from 'fs/promises';
import path from 'path';

export const createProduct = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Product image is required'
      });
    }

    const { title, description, stock, category } = req.body;

    // Create product with image path
    const product = await Product.create({
      title,
      description,
      image: `uploads/${req.file.filename}`, // Store relative path
      stock: parseInt(stock),
      category
    });

    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    // If product creation fails, delete uploaded image
    if (req.file) {
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkError) {
        console.error('Error deleting file:', unlinkError);
      }
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: Object.values(error.errors).map(err => err.message)
      });
    }

    console.error('Product creation error:', error);
    res.status(500).json({
      success: false,
      error: 'Error creating product'
    });
  }
};
