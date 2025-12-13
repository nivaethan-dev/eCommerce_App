# Components Documentation

## Header Component

The `Header` component provides the main navigation and search functionality for the ecommerce application.

### Features

1. **Logo/Brand Name** - "ShopHub" with shopping cart icon, displayed on the left side
2. **Search Bar** with:
   - Text input field for search queries
   - Category filter dropdown with 6 categories:
     - Electronics
     - Clothing
     - Books
     - Home & Kitchen
     - Sports
     - Toys
   - Search button with search icon
3. **Navigation Links** - Currently includes "Home" link
4. **Cart Icon** with:
   - Shopping cart icon
   - Item count badge showing total quantity of items in cart
   - Auto-fetches cart data on component mount
   - Integration with cart API (`GET /api/customers/cart`)

### Usage

```jsx
import Header from './components/Header';

function App() {
  return (
    <div>
      <Header />
      {/* Your content */}
    </div>
  );
}
```

### Cart Integration

The Header automatically fetches cart data on mount using the cart API endpoint. If the user is not logged in or the cart is empty, it displays `0` items.

### Styling

The component is fully responsive with:
- Desktop layout: Full search bar with category dropdown
- Tablet layout: Optimized spacing
- Mobile layout: Search bar wraps to full width, simplified category dropdown
- Light/Dark mode support

---

## Footer Component

The `Footer` component provides site-wide information and links at the bottom of every page.

### Features

1. **About Section** - Brief description of ShopHub
2. **Quick Links** - Navigation to key pages:
   - Home
   - Products
   - About Us
   - Contact
3. **Customer Service** - Support links:
   - Help Center
   - Shipping Info
   - Returns
   - Track Order
4. **Contact Information**:
   - Phone number
   - Email address
5. **Bottom Bar** with:
   - Copyright notice
   - Legal links (Privacy Policy, Terms of Service, Cookie Policy)

### Usage

```jsx
import Footer from './components/Footer';

function App() {
  return (
    <div>
      {/* Your content */}
      <Footer />
    </div>
  );
}
```

### Styling

The footer is fully responsive with:
- Desktop: 4-column grid layout
- Tablet: 2-column grid layout
- Mobile: Single column layout
- Light/Dark mode support
- Sticky positioning at the bottom of the page

---

## Constants Updated

The `utils/constants.js` file has been updated with:

### New API Endpoints
- `CART: '/api/customers/cart'` - Get cart contents
- `CART_ADD: '/api/customers/cart/add'` - Add item to cart
- `CART_UPDATE: '/api/customers/cart/update'` - Update cart item
- `CART_REMOVE: (productId) => '/api/customers/cart/remove/${productId}'` - Remove item from cart

### Product Categories
```javascript
export const PRODUCT_CATEGORIES = [
  'Electronics',
  'Clothing',
  'Books',
  'Home & Kitchen',
  'Sports',
  'Toys',
];
```

---

## Next Steps

To fully implement the components, you may want to:

1. **Add routing** - Integrate React Router for navigation
2. **Implement search** - Connect search form to product search API
3. **Add cart page** - Create dedicated cart page and link from header
4. **User authentication** - Show/hide cart based on login status
5. **Add more navigation items** - Categories, Deals, etc.
6. **Implement cart updates** - Real-time cart count updates when items are added/removed


