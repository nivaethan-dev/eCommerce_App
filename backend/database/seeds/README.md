# Database Seeder

A simple, clean data seeding system for development environments.

## 🚀 Quick Start

```bash
# Seed all data
npm run seed:all

# Seed specific data
npm run seed:customers
npm run seed:admin

# Reset database (clear + reseed)
npm run seed:reset

# Clear all data (no reseeding)
npm run seed:clear

# Clear specific model data
npm run seed:clear:model -- --model=customers
```

## 📁 Structure

```
database/seeds/
├── BaseSeeder.js          # Template Method pattern - base seeder
├── CustomerSeeder.js      # Customer-specific seeder
├── AdminSeeder.js         # Admin-specific seeder
├── CommandFactory.js      # Command pattern - CLI commands
├── index.js               # Entry point
├── data/                  # Static data files
├── utils/                 # Helper utilities
└── README.md              # This file
```

## 🎯 Design Patterns

### 1. Template Method Pattern
**BaseSeeder** defines the seeding algorithm structure:
1. Validate environment
2. Connect to database
3. Check existing data
4. Clear existing data (if requested)
5. Process data (override in subclasses)
6. Seed data in batches
7. Disconnect from database

### 2. Command Pattern
**CommandFactory** creates commands for CLI operations:
- `customers` - Seed customer data
- `admin` - Seed admin data
- `all` - Seed all data
- `reset` - Clear all + reseed
- `clear` - Clear all data
- `clear:model` - Clear specific model data

## 🔧 Usage

### Basic Usage
```javascript
import { CustomerSeeder } from './CustomerSeeder.js';

const seeder = new CustomerSeeder();
await seeder.run();
```

### Advanced Configuration
```javascript
const seeder = new CustomerSeeder({
  batchSize: 10,              // Process 10 records at a time
  clearExisting: true,        // Clear existing data first
  skipIfExists: false,        // Don't skip if data exists
  dataOptions: {
    generatedCount: 20        // Generate 20 additional customers
  }
});

await seeder.run();
```

### Command Line
```bash
# Direct execution
node database/seeds/index.js customers
node database/seeds/index.js admin
node database/seeds/index.js all
node database/seeds/index.js reset
node database/seeds/index.js clear
node database/seeds/index.js clear:model -- --model=customers
```

## 📊 Data

### Predefined Data
- **6 customers** with specific profiles
- **2 admins** with default credentials

### Generated Data
- **Configurable count** of additional customers
- **Realistic data** with Sri Lankan names and addresses
- **Password hashing** for security

## 🔄 Database Management Commands

### Reset Command (`seed:reset`)
**Clears all data and reseeds fresh data**

```bash
npm run seed:reset
```

**What it does:**
1. ✅ Validates development environment
2. 🗑️ Clears ALL data from all models (Customer, Admin, Product, Order)
3. 🌱 Reseeds fresh data using existing seeders
4. 📊 Provides detailed progress reporting

**Use cases:**
- Fresh start with clean data
- Testing with consistent data
- After schema changes

### Clear All Command (`seed:clear`)
**Clears all data without reseeding**

```bash
npm run seed:clear
```

**What it does:**
1. ✅ Validates development environment
2. 🗑️ Clears ALL data from all models
3. 📊 Reports total records cleared
4. 🚫 Does NOT reseed data

**Use cases:**
- Clean database for manual testing
- Prepare for different data setup
- Debugging with empty database

### Clear Model Command (`seed:clear:model`)
**Clears data from a specific model**

```bash
npm run seed:clear:model -- --model=customers
npm run seed:clear:model -- --model=products
npm run seed:clear:model -- --model=admins
npm run seed:clear:model -- --model=orders
```

**What it does:**
1. ✅ Validates development environment
2. 🗑️ Clears data from specified model only
3. 📊 Reports records cleared for that model
4. 🚫 Does NOT reseed data

**Supported models:**
- `customers` / `customer`
- `admins` / `admin`
- `products` / `product`
- `orders` / `order`

**Use cases:**
- Clear specific data type for testing
- Remove only problematic data
- Selective database cleanup

### Safety Features
- **Environment Protection**: Only works in `development` mode
- **Comprehensive Clearing**: Clears all models, not just seeded ones
- **Error Handling**: Graceful handling of model clearing errors
- **Connection Management**: Proper database connection cleanup

## 🛠️ Customization

### Adding New Seeders
1. Create seeder class extending `BaseSeeder`
2. Override `processData()` for custom processing
3. Override `run()` for custom logging
4. Register command in `index.js`

```javascript
// Example: ProductSeeder.js
export class ProductSeeder extends BaseSeeder {
  constructor(options = {}) {
    super(Product, productData, options);
  }

  async processData() {
    // Custom processing logic
    return this.data;
  }

  async run() {
    console.log('🚀 Starting Product Seeder...');
    await super.run();
  }
}
```

### Adding New Commands
```javascript
// In index.js
class ProductCommand {
  constructor(name, options) {
    this.name = name;
    this.options = options;
  }

  async execute() {
    const seeder = new ProductSeeder(this.options);
    await seeder.run();
  }
}

CommandFactory.registerCommand('products', ProductCommand);
```

## 🔒 Security

- **Development only**: Only runs when `NODE_ENV=development`
- **Password hashing**: All passwords are hashed using bcrypt
- **Data validation**: Input validation before seeding

## 🚨 Troubleshooting

### Common Issues

1. **Environment Error**
   ```bash
   ⛔ Seeding is only allowed in development environment
   ```
   **Solution**: Set `NODE_ENV=development`

2. **Database Connection Error**
   ```bash
   ❌ MongoDB connection error: ECONNREFUSED
   ```
   **Solution**: Start MongoDB server

3. **Data Already Exists**
   ```bash
   ℹ️ Customer records already exist, skipping seed
   ```
   **Solution**: Use `clearExisting: true` or `skipIfExists: false`

### Debug Mode
```bash
DEBUG=seeder:* npm run seed:customers
```

## 📈 Performance

- **Batch processing**: Processes data in configurable batches
- **Memory efficient**: Handles large datasets without memory issues
- **Database optimized**: Uses MongoDB bulk operations

## 🧪 Testing

```javascript
// Unit test example
import { CustomerSeeder } from './CustomerSeeder.js';

test('should create customer seeder', () => {
  const seeder = new CustomerSeeder();
  expect(seeder).toBeInstanceOf(CustomerSeeder);
});
```

---

**Simple, clean, and effective data seeding for development.**