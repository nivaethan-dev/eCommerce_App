# Entity Relationship Diagram (ERD) Documentation

## E-Commerce Application Database Schema

---

## Entities and Attributes

### 1. Customer Entity

**Description:** Stores customer/user information and shopping cart data.

| Attribute | Type | Constraints | Description |
|-----------|------|-------------|-------------|
| `_id` | ObjectId | Primary Key | Customer unique identifier |
| `name` | String | Required | Customer full name |
| `email` | String | Required, Unique | Customer email address |
| `phone` | String | Required, Unique | Customer phone number |
| `password` | String | Required | Hashed password |
| `isAccountVerified` | Boolean | Default: false | Account verification status |
| `verifyOtp` | String | Default: '' | OTP for account verification |
| `verifyOtpExpireAt` | Number | Default: 0 | OTP expiration timestamp |
| `resetOtp` | String | Default: '' | OTP for password reset |
| `resetOtpExpireAt` | Number | Default: 0 | Reset OTP expiration timestamp |
| `createdAt` | Date | Default: Date.now | Account creation timestamp |
| `updatedAt` | Date | Default: Date.now | Last update timestamp |

**Nested Address Schema:**
| Attribute | Type | Constraints | Description |
|-----------|------|-------------|-------------|
| `street` | String | Optional | Street address |
| `city` | String | Optional | City |
| `state` | String | Optional | State/Province |
| `zipCode` | String | Optional | Postal code |
| `country` | String | Default: 'Sri Lanka' | Country |

**Nested Cart Items Schema:**
| Attribute | Type | Constraints | Description |
|-----------|------|-------------|-------------|
| `productId` | ObjectId | Required, Ref: Product | Reference to product |
| `quantity` | Number | Default: 1 | Item quantity in cart |
| `addedAt` | Date | Default: Date.now | When item was added |

---

### 2. Admin Entity

**Description:** Stores administrator accounts with elevated privileges.

| Attribute | Type | Constraints | Description |
|-----------|------|-------------|-------------|
| `_id` | ObjectId | Primary Key | Admin unique identifier |
| `name` | String | Required | Admin full name |
| `email` | String | Required, Unique | Admin email address |
| `phone` | String | Required, Unique | Admin phone number |
| `password` | String | Required | Hashed password |
| `role` | String | Default: 'admin', Immutable | User role identifier |
| `createdAt` | Date | Default: Date.now | Account creation timestamp |
| `updatedAt` | Date | Default: Date.now | Last update timestamp |

---

### 3. Product Entity

**Description:** Stores product catalog information.

| Attribute | Type | Constraints | Description |
|-----------|------|-------------|-------------|
| `_id` | ObjectId | Primary Key | Product unique identifier |
| `title` | String | Required | Product name |
| `description` | String | Required | Product description |
| `price` | Number | Required, Min: 0 | Product price |
| `stock` | Number | Required, Min: 0, Integer | Available quantity |
| `image` | String | Required | Image file path |
| `category` | String | Required | Product category |
| `createdAt` | Date | Default: Date.now, Immutable | Product creation timestamp |
| `updatedAt` | Date | Default: Date.now | Last update timestamp |

**Indexes:**
- Compound unique index on `(title, category)` to prevent duplicate products in same category

**Image Path Validation:**
- Must start with: `uploads/products/product_`
- Example: `uploads/products/product_abc123def456.jpg`

---

### 4. Order Entity

**Description:** Stores customer order information with product snapshots.

| Attribute | Type | Constraints | Description |
|-----------|------|-------------|-------------|
| `_id` | ObjectId | Primary Key | Order unique identifier |
| `customer` | ObjectId | Required, Ref: Customer | Reference to customer |
| `totalPrice` | Number | Required | Order total price |
| `status` | String | Enum: ['pending', 'cancelled'], Default: 'pending' | Order status |
| `createdAt` | Date | Default: Date.now | Order creation timestamp |

**Nested Products Array Schema:**
| Attribute | Type | Constraints | Description |
|-----------|------|-------------|-------------|
| `productId` | ObjectId | Required, Ref: Product | Reference to product |
| `quantity` | Number | Default: 1 | Purchased quantity |
| `price` | Number | Required | Price snapshot at purchase time |

**Note:** The products array stores a snapshot of product information at the time of order placement, ensuring historical accuracy even if product details change later.

---

## Relationships

### 1. Customer ↔ Order
- **Type:** One-to-Many
- **Description:** One customer can place multiple orders
- **Foreign Key:** `Order.customer` → `Customer._id`
- **Cascade:** None (orders preserved when customer data is deleted)

### 2. Customer ↔ Product (via Cart)
- **Type:** Many-to-Many (through Cart Items)
- **Description:** Customers can add multiple products to their cart
- **Relationship:** Embedded in Customer collection
- **Foreign Key:** `Customer.cart[].productId` → `Product._id`

### 3. Order ↔ Product
- **Type:** Many-to-Many (via OrderItems)
- **Description:** An order can contain multiple products
- **Relationship:** Embedded in Order collection
- **Foreign Key:** `Order.products[].productId` → `Product._id`
- **Special Attribute:** Price is snapshotted at order time

### 4. Customer ↔ Admin
- **Type:** No direct relationship
- **Description:** Separate user types with different roles
- **Note:** Both use similar authentication mechanisms but are stored in separate collections

---

## Entity Relationship Diagram (Text Representation)

```
┌─────────────────────────────────────────────────────────────────┐
│                         E-COMMERCE DATABASE                     │
└─────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│                         CUSTOMER                               │
├────────────────────────────────────────────────────────────────┤
│ PK  _id                    : ObjectId                          │
│     name                   : String (required)                 │
│     email                  : String (required, unique)         │
│     phone                  : String (required, unique)         │
│     password               : String (required, hashed)         │
│     isAccountVerified      : Boolean (default: false)          │
│     verifyOtp              : String                           │
│     verifyOtpExpireAt      : Number                           │
│     resetOtp               : String                           │
│     resetOtpExpireAt       : Number                           │
│     address.street         : String                           │
│     address.city           : String                           │
│     address.state          : String                           │
│     address.zipCode        : String                           │
│     address.country        : String (default: 'Sri Lanka')   │
│     cart[]                 : Array (embedded)                 │
│       └─ productId         : ObjectId (FK → Product)          │
│       └─ quantity          : Number                           │
│       └─ addedAt           : Date                             │
│     createdAt              : Date                             │
│     updatedAt              : Date                             │
└────────────────────────┬───────────────────────────────────────┘
                         │ 1
                         │
                         │ 1..N
                         │
                         ▼
┌────────────────────────────────────────────────────────────────┐
│                           ORDER                                │
├────────────────────────────────────────────────────────────────┤
│ PK  _id                    : ObjectId                          │
│ FK  customer               : ObjectId → Customer              │
│     totalPrice             : Number (required)                 │
│     status                 : Enum ['pending', 'cancelled']    │
│     products[]             : Array (embedded)                 │
│       └─ productId         : ObjectId (FK → Product)          │
│       └─ quantity          : Number                           │
│       └─ price             : Number (snapshot)                │
│     createdAt              : Date                             │
└────────────────────────┬───────────────────────────────────────┘
                         │ 1..N
                         │
                         │
                         │
┌────────────────────────┴───────────────────────────────────────┐
│                         PRODUCT                                │
├────────────────────────────────────────────────────────────────┤
│ PK  _id                    : ObjectId                          │
│     title                  : String (required, unique with cat)│
│     description            : String (required)                 │
│     price                  : Number (required, min: 0)         │
│     stock                  : Number (required, min: 0, int)    │
│     image                  : String (required)                 │
│     category               : String (required)                 │
│     createdAt              : Date (immutable)                  │
│     updatedAt              : Date                             │
│                                                            │
│ Indexes:                                                      │
│   - Compound: (title, category) - UNIQUE                     │
└────────────────────────────────────────────────────────────────┘


┌────────────────────────────────────────────────────────────────┐
│                          ADMIN                                 │
├────────────────────────────────────────────────────────────────┤
│ PK  _id                    : ObjectId                          │
│     name                   : String (required)                 │
│     email                  : String (required, unique)         │
│     phone                  : String (required, unique)         │
│     password               : String (required, hashed)         │
│     role                   : String (default: 'admin', immut)  │
│     createdAt              : Date                             │
│     updatedAt              : Date                             │
└────────────────────────────────────────────────────────────────┘

Note: Admin entity is separate from Customer with no direct relationships.
Admin has elevated privileges for product management and order administration.
```

---

## Cardinality Summary

| From Entity | Relationship | To Entity | Type |
|-------------|-------------|-----------|------|
| Customer | Places | Order | One-to-Many (1:N) |
| Order | Contains | Product | Many-to-Many (M:N via OrderItems) |
| Customer | Has in Cart | Product | Many-to-Many (M:N via CartItems) |
| Customer | - | Admin | No relationship (separate collections) |

---

## Design Decisions

### 1. Embedded vs Referenced Documents
- **Cart Items:** Embedded in Customer (frequent access, limited size)
- **Order Items:** Embedded in Order (historical snapshot, no updates needed)

### 2. Price Snapshot in Orders
- Order stores product price at purchase time
- Prevents changes to product prices from affecting past orders

### 3. Separate Customer and Admin Collections
- Different authentication requirements
- Different data needs
- Clear separation of concerns
- Separate JWT secrets per SRS

### 4. Cart Design
- Embedded array in Customer for performance
- Automatic validation of referenced products
- No separate Cart collection needed

### 5. Address Nested Schema
- Embedded subdocument within Customer
- Simple structure, no separate Address collection
- Suitable for single address per customer

---

## Database Technology

- **Database:** MongoDB (NoSQL Document Database)
- **ORM:** Mongoose (MongoDB Object Data Modeling)
- **Relationships:** Document references and embedded subdocuments

---

## Notes

1. **Audit Logs:** Per SRS FR-7.1, audit logging functionality is mentioned but the AuditLog model is not yet implemented.

2. **Notifications:** Per SRS, notifications for order status changes are mentioned but the Notification model is not yet implemented.

3. **Soft Deletes:** Currently no soft delete mechanism. Consider adding `deletedAt` field for audit trails if needed.

4. **Data Integrity:** MongoDB does not enforce foreign key constraints natively. Application-level validation is required.

5. **Scalability:** Current design supports thousands of products and customers. For larger scale, consider:
   - Indexing strategies
   - Document size limits (MongoDB 16MB max)
   - Read/write patterns optimization
