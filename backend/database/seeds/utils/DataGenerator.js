/**
 * Simple data generator for creating sample data
 */
export class DataGenerator {
  // Static data arrays
  static firstNames = [
    'John', 'Jane', 'Ahmed', 'Priya', 'David', 'Samantha', 'Mohammed', 'Nimali',
    'Robert', 'Kumari', 'Malcom', 'Test', 'Demo', 'Suresh', 'Kamala', 'Ravi'
  ];

  static lastNames = [
    'Doe', 'Smith', 'Hassan', 'Perera', 'Wilson', 'Fernando', 'Ali', 'Silva',
    'Brown', 'Jayawardena', 'Kumar', 'Singh', 'Patel', 'Sharma', 'Gupta', 'Ahmad'
  ];

  static cities = [
    { name: 'Colombo', state: 'Western Province', zipCode: '00100' },
    { name: 'Kandy', state: 'Central Province', zipCode: '20000' },
    { name: 'Galle', state: 'Southern Province', zipCode: '80000' },
    { name: 'Jaffna', state: 'Northern Province', zipCode: '40000' },
    { name: 'Negombo', state: 'Western Province', zipCode: '11500' }
  ];

  static streets = [
    'Main Street', 'Galle Road', 'Kandy Road', 'Jaffna Road', 'Negombo Road',
    'High Street', 'Park Avenue', 'Church Street', 'Temple Road', 'School Lane'
  ];


  /**
   * Generate a random phone number in Sri Lankan format
   */
  static generatePhoneNumber() {
    const prefixes = ['771', '772', '773', '774', '775', '776', '777', '778', '779'];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const number = Math.floor(100000 + Math.random() * 900000);
    return `+94${prefix}${number}`;
  }

  /**
   * Generate a random email address
   */
  static generateEmail(firstName, lastName) {
    const domains = ['example.com', 'test.com', 'demo.com'];
    const domain = domains[Math.floor(Math.random() * domains.length)];
    return `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domain}`;
  }

  /**
   * Generate a random address
   */
  static generateAddress() {
    const city = this.cities[Math.floor(Math.random() * this.cities.length)];
    const street = this.streets[Math.floor(Math.random() * this.streets.length)];
    const streetNumber = Math.floor(Math.random() * 999) + 1;

    return {
      street: `${streetNumber} ${street}`,
      city: city.name,
      state: city.state,
      zipCode: city.zipCode,
      country: 'Sri Lanka'
    };
  }

  /**
   * Generate a random name
   */
  static generateName() {
    const firstName = this.firstNames[Math.floor(Math.random() * this.firstNames.length)];
    const lastName = this.lastNames[Math.floor(Math.random() * this.lastNames.length)];
    return `${firstName} ${lastName}`;
  }

  /**
   * Generate a random password
   */
  static generatePassword(type = 'customer') {
    return type === 'admin' ? 'Admin@123FullySecure' : 'SuperStringPass123!';
  }

  /**
   * Generate a random boolean (useful for account verification status)
   */
  static generateBoolean() {
    return Math.random() > 0.3; // 70% chance of true
  }

  /**
   * Generate a complete customer object
   */
  static generateCustomer(overrides = {}) {
    const firstName = this.firstNames[Math.floor(Math.random() * this.firstNames.length)];
    const lastName = this.lastNames[Math.floor(Math.random() * this.lastNames.length)];
    const fullName = `${firstName} ${lastName}`;

    return {
      name: fullName,
      email: this.generateEmail(firstName, lastName),
      phone: this.generatePhoneNumber(),
      password: this.generatePassword('customer'),
      address: this.generateAddress(),
      isAccountVerified: this.generateBoolean(),
      ...overrides
    };
  }

  /**
   * Generate multiple customers
   */
  static generateCustomers(count, overrides = {}) {
    return Array.from({ length: count }, () => this.generateCustomer(overrides));
  }


}
