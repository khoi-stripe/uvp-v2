// Types
export interface Permission {
  apiName: string;              // Original UVP/UVB name from CSV (maps to API)
  displayName: string;          // Human-readable name (auto-derived)
  description: string;          // Brief description
  productCategory: string;      // "Account & Connect", "Payments", etc.
  taskCategories: string[];     // ["Manage team access", "Configure settings"] (consolidated)
  actions: string;              // "read", "write", "read, write"
  operationType: string;        // "Read-only", "Write", "Read + Write"
  riskLevel: string;            // "Standard", "Elevated", "Critical"
  // Sensitivity flags (can have multiple)
  hasPII: boolean;
  hasFinancialData: boolean;
  hasPaymentCredentials: boolean;
  roleAccess: Record<string, string>;  // { super_admin: "write", admin: "write", ... }
}

export interface RoleDetails {
  description: string;
  canDo: string[];
  cannotDo: string[];
}

export interface Role {
  id: string;
  name: string;
  category: string;
  details?: RoleDetails;
  userCount: number;
  permissionApiNames?: string[];    // Deprecated - use permissionAccess instead
  permissionAccess?: Record<string, string>;  // For custom roles - maps API name to access level ("read", "write", "read, write")
  customDescription?: string;       // User-edited description (overrides generated)
}

export interface RoleCategory {
  name: string;
  roles: Role[];
}

// Helper to derive human-readable display name from API name
export function toDisplayName(apiName: string): string {
  // Words that should be fully capitalized (acronyms)
  const acronyms = new Set(['kyc', 'pii', 'api', 'pos', 'id']);
  
  return apiName
    .split('_')
    .map(word => acronyms.has(word.toLowerCase()) 
      ? word.toUpperCase() 
      : word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Role details from CSV
const roleDetailsMap: Record<string, RoleDetails> = {
  super_admin: {
    description: "For account creators and C-level executives who need absolute control. This role allows all privileged actions including assigning Super Administrator to others. High security risk if compromised.",
    canDo: [
      "All Administrator capabilities",
      "Assign Super Administrator role to others",
      "Full account control",
      "Manage all team members and roles",
      "Access all account data and settings"
    ],
    cannotDo: [
      "Cannot change the account owner (only the owner can transfer ownership)"
    ],
  },
  admin: {
    description: "For account owners and senior management who need complete control. Full access to the account with the ability to manage all settings and perform all actions.",
    canDo: [
      "Manage all aspects of the account",
      "Invite and manage team members",
      "View and edit all financial data",
      "Configure account settings",
      "Access API keys and webhooks",
      "Manage disputes and refunds"
    ],
    cannotDo: [
      "Cannot assign Super Administrator role",
      "Cannot delete the account"
    ],
  },
  developer: {
    description: "For engineering teams building and maintaining integrations. Access to view and manage technical integration settings including API keys and webhooks.",
    canDo: [
      "View API keys and create restricted keys",
      "Access webhooks and logs",
      "Test in sandbox mode",
      "View documentation",
      "Access developer tools",
      "View payment data"
    ],
    cannotDo: [
      "Cannot manage team members",
      "Cannot edit business settings",
      "Cannot process refunds",
      "Cannot access sensitive financial reports"
    ],
  },
  analyst: {
    description: "For finance teams, business analysts, and executives who need visibility. Read-only access to reports and data across the account.",
    canDo: [
      "View all reports and analytics",
      "Export data",
      "View payment and customer information",
      "Access financial reports",
      "View balance and payout information"
    ],
    cannotDo: [
      "Cannot make any changes",
      "Cannot process refunds",
      "Cannot edit customers or payments",
      "Cannot access API keys"
    ],
  },
  support: {
    description: "For customer support teams handling day-to-day customer issues. This role allows refunding payments, resolving disputes, and updating products.",
    canDo: [
      "View customer details",
      "View payment information",
      "Create and manage refunds",
      "View and respond to disputes",
      "Issue credit notes",
      "View subscriptions and invoices",
      "Update products"
    ],
    cannotDo: [
      "Cannot access API keys",
      "Cannot manage team members",
      "Cannot change account settings",
      "Cannot access detailed financial reports"
    ],
  },
  support_associate: {
    description: "For junior support staff handling basic inquiries. Limited support access for viewing customer information and payment details.",
    canDo: [
      "View customer information",
      "View payment details",
      "View subscriptions and invoices",
      "View disputes (read-only)"
    ],
    cannotDo: [
      "Cannot process refunds",
      "Cannot manage disputes",
      "Cannot edit customer data",
      "Cannot access API keys"
    ],
  },
  view_only: {
    description: "For team members who need visibility without the ability to make changes. Read-only access to most parts of the Dashboard.",
    canDo: [
      "View payments and customers",
      "View basic reports",
      "View product and subscription data",
      "View disputes"
    ],
    cannotDo: [
      "Cannot make any changes",
      "Cannot process refunds",
      "Cannot export data in bulk",
      "Cannot access API keys",
      "Cannot view sensitive financial data"
    ],
  },
  dispute_analyst: {
    description: "For fraud and risk teams focused on dispute management. Specialized access for managing disputes and chargebacks.",
    canDo: [
      "View and manage disputes",
      "Upload evidence",
      "Accept or challenge disputes",
      "View dispute analytics",
      "Access Radar for fraud prevention"
    ],
    cannotDo: [
      "Cannot process refunds outside of disputes",
      "Cannot manage customers",
      "Cannot access API keys",
      "Cannot manage team members"
    ],
  },
  refund_analyst: {
    description: "For finance operations teams focused on refund processing. Specialized access for processing full and partial refunds.",
    canDo: [
      "View payments and charges",
      "Create full and partial refunds",
      "View customer information",
      "View refund history"
    ],
    cannotDo: [
      "Cannot manage disputes",
      "Cannot access API keys",
      "Cannot manage subscriptions",
      "Cannot access financial reports",
      "Cannot manage team members"
    ],
  },
  identity_analyst: {
    description: "For compliance and KYC teams managing identity verification. Specialized access for verifying identity documents and managing KYC workflows.",
    canDo: [
      "View and verify identity documents",
      "Manage KYC workflows",
      "Review verification sessions",
      "Access compliance data"
    ],
    cannotDo: [
      "Cannot access payment information",
      "Cannot process refunds",
      "Cannot manage team members",
      "Cannot access API keys"
    ],
  },
  tax_analyst: {
    description: "For tax and accounting teams managing tax compliance. Specialized access for tax reporting, settings, and document management.",
    canDo: [
      "View tax reports",
      "Manage tax settings",
      "Download tax documents",
      "Configure tax automation",
      "Access 1099 and tax ID information"
    ],
    cannotDo: [
      "Cannot access general financial reports",
      "Cannot process payments",
      "Cannot manage team members",
      "Cannot access API keys"
    ],
  },
  iam_admin: {
    description: "For security and IT teams managing access control. Specialized access for managing team members, roles, and security settings.",
    canDo: [
      "Manage team members and roles",
      "Configure SSO and SAML",
      "Manage security settings",
      "Set up two-factor authentication",
      "View audit logs"
    ],
    cannotDo: [
      "Cannot access financial data",
      "Cannot process payments",
      "Cannot view customer PII",
      "Cannot access API keys for integrations"
    ],
  },
  issuing_support_agent: {
    description: "For support teams focused on card issuing operations. Specialized access for managing Issuing cards and cardholders.",
    canDo: [
      "View and manage issuing cards",
      "View cardholder information",
      "Manage card disputes",
      "View card transactions",
      "Update card status"
    ],
    cannotDo: [
      "Cannot access general payment data",
      "Cannot manage team members",
      "Cannot access API keys",
      "Cannot access non-Issuing products"
    ],
  },
  sandbox_admin: {
    description: "For developers and QA teams testing integrations. Full administrative access to sandbox/test environments only.",
    canDo: [
      "Full access to sandbox mode",
      "Create test data",
      "Access sandbox API keys",
      "Test integrations",
      "Invite sandbox users"
    ],
    cannotDo: [
      "Cannot access production data",
      "Cannot affect live transactions",
      "Cannot access production API keys"
    ],
  },
};

// Fake user counts for a ~100 user account
const userCounts: Record<string, number> = {
  super_admin: 2,
  admin: 4,
  iam_admin: 1,
  developer: 12,
  analyst: 8,
  dispute_analyst: 3,
  refund_analyst: 4,
  support: 18,
  support_associate: 15,
  view_only: 7,
  issuing_support_agent: 3,
  tax_analyst: 2,
  identity_analyst: 2,
  sandbox_admin: 5,
};

// Helper to add details to role
const withDetails = (id: string, name: string, category: string): Role => ({
  id,
  name,
  category,
  details: roleDetailsMap[id],
  userCount: userCounts[id] ?? 0,
});

// Role categories with display names
export const roleCategories: RoleCategory[] = [
  {
    name: "Admin",
    roles: [
      withDetails("super_admin", "Super administrator", "Admin"),
      withDetails("admin", "Administrator", "Admin"),
      withDetails("iam_admin", "IAM Admin", "Admin"),
    ],
  },
  {
    name: "Developer",
    roles: [
      withDetails("developer", "Developer", "Developer"),
    ],
  },
  {
    name: "Payments",
    roles: [
      withDetails("analyst", "Analyst", "Payments"),
      withDetails("dispute_analyst", "Dispute analyst", "Payments"),
      withDetails("refund_analyst", "Refund analyst", "Payments"),
    ],
  },
  {
    name: "Support",
    roles: [
      withDetails("support", "Support specialist", "Support"),
      withDetails("support_associate", "Support associate", "Support"),
    ],
  },
  {
    name: "Specialists",
    roles: [
      withDetails("issuing_support_agent", "Issuing support agent", "Specialists"),
      withDetails("tax_analyst", "Tax analyst", "Specialists"),
      withDetails("identity_analyst", "Identity analyst", "Specialists"),
    ],
  },
  {
    name: "View only",
    roles: [
      withDetails("view_only", "View only", "View only"),
    ],
  },
  {
    name: "Sandbox",
    roles: [
      withDetails("sandbox_admin", "Sandbox administrator", "Sandbox"),
    ],
  },
];

// All roles flattened
export const allRoles: Role[] = roleCategories.flatMap((cat) => cat.roles);

// Human-friendly display names from CSV (UVP Mental Models with Role Mappings)
const HUMAN_FRIENDLY_NAMES: Record<string, string> = {
  account_admin_management_operations: "Account Administration",
  account_operations: "Account Management",
  accounts_kyc_basic: "Basic Identity Verification",
  application_fee_operations: "Application Fees",
  connect_settings: "Connect Platform Settings",
  connected_account_operations: "Connected Account Management",
  embeddable_key_admin: "Embedded Payment Keys",
  sandbox_creation: "Sandbox Creation",
  team_management: "Team & Role Management",
  sensitive_resources: "API Keys & Secrets",
  billing_operations: "Billing & Usage Metering",
  billing_settings_operations: "Billing Settings & Profiles",
  credit_note_operations: "Credit Notes",
  invoice_operations: "Invoices & Quotes",
  subscription_operations: "Subscriptions",
  capital_operations: "Capital Financing",
  treasury_operations: "Treasury Accounts",
  identity_verification_operations: "Identity Verification",
  climate_operations: "Climate Orders",
  crypto_operations: "Crypto Accounts",
  customer_operations: "Customer Profiles",
  customer_portal_operations: "Customer Portal",
  dispute_operations: "Disputes",
  radar_operations: "Fraud Prevention Rules",
  review_operations: "Fraud Reviews",
  balance_operations: "Account Balance",
  balance_transfer_operations: "Balance Transfers",
  payout_operations: "Payouts",
  transfer_operations: "Transfers",
  data_export_operations: "Data Export",
  dev_integration: "Developer Tools",
  reporting_operations: "Financial Reports",
  stripe_apps_development: "Stripe Apps Development",
  issuing_card_operations: "Issuing Cards",
  charge: "Charges (Read Only)",
  charge_operations: "Charges & Refunds",
  payment_intent: "Payment Intents (Read Only)",
  payment_intent_operations: "Payment Intents",
  payment_processing: "Payment Methods",
  checkout_operations: "Checkout Sessions",
  order_operations: "Orders",
  order_refund_operations: "Order Refunds",
  product_operations: "Products & Pricing",
  promotion_operations: "Promotions & Coupons",
  dashboard_baseline: "Dashboard Access (Basic)",
  settings_security: "Security Settings",
  tax_automation_operations: "Tax Automation",
  tax_filing_operations: "Tax Filing",
  terminal_infrastructure: "Terminal Hardware (View)",
  terminal_operations: "Terminal Point of Sale",
};

function getPermissionDisplayName(apiName: string): string {
  return HUMAN_FRIENDLY_NAMES[apiName] ?? toDisplayName(apiName);
}

// Permission data from CSV (consolidated by API name)
export const permissions: Permission[] = [
  {
    apiName: "account_admin_management_operations",
    displayName: getPermissionDisplayName("account_admin_management_operations"),
    description: "Administrative account operations (does not include team member management)",
    productCategory: "Account & Connect",
    taskCategories: ["Configure settings"],
    actions: "write",
    operationType: "Write",
    riskLevel: "Critical",
    hasPII: false,
    hasFinancialData: false,
    hasPaymentCredentials: false,
    roleAccess: { super_admin: "write", admin: "write", developer: "write" },
  },
  {
    apiName: "account_operations",
    displayName: getPermissionDisplayName("account_operations"),
    description: "Read access to base account details",
    productCategory: "Account & Connect",
    taskCategories: ["Configure settings", "Monitor platform"],
    actions: "read, write",
    operationType: "Read + Write",
    riskLevel: "Standard",
    hasPII: false,
    hasFinancialData: false,
    hasPaymentCredentials: false,
    roleAccess: { super_admin: "write", admin: "write", view_only: "read", support: "write", support_associate: "write", analyst: "read", refund_analyst: "read", sandbox_admin: "read" },
  },
  {
    apiName: "accounts_kyc_basic",
    displayName: getPermissionDisplayName("accounts_kyc_basic"),
    description: "Read access to basic KYC fields",
    productCategory: "Account & Connect",
    taskCategories: ["Verify identity", "Handle customer issues"],
    actions: "read",
    operationType: "Read-only",
    riskLevel: "Standard",
    hasPII: true,
    hasFinancialData: false,
    hasPaymentCredentials: false,
    roleAccess: { super_admin: "read", admin: "read", view_only: "read", identity_analyst: "read" },
  },
  {
    apiName: "application_fee_operations",
    displayName: getPermissionDisplayName("application_fee_operations"),
    description: "Application fees for platforms",
    productCategory: "Account & Connect",
    taskCategories: ["Monitor platform", "Export & analyze data"],
    actions: "read, write",
    operationType: "Read + Write",
    riskLevel: "Standard",
    hasPII: false,
    hasFinancialData: true,
    hasPaymentCredentials: false,
    roleAccess: { super_admin: "write", admin: "write", view_only: "read", support: "write", analyst: "write" },
  },
  {
    apiName: "connect_settings",
    displayName: getPermissionDisplayName("connect_settings"),
    description: "Manage Connect settings",
    productCategory: "Account & Connect",
    taskCategories: ["Configure settings", "Monitor platform"],
    actions: "write",
    operationType: "Write",
    riskLevel: "Elevated",
    hasPII: false,
    hasFinancialData: false,
    hasPaymentCredentials: false,
    roleAccess: { super_admin: "write", admin: "write", support: "write", support_associate: "write" },
  },
  {
    apiName: "connected_account_operations",
    displayName: getPermissionDisplayName("connected_account_operations"),
    description: "Connected accounts management",
    productCategory: "Account & Connect",
    taskCategories: ["Monitor platform", "Handle customer issues"],
    actions: "read, write",
    operationType: "Read + Write",
    riskLevel: "Standard",
    hasPII: true,
    hasFinancialData: false,
    hasPaymentCredentials: false,
    roleAccess: { super_admin: "write", admin: "write", view_only: "read", developer: "write", support: "write", support_associate: "write", analyst: "read" },
  },
  {
    apiName: "embeddable_key_admin",
    displayName: getPermissionDisplayName("embeddable_key_admin"),
    description: "Embeddable keys admin",
    productCategory: "Account & Connect",
    taskCategories: ["Configure settings", "Develop & integrate"],
    actions: "write",
    operationType: "Write",
    riskLevel: "Elevated",
    hasPII: false,
    hasFinancialData: false,
    hasPaymentCredentials: true,
    roleAccess: { super_admin: "write", admin: "write" },
  },
  {
    apiName: "sandbox_creation",
    displayName: getPermissionDisplayName("sandbox_creation"),
    description: "Create sandbox organizations",
    productCategory: "Account & Connect",
    taskCategories: ["Develop & integrate"],
    actions: "write",
    operationType: "Write",
    riskLevel: "Standard",
    hasPII: false,
    hasFinancialData: false,
    hasPaymentCredentials: false,
    roleAccess: { super_admin: "write", admin: "write", developer: "write", sandbox_admin: "write" },
  },
  {
    apiName: "team_management",
    displayName: getPermissionDisplayName("team_management"),
    description: "Invite, remove, and change roles for team members",
    productCategory: "Account & Connect",
    taskCategories: ["Manage team access"],
    actions: "read, write",
    operationType: "Read + Write",
    riskLevel: "Elevated",
    hasPII: false,
    hasFinancialData: false,
    hasPaymentCredentials: false,
    roleAccess: { super_admin: "write", admin: "write", view_only: "read", iam_admin: "write" },
  },
  // Admin
  {
    apiName: "sensitive_resources",
    displayName: getPermissionDisplayName("sensitive_resources"),
    description: "API keys and secrets",
    productCategory: "Admin",
    taskCategories: ["Develop & integrate", "Configure settings"],
    actions: "read",
    operationType: "Read-only",
    riskLevel: "Standard",
    hasPII: false,
    hasFinancialData: false,
    hasPaymentCredentials: true,
    roleAccess: { super_admin: "read", admin: "read", view_only: "read", developer: "read" },
  },
  // Billing & Subscriptions
  {
    apiName: "billing_operations",
    displayName: getPermissionDisplayName("billing_operations"),
    description: "Billing meters and bills",
    productCategory: "Billing & Subscriptions",
    taskCategories: ["Manage billing", "Export & analyze data"],
    actions: "read, write",
    operationType: "Read + Write",
    riskLevel: "Standard",
    hasPII: false,
    hasFinancialData: true,
    hasPaymentCredentials: false,
    roleAccess: { super_admin: "write", admin: "write", view_only: "read", developer: "write", analyst: "write" },
  },
  {
    apiName: "billing_settings_operations",
    displayName: getPermissionDisplayName("billing_settings_operations"),
    description: "Billing settings and profiles",
    productCategory: "Billing & Subscriptions",
    taskCategories: ["Configure settings", "Manage billing"],
    actions: "read, write",
    operationType: "Read + Write",
    riskLevel: "Elevated",
    hasPII: false,
    hasFinancialData: false,
    hasPaymentCredentials: false,
    roleAccess: { super_admin: "write", admin: "write", view_only: "read", developer: "write", support: "write", support_associate: "write", analyst: "write", refund_analyst: "read", dispute_analyst: "read" },
  },
  {
    apiName: "credit_note_operations",
    displayName: getPermissionDisplayName("credit_note_operations"),
    description: "Manage credit notes",
    productCategory: "Billing & Subscriptions",
    taskCategories: ["Handle customer issues", "Manage billing"],
    actions: "read, write",
    operationType: "Read + Write",
    riskLevel: "Standard",
    hasPII: false,
    hasFinancialData: true,
    hasPaymentCredentials: false,
    roleAccess: { super_admin: "write", admin: "write", view_only: "read", developer: "write", support: "write", support_associate: "write", analyst: "write", refund_analyst: "write" },
  },
  {
    apiName: "invoice_operations",
    displayName: getPermissionDisplayName("invoice_operations"),
    description: "Manage invoices and quotes",
    productCategory: "Billing & Subscriptions",
    taskCategories: ["Handle customer issues", "Manage billing", "Export & analyze data"],
    actions: "read, write",
    operationType: "Read + Write",
    riskLevel: "Standard",
    hasPII: false,
    hasFinancialData: true,
    hasPaymentCredentials: false,
    roleAccess: { super_admin: "write", admin: "write", view_only: "read", developer: "write", support: "write", support_associate: "write", analyst: "write", refund_analyst: "read", dispute_analyst: "read" },
  },
  {
    apiName: "subscription_operations",
    displayName: getPermissionDisplayName("subscription_operations"),
    description: "Manage subscriptions",
    productCategory: "Billing & Subscriptions",
    taskCategories: ["Handle customer issues", "Manage billing"],
    actions: "read, write",
    operationType: "Read + Write",
    riskLevel: "Standard",
    hasPII: false,
    hasFinancialData: true,
    hasPaymentCredentials: false,
    roleAccess: { super_admin: "write", admin: "write", view_only: "read", developer: "write", support: "write", support_associate: "write", analyst: "write", refund_analyst: "read", dispute_analyst: "read" },
  },
  // Capital & Treasury
  {
    apiName: "capital_operations",
    displayName: getPermissionDisplayName("capital_operations"),
    description: "Capital for Platforms",
    productCategory: "Capital & Treasury",
    taskCategories: ["Monitor financials", "Export & analyze data"],
    actions: "read, write",
    operationType: "Read + Write",
    riskLevel: "Standard",
    hasPII: false,
    hasFinancialData: true,
    hasPaymentCredentials: false,
    roleAccess: { super_admin: "write", admin: "write", view_only: "read", developer: "write", analyst: "write" },
  },
  {
    apiName: "treasury_operations",
    displayName: getPermissionDisplayName("treasury_operations"),
    description: "Treasury financial accounts",
    productCategory: "Capital & Treasury",
    taskCategories: ["Monitor financials", "Export & analyze data"],
    actions: "read, write",
    operationType: "Read + Write",
    riskLevel: "Standard",
    hasPII: false,
    hasFinancialData: true,
    hasPaymentCredentials: false,
    roleAccess: { super_admin: "write", admin: "write", view_only: "read", analyst: "read" },
  },
  // Compliance & Identity
  {
    apiName: "identity_verification_operations",
    displayName: getPermissionDisplayName("identity_verification_operations"),
    description: "Identity verification",
    productCategory: "Compliance & Identity",
    taskCategories: ["Verify identity", "Handle customer issues"],
    actions: "read, write",
    operationType: "Read + Write",
    riskLevel: "Standard",
    hasPII: true,
    hasFinancialData: false,
    hasPaymentCredentials: false,
    roleAccess: { super_admin: "write", admin: "write", view_only: "read", developer: "write", analyst: "write", identity_analyst: "write" },
  },
  // Crypto & Climate
  {
    apiName: "climate_operations",
    displayName: getPermissionDisplayName("climate_operations"),
    description: "Climate orders",
    productCategory: "Crypto & Climate",
    taskCategories: ["Process transactions", "Configure settings"],
    actions: "read, write",
    operationType: "Read + Write",
    riskLevel: "Standard",
    hasPII: false,
    hasFinancialData: false,
    hasPaymentCredentials: false,
    roleAccess: { super_admin: "write", admin: "write", view_only: "read", developer: "write", analyst: "write" },
  },
  {
    apiName: "crypto_operations",
    displayName: getPermissionDisplayName("crypto_operations"),
    description: "Crypto financial accounts",
    productCategory: "Crypto & Climate",
    taskCategories: ["Process transactions"],
    actions: "read, write",
    operationType: "Read + Write",
    riskLevel: "Standard",
    hasPII: false,
    hasFinancialData: false,
    hasPaymentCredentials: false,
    roleAccess: { super_admin: "write", admin: "write", view_only: "read", developer: "write", analyst: "write" },
  },
  // Customers
  {
    apiName: "customer_operations",
    displayName: getPermissionDisplayName("customer_operations"),
    description: "Manage customer profiles",
    productCategory: "Customers",
    taskCategories: ["Handle customer issues", "Export & analyze data"],
    actions: "read, write",
    operationType: "Read + Write",
    riskLevel: "Standard",
    hasPII: true,
    hasFinancialData: false,
    hasPaymentCredentials: false,
    roleAccess: { super_admin: "write", admin: "write", view_only: "read", developer: "write", support: "write", support_associate: "write", analyst: "write", refund_analyst: "read", dispute_analyst: "read" },
  },
  {
    apiName: "customer_portal_operations",
    displayName: getPermissionDisplayName("customer_portal_operations"),
    description: "Create customer portals",
    productCategory: "Customers",
    taskCategories: ["Configure settings", "Handle customer issues"],
    actions: "write",
    operationType: "Write",
    riskLevel: "Standard",
    hasPII: false,
    hasFinancialData: false,
    hasPaymentCredentials: false,
    roleAccess: { super_admin: "write", admin: "write", analyst: "write" },
  },
  // Disputes & Fraud Prevention
  {
    apiName: "dispute_operations",
    displayName: getPermissionDisplayName("dispute_operations"),
    description: "Manage disputes",
    productCategory: "Disputes & Fraud Prevention",
    taskCategories: ["Handle customer issues", "Manage disputes & fraud"],
    actions: "read, write",
    operationType: "Read + Write",
    riskLevel: "Standard",
    hasPII: false,
    hasFinancialData: false,
    hasPaymentCredentials: false,
    roleAccess: { super_admin: "write", admin: "write", view_only: "read", developer: "write", support: "write", support_associate: "write", analyst: "write", refund_analyst: "read", dispute_analyst: "write" },
  },
  {
    apiName: "radar_operations",
    displayName: getPermissionDisplayName("radar_operations"),
    description: "Configure Radar fraud rules",
    productCategory: "Disputes & Fraud Prevention",
    taskCategories: ["Configure settings", "Manage disputes & fraud"],
    actions: "read, write",
    operationType: "Read + Write",
    riskLevel: "Standard",
    hasPII: false,
    hasFinancialData: false,
    hasPaymentCredentials: false,
    roleAccess: { super_admin: "write", admin: "write", view_only: "read", developer: "write", support: "read", support_associate: "read", analyst: "read", refund_analyst: "read" },
  },
  {
    apiName: "review_operations",
    displayName: getPermissionDisplayName("review_operations"),
    description: "Action fraud reviews",
    productCategory: "Disputes & Fraud Prevention",
    taskCategories: ["Handle customer issues", "Manage disputes & fraud"],
    actions: "write",
    operationType: "Write",
    riskLevel: "Standard",
    hasPII: false,
    hasFinancialData: false,
    hasPaymentCredentials: false,
    roleAccess: { super_admin: "write", admin: "write", support: "write", support_associate: "write", analyst: "write" },
  },
  // Financial Operations
  {
    apiName: "balance_operations",
    displayName: getPermissionDisplayName("balance_operations"),
    description: "View account balances",
    productCategory: "Financial Operations",
    taskCategories: ["Monitor financials", "Export & analyze data"],
    actions: "read",
    operationType: "Read-only",
    riskLevel: "Standard",
    hasPII: false,
    hasFinancialData: true,
    hasPaymentCredentials: false,
    roleAccess: { super_admin: "read", admin: "read", view_only: "read", support: "read", support_associate: "read", analyst: "read", refund_analyst: "read", dispute_analyst: "read" },
  },
  {
    apiName: "balance_transfer_operations",
    displayName: getPermissionDisplayName("balance_transfer_operations"),
    description: "Transfer balances (high risk)",
    productCategory: "Financial Operations",
    taskCategories: ["Transfer funds"],
    actions: "write",
    operationType: "Write",
    riskLevel: "Critical",
    hasPII: false,
    hasFinancialData: true,
    hasPaymentCredentials: false,
    roleAccess: { super_admin: "write", admin: "write", analyst: "write" },
  },
  {
    apiName: "payout_operations",
    displayName: getPermissionDisplayName("payout_operations"),
    description: "Manage payouts",
    productCategory: "Financial Operations",
    taskCategories: ["Transfer funds", "Monitor financials"],
    actions: "read, write",
    operationType: "Read + Write",
    riskLevel: "Standard",
    hasPII: false,
    hasFinancialData: true,
    hasPaymentCredentials: false,
    roleAccess: { super_admin: "write", admin: "write", view_only: "read", analyst: "write" },
  },
  {
    apiName: "transfer_operations",
    displayName: getPermissionDisplayName("transfer_operations"),
    description: "Transfer operations",
    productCategory: "Financial Operations",
    taskCategories: ["Transfer funds", "Monitor financials"],
    actions: "read, write",
    operationType: "Read + Write",
    riskLevel: "Standard",
    hasPII: false,
    hasFinancialData: true,
    hasPaymentCredentials: false,
    roleAccess: { super_admin: "write", admin: "write", view_only: "read", analyst: "write" },
  },
  // Integrations & Data
  {
    apiName: "data_export_operations",
    displayName: getPermissionDisplayName("data_export_operations"),
    description: "Export bulk data",
    productCategory: "Integrations & Data",
    taskCategories: ["Export & analyze data"],
    actions: "read",
    operationType: "Read-only",
    riskLevel: "Standard",
    hasPII: true,
    hasFinancialData: true,
    hasPaymentCredentials: false,
    roleAccess: { super_admin: "read", admin: "read", view_only: "read", developer: "read", analyst: "read" },
  },
  {
    apiName: "dev_integration",
    displayName: getPermissionDisplayName("dev_integration"),
    description: "Development tools",
    productCategory: "Integrations & Data",
    taskCategories: ["Develop & integrate"],
    actions: "read, write",
    operationType: "Read + Write",
    riskLevel: "Standard",
    hasPII: false,
    hasFinancialData: false,
    hasPaymentCredentials: false,
    roleAccess: { super_admin: "write", admin: "write", view_only: "read", developer: "write", analyst: "write" },
  },
  {
    apiName: "reporting_operations",
    displayName: getPermissionDisplayName("reporting_operations"),
    description: "Run and access reports",
    productCategory: "Integrations & Data",
    taskCategories: ["Export & analyze data", "Monitor financials"],
    actions: "read, write",
    operationType: "Read + Write",
    riskLevel: "Standard",
    hasPII: false,
    hasFinancialData: true,
    hasPaymentCredentials: false,
    roleAccess: { super_admin: "write", admin: "write", view_only: "read, write", developer: "write", support: "write", support_associate: "write", analyst: "write", refund_analyst: "read" },
  },
  {
    apiName: "stripe_apps_development",
    displayName: getPermissionDisplayName("stripe_apps_development"),
    description: "Build Stripe Apps",
    productCategory: "Integrations & Data",
    taskCategories: ["Develop & integrate"],
    actions: "read, write",
    operationType: "Read + Write",
    riskLevel: "Standard",
    hasPII: false,
    hasFinancialData: false,
    hasPaymentCredentials: false,
    roleAccess: { super_admin: "write", admin: "write", view_only: "read", developer: "write", analyst: "write" },
  },
  // Issuing & Cards
  {
    apiName: "issuing_card_operations",
    displayName: getPermissionDisplayName("issuing_card_operations"),
    description: "Manage issuing cards",
    productCategory: "Issuing & Cards",
    taskCategories: ["Handle customer issues", "Manage cards"],
    actions: "read, write",
    operationType: "Read + Write",
    riskLevel: "Standard",
    hasPII: false,
    hasFinancialData: false,
    hasPaymentCredentials: true,
    roleAccess: { super_admin: "write", admin: "write", view_only: "read", support: "write", support_associate: "read, write", analyst: "write", issuing_support_agent: "write" },
  },
  // Payments
  {
    apiName: "charge",
    displayName: getPermissionDisplayName("charge"),
    description: "Charge read access",
    productCategory: "Payments",
    taskCategories: ["Handle customer issues", "Export & analyze data"],
    actions: "read",
    operationType: "Read-only",
    riskLevel: "Standard",
    hasPII: false,
    hasFinancialData: false,
    hasPaymentCredentials: false,
    roleAccess: { view_only: "read", refund_analyst: "read", dispute_analyst: "read" },
  },
  {
    apiName: "charge_operations",
    displayName: getPermissionDisplayName("charge_operations"),
    description: "Process charges and refunds",
    productCategory: "Payments",
    taskCategories: ["Handle customer issues", "Process transactions"],
    actions: "write",
    operationType: "Write",
    riskLevel: "Standard",
    hasPII: false,
    hasFinancialData: true,
    hasPaymentCredentials: false,
    roleAccess: { super_admin: "write", admin: "write", developer: "write", support: "write", support_associate: "write", analyst: "write" },
  },
  {
    apiName: "payment_intent",
    displayName: getPermissionDisplayName("payment_intent"),
    description: "Payment intent read",
    productCategory: "Payments",
    taskCategories: ["Handle customer issues", "Export & analyze data"],
    actions: "read",
    operationType: "Read-only",
    riskLevel: "Standard",
    hasPII: false,
    hasFinancialData: false,
    hasPaymentCredentials: false,
    roleAccess: { view_only: "read", refund_analyst: "read", dispute_analyst: "read" },
  },
  {
    apiName: "payment_intent_operations",
    displayName: getPermissionDisplayName("payment_intent_operations"),
    description: "Manage payment intents",
    productCategory: "Payments",
    taskCategories: ["Handle customer issues", "Process transactions"],
    actions: "write",
    operationType: "Write",
    riskLevel: "Standard",
    hasPII: false,
    hasFinancialData: false,
    hasPaymentCredentials: false,
    roleAccess: { super_admin: "write", admin: "write", developer: "write", support: "write", support_associate: "write", analyst: "write" },
  },
  {
    apiName: "payment_processing",
    displayName: getPermissionDisplayName("payment_processing"),
    description: "Manage payment methods",
    productCategory: "Payments",
    taskCategories: ["Process transactions", "Configure settings"],
    actions: "read, write",
    operationType: "Read + Write",
    riskLevel: "Standard",
    hasPII: false,
    hasFinancialData: false,
    hasPaymentCredentials: true,
    roleAccess: { super_admin: "write", admin: "write", view_only: "read", developer: "write", support: "write", support_associate: "write", analyst: "write", refund_analyst: "read", dispute_analyst: "read" },
  },
  // Products & Orders
  {
    apiName: "checkout_operations",
    displayName: getPermissionDisplayName("checkout_operations"),
    description: "Manage checkout",
    productCategory: "Products & Orders",
    taskCategories: ["Process transactions", "Configure settings"],
    actions: "read, write",
    operationType: "Read + Write",
    riskLevel: "Standard",
    hasPII: false,
    hasFinancialData: false,
    hasPaymentCredentials: false,
    roleAccess: { super_admin: "write", admin: "write", view_only: "read", developer: "write", support: "write", support_associate: "read", analyst: "write" },
  },
  {
    apiName: "order_operations",
    displayName: getPermissionDisplayName("order_operations"),
    description: "Manage orders",
    productCategory: "Products & Orders",
    taskCategories: ["Handle customer issues", "Process transactions"],
    actions: "read, write",
    operationType: "Read + Write",
    riskLevel: "Standard",
    hasPII: false,
    hasFinancialData: false,
    hasPaymentCredentials: false,
    roleAccess: { super_admin: "write", admin: "write", view_only: "read", developer: "write", support: "write", support_associate: "write", analyst: "write", refund_analyst: "read", dispute_analyst: "read" },
  },
  {
    apiName: "order_refund_operations",
    displayName: getPermissionDisplayName("order_refund_operations"),
    description: "Process order refunds",
    productCategory: "Products & Orders",
    taskCategories: ["Handle customer issues"],
    actions: "write",
    operationType: "Write",
    riskLevel: "Standard",
    hasPII: false,
    hasFinancialData: true,
    hasPaymentCredentials: false,
    roleAccess: { super_admin: "write", admin: "write", analyst: "write", refund_analyst: "write" },
  },
  {
    apiName: "product_operations",
    displayName: getPermissionDisplayName("product_operations"),
    description: "Manage products and pricing",
    productCategory: "Products & Orders",
    taskCategories: ["Manage catalog", "Configure settings"],
    actions: "read, write",
    operationType: "Read + Write",
    riskLevel: "Standard",
    hasPII: false,
    hasFinancialData: false,
    hasPaymentCredentials: false,
    roleAccess: { super_admin: "write", admin: "write", view_only: "read", support: "write", support_associate: "read", analyst: "write", refund_analyst: "read", dispute_analyst: "read" },
  },
  {
    apiName: "promotion_operations",
    displayName: getPermissionDisplayName("promotion_operations"),
    description: "Manage promotions",
    productCategory: "Products & Orders",
    taskCategories: ["Manage catalog", "Configure settings"],
    actions: "read, write",
    operationType: "Read + Write",
    riskLevel: "Standard",
    hasPII: false,
    hasFinancialData: false,
    hasPaymentCredentials: false,
    roleAccess: { super_admin: "write", admin: "write", view_only: "read", developer: "write", support: "write", support_associate: "write", analyst: "write" },
  },
  // Support & Operations
  {
    apiName: "dashboard_baseline",
    displayName: getPermissionDisplayName("dashboard_baseline"),
    description: "Basic Dashboard access (required)",
    productCategory: "Support & Operations",
    taskCategories: ["All tasks"],
    actions: "read",
    operationType: "Read-only",
    riskLevel: "Standard",
    hasPII: false,
    hasFinancialData: false,
    hasPaymentCredentials: false,
    roleAccess: { super_admin: "read", admin: "read", view_only: "read", developer: "read", support: "read", support_associate: "read", analyst: "read", refund_analyst: "read", dispute_analyst: "read", issuing_support_agent: "read", tax_analyst: "read", identity_analyst: "read", iam_admin: "read", sandbox_admin: "read" },
  },
  {
    apiName: "settings_security",
    displayName: getPermissionDisplayName("settings_security"),
    description: "Security configuration",
    productCategory: "Support & Operations",
    taskCategories: ["Configure settings", "Manage team access"],
    actions: "write",
    operationType: "Write",
    riskLevel: "Elevated",
    hasPII: false,
    hasFinancialData: false,
    hasPaymentCredentials: true,
    roleAccess: { iam_admin: "write" },
  },
  // Tax
  {
    apiName: "tax_automation_operations",
    displayName: getPermissionDisplayName("tax_automation_operations"),
    description: "Tax automation rules",
    productCategory: "Tax",
    taskCategories: ["Configure settings", "Monitor tax compliance"],
    actions: "read, write",
    operationType: "Read + Write",
    riskLevel: "Standard",
    hasPII: false,
    hasFinancialData: false,
    hasPaymentCredentials: false,
    roleAccess: { super_admin: "write", admin: "write", view_only: "read", developer: "write", support: "write", analyst: "write", tax_analyst: "write" },
  },
  {
    apiName: "tax_filing_operations",
    displayName: getPermissionDisplayName("tax_filing_operations"),
    description: "Tax filing management",
    productCategory: "Tax",
    taskCategories: ["Configure settings", "Monitor tax compliance"],
    actions: "read, write",
    operationType: "Read + Write",
    riskLevel: "Standard",
    hasPII: true,
    hasFinancialData: true,
    hasPaymentCredentials: false,
    roleAccess: { super_admin: "write", admin: "write", view_only: "read", developer: "read", analyst: "write", tax_analyst: "write" },
  },
  // Terminal
  {
    apiName: "terminal_infrastructure",
    displayName: getPermissionDisplayName("terminal_infrastructure"),
    description: "View terminal infrastructure",
    productCategory: "Terminal",
    taskCategories: ["Monitor hardware"],
    actions: "read",
    operationType: "Read-only",
    riskLevel: "Standard",
    hasPII: false,
    hasFinancialData: false,
    hasPaymentCredentials: false,
    roleAccess: { super_admin: "read", admin: "read", view_only: "read", support: "read", support_associate: "read", analyst: "read" },
  },
  {
    apiName: "terminal_operations",
    displayName: getPermissionDisplayName("terminal_operations"),
    description: "Terminal POS operations",
    productCategory: "Terminal",
    taskCategories: ["Manage hardware", "Process transactions"],
    actions: "write",
    operationType: "Write",
    riskLevel: "Standard",
    hasPII: false,
    hasFinancialData: false,
    hasPaymentCredentials: false,
    roleAccess: { super_admin: "write", admin: "write", analyst: "write" },
  },
];

// Helper to get unique values for grouping
export const productCategories = [...new Set(permissions.map((p) => p.productCategory))].sort();
export const taskCategories = [...new Set(permissions.flatMap((p) => p.taskCategories))].sort();

// Bundle group descriptions (used in BundleCard when bundled view is active)
export const GROUP_DESCRIPTIONS: Record<string, Record<string, string>> = {
  productCategory: {
    "Account & Connect": "Core account settings, connected accounts, team management, and platform configuration.",
    "Admin": "API keys, secrets, and sensitive administrative resources.",
    "Billing & Subscriptions": "Invoices, subscriptions, credit notes, and billing configuration.",
    "Capital & Treasury": "Capital financing programs and treasury financial accounts.",
    "Compliance & Identity": "Identity verification workflows and compliance-related operations.",
    "Crypto & Climate": "Crypto accounts and Stripe Climate order management.",
    "Customers": "Customer profiles, portal configuration, and customer data management.",
    "Disputes & Fraud Prevention": "Dispute handling, Radar fraud rules, and fraud review actions.",
    "Financial Operations": "Account balances, payouts, fund transfers, and balance operations.",
    "Integrations & Data": "Developer tools, data exports, reports, and Stripe Apps.",
    "Issuing & Cards": "Issuing card management and cardholder operations.",
    "Payments": "Charges, payment intents, refunds, and payment method configuration.",
    "Products & Orders": "Product catalog, pricing, checkout sessions, and order management.",
    "Support & Operations": "Dashboard baseline access and security settings.",
    "Tax": "Tax automation rules and tax filing management.",
    "Terminal": "Terminal hardware and point-of-sale operations.",
  },
  taskCategory: {
    "All tasks": "Baseline access required for all Dashboard users.",
    "Configure settings": "Modify account, billing, and product settings.",
    "Develop & integrate": "API keys, webhooks, developer tools, and Stripe Apps.",
    "Export & analyze data": "Reports, data exports, and analytics access.",
    "Handle customer issues": "Customer support, disputes, refunds, and billing inquiries.",
    "Manage billing": "Invoices, subscriptions, credit notes, and billing meters.",
    "Manage cards": "Issuing card lifecycle and cardholder management.",
    "Manage catalog": "Products, pricing, and promotions management.",
    "Manage disputes & fraud": "Dispute resolution and fraud prevention rule configuration.",
    "Manage hardware": "Terminal device management and POS configuration.",
    "Manage team access": "Team member invitations, role assignments, and security settings.",
    "Monitor financials": "Balance monitoring, payouts, and financial account oversight.",
    "Monitor hardware": "View terminal infrastructure and device status.",
    "Monitor platform": "Platform health, connected accounts, and application fees.",
    "Monitor tax compliance": "Tax automation and filing oversight.",
    "Process transactions": "Create charges, payment intents, and checkout sessions.",
    "Transfer funds": "Balance transfers and payout operations.",
    "Verify identity": "KYC verification and identity document review.",
  },
  operationType: {
    "Read-only": "View-only access with no ability to create, edit, or delete resources.",
    "Write": "Create, update, or delete resources (may not include read access).",
    "Read + Write": "Full access to view and modify resources.",
  },
  riskLevel: {
    "Standard": "Routine operations with minimal risk of unintended impact.",
    "Elevated": "Administrative operations that can change settings or access controls.",
    "Critical": "High-impact operations involving fund transfers or account-level changes.",
  },
  sensitivity: {
    "PII": "Permissions that access personally identifiable customer information.",
    "Financial Data": "Permissions involving financial records, balances, or transaction data.",
    "Payment Credentials": "Permissions with access to API keys, secrets, or payment tokens.",
    "Non-sensitive": "Permissions that don't involve PII, financial data, or credentials.",
  },
};
export const operationTypes = [...new Set(permissions.map((p) => p.operationType))].sort();
export const riskLevels = ["Standard", "Elevated", "Critical"]; // Ordered by severity

// Sensitivity groupings for UI
export type SensitivityGroup = "PII" | "Financial Data" | "Payment Credentials" | "Non-sensitive";
export function getSensitivityGroups(p: Permission): SensitivityGroup[] {
  const groups: SensitivityGroup[] = [];
  if (p.hasPII) groups.push("PII");
  if (p.hasFinancialData) groups.push("Financial Data");
  if (p.hasPaymentCredentials) groups.push("Payment Credentials");
  if (groups.length === 0) groups.push("Non-sensitive");
  return groups;
}

// Get permissions for a specific role, adjusted for the role's actual access level
export function getPermissionsForRole(roleId: string): Permission[] {
  return permissions
    .filter((p) => p.roleAccess[roleId])
    .map((p) => {
      const roleAccess = p.roleAccess[roleId];
      // If role only has read access, override operationType to Read-only
      if (roleAccess === "read" && p.operationType !== "Read-only") {
        return {
          ...p,
          operationType: "Read-only" as const,
          actions: "read",
        };
      }
      return p;
    });
}

// Get permissions for a role by API names (for custom roles)
export function getPermissionsByApiNames(apiNames: string[]): Permission[] {
  const apiNameSet = new Set(apiNames);
  return permissions.filter((p) => apiNameSet.has(p.apiName));
}

// Group permissions by a field
export type GroupByOption = "productCategory" | "taskCategory" | "operationType" | "riskLevel" | "sensitivity";

export function groupPermissions(
  perms: Permission[],
  groupBy: GroupByOption
): Record<string, Permission[]> {
  const groups: Record<string, Permission[]> = {};
  
  for (const p of perms) {
    if (groupBy === "taskCategory") {
      // For taskCategory, put permission in each of its task categories
      for (const tc of p.taskCategories) {
        if (!groups[tc]) groups[tc] = [];
        groups[tc].push(p);
      }
    } else if (groupBy === "sensitivity") {
      // For sensitivity, put permission in each applicable sensitivity group
      const sensitivityGroups = getSensitivityGroups(p);
      for (const sg of sensitivityGroups) {
        if (!groups[sg]) groups[sg] = [];
        groups[sg].push(p);
      }
    } else if (groupBy === "operationType") {
      const key = p.operationType;
      if (!groups[key]) groups[key] = [];
      groups[key].push(p);
    } else if (groupBy === "riskLevel") {
      const key = p.riskLevel;
      if (!groups[key]) groups[key] = [];
      groups[key].push(p);
    } else {
      const key = p[groupBy];
      if (!groups[key]) groups[key] = [];
      groups[key].push(p);
    }
  }
  return groups;
}

// Get all permissions (consolidated - ~50 unique)
export function getAllPermissions(): Permission[] {
  return permissions;
}

// ============================================
// Description Generation Functions
// ============================================

// Generate "Best for" description based on selected permissions
export function generateBestFor(selectedPermissions: Permission[]): string {
  if (selectedPermissions.length === 0) {
    return "Users who need minimal access to the Dashboard.";
  }

  // Count product categories
  const categoryCount: Record<string, number> = {};
  for (const p of selectedPermissions) {
    categoryCount[p.productCategory] = (categoryCount[p.productCategory] || 0) + 1;
  }

  // Get top categories (sorted by count)
  const topCategories = Object.entries(categoryCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([cat]) => cat);

  // Count task categories for role type hints
  const taskCount: Record<string, number> = {};
  for (const p of selectedPermissions) {
    for (const tc of p.taskCategories) {
      taskCount[tc] = (taskCount[tc] || 0) + 1;
    }
  }

  // Determine role type based on permissions
  const hasWriteAccess = selectedPermissions.some(p => p.actions.includes("write"));
  const hasFinancialAccess = selectedPermissions.some(p => p.hasFinancialData);
  const hasAdminAccess = selectedPermissions.some(p => p.apiName.includes("admin") || p.apiName.includes("team_management"));
  const hasSupportTasks = taskCount["Handle customer issues"] > 2;
  const hasDevTasks = taskCount["Develop & integrate"] > 0;

  // Build description based on access patterns
  let roleType = "team members";
  if (hasAdminAccess && hasFinancialAccess) {
    roleType = "administrators and managers";
  } else if (hasDevTasks) {
    roleType = "developers and technical teams";
  } else if (hasSupportTasks) {
    roleType = "support and customer service teams";
  } else if (hasFinancialAccess && !hasWriteAccess) {
    roleType = "analysts and reporting teams";
  } else if (!hasWriteAccess) {
    roleType = "team members who need visibility without edit access";
  }

  const categoryStr = topCategories.length > 0 
    ? topCategories.slice(0, 2).join(" and ").toLowerCase()
    : "general operations";

  return `${roleType.charAt(0).toUpperCase() + roleType.slice(1)} working with ${categoryStr}.`;
}

// Generate "Can" list from selected permissions
export function generateCanDo(selectedPermissions: Permission[]): string[] {
  if (selectedPermissions.length === 0) {
    return ["Access basic Dashboard features"];
  }

  // Group by task category and collect descriptions
  const taskGroups: Record<string, Set<string>> = {};
  
  for (const p of selectedPermissions) {
    for (const tc of p.taskCategories) {
      if (!taskGroups[tc]) {
        taskGroups[tc] = new Set();
      }
      // Use description or create from apiName
      const desc = p.description || p.apiName.replace(/_/g, " ");
      taskGroups[tc].add(desc);
    }
  }

  const canDoList: string[] = [];

  // Priority order for task categories
  const priorityTasks = [
    "Process transactions",
    "Handle customer issues",
    "Manage billing",
    "Monitor financials",
    "Export & analyze data",
    "Configure settings",
    "Develop & integrate",
    "Manage team access",
    "Transfer funds",
  ];

  // Add items based on priority
  for (const task of priorityTasks) {
    if (taskGroups[task] && taskGroups[task].size > 0) {
      const descriptions = Array.from(taskGroups[task]);
      // Combine similar descriptions
      if (descriptions.length > 2) {
        canDoList.push(`${task} (${descriptions.length} capabilities)`);
      } else {
        canDoList.push(...descriptions.slice(0, 2));
      }
    }
  }

  // Add remaining tasks not in priority list
  for (const [task, descs] of Object.entries(taskGroups)) {
    if (!priorityTasks.includes(task) && descs.size > 0) {
      canDoList.push(Array.from(descs)[0]);
    }
  }

  // Limit to 6 items and deduplicate
  const seen = new Set<string>();
  return canDoList.filter(item => {
    const normalized = item.toLowerCase();
    if (seen.has(normalized)) return false;
    seen.add(normalized);
    return true;
  }).slice(0, 6);
}

// Generate "Cannot" list based on what's NOT selected
export function generateCannotDo(selectedPermissions: Permission[]): string[] {
  const allPerms = getAllPermissions();
  const selectedApiNames = new Set(selectedPermissions.map(p => p.apiName));
  
  // High-value permissions that are notable when missing
  // Format: { permissionApiName: "Clear description of what you CANNOT do" }
  const notablePermissions: Record<string, string> = {
    "team_management": "Invite, remove, or manage team member roles",
    "sensitive_resources": "View or manage API keys and secrets",
    "balance_transfer_operations": "Transfer funds between accounts",
    "payout_operations": "Create or manage payouts",
    "settings_security": "Change security settings or 2FA",
    "dispute_operations": "Accept, challenge, or manage disputes",
    "order_refund_operations": "Issue refunds",
    "charge_operations": "Create new charges or payments",
    "customer_pii_operations": "View or edit customer personal information",
    "account_admin_management_operations": "Perform administrative account changes",
  };

  const cannotList: string[] = [];

  // Check for notable missing permissions
  for (const [permApiName, description] of Object.entries(notablePermissions)) {
    if (!selectedApiNames.has(permApiName) && cannotList.length < 5) {
      cannotList.push(description);
    }
  }

  // If still need more items, check for missing write access
  if (cannotList.length < 5) {
    const hasAnyWrite = selectedPermissions.some(p => p.actions.toLowerCase().includes("write"));
    if (!hasAnyWrite) {
      cannotList.push("Make any changes (read-only access)");
    }
  }

  // If still need more items, check for missing product categories
  if (cannotList.length < 5) {
    const selectedCategories = new Set(selectedPermissions.map(p => p.productCategory));
    const allCategories = new Set(allPerms.map(p => p.productCategory));
    
    for (const cat of allCategories) {
      if (!selectedCategories.has(cat) && cannotList.length < 5) {
        cannotList.push(`Access ${cat} features`);
      }
    }
  }

  return cannotList.slice(0, 5);
}

// Generate role description summary
export function generateRoleDescription(selectedPermissions: Permission[]): string {
  if (selectedPermissions.length === 0) {
    return "A custom role with minimal permissions. Add permissions to define what this role can access.";
  }

  // Generate audience prefix (from generateBestFor logic)
  const categoryCount: Record<string, number> = {};
  for (const p of selectedPermissions) {
    categoryCount[p.productCategory] = (categoryCount[p.productCategory] || 0) + 1;
  }
  const sortedCategories = Object.entries(categoryCount).sort((a, b) => b[1] - a[1]);
  const primaryCategory = sortedCategories[0]?.[0] || "";

  // Determine audience based on primary category and access type
  const hasWrite = selectedPermissions.some(p => p.actions.includes("write"));
  const taskCategories = [...new Set(selectedPermissions.flatMap(p => p.taskCategories))];
  
  let audience = "team members";
  if (taskCategories.includes("Manage team access")) {
    audience = "security and IT teams";
  } else if (primaryCategory === "Developer tools") {
    audience = "engineering teams";
  } else if (primaryCategory === "Payments") {
    audience = hasWrite ? "payment operations teams" : "finance teams";
  } else if (primaryCategory === "Connect") {
    audience = "platform operations teams";
  } else if (primaryCategory === "Billing") {
    audience = "billing and subscription teams";
  } else if (primaryCategory === "Identity") {
    audience = "compliance teams";
  } else if (primaryCategory === "Tax") {
    audience = "tax and accounting teams";
  } else if (primaryCategory === "Issuing") {
    audience = "card issuing teams";
  } else if (taskCategories.includes("Handle customer issues")) {
    audience = "customer support teams";
  } else if (!hasWrite) {
    audience = "teams needing read-only visibility";
  }

  // Build description
  const accessType = hasWrite ? "read and write" : "read-only";
  const categories = [...new Set(selectedPermissions.map(p => p.productCategory))];
  const categoryStr = categories.length > 3 
    ? `${categories.slice(0, 2).join(", ")}, and ${categories.length - 2} more areas`
    : categories.join(", ");

  // Check sensitivity
  const hasPII = selectedPermissions.some(p => p.hasPII);
  const hasFinancial = selectedPermissions.some(p => p.hasFinancialData);
  const hasCredentials = selectedPermissions.some(p => p.hasPaymentCredentials);

  let sensitivityNote = "";
  const sensitiveTypes: string[] = [];
  if (hasPII) sensitiveTypes.push("PII");
  if (hasFinancial) sensitiveTypes.push("financial data");
  if (hasCredentials) sensitiveTypes.push("payment credentials");
  
  if (sensitiveTypes.length > 0) {
    sensitivityNote = ` Includes access to ${sensitiveTypes.join(" and ")}.`;
  }

  return `For ${audience}. Custom role with ${accessType} access to ${categoryStr}.${sensitivityNote}`;
}

// Generate complete role details from permissions
export function generateRoleDetails(selectedPermissions: Permission[]): RoleDetails {
  return {
    description: generateRoleDescription(selectedPermissions),
    canDo: generateCanDo(selectedPermissions),
    cannotDo: generateCannotDo(selectedPermissions),
  };
}

// ============================================
// Risk Assessment
// ============================================

export type RiskLevel = "Low" | "Medium" | "High";

export interface RiskAssessment {
  overallRisk: RiskLevel;
  score: number;  // 0-100
  factors: {
    name: string;
    level: RiskLevel;
    description: string;
    count?: number;
  }[];
  warnings: string[];
  recommendations: string[];
}

// High-risk permissions that warrant specific warnings
const HIGH_RISK_PERMISSIONS: Record<string, string> = {
  "balance_transfer_operations": "Can transfer funds between accounts",
  "account_admin_management_operations": "Can perform destructive account operations",
  "team_management": "Can invite/remove team members and change roles",
  "settings_security": "Can modify security settings and 2FA",
  "sensitive_resources": "Has access to API keys and secrets",
  "embeddable_key_admin": "Can manage embeddable keys",
  "payout_operations": "Can create and manage payouts",
};

export function generateRiskAssessment(selectedPermissions: Permission[]): RiskAssessment {
  if (selectedPermissions.length === 0) {
    return {
      overallRisk: "Low",
      score: 0,
      factors: [],
      warnings: [],
      recommendations: ["Add permissions to define role capabilities"],
    };
  }

  const factors: RiskAssessment["factors"] = [];
  const warnings: string[] = [];
  const recommendations: string[] = [];
  let totalScore = 0;

  // Determine if this is a read-only role (significantly reduces risk)
  const writeCount = selectedPermissions.filter(p => p.operationType === "Write" || p.operationType === "Read + Write").length;
  const readOnlyCount = selectedPermissions.filter(p => p.operationType === "Read-only").length;
  const isReadOnlyRole = readOnlyCount === selectedPermissions.length;
  const writeRatio = writeCount / selectedPermissions.length;

  // 1. Risk Level Analysis (only for write permissions)
  const writePermissions = selectedPermissions.filter(p => p.operationType === "Write" || p.operationType === "Read + Write");
  const criticalCount = writePermissions.filter(p => p.riskLevel === "Critical").length;
  const elevatedCount = writePermissions.filter(p => p.riskLevel === "Elevated").length;
  const standardCount = selectedPermissions.filter(p => p.riskLevel === "Standard").length;

  if (criticalCount > 0) {
    factors.push({
      name: "Critical Operations",
      level: "High",
      description: `${criticalCount} permission${criticalCount > 1 ? 's' : ''} can perform irreversible or high-impact actions`,
      count: criticalCount,
    });
    totalScore += criticalCount * 25;
  }

  if (elevatedCount > 0) {
    factors.push({
      name: "Administrative Access",
      level: "High",
      description: `${elevatedCount} permission${elevatedCount > 1 ? 's' : ''} can modify settings or manage access`,
      count: elevatedCount,
    });
    totalScore += elevatedCount * 15;
  }

  // 2. Sensitivity Analysis (reduced weight for read-only)
  const piiCount = selectedPermissions.filter(p => p.hasPII).length;
  const financialCount = selectedPermissions.filter(p => p.hasFinancialData).length;
  const credentialsCount = selectedPermissions.filter(p => p.hasPaymentCredentials).length;
  
  // Multiplier: read-only access is much less risky
  const sensitivityMultiplier = isReadOnlyRole ? 0.2 : 1;

  if (credentialsCount > 0) {
    const level = isReadOnlyRole ? "Medium" : "High";
    factors.push({
      name: "Payment Credentials",
      level,
      description: `${isReadOnlyRole ? 'Read' : 'Access to'} ${credentialsCount} permission${credentialsCount > 1 ? 's' : ''} with API keys, secrets, or payment tokens`,
      count: credentialsCount,
    });
    totalScore += Math.round(credentialsCount * 20 * sensitivityMultiplier);
    if (!isReadOnlyRole) {
      warnings.push("Role has access to payment credentials - ensure proper security training");
    }
  }

  if (financialCount > 0) {
    const level = isReadOnlyRole ? "Low" : "High";
    factors.push({
      name: "Financial Data",
      level,
      description: `${isReadOnlyRole ? 'Read-only view of' : 'Access to'} ${financialCount} permission${financialCount > 1 ? 's' : ''} with financial records`,
      count: financialCount,
    });
    totalScore += Math.round(financialCount * 10 * sensitivityMultiplier);
  }

  if (piiCount > 0) {
    const level = isReadOnlyRole ? "Low" : "Medium";
    factors.push({
      name: "Personal Information",
      level,
      description: `${isReadOnlyRole ? 'Read-only view of' : 'Access to'} ${piiCount} permission${piiCount > 1 ? 's' : ''} with customer PII`,
      count: piiCount,
    });
    totalScore += Math.round(piiCount * 8 * sensitivityMultiplier);
    if (piiCount > 3 && !isReadOnlyRole) {
      warnings.push("Broad PII access - ensure GDPR/privacy compliance");
    }
  }

  // 3. Operation Type Analysis
  if (isReadOnlyRole) {
    factors.push({
      name: "Read-Only Access",
      level: "Low",
      description: "All permissions are read-only - no modification capability",
      count: readOnlyCount,
    });
    // Read-only roles get a significant score reduction
    totalScore = Math.round(totalScore * 0.3);
  } else if (writeRatio > 0.7) {
    factors.push({
      name: "Write-Heavy Access",
      level: "Medium",
      description: `${Math.round(writeRatio * 100)}% of permissions allow modifications`,
      count: writeCount,
    });
    totalScore += 10;
  }

  // Add Low factor for standard operations when no critical/elevated write access
  if (standardCount > 0 && criticalCount === 0 && elevatedCount === 0 && !isReadOnlyRole) {
    factors.push({
      name: "Standard Operations",
      level: "Low",
      description: `${standardCount} permission${standardCount > 1 ? 's' : ''} with routine, low-risk access`,
      count: standardCount,
    });
  }

  // 4. Check for specific high-risk permissions
  for (const [apiName, warning] of Object.entries(HIGH_RISK_PERMISSIONS)) {
    if (selectedPermissions.some(p => p.apiName === apiName)) {
      warnings.push(warning);
    }
  }

  // 5. Breadth of access
  const productCategories = new Set(selectedPermissions.map(p => p.productCategory));
  if (productCategories.size > 8) {
    factors.push({
      name: "Broad Access",
      level: "Medium",
      description: `Spans ${productCategories.size} product areas`,
      count: productCategories.size,
    });
    totalScore += 10;
    recommendations.push("Consider splitting into more focused roles");
  }

  // 6. Generate recommendations
  if (criticalCount > 0 && !selectedPermissions.some(p => p.apiName === "team_management")) {
    recommendations.push("Critical operations without team management - ensure proper oversight");
  }

  if (selectedPermissions.length > 30) {
    recommendations.push("Large permission set - review if all are necessary");
  }

  if (writeCount > 0 && readOnlyCount === 0) {
    recommendations.push("No read-only permissions - consider adding for audit visibility");
  }

  // Calculate overall risk level
  const cappedScore = Math.min(100, totalScore);
  let overallRisk: RiskLevel;
  if (cappedScore >= 70) {
    overallRisk = "High";
  } else if (cappedScore >= 45) {
    overallRisk = "High";
  } else if (cappedScore >= 20) {
    overallRisk = "Medium";
  } else {
    overallRisk = "Low";
  }

  // Sort factors by severity
  const riskOrder: Record<RiskLevel, number> = { "High": 0, "Medium": 1, "Low": 2 };
  factors.sort((a, b) => riskOrder[a.level] - riskOrder[b.level]);

  return {
    overallRisk,
    score: cappedScore,
    factors,
    warnings: warnings.slice(0, 5), // Limit to top 5 warnings
    recommendations: recommendations.slice(0, 3), // Limit to top 3 recommendations
  };
}

