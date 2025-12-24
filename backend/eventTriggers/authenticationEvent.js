import * as notificationService from '../services/notificationService.js';
import * as auditService from '../services/auditLogService.js';
import { getGeolocation } from '../utils/geoipUtils.js';
import Admin from '../models/Admin.js';

// ============================================
// LOGIN TRIGGERS
// ============================================

export const triggerCustomerLogin = async (customerId, customerName, ipAddress) => {
  try {
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
    const geolocation = getGeolocation(ipAddress);
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

export const triggerAdminLogin = async (adminId, adminName, ipAddress) => {
  try {
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
    const geolocation = getGeolocation(ipAddress);
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

export const triggerLoginFailed = async (email, ipAddress, userType = 'Customer', userId = null) => {
  try {
    // Only audit log for failed attempts (no notification)
    const geolocation = getGeolocation(ipAddress);
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

export const triggerAccountLocked = async (userId, userType, email, ipAddress) => {
  try {
    // 1. Audit Log (Always First)
    const geolocation = getGeolocation(ipAddress);
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
      changes: { email, message: 'Account locked for 15 minutes due to multiple failed attempts' }
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
          message: `Account ${email} (${userType}) has been locked due to excessive failed login attempts. IP: ${ipAddress}`,
          priority: 'high',
          metadata: { affectedUserId: userId, affectedUserType: userType, email, ipAddress }
        }
      );
    }
  } catch (error) {
    console.error('Account locked trigger error:', error);
  }
};
