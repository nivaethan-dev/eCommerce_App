import mongoose from 'mongoose';

const { Schema } = mongoose;

/**
 * AuditLog Model - IMMUTABLE (Read-Only)
 * Audit logs are permanent records for compliance and security.
 * They CANNOT be updated or deleted once created.
 */
const auditLogSchema = new Schema({
  // Stores the ID of the user who performed the action.
  userId: { type: mongoose.Schema.Types.ObjectId, refPath: 'userType', immutable: true },
  // Stores the type of user who performed the action.
  userType: { type: String, enum: ['Customer', 'Admin'], required: true, immutable: true },
  action: { type: String, required: true, immutable: true },      // Describes what happened. Example values:CREATE, UPDATE, DELETE
  resource: { type: String, required: true, immutable: true },    // The type of resource affected. Example: 'Order', 'Product', 'Customer'.
  resourceId: { type: mongoose.Schema.Types.ObjectId, refPath: 'resource', immutable: true },
  changes: { type: Object, default: {}, immutable: true },        // old/new values
  endpoint: { type: String, immutable: true },
  method: { type: String, enum: ['GET', 'POST', 'PUT', 'DELETE'], immutable: true },
  ipAddress: { type: String, immutable: true },
  geolocation: {
    country: { type: String, immutable: true },
    region: { type: String, immutable: true },
    city: { type: String, immutable: true },
    timezone: { type: String, immutable: true }
  },
  status: { type: String, enum: ['success', 'failure'], default: 'success', immutable: true },
  timestamp: { type: Date, default: Date.now, immutable: true },
}, {
  timestamps: false,
  // Prevent version key updates (no __v field updates)
  versionKey: false
});

// Middleware to prevent updates - throw error if anyone tries to update
auditLogSchema.pre('findOneAndUpdate', function (next) {
  next(new Error('Audit logs are immutable and cannot be updated'));
});

auditLogSchema.pre('updateOne', function (next) {
  next(new Error('Audit logs are immutable and cannot be updated'));
});

auditLogSchema.pre('updateMany', function (next) {
  next(new Error('Audit logs are immutable and cannot be updated'));
});

// Middleware to prevent deletes - throw error if anyone tries to delete
auditLogSchema.pre('findOneAndDelete', function (next) {
  next(new Error('Audit logs are immutable and cannot be deleted'));
});

auditLogSchema.pre('deleteOne', function (next) {
  next(new Error('Audit logs are immutable and cannot be deleted'));
});

auditLogSchema.pre('deleteMany', function (next) {
  next(new Error('Audit logs are immutable and cannot be deleted'));
});

// Prevent instance-level updates
auditLogSchema.pre('save', function (next) {
  if (!this.isNew) {
    next(new Error('Audit logs are immutable and cannot be modified'));
  }
  next();
});

const AuditLog = mongoose.model('AuditLog', auditLogSchema);
export default AuditLog;
