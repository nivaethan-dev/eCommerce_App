# Comprehensive Security & Audit Logging Implementation Documentation

## 1. Executive Summary
This document provides a detailed technical overview of the security architecture, audit logging mechanisms, and event notification systems implemented for the eCommerce application. It outlines the design decisions, compliance alignments (OWASP, SOC 2, PCI-DSS), and defensive strategies against common web vulnerabilities.

The core focus has been to create a "Defense-in-Depth" system that protects user accounts while providing administrators with total visibility into system activities.

---

## 2. Implemented Features & Architecture

### 2.1 Centralized Immutable Audit Logging
We have established a robust audit logging system that serves as the "Single Source of Truth" for all critical system events.

*   **Centralized Collection**: All critical actions across the system—Authentication (Login, Failure, Lockout) and Transactions (Orders)—are logged into a single `AuditLog` MongoDB collection.
*   **Strict Immutability**:
    *   The Mongoose model (`AuditLog.js`) is configured with middleware hooks (`pre('save')`, `pre('findOneAndUpdate')`, etc.) that strictly prevent **updates** or **deletes** of existing logs.
    *   This "Write-Once-Read-Many" (WORM) architecture is a mandatory requirement for compliance standards like SOC 2 and HIPAA.
*   **Rich Metadata Schema**: Every log entry captures a complete context of the event:
    *   **User Identity**: `userId` and `userType` (Customer/Admin).
    *   **Network Context**: `ipAddress` and `geolocation` (Country, City) for forensic tracking.
    *   **Action Details**: `action` (e.g., `LOGIN`, `NEW_ORDER`), `resource`, `resourceId`, and `changes` (a diff of what changed).
*   **Differentiated Reporting**:
    *   **Registered User Errors**: Logs explicitly tag `userType: 'Customer'` or `'Admin'` with their specific `userId` for account-level tracking.
    *   **Unknown User Errors**: Logs default to a generic user type but capture the `attemptedEmail` in the `changes` object to allow detection of enumeration attacks.

### 2.2 Intelligent Order Notification System
The order placement logic was refactored to eliminate redundancy and provide role-specific context.

*   **Event Trigger Logic**: The `triggerOrderPlaced` function now centrally manages all side effects of a new order.
*   **Customer Experience**: Sends a personalized `ORDER_PLACED` notification to the customer.
*   **Admin Operations**: Automatically fetches **all** active administrators and sends each a `NEW_ORDER` notification. This ensures that as the admin team grows, no code changes are needed to keep everyone informed.
*   **Audit labeling Decision**:
    *   We deliberately chose to label the audit log for this event as `NEW_ORDER` rather than `ORDER_PLACED`.
    *   This aligns with the Administrator's mental model ("We received a New Order") and avoids database bloat by recording the event only once.

### 2.3 Dual-Layer Authentication Security (Account Locking)
To protect against unauthorized access, we implemented a sophisticated locking mechanism that operates at two distinct layers of the application stack.

#### A. Layer 1: Network-Level Protection (IP Rate Limiting)
*   **Location**: `middleware/rateLimitMiddleware.js`
*   **Mechanism**: Tracks the incoming request's IP address.
*   **Threshold**: Blocks access after **5 failed requests** within a **15-minute window**.
*   **Strategic Purpose**:
    *   Protect against **DDoS attacks** (server exhaustion).
    *   Defeat **"Password Spray" attacks**, where an attacker uses one password against thousands of different user emails. Since the source IP is constant, it gets blocked regardless of the target email.

#### B. Layer 2: Identity-Level Protection (Account Locking)
*   **Location**: `controllers/authController.js` and User Models.
*   **Mechanism**: Tracks the specific User Account (Email Address).
*   **Threshold**: Locks the account after **5 failed login attempts** within a **15-minute window**.
*   **Strategic Purpose**:
    *   Defeat **"Brute Force" attacks** where an attacker targets a specific high-value account (e.g., `admin@company.com`) using a **Botnet** (thousands of different IP addresses).
    *   Since the lock is applied to the *Account*, rotating IPs will not bypass this protection.

#### C. Interaction & Scenarios Table
| Attack Scenario | System Response | Outcome |
| :--- | :--- | :--- |
| **Legitimate User forgets password 5 times** | Account is locked **AND** IP is blocked. | Maximum protection; user must wait 15 mins. |
| **Attacker tries 1 password for 5 different users** | IP is blocked by Middleware (Layer 1). | Accounts remain safe; Attacker source is neutralized. |
| **Botnet uses 5 different IPs to try 1 user** | Account is locked by Database Logic (Layer 2). | Individual IPs might not hit limit, but the Account protects itself. |

#### D. Implementation Details
*   **Schema Enhancements**: Added `loginAttempts` (Number) and `lockUntil` (Date) fields to both `Customer` and `Admin` schemas.
*   **Performance Optimization**: The login controller checks the `lockUntil` timestamp **before** performing the expensive `bcrypt.compare()` hash verification. This prevents attackers from consuming server CPU resources even during an active attack.
*   **Self-Healing**: Accounts automatically unlock after the 15-minute window expires, balancing security with reduced IT support overhead.

### 2.4 Security Operations Center (SOC) Notifications
*   **Proactive Alerting**: The system treats any account lockout as a high-priority security incident.
*   **Broadcasting**: If **ANY** account (Customer or Admin) is locked, a `security_alert` notification is broadcast to **ALL** Administrators.
*   **Payload**: The alert contains actionable intelligence: the Locked Email, the User Type, and the Attacker's IP Address.
*   **Privacy Guard**: Conversely, successful login notifications are strictly private and sent **only** to the user who logged in.

---

## 3. Compliance & Best Practices Review
The current architecture has been validated against industry-standard security norms.

### 3.1 Account Locking Norms
*   **Threshold Validation**: The "5 attempts / 15 minutes" rule is the industry "Sweet Spot". It is strict enough to make brute-forcing mathematically impossible (it would take years to guess a strong password) but forgiving enough to minimize user frustration.
*   **Visibility**: We explicitly log the `ACCOUNT_LOCKED` event separately from failure logs. This is crucial because middleware IP blocks are often "silent" (only visible in server access logs), whereas an Account Lockout is a business-logic event that requires administrative visibility.

### 3.2 Audit Logging Norms
*   **Forensic Readiness**: By capturing both IP and Geolocation, administrators can detect distributed attacks (e.g., noticing that a single account failed login 5 times from 5 different countries in 1 minute).
*   **Data Privacy (PII)**: The system logs the `attemptedEmail` for context but explicitly **NEVER logs the password**. Logging passwords is a critical security vulnerability (P1) that we have strictly avoided.

---

## 4. Key Architectural Decisions (Q&A)

### Q1: Why not log both `ORDER_PLACED` and `NEW_ORDER`?
**Decision**: We log only `NEW_ORDER`.
**Reasoning**:
1.  **Single Source of Truth**: An Audit Log tracks *facts*. One transaction = One Fact. Creating duplicate logs clutters the database and complicates analytics.
2.  **Notification Bloat**: We avoid the anti-pattern of creating 1 log per notification sent.
3.  **Context**: Since the log already contains the `userId` (Customer), labeling the action `NEW_ORDER` satisfies the Admin's perspective ("We have a new order") without losing the actor's context.

### Q2: Why don't Admins get notifications for Customer Logins?
**Decision**: Suppressed to prevent "Notification Fatigue".
**Reasoning**: In a high-volume system, getting a ping for every customer login would cause admins to ignore *all* notifications, including critical alerts. Login activity should be reviewed via the Audit Dashboard, not real-time alerts.

### Q3: How do we handle "Non-Existent Email" attacks?
**Decision**: Log the failure without locking.
**Reasoning**:
*   You cannot lock an account that does not exist.
*   **Action**: The system creates a `LOGIN_FAILED` audit log. The `changes` object captures the `attemptedEmail` (e.g., `ghost@example.com`), allowing admins to spot patterns (e.g., someone guessing employee names).
*   **Defense**: The **IP Rate Limiter** still functions perfectly here, blocking the attacker's source IP after 5 attempts.

### Q4: Is the Login System "Pen-Test Ready"?
**Decision**: Yes, the system is robust against standard penetration testing vectors.
**Security Checklist**:
*   ✅ **Brute Force**: Defeated by Dual-Layer Locking (Account + IP).
*   ✅ **Enumeration**: Defeated by generic "Invalid credentials" error messages (attacker cannot distinguish between "User Not Found" and "Wrong Password").
*   ✅ **Session Hijacking**: Defeated by `HttpOnly` cookies (preventing XSS theft) and Token Rotation (limiting the lifespan of stolen tokens).
*   ✅ **NoSQL Injection**: Defeated by Mongoose Schema validation (inputs are cast to Strings, neutralizing operator injection).

---

## 5. Security Nuances & Accepted Risks

### Timing Attacks (Side-Channel)
*   **The Nuance**: Cryptographic operations (`bcrypt.compare`) are CPU-intensive (~100ms), while database lookups are fast (~10ms).
*   **The Theoretical Attack**: A sophisticated attacker measuring response times with millisecond precision could deduce whether an email exists (Fast Response = User Not Found; Slow Response = Wrong Password).
*   **Risk Assessment**: **Low**. This requires high-precision network conditions and is generally considered an acceptable risk for most commercial applications.
*   **Future Mitigation**: To achieve "Gold Standard" security, we can implement "Dummy Hashing" (running a comparison against a fake hash even when the user is not found) to equalize all response times.

---

## 6. Recommendations for Future Enhancement
1.  **User Notifications**: Implement an email trigger to notify the *user* when their account is locked ("We detected suspicious activity..."), giving them a chance to reset their password if they were compromised.
2.  **Admin Dashboard**: Create a dedicated UI view for "Currently Locked Accounts" with a manual "Unlock Now" button for support cases.
