# Permissions Schema
> Technical specification for the UVP roles and permissions data model

---

## 1. Overview

The system implements role-based access control (RBAC) with support for both built-in and custom roles.

| Concept | Description |
|---------|-------------|
| **Roles** | Named sets of permissions assigned to users |
| **Permissions** | Granular access rights to specific resources/actions |
| **Custom Roles** | User-created modifications of built-in roles |

---

## 2. Data Model

### 2.1 Permission

Represents a single permission that can be granted to a role.

```typescript
interface Permission {
  apiName: string;
  displayName: string;
  description: string;
  productCategory: string;
  taskCategories: string[];
  actions: string;
  operationType: string;
  riskLevel: string;
  hasPII: boolean;
  hasFinancialData: boolean;
  hasPaymentCredentials: boolean;
  roleAccess: Record<string, string>;
}
```

**Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `apiName` | `string` | Unique API identifier (e.g., `"team_management"`) |
| `displayName` | `string` | Human-readable name, auto-derived from apiName |
| `description` | `string` | What this permission grants |
| `productCategory` | `string` | Product area grouping |
| `taskCategories` | `string[]` | Contexts where permission is relevant |
| `actions` | `string` | `"read"`, `"write"`, or `"read, write"` |
| `operationType` | `string` | `"Read-only"`, `"Write"`, `"Read + Write"` |
| `riskLevel` | `string` | `"Standard"`, `"Elevated"`, `"Critical"` |
| `hasPII` | `boolean` | Contains personally identifiable information |
| `hasFinancialData` | `boolean` | Contains financial records/data |
| `hasPaymentCredentials` | `boolean` | Contains API keys, secrets, payment tokens |
| `roleAccess` | `Record<string, string>` | Role ID → access level mapping |

---

### 2.2 Role

Represents a role assignable to users.

```typescript
interface Role {
  id: string;
  name: string;
  category: string;
  details?: RoleDetails;
  userCount: number;
  permissionApiNames?: string[];
  customDescription?: string;
}
```

**Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier (e.g., `"super_admin"`, `"custom_1706123456789"`) |
| `name` | `string` | Display name |
| `category` | `string` | Sidebar grouping |
| `details` | `RoleDetails?` | Description, can/cannot lists, best-for info |
| `userCount` | `number` | Users assigned this role |
| `permissionApiNames` | `string[]?` | Custom roles only: selected permission apiNames |
| `customDescription` | `string?` | Custom roles only: user-edited description |

---

### 2.3 RoleDetails

Descriptive information about a role's capabilities.

```typescript
interface RoleDetails {
  description: string;
  canDo: string[];
  cannotDo: string[];
  bestFor: string;
}
```

---

### 2.4 RoleCategory

Groups roles for sidebar display.

```typescript
interface RoleCategory {
  name: string;
  roles: Role[];
}
```

---

## 3. Enumerations

### 3.1 Product Categories

| Value | Description |
|-------|-------------|
| `Account & Connect` | Account management, team settings, connected accounts |
| `Payments` | Charges, refunds, payment methods, disputes |
| `Billing & Subscriptions` | Invoices, subscriptions, billing settings |
| `Capital & Treasury` | Capital loans, treasury operations |
| `Issuing` | Card issuing, cardholder management |
| `Radar & Risk` | Fraud prevention, risk rules |
| `Identity` | KYC, identity verification |
| `Tax` | Tax settings and reporting |
| `Reporting` | Reports, analytics, data export |
| `Terminal` | Point of sale, terminal management |

---

### 3.2 Task Categories

> **Note:** Task categories indicate *when* a permission is relevant—they do NOT define what the permission grants.

| Value | Context |
|-------|---------|
| `Manage team access` | Team/user management tasks |
| `Configure settings` | Configuration tasks |
| `Monitor platform` | Monitoring/observability |
| `Handle customer issues` | Customer support |
| `Process transactions` | Payment processing |
| `Export & analyze data` | Reporting/analytics |
| `Develop & integrate` | Development/API tasks |
| `Verify identity` | KYC/identity tasks |
| `Manage billing` | Billing operations |
| `Monitor financials` | Financial monitoring |
| `Transfer funds` | Money movement |

---

### 3.3 Operation Types

| Value | Description |
|-------|-------------|
| `Read-only` | Can only view data |
| `Write` | Can create/update/delete (no read) |
| `Read + Write` | Full access to read and modify |

---

### 3.4 Risk Levels

| Value | Description |
|-------|-------------|
| `Standard` | Normal operations, low risk |
| `Elevated` | Administrative operations (team management, settings) |
| `Critical` | High-risk operations (fund transfers, account deletion) |

---

### 3.5 Sensitivity Flags

Permissions can have multiple sensitivity flags (boolean fields):

| Flag | Description |
|------|-------------|
| `hasPII` | Contains personally identifiable information |
| `hasFinancialData` | Contains financial records and reports |
| `hasPaymentCredentials` | Contains API keys, secrets, payment tokens |

A permission with all flags `false` is considered "Non-sensitive".

---

## 4. Built-in Roles

| ID | Name | Category |
|----|------|----------|
| `super_admin` | Super administrator | Admin |
| `admin` | Administrator | Admin |
| `iam_admin` | IAM Admin | Admin |
| `developer` | Developer | Developer |
| `analyst` | Analyst | Payments |
| `dispute_analyst` | Dispute Analyst | Specialists |
| `refund_analyst` | Refund Analyst | Specialists |
| `identity_analyst` | Identity Analyst | Specialists |
| `tax_analyst` | Tax Analyst | Specialists |
| `support` | Support Specialist | Support |
| `support_associate` | Support Associate | Support |
| `view_only` | View Only | View only |
| `issuing_support_agent` | Issuing Support Agent | Support |
| `sandbox_admin` | Sandbox Admin | Sandbox |

---

## 5. Custom Roles

### 5.1 Creation Flow

```
1. User selects built-in role
2. User clicks "Duplicate"
3. Modal opens with role's permissions pre-selected
4. User modifies permissions, name, description
5. User saves → new role created with id: custom_${timestamp}
```

### 5.2 Storage

- **State:** `customRoles: Role[]` in React component
- **Persistence:** `localStorage` under key `customRoles`

### 5.3 Content Generation

For custom roles, `RoleDetails` are auto-generated:

| Field | Generation Logic |
|-------|------------------|
| `description` | Based on access type (read/write), product categories, sensitivity |
| `canDo` | Derived from selected permissions' action types |
| `cannotDo` | Notable permissions that are NOT selected |
| `bestFor` | Based on permission mix and categories |

---

## 6. Helper Functions

### 6.1 Retrieval

```typescript
getAllPermissions(): Permission[]
getPermissionsForRole(roleId: string): Permission[]
getPermissionsByApiNames(apiNames: string[]): Permission[]
```

### 6.2 Grouping

```typescript
type GroupByOption = "productCategory" | "taskCategory" | "operationType" | "riskLevel" | "sensitivity";

groupPermissions(
  permissions: Permission[], 
  groupBy: GroupByOption
): Record<string, Permission[]>
```

**Note:** When grouping by `sensitivity`, permissions with multiple sensitivity flags will appear in multiple groups.

### 6.3 Content Generation

```typescript
generateCanDo(permissions: Permission[]): string[]
generateCannotDo(permissions: Permission[]): string[]
generateBestFor(permissions: Permission[]): string
generateRoleDescription(permissions: Permission[]): string
generateRoleDetails(permissions: Permission[]): RoleDetails
```

### 6.4 Display

```typescript
toDisplayName(apiName: string): string
// Handles acronyms: KYC, PII, API, POS, ID
// Example: "accounts_kyc_basic" → "Accounts KYC Basic"
```

---

## 7. Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                      BUILT-IN ROLES                         │
│                                                             │
│  Source: roleCategories[] + roleDetailsMap                  │
│  Permissions: Derived from Permission.roleAccess            │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    PERMISSION LOOKUP                         │
│                                                             │
│  getPermissionsForRole(roleId)                              │
│  → filters permissions where roleAccess[roleId] exists      │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                      CUSTOM ROLES                           │
│                                                             │
│  Source: localStorage + React state                         │
│  Permissions: role.permissionApiNames[]                     │
│  Details: generateRoleDetails(selectedPermissions)          │
└─────────────────────────────────────────────────────────────┘
```

---

## 8. Important Notes

1. **Task Categories ≠ Abilities**
   
   Task categories are context/relevance metadata, not capabilities. Example: `account_admin_management_operations` has task category "Configure settings" but does NOT grant team management—that requires the separate `team_management` permission.

2. **Permission Count**
   
   ~50 consolidated permissions in the system (consolidated by `apiName`).

3. **Role Access Lookup**
   
   Built-in roles: Permission lookup via `roleAccess` field on each permission.
   Custom roles: Direct lookup via `permissionApiNames` array.

4. **Acronym Handling**
   
   `toDisplayName()` automatically capitalizes: KYC, PII, API, POS, ID.

---

## 9. File Locations

| File | Purpose |
|------|---------|
| `src/lib/data.ts` | Data model, permissions array, helper functions |
| `src/app/page.tsx` | UI components, state management, modal |
