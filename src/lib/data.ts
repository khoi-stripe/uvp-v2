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

// Role details - accurate to CSV permission mappings (Feb 2026)
const roleDetailsMap: Record<string, RoleDetails> = {
  super_admin: {
    description: "For account creators and C-level executives who need absolute control. This role allows all privileged actions including assigning Super Administrator to others. High security risk if compromised.",
    canDo: [
      "All Administrator capabilities",
      "Assign Super Administrator role to others",
      "Perform data migration operations",
      "Manage all team members and roles",
      "Access all account data, settings, and API keys"
    ],
    cannotDo: [
      "Cannot transfer account ownership (only the owner can)"
    ],
  },
  admin: {
    description: "For account owners and senior management who need complete control. Write access to nearly all permissions across the platform.",
    canDo: [
      "Manage all aspects of the account",
      "Invite and manage team members and roles",
      "View and edit all financial data",
      "Configure all account and product settings",
      "Access API keys, secrets, and webhooks",
      "Manage disputes, refunds, and payouts"
    ],
    cannotDo: [
      "Cannot assign Super Administrator role",
      "Cannot perform data migration operations"
    ],
  },
  developer: {
    description: "For engineering teams building and maintaining integrations. Broad write access to payments, billing, and platform features alongside developer tools.",
    canDo: [
      "Access API keys, secrets, and developer tools",
      "Process charges and manage payment methods",
      "Manage disputes, customers, and billing",
      "Build and manage Stripe Apps",
      "Run and export financial reports",
      "Configure tax rates and automation"
    ],
    cannotDo: [
      "Cannot manage team members or roles",
      "Cannot create payouts or transfer balances",
      "Cannot issue order refunds",
      "Cannot configure security settings or 2FA"
    ],
  },
  analyst: {
    description: "For finance teams and business analysts. Extensive write access across payments, billing, products, and operations — not a read-only role.",
    canDo: [
      "Process charges, refunds, and manage payments",
      "Manage billing, invoicing, and subscriptions",
      "Create payouts and transfer balances",
      "Run and export financial reports",
      "Manage products, pricing, and catalogs",
      "Configure terminal and hardware operations"
    ],
    cannotDo: [
      "Cannot manage team members or roles",
      "Cannot access API keys and secrets",
      "Cannot perform account administration",
      "Cannot configure security settings"
    ],
  },
  support: {
    description: "For customer support teams handling day-to-day customer issues. Write access to charges, disputes, billing, and customer data.",
    canDo: [
      "Process charges, refunds, and manage disputes",
      "Manage customer profiles and consent",
      "Update subscriptions, invoices, and credit notes",
      "Manage orders, returns, and fraud reviews",
      "Access Secret Store and financial reports",
      "Update products, promotions, and platform blocklists"
    ],
    cannotDo: [
      "Cannot access API keys (sensitive_resources)",
      "Cannot manage team members or roles",
      "Cannot create payouts or transfer balances",
      "Cannot configure account or security settings"
    ],
  },
  support_associate: {
    description: "For support staff with broad write access to customer-facing operations including payments, disputes, and billing.",
    canDo: [
      "Process charges and manage payment methods",
      "Manage disputes and approve fraud reviews",
      "Manage customer profiles and consent",
      "Update subscriptions, invoices, and credit notes",
      "Access Secret Store and financial reports",
      "Manage orders, returns, and promotions"
    ],
    cannotDo: [
      "Cannot access API keys (sensitive_resources)",
      "Cannot manage team members or roles",
      "Cannot create payouts or transfer balances",
      "Cannot configure account or security settings"
    ],
  },
  view_only: {
    description: "For team members who need visibility with minimal write access. Read access to most Dashboard areas plus write access to reports and user support.",
    canDo: [
      "View payments, customers, and balances",
      "View products, subscriptions, and invoices",
      "View disputes and fraud prevention data",
      "View API keys and secrets (read-only)",
      "Run and export financial reports",
      "Access user support features"
    ],
    cannotDo: [
      "Cannot process payments, charges, or refunds",
      "Cannot manage disputes or fraud reviews",
      "Cannot manage team members or configure settings"
    ],
  },
  dispute_analyst: {
    description: "For fraud and risk teams focused on dispute management. Write access to disputes plus read-only view of payments, customers, and billing.",
    canDo: [
      "View and manage disputes",
      "View charges, payment intents, and orders",
      "View customer profiles and billing details",
      "View subscriptions and invoices",
      "Manage customer consent for data access"
    ],
    cannotDo: [
      "Cannot process refunds",
      "Cannot access Radar fraud rules",
      "Cannot access API keys or secrets",
      "Cannot manage team members",
      "Cannot access financial reports"
    ],
  },
  refund_analyst: {
    description: "For finance operations teams focused on refund processing. Write access to refunds and credit notes with read-only view of payment and customer data.",
    canDo: [
      "Issue order refunds and credit notes",
      "View payments, charges, and payment intents",
      "View customer profiles and subscriptions",
      "View invoices and billing settings",
      "View disputes and Radar fraud data",
      "View financial reports"
    ],
    cannotDo: [
      "Cannot process new charges or payments",
      "Cannot manage disputes (read-only)",
      "Cannot access API keys or secrets",
      "Cannot manage team members"
    ],
  },
  identity_analyst: {
    description: "For compliance and KYC teams managing identity verification. Write access to verification sessions with read-only view of KYC data and reports.",
    canDo: [
      "Manage identity verification sessions",
      "View basic KYC and identity data",
      "View identity product settings",
      "View financial reports",
      "View account details and event logs"
    ],
    cannotDo: [
      "Cannot access payment or customer data",
      "Cannot process refunds or manage disputes",
      "Cannot manage team members",
      "Cannot access API keys or secrets"
    ],
  },
  tax_analyst: {
    description: "For tax and accounting teams managing tax compliance. Write access to tax reporting, filing, and financial reports.",
    canDo: [
      "Manage tax reporting and filing",
      "Perform tax admin operations",
      "Manage global tax reporting and exports",
      "Run and access financial reports",
      "Manage customer consent for data access"
    ],
    cannotDo: [
      "Cannot configure tax automation or tax rates",
      "Cannot access payment or customer data",
      "Cannot manage team members",
      "Cannot access API keys or secrets"
    ],
  },
  iam_admin: {
    description: "For security and IT teams managing access control. Write access to team management and security settings with limited read-only access elsewhere.",
    canDo: [
      "Manage team members and custom roles",
      "Configure security settings and 2FA",
      "Manage sandbox login access",
      "Manage customer consent for data access",
      "View account details and data portability"
    ],
    cannotDo: [
      "Cannot configure SSO or SAML settings",
      "Cannot access financial data or reports",
      "Cannot process payments or refunds",
      "Cannot access API keys or secrets"
    ],
  },
  issuing_support_agent: {
    description: "For support teams focused on card issuing. Very limited role with issuing-specific operations, Opal access, and user support.",
    canDo: [
      "Perform issuing support agent operations",
      "Access user support features",
      "View Opal direct banking data",
      "View account details and dashboard"
    ],
    cannotDo: [
      "Cannot manage issuing cards directly",
      "Cannot access payment or customer data",
      "Cannot manage disputes or process refunds",
      "Cannot access API keys or secrets",
      "Cannot manage team members"
    ],
  },
  sandbox_admin: {
    description: "For developers and QA teams testing integrations. Access to create sandbox environments and configure SSO/OAuth settings.",
    canDo: [
      "Create and manage sandbox environments",
      "Configure SSO and OAuth settings",
      "Access sandbox login",
      "View account details and data portability"
    ],
    cannotDo: [
      "Cannot access production payment data",
      "Cannot access developer tools or API keys",
      "Cannot process payments or refunds",
      "Cannot manage team members"
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
  admin_only_bundle: "Admin Operations",
  apple_pay_configuration: "Apple Pay Configuration",
  application_fee_operations: "Application Fees",
  balance_operations: "Account Balance",
  balance_transfer_operations: "Balance Transfers",
  banking_transaction: "Banking Transactions",
  batch_import_operations: "Batch Operations",
  billing_monetization_admin: "Billing Monetization Admin",
  billing_operations: "Billing & Usage Metering",
  billing_settings_operations: "Billing Settings & Profiles",
  capital_admin: "Capital Admin",
  capital_operations: "Capital Financing",
  charge: "Charges (Read Only)",
  charge_operations: "Charges & Refunds",
  checkout_operations: "Checkout (Payment Methods & Links)",
  checkout_session_operations: "Checkout Sessions",
  checkout_summary: "Checkout Summary",
  climate_operations: "Climate Orders",
  connect_risk: "Connect Risk Controls",
  connect_settings: "Connect Platform Settings",
  connected_account_operations: "Connected Account Management",
  credit_note_operations: "Credit Notes",
  crypto_extended_operations: "Crypto Extended Operations",
  crypto_operations: "Crypto Accounts",
  customer_consent_operations: "Customer Consent (IAM)",
  customer_operations: "Customer Profiles",
  customer_portal_operations: "Customer Portal",
  dashboard_approvals: "Dashboard Approvals",
  dashboard_baseline: "Dashboard Access (Basic)",
  dashboard_terminal: "Dashboard Terminal",
  data_export_operations: "Data Export",
  data_migration_specialist: "Data Migration Specialist",
  data_portability_api: "Data Portability API",
  data_portability_dashboard: "Data Portability Dashboard",
  datastore_operations: "Data Store",
  dev_integration: "Developer Tools",
  direct_export: "Direct Export",
  dispute_operations: "Disputes",
  email_operations: "Email & Communication",
  embeddable_key_admin: "Embedded Payment Keys",
  emerald_admin: "Emerald Admin",
  event_operations: "Events & Logs",
  express_admin_only_bundle: "Express Admin",
  express_app_operations: "Express App Operations",
  file_operations: "File Management",
  financial_connections_operations: "Financial Connections",
  financial_partner_support: "Financial Partner Support",
  gift_card_operations: "Gift Cards",
  global_tax_reporting: "Global Tax Reporting",
  identity_verification_operations: "Identity Verification",
  idprod_settings: "Identity Product Settings",
  invoice_operations: "Invoices & Quotes",
  issuing_admin: "Issuing Admin",
  issuing_card_operations: "Issuing Cards",
  issuing_operations: "Issuing (Full Access)",
  issuing_support_agent: "Issuing Support Agent",
  license_fee_subscription_operations: "License Fee Subscriptions",
  managed_support: "Managed Support",
  merchant_operations: "Merchant Case Management",
  oauth_settings: "OAuth Settings",
  opal_operations: "Opal (Direct Banking)",
  order_operations: "Orders",
  order_refund_operations: "Order Refunds",
  partner_settings: "Partner Settings",
  payment_attempt_records_operations: "Payment Attempt Records",
  payment_intent: "Payment Intents (Read Only)",
  payment_intent_operations: "Payment Intents",
  payment_processing: "Payment Methods",
  payment_provider_operations: "Payment Providers",
  payout_operations: "Payouts",
  plan_operations: "Legacy Billing Plans",
  platform_admin_operations: "Platform Administration",
  platform_blocklist_operations: "Platform Blocklists",
  pricing_pages_operations: "Pricing Pages & Tables",
  product_operations: "Products & Pricing",
  promotion_operations: "Promotions & Coupons",
  radar_dashboard_full: "Radar Dashboard (Full)",
  radar_operations: "Fraud Prevention Rules",
  rate_card_activation: "Rate Card Activation",
  reporting_operations: "Financial Reports",
  return_operations: "Returns",
  review_operations: "Fraud Reviews",
  sandbox_creation: "Sandbox Creation",
  sandbox_only_login: "Sandbox Only Login",
  secret_operations: "Secret Store",
  sensitive_resources: "API Keys & Secrets",
  settings_file_drop: "Settings File Drop",
  settings_security: "Security Settings",
  sso_settings: "SSO Settings",
  stripe_apps_admin: "Stripe Apps Admin",
  stripe_apps_development: "Stripe Apps Development",
  stripe_card_admin: "Stripe Card Admin",
  stripecli_operations: "Stripe CLI",
  subscription_operations: "Subscriptions",
  super_admin_only_bundle: "Super Admin",
  support_history_admin: "Support History Admin",
  tax_admin_operations: "Tax Admin Operations",
  tax_automation_operations: "Tax Automation",
  tax_filing_operations: "Tax Filing",
  tax_rates_operations: "Tax Rates & Codes",
  tax_reporting: "Tax Reporting",
  team_management: "Team & Role Management",
  terminal_hardware_operations: "Terminal Hardware Management",
  terminal_infrastructure: "Terminal Hardware (View)",
  terminal_operations: "Terminal Point of Sale",
  topup_admin: "Top-Up Admin",
  topup_operations: "Top-Ups",
  transfer_operations: "Transfers",
  transfer_write_visible: "Transfer Write Visible",
  treasury_operations: "Treasury Accounts",
  treasury_platform: "Treasury Platform",
  user_support: "User Support",
};

function getPermissionDisplayName(apiName: string): string {
  return HUMAN_FRIENDLY_NAMES[apiName] ?? toDisplayName(apiName);
}

// Permission data from CSV (consolidated by API name)
export const permissions: Permission[] = [
  {
    apiName: "account_admin_management_operations",
    displayName: getPermissionDisplayName("account_admin_management_operations"),
    description: "Full administrative account management including creating, closing, moving workspaces, and managing org child workspaces",
    productCategory: "Account & Connect",
    taskCategories: ["Manage team access"],
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
    description: "Read access to base account details for analysts (subset of full account access)",
    productCategory: "Account & Connect",
    taskCategories: ["Configure settings"],
    actions: "read, write",
    operationType: "Read + Write",
    riskLevel: "Standard",
    hasPII: false,
    hasFinancialData: false,
    hasPaymentCredentials: false,
    roleAccess: { super_admin: "write", admin: "write", view_only: "read", support: "write", support_associate: "write", refund_analyst: "read", dispute_analyst: "read", issuing_support_agent: "read", identity_analyst: "read", iam_admin: "read", sandbox_admin: "read" },
  },
  {
    apiName: "accounts_kyc_basic",
    displayName: getPermissionDisplayName("accounts_kyc_basic"),
    description: "Read access to basic KYC fields including company/individual name, business_type, annual revenue, worker count, business profiles, persons, and relationships",
    productCategory: "Account & Connect",
    taskCategories: ["Verify identity"],
    actions: "read",
    operationType: "Read-only",
    riskLevel: "Elevated",
    hasPII: true,
    hasFinancialData: false,
    hasPaymentCredentials: false,
    roleAccess: { super_admin: "read", admin: "read", view_only: "read", identity_analyst: "read" },
  },
  {
    apiName: "admin_only_bundle",
    displayName: getPermissionDisplayName("admin_only_bundle"),
    description: "Admin-only access to sensitive operations including POS SDK sessions, terminal sessions, hosted account management, reporting features, legal entity management, banking API, sandbox management, account controls, and platform settings",
    productCategory: "Admin",
    taskCategories: ["Configure settings"],
    actions: "write",
    operationType: "Write",
    riskLevel: "Critical",
    hasPII: false,
    hasFinancialData: false,
    hasPaymentCredentials: true,
    roleAccess: { super_admin: "write", admin: "write" },
  },
  {
    apiName: "apple_pay_configuration",
    displayName: getPermissionDisplayName("apple_pay_configuration"),
    description: "Read access to Apple Pay domains, certificates, and CSRs",
    productCategory: "Payments",
    taskCategories: ["Configure settings"],
    actions: "read, write",
    operationType: "Read + Write",
    riskLevel: "Critical",
    hasPII: false,
    hasFinancialData: false,
    hasPaymentCredentials: true,
    roleAccess: { super_admin: "write", admin: "write", view_only: "read", developer: "write", analyst: "write" },
  },
  {
    apiName: "application_fee_operations",
    displayName: getPermissionDisplayName("application_fee_operations"),
    description: "Read access to application fees for platform integrations",
    productCategory: "Account & Connect",
    taskCategories: ["Monitor platform"],
    actions: "read, write",
    operationType: "Read + Write",
    riskLevel: "Elevated",
    hasPII: false,
    hasFinancialData: true,
    hasPaymentCredentials: false,
    roleAccess: { super_admin: "write", admin: "write", view_only: "read", support: "write", analyst: "write" },
  },
  {
    apiName: "balance_operations",
    displayName: getPermissionDisplayName("balance_operations"),
    description: "Read access to balance and balance transactions",
    productCategory: "Financial Operations",
    taskCategories: ["Monitor financials"],
    actions: "read",
    operationType: "Read-only",
    riskLevel: "Elevated",
    hasPII: false,
    hasFinancialData: true,
    hasPaymentCredentials: false,
    roleAccess: { super_admin: "read", admin: "read", view_only: "read", support: "read", support_associate: "read", analyst: "read", refund_analyst: "read", dispute_analyst: "read" },
  },
  {
    apiName: "balance_transfer_operations",
    displayName: getPermissionDisplayName("balance_transfer_operations"),
    description: "Write access to transfer balances, manage outbound payments, payout links, open banking payments, and legacy transfers/payouts (highly sensitive)",
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
    apiName: "banking_transaction",
    displayName: getPermissionDisplayName("banking_transaction"),
    description: "Individual permission: banking_transaction_read",
    productCategory: "Capital & Treasury",
    taskCategories: ["Monitor financials"],
    actions: "read",
    operationType: "Read-only",
    riskLevel: "Elevated",
    hasPII: false,
    hasFinancialData: true,
    hasPaymentCredentials: false,
    roleAccess: {  },
  },
  {
    apiName: "batch_import_operations",
    displayName: getPermissionDisplayName("batch_import_operations"),
    description: "Read access to batch operations and bulk imports",
    productCategory: "Integrations & Data",
    taskCategories: ["Export & analyze data"],
    actions: "read, write",
    operationType: "Read + Write",
    riskLevel: "Standard",
    hasPII: false,
    hasFinancialData: false,
    hasPaymentCredentials: false,
    roleAccess: { super_admin: "write", admin: "write", view_only: "read", developer: "write", analyst: "write" },
  },
  {
    apiName: "billing_monetization_admin",
    displayName: getPermissionDisplayName("billing_monetization_admin"),
    description: "Individual permission: billing_monetization_admin",
    productCategory: "Billing & Subscriptions",
    taskCategories: ["Configure settings"],
    actions: "write",
    operationType: "Write",
    riskLevel: "Elevated",
    hasPII: false,
    hasFinancialData: false,
    hasPaymentCredentials: false,
    roleAccess: { super_admin: "write", admin: "write" },
  },
  {
    apiName: "billing_operations",
    displayName: getPermissionDisplayName("billing_operations"),
    description: "Read access to billing meters, meter events, bills, bill payments, credit grants, meter usage tracking, and dedicated balances",
    productCategory: "Billing & Subscriptions",
    taskCategories: ["Manage billing"],
    actions: "read, write",
    operationType: "Read + Write",
    riskLevel: "Elevated",
    hasPII: false,
    hasFinancialData: true,
    hasPaymentCredentials: false,
    roleAccess: { super_admin: "write", admin: "write", view_only: "read", developer: "write", analyst: "write" },
  },
  {
    apiName: "billing_settings_operations",
    displayName: getPermissionDisplayName("billing_settings_operations"),
    description: "Read access to billing settings, profiles, collection settings, credit grants, cadence, and clocks",
    productCategory: "Billing & Subscriptions",
    taskCategories: ["Configure settings"],
    actions: "read, write",
    operationType: "Write",
    riskLevel: "Elevated",
    hasPII: false,
    hasFinancialData: false,
    hasPaymentCredentials: false,
    roleAccess: { super_admin: "write", admin: "write", view_only: "read", developer: "write", support: "write", support_associate: "write", analyst: "write", refund_analyst: "read", dispute_analyst: "read" },
  },
  {
    apiName: "capital_admin",
    displayName: getPermissionDisplayName("capital_admin"),
    description: "Individual permission: capital_admin",
    productCategory: "Capital & Treasury",
    taskCategories: ["Configure settings"],
    actions: "write",
    operationType: "Write",
    riskLevel: "Elevated",
    hasPII: false,
    hasFinancialData: true,
    hasPaymentCredentials: false,
    roleAccess: { super_admin: "write", admin: "write" },
  },
  {
    apiName: "capital_operations",
    displayName: getPermissionDisplayName("capital_operations"),
    description: "Read access to Capital for Platforms financing offers and transactions",
    productCategory: "Capital & Treasury",
    taskCategories: ["Monitor financials"],
    actions: "read, write",
    operationType: "Read + Write",
    riskLevel: "Elevated",
    hasPII: false,
    hasFinancialData: true,
    hasPaymentCredentials: false,
    roleAccess: { super_admin: "write", admin: "write", view_only: "read", developer: "write", analyst: "write" },
  },
  {
    apiName: "charge",
    displayName: getPermissionDisplayName("charge"),
    description: "Individual permission: charge_read",
    productCategory: "Payments",
    taskCategories: ["Handle customer issues"],
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
    description: "Individual permission: charge_operations_write",
    productCategory: "Payments",
    taskCategories: ["Process transactions"],
    actions: "write",
    operationType: "Write",
    riskLevel: "Elevated",
    hasPII: false,
    hasFinancialData: true,
    hasPaymentCredentials: false,
    roleAccess: { super_admin: "write", admin: "write", developer: "write", support: "write", support_associate: "write", analyst: "write" },
  },
  {
    apiName: "checkout_operations",
    displayName: getPermissionDisplayName("checkout_operations"),
    description: "Read access to checkout payment methods, payment pages, payment links, and buy buttons",
    productCategory: "Products & Orders",
    taskCategories: ["Process transactions"],
    actions: "read, write",
    operationType: "Read + Write",
    riskLevel: "Standard",
    hasPII: false,
    hasFinancialData: false,
    hasPaymentCredentials: false,
    roleAccess: { super_admin: "write", admin: "write", view_only: "read", developer: "write", support: "write", support_associate: "read", analyst: "write" },
  },
  {
    apiName: "checkout_session_operations",
    displayName: getPermissionDisplayName("checkout_session_operations"),
    description: "Read access to checkout sessions, cart sessions, and delegated checkout",
    productCategory: "Products & Orders",
    taskCategories: ["Process transactions"],
    actions: "read, write",
    operationType: "Read + Write",
    riskLevel: "Standard",
    hasPII: false,
    hasFinancialData: false,
    hasPaymentCredentials: false,
    roleAccess: { super_admin: "write", admin: "write", view_only: "read", developer: "write", analyst: "write" },
  },
  {
    apiName: "checkout_summary",
    displayName: getPermissionDisplayName("checkout_summary"),
    description: "Read access to checkout summary (implies payment page and invoice read)",
    productCategory: "Products & Orders",
    taskCategories: ["Monitor platform"],
    actions: "read",
    operationType: "Read-only",
    riskLevel: "Standard",
    hasPII: false,
    hasFinancialData: false,
    hasPaymentCredentials: false,
    roleAccess: { super_admin: "read", admin: "read", view_only: "read", support: "read", support_associate: "read", refund_analyst: "read", dispute_analyst: "read" },
  },
  {
    apiName: "climate_operations",
    displayName: getPermissionDisplayName("climate_operations"),
    description: "Read access to climate orders and carbon removal projects",
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
  {
    apiName: "connect_risk",
    displayName: getPermissionDisplayName("connect_risk"),
    description: "Write access to Connect account risk controls including payment/payout disablement management and risk score notifications",
    productCategory: "Admin",
    taskCategories: ["Manage disputes & fraud"],
    actions: "write",
    operationType: "Write",
    riskLevel: "Elevated",
    hasPII: false,
    hasFinancialData: false,
    hasPaymentCredentials: false,
    roleAccess: { super_admin: "write", admin: "write" },
  },
  {
    apiName: "connect_settings",
    displayName: getPermissionDisplayName("connect_settings"),
    description: "Read and manage Connect settings with extended support access",
    productCategory: "Account & Connect",
    taskCategories: ["Configure settings"],
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
    description: "Read access to connected accounts and capabilities",
    productCategory: "Account & Connect",
    taskCategories: ["Monitor platform"],
    actions: "read, write",
    operationType: "Read + Write",
    riskLevel: "Elevated",
    hasPII: true,
    hasFinancialData: false,
    hasPaymentCredentials: false,
    roleAccess: { super_admin: "write", admin: "write", view_only: "read", developer: "write", support: "write", support_associate: "write", analyst: "read" },
  },
  {
    apiName: "credit_note_operations",
    displayName: getPermissionDisplayName("credit_note_operations"),
    description: "Read access to credit notes",
    productCategory: "Billing & Subscriptions",
    taskCategories: ["Handle customer issues"],
    actions: "read, write",
    operationType: "Read + Write",
    riskLevel: "Elevated",
    hasPII: false,
    hasFinancialData: true,
    hasPaymentCredentials: false,
    roleAccess: { super_admin: "write", admin: "write", view_only: "read", developer: "write", support: "write", support_associate: "write", analyst: "write", refund_analyst: "write" },
  },
  {
    apiName: "crypto_extended_operations",
    displayName: getPermissionDisplayName("crypto_extended_operations"),
    description: "Extended write access to crypto payin sessions and onboarding",
    productCategory: "Crypto & Climate",
    taskCategories: ["Process transactions"],
    actions: "write",
    operationType: "Write",
    riskLevel: "Elevated",
    hasPII: false,
    hasFinancialData: false,
    hasPaymentCredentials: false,
    roleAccess: { super_admin: "write", admin: "write", developer: "write", analyst: "write" },
  },
  {
    apiName: "crypto_operations",
    displayName: getPermissionDisplayName("crypto_operations"),
    description: "Read access to crypto financial accounts, onramp sessions, and checkout sessions",
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
  {
    apiName: "customer_consent_operations",
    displayName: getPermissionDisplayName("customer_consent_operations"),
    description: "Read access to customer consent for data access (IAM)",
    productCategory: "Support & Operations",
    taskCategories: ["Handle customer issues"],
    actions: "read, write",
    operationType: "Read + Write",
    riskLevel: "Elevated",
    hasPII: true,
    hasFinancialData: false,
    hasPaymentCredentials: false,
    roleAccess: { super_admin: "write", admin: "write", view_only: "read", developer: "write", support: "write", support_associate: "write", analyst: "write", refund_analyst: "write", dispute_analyst: "write", tax_analyst: "write", iam_admin: "write" },
  },
  {
    apiName: "customer_operations",
    displayName: getPermissionDisplayName("customer_operations"),
    description: "Read access to customer profiles, analytics, and email logs",
    productCategory: "Customers",
    taskCategories: ["Handle customer issues"],
    actions: "read, write",
    operationType: "Read + Write",
    riskLevel: "Elevated",
    hasPII: true,
    hasFinancialData: false,
    hasPaymentCredentials: false,
    roleAccess: { super_admin: "write", admin: "write", view_only: "read", developer: "write", support: "write", support_associate: "write", analyst: "write", refund_analyst: "read", dispute_analyst: "read" },
  },
  {
    apiName: "customer_portal_operations",
    displayName: getPermissionDisplayName("customer_portal_operations"),
    description: "Write access to create and manage customer portals and customer portal sessions",
    productCategory: "Customers",
    taskCategories: ["Configure settings"],
    actions: "write",
    operationType: "Write",
    riskLevel: "Standard",
    hasPII: false,
    hasFinancialData: false,
    hasPaymentCredentials: false,
    roleAccess: { super_admin: "write", admin: "write", analyst: "write" },
  },
  {
    apiName: "dashboard_approvals",
    displayName: getPermissionDisplayName("dashboard_approvals"),
    description: "Individual permission: dashboard_approvals_write",
    productCategory: "Support & Operations",
    taskCategories: ["Configure settings"],
    actions: "write",
    operationType: "Write",
    riskLevel: "Elevated",
    hasPII: false,
    hasFinancialData: false,
    hasPaymentCredentials: false,
    roleAccess: { super_admin: "write", admin: "write" },
  },
  {
    apiName: "dashboard_baseline",
    displayName: getPermissionDisplayName("dashboard_baseline"),
    description: "Basic dashboard navigation, search, compartments, account status, and Stripe apps",
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
    apiName: "dashboard_terminal",
    displayName: getPermissionDisplayName("dashboard_terminal"),
    description: "Individual permission: dashboard_terminal_write",
    productCategory: "Terminal",
    taskCategories: ["Configure settings"],
    actions: "write",
    operationType: "Write",
    riskLevel: "Elevated",
    hasPII: false,
    hasFinancialData: false,
    hasPaymentCredentials: false,
    roleAccess: { super_admin: "write", admin: "write" },
  },
  {
    apiName: "data_export_operations",
    displayName: getPermissionDisplayName("data_export_operations"),
    description: "Read access to export and download data including balance history and other reports",
    productCategory: "Integrations & Data",
    taskCategories: ["Export & analyze data"],
    actions: "read",
    operationType: "Read-only",
    riskLevel: "Elevated",
    hasPII: true,
    hasFinancialData: true,
    hasPaymentCredentials: false,
    roleAccess: { super_admin: "read", admin: "read", view_only: "read", developer: "read", analyst: "read" },
  },
  {
    apiName: "data_migration_specialist",
    displayName: getPermissionDisplayName("data_migration_specialist"),
    description: "Individual permission: data_migration_specialist_write",
    productCategory: "Integrations & Data",
    taskCategories: ["Develop & integrate"],
    actions: "write",
    operationType: "Write",
    riskLevel: "Elevated",
    hasPII: true,
    hasFinancialData: false,
    hasPaymentCredentials: false,
    roleAccess: { super_admin: "write" },
  },
  {
    apiName: "data_portability_api",
    displayName: getPermissionDisplayName("data_portability_api"),
    description: "Read access to data portability API",
    productCategory: "Integrations & Data",
    taskCategories: ["Export & analyze data"],
    actions: "read, write",
    operationType: "Read + Write",
    riskLevel: "Elevated",
    hasPII: true,
    hasFinancialData: false,
    hasPaymentCredentials: false,
    roleAccess: { super_admin: "write", admin: "write", view_only: "read", developer: "write", support: "write", support_associate: "write", analyst: "write", refund_analyst: "read", dispute_analyst: "read", iam_admin: "read", sandbox_admin: "read" },
  },
  {
    apiName: "data_portability_dashboard",
    displayName: getPermissionDisplayName("data_portability_dashboard"),
    description: "Dashboard read access to data portability requests and copy submissions",
    productCategory: "Integrations & Data",
    taskCategories: ["Export & analyze data"],
    actions: "read, write",
    operationType: "Read + Write",
    riskLevel: "Elevated",
    hasPII: true,
    hasFinancialData: false,
    hasPaymentCredentials: false,
    roleAccess: { super_admin: "write", admin: "write", view_only: "read" },
  },
  {
    apiName: "datastore_operations",
    displayName: getPermissionDisplayName("datastore_operations"),
    description: "Read access to entities from Data Store",
    productCategory: "Integrations & Data",
    taskCategories: ["Develop & integrate"],
    actions: "read, write",
    operationType: "Read + Write",
    riskLevel: "Standard",
    hasPII: false,
    hasFinancialData: false,
    hasPaymentCredentials: false,
    roleAccess: { super_admin: "write", admin: "write", view_only: "read", developer: "write", support: "write", support_associate: "write", analyst: "write" },
  },
  {
    apiName: "dev_integration",
    displayName: getPermissionDisplayName("dev_integration"),
    description: "Read access to development and integration testing features including SCA landing pages, Llama/Rocket tools, multiprocessor testing, and sandbox environments",
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
    apiName: "direct_export",
    displayName: getPermissionDisplayName("direct_export"),
    description: "Individual permission: direct_export_write",
    productCategory: "Integrations & Data",
    taskCategories: ["Export & analyze data"],
    actions: "write",
    operationType: "Write",
    riskLevel: "Elevated",
    hasPII: true,
    hasFinancialData: true,
    hasPaymentCredentials: false,
    roleAccess: { super_admin: "write", admin: "write" },
  },
  {
    apiName: "dispute_operations",
    displayName: getPermissionDisplayName("dispute_operations"),
    description: "Read access to disputes, dispute settings, and radar rules",
    productCategory: "Disputes & Fraud Prevention",
    taskCategories: ["Handle customer issues"],
    actions: "read, write",
    operationType: "Read + Write",
    riskLevel: "Standard",
    hasPII: false,
    hasFinancialData: false,
    hasPaymentCredentials: false,
    roleAccess: { super_admin: "write", admin: "write", view_only: "read", developer: "write", support: "write", support_associate: "write", analyst: "write", refund_analyst: "read", dispute_analyst: "write" },
  },
  {
    apiName: "email_operations",
    displayName: getPermissionDisplayName("email_operations"),
    description: "Read access to user emails and communication center settings",
    productCategory: "Support & Operations",
    taskCategories: ["Handle customer issues"],
    actions: "read",
    operationType: "Read-only",
    riskLevel: "Standard",
    hasPII: false,
    hasFinancialData: false,
    hasPaymentCredentials: false,
    roleAccess: { super_admin: "read", admin: "read", view_only: "read", developer: "read", support: "read", support_associate: "read", analyst: "read" },
  },
  {
    apiName: "embeddable_key_admin",
    displayName: getPermissionDisplayName("embeddable_key_admin"),
    description: "Administrative access to embeddable account keys for partner integrations including account management, risk, documents, capital, and payouts",
    productCategory: "Account & Connect",
    taskCategories: ["Configure settings"],
    actions: "write",
    operationType: "Write",
    riskLevel: "Critical",
    hasPII: false,
    hasFinancialData: false,
    hasPaymentCredentials: true,
    roleAccess: { super_admin: "write", admin: "write" },
  },
  {
    apiName: "emerald_admin",
    displayName: getPermissionDisplayName("emerald_admin"),
    description: "Individual permission: emerald_admin",
    productCategory: "Issuing & Cards",
    taskCategories: ["Configure settings"],
    actions: "read, write",
    operationType: "Write",
    riskLevel: "Elevated",
    hasPII: false,
    hasFinancialData: false,
    hasPaymentCredentials: false,
    roleAccess: { super_admin: "write", admin: "write", analyst: "read" },
  },
  {
    apiName: "event_operations",
    displayName: getPermissionDisplayName("event_operations"),
    description: "Read access to events and logs",
    productCategory: "Integrations & Data",
    taskCategories: ["Monitor platform"],
    actions: "read, write",
    operationType: "Read + Write",
    riskLevel: "Standard",
    hasPII: false,
    hasFinancialData: false,
    hasPaymentCredentials: false,
    roleAccess: { super_admin: "write", admin: "write", view_only: "read", developer: "write", support: "read", support_associate: "read", analyst: "write", tax_analyst: "read", identity_analyst: "read" },
  },
  {
    apiName: "express_admin_only_bundle",
    displayName: getPermissionDisplayName("express_admin_only_bundle"),
    description: "Express-specific admin permissions for account deletion, instant payouts, embeddable keys, and messaging",
    productCategory: "Admin",
    taskCategories: ["Configure settings"],
    actions: "write",
    operationType: "Write",
    riskLevel: "Critical",
    hasPII: false,
    hasFinancialData: false,
    hasPaymentCredentials: true,
    roleAccess: { super_admin: "write", admin: "write" },
  },
  {
    apiName: "express_app_operations",
    displayName: getPermissionDisplayName("express_app_operations"),
    description: "Access to Express App features including account management, goals, notifications, and preferences",
    productCategory: "Integrations & Data",
    taskCategories: ["Configure settings"],
    actions: "write",
    operationType: "Write",
    riskLevel: "Elevated",
    hasPII: false,
    hasFinancialData: false,
    hasPaymentCredentials: false,
    roleAccess: { super_admin: "write", admin: "write" },
  },
  {
    apiName: "file_operations",
    displayName: getPermissionDisplayName("file_operations"),
    description: "Read access to uploaded files, file links, file rendering, and Horizon files",
    productCategory: "Integrations & Data",
    taskCategories: ["Export & analyze data"],
    actions: "read, write",
    operationType: "Read + Write",
    riskLevel: "Elevated",
    hasPII: true,
    hasFinancialData: false,
    hasPaymentCredentials: false,
    roleAccess: { super_admin: "write", admin: "write", view_only: "read", developer: "write", analyst: "write", identity_analyst: "read" },
  },
  {
    apiName: "financial_connections_operations",
    displayName: getPermissionDisplayName("financial_connections_operations"),
    description: "Read access to Financial Connections dashboard, API, accounts, and auth sessions",
    productCategory: "Financial Operations",
    taskCategories: ["Process transactions"],
    actions: "read, write",
    operationType: "Read + Write",
    riskLevel: "Elevated",
    hasPII: true,
    hasFinancialData: true,
    hasPaymentCredentials: false,
    roleAccess: { super_admin: "write", admin: "write", view_only: "read", developer: "write", analyst: "read" },
  },
  {
    apiName: "financial_partner_support",
    displayName: getPermissionDisplayName("financial_partner_support"),
    description: "Individual permission: financial_partner_support_read",
    productCategory: "Capital & Treasury",
    taskCategories: ["Handle customer issues"],
    actions: "read",
    operationType: "Read-only",
    riskLevel: "Elevated",
    hasPII: false,
    hasFinancialData: true,
    hasPaymentCredentials: false,
    roleAccess: {  },
  },
  {
    apiName: "gift_card_operations",
    displayName: getPermissionDisplayName("gift_card_operations"),
    description: "Read access to gift cards",
    productCategory: "Products & Orders",
    taskCategories: ["Process transactions"],
    actions: "read, write",
    operationType: "Read + Write",
    riskLevel: "Elevated",
    hasPII: false,
    hasFinancialData: true,
    hasPaymentCredentials: false,
    roleAccess: { super_admin: "write", admin: "write", view_only: "read", developer: "write", support: "read", analyst: "write" },
  },
  {
    apiName: "global_tax_reporting",
    displayName: getPermissionDisplayName("global_tax_reporting"),
    description: "Write access to global tax reporting including CSV exports/imports, platform settings, and test reports",
    productCategory: "Tax",
    taskCategories: ["Monitor tax compliance"],
    actions: "write",
    operationType: "Write",
    riskLevel: "Elevated",
    hasPII: true,
    hasFinancialData: true,
    hasPaymentCredentials: false,
    roleAccess: { super_admin: "write", admin: "write", tax_analyst: "write" },
  },
  {
    apiName: "identity_verification_operations",
    displayName: getPermissionDisplayName("identity_verification_operations"),
    description: "Read access to identity verification and Gelato interventions",
    productCategory: "Compliance & Identity",
    taskCategories: ["Verify identity"],
    actions: "read, write",
    operationType: "Read + Write",
    riskLevel: "Elevated",
    hasPII: true,
    hasFinancialData: false,
    hasPaymentCredentials: false,
    roleAccess: { super_admin: "write", admin: "write", view_only: "read", developer: "write", analyst: "write", identity_analyst: "write" },
  },
  {
    apiName: "idprod_settings",
    displayName: getPermissionDisplayName("idprod_settings"),
    description: "Individual permission: idprod_settings_read",
    productCategory: "Compliance & Identity",
    taskCategories: ["Configure settings"],
    actions: "read",
    operationType: "Read-only",
    riskLevel: "Standard",
    hasPII: false,
    hasFinancialData: false,
    hasPaymentCredentials: false,
    roleAccess: { identity_analyst: "read" },
  },
  {
    apiName: "invoice_operations",
    displayName: getPermissionDisplayName("invoice_operations"),
    description: "Read access to invoices, quotes, templates, invoice details, and paper checks",
    productCategory: "Billing & Subscriptions",
    taskCategories: ["Handle customer issues"],
    actions: "read, write",
    operationType: "Read + Write",
    riskLevel: "Elevated",
    hasPII: false,
    hasFinancialData: true,
    hasPaymentCredentials: false,
    roleAccess: { super_admin: "write", admin: "write", view_only: "read", developer: "write", support: "write", support_associate: "write", analyst: "write", refund_analyst: "read", dispute_analyst: "read" },
  },
  {
    apiName: "issuing_admin",
    displayName: getPermissionDisplayName("issuing_admin"),
    description: "Individual permission: issuing_admin",
    productCategory: "Issuing & Cards",
    taskCategories: ["Configure settings"],
    actions: "write",
    operationType: "Write",
    riskLevel: "Critical",
    hasPII: false,
    hasFinancialData: false,
    hasPaymentCredentials: true,
    roleAccess: { super_admin: "write", admin: "write" },
  },
  {
    apiName: "issuing_card_operations",
    displayName: getPermissionDisplayName("issuing_card_operations"),
    description: "Read access to issuing cards",
    productCategory: "Issuing & Cards",
    taskCategories: ["Manage cards"],
    actions: "read, write",
    operationType: "Read + Write",
    riskLevel: "Critical",
    hasPII: false,
    hasFinancialData: false,
    hasPaymentCredentials: true,
    roleAccess: { super_admin: "write", admin: "write", view_only: "read", support: "write", support_associate: "read, write", analyst: "write" },
  },
  {
    apiName: "issuing_operations",
    displayName: getPermissionDisplayName("issuing_operations"),
    description: "Full write access to all Issuing resources (mega permission)",
    productCategory: "Issuing & Cards",
    taskCategories: ["Manage cards"],
    actions: "write",
    operationType: "Write",
    riskLevel: "Critical",
    hasPII: false,
    hasFinancialData: false,
    hasPaymentCredentials: true,
    roleAccess: { super_admin: "write", admin: "write", developer: "write", analyst: "write" },
  },
  {
    apiName: "issuing_support_agent",
    displayName: getPermissionDisplayName("issuing_support_agent"),
    description: "Individual permission: issuing_support_agent",
    productCategory: "Issuing & Cards",
    taskCategories: ["Handle customer issues"],
    actions: "write",
    operationType: "Write",
    riskLevel: "Critical",
    hasPII: false,
    hasFinancialData: false,
    hasPaymentCredentials: true,
    roleAccess: { super_admin: "write", admin: "write", issuing_support_agent: "write" },
  },
  {
    apiName: "license_fee_subscription_operations",
    displayName: getPermissionDisplayName("license_fee_subscription_operations"),
    description: "Read access to license fee subscriptions",
    productCategory: "Billing & Subscriptions",
    taskCategories: ["Manage billing"],
    actions: "read, write",
    operationType: "Read + Write",
    riskLevel: "Elevated",
    hasPII: false,
    hasFinancialData: true,
    hasPaymentCredentials: false,
    roleAccess: { super_admin: "write", admin: "write", developer: "read", support: "write", support_associate: "write" },
  },
  {
    apiName: "managed_support",
    displayName: getPermissionDisplayName("managed_support"),
    description: "Read access to managed support operations including file drops, merchant settings, messages, alerts, and integration health",
    productCategory: "Support & Operations",
    taskCategories: ["Handle customer issues"],
    actions: "read, write",
    operationType: "Read + Write",
    riskLevel: "Standard",
    hasPII: false,
    hasFinancialData: false,
    hasPaymentCredentials: false,
    roleAccess: { super_admin: "write", admin: "write", view_only: "read", developer: "write", analyst: "write" },
  },
  {
    apiName: "merchant_operations",
    displayName: getPermissionDisplayName("merchant_operations"),
    description: "Read access to merchant case management for Connect accounts",
    productCategory: "Account & Connect",
    taskCategories: ["Handle customer issues"],
    actions: "read, write",
    operationType: "Read + Write",
    riskLevel: "Elevated",
    hasPII: true,
    hasFinancialData: false,
    hasPaymentCredentials: false,
    roleAccess: { super_admin: "write", admin: "write", view_only: "read", developer: "write", analyst: "read" },
  },
  {
    apiName: "oauth_settings",
    displayName: getPermissionDisplayName("oauth_settings"),
    description: "Individual permission: oauth_settings_write",
    productCategory: "Integrations & Data",
    taskCategories: ["Configure settings"],
    actions: "read, write",
    operationType: "Read + Write",
    riskLevel: "Standard",
    hasPII: false,
    hasFinancialData: false,
    hasPaymentCredentials: false,
    roleAccess: { super_admin: "write", admin: "write", view_only: "read", developer: "read", analyst: "read", sandbox_admin: "read, write" },
  },
  {
    apiName: "opal_operations",
    displayName: getPermissionDisplayName("opal_operations"),
    description: "Read access to Opal dashboard surfaces for direct banking",
    productCategory: "Issuing & Cards",
    taskCategories: ["Monitor platform"],
    actions: "read",
    operationType: "Read-only",
    riskLevel: "Elevated",
    hasPII: false,
    hasFinancialData: true,
    hasPaymentCredentials: false,
    roleAccess: { super_admin: "read", admin: "read", view_only: "read", issuing_support_agent: "read" },
  },
  {
    apiName: "order_operations",
    displayName: getPermissionDisplayName("order_operations"),
    description: "Read access to orders (v1 and v2) and order history",
    productCategory: "Products & Orders",
    taskCategories: ["Handle customer issues"],
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
    description: "Write access to refund orders",
    productCategory: "Products & Orders",
    taskCategories: ["Handle customer issues"],
    actions: "write",
    operationType: "Write",
    riskLevel: "Elevated",
    hasPII: false,
    hasFinancialData: true,
    hasPaymentCredentials: false,
    roleAccess: { super_admin: "write", admin: "write", analyst: "write", refund_analyst: "write" },
  },
  {
    apiName: "partner_settings",
    displayName: getPermissionDisplayName("partner_settings"),
    description: "Manage partner settings and listings",
    productCategory: "Account & Connect",
    taskCategories: ["Configure settings"],
    actions: "write",
    operationType: "Write",
    riskLevel: "Elevated",
    hasPII: false,
    hasFinancialData: false,
    hasPaymentCredentials: false,
    roleAccess: { super_admin: "write", admin: "write", support: "write", support_associate: "write" },
  },
  {
    apiName: "payment_attempt_records_operations",
    displayName: getPermissionDisplayName("payment_attempt_records_operations"),
    description: "Read access to payment attempt records and logs",
    productCategory: "Payments",
    taskCategories: ["Monitor platform"],
    actions: "read, write",
    operationType: "Read + Write",
    riskLevel: "Standard",
    hasPII: false,
    hasFinancialData: false,
    hasPaymentCredentials: false,
    roleAccess: { super_admin: "write", admin: "write", view_only: "read", developer: "read", support: "write", support_associate: "write", analyst: "write", refund_analyst: "read", dispute_analyst: "read" },
  },
  {
    apiName: "payment_intent",
    displayName: getPermissionDisplayName("payment_intent"),
    description: "Individual permission: payment_intent_read",
    productCategory: "Payments",
    taskCategories: ["Handle customer issues"],
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
    description: "Write access to create, update, cancel, and capture payment intents",
    productCategory: "Payments",
    taskCategories: ["Process transactions"],
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
    description: "Read access to payment processing including payment methods, tokens, card verification, and setup intents",
    productCategory: "Payments",
    taskCategories: ["Process transactions"],
    actions: "read, write",
    operationType: "Read + Write",
    riskLevel: "Critical",
    hasPII: false,
    hasFinancialData: false,
    hasPaymentCredentials: true,
    roleAccess: { super_admin: "write", admin: "write", view_only: "read", developer: "write", support: "write", support_associate: "write", analyst: "write", refund_analyst: "read", dispute_analyst: "read" },
  },
  {
    apiName: "payment_provider_operations",
    displayName: getPermissionDisplayName("payment_provider_operations"),
    description: "Read access to payment providers, gateways, payment partner analyst data, and provider-specific operations",
    productCategory: "Payments",
    taskCategories: ["Configure settings"],
    actions: "read, write",
    operationType: "Read + Write",
    riskLevel: "Standard",
    hasPII: false,
    hasFinancialData: false,
    hasPaymentCredentials: false,
    roleAccess: { super_admin: "write", admin: "write", view_only: "read", developer: "write", analyst: "write" },
  },
  {
    apiName: "payout_operations",
    displayName: getPermissionDisplayName("payout_operations"),
    description: "Read access to payouts, schedules, and payout links",
    productCategory: "Financial Operations",
    taskCategories: ["Transfer funds"],
    actions: "read, write",
    operationType: "Read + Write",
    riskLevel: "Elevated",
    hasPII: false,
    hasFinancialData: true,
    hasPaymentCredentials: false,
    roleAccess: { super_admin: "write", admin: "write", view_only: "read", analyst: "write" },
  },
  {
    apiName: "plan_operations",
    displayName: getPermissionDisplayName("plan_operations"),
    description: "Read access to legacy billing plans (pre-pricing tables)",
    productCategory: "Billing & Subscriptions",
    taskCategories: ["Manage billing"],
    actions: "read, write",
    operationType: "Read + Write",
    riskLevel: "Elevated",
    hasPII: false,
    hasFinancialData: true,
    hasPaymentCredentials: false,
    roleAccess: { super_admin: "write", admin: "write", developer: "write", support: "write", analyst: "write" },
  },
  {
    apiName: "platform_admin_operations",
    displayName: getPermissionDisplayName("platform_admin_operations"),
    description: "Platform administration including account templates, underwriting, V2 account management, recipient verification, financial accounts, merchant analytics, and attribute management",
    productCategory: "Account & Connect",
    taskCategories: ["Configure settings"],
    actions: "write",
    operationType: "Write",
    riskLevel: "Elevated",
    hasPII: true,
    hasFinancialData: false,
    hasPaymentCredentials: false,
    roleAccess: { super_admin: "write", admin: "write", developer: "write", analyst: "write" },
  },
  {
    apiName: "platform_blocklist_operations",
    displayName: getPermissionDisplayName("platform_blocklist_operations"),
    description: "Write access to manage platform-level blocklists and delete list items",
    productCategory: "Account & Connect",
    taskCategories: ["Manage disputes & fraud"],
    actions: "read, write",
    operationType: "Read + Write",
    riskLevel: "Standard",
    hasPII: false,
    hasFinancialData: false,
    hasPaymentCredentials: false,
    roleAccess: { super_admin: "write", admin: "write", view_only: "read", support: "write", support_associate: "write", analyst: "write" },
  },
  {
    apiName: "pricing_pages_operations",
    displayName: getPermissionDisplayName("pricing_pages_operations"),
    description: "Read access to pricing pages, pricing tables, and line items",
    productCategory: "Products & Orders",
    taskCategories: ["Manage catalog"],
    actions: "read, write",
    operationType: "Read + Write",
    riskLevel: "Standard",
    hasPII: false,
    hasFinancialData: false,
    hasPaymentCredentials: false,
    roleAccess: { super_admin: "write", admin: "write", view_only: "read", developer: "write", analyst: "write" },
  },
  {
    apiName: "product_operations",
    displayName: getPermissionDisplayName("product_operations"),
    description: "Read access to products, catalog, pricing plans, SKUs, rate cards, license fees, coupons, shipping rates, inventory, and tax product transactions",
    productCategory: "Products & Orders",
    taskCategories: ["Manage catalog"],
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
    description: "Read access to coupons and promotion codes",
    productCategory: "Products & Orders",
    taskCategories: ["Manage catalog"],
    actions: "read, write",
    operationType: "Read + Write",
    riskLevel: "Standard",
    hasPII: false,
    hasFinancialData: false,
    hasPaymentCredentials: false,
    roleAccess: { super_admin: "write", admin: "write", view_only: "read", developer: "write", support: "write", support_associate: "write", analyst: "write" },
  },
  {
    apiName: "radar_dashboard_full",
    displayName: getPermissionDisplayName("radar_dashboard_full"),
    description: "Full read access to all Radar dashboard pages (analytics, reviews, disputes, rules, settings)",
    productCategory: "Disputes & Fraud Prevention",
    taskCategories: ["Manage disputes & fraud"],
    actions: "read",
    operationType: "Read-only",
    riskLevel: "Standard",
    hasPII: false,
    hasFinancialData: false,
    hasPaymentCredentials: false,
    roleAccess: { super_admin: "read", admin: "read", view_only: "read", analyst: "read" },
  },
  {
    apiName: "radar_operations",
    displayName: getPermissionDisplayName("radar_operations"),
    description: "Read access to Radar including reviews, disputes, rules, and analytics",
    productCategory: "Disputes & Fraud Prevention",
    taskCategories: ["Manage disputes & fraud"],
    actions: "read, write",
    operationType: "Read + Write",
    riskLevel: "Standard",
    hasPII: false,
    hasFinancialData: false,
    hasPaymentCredentials: false,
    roleAccess: { super_admin: "write", admin: "write", view_only: "read", developer: "write", support: "read", support_associate: "read", analyst: "read", refund_analyst: "read" },
  },
  {
    apiName: "rate_card_activation",
    displayName: getPermissionDisplayName("rate_card_activation"),
    description: "Individual permission: rate_card_activation_write",
    productCategory: "Billing & Subscriptions",
    taskCategories: ["Configure settings"],
    actions: "write",
    operationType: "Write",
    riskLevel: "Elevated",
    hasPII: false,
    hasFinancialData: false,
    hasPaymentCredentials: false,
    roleAccess: { super_admin: "write", admin: "write", support: "write", support_associate: "write" },
  },
  {
    apiName: "reporting_operations",
    displayName: getPermissionDisplayName("reporting_operations"),
    description: "Read access to run and access reports powered by the reporting dataset",
    productCategory: "Integrations & Data",
    taskCategories: ["Export & analyze data"],
    actions: "read, write",
    operationType: "Read + Write",
    riskLevel: "Elevated",
    hasPII: false,
    hasFinancialData: true,
    hasPaymentCredentials: false,
    roleAccess: { super_admin: "write", admin: "write", view_only: "read, write", developer: "write", support: "write", support_associate: "write", analyst: "write", refund_analyst: "read", tax_analyst: "write", identity_analyst: "read" },
  },
  {
    apiName: "return_operations",
    displayName: getPermissionDisplayName("return_operations"),
    description: "Read access to return intents and return methods",
    productCategory: "Products & Orders",
    taskCategories: ["Handle customer issues"],
    actions: "read, write",
    operationType: "Read + Write",
    riskLevel: "Standard",
    hasPII: false,
    hasFinancialData: false,
    hasPaymentCredentials: false,
    roleAccess: { super_admin: "write", admin: "write", view_only: "read", developer: "write", support: "write", support_associate: "write", analyst: "write" },
  },
  {
    apiName: "review_operations",
    displayName: getPermissionDisplayName("review_operations"),
    description: "Write access to approve or refund fraud reviews",
    productCategory: "Disputes & Fraud Prevention",
    taskCategories: ["Manage disputes & fraud"],
    actions: "write",
    operationType: "Write",
    riskLevel: "Standard",
    hasPII: false,
    hasFinancialData: false,
    hasPaymentCredentials: false,
    roleAccess: { super_admin: "write", admin: "write", support: "write", support_associate: "write", analyst: "write" },
  },
  {
    apiName: "sandbox_creation",
    displayName: getPermissionDisplayName("sandbox_creation"),
    description: "Write access to create sandbox organizations for testing",
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
    apiName: "sandbox_only_login",
    displayName: getPermissionDisplayName("sandbox_only_login"),
    description: "Individual permission: sandbox_only_login",
    productCategory: "Account & Connect",
    taskCategories: ["Develop & integrate"],
    actions: "write",
    operationType: "Write",
    riskLevel: "Elevated",
    hasPII: false,
    hasFinancialData: false,
    hasPaymentCredentials: false,
    roleAccess: { iam_admin: "write", sandbox_admin: "write" },
  },
  {
    apiName: "secret_operations",
    displayName: getPermissionDisplayName("secret_operations"),
    description: "Read access to secrets from Secret Store",
    productCategory: "Integrations & Data",
    taskCategories: ["Develop & integrate"],
    actions: "read, write",
    operationType: "Read + Write",
    riskLevel: "Critical",
    hasPII: false,
    hasFinancialData: false,
    hasPaymentCredentials: true,
    roleAccess: { super_admin: "write", admin: "write", view_only: "read", developer: "write", support: "write", support_associate: "write", analyst: "write" },
  },
  {
    apiName: "sensitive_resources",
    displayName: getPermissionDisplayName("sensitive_resources"),
    description: "Read access to sensitive resources including API keys, metadata keys, security settings, treasury platform, and tax reporting. Contains PII data.",
    productCategory: "Admin",
    taskCategories: ["Develop & integrate"],
    actions: "read",
    operationType: "Read-only",
    riskLevel: "Critical",
    hasPII: false,
    hasFinancialData: false,
    hasPaymentCredentials: true,
    roleAccess: { super_admin: "read", admin: "read", view_only: "read", developer: "read" },
  },
  {
    apiName: "settings_file_drop",
    displayName: getPermissionDisplayName("settings_file_drop"),
    description: "Individual permission: settings_file_drop",
    productCategory: "Support & Operations",
    taskCategories: ["Configure settings"],
    actions: "write",
    operationType: "Write",
    riskLevel: "Elevated",
    hasPII: true,
    hasFinancialData: false,
    hasPaymentCredentials: false,
    roleAccess: {  },
  },
  {
    apiName: "settings_security",
    displayName: getPermissionDisplayName("settings_security"),
    description: "Individual permission: settings_security",
    productCategory: "Support & Operations",
    taskCategories: ["Configure settings"],
    actions: "write",
    operationType: "Write",
    riskLevel: "Critical",
    hasPII: false,
    hasFinancialData: false,
    hasPaymentCredentials: true,
    roleAccess: { iam_admin: "write" },
  },
  {
    apiName: "sso_settings",
    displayName: getPermissionDisplayName("sso_settings"),
    description: "Read access to OAuth, SSO, SAML, and user group settings",
    productCategory: "Integrations & Data",
    taskCategories: ["Configure settings"],
    actions: "read, write",
    operationType: "Read + Write",
    riskLevel: "Standard",
    hasPII: false,
    hasFinancialData: false,
    hasPaymentCredentials: false,
    roleAccess: { super_admin: "write", admin: "write", view_only: "read", analyst: "read", sandbox_admin: "write" },
  },
  {
    apiName: "stripe_apps_admin",
    displayName: getPermissionDisplayName("stripe_apps_admin"),
    description: "Individual permission: stripe_apps_admin",
    productCategory: "Integrations & Data",
    taskCategories: ["Configure settings"],
    actions: "write",
    operationType: "Write",
    riskLevel: "Elevated",
    hasPII: false,
    hasFinancialData: false,
    hasPaymentCredentials: false,
    roleAccess: { super_admin: "write", admin: "write" },
  },
  {
    apiName: "stripe_apps_development",
    displayName: getPermissionDisplayName("stripe_apps_development"),
    description: "Read access to Stripe Apps projects, builds, environments, and marketplace",
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
    apiName: "stripe_card_admin",
    displayName: getPermissionDisplayName("stripe_card_admin"),
    description: "Individual permission: stripe_card_admin_read",
    productCategory: "Issuing & Cards",
    taskCategories: ["Configure settings"],
    actions: "read, write",
    operationType: "Read + Write",
    riskLevel: "Critical",
    hasPII: false,
    hasFinancialData: false,
    hasPaymentCredentials: true,
    roleAccess: { super_admin: "write", admin: "write", view_only: "read", analyst: "read" },
  },
  {
    apiName: "stripecli_operations",
    displayName: getPermissionDisplayName("stripecli_operations"),
    description: "Read access to Stripe CLI device registrations and webhook response logs for local development",
    productCategory: "Integrations & Data",
    taskCategories: ["Develop & integrate"],
    actions: "read",
    operationType: "Read-only",
    riskLevel: "Standard",
    hasPII: false,
    hasFinancialData: false,
    hasPaymentCredentials: false,
    roleAccess: { super_admin: "read", admin: "read", view_only: "read", analyst: "read" },
  },
  {
    apiName: "subscription_operations",
    displayName: getPermissionDisplayName("subscription_operations"),
    description: "Read access to subscriptions, schedules, and subscription payment methods",
    productCategory: "Billing & Subscriptions",
    taskCategories: ["Manage billing"],
    actions: "read, write",
    operationType: "Read + Write",
    riskLevel: "Elevated",
    hasPII: false,
    hasFinancialData: true,
    hasPaymentCredentials: false,
    roleAccess: { super_admin: "write", admin: "write", view_only: "read", developer: "write", support: "write", support_associate: "write", analyst: "write", refund_analyst: "read", dispute_analyst: "read" },
  },
  {
    apiName: "super_admin_only_bundle",
    displayName: getPermissionDisplayName("super_admin_only_bundle"),
    description: "Super admin permissions for role assignment, Horizon compartment administration, and elevated privileges",
    productCategory: "Admin",
    taskCategories: ["Manage team access"],
    actions: "write",
    operationType: "Write",
    riskLevel: "Critical",
    hasPII: false,
    hasFinancialData: false,
    hasPaymentCredentials: true,
    roleAccess: { super_admin: "write" },
  },
  {
    apiName: "support_history_admin",
    displayName: getPermissionDisplayName("support_history_admin"),
    description: "Individual permission: support_history_admin",
    productCategory: "Support & Operations",
    taskCategories: ["Handle customer issues"],
    actions: "write",
    operationType: "Write",
    riskLevel: "Elevated",
    hasPII: false,
    hasFinancialData: false,
    hasPaymentCredentials: false,
    roleAccess: { super_admin: "write", admin: "write", developer: "write" },
  },
  {
    apiName: "tax_admin_operations",
    displayName: getPermissionDisplayName("tax_admin_operations"),
    description: "Tax analyst administrative operations including export, messaging, communications, and W8/W9 access",
    productCategory: "Tax",
    taskCategories: ["Monitor tax compliance"],
    actions: "write",
    operationType: "Write",
    riskLevel: "Elevated",
    hasPII: true,
    hasFinancialData: true,
    hasPaymentCredentials: false,
    roleAccess: { super_admin: "write", admin: "write", tax_analyst: "write" },
  },
  {
    apiName: "tax_automation_operations",
    displayName: getPermissionDisplayName("tax_automation_operations"),
    description: "Read access to tax automatic rules and tax calculations",
    productCategory: "Tax",
    taskCategories: ["Configure settings"],
    actions: "read, write",
    operationType: "Read + Write",
    riskLevel: "Standard",
    hasPII: false,
    hasFinancialData: false,
    hasPaymentCredentials: false,
    roleAccess: { super_admin: "write", admin: "write", view_only: "read", developer: "write", support: "write", analyst: "write" },
  },
  {
    apiName: "tax_filing_operations",
    displayName: getPermissionDisplayName("tax_filing_operations"),
    description: "Read access to tax filing enrollment, registrations (RaaS), and merchant tax settings",
    productCategory: "Tax",
    taskCategories: ["Monitor tax compliance"],
    actions: "read, write",
    operationType: "Read + Write",
    riskLevel: "Elevated",
    hasPII: true,
    hasFinancialData: true,
    hasPaymentCredentials: false,
    roleAccess: { super_admin: "write", admin: "write", view_only: "read", developer: "read", analyst: "write", tax_analyst: "write" },
  },
  {
    apiName: "tax_rates_operations",
    displayName: getPermissionDisplayName("tax_rates_operations"),
    description: "Read access to tax rates, tax codes, tax settings, tax locations, and tax transactions",
    productCategory: "Tax",
    taskCategories: ["Configure settings"],
    actions: "read, write",
    operationType: "Read + Write",
    riskLevel: "Standard",
    hasPII: false,
    hasFinancialData: false,
    hasPaymentCredentials: false,
    roleAccess: { super_admin: "write", admin: "write", view_only: "read", developer: "write", support: "write", support_associate: "write", analyst: "write" },
  },
  {
    apiName: "tax_reporting",
    displayName: getPermissionDisplayName("tax_reporting"),
    description: "Individual permission: tax_reporting_write",
    productCategory: "Tax",
    taskCategories: ["Monitor tax compliance"],
    actions: "write",
    operationType: "Write",
    riskLevel: "Elevated",
    hasPII: true,
    hasFinancialData: true,
    hasPaymentCredentials: false,
    roleAccess: { super_admin: "write", admin: "write", tax_analyst: "write" },
  },
  {
    apiName: "team_management",
    displayName: getPermissionDisplayName("team_management"),
    description: "Read access to team management including custom roles, user invites, user roles, and team settings",
    productCategory: "Account & Connect",
    taskCategories: ["Manage team access"],
    actions: "read, write",
    operationType: "Write",
    riskLevel: "Elevated",
    hasPII: false,
    hasFinancialData: false,
    hasPaymentCredentials: false,
    roleAccess: { super_admin: "write", admin: "write", view_only: "read", iam_admin: "write" },
  },
  {
    apiName: "terminal_hardware_operations",
    displayName: getPermissionDisplayName("terminal_hardware_operations"),
    description: "Write access to process terminal hardware returns, warranty claims, and CSV reports",
    productCategory: "Terminal",
    taskCategories: ["Manage hardware"],
    actions: "write",
    operationType: "Write",
    riskLevel: "Elevated",
    hasPII: false,
    hasFinancialData: false,
    hasPaymentCredentials: false,
    roleAccess: { super_admin: "write", admin: "write", support: "write", analyst: "write" },
  },
  {
    apiName: "terminal_infrastructure",
    displayName: getPermissionDisplayName("terminal_infrastructure"),
    description: "Read access to terminal readers, locations, configurations, and hardware",
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
    description: "Full write access to terminal POS operations and hardware management",
    productCategory: "Terminal",
    taskCategories: ["Manage hardware"],
    actions: "write",
    operationType: "Write",
    riskLevel: "Standard",
    hasPII: false,
    hasFinancialData: false,
    hasPaymentCredentials: false,
    roleAccess: { super_admin: "write", admin: "write", analyst: "write" },
  },
  {
    apiName: "topup_admin",
    displayName: getPermissionDisplayName("topup_admin"),
    description: "Administrative write access to top-ups including source management, account access, and balance operations",
    productCategory: "Financial Operations",
    taskCategories: ["Transfer funds"],
    actions: "write",
    operationType: "Write",
    riskLevel: "Elevated",
    hasPII: false,
    hasFinancialData: true,
    hasPaymentCredentials: false,
    roleAccess: { super_admin: "write", admin: "write" },
  },
  {
    apiName: "topup_operations",
    displayName: getPermissionDisplayName("topup_operations"),
    description: "Read access to top-ups including status and history",
    productCategory: "Financial Operations",
    taskCategories: ["Monitor financials"],
    actions: "read, write",
    operationType: "Read + Write",
    riskLevel: "Elevated",
    hasPII: false,
    hasFinancialData: true,
    hasPaymentCredentials: false,
    roleAccess: { super_admin: "read, write", admin: "read, write", view_only: "read", analyst: "write" },
  },
  {
    apiName: "transfer_operations",
    displayName: getPermissionDisplayName("transfer_operations"),
    description: "Read access to transfers including transfer reversals and schedules",
    productCategory: "Financial Operations",
    taskCategories: ["Transfer funds"],
    actions: "read, write",
    operationType: "Read + Write",
    riskLevel: "Elevated",
    hasPII: false,
    hasFinancialData: true,
    hasPaymentCredentials: false,
    roleAccess: { super_admin: "write", admin: "write", view_only: "read", analyst: "write" },
  },
  {
    apiName: "transfer_write_visible",
    displayName: getPermissionDisplayName("transfer_write_visible"),
    description: "Individual permission: transfer_write_visible",
    productCategory: "Financial Operations",
    taskCategories: ["Transfer funds"],
    actions: "write",
    operationType: "Write",
    riskLevel: "Elevated",
    hasPII: false,
    hasFinancialData: true,
    hasPaymentCredentials: false,
    roleAccess: { super_admin: "write", admin: "write" },
  },
  {
    apiName: "treasury_operations",
    displayName: getPermissionDisplayName("treasury_operations"),
    description: "Read access to Treasury financial accounts and transactions",
    productCategory: "Capital & Treasury",
    taskCategories: ["Monitor financials"],
    actions: "read, write",
    operationType: "Read + Write",
    riskLevel: "Elevated",
    hasPII: false,
    hasFinancialData: true,
    hasPaymentCredentials: false,
    roleAccess: { super_admin: "write", admin: "write", view_only: "read", analyst: "read" },
  },
  {
    apiName: "treasury_platform",
    displayName: getPermissionDisplayName("treasury_platform"),
    description: "Individual permission: treasury_platform_write",
    productCategory: "Capital & Treasury",
    taskCategories: ["Configure settings"],
    actions: "write",
    operationType: "Write",
    riskLevel: "Elevated",
    hasPII: false,
    hasFinancialData: true,
    hasPaymentCredentials: false,
    roleAccess: { super_admin: "write", admin: "write", developer: "write" },
  },
  {
    apiName: "user_support",
    displayName: getPermissionDisplayName("user_support"),
    description: "Read access for user support including file links, notes, messages, and file rendering",
    productCategory: "Support & Operations",
    taskCategories: ["Handle customer issues"],
    actions: "read, write",
    operationType: "Read + Write",
    riskLevel: "Standard",
    hasPII: false,
    hasFinancialData: false,
    hasPaymentCredentials: false,
    roleAccess: { super_admin: "write", admin: "write", view_only: "write", developer: "write", support: "write", support_associate: "write", analyst: "write", refund_analyst: "write", issuing_support_agent: "write", iam_admin: "read" },
  },
];
// Helper to get unique values for grouping
export const productCategories = [...new Set(permissions.map((p) => p.productCategory))].sort();
export const taskCategories = [...new Set(permissions.flatMap((p) => p.taskCategories))].sort();

// Group descriptions (used in GroupCard when grouped view is active)
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
    "customer_operations": "View or edit customer personal information",
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

