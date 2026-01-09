// Product form field configurations

export const addProductFields = [
  {
    name: 'title',
    label: 'Product Name',
    type: 'text',
    required: true,
    placeholder: 'Enter product name'
  },
  {
    name: 'description',
    label: 'Description',
    type: 'textarea',
    required: true,
    placeholder: 'Enter product description',
    rows: 4
  },
  {
    name: 'category',
    label: 'Category',
    type: 'select',
    required: true,
    options: [
      // Must match backend VALID_CATEGORIES in `backend/services/productService.js`
      { value: 'Electronics', label: 'Electronics' },
      { value: 'Clothing', label: 'Clothing' },
      { value: 'Books', label: 'Books' },
      { value: 'Home & Kitchen', label: 'Home & Kitchen' },
      { value: 'Sports', label: 'Sports' }
    ]
  },
  {
    name: 'price',
    label: 'Price',
    type: 'number',
    required: true,
    nonNegative: true,
    step: '0.01',
    placeholder: '0.00'
  },
  {
    name: 'stock',
    label: 'Stock Quantity',
    type: 'number',
    required: true,
    nonNegative: true,
    placeholder: '0'
  },
  {
    name: 'image',
    label: 'Product Image',
    type: 'file',
    accept: 'image/*',
    required: true
  }
];

export const editProductFields = [
  {
    name: 'title',
    label: 'Product Name',
    type: 'text'
  },
  {
    name: 'description',
    label: 'Description',
    type: 'textarea',
    rows: 4
  },
  {
    name: 'category',
    label: 'Category',
    type: 'select',
    options: [
      // Must match backend VALID_CATEGORIES in `backend/services/productService.js`
      { value: 'Electronics', label: 'Electronics' },
      { value: 'Clothing', label: 'Clothing' },
      { value: 'Books', label: 'Books' },
      { value: 'Home & Kitchen', label: 'Home & Kitchen' },
      { value: 'Sports', label: 'Sports' }
    ]
  },
  {
    name: 'price',
    label: 'Price',
    type: 'number',
    nonNegative: true,
    step: '0.01'
  },
  {
    name: 'stock',
    label: 'Stock Quantity',
    type: 'number',
    nonNegative: true
  },
  {
    name: 'image',
    label: 'Product Image',
    type: 'file',
    accept: 'image/*'
  }
];

