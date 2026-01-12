/**
 * Mock product data for development
 * This file will be replaced with actual API calls when backend is integrated
 */

export const mockProducts = [
  // Electronics
  { id: 1, name: 'Wireless Headphones', price: 79.99, image: 'https://picsum.photos/seed/headphones/400/400', description: 'High-quality wireless audio', category: 'Electronics' },
  { id: 2, name: 'Smart Watch', price: 199.99, image: 'https://picsum.photos/seed/smartwatch/400/400', description: 'Feature-rich smartwatch', category: 'Electronics' },
  { id: 3, name: 'Laptop Stand', price: 49.99, image: 'https://picsum.photos/seed/laptopstand/400/400', description: 'Ergonomic aluminum stand', category: 'Electronics' },
  { id: 4, name: 'USB-C Hub', price: 34.99, image: 'https://picsum.photos/seed/usbhub/400/400', description: '7-in-1 connectivity hub', category: 'Electronics' },
  { id: 5, name: 'Wireless Mouse', price: 29.99, image: 'https://picsum.photos/seed/mouse/400/400', description: 'Ergonomic wireless mouse', category: 'Electronics' },
  { id: 6, name: 'Mechanical Keyboard', price: 89.99, image: 'https://picsum.photos/seed/keyboard/400/400', description: 'RGB mechanical keyboard', category: 'Electronics' },

  // Fashion
  { id: 7, name: 'Classic T-Shirt', price: 24.99, image: 'https://picsum.photos/seed/tshirt/400/400', description: 'Premium cotton t-shirt', category: 'Fashion' },
  { id: 8, name: 'Denim Jeans', price: 59.99, image: 'https://picsum.photos/seed/jeans/400/400', description: 'Classic fit denim', category: 'Fashion' },
  { id: 9, name: 'Sneakers', price: 89.99, image: 'https://picsum.photos/seed/sneakers/400/400', description: 'Casual everyday sneakers', category: 'Fashion' },
  { id: 10, name: 'Backpack', price: 44.99, image: 'https://picsum.photos/seed/backpack/400/400', description: 'Spacious travel backpack', category: 'Fashion' },
  { id: 11, name: 'Leather Jacket', price: 149.99, image: 'https://picsum.photos/seed/jacket/400/400', description: 'Genuine leather jacket', category: 'Fashion' },
  { id: 12, name: 'Summer Dress', price: 54.99, image: 'https://picsum.photos/seed/dress/400/400', description: 'Floral summer dress', category: 'Fashion' },

  // Home & Garden
  { id: 13, name: 'Table Lamp', price: 39.99, image: 'https://picsum.photos/seed/lamp/400/400', description: 'Modern LED table lamp', category: 'Home & Garden' },
  { id: 14, name: 'Coffee Maker', price: 79.99, image: 'https://picsum.photos/seed/coffee/400/400', description: 'Programmable coffee maker', category: 'Home & Garden' },
  { id: 15, name: 'Wall Art', price: 29.99, image: 'https://picsum.photos/seed/wallart/400/400', description: 'Abstract canvas art', category: 'Home & Garden' },
  { id: 16, name: 'Throw Pillow', price: 19.99, image: 'https://picsum.photos/seed/pillow/400/400', description: 'Soft decorative pillow', category: 'Home & Garden' },
  { id: 17, name: 'Plant Pot Set', price: 34.99, image: 'https://picsum.photos/seed/plantpot/400/400', description: 'Ceramic plant pots', category: 'Home & Garden' },
  { id: 18, name: 'Garden Tools', price: 49.99, image: 'https://picsum.photos/seed/gardentools/400/400', description: '5-piece garden set', category: 'Home & Garden' },

  // Sports
  { id: 19, name: 'Yoga Mat', price: 29.99, image: 'https://picsum.photos/seed/yogamat/400/400', description: 'Non-slip exercise mat', category: 'Sports' },
  { id: 20, name: 'Dumbbells Set', price: 89.99, image: 'https://picsum.photos/seed/dumbbells/400/400', description: 'Adjustable dumbbell set', category: 'Sports' },
  { id: 21, name: 'Running Shoes', price: 109.99, image: 'https://picsum.photos/seed/runningshoes/400/400', description: 'Lightweight running shoes', category: 'Sports' },
  { id: 22, name: 'Water Bottle', price: 19.99, image: 'https://picsum.photos/seed/bottle/400/400', description: 'Insulated water bottle', category: 'Sports' },
  { id: 23, name: 'Resistance Bands', price: 24.99, image: 'https://picsum.photos/seed/bands/400/400', description: 'Set of 5 resistance bands', category: 'Sports' },
  { id: 24, name: 'Sports Watch', price: 149.99, image: 'https://picsum.photos/seed/sportswatch/400/400', description: 'GPS fitness tracker', category: 'Sports' },

  // Books
  { id: 25, name: 'The Great Novel', price: 19.99, image: 'https://picsum.photos/seed/novel1/400/400', description: 'Bestselling fiction', category: 'Books' },
  { id: 26, name: 'Cooking Mastery', price: 29.99, image: 'https://picsum.photos/seed/cookbook/400/400', description: 'Professional cookbook', category: 'Books' },
  { id: 27, name: 'Self-Help Guide', price: 24.99, image: 'https://picsum.photos/seed/selfhelp/400/400', description: 'Personal development', category: 'Books' },
  { id: 28, name: 'History Chronicles', price: 34.99, image: 'https://picsum.photos/seed/history/400/400', description: 'World history book', category: 'Books' },
  { id: 29, name: 'Science Explorer', price: 27.99, image: 'https://picsum.photos/seed/science/400/400', description: 'Popular science', category: 'Books' },
  { id: 30, name: 'Travel Stories', price: 22.99, image: 'https://picsum.photos/seed/travel/400/400', description: 'Adventure travel tales', category: 'Books' },
];

export const categories = [
  'Electronics',
  'Fashion',
  'Home & Garden',
  'Sports',
  'Books'
];

/**
 * Group products by category
 * @param {Array} products - Array of product objects
 * @returns {Object} Products grouped by category
 */
export const groupProductsByCategory = (products) => {
  return products.reduce((acc, product) => {
    const category = product.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(product);
    return acc;
  }, {});
};

