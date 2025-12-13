# STRIDE Threat Configuration - Troubleshooting Guide

## Configuration Applied

I've configured the threat model to enable **ALL 6 STRIDE threats** for data flows. Here's what was set:

### ✅ Diagram Configuration
- **Diagram Type**: `STRIDE` (confirmed in JSON line 14)
- **Version**: 2.2.0 (OWASP Threat Dragon compatible)

### ✅ External Actor → Service Flows (16 flows)
All flows crossing trust boundaries have been configured with:
```json
{
  "isPublicNetwork": true,
  "protocol": "HTTPS"
}
```

**These flows SHOULD support ALL 6 STRIDE threats:**
1. Customer ↔ Auth Service (2 flows)
2. Customer ↔ Customer Service (2 flows)
3. Customer ↔ Order Service (2 flows)
4. Customer ↔ Product Service (2 flows)
5. Guest ↔ Product Service (2 flows)
6. Admin ↔ Auth Service (2 flows)
7. Admin ↔ Admin Service (2 flows)
8. Admin → Product Service (1 flow)
9. Admin → Order Service (1 flow)

### ✅ Process Configuration
All processes have been configured with:
- **providesAuthentication**: `true` for Auth Service, `false` for others
- **privilegeLevel**: Meaningful values set:
  - Auth Service: "High - Handles authentication"
  - Customer Service: "Medium - User data access"
  - Order Service: "High - Financial transactions"
  - Product Service: "Low - Public data"
  - Admin Service: "Critical - Administrative access"

## How to Verify in Threat Dragon

### Step 1: Import the Model
1. Open OWASP Threat Dragon (desktop or web version)
2. **File → Open** → Select `threat-model.json`
3. You should see the "E-Commerce System DFD" diagram

### Step 2: Select a Flow
1. Click on any **data flow arrow** between External Actors and Services
   - Example: Click the arrow from "Customer" to "Auth Service"
2. Right-click or click "Edit"

### Step 3: Add Threats
1. Click **"Add Threat"** or the **"+"** button
2. In the threat dialog, you should see a dropdown for **"Threat Type"**

### Step 4: Check Available Threats
The dropdown should show **ALL 6 options**:
- ✅ **Spoofing** (S)
- ✅ **Tampering** (T)
- ✅ **Repudiation** (R)
- ✅ **Information Disclosure** (I)
- ✅ **Denial of Service** (D)
- ✅ **Elevation of Privilege** (E)

## Troubleshooting

### If you only see T, D, I (Missing: S, R, E)

#### Option 1: Clear Cache and Reload
1. Close Threat Dragon completely
2. Clear browser cache (if using web version)
3. Re-open Threat Dragon
4. Re-import `threat-model.json` (don't just open the existing session)

#### Option 2: Check Element Type
Make sure you're clicking on a **data flow** (the arrows), not on:
- Actors (external entities)
- Processes (services)
- Data Stores (databases)

Different element types support different threat categories.

#### Option 3: Verify Flow Configuration
1. Click on a flow (arrow)
2. Check its properties panel
3. Verify these settings:
   - **Public Network**: Should be checked/true
   - **Protocol**: Should show "HTTPS"

#### Option 4: Check Threat Dragon Version
This model is designed for **Threat Dragon v2.2.0+**

To check your version:
- Desktop: Help → About
- Web: Look at the footer or version info

If using an older version (1.x), upgrade to 2.x for full STRIDE support.

#### Option 5: Scroll in Threat Dialog
Sometimes the threat dropdown is long. Make sure to:
- **Scroll down** in the "Threat Type" dropdown
- The order is usually: S, T, R, I, D, E
- If you only see T, D, I, try scrolling up or down

#### Option 6: Manual Verification
Open `threat-model.json` in a text editor and search for:
```
"isPublicNetwork": true
```

You should find **16 occurrences** (all external flows).

## Expected Behavior by Element Type

### Data Flows (Arrows)
- **Public Network Flows**: ALL 6 STRIDE threats (S,T,R,I,D,E)
- **Internal Flows**: Subset depending on context (typically T,I,D,E)

### Processes (Services)
- **All Processes**: T, R, I, D, E (not S)
- Auth Service should have special handling for Spoofing

### Data Stores (Databases)
- **All Data Stores**: T, R, I, D (not S, not E)

### Actors (External Entities)
- **All Actors**: S (primarily)

## Still Having Issues?

### Check These:
1. **File integrity**: Ensure `threat-model.json` wasn't corrupted during transfer
2. **Threat Dragon installation**: Try reinstalling or using the web version
3. **Platform**: Try switching between desktop app and web version
4. **Browser**: If using web version, try a different browser (Chrome/Firefox/Edge)

### Alternative: Create Flow Manually
As a test:
1. In Threat Dragon, create a NEW diagram (File → New)
2. Set diagram type to **STRIDE**
3. Add two elements (an Actor and a Process)
4. Draw a flow between them
5. Edit the flow properties:
   - Check "Public Network"
   - Set Protocol to "HTTPS"
6. Try adding a threat to this flow

If ALL 6 STRIDE threats appear on this new flow, but not on the imported ones, there may be an import issue.

## Contact Information

If the issue persists, the problem may be:
- A bug in your version of Threat Dragon
- Platform-specific behavior
- Need to manually create the diagram rather than import

Consider posting an issue on the OWASP Threat Dragon GitHub repo with:
- Your Threat Dragon version
- Platform (Windows/Mac/Linux/Web)
- Screenshot of the available threat types

## Verification Checklist

- [ ] Threat Dragon version is 2.2.0 or higher
- [ ] Diagram type is set to "STRIDE"
- [ ] I'm clicking on data flow arrows (not other elements)
- [ ] Flow properties show "Public Network: true"
- [ ] Flow properties show "Protocol: HTTPS"
- [ ] I've cleared cache and reloaded
- [ ] I've tried scrolling in the threat type dropdown
- [ ] I've verified 16 flows have `isPublicNetwork: true` in JSON


