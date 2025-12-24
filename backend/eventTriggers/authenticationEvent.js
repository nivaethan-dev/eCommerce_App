import * as notificationService from '../services/notificationService.js';
import * as auditService from '../services/auditLogService.js';
import { getGeolocation } from '../utils/geoipUtils.js';

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
  } catch (error) {
    console.error('Account locked trigger error:', error);
  }
};
