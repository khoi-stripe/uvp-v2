"use client";

import React, { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { ChevronLeft, X, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import Link from "next/link";

// Types for our visualization
interface UVPEntry {
  uvpName: string;
  actions: string;
  productCategory: string;
  taskCategory: string;
  actionType: string;
  sensitivityLevel: string;
  description: string;
  roleAccess: Record<string, string>;
}

interface NodePosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

// Parse CSV data into our format
const rawCSVData = `UVP/UVB Name,Actions,Product Category,Task Category,Action Type,Sensitivity Level,Description,super_admin,admin,view_only,developer,support,support_associate,analyst,refund_analyst,dispute_analyst,issuing_support_agent,tax_analyst,identity_analyst,iam_admin,sandbox_admin
account_admin_management_operations,write,Account & Connect,Manage team access,Destructive,Non-sensitive,Full administrative account management,write,write,,write,,,,,,,,,,
account_admin_management_operations,write,Account & Connect,Configure settings,Destructive,Non-sensitive,Full administrative account management,write,write,,write,,,,,,,,,,
account_operations,"read, write",Account & Connect,Configure settings,Read + Write,Non-sensitive,Read access to base account details,write,write,read,,write,write,read,read,,,,,,read
account_operations,"read, write",Account & Connect,Monitor platform,Read + Write,Non-sensitive,Read access to base account details,write,write,read,,write,write,read,read,,,,,,read
accounts_kyc_basic,read,Account & Connect,Verify identity,Read-only,Contains PII,Read access to basic KYC fields,read,read,read,,,,,,,,read,,,
accounts_kyc_basic,read,Account & Connect,Handle customer issues,Read-only,Contains PII,Read access to basic KYC fields,read,read,read,,,,,,,,read,,,
application_fee_operations,"read, write",Account & Connect,Monitor platform,Read + Write,Financial data,Application fees for platforms,write,write,read,,write,,write,,,,,,,
application_fee_operations,"read, write",Account & Connect,Export & analyze data,Read + Write,Financial data,Application fees for platforms,write,write,read,,write,,write,,,,,,,
connect_settings,write,Account & Connect,Configure settings,Administrative,Non-sensitive,Manage Connect settings,write,write,,,write,write,,,,,,,,
connect_settings,write,Account & Connect,Monitor platform,Administrative,Non-sensitive,Manage Connect settings,write,write,,,write,write,,,,,,,,
connected_account_operations,"read, write",Account & Connect,Monitor platform,Read + Write,Contains PII,Connected accounts management,write,write,read,write,write,write,read,,,,,,,
connected_account_operations,"read, write",Account & Connect,Handle customer issues,Read + Write,Contains PII,Connected accounts management,write,write,read,write,write,write,read,,,,,,,
embeddable_key_admin,write,Account & Connect,Configure settings,Administrative,Payment credentials,Embeddable keys admin,write,write,,,,,,,,,,,,
embeddable_key_admin,write,Account & Connect,Develop & integrate,Administrative,Payment credentials,Embeddable keys admin,write,write,,,,,,,,,,,,
sandbox_creation,write,Account & Connect,Develop & integrate,Create & update,Non-sensitive,Create sandbox organizations,write,write,,write,,,,,,,,,,write
team_management,"read, write",Account & Connect,Manage team access,Administrative,Non-sensitive,Manage team members and roles,write,write,read,,,,,,,,,,write,
team_management,"read, write",Account & Connect,Configure settings,Administrative,Non-sensitive,Manage team members and roles,write,write,read,,,,,,,,,,write,
sensitive_resources,read,Admin,Develop & integrate,Read-only,Payment credentials,API keys and secrets,read,read,read,read,,,,,,,,,,
sensitive_resources,read,Admin,Configure settings,Read-only,Payment credentials,API keys and secrets,read,read,read,read,,,,,,,,,,
billing_operations,"read, write",Billing & Subscriptions,Manage billing,Read + Write,Financial data,Billing meters and bills,write,write,read,write,,,write,,,,,,,
billing_operations,"read, write",Billing & Subscriptions,Export & analyze data,Read + Write,Financial data,Billing meters and bills,write,write,read,write,,,write,,,,,,,
billing_settings_operations,"read, write",Billing & Subscriptions,Configure settings,Administrative,Non-sensitive,Billing settings and profiles,write,write,read,write,write,write,write,read,read,,,,,
billing_settings_operations,"read, write",Billing & Subscriptions,Manage billing,Administrative,Non-sensitive,Billing settings and profiles,write,write,read,write,write,write,write,read,read,,,,,
credit_note_operations,"read, write",Billing & Subscriptions,Handle customer issues,Read + Write,Financial data,Manage credit notes,write,write,read,write,write,write,write,write,,,,,,
credit_note_operations,"read, write",Billing & Subscriptions,Manage billing,Read + Write,Financial data,Manage credit notes,write,write,read,write,write,write,write,write,,,,,,
invoice_operations,"read, write",Billing & Subscriptions,Handle customer issues,Read + Write,Financial data,Manage invoices and quotes,write,write,read,write,write,write,write,read,read,,,,,
invoice_operations,"read, write",Billing & Subscriptions,Manage billing,Read + Write,Financial data,Manage invoices and quotes,write,write,read,write,write,write,write,read,read,,,,,
invoice_operations,"read, write",Billing & Subscriptions,Export & analyze data,Read + Write,Financial data,Manage invoices and quotes,write,write,read,write,write,write,write,read,read,,,,,
subscription_operations,"read, write",Billing & Subscriptions,Handle customer issues,Read + Write,Financial data,Manage subscriptions,write,write,read,write,write,write,write,read,read,,,,,
subscription_operations,"read, write",Billing & Subscriptions,Manage billing,Read + Write,Financial data,Manage subscriptions,write,write,read,write,write,write,write,read,read,,,,,
capital_operations,"read, write",Capital & Treasury,Monitor financials,Read + Write,Financial data,Capital for Platforms,write,write,read,write,,,write,,,,,,,
capital_operations,"read, write",Capital & Treasury,Export & analyze data,Read + Write,Financial data,Capital for Platforms,write,write,read,write,,,write,,,,,,,
treasury_operations,"read, write",Capital & Treasury,Monitor financials,Read + Write,Financial data,Treasury financial accounts,write,write,read,,,,read,,,,,,,
treasury_operations,"read, write",Capital & Treasury,Export & analyze data,Read + Write,Financial data,Treasury financial accounts,write,write,read,,,,read,,,,,,,
identity_verification_operations,"read, write",Compliance & Identity,Verify identity,Read + Write,Contains PII,Identity verification,write,write,read,write,,,write,,,,,write,,
identity_verification_operations,"read, write",Compliance & Identity,Handle customer issues,Read + Write,Contains PII,Identity verification,write,write,read,write,,,write,,,,,write,,
climate_operations,"read, write",Crypto & Climate,Process transactions,Read + Write,Non-sensitive,Climate orders,write,write,read,write,,,write,,,,,,,
climate_operations,"read, write",Crypto & Climate,Configure settings,Read + Write,Non-sensitive,Climate orders,write,write,read,write,,,write,,,,,,,
crypto_operations,"read, write",Crypto & Climate,Process transactions,Read + Write,Non-sensitive,Crypto financial accounts,write,write,read,write,,,write,,,,,,,
customer_operations,"read, write",Customers,Handle customer issues,Read + Write,Contains PII,Manage customer profiles,write,write,read,write,write,write,write,read,read,,,,,
customer_operations,"read, write",Customers,Export & analyze data,Read + Write,Contains PII,Manage customer profiles,write,write,read,write,write,write,write,read,read,,,,,
customer_portal_operations,write,Customers,Configure settings,Create & update,Non-sensitive,Create customer portals,write,write,,,,,write,,,,,,,
customer_portal_operations,write,Customers,Handle customer issues,Create & update,Non-sensitive,Create customer portals,write,write,,,,,write,,,,,,,
dispute_operations,"read, write",Disputes & Fraud Prevention,Handle customer issues,Read + Write,Non-sensitive,Manage disputes,write,write,read,write,write,write,write,read,write,,,,,
dispute_operations,"read, write",Disputes & Fraud Prevention,Manage disputes & fraud,Read + Write,Non-sensitive,Manage disputes,write,write,read,write,write,write,write,read,write,,,,,
radar_operations,"read, write",Disputes & Fraud Prevention,Configure settings,Read + Write,Non-sensitive,Configure Radar fraud rules,write,write,read,write,read,read,read,read,,,,,,
radar_operations,"read, write",Disputes & Fraud Prevention,Manage disputes & fraud,Read + Write,Non-sensitive,Configure Radar fraud rules,write,write,read,write,read,read,read,read,,,,,,
review_operations,write,Disputes & Fraud Prevention,Handle customer issues,Create & update,Non-sensitive,Action fraud reviews,write,write,,,write,write,write,,,,,,,
review_operations,write,Disputes & Fraud Prevention,Manage disputes & fraud,Create & update,Non-sensitive,Action fraud reviews,write,write,,,write,write,write,,,,,,,
balance_operations,read,Financial Operations,Monitor financials,Read-only,Financial data,View account balances,read,read,read,,read,read,read,read,read,,,,,
balance_operations,read,Financial Operations,Export & analyze data,Read-only,Financial data,View account balances,read,read,read,,read,read,read,read,read,,,,,
balance_transfer_operations,write,Financial Operations,Transfer funds,Destructive,Financial data,Transfer balances (high risk),write,write,,,,,write,,,,,,,
payout_operations,"read, write",Financial Operations,Transfer funds,Read + Write,Financial data,Manage payouts,write,write,read,,,,write,,,,,,,
payout_operations,"read, write",Financial Operations,Monitor financials,Read + Write,Financial data,Manage payouts,write,write,read,,,,write,,,,,,,
transfer_operations,"read, write",Financial Operations,Transfer funds,Read + Write,Financial data,Transfer operations,write,write,read,,,,write,,,,,,,
transfer_operations,"read, write",Financial Operations,Monitor financials,Read + Write,Financial data,Transfer operations,write,write,read,,,,write,,,,,,,
data_export_operations,read,Integrations & Data,Export & analyze data,Read-only,Financial data + PII,Export bulk data,read,read,read,read,,,read,,,,,,,
dev_integration,"read, write",Integrations & Data,Develop & integrate,Read + Write,Non-sensitive,Development tools,write,write,read,write,,,write,,,,,,,
reporting_operations,"read, write",Integrations & Data,Export & analyze data,Read + Write,Financial data,Run and access reports,write,write,"read, write",write,write,write,write,read,,,,,,
reporting_operations,"read, write",Integrations & Data,Monitor financials,Read + Write,Financial data,Run and access reports,write,write,"read, write",write,write,write,write,read,,,,,,
stripe_apps_development,"read, write",Integrations & Data,Develop & integrate,Read + Write,Non-sensitive,Build Stripe Apps,write,write,read,write,,,write,,,,,,,
issuing_card_operations,"read, write",Issuing & Cards,Handle customer issues,Read + Write,Payment credentials,Manage issuing cards,write,write,read,,write,"read, write",write,,,,,,,
issuing_card_operations,"read, write",Issuing & Cards,Manage cards,Read + Write,Payment credentials,Manage issuing cards,write,write,read,,write,"read, write",write,,,,,,,
charge,read,Payments,Handle customer issues,Read-only,Non-sensitive,Charge read access,,,read,,,,,read,read,,,,,
charge,read,Payments,Export & analyze data,Read-only,Non-sensitive,Charge read access,,,read,,,,,read,read,,,,,
charge_operations,write,Payments,Handle customer issues,Create & update,Financial data,Process charges and refunds,write,write,,write,write,write,write,,,,,,,
charge_operations,write,Payments,Process transactions,Create & update,Financial data,Process charges and refunds,write,write,,write,write,write,write,,,,,,,
payment_intent,read,Payments,Handle customer issues,Read-only,Non-sensitive,Payment intent read,,,read,,,,,read,read,,,,,
payment_intent,read,Payments,Export & analyze data,Read-only,Non-sensitive,Payment intent read,,,read,,,,,read,read,,,,,
payment_intent_operations,write,Payments,Handle customer issues,Create & update,Non-sensitive,Manage payment intents,write,write,,write,write,write,write,,,,,,,
payment_intent_operations,write,Payments,Process transactions,Create & update,Non-sensitive,Manage payment intents,write,write,,write,write,write,write,,,,,,,
payment_processing,"read, write",Payments,Process transactions,Read + Write,Payment credentials,Manage payment methods,write,write,read,write,write,write,write,read,read,,,,,
payment_processing,"read, write",Payments,Configure settings,Read + Write,Payment credentials,Manage payment methods,write,write,read,write,write,write,write,read,read,,,,,
checkout_operations,"read, write",Products & Orders,Process transactions,Read + Write,Non-sensitive,Manage checkout,write,write,read,write,write,read,write,,,,,,,
checkout_operations,"read, write",Products & Orders,Configure settings,Read + Write,Non-sensitive,Manage checkout,write,write,read,write,write,read,write,,,,,,,
order_operations,"read, write",Products & Orders,Handle customer issues,Read + Write,Non-sensitive,Manage orders,write,write,read,write,write,write,write,read,read,,,,,
order_operations,"read, write",Products & Orders,Process transactions,Read + Write,Non-sensitive,Manage orders,write,write,read,write,write,write,write,read,read,,,,,
order_refund_operations,write,Products & Orders,Handle customer issues,Create & update,Financial data,Process order refunds,write,write,,,,,write,write,,,,,,
product_operations,"read, write",Products & Orders,Manage catalog,Read + Write,Non-sensitive,Manage products and pricing,write,write,read,,write,read,write,read,read,,,,,
product_operations,"read, write",Products & Orders,Configure settings,Read + Write,Non-sensitive,Manage products and pricing,write,write,read,,write,read,write,read,read,,,,,
promotion_operations,"read, write",Products & Orders,Manage catalog,Read + Write,Non-sensitive,Manage promotions,write,write,read,write,write,write,write,,,,,,,
promotion_operations,"read, write",Products & Orders,Configure settings,Read + Write,Non-sensitive,Manage promotions,write,write,read,write,write,write,write,,,,,,,
dashboard_baseline,read,Support & Operations,All tasks,Read-only,Non-sensitive,Basic Dashboard access (required),read,read,read,read,read,read,read,read,read,read,read,read,read,read
settings_security,write,Support & Operations,Configure settings,Administrative,Payment credentials,Security configuration,,,,,,,,,,,,,write,
settings_security,write,Support & Operations,Manage team access,Administrative,Payment credentials,Security configuration,,,,,,,,,,,,,write,
tax_automation_operations,"read, write",Tax,Configure settings,Read + Write,Non-sensitive,Tax automation rules,write,write,read,write,write,,write,,,,,,,
tax_automation_operations,"read, write",Tax,Monitor tax compliance,Read + Write,Non-sensitive,Tax automation rules,write,write,read,write,write,,write,,,,,,,
tax_filing_operations,"read, write",Tax,Configure settings,Read + Write,Financial data + PII,Tax filing management,write,write,read,read,,,write,,,,,,,
tax_filing_operations,"read, write",Tax,Monitor tax compliance,Read + Write,Financial data + PII,Tax filing management,write,write,read,read,,,write,,,,,,,
terminal_infrastructure,read,Terminal,Monitor hardware,Read-only,Non-sensitive,View terminal infrastructure,read,read,read,,read,read,read,,,,,,,
terminal_operations,write,Terminal,Manage hardware,Create & update,Non-sensitive,Terminal POS operations,write,write,,,,,write,,,,,,,
terminal_operations,write,Terminal,Process transactions,Create & update,Non-sensitive,Terminal POS operations,write,write,,,,,write,,,,,,,`;

const roleNames = [
  "super_admin", "admin", "view_only", "developer", "support",
  "support_associate", "analyst", "refund_analyst", "dispute_analyst",
  "issuing_support_agent", "tax_analyst", "identity_analyst", "iam_admin", "sandbox_admin"
];

const roleDisplayNames: Record<string, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  view_only: "View Only",
  developer: "Developer",
  support: "Support",
  support_associate: "Support Associate",
  analyst: "Analyst",
  refund_analyst: "Refund Analyst",
  dispute_analyst: "Dispute Analyst",
  issuing_support_agent: "Issuing Support",
  tax_analyst: "Tax Analyst",
  identity_analyst: "Identity Analyst",
  iam_admin: "IAM Admin",
  sandbox_admin: "Sandbox Admin"
};

function parseCSV(csv: string): UVPEntry[] {
  const lines = csv.trim().split('\n');
  const headers = lines[0].split(',');
  const entries: UVPEntry[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (const char of lines[i]) {
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());
    
    const roleAccess: Record<string, string> = {};
    roleNames.forEach((role, idx) => {
      const value = values[7 + idx]?.trim();
      if (value) {
        roleAccess[role] = value;
      }
    });
    
    entries.push({
      uvpName: values[0],
      actions: values[1],
      productCategory: values[2],
      taskCategory: values[3],
      actionType: values[4],
      sensitivityLevel: values[5],
      description: values[6],
      roleAccess,
    });
  }
  
  return entries;
}

// Consolidate entries by UVP name (combine role access)
function consolidateEntries(entries: UVPEntry[]): UVPEntry[] {
  const map = new Map<string, UVPEntry>();
  
  for (const entry of entries) {
    const existing = map.get(entry.uvpName);
    if (existing) {
      // Merge role access
      for (const [role, access] of Object.entries(entry.roleAccess)) {
        if (!existing.roleAccess[role]) {
          existing.roleAccess[role] = access;
        }
      }
    } else {
      map.set(entry.uvpName, { ...entry, roleAccess: { ...entry.roleAccess } });
    }
  }
  
  return Array.from(map.values());
}

// Color scheme for action types
const actionTypeColors: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  "Destructive": { bg: "#FEF2F4", border: "#DF1B41", text: "#9C1339", glow: "rgba(223, 27, 65, 0.4)" },
  "Administrative": { bg: "#F7F5FD", border: "#635BFF", text: "#533AFD", glow: "rgba(99, 91, 255, 0.4)" },
  "Read + Write": { bg: "#F0FDF4", border: "#22C55E", text: "#15803D", glow: "rgba(34, 197, 94, 0.4)" },
  "Read-only": { bg: "#EFF6FF", border: "#3B82F6", text: "#1D4ED8", glow: "rgba(59, 130, 246, 0.4)" },
  "Create & update": { bg: "#FFFBEB", border: "#F59E0B", text: "#B45309", glow: "rgba(245, 158, 11, 0.4)" },
};

// Color scheme for roles by category
const roleColors: Record<string, { bg: string; border: string; text: string }> = {
  super_admin: { bg: "#FEF2F4", border: "#DF1B41", text: "#9C1339" },
  admin: { bg: "#FEF2F4", border: "#DF1B41", text: "#9C1339" },
  iam_admin: { bg: "#F7F5FD", border: "#635BFF", text: "#533AFD" },
  developer: { bg: "#ECFDF5", border: "#10B981", text: "#047857" },
  analyst: { bg: "#EFF6FF", border: "#3B82F6", text: "#1D4ED8" },
  dispute_analyst: { bg: "#EFF6FF", border: "#3B82F6", text: "#1D4ED8" },
  refund_analyst: { bg: "#EFF6FF", border: "#3B82F6", text: "#1D4ED8" },
  support: { bg: "#FEF3C7", border: "#F59E0B", text: "#B45309" },
  support_associate: { bg: "#FEF3C7", border: "#F59E0B", text: "#B45309" },
  view_only: { bg: "#F5F6F8", border: "#9CA3AF", text: "#4B5563" },
  issuing_support_agent: { bg: "#F0FDFA", border: "#14B8A6", text: "#0F766E" },
  tax_analyst: { bg: "#FDF4FF", border: "#A855F7", text: "#7E22CE" },
  identity_analyst: { bg: "#FDF4FF", border: "#A855F7", text: "#7E22CE" },
  sandbox_admin: { bg: "#ECFDF5", border: "#10B981", text: "#047857" },
};

function toDisplayName(apiName: string): string {
  return apiName
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

type SelectionType = "actionType" | "uvp" | "role" | null;

export default function PermissionsMapPage() {
  const [selection, setSelection] = useState<{ type: SelectionType; id: string } | null>(null);
  const [hoverItem, setHoverItem] = useState<{ type: SelectionType; id: string } | null>(null);
  const [zoom, setZoom] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  
  const entries = useMemo(() => parseCSV(rawCSVData), []);
  const consolidatedEntries = useMemo(() => consolidateEntries(entries), [entries]);
  
  // Get unique action types
  const actionTypes = useMemo(() => {
    return [...new Set(entries.map(e => e.actionType))].sort();
  }, [entries]);
  
  // Get unique UVPs
  const uvps = useMemo(() => {
    return consolidatedEntries.map(e => e.uvpName).sort();
  }, [consolidatedEntries]);
  
  // Build relationships
  const relationships = useMemo(() => {
    const actionTypeToUVPs = new Map<string, Set<string>>();
    const uvpToRoles = new Map<string, Set<string>>();
    const uvpToActionTypes = new Map<string, Set<string>>();
    const roleToUVPs = new Map<string, Set<string>>();
    
    for (const entry of entries) {
      // Action Type -> UVP
      if (!actionTypeToUVPs.has(entry.actionType)) {
        actionTypeToUVPs.set(entry.actionType, new Set());
      }
      actionTypeToUVPs.get(entry.actionType)!.add(entry.uvpName);
      
      // UVP -> Action Type
      if (!uvpToActionTypes.has(entry.uvpName)) {
        uvpToActionTypes.set(entry.uvpName, new Set());
      }
      uvpToActionTypes.get(entry.uvpName)!.add(entry.actionType);
    }
    
    for (const entry of consolidatedEntries) {
      // UVP -> Roles
      if (!uvpToRoles.has(entry.uvpName)) {
        uvpToRoles.set(entry.uvpName, new Set());
      }
      for (const role of Object.keys(entry.roleAccess)) {
        uvpToRoles.get(entry.uvpName)!.add(role);
      }
      
      // Role -> UVPs
      for (const role of Object.keys(entry.roleAccess)) {
        if (!roleToUVPs.has(role)) {
          roleToUVPs.set(role, new Set());
        }
        roleToUVPs.get(role)!.add(entry.uvpName);
      }
    }
    
    return { actionTypeToUVPs, uvpToRoles, uvpToActionTypes, roleToUVPs };
  }, [entries, consolidatedEntries]);
  
  // Determine highlighted items based on selection or hover
  const highlighted = useMemo(() => {
    const activeItem = hoverItem || selection;
    if (!activeItem) return { actionTypes: new Set<string>(), uvps: new Set<string>(), roles: new Set<string>() };
    
    const highlightedActionTypes = new Set<string>();
    const highlightedUVPs = new Set<string>();
    const highlightedRoles = new Set<string>();
    
    if (activeItem.type === "actionType") {
      highlightedActionTypes.add(activeItem.id);
      const uvpsForAction = relationships.actionTypeToUVPs.get(activeItem.id) || new Set();
      uvpsForAction.forEach(uvp => {
        highlightedUVPs.add(uvp);
        const rolesForUVP = relationships.uvpToRoles.get(uvp) || new Set();
        rolesForUVP.forEach(role => highlightedRoles.add(role));
      });
    } else if (activeItem.type === "uvp") {
      highlightedUVPs.add(activeItem.id);
      const actionsForUVP = relationships.uvpToActionTypes.get(activeItem.id) || new Set();
      actionsForUVP.forEach(action => highlightedActionTypes.add(action));
      const rolesForUVP = relationships.uvpToRoles.get(activeItem.id) || new Set();
      rolesForUVP.forEach(role => highlightedRoles.add(role));
    } else if (activeItem.type === "role") {
      highlightedRoles.add(activeItem.id);
      const uvpsForRole = relationships.roleToUVPs.get(activeItem.id) || new Set();
      uvpsForRole.forEach(uvp => {
        highlightedUVPs.add(uvp);
        const actionsForUVP = relationships.uvpToActionTypes.get(uvp) || new Set();
        actionsForUVP.forEach(action => highlightedActionTypes.add(action));
      });
    }
    
    return { actionTypes: highlightedActionTypes, uvps: highlightedUVPs, roles: highlightedRoles };
  }, [hoverItem, selection, relationships]);
  
  const isHighlighted = useCallback((type: SelectionType, id: string) => {
    if (!hoverItem && !selection) return true;
    if (type === "actionType") return highlighted.actionTypes.has(id);
    if (type === "uvp") return highlighted.uvps.has(id);
    if (type === "role") return highlighted.roles.has(id);
    return false;
  }, [highlighted, hoverItem, selection]);
  
  const handleClick = useCallback((type: SelectionType, id: string) => {
    if (selection?.type === type && selection?.id === id) {
      setSelection(null);
    } else {
      setSelection({ type, id });
    }
  }, [selection]);
  
  const handleMouseEnter = useCallback((type: SelectionType, id: string) => {
    setHoverItem({ type, id });
  }, []);
  
  const handleMouseLeave = useCallback(() => {
    setHoverItem(null);
  }, []);
  
  // Pan and zoom handlers
  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      setZoom(z => Math.max(0.3, Math.min(2, z + delta)));
    } else {
      setPanOffset(p => ({
        x: p.x - e.deltaX,
        y: p.y - e.deltaY
      }));
    }
  }, []);
  
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.altKey)) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
    }
  }, [panOffset]);
  
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging) {
      setPanOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  }, [isDragging, dragStart]);
  
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);
  
  const resetView = useCallback(() => {
    setZoom(1);
    setPanOffset({ x: 0, y: 0 });
    setSelection(null);
  }, []);
  
  // Get details for selected item
  const selectedDetails = useMemo(() => {
    if (!selection) return null;
    
    if (selection.type === "actionType") {
      const uvpsWithThisType = relationships.actionTypeToUVPs.get(selection.id) || new Set();
      const rolesSet = new Set<string>();
      uvpsWithThisType.forEach(uvp => {
        const roles = relationships.uvpToRoles.get(uvp) || new Set();
        roles.forEach(r => rolesSet.add(r));
      });
      return {
        title: selection.id,
        subtitle: "Action Type",
        uvpCount: uvpsWithThisType.size,
        roleCount: rolesSet.size,
        uvps: Array.from(uvpsWithThisType).sort(),
        roles: Array.from(rolesSet).sort((a, b) => roleDisplayNames[a].localeCompare(roleDisplayNames[b])),
      };
    } else if (selection.type === "uvp") {
      const entry = consolidatedEntries.find(e => e.uvpName === selection.id);
      const actions = relationships.uvpToActionTypes.get(selection.id) || new Set();
      const roles = relationships.uvpToRoles.get(selection.id) || new Set();
      return {
        title: toDisplayName(selection.id),
        subtitle: entry?.description || "Permission",
        actionTypes: Array.from(actions),
        roleCount: roles.size,
        roles: Array.from(roles).sort((a, b) => roleDisplayNames[a].localeCompare(roleDisplayNames[b])),
        productCategory: entry?.productCategory,
        sensitivityLevel: entry?.sensitivityLevel,
        roleAccess: entry?.roleAccess,
      };
    } else if (selection.type === "role") {
      const uvpsForRole = relationships.roleToUVPs.get(selection.id) || new Set();
      const actionsSet = new Set<string>();
      uvpsForRole.forEach(uvp => {
        const actions = relationships.uvpToActionTypes.get(uvp) || new Set();
        actions.forEach(a => actionsSet.add(a));
      });
      return {
        title: roleDisplayNames[selection.id],
        subtitle: "Role",
        uvpCount: uvpsForRole.size,
        actionTypeCount: actionsSet.size,
        uvps: Array.from(uvpsForRole).sort(),
        actionTypes: Array.from(actionsSet),
      };
    }
    return null;
  }, [selection, relationships, consolidatedEntries]);

  return (
    <div className="h-screen flex flex-col bg-[#0A0F1A] text-white overflow-hidden">
      {/* Header */}
      <header className="flex items-center gap-4 px-6 py-4 border-b border-white/10 bg-[#0D1321]/80 backdrop-blur-sm flex-shrink-0 z-20">
        <Link 
          href="/"
          className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="text-sm">Back</span>
        </Link>
        <div className="w-px h-5 bg-white/20" />
        <h1 className="text-lg font-semibold tracking-tight">
          Permissions Architecture Map
        </h1>
        <div className="flex-1" />
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setZoom(z => Math.max(0.3, z - 0.1))}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-sm text-white/60 min-w-[50px] text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button 
            onClick={() => setZoom(z => Math.min(2, z + 0.1))}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button 
            onClick={resetView}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </header>
      
      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Map area */}
        <div 
          ref={containerRef}
          className="flex-1 overflow-hidden relative"
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{ cursor: isDragging ? 'grabbing' : 'default' }}
        >
          {/* Grid background */}
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px',
              transform: `translate(${panOffset.x % 40}px, ${panOffset.y % 40}px)`,
            }}
          />
          
          {/* Zoomable/pannable content */}
          <div 
            className="absolute inset-0 flex items-center justify-center"
            style={{
              transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoom})`,
              transformOrigin: 'center center',
            }}
          >
            {/* Three column layout */}
            <div className="flex gap-12 items-start py-8">
              {/* Column 1: Action Types */}
              <div className="flex flex-col gap-3 min-w-[180px]">
                <div className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2 px-2">
                  Action Types
                </div>
                {actionTypes.map(actionType => {
                  const colors = actionTypeColors[actionType] || actionTypeColors["Read + Write"];
                  const isActive = isHighlighted("actionType", actionType);
                  const isSelected = selection?.type === "actionType" && selection?.id === actionType;
                  const count = relationships.actionTypeToUVPs.get(actionType)?.size || 0;
                  
                  return (
                    <button
                      key={actionType}
                      onClick={() => handleClick("actionType", actionType)}
                      onMouseEnter={() => handleMouseEnter("actionType", actionType)}
                      onMouseLeave={handleMouseLeave}
                      className={`
                        relative px-4 py-3 rounded-xl text-left transition-all duration-200
                        ${isActive ? 'opacity-100' : 'opacity-30'}
                        ${isSelected ? 'ring-2 ring-white/50' : ''}
                      `}
                      style={{
                        backgroundColor: colors.bg,
                        borderWidth: 2,
                        borderColor: colors.border,
                        boxShadow: isSelected ? `0 0 20px ${colors.glow}` : 'none',
                      }}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-medium text-sm" style={{ color: colors.text }}>
                          {actionType}
                        </span>
                        <span 
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: colors.border + '20', color: colors.text }}
                        >
                          {count}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
              
              {/* Column 2: UVPs */}
              <div className="flex flex-col gap-1.5 min-w-[280px] max-h-[800px] overflow-y-auto px-2 py-1 scrollbar-thin">
                <div className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2 px-2 sticky top-0 bg-[#0A0F1A] py-2">
                  UVPs ({uvps.length})
                </div>
                {uvps.map(uvp => {
                  const entry = consolidatedEntries.find(e => e.uvpName === uvp);
                  const actionTypes = relationships.uvpToActionTypes.get(uvp);
                  const primaryAction = actionTypes ? Array.from(actionTypes)[0] : "Read + Write";
                  const colors = actionTypeColors[primaryAction] || actionTypeColors["Read + Write"];
                  const isActive = isHighlighted("uvp", uvp);
                  const isSelected = selection?.type === "uvp" && selection?.id === uvp;
                  const roleCount = relationships.uvpToRoles.get(uvp)?.size || 0;
                  
                  return (
                    <button
                      key={uvp}
                      onClick={() => handleClick("uvp", uvp)}
                      onMouseEnter={() => handleMouseEnter("uvp", uvp)}
                      onMouseLeave={handleMouseLeave}
                      className={`
                        relative px-3 py-2 rounded-lg text-left transition-all duration-200
                        bg-white/5 hover:bg-white/10 border border-white/10
                        ${isActive ? 'opacity-100' : 'opacity-20'}
                        ${isSelected ? 'ring-2 ring-white/50 bg-white/15' : ''}
                      `}
                    >
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: colors.border }}
                        />
                        <span className="text-xs font-mono text-white/90 truncate flex-1">
                          {uvp}
                        </span>
                        <span className="text-[10px] text-white/40">
                          {roleCount} roles
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
              
              {/* Column 3: Roles */}
              <div className="flex flex-col gap-3 min-w-[160px]">
                <div className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2 px-2">
                  Roles
                </div>
                {roleNames.map(role => {
                  const colors = roleColors[role];
                  const isActive = isHighlighted("role", role);
                  const isSelected = selection?.type === "role" && selection?.id === role;
                  const count = relationships.roleToUVPs.get(role)?.size || 0;
                  
                  return (
                    <button
                      key={role}
                      onClick={() => handleClick("role", role)}
                      onMouseEnter={() => handleMouseEnter("role", role)}
                      onMouseLeave={handleMouseLeave}
                      className={`
                        relative px-4 py-3 rounded-xl text-left transition-all duration-200
                        ${isActive ? 'opacity-100' : 'opacity-30'}
                        ${isSelected ? 'ring-2 ring-white/50' : ''}
                      `}
                      style={{
                        backgroundColor: colors.bg,
                        borderWidth: 2,
                        borderColor: colors.border,
                        boxShadow: isSelected ? `0 0 20px ${colors.border}40` : 'none',
                      }}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-medium text-sm" style={{ color: colors.text }}>
                          {roleDisplayNames[role]}
                        </span>
                        <span 
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: colors.border + '20', color: colors.text }}
                        >
                          {count}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          
          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-[#0D1321]/90 backdrop-blur-sm rounded-xl border border-white/10 p-4 z-10">
            <div className="text-xs font-semibold text-white/60 mb-3">Action Types</div>
            <div className="flex flex-col gap-2">
              {Object.entries(actionTypeColors).map(([type, colors]) => (
                <div key={type} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full border-2"
                    style={{ borderColor: colors.border, backgroundColor: colors.bg }}
                  />
                  <span className="text-xs text-white/70">{type}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Instructions */}
          <div className="absolute bottom-4 right-4 bg-[#0D1321]/90 backdrop-blur-sm rounded-xl border border-white/10 p-4 z-10 max-w-[200px]">
            <div className="text-xs text-white/40 leading-relaxed">
              <p>• Click to select and see details</p>
              <p>• Hover to preview connections</p>
              <p>• Scroll to pan, Ctrl+scroll to zoom</p>
            </div>
          </div>
        </div>
        
        {/* Details panel */}
        {selectedDetails && (
          <div className="w-[360px] bg-[#0D1321] border-l border-white/10 overflow-y-auto flex-shrink-0">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-semibold text-white truncate">
                    {selectedDetails.title}
                  </h2>
                  <p className="text-sm text-white/50 mt-1">
                    {selectedDetails.subtitle}
                  </p>
                </div>
                <button 
                  onClick={() => setSelection(null)}
                  className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="w-4 h-4 text-white/60" />
                </button>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {'uvpCount' in selectedDetails && (
                  <div className="bg-white/5 rounded-lg p-3">
                    <div className="text-2xl font-bold text-white">
                      {selectedDetails.uvpCount}
                    </div>
                    <div className="text-xs text-white/50">UVPs</div>
                  </div>
                )}
                {'roleCount' in selectedDetails && (
                  <div className="bg-white/5 rounded-lg p-3">
                    <div className="text-2xl font-bold text-white">
                      {selectedDetails.roleCount}
                    </div>
                    <div className="text-xs text-white/50">Roles</div>
                  </div>
                )}
                {'actionTypeCount' in selectedDetails && (
                  <div className="bg-white/5 rounded-lg p-3">
                    <div className="text-2xl font-bold text-white">
                      {selectedDetails.actionTypeCount}
                    </div>
                    <div className="text-xs text-white/50">Action Types</div>
                  </div>
                )}
              </div>
              
              {/* Product Category */}
              {'productCategory' in selectedDetails && selectedDetails.productCategory && (
                <div className="mb-4">
                  <div className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">
                    Product Category
                  </div>
                  <div className="text-sm text-white/90">
                    {selectedDetails.productCategory}
                  </div>
                </div>
              )}
              
              {/* Sensitivity */}
              {'sensitivityLevel' in selectedDetails && selectedDetails.sensitivityLevel && (
                <div className="mb-4">
                  <div className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">
                    Sensitivity Level
                  </div>
                  <div className="text-sm text-white/90">
                    {selectedDetails.sensitivityLevel}
                  </div>
                </div>
              )}
              
              {/* Action Types */}
              {'actionTypes' in selectedDetails && selectedDetails.actionTypes && (
                <div className="mb-4">
                  <div className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">
                    Action Types
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedDetails.actionTypes.map(action => {
                      const colors = actionTypeColors[action] || actionTypeColors["Read + Write"];
                      return (
                        <span 
                          key={action}
                          className="px-2 py-1 rounded text-xs font-medium"
                          style={{ backgroundColor: colors.bg, color: colors.text, border: `1px solid ${colors.border}` }}
                        >
                          {action}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
              
              {/* Roles with access */}
              {'roles' in selectedDetails && selectedDetails.roles && (
                <div className="mb-4">
                  <div className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">
                    Roles with Access
                  </div>
                  <div className="flex flex-col gap-1.5 max-h-[200px] overflow-y-auto">
                    {selectedDetails.roles.map(role => {
                      const colors = roleColors[role];
                      const access = 'roleAccess' in selectedDetails && selectedDetails.roleAccess 
                        ? selectedDetails.roleAccess[role] 
                        : undefined;
                      return (
                        <div 
                          key={role}
                          className="flex items-center justify-between px-2 py-1.5 rounded-lg"
                          style={{ backgroundColor: colors.bg + '40' }}
                        >
                          <span className="text-xs font-medium" style={{ color: colors.text }}>
                            {roleDisplayNames[role]}
                          </span>
                          {access && (
                            <span className="text-[10px] text-white/40">
                              {access}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              
              {/* UVPs list */}
              {'uvps' in selectedDetails && selectedDetails.uvps && (
                <div>
                  <div className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">
                    Associated UVPs
                  </div>
                  <div className="flex flex-col gap-1 max-h-[300px] overflow-y-auto">
                    {selectedDetails.uvps.slice(0, 50).map(uvp => (
                      <button
                        key={uvp}
                        onClick={() => handleClick("uvp", uvp)}
                        className="text-left px-2 py-1.5 rounded bg-white/5 hover:bg-white/10 transition-colors"
                      >
                        <span className="text-xs font-mono text-white/70">{uvp}</span>
                      </button>
                    ))}
                    {selectedDetails.uvps.length > 50 && (
                      <div className="text-xs text-white/40 px-2 py-1">
                        +{selectedDetails.uvps.length - 50} more...
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
