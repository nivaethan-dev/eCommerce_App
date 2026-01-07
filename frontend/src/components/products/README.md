# Product Components

Simple, reusable components for displaying products on the ProductsPage.

## Component Hierarchy

```
ProductsPage
 └─ CategorySection
     ├─ SectionHeader
     └─ ProductGrid
         └─ ProductCard
             ├─ Image
             └─ Price
```

## Components

### CategorySection
Wraps a complete category section with header and products.

**Props:**
- `category` (string) - Category name
- `products` (array) - Array of product objects
- `onViewAll` (function) - Handler for "View All" action

**Usage:**
```jsx
<CategorySection
  category="Electronics"
  products={productsArray}
  onViewAll={() => handleViewAll('Electronics')}
/>
```

### SectionHeader
Displays category title with optional "View All" action.

**Props:**
- `title` (string) - Category title
- `onViewAll` (function, optional) - Handler for "View All" action

### ProductGrid
Responsive grid layout container for products.

**Props:**
- `products` (array) - Array of product objects

### ProductCard
Individual product display card with image, name, description, and price.

**Props:**
- `product` (object) - Product object with: `id`, `name`, `price`, `image`, `description`

**Product Object Structure:**
```javascript
{
  id: 1,
  name: 'Product Name',
  price: 99.99,
  image: 'https://example.com/image.jpg',
  description: 'Product description' // optional
}
```

## Reusable UI Components

### Image
Product image component with loading and error handling.

**Props:**
- `src` (string) - Image URL
- `alt` (string) - Alt text for accessibility
- `className` (string) - Additional CSS classes

### Price
Price display component with formatting.

**Props:**
- `amount` (number) - Price amount
- `currency` (string) - Currency symbol (default: '$')
- `className` (string) - Additional CSS classes

## Features

- ✅ Responsive grid layout (mobile, tablet, desktop)
- ✅ Image loading states & error handling
- ✅ Price formatting
- ✅ Hover effects and animations
- ✅ Category sections with "View All" actions
- ✅ Empty state handling
- ✅ Accessibility support

## Styling

Each component has its own CSS file for easy customization:
- `CategorySection.css`
- `SectionHeader.css`
- `ProductGrid.css`
- `ProductCard.css`
- `Image.css`
- `Price.css`

