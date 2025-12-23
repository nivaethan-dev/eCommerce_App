import * as notificationService from '../services/notificationService.js';
import * as auditService from '../services/auditLogService.js';

// ============================================
// LOGIN TRIGGERS
// ============================================

export const triggerCustomerLogin = async (customerId, customerName) => {
  console.log('🔔 Triggering customer login event for:', customerName);
  try {
    // Create notification
    console.log('Creating notification...');
    const notification = await notificationService.createNotification(
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
    console.log('✅ Notification created:', notification._id);

    // Create audit log
    console.log('Creating audit log...');
    const auditLog = await auditService.createAuditLog({
      userId: customerId,
      userType: 'Customer',
      action: 'LOGIN',
      resource: 'Auth',
      resourceId: customerId,
      endpoint: '/api/auth/login',
      method: 'POST',
      status: 'success'
    });
    console.log('✅ Audit log created:', auditLog._id);
  } catch (error) {
    console.error('❌ Login trigger error:', error.message);
    console.error('Full error:', error);
    // Don't throw - login should succeed even if logging fails
  }
};

export const triggerAdminLogin = async (adminId, adminName) => {
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
    await auditService.createAuditLog({
      userId: adminId,
      userType: 'Admin',
      action: 'LOGIN',
      resource: 'Auth',
      resourceId: adminId,
      endpoint: '/api/auth/login',
      method: 'POST',
      status: 'success'
    });
  } catch (error) {
    console.error('Admin login trigger error:', error);
  }
};

export const triggerLoginFailed = async (email) => {
  try {
    // Only audit log for failed attempts (no notification)
    // Note: Using 'Customer' as default userType since we can't determine actual type for failed logins
    await auditService.createAuditLog({
      userId: null,
      userType: 'Customer',
      action: 'LOGIN_FAILED',
      resource: 'Auth',
      resourceId: null,
      endpoint: '/api/auth/login',
      method: 'POST',
      status: 'failure',
      changes: { attemptedEmail: email }
    });
  } catch (error) {
    console.error('Failed login trigger error:', error);
  }
};
