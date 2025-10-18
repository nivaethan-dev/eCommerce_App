import Product from '../models/Product.js';
import fs from 'fs/promises';
import path from 'path';

// Predefined categories list
const VALID_CATEGORIES = [
  'Electronics',
  'Clothing',
  'Books',
  'Home & Kitchen',
  'Sports',
  'Toys'
];

export const createProduct = async (req, res) => {
  try {
    const { title, description, stock, category, price } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Product image is required'
      });
    }

    if (!title || !description || stock === undefined || !category || price === undefined) {
      return res.status(400).json({
        success: false,
        error: 'All fields (title, description, stock, category, price, image) are required'
      });
    }

    // Parse and validate numeric fields
    const parsedStock = parseInt(stock, 10);
    const parsedPrice = Number(parseFloat(price).toFixed(2));

    if (isNaN(parsedStock) || parsedStock < 0) {
      return res.status(400).json({ success: false, error: 'Stock must be a non-negative number' });
    }

    if (isNaN(parsedPrice) || parsedPrice < 0) {
      return res.status(400).json({ success: false, error: 'Price must be a non-negative number' });
    }

    // Use path.join for OS-safe path handling, then normalize to forward slashes
    let imagePath = path.join('uploads', 'products', req.file.filename);
    imagePath = imagePath.replace(/\\/g, '/');

    // Use .trim() for cleaner string data
    const cleanTitle = title.trim();
    const cleanDescription = description.trim();
    const cleanCategory = category.trim();

    // Normalize input and categories to lowercase for comparison
    const normalizedCategory = cleanCategory.toLowerCase();
    const normalizedCategories = VALID_CATEGORIES.map(cat => cat.toLowerCase());

    // Validate category
    if (!normalizedCategories.includes(normalizedCategory)) {
      // Delete uploaded image
      await fs.unlink(req.file.path);
      return res.status(400).json({
        success: false,
        error: `Invalid category. Must be one of: ${VALID_CATEGORIES.join(', ')}`
      });
    }

    // Validate title and description length
    if (cleanTitle.length < 3 || cleanTitle.length > 100) {
      return res.status(400).json({
        success: false,
        error: 'Title must be between 3 and 100 characters'
      });
    }

    if (cleanDescription.length < 10 || cleanDescription.length > 1000) {
      return res.status(400).json({
        success: false,
        error: 'Description must be between 10 and 1000 characters'
      });
    }

    // Create product with image path
    const product = await Product.create({
      title: cleanTitle,
      description: cleanDescription,
      image: imagePath, 
      stock: parsedStock,
      category: cleanCategory,
      price: parsedPrice
    });

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

    // If product creation fails, delete uploaded image
    if (req.file) {
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkError) {
        console.error('Error deleting file:', unlinkError);
        return res.status(500).json({
          success: false,
          error: 'Error deleting uploaded image after product creation failure'
        });
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
