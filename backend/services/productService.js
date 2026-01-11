import Product from '../models/Product.js';
import { fetchDocuments } from '../utils/queryHelper.js';
import { PRODUCT_MESSAGES, formatProductMessage } from '../utils/productMessages.js';
import { deleteImageByPublicId } from '../utils/cloudinary.js';

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
      throw new Error(PRODUCT_MESSAGES.IMAGE_REQUIRED);
    }
    if (!file.cloudinaryUrl || !file.cloudinaryPublicId) {
      throw new Error('Image upload failed (Cloudinary).');
    }

    if (!title || !description || stock === undefined || !category || price === undefined) {
      throw new Error(PRODUCT_MESSAGES.ALL_FIELDS_REQUIRED);
    }

    // Parse and validate numeric fields
    const parsedStock = parseInt(stock, 10);
    const parsedPrice = Number(parseFloat(price).toFixed(2));

    if (isNaN(parsedStock) || parsedStock < 0) {
      throw new Error(PRODUCT_MESSAGES.STOCK_NUMERIC);
    }

    if (isNaN(parsedPrice) || parsedPrice < 0) {
      throw new Error(PRODUCT_MESSAGES.PRICE_NUMERIC);
    }

    const imageUrl = file.cloudinaryUrl;
    const imagePublicId = file.cloudinaryPublicId;

    // Use .trim() for cleaner string data
    const cleanTitle = title.trim();
    const cleanDescription = description.trim();
    const cleanCategory = category.trim();

    // Normalize input and categories to lowercase for comparison
    const normalizedCategory = cleanCategory.toLowerCase();
    const normalizedCategories = VALID_CATEGORIES.map(cat => cat.toLowerCase());

    // Validate category
    if (!normalizedCategories.includes(normalizedCategory)) {
      // Delete uploaded Cloudinary image
      await deleteImageByPublicId(imagePublicId);
      throw new Error(formatProductMessage(PRODUCT_MESSAGES.CATEGORY_INVALID, {
        categories: VALID_CATEGORIES.join(', ')
      }));
    }

    // Validate title and description length
    if (cleanTitle.length < 3 || cleanTitle.length > 100) {
      throw new Error(PRODUCT_MESSAGES.TITLE_LENGTH);
    }

    if (cleanDescription.length < 10 || cleanDescription.length > 1000) {
      throw new Error(PRODUCT_MESSAGES.DESCRIPTION_LENGTH);
    }

    try {
      // Create product with image path
      const product = await Product.create({
        title: cleanTitle,
        description: cleanDescription,
        image: imageUrl,
        imagePublicId,
        stock: parsedStock,
        category: cleanCategory,
        price: parsedPrice
      });

      return product;
    } catch (error) {
      // If product creation fails, delete uploaded Cloudinary image
      try {
        await deleteImageByPublicId(imagePublicId);
      } catch (cleanupError) {
        console.error('Error deleting Cloudinary image after DB failure:', cleanupError);
      }

      // Re-throw the error to be handled by the controller
      throw error;
    }
  }

  static getValidCategories() {
    return VALID_CATEGORIES;
  }

  static async updateProduct(productId, updateData, file) {
    const product = await Product.findById(productId);
    if (!product) {
      if (file?.cloudinaryPublicId) {
        await deleteImageByPublicId(file.cloudinaryPublicId);
      }
      throw new Error(PRODUCT_MESSAGES.PRODUCT_NOT_FOUND);
    }

    // Capture old data before update for comparison
    const oldData = product.toObject();
    const oldImagePublicId = product.imagePublicId;

    // Handle new image upload
    if (file) {
      if (!file.cloudinaryUrl || !file.cloudinaryPublicId) {
        throw new Error('Image upload failed (Cloudinary).');
      }
      updateData.image = file.cloudinaryUrl;
      updateData.imagePublicId = file.cloudinaryPublicId;
    }

    // Normalize category if provided
    if (updateData.category !== undefined) {
      updateData.category = updateData.category.trim();
      const normalizedCategory = updateData.category.toLowerCase();
      const normalizedCategories = VALID_CATEGORIES.map(cat => cat.toLowerCase());

      if (!normalizedCategories.includes(normalizedCategory)) {
        if (file?.cloudinaryPublicId) {
          await deleteImageByPublicId(file.cloudinaryPublicId);
        }
        throw new Error(formatProductMessage(PRODUCT_MESSAGES.CATEGORY_INVALID, {
          categories: VALID_CATEGORIES.join(', ')
        }));
      }
    }

    // Clean other fields - check for undefined instead of truthiness
    if (updateData.title !== undefined) updateData.title = updateData.title.trim();
    if (updateData.description !== undefined) updateData.description = updateData.description.trim();
    if (updateData.stock !== undefined) updateData.stock = parseInt(updateData.stock, 10);
    if (updateData.price !== undefined) updateData.price = Number(parseFloat(updateData.price).toFixed(2));

    let updatedProduct;
    try {
      updatedProduct = await Product.findByIdAndUpdate(productId, updateData, {
        new: true,
        runValidators: true
      });
    } catch (error) {
      // If DB update fails and a new image was uploaded, clean it up
      if (file?.cloudinaryPublicId) {
        try {
          await deleteImageByPublicId(file.cloudinaryPublicId);
        } catch (cleanupError) {
          console.error('Error deleting new Cloudinary image after update failure:', cleanupError);
        }
      }
      throw error;
    }

    // ONLY delete old image if DB update succeeded AND a new file was provided
    if (file && oldImagePublicId) {
      try {
        await deleteImageByPublicId(oldImagePublicId);
      } catch (error) {
        console.error('Error deleting old Cloudinary image after update:', error);
      }
    }

    return { updatedProduct, oldData };
  }

  static async deleteProduct(productId) {
    const product = await Product.findById(productId);
    if (!product) {
      throw new Error(PRODUCT_MESSAGES.PRODUCT_NOT_FOUND);
    }

    const deletedData = product.toObject();

    // Delete associated Cloudinary image (preferred)
    if (product.imagePublicId) {
      try {
        await deleteImageByPublicId(product.imagePublicId);
      } catch (error) {
        console.error('Error deleting Cloudinary product image:', error);
      }
    }

    await Product.findByIdAndDelete(productId);
    return deletedData;
  }
}

export const getProducts = async (role, userId, queryParams) => {
  return await fetchDocuments(Product, {
    search: queryParams.search, // search string
    searchFields: ['title', 'description', 'category'], // searchable fields
    query: {} // additional filters if needed
  }, { role, userId });
};