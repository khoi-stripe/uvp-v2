# Roles & Permissions System
### How it works — XFN Overview

---

## The Problem

Teams need flexible access control:
- **Too permissive** → Security risk
- **Too restrictive** → Productivity blocker
- **One-size-fits-all** → Neither secure nor productive

---

## The Solution

A **role-based access control (RBAC)** system with:

| Feature | Benefit |
|---------|---------|
| **Built-in roles** | Quick setup with sensible defaults |
| **Custom roles** | Fine-grained control when needed |
| **Clear visibility** | See exactly what each role can do |

---

## Key Concepts

### Roles
> A named collection of permissions assigned to users

```
┌─────────────────────────────────┐
│  👤 Support Specialist          │
│                                 │
│  • View customer details   ✓    │
│  • Process refunds         ✓    │
│  • Access API keys         ✗    │
│  • Manage team members     ✗    │
└─────────────────────────────────┘
```

### Permissions
> Individual access rights to specific actions

```
┌─────────────────────────────────────────────────────┐
│  🔐 team_management                                 │
│                                                     │
│  "Invite, remove, and change roles for team        │
│   members"                                          │
│                                                     │
│  Access: Read/Write                                 │
│  Sensitivity: Non-sensitive                         │
└─────────────────────────────────────────────────────┘
```

---

## Built-in Roles

We ship **14 pre-configured roles** covering common use cases:

| Category | Roles | Use Case |
|----------|-------|----------|
| **Admin** | Super administrator, Administrator, IAM Admin | Full or administrative access |
| **Developer** | Developer | API and integration work |
| **Support** | Support Specialist, Support Associate | Customer-facing teams |
| **Specialists** | Dispute, Refund, Identity, Tax Analysts | Focused workflows |
| **View Only** | View Only | Auditors, stakeholders |
| **Sandbox** | Sandbox Admin | Testing environments |

---

## Custom Roles

When built-in roles don't fit, users can create custom roles:

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│  1. DUPLICATE                2. CUSTOMIZE              3. SAVE   │
│                                                                  │
│  ┌─────────────┐            ┌─────────────┐         ┌─────────┐ │
│  │ Admin       │  ───────►  │ Add/remove  │ ──────► │ Finance │ │
│  │ (built-in)  │            │ permissions │         │ (custom)│ │
│  └─────────────┘            └─────────────┘         └─────────┘ │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

**Key behaviors:**
- Start from any existing role
- Add or remove individual permissions
- Description auto-generates based on selection
- Can override with custom description
- Edit custom roles anytime

---

## Permission Organization

### By Product Area
Permissions are grouped by what they control:

```
Account & Connect ──── Team settings, connected accounts
Payments ───────────── Charges, refunds, disputes  
Billing ────────────── Invoices, subscriptions
Identity ───────────── KYC, verification
Reporting ──────────── Analytics, exports
... and more
```

### By Access Level
Each permission has an access type:

| Type | Meaning |
|------|---------|
| **Read** | View data only |
| **Write** | Create, update, delete |
| **Read/Write** | Both |

### By Sensitivity
Data classification for compliance:

| Level | Examples |
|-------|----------|
| Non-sensitive | Settings, configurations |
| Contains PII | Customer names, addresses |
| Financial data | Transactions, balances |
| Payment credentials | API keys, secrets |

---

## User Experience

### Viewing Roles

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│  Roles              │  Administrator              │  Permissions    │
│  ─────              │  ─────────────              │  ───────────    │
│                     │                             │                 │
│  ▼ Admin        3   │  Full access to the        │  47 permissions │
│    Super admin      │  account with the ability  │                 │
│  ● Administrator    │  to manage all settings    │  • Account ops  │
│    IAM Admin        │  and perform all actions.  │  • Team mgmt    │
│                     │                             │  • Payments     │
│  ▶ Developer    1   │  ✓ Can                     │  • Billing      │
│  ▶ Support      2   │  • Manage all aspects      │  • ...          │
│                     │  • Invite team members     │                 │
│                     │                             │                 │
│                     │  ✗ Cannot                  │                 │
│                     │  • Assign Super Admin      │                 │
│                     │                             │                 │
└─────────────────────────────────────────────────────────────────────┘
```

### Customizing Roles

```
┌─────────────────────────────────────────────────────────────────────┐
│  Duplicate role                                              ✕     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────────┐  ┌───────────────────────────────────────┐│
│  │                     │  │  Permissions                          ││
│  │  Finance Team       │  │  ──────────────────────────────────── ││
│  │  Edit name          │  │                                       ││
│  │                     │  │  Current              Available       ││
│  │  Custom role with   │  │  ────────             ─────────       ││
│  │  read access to...  │  │                                       ││
│  │  Edit description   │  │  ☑ Balance ops       ☐ Team mgmt     ││
│  │                     │  │  ☑ Reports           ☐ API keys      ││
│  │  ✓ Can              │  │  ☑ Transactions      ☐ Disputes      ││
│  │  • View balances    │  │                                       ││
│  │  • Export reports   │  │       ◄──  click to move  ──►        ││
│  │                     │  │                                       ││
│  │  ✗ Cannot           │  │                                       ││
│  │  • Manage team      │  │                                       ││
│  │                     │  │                                       ││
│  └─────────────────────┘  └───────────────────────────────────────┘│
│                                                                     │
│                                          [ Revert ]  [ Save ]      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Smart Features

### Auto-generated Descriptions
When creating custom roles, the system automatically generates:

| Field | How it's generated |
|-------|-------------------|
| **Description** | Based on access types and product areas covered |
| **Can do** | Derived from selected permission capabilities |
| **Cannot do** | Notable permissions that are NOT selected |
| **Best for** | Inferred from the permission mix |

Users can override with custom text if needed.

### Visual Feedback
- **Animated counters** when adding/removing permissions
- **Collapse animation** when moving permissions between lists
- **Color-coded badges** for Read (blue) vs Write (green)
- **Context tags** showing when permissions are relevant

---

## How Permissions Are Determined

### Built-in Roles
```
Permission ──► roleAccess: { admin: "write", support: "read" }
                              │
                              ▼
                     Does role exist in roleAccess?
                              │
                    ┌─────────┴─────────┐
                   Yes                  No
                    │                    │
                    ▼                    ▼
              Has permission      No permission
```

### Custom Roles
```
Custom Role ──► permissionApiNames: ["team_management", "charge_ops", ...]
                              │
                              ▼
                     Look up each permission by apiName
                              │
                              ▼
                     Role has exactly those permissions
```

---

## Technical Details

| Aspect | Implementation |
|--------|----------------|
| **~50 permissions** | Consolidated by API name |
| **14 built-in roles** | Defined in code |
| **Custom role storage** | localStorage + React state |
| **Content generation** | Template-based (no LLM) |
| **Permission grouping** | By product, task, action type, or sensitivity |

---

## Summary

| What | How |
|------|-----|
| **Quick start** | 14 built-in roles for common use cases |
| **Flexibility** | Duplicate and customize any role |
| **Clarity** | See exactly what each role can/cannot do |
| **Safety** | Can't edit built-in roles, only duplicate |
| **Persistence** | Custom roles saved to browser storage |

---

## Questions?

For technical details, see:
- `PERMISSIONS_SCHEMA.md` — Full data model specification
- `src/lib/data.ts` — Permission and role definitions
- `src/app/page.tsx` — UI implementation
