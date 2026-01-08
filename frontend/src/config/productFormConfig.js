// Product form field configurations

export const addProductFields = [
  {
    name: 'name',
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
      { value: 'Electronics', label: 'Electronics' },
      { value: 'Fashion', label: 'Fashion' },
      { value: 'Home & Garden', label: 'Home & Garden' },
      { value: 'Sports', label: 'Sports' },
      { value: 'Books', label: 'Books' }
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
    accept: 'image/*'
  }
];

export const editProductFields = [
  {
    name: 'name',
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
      { value: 'Electronics', label: 'Electronics' },
      { value: 'Fashion', label: 'Fashion' },
      { value: 'Home & Garden', label: 'Home & Garden' },
      { value: 'Sports', label: 'Sports' },
      { value: 'Books', label: 'Books' }
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

