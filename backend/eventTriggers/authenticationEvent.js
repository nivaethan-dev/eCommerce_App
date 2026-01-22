import * as notificationService from '../services/notificationService.js';
import * as auditService from '../services/auditLogService.js';
import Admin from '../models/Admin.js';
import { LOCK_TIME } from '../config/rateLimitConfig.js';


// ============================================
// SIGNUP TRIGGERS
// ============================================

export const triggerCustomerSignup = async (customerId, customerName, customerEmail, clientInfo) => {
  try {
    const { ip: ipAddress, country, city, region, timezone } = clientInfo || {};

    // 1. Create welcome notification for the customer
    await notificationService.createNotification(
      customerId,
      'Customer',
      {
        type: 'account_created',
        title: 'Welcome to Our Store!',
        message: `Welcome, ${customerName}! Your account has been successfully created. Start shopping and enjoy exclusive deals!`,
        priority: 'low',
        metadata: { email: customerEmail }
      }
    );

    // 2. Create audit log for admin review
    const geolocation = { country, city, region, timezone };
    await auditService.createAuditLog({
      userId: customerId,
      userType: 'Customer',
      action: 'CUSTOMER_SIGNUP',
      resource: 'Auth',
      resourceId: customerId,
      endpoint: '/api/auth/register',
      method: 'POST',
      ipAddress,
      geolocation,
      status: 'success',
      changes: { customerName, customerEmail }
    });
  } catch (error) {
    console.error('Customer signup trigger error:', error.message);
  }
};

// ============================================
// LOGIN TRIGGERS
// ============================================

export const triggerCustomerLogin = async (customerId, customerName, clientInfo) => {
  try {
    const { ip: ipAddress, country, city, region, timezone } = clientInfo || {};

    // 1. Create notification for customer ONLY
    await notificationService.createNotification(
      customerId,
      'Customer',
      {
        type: 'login_success',
        title: 'Login Successful',
        message: `Welcome back, ${customerName}!`,
        priority: 'low',
        metadata: {}
      }
    );

    // 2. Create audit log for admin review
    const geolocation = { country, city, region, timezone };
    await auditService.createAuditLog({
      userId: customerId,
      userType: 'Customer',
      action: 'LOGIN',
      resource: 'Auth',
      resourceId: customerId,
      endpoint: '/api/auth/login',
      method: 'POST',
      ipAddress,
      geolocation,
      status: 'success'
    });
  } catch (error) {
    console.error('Customer login trigger error:', error.message);
  }
};

export const triggerAdminLogin = async (adminId, adminName, clientInfo) => {
  try {
    const { ip: ipAddress, country, city, region, timezone } = clientInfo || {};

    // Create notification
    await notificationService.createNotification(
      adminId,
      'Admin',
      {
        type: 'login_success',
        title: 'Admin Login',
        message: `Welcome back, ${adminName}!`,
        priority: 'low',
        metadata: {}
      }
    );

    // Create audit log
    const geolocation = { country, city, region, timezone };
    await auditService.createAuditLog({
      userId: adminId,
      userType: 'Admin',
      action: 'LOGIN',
      resource: 'Auth',
      resourceId: adminId,
      endpoint: '/api/auth/login',
      method: 'POST',
      ipAddress,
      geolocation,
      status: 'success'
    });
  } catch (error) {
    console.error('Admin login trigger error:', error);
  }
};

export const triggerLoginFailed = async (email, clientInfo, userType = 'Customer', userId = null) => {
  try {
    const { ip: ipAddress, country, city, region, timezone } = clientInfo || {};

    // Only audit log for failed attempts (no notification)
    const geolocation = { country, city, region, timezone };
    await auditService.createAuditLog({
      userId: userId,
      userType: userType,
      action: 'LOGIN_FAILED',
      resource: 'Auth',
      resourceId: userId,
      endpoint: '/api/auth/login',
      method: 'POST',
      ipAddress,
      geolocation,
      status: 'failure',
      changes: { attemptedEmail: email }
    });
  } catch (error) {
    console.error('Failed login trigger error:', error);
  }
};

export const triggerAccountLocked = async (userId, userType, email, clientInfo) => {
  try {
    const { ip: ipAddress, country, city, region, timezone } = clientInfo || {};
    const lockMinutes = Math.round(LOCK_TIME / 60000);

    // 1. Audit Log (Always First)
    const geolocation = { country, city, region, timezone };
    await auditService.createAuditLog({
      userId,
      userType,
      action: 'ACCOUNT_LOCKED',
      resource: 'Auth',
      resourceId: userId,
      endpoint: '/api/auth/login',
      method: 'POST',
      ipAddress,
      geolocation,
      status: 'failure',
      changes: { email, message: `Account locked for ${lockMinutes} minutes due to multiple failed attempts` }
    });

    // 2. Notify ALL Admins about the lockout (Security Alert)
    const admins = await Admin.find({});
    for (const admin of admins) {
      await notificationService.createNotification(
        admin._id,
        'Admin',
        {
          type: 'security_alert',
          title: 'Security Alert: Account Locked',
          message: `Account ${email} (${userType}) has been locked due to excessive failed login attempts. IP: ${ipAddress} (${city || 'Unknown'}, ${country || 'Unknown'})`,
          priority: 'high',
          metadata: { affectedUserId: userId, affectedUserType: userType, email, ipAddress, location: `${city}, ${country}` }
        }
      );
    }
  } catch (error) {
    console.error('Account locked trigger error:', error);
  }
};
