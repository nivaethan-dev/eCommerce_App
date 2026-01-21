// dbConnection.js
import mongoose from 'mongoose';

// =============================================================================
// ENVIRONMENT-BASED DATABASE SELECTION
// =============================================================================

const isProduction = process.env.NODE_ENV === 'production';
const environment = isProduction ? 'production' : 'development';

// Select the appropriate MongoDB URI based on environment
// Fallback to generic MONGODB_URI for backward compatibility
const uri = isProduction
  ? (process.env.MONGODB_URI_PROD || process.env.MONGODB_URI)
  : (process.env.MONGODB_URI_DEV || process.env.MONGODB_URI);

// Validate that a URI is available
if (!uri) {
  const envVar = isProduction ? 'MONGODB_URI_PROD' : 'MONGODB_URI_DEV';
  throw new Error(`❌ ${envVar} (or MONGODB_URI) is missing. Check your .env file!`);
}

const connect = async () => {
  try {
    await mongoose.connect(uri);
    console.log(`✅ Connected to MongoDB [${environment}]`);
  } catch (error) {
    console.error(`❌ MongoDB connection error [${environment}]:`, error.message);
    // In production, exit on connection failure
    if (isProduction) {
      process.exit(1);
    }
  }
};

export default connect;
