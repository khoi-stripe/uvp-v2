# Permissions Audit
> Analysis of inconsistencies and gaps in the current data model

---

## 🔴 Critical Issues

### 1. Roles Missing Their Core Permissions

Several specialist roles only have `dashboard_baseline` permission, but their descriptions claim capabilities they don't actually have:

| Role | Claims to do | Actually has |
|------|--------------|--------------|
| `issuing_support_agent` | "View and manage issuing cards, View cardholder information, Manage card disputes" | Only `dashboard_baseline` |
| `tax_analyst` | "View tax reports, Manage tax settings, Download tax documents" | Only `dashboard_baseline` |

**Impact:** These roles are effectively useless—users assigned them cannot do what the role description says.

**Fix:** Add the appropriate permissions to `roleAccess`:

```typescript
// issuing_card_operations should include:
roleAccess: { ..., issuing_support_agent: "write" }

// tax_automation_operations should include:
roleAccess: { ..., tax_analyst: "write" }

// tax_filing_operations should include:
roleAccess: { ..., tax_analyst: "write" }
```

---

### 2. Non-Existent Permission Referenced

In `generateCannotDo()`, we reference a permission that doesn't exist:

```typescript
// Line 1123
"customer_pii_operations": "View or edit customer personal information",
```

**Impact:** This will never match anything and is dead code.

**Fix:** Either:
- Remove from the notable permissions list, OR
- Add `customer_pii_operations` as an actual permission

---

## 🟡 Structural Issues

### 3. Product Category Imbalance

| Category | # Permissions | Notes |
|----------|---------------|-------|
| Account & Connect | 9 | ✓ Good |
| Payments | 5 | ✓ OK |
| Billing & Subscriptions | 5 | ✓ OK |
| Products & Orders | 5 | ✓ OK |
| Financial Operations | 4 | ✓ OK |
| Disputes & Fraud Prevention | 3 | ✓ OK |
| Integrations & Data | 4 | ✓ OK |
| Capital & Treasury | 2 | ⚠️ Light |
| Crypto & Climate | 2 | ⚠️ Light |
| Tax | 2 | ⚠️ Light |
| Terminal | 2 | ⚠️ Light |
| Customers | 2 | ⚠️ Light |
| Support & Operations | 2 | ⚠️ Light |
| Compliance & Identity | 1 | ⚠️ Very light |
| Issuing & Cards | 1 | ⚠️ Very light |
| **Admin** | **1** | ❌ Should this exist? |

**Question:** Is "Admin" a real product category, or should `sensitive_resources` be in "Account & Connect" or "Support & Operations"?

---

### 4. Task Category Inconsistencies

**Naming inconsistency:**

| Pattern | Examples |
|---------|----------|
| Verb + Object | "Manage billing", "Configure settings" |
| Verb + Object + Preposition | "Export & analyze data" |
| Compound verbs | "Handle customer issues", "Manage disputes & fraud" |

**Special case:** `"All tasks"` only applies to `dashboard_baseline`. This is a meta-category, not a real task.

**Orphaned categories** (used by 1-2 permissions only):

| Task Category | Used by |
|---------------|---------|
| `Manage cards` | `issuing_card_operations` only |
| `Manage catalog` | `product_operations`, `promotion_operations` |
| `Monitor hardware` | `terminal_infrastructure` only |
| `Manage hardware` | `terminal_operations` only |
| `Monitor tax compliance` | Tax permissions only |
| `Manage team access` | `team_management`, `settings_security` only |

**Question:** Are these granular enough to be useful for filtering/grouping, or are they too specific?

---

### 5. Action Type vs Actions Confusion

We have two overlapping fields:

| Field | Purpose | Values |
|-------|---------|--------|
| `actions` | Actual permission | `"read"`, `"write"`, `"read, write"` |
| `actionType` | Semantic classification | `"Read-only"`, `"Read + Write"`, `"Create & update"`, `"Administrative"`, `"Destructive"` |

**Contradictions:**

| Permission | `actions` | `actionType` | Issue |
|------------|-----------|--------------|-------|
| `account_admin_management_operations` | `"write"` | `"Destructive"` | Why not "Administrative"? |
| `balance_transfer_operations` | `"write"` | `"Destructive"` | Makes sense |
| `embeddable_key_admin` | `"write"` | `"Administrative"` | Makes sense |

**Question:** What's the intended use of `actionType`? 
- If it's about **risk level**, rename to `riskLevel`: `"Low"`, `"Medium"`, `"High"`, `"Critical"`
- If it's about **operation type**, it overlaps with `actions`

---

### 6. Sensitivity Level Compound Value

```typescript
sensitivityLevel: "Financial data + PII"  // Used by 2 permissions
```

Only `data_export_operations` and `tax_filing_operations` have this compound value.

**Question:** Should sensitivity be:
- A single enum (current approach), OR
- Multiple boolean flags (`hasPII: boolean`, `hasFinancialData: boolean`, etc.)

The compound value makes grouping awkward—do we show it as its own group or merge with both "Financial data" and "Contains PII"?

---

## 🟢 Observations (Not Necessarily Issues)

### 7. Role Access Patterns

Some roles have very different permission counts:

| Role | # Permissions |
|------|---------------|
| `super_admin` | 47 |
| `admin` | 43 |
| `analyst` | 36 |
| `developer` | 24 |
| `support` | 28 |
| `support_associate` | 22 |
| `view_only` | 30 |
| `iam_admin` | 3 |
| `issuing_support_agent` | 1 ❌ |
| `tax_analyst` | 1 ❌ |
| `identity_analyst` | 3 |

The specialist roles (`issuing_support_agent`, `tax_analyst`) are clearly broken.

---

### 8. Product vs Task Category Overlap

There's conceptual overlap between product and task categories:

| Product Category | Related Task Category |
|------------------|----------------------|
| Billing & Subscriptions | Manage billing |
| Issuing & Cards | Manage cards |
| Disputes & Fraud Prevention | Manage disputes & fraud |
| Tax | Monitor tax compliance |
| Terminal | Monitor hardware, Manage hardware |

**Question:** When would a user group by task vs product? Is this redundancy useful or confusing?

---

## Recommended Actions

### Immediate Fixes (Critical)

1. **Add `issuing_support_agent` to `issuing_card_operations`**
2. **Add `tax_analyst` to `tax_automation_operations` and `tax_filing_operations`**
3. **Remove or add `customer_pii_operations`**

### Schema Decisions (Discuss)

4. **Decide on "Admin" product category** - Keep or merge?
5. **Standardize task category naming** - All "Verb + Object" pattern?
6. **Clarify `actionType` purpose** - Risk level or operation type?
7. **Handle compound sensitivity** - Split into flags or keep compound?
8. **Audit orphaned task categories** - Keep or consolidate?

---

## Summary

| Severity | Count | Description |
|----------|-------|-------------|
| 🔴 Critical | 3 | Roles missing permissions, non-existent reference |
| 🟡 Structural | 4 | Naming, categories, overlapping fields |
| 🟢 Observation | 2 | Patterns to be aware of |
