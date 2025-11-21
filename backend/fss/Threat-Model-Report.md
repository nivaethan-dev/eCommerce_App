# E-Commerce System Threat Model Summary Report

**Group 10** | November 17, 2025  
**Contributors:** R. Nivaethan (FC222008), W.D.C.S. Gunathunga (FC222017), M.N.F Afrina (FC222001), K.G.A.K.S. Sathsarani (FC222015)

---

## 1. Key Threats and Mitigations

### 1.1 Actor Threats

#### **Customer Actor**
- **Spoofing:** Attackers impersonate legitimate customers to access accounts
  - *Mitigation:* Strong authentication (passwords + MFA), monitor unusual login activity, account lockout after failed attempts
- **Repudiation:** Customers deny placing orders or updating account details
  - *Mitigation:* Tamper-proof audit logs with timestamps for all transactions

#### **Guest Actor**
- **Spoofing:** Unauthenticated users manipulate session identifiers to gain unauthorized access
  - *Mitigation:* Validate session tokens, rate-limit API requests, monitor access patterns
- **Repudiation:** Guests deny malicious requests or API abuse
  - *Mitigation:* Log all guest requests with IP, user agent, and timestamps

#### **Admin Actor**
- **Spoofing:** Attackers impersonate admins to access backend functionality
  - *Mitigation:* MFA enforcement, IP whitelisting, RBAC, suspicious login alerts
- **Repudiation:** Admins deny performing critical actions (user modification, product updates, order deletion)
  - *Mitigation:* Immutable audit logs with digital signatures for critical actions

---

### 1.2 Process Threats

#### **Auth Service**
- **Spoofing:** Stolen credentials/tokens used for unauthorized access
- **Tampering:** Authentication request/response modification, JWT token tampering
- **Repudiation:** Users deny login attempts or authentication actions
- **Information Disclosure:** Password/token exposure via insecure storage or transmission
- **DoS:** Flooding authentication endpoints preventing legitimate logins
- **Privilege Escalation:** Exploiting auth flaws to gain admin privileges
  - *Key Mitigations:* Password hashing + salting, HTTPS, HMAC integrity checks, rate limiting, autoscaling, strict role validation

#### **Customer Service**
- **Spoofing:** Token validation bypassed to access other customer profiles
- **Tampering:** Customer profile data modified without authorization
- **Repudiation:** Profile changes denied by customers
- **Information Disclosure:** PII exposure (emails, addresses, payment details)
- **DoS:** Service overwhelmed by profile update floods
- **Privilege Escalation:** Users access/modify other customers' data
  - *Key Mitigations:* Strict authorization checks, ownership validation, data encryption at rest/transit, audit logging

#### **Order Service** (Critical)
- **Spoofing:** Session token replay to place orders on other accounts
- **Tampering:** Order price/quantity manipulation, payment status falsification
- **Repudiation:** Denial of order placement/cancellation
- **Information Disclosure:** Order history and delivery address exposure
- **DoS:** Order creation endpoint flooding
- **Privilege Escalation:** Unauthorized access to other users' orders
  - *Key Mitigations:* Server-side pricing calculations, order state validation, HMAC signing, non-guessable order IDs, ownership checks

#### **Product Service**
- **Spoofing:** Forged requests to access product management
- **Tampering:** Product price/inventory manipulation by attackers
- **Repudiation:** Product modifications denied
- **Information Disclosure:** Pricing strategy and inventory levels leaked
- **DoS:** Catalog scraping and query flooding
- **Privilege Escalation:** Unauthorized product catalog modifications
  - *Key Mitigations:* Admin-level access controls, request validation, versioned product records, rate limiting

#### **Admin Service** (High Privilege)
- **Spoofing:** Admin account takeover attempts
- **Tampering:** Administrative requests modified to perform unauthorized actions
- **Repudiation:** Critical admin actions denied
- **Information Disclosure:** Internal system configuration and user data exposure
- **DoS:** Admin endpoint flooding preventing legitimate administration
- **Privilege Escalation:** Regular users gain admin privileges
  - *Key Mitigations:* MFA, VPN-gated access, RBAC, confirmation for high-impact operations, tamper-proof audit logs

---

### 1.3 Data Store Threats

#### **Customer Database**
- **Tampering:** Customer records corrupted via injection attacks or weak permissions
  - *Mitigation:* RBAC, parameterized queries, input validation, versioned backups
- **Repudiation:** Data modifications go untracked
  - *Mitigation:* Append-only audit logs with digital signatures
- **Information Disclosure:** Sensitive customer data (emails, addresses, payment info) exposed
  - *Mitigation:* AES-256 encryption at rest, TLS in transit, fine-grained access controls
- **DoS:** Database unavailable due to query flooding or resource exhaustion
  - *Mitigation:* Rate limiting, connection pooling, query timeouts, replication/failover

#### **Admin Database**
- **Tampering:** Admin permissions escalated through unauthorized database writes
  - *Mitigation:* Strict access controls, change approval workflows, audit trails
- **Repudiation:** Privilege changes denied by admins
  - *Mitigation:* Digitally signed admin actions, immutable logs
- **Information Disclosure:** Admin credentials and MFA secrets exposed
  - *Mitigation:* Database-level encryption, secure key management, access logging
- **DoS:** Admin database overwhelmed preventing authentication
  - *Mitigation:* Connection limits, dedicated resources, monitoring

#### **Product Database**
- **Tampering:** Product prices or inventory falsified
  - *Mitigation:* Version control, integrity checks, restricted write access
- **Repudiation:** Price changes or product deletions denied
  - *Mitigation:* Change logs with timestamps and admin IDs
- **Information Disclosure:** Supplier info and profit margins leaked to competitors
  - *Mitigation:* Encryption, access restrictions, data masking in logs
- **DoS:** Catalog unavailable during attacks
  - *Mitigation:* Read replicas, caching, rate limiting

#### **Order Database** (Financial Data)
- **Tampering:** Order totals or payment status modified for fraud
  - *Mitigation:* Cryptographic signing of transactions, validation checks, immutable records
- **Repudiation:** Order transactions denied
  - *Mitigation:* Digital receipts, email confirmations, blockchain-style audit chains
- **Information Disclosure:** Customer purchase patterns and payment data exposed (PCI DSS risk)
  - *Mitigation:* Encryption at rest/transit, tokenization, strict access controls
- **DoS:** Order processing halted by database attacks
  - *Mitigation:* High availability clusters, load balancing, query optimization

#### **Audit Log Database**
- **Tampering:** Security event logs modified to hide attacks
  - *Mitigation:* Write-once storage, cryptographic hash chains, separate infrastructure
- **Repudiation:** Log entries denied or deleted
  - *Mitigation:* Immutable log storage, real-time replication to secure location
- **Information Disclosure:** Logs expose sensitive system internals
  - *Mitigation:* Encryption, data masking, access restrictions
- **DoS:** Log storage overwhelmed or made inaccessible
  - *Mitigation:* Log rotation, archival, redundant storage systems

---

### 1.4 Data Flow Threats (Summary)

**45 data flows analyzed** covering:
- Authentication flows (Customer/Admin login, token exchange)
- Customer operations (profile management, browsing)
- Order flows (creation, validation, payment processing)
- Product flows (catalog queries, inventory checks)
- Admin operations (user management, product updates)
- Database interactions (read/write operations, audit logging)

**Common Data Flow Threats:**
- **MITM Attacks:** Credential/session token interception during transmission
- **Parameter Tampering:** Price, quantity, customer ID manipulation in transit
- **Eavesdropping:** PII and financial data exposure on network
- **Replay Attacks:** Captured tokens/requests reused for unauthorized access
- **Request Flooding:** DoS via excessive API calls
- **Response Manipulation:** Tampered responses to bypass security controls

**Primary Data Flow Mitigations:**
- **TLS 1.3 encryption** for all communications
- **Mutual TLS (mTLS)** for admin and financial flows
- **Network segmentation** between trust boundaries
- **DDoS protection** on critical endpoints
- **IDS/IPS deployment** for threat detection

---

## 2. Risk Prioritization

### Threat Distribution by STRIDE Category
| Category | Count | % | Priority Focus |
|----------|-------|---|----------------|
| **Tampering** | 120 | 36% | Data integrity, transaction validation |
| **Information Disclosure** | 115 | 35% | Encryption, access controls |
| **Denial of Service** | 35 | 11% | Rate limiting, autoscaling |
| **Spoofing** | 25 | 8% | Authentication, session management |
| **Repudiation** | 15 | 5% | Audit logging, non-repudiation |
| **Elevation of Privilege** | 20 | 6% | Authorization, RBAC enforcement |

**Total Threats Identified:** 330+ across all components

### Critical Risk Areas (Immediate Action Required)

#### **Critical Priority**
1. **Order Service Tampering** (Critical Severity)
   - Risk: Financial fraud via price manipulation
   - Action: Implement server-side pricing, HMAC validation, cryptographic signing
   
2. **Admin Spoofing** (High Severity)
   - Risk: Complete system compromise via admin takeover
   - Action: Deploy MFA, IP whitelisting, session binding

3. **Order/Customer Database Information Disclosure** (High Severity - PCI/GDPR)
   - Risk: Payment data and PII exposure, regulatory violations
   - Action: Implement AES-256 encryption at rest, TLS 1.3 in transit

4. **Auth Service Privilege Escalation** (High Severity)
   - Risk: Regular users gain admin access
   - Action: Strict role validation, secure token generation, security patches

5. **Audit Log Tampering** (High Severity)
   - Risk: Attack evidence deletion, compliance failures
   - Action: Immutable logging, cryptographic hash chains, isolated infrastructure

#### **High Priority**
- Network segmentation between trust boundaries
- IDS/IPS deployment
- Rate limiting on all services
- VPN-gated admin access
- Redundant logging infrastructure

#### **Medium Priority**
- ML-based anomaly detection
- Zero-trust architecture
- Advanced monitoring and alerting
- Data masking in logs
- Regular penetration testing

---

## 3. Challenges Faced During Threat Modeling

### Challenge 1: Comprehensive Threat Coverage
**Issue:** Systematically identifying threats across 3 actors, 5 processes, 5 data stores, and 45 data flows required consistent STRIDE application to each component.

**Impact:** Time-intensive process with risk of overlooking threats in complex interactions.

**Resolution:** Created structured checklists and templates, conducted peer reviews.

---

### Challenge 2: OWASP Threat Dragon Tool Limitations
**Issue:** Manual threat assignment to each component, no auto-generation, difficulty with large JSON files, limited customization.

**Impact:** Increased manual effort, version control challenges, consistency issues.

**Resolution:** Supplemented with markdown documentation, used Git for version control, developed custom report scripts.

---

### Challenge 3: Trust Boundary Complexity
**Issue:** Distinguishing threats at Internet, Application, and Database trust boundaries; some threats span multiple boundaries.

**Impact:** Initial confusion in threat assignment, overlapping mitigation requirements.

**Resolution:** Clearly defined boundary-specific security requirements, created separate analyses for cross-boundary flows.

---

### Challenge 4: Avoiding Documentation Redundancy
**Issue:** Similar threats across components (e.g., credential interception for customer vs. admin) led to duplication.

**Impact:** Made tracking unique mitigations difficult, risk of inconsistent strategies.

**Resolution:** Developed threat taxonomy, created reusable mitigation templates, categorized by pattern.

---

### Challenge 5: Balancing Thoroughness with Practicality
**Issue:** Initial theoretical analysis identified 400+ threats; determining real-world relevance vs. academic concerns was challenging.

**Impact:** Overwhelming threat list, prioritization difficulties, analysis paralysis.

**Resolution:** Implemented risk scoring (likelihood × impact), focused on threats with known exploits, consulted OWASP Top 10, reduced to 330 actionable threats.

---

### Challenge 6: Mitigation Specificity
**Issue:** Mapping specific, measurable mitigations to each threat without being too generic or overly detailed.

**Impact:** Initial mitigations too vague ("improve security"), difficult to estimate implementation effort.

**Resolution:** Created specific technical controls (e.g., "TLS 1.3 with AES-256 cipher"), developed mitigation-to-threat matrix.

---

### Challenge 7: Multi-Document Synchronization
**Issue:** Maintaining consistency across threat-model.json, markdown summaries, data flow lists, and threat matrices.

**Impact:** Documentation inconsistencies, time on manual sync, risk of outdated information.

**Resolution:** Established threat-model.json as single source of truth, generated derivative docs from central model, implemented review checklist.

---

## 4. Key Takeaways

### Technical Learnings
1. **STRIDE methodology** provides comprehensive coverage but requires disciplined, consistent application
2. **Data flow analysis** is foundational - understanding every interaction is prerequisite to effective threat modeling
3. **Threat modeling is iterative** - first pass captured ~60%, peer reviews uncovered remaining 40%
4. **Component-based analysis** (actors, processes, data stores, flows) ensures no system element is overlooked
5. **Mitigation specificity matters** - generic controls aren't actionable; specific technical requirements needed

### Process Insights
- Systematic checklists prevent overlooked threats
- Peer reviews significantly improve threat identification
- Risk scoring (likelihood × impact) enables effective prioritization
- Tool limitations require supplemental documentation strategies
- Keeping documentation synchronized needs defined processes

### Recommended Next Steps
1. **Step 1:** Implement Critical Priority mitigations (TLS 1.3, mTLS, MFA, encryption)
2. **Step 2:** Deploy DDoS protection, rate limiting, audit logging infrastructure
3. **Step 3:** Network segmentation, IDS/IPS, VPN admin access
4. **Step 4:** Penetration testing to validate threat model
5. **Step 5:** Update threat model as system evolves
6. **Step 6:** Security training for development team on identified threats

---

## 5. Conclusion

This STRIDE-based threat modeling exercise identified **330+ security threats** across all system components:
- **3 Actors** (Customer, Guest, Admin)
- **5 Processes** (Auth, Customer, Order, Product, Admin Services)
- **5 Data Stores** (Customer, Admin, Product, Order, Audit Log DBs)
- **45 Data Flows** (authentication, operations, database interactions)

The prioritized mitigation roadmap provides clear implementation guidance, with critical controls (encryption, MFA, integrity validation) requiring immediate deployment. Despite challenges in tool usage, documentation consistency, and scope management, the systematic STRIDE approach ensured comprehensive threat coverage.

This threat model serves as a **living security document** guiding both current implementation and future system evolution.

---

