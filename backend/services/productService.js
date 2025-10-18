import Product from '../models/Product.js';
import fs from 'fs/promises';
import path from 'path';
import { fetchDocuments } from '../utils/queryHelper.js';

// Predefined categories list
const VALID_CATEGORIES = [
  'Electronics',
  'Clothing',
  'Books',
  'Home & Kitchen',
  'Sports',
  'Toys'
];

export class ProductService {
  static async createProduct(productData, file) {
    const { title, description, stock, category, price } = productData;

    // Validate required fields
    if (!file) {
      throw new Error('Product image is required');
    }

    if (!title || !description || stock === undefined || !category || price === undefined) {
      throw new Error('All fields (title, description, stock, category, price, image) are required');
    }

    // Parse and validate numeric fields
    const parsedStock = parseInt(stock, 10);
    const parsedPrice = Number(parseFloat(price).toFixed(2));

    if (isNaN(parsedStock) || parsedStock < 0) {
      throw new Error('Stock must be a non-negative number');
    }

    if (isNaN(parsedPrice) || parsedPrice < 0) {
      throw new Error('Price must be a non-negative number');
    }

    // Use path.join for OS-safe path handling, then normalize to forward slashes
    let imagePath = path.join('uploads', 'products', file.filename);
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
      await fs.unlink(file.path);
      throw new Error(`Invalid category. Must be one of: ${VALID_CATEGORIES.join(', ')}`);
    }

    // Validate title and description length
    if (cleanTitle.length < 3 || cleanTitle.length > 100) {
      throw new Error('Title must be between 3 and 100 characters');
    }

    if (cleanDescription.length < 10 || cleanDescription.length > 1000) {
      throw new Error('Description must be between 10 and 1000 characters');
    }

    try {
      // Create product with image path
      const product = await Product.create({
        title: cleanTitle,
        description: cleanDescription,
        image: imagePath, 
        stock: parsedStock,
        category: cleanCategory,
        price: parsedPrice
      });

      return product;
    } catch (error) {
      // If product creation fails, delete uploaded image
      if (file) {
        try {
          await fs.unlink(file.path);
        } catch (unlinkError) {
          console.error('Error deleting file:', unlinkError);
        }
      }

      // Re-throw the error to be handled by the controller
      throw error;
    }
  }

  static getValidCategories() {
    return VALID_CATEGORIES;
  }
}

export const getProducts = async (role, userId, queryParams) => {
  return await fetchDocuments(Product, {
    search: queryParams.search, // search string
    searchFields: ['title', 'description', 'category'], // searchable fields
    query: {} // additional filters if needed
  }, { role, userId });
};