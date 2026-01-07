// Mock cart data - can be used for testing and development
export const mockCartItems = [
  { 
    id: 1, 
    name: 'Wireless Headphones', 
    category: 'Electronics', 
    price: '79.99', 
    quantity: 1,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSlQq83LWgPlGcW36AlKW0sIOfrRjft-v8yvQ&s'
  },
  { 
    id: 2, 
    name: 'Running Shoes', 
    category: 'Footwear', 
    price: '89.99', 
    quantity: 2,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8dGGAFkudYQ5dt4POjzYmxEXl0fPWdpiEnA&s'
  },
  { 
    id: 3, 
    name: 'Yoga Mat', 
    category: 'Sports', 
    price: '29.99', 
    quantity: 1,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVqialCkeipNjrAGU5WMnIhIwmsvccVCbqJw&s'
  },
];

// Helper function to get item image - can be customized
export const getItemImage = (item) => {
  return item.image || 'https://via.placeholder.com/150';
};

