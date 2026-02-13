"use client";

import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { ChevronDown } from "lucide-react";
import {
  roleCategories,
  getPermissionsForRole,
  groupPermissions,
  getAllPermissions,
  GROUP_DESCRIPTIONS,
  type Role,
  type Permission,
} from "@/lib/data";

// ===== Hook: usePopover =====
export function usePopover() {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const open = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsClosing(false);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsClosing(true);
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 100);
  }, []);

  const toggle = useCallback(() => {
    if (isOpen && !isClosing) close();
    else open();
  }, [isOpen, isClosing, open, close]);

  useEffect(() => {
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, []);

  const isVisible = isOpen;
  const animationClass = isClosing ? "animate-popover-out" : "animate-popover-in";

  return { isVisible, animationClass, open, close, toggle };
}

// ===== Types =====
export type GroupByOption = "alphabetical" | "productCategory" | "taskCategory" | "operationType" | "riskLevel" | "sensitivity";

// ===== Constants =====
const groupByOptions: { value: GroupByOption; label: string }[] = [
  { value: "productCategory", label: "Product" },
  { value: "taskCategory", label: "Task" },
  { value: "operationType", label: "Operation" },
  { value: "riskLevel", label: "Risk" },
  { value: "sensitivity", label: "Sensitivity" },
  { value: "alphabetical", label: "Alphabetical" },
];

export const groupedGroupByOptions: { value: GroupByOption; label: string }[] = [
  { value: "productCategory", label: "Product" },
  { value: "taskCategory", label: "Task" },
  { value: "operationType", label: "Operation" },
  { value: "riskLevel", label: "Risk" },
  { value: "sensitivity", label: "Sensitivity" },
];

export const ungroupedGroupByOptions = groupByOptions;

const accessOptions: { value: string; label: string }[] = [
  { value: "read", label: "Read" },
  { value: "write", label: "Write" },
  { value: "read, write", label: "Read/Write" },
];

// ===== Icons =====
export function SearchIcon({ className }: { className?: string }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path fillRule="evenodd" clipRule="evenodd" d="M7.88334 9.08539C7.06854 9.6615 6.0738 10 5 10C2.23858 10 0 7.76142 0 5C0 2.23858 2.23858 0 5 0C7.76142 0 10 2.23858 10 5C10 6.07379 9.66151 7.06852 9.08542 7.88331L11.7511 10.549C11.9187 10.7166 12.0017 10.9368 12 11.1564C11.9984 11.3718 11.9154 11.5867 11.7511 11.751C11.5847 11.9174 11.3665 12.0004 11.1485 12C10.9315 11.9996 10.7146 11.9166 10.549 11.751L7.88334 9.08539ZM8.3 5C8.3 6.82254 6.82254 8.3 5 8.3C3.17746 8.3 1.7 6.82254 1.7 5C1.7 3.17746 3.17746 1.7 5 1.7C6.82254 1.7 8.3 3.17746 8.3 5Z" fill="currentColor"/>
    </svg>
  );
}

export function ShieldCheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11.358 6.18917C11.6005 5.85338 11.5249 5.38456 11.1891 5.14205C10.8533 4.89953 10.3845 4.97514 10.142 5.31094L7.43596 9.05776L5.80748 7.24833C5.53038 6.94045 5.05617 6.91549 4.74828 7.19258C4.4404 7.46968 4.41544 7.9439 4.69254 8.25178L6.94254 10.7518C7.09418 10.9203 7.31388 11.0111 7.54024 10.999C7.76659 10.9868 7.9753 10.8729 8.10802 10.6892L11.358 6.18917Z" fill="currentColor"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M4.82822 14.2188L7.08401 15.7227C7.35528 15.9035 7.67401 16 8.00003 16C8.32606 16 8.64479 15.9035 8.91606 15.7227L11.1718 14.2188C13.267 12.822 14.5822 10.5203 14.7219 8.00617L14.9707 3.52775C14.9866 3.24115 14.7588 2.9985 14.4766 2.94568C12.7465 2.62173 9.96846 0.936793 8.91934 0.271047C8.64407 0.096362 8.32606 0 8.00003 0C7.67401 0 7.356 0.0963626 7.08072 0.271048C6.03161 0.936798 3.25355 2.62174 1.52342 2.94568C1.24128 2.99851 1.01343 3.24115 1.02935 3.52775L1.27815 8.00617C1.41783 10.5203 2.73308 12.822 4.82822 14.2188ZM2.77584 7.92296L2.57044 4.22569C3.47509 3.94652 4.43732 3.49215 5.25264 3.06572C6.34631 2.49371 7.34214 1.88169 7.88443 1.53756C7.92989 1.50871 7.97084 1.5 8.00003 1.5C8.02923 1.5 8.07017 1.50871 8.11564 1.53756C8.65793 1.88169 9.65376 2.4937 10.7474 3.06571C11.5628 3.49215 12.525 3.94651 13.4296 4.22569L13.2242 7.92296C13.1107 9.96573 12.0421 11.8359 10.3398 12.9707L8.084 14.4746C8.05914 14.4912 8.02992 14.5 8.00003 14.5C7.97015 14.5 7.94093 14.4912 7.91606 14.4746L5.66027 12.9707C3.95797 11.8359 2.88933 9.96573 2.77584 7.92296Z" fill="currentColor"/>
    </svg>
  );
}

export function ControlIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M11.5 8C13.433 8 15 9.567 15 11.5C15 13.433 13.433 15 11.5 15C9.82456 15 8.42548 13.8224 8.08203 12.25H2.625C2.21079 12.25 1.875 11.9142 1.875 11.5C1.875 11.0858 2.21079 10.75 2.625 10.75H8.08203C8.42548 9.17757 9.82456 8.00001 11.5 8ZM11.5 9.5C10.3954 9.50001 9.5 10.3954 9.5 11.5C9.5 12.6046 10.3954 13.5 11.5 13.5C12.6046 13.5 13.5 12.6046 13.5 11.5C13.5 10.3954 12.6046 9.5 11.5 9.5Z" fill="currentColor"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M4.5 1C6.17545 1 7.57452 2.17756 7.91797 3.75H13.375C13.7892 3.75 14.125 4.08579 14.125 4.5C14.125 4.91421 13.7892 5.25 13.375 5.25H7.91797C7.57452 6.82244 6.17545 8 4.5 8C2.567 8 1 6.433 1 4.5C1 2.567 2.567 1 4.5 1ZM4.5 2.5C3.39543 2.5 2.5 3.39543 2.5 4.5C2.5 5.60457 3.39543 6.5 4.5 6.5C5.60457 6.5 6.5 5.60457 6.5 4.5C6.5 3.39543 5.60457 2.5 4.5 2.5Z" fill="currentColor"/>
    </svg>
  );
}

function CheckCircleFilledIcon({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM12.2803 6.28027C12.5732 5.98738 12.5732 5.51251 12.2803 5.21961C11.9874 4.92672 11.5125 4.92672 11.2196 5.21961L6.99994 9.43928L5.03027 7.46961C4.73738 7.17672 4.26251 7.17672 3.96961 7.46961C3.67672 7.76251 3.67672 8.23738 3.96961 8.53027L6.46961 11.0303C6.76251 11.3232 7.23738 11.3232 7.53027 11.0303L12.2803 6.28027Z" fill="#474E5A"/>
    </svg>
  );
}

function ArrowUpDownIcon({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3.5 7.5L6 10L8.5 7.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3.5 4.5L6 2L8.5 4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function OrgIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M0 2.75C0 1.23122 1.23122 0 2.75 0H8C9.51878 0 10.75 1.23122 10.75 2.75V3C10.75 3.41421 10.4142 3.75 10 3.75C9.58579 3.75 9.25 3.41421 9.25 3V2.75C9.25 2.05964 8.69036 1.5 8 1.5H2.75C2.05964 1.5 1.5 2.05964 1.5 2.75V14.25C1.5 14.3881 1.61193 14.5 1.75 14.5H4.25C4.66421 14.5 5 14.8358 5 15.25C5 15.6642 4.66421 16 4.25 16H1.75C0.783502 16 0 15.2165 0 14.25V2.75ZM10.8525 5.864C11.0957 5.712 11.4043 5.712 11.6475 5.864L15.6475 8.364C15.8668 8.50105 16 8.74141 16 9V14.25C16 15.2165 15.2165 16 14.25 16H8.25C7.2835 16 6.5 15.2165 6.5 14.25V9C6.5 8.74141 6.63321 8.50105 6.8525 8.364L10.8525 5.864ZM8 9.41569V14.25C8 14.3881 8.11193 14.5 8.25 14.5H10.5V13C10.5 12.5858 10.8358 12.25 11.25 12.25C11.6642 12.25 12 12.5858 12 13V14.5H14.25C14.3881 14.5 14.5 14.3881 14.5 14.25V9.41569L11.25 7.38444L8 9.41569Z" fill="#6C7688"/>
      <path d="M3 4.5C3 3.94772 3.44772 3.5 4 3.5C4.55228 3.5 5 3.94772 5 4.5C5 5.05228 4.55228 5.5 4 5.5C3.44772 5.5 3 5.05228 3 4.5Z" fill="#6C7688"/>
      <path d="M3 8C3 7.44772 3.44772 7 4 7C4.55228 7 5 7.44772 5 8C5 8.55228 4.55228 9 4 9C3.44772 9 3 8.55228 3 8Z" fill="#6C7688"/>
      <path d="M6 4.5C6 3.94772 6.44772 3.5 7 3.5C7.55228 3.5 8 3.94772 8 4.5C8 5.05228 7.55228 5.5 7 5.5C6.44772 5.5 6 5.05228 6 4.5Z" fill="#6C7688"/>
      <path d="M3 11.5C3 10.9477 3.44772 10.5 4 10.5C4.55228 10.5 5 10.9477 5 11.5C5 12.0523 4.55228 12.5 4 12.5C3.44772 12.5 3 12.0523 3 11.5Z" fill="#6C7688"/>
    </svg>
  );
}

// ===== Small reusable components =====
export function Checkbox({ 
  checked, 
  onChange,
  className = "",
  disabled = false,
  indeterminate = false,
}: { 
  checked: boolean; 
  onChange: () => void;
  className?: string;
  disabled?: boolean;
  indeterminate?: boolean;
}) {
  const isFilled = checked || indeterminate;
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        if (!disabled) onChange();
      }}
      disabled={disabled}
      className={`relative shrink-0 w-[14px] h-[14px] rounded-[4px] transition-all flex items-center justify-center ${className} ${disabled ? 'cursor-not-allowed' : ''}`}
      style={{
        backgroundColor: disabled ? '#EBEEF1' : isFilled ? '#675DFF' : 'white',
        border: disabled ? '1px solid #D8DEE4' : isFilled ? '1px solid #675DFF' : '1px solid #D8DEE4',
        boxShadow: disabled ? 'none' : isFilled 
          ? '0px 1px 1px 0px rgba(10, 33, 86, 0.16)' 
          : '0px 1px 1px 0px rgba(33, 37, 44, 0.16)',
      }}
    >
      {indeterminate ? (
        <svg width="8" height="2" viewBox="0 0 8 2" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 1H7" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      ) : checked ? (
        <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ) : null}
    </button>
  );
}

export function Tooltip({ children, content, position: pos = "below" }: { children: React.ReactNode; content: string; position?: "above" | "below" }) {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLSpanElement>(null);
  
  const handleMouseEnter = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      if (pos === "above") {
        setTooltipPosition({ top: rect.top - 8, left: rect.left + rect.width / 2 });
      } else {
        setTooltipPosition({ top: rect.bottom + 8, left: rect.left + rect.width / 2 });
      }
    }
    setIsVisible(true);
  };
  
  return (
    <span ref={triggerRef} className="inline-flex items-center" onMouseEnter={handleMouseEnter} onMouseLeave={() => setIsVisible(false)}>
      {children}
      {isVisible && (
        <div 
          className={`fixed z-[9999] px-4 py-3 bg-white border border-[#D8DEE4] rounded-lg shadow-[0px_2px_5px_rgba(64,68,82,0.08),0px_3px_9px_rgba(64,68,82,0.08)] whitespace-nowrap -translate-x-1/2 ${pos === "above" ? "-translate-y-full" : ""}`}
          style={{ top: tooltipPosition.top, left: tooltipPosition.left }}
        >
          <p className="text-[13px] text-[#353A44] leading-[19px] tracking-[-0.15px]" style={{ fontFeatureSettings: "'lnum', 'pnum'" }}>{content}</p>
        </div>
      )}
    </span>
  );
}

export function ToggleSwitch({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <button type="button" role="switch" aria-checked={checked} onClick={() => onChange(!checked)} className="flex items-center gap-1.5 group">
      <div className={`relative w-[26px] h-[14px] rounded-full transition-colors duration-200 ${checked ? "bg-[#635BFF]" : "bg-[#C0C8D2]"}`}>
        <div className={`absolute top-[2px] w-[10px] h-[10px] rounded-full bg-white shadow-[0_1px_2px_rgba(0,0,0,0.2)] transition-transform duration-200 ${checked ? "translate-x-[14px]" : "translate-x-[2px]"}`} />
      </div>
      {label && <span className="text-[12px] font-medium text-[#596171] leading-4 select-none group-hover:text-[#353A44] transition-colors">{label}</span>}
    </button>
  );
}

// ===== Permission Components =====
export function getAccessLabel(actions: string): { label: string; hasWrite: boolean } {
  const lower = actions.toLowerCase();
  if (lower.includes('write') && lower.includes('read')) return { label: 'Read/Write', hasWrite: true };
  if (lower.includes('write')) return { label: 'Write', hasWrite: true };
  return { label: 'Read', hasWrite: false };
}

export function PermissionCardContent({
  permission,
  showTaskCategories = false,
  currentGroup,
  groupBy,
  insideGroup = false,
  isInactive = false,
}: {
  permission: Permission;
  showTaskCategories?: boolean;
  currentGroup?: string;
  groupBy?: string;
  insideGroup?: boolean;
  isInactive?: boolean;
}) {
  const getOtherGroups = (): string[] => {
    if (!currentGroup || !groupBy) return [];
    if (groupBy === "taskCategory") return permission.taskCategories.filter(tc => tc !== currentGroup);
    return [];
  };
  const otherGroups = getOtherGroups();

  return (
    <div className={`flex-1 min-w-0 flex flex-col ${insideGroup ? "gap-0.5" : "gap-2"}`}>
      <div className="flex flex-col">
        <h4 className="font-semibold text-[#353A44] text-[13px] leading-[19px] tracking-[-0.15px]">{permission.displayName}</h4>
        <p className="text-[13px] text-[#596171] leading-[19px]">{permission.description}</p>
      </div>
      {showTaskCategories && permission.taskCategories.length > 0 && (
        <p className="text-[12px] text-[#596171] leading-4">Task: {permission.taskCategories.join(', ')}</p>
      )}
      {otherGroups.length > 0 && (
        <p className="text-[12px] text-[#596171] leading-4">Also in: {otherGroups.join(', ')}</p>
      )}
    </div>
  );
}

function AccessSelector({
  value,
  onChange,
  disabled = false,
  showPlaceholder = false,
}: {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  showPlaceholder?: boolean;
}) {
  const popover = usePopover();
  const hasValue = value && !showPlaceholder;
  const { label, hasWrite } = hasValue ? getAccessLabel(value) : { label: "Choose", hasWrite: false };

  return (
    <div className="relative">
      <button
        onClick={(e) => { e.stopPropagation(); if (!disabled) popover.toggle(); }}
        className={`flex items-center gap-1 text-[12px] font-medium px-2 py-0.5 rounded flex-shrink-0 transition-colors ${
          showPlaceholder ? "bg-[#F5F6F8] text-[#596171] border border-dashed border-[#D8DEE4] hover:bg-[#EBEEF1]"
            : hasWrite ? "bg-[#D3F8DF] text-[#1D7C4D] hover:bg-[#C0F0D0]"
            : "bg-[#D4E5FF] text-[#0055BC] hover:bg-[#C4D8F8]"
        } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      >
        <span>{label}</span>
        {!disabled && <ArrowUpDownIcon size={10} />}
      </button>
      {popover.isVisible && (
        <>
          <div className="fixed inset-0 z-10" onClick={(e) => { e.stopPropagation(); popover.close(); }} />
          <div className={`absolute top-full right-0 mt-1 bg-white border border-[#D8DEE4] rounded-[8px] shadow-[0_15px_35px_rgba(48,49,61,0.08),0_5px_15px_rgba(0,0,0,0.12)] z-20 min-w-[100px] p-1 overflow-hidden ${popover.animationClass}`}>
            {accessOptions.map((option) => (
              <button
                key={option.value}
                onClick={(e) => { e.stopPropagation(); onChange(option.value); popover.close(); }}
                className={`w-full flex items-center justify-between gap-2 px-2.5 py-1.5 text-[12px] leading-4 text-[#353A44] rounded transition-colors ${
                  value === option.value && !showPlaceholder ? "bg-[#F5F6F8]" : "hover:bg-[#F5F6F8]"
                }`}
              >
                <span className={value === option.value && !showPlaceholder ? "font-semibold" : ""}>{option.label}</span>
                {value === option.value && !showPlaceholder && <CheckCircleFilledIcon size={10} />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export function PermissionCard({
  permission,
  showCheckbox = false,
  isChecked = false,
  onToggle,
  showTaskCategories = false,
  currentGroup,
  groupBy,
  accessLabel,
  hasWrite,
  currentAccess,
  onAccessChange,
  pendingAccess,
  onPendingAccessChange,
  isExiting = false,
  disabled = false,
  insideGroup = false,
  isInactive = false,
}: {
  permission: Permission;
  showCheckbox?: boolean;
  isChecked?: boolean;
  onToggle?: () => void;
  showTaskCategories?: boolean;
  currentGroup?: string;
  groupBy?: string;
  accessLabel?: string;
  hasWrite?: boolean;
  currentAccess?: string;
  onAccessChange?: (access: string) => void;
  pendingAccess?: string;
  onPendingAccessChange?: (access: string) => void;
  isExiting?: boolean;
  disabled?: boolean;
  insideGroup?: boolean;
  isInactive?: boolean;
}) {
  const { label: defaultLabel, hasWrite: defaultHasWrite } = getAccessLabel(permission.actions);
  const finalLabel = isInactive ? undefined : (accessLabel ?? defaultLabel);
  const finalHasWrite = isInactive ? false : (hasWrite ?? defaultHasWrite);
  
  const supportsMultipleAccess = permission.actions.toLowerCase().includes("read") && permission.actions.toLowerCase().includes("write");
  const needsAccessSelection = !isChecked && supportsMultipleAccess && onPendingAccessChange;
  const hasSelectedAccess = pendingAccess && pendingAccess !== "";
  const isCheckboxDisabled = needsAccessSelection && !hasSelectedAccess;

  const renderAccessBadge = () => {
    if (isInactive) return <span className="text-[12px] font-medium px-2 py-0.5 rounded flex-shrink-0 bg-[#F0F1F3] text-[#818DA0]">No access</span>;
    if (needsAccessSelection) return <AccessSelector value={pendingAccess || ""} onChange={onPendingAccessChange!} showPlaceholder={!hasSelectedAccess} />;
    if (onAccessChange && supportsMultipleAccess && currentAccess) return <AccessSelector value={currentAccess} onChange={onAccessChange} />;
    return (
      <span className={`text-[12px] font-medium px-2 py-0.5 rounded flex-shrink-0 ${finalHasWrite ? "bg-[#D3F8DF] text-[#1D7C4D]" : "bg-[#D4E5FF] text-[#0055BC]"}`}>
        {currentAccess ? getAccessLabel(currentAccess).label : finalLabel}
      </span>
    );
  };

  const checkboxDisabled = disabled || isCheckboxDisabled;

  const cardContent = (
    <>
      {showCheckbox && (
        <div className="self-center">
          {isCheckboxDisabled && !disabled ? (
            <Tooltip content="Choose access level first" position="above"><Checkbox checked={isChecked} onChange={() => {}} disabled={true} /></Tooltip>
          ) : disabled ? (
            <Tooltip content="Required permission" position="above"><Checkbox checked={isChecked} onChange={() => {}} disabled={true} /></Tooltip>
          ) : (
            <Checkbox checked={isChecked} onChange={() => onToggle?.()} />
          )}
        </div>
      )}
      <PermissionCardContent permission={permission} showTaskCategories={showTaskCategories} currentGroup={currentGroup} groupBy={groupBy} insideGroup={insideGroup} isInactive={isInactive} />
      {renderAccessBadge()}
    </>
  );

  if (showCheckbox && onToggle) {
    return (
      <div
        onClick={() => !checkboxDisabled && onToggle()}
        className={`relative flex items-start gap-4 p-4 bg-[#F5F6F8] transition-all duration-150 before:absolute before:inset-0 before:rounded before:transition-colors ${checkboxDisabled ? 'cursor-default' : 'hover:before:bg-[#EBEEF1] cursor-pointer'} ${isExiting ? 'animate-scale-out' : ''}`}
      >
        <div className="relative z-10 flex items-start gap-4 w-full">{cardContent}</div>
      </div>
    );
  }

  return (
    <div className={`flex items-start transition-colors ${insideGroup ? "gap-2 py-3 px-2" : "gap-4 p-4 bg-[#F5F6F8] rounded"}`}>
      {cardContent}
    </div>
  );
}

export function PermissionItem({
  permission,
  roleId,
  showTaskCategories = false,
  currentGroup,
  groupBy,
  customAccess,
  insideGroup = false,
  isInactive = false,
}: {
  permission: Permission;
  roleId: string;
  showTaskCategories?: boolean;
  currentGroup?: string;
  groupBy?: string;
  customAccess?: string;
  insideGroup?: boolean;
  isInactive?: boolean;
}) {
  const access = permission.roleAccess[roleId];
  const isCustomRole = roleId.startsWith("custom_");
  
  let accessLabel: string;
  let hasWrite: boolean;
  
  if (isCustomRole && customAccess) {
    const result = getAccessLabel(customAccess);
    accessLabel = result.label; hasWrite = result.hasWrite;
  } else if (isCustomRole || !access) {
    const result = getAccessLabel(permission.actions);
    accessLabel = result.label; hasWrite = result.hasWrite;
  } else {
    accessLabel = access === "read" ? "Read" : access === "write" ? "Write" : access?.includes("read") && access?.includes("write") ? "Read/Write" : access;
    hasWrite = access === "write" || access?.includes("write");
  }

  return (
    <PermissionCard
      permission={permission}
      showTaskCategories={showTaskCategories}
      currentGroup={currentGroup}
      groupBy={groupBy}
      accessLabel={isInactive ? undefined : accessLabel}
      hasWrite={isInactive ? false : hasWrite}
      insideGroup={insideGroup}
      isInactive={isInactive}
    />
  );
}

// ===== Group Cards =====
export function BaseGroupCard({
  groupName, description, countLabel, isFirst = false, isLast = false, defaultExpanded = false, headerLeft, children, invertColors = false, useDividers = false, lightDividers = false,
}: {
  groupName: string; description?: string; countLabel: string; isFirst?: boolean; isLast?: boolean; defaultExpanded?: boolean; headerLeft?: React.ReactNode; children: React.ReactNode; invertColors?: boolean; useDividers?: boolean; lightDividers?: boolean;
}) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const radiusClass = useDividers ? "" : (isFirst && isLast ? "rounded-[4px]" : isFirst ? "rounded-t-[4px]" : isLast ? "rounded-b-[4px]" : "");
  const dividerBorder = lightDividers ? 'border-[#EBEEF1]' : 'border-[#D8DEE4]';

  const cardBg = useDividers ? (invertColors ? "bg-[#F5F6F8]" : "") : (invertColors ? "bg-white" : "bg-[#F5F6F8]");
  const badgeBg = (useDividers || invertColors) ? "bg-[#F5F6F8]" : "bg-white";
  const hoverBg = useDividers ? (lightDividers ? 'hover:before:bg-[#F5F6F8]' : 'hover:before:bg-white') : (invertColors ? 'hover:before:bg-[#F5F6F8]' : 'hover:before:bg-white');

  const titleContent = (
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2">
        <span className="text-[13px] font-semibold text-[#353A44] leading-[19px] tracking-[-0.15px] truncate">{groupName}</span>
        <span className={`inline-flex items-center justify-center min-w-[16px] h-[16px] px-1 ${badgeBg} text-[10px] font-semibold text-[#596171] leading-4 rounded-full text-center`}>{countLabel}</span>
      </div>
      {description && <p className="text-[13px] text-[#596171] leading-[19px] line-clamp-2">{description}</p>}
    </div>
  );

  const chevron = <ChevronDown className={`${useDividers ? 'w-3.5 h-3.5' : 'w-4 h-4'} text-[#474E5A] flex-shrink-0 transition-transform duration-200 ${isExpanded ? "" : "-rotate-90"}`} />;

  return (
    <div className={`${cardBg} ${radiusClass} shrink-0 flex flex-col`}>
      {headerLeft ? (
        <div className={`relative flex items-center gap-4 ${useDividers ? `py-3 px-2 border-b ${dividerBorder}` : 'py-4 px-4'} before:absolute before:inset-0 before:rounded before:bg-transparent before:transition-colors before:duration-200 ${hoverBg}`}>
          <div className="relative z-10">{headerLeft}</div>
          <button onClick={() => setIsExpanded(!isExpanded)} className="relative z-10 flex-1 flex items-center gap-4 text-left group min-w-0">{titleContent}{chevron}</button>
        </div>
      ) : (
        <button onClick={() => setIsExpanded(!isExpanded)} className={`relative w-full flex items-center gap-4 ${useDividers ? `py-3 px-2 border-b ${dividerBorder}` : 'py-4 px-4'} text-left group before:absolute before:inset-0 before:rounded before:bg-transparent before:transition-colors before:duration-200 ${hoverBg}`}>
          <span className="relative z-10 flex items-center gap-4 flex-1 min-w-0">{titleContent}</span>
          <span className="relative z-10">{chevron}</span>
        </button>
      )}
      <div className="grid transition-[grid-template-rows] duration-200 ease-in-out" style={{ gridTemplateRows: isExpanded ? '1fr' : '0fr' }}>
        <div className="overflow-hidden">
          <div className={`flex flex-col divide-y ${lightDividers ? 'divide-[#EBEEF1]' : 'divide-[#D8DEE4]'} ${useDividers ? 'pl-4 pb-2' : `mx-5 pb-2 border-t ${dividerBorder}`}`}>{children}</div>
        </div>
      </div>
    </div>
  );
}

export function GroupCard({
  groupName, description, permissions: perms, roleId, groupBy, customAccess, defaultExpanded = false, isFirst = false, isLast = false, activeApiNames, showAll = false, invertColors = false, useDividers = false, lightDividers = false,
}: {
  groupName: string; description?: string; permissions: Permission[]; roleId: string; groupBy: string; customAccess?: Record<string, string>; defaultExpanded?: boolean; isFirst?: boolean; isLast?: boolean; activeApiNames?: Set<string>; showAll?: boolean; invertColors?: boolean; useDividers?: boolean; lightDividers?: boolean;
}) {
  return (
    <BaseGroupCard
      groupName={groupName}
      description={description}
      countLabel={showAll && activeApiNames ? `${perms.filter(p => activeApiNames.has(p.apiName)).length} of ${perms.length}` : `${perms.length}`}
      isFirst={isFirst} isLast={isLast} defaultExpanded={defaultExpanded} invertColors={invertColors} useDividers={useDividers} lightDividers={lightDividers}
    >
      {perms.map((permission) => (
        <PermissionItem
          key={permission.apiName} permission={permission} roleId={roleId} showTaskCategories={false}
          currentGroup={groupName} groupBy={groupBy} customAccess={customAccess?.[permission.apiName]} insideGroup
          isInactive={showAll && activeApiNames ? !activeApiNames.has(permission.apiName) : false}
        />
      ))}
    </BaseGroupCard>
  );
}

// ===== Permissions Filter Menu =====
export function PermissionsFilterMenu({
  showAll, onShowAllChange, isGrouped, onGroupedChange, groupBy, onGroupByChange,
}: {
  showAll?: boolean; onShowAllChange?: (v: boolean) => void; isGrouped: boolean; onGroupedChange: (v: boolean) => void; groupBy: GroupByOption; onGroupByChange: (v: GroupByOption) => void;
}) {
  const popover = usePopover();
  const options = isGrouped ? groupedGroupByOptions : ungroupedGroupByOptions;
  const currentLabel = options.find(o => o.value === groupBy)?.label || groupBy;

  return (
    <div className="relative flex items-center gap-1">
      <button onClick={() => popover.toggle()} className="flex items-center gap-1 cursor-pointer">
        <span className="text-[13px] text-[#596171] leading-[19px]">View by: <span className="text-[#635BFF]">{currentLabel}</span></span>
        <span className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-[#EBEEF1] transition-colors">
          <ControlIcon className="w-3 h-3 text-[#474E5A]" />
        </span>
      </button>
      {popover.isVisible && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => popover.close()} />
          <div className={`absolute top-full right-0 mt-1 bg-white border border-[#D8DEE4] rounded-[8px] shadow-[0_5px_15px_rgba(0,0,0,0.12),0_15px_35px_rgba(48,49,61,0.08)] z-20 whitespace-nowrap overflow-hidden ${popover.animationClass}`}>
            <div className="p-2 flex flex-col">
              <div className="px-2 py-1.5"><span className="text-[12px] font-semibold text-[#818DA0] leading-4 tracking-[-0.024px] uppercase">View by</span></div>
              {options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => onGroupByChange(option.value)}
                  className={`w-full flex items-center justify-between gap-3 px-2 py-1.5 text-[13px] leading-[19px] tracking-[-0.15px] text-[#353A44] rounded transition-colors ${groupBy === option.value ? "bg-[#F5F6F8]" : "hover:bg-[#F5F6F8]"}`}
                >
                  <span className={groupBy === option.value ? "font-semibold" : ""}>{option.label}</span>
                  {groupBy === option.value && <CheckCircleFilledIcon size={12} />}
                </button>
              ))}
              <div className="h-px bg-[#EBEEF1] my-1" />
              <div className="flex items-center justify-between gap-6 px-2 py-1.5 cursor-pointer" onClick={() => onGroupedChange(!isGrouped)}>
                <span className="text-[13px] text-[#353A44] leading-[19px] tracking-[-0.15px]">Bundle permissions</span>
                <div onClick={(e) => e.stopPropagation()}><ToggleSwitch checked={isGrouped} onChange={onGroupedChange} /></div>
              </div>
              {showAll !== undefined && onShowAllChange && (
                <div className="flex items-center justify-between gap-6 px-2 py-1.5 cursor-pointer" onClick={() => onShowAllChange(!showAll)}>
                  <span className="text-[13px] text-[#353A44] leading-[19px] tracking-[-0.15px]">Hide inactive permissions</span>
                  <div onClick={(e) => e.stopPropagation()}><ToggleSwitch checked={!showAll} onChange={(v) => onShowAllChange(!v)} /></div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ===== Drawer Permissions Panel =====
export function DrawerPermissionsPanel({ roleIds, className, invertColors = false, layoutVersion = "v1" }: { roleIds: string[]; className?: string; invertColors?: boolean; layoutVersion?: "v1" | "v2" | "v3" | "v4" }) {
  const useDividerStyle = layoutVersion === "v3" || layoutVersion === "v4";
  const lightDividerStyle = layoutVersion === "v4";
  const [groupBy, setGroupBy] = useState<GroupByOption>("productCategory");
  const [isGrouped, setIsGrouped] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const rolePermissions = useMemo(() => {
    if (roleIds.length === 0) return [];
    const seen = new Set<string>();
    const result: Permission[] = [];
    for (const rid of roleIds) {
      for (const p of getPermissionsForRole(rid)) {
        if (!seen.has(p.apiName)) { seen.add(p.apiName); result.push(p); }
      }
    }
    return result;
  }, [roleIds]);

  const activeApiNames = useMemo(() => new Set(rolePermissions.map(p => p.apiName)), [rolePermissions]);
  const displayPermissions = showAll ? getAllPermissions() : rolePermissions;

  const filteredPermissions = useMemo(() => {
    if (!searchQuery) return displayPermissions;
    const q = searchQuery.toLowerCase();
    return displayPermissions.filter(p =>
      p.displayName.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) ||
      p.productCategory.toLowerCase().includes(q) || p.apiName.toLowerCase().includes(q)
    );
  }, [displayPermissions, searchQuery]);

  const sortedFilteredPermissions = useMemo(() => {
    if (!showAll) return filteredPermissions;
    return [...filteredPermissions].sort((a, b) => {
      const aActive = activeApiNames.has(a.apiName) ? 0 : 1;
      const bActive = activeApiNames.has(b.apiName) ? 0 : 1;
      if (aActive !== bActive) return aActive - bActive;
      return a.displayName.localeCompare(b.displayName);
    });
  }, [filteredPermissions, showAll, activeApiNames]);

  const groupedPermissions = isGrouped && groupBy !== "alphabetical"
    ? groupPermissions(sortedFilteredPermissions, groupBy as Exclude<GroupByOption, "alphabetical">)
    : null;

  const alphabeticalPermissions = groupBy === "alphabetical"
    ? [...sortedFilteredPermissions].sort((a, b) => a.displayName.localeCompare(b.displayName))
    : null;

  const hasRoles = roleIds.length > 0;

  return (
    <main className={className || "w-[300px] flex-shrink-0 min-h-0 flex flex-col gap-3 p-3 bg-white rounded-lg shadow-[0_2px_5px_0_rgba(48,49,61,0.08),0_1px_1px_0_rgba(0,0,0,0.12)] overflow-hidden"}>
      <div className="flex items-center gap-2 flex-shrink-0 min-h-[28px]">
        <h2 className="text-[14px] font-bold text-[#353A44] leading-5">Permissions</h2>
        {hasRoles && (
          <span className="bg-[#F5F6F8] text-[10px] font-semibold text-[#596171] leading-4 min-w-[16px] px-1 rounded-full text-center">
            {showAll
              ? (searchQuery ? `${filteredPermissions.filter(p => activeApiNames.has(p.apiName)).length} of ${filteredPermissions.length}` : `${rolePermissions.length} of ${getAllPermissions().length}`)
              : (searchQuery ? `${filteredPermissions.length}/${rolePermissions.length}` : rolePermissions.length)}
          </span>
        )}
        <div className="flex-1" />
        {hasRoles ? (
          <PermissionsFilterMenu
            showAll={showAll} onShowAllChange={setShowAll} isGrouped={isGrouped}
            onGroupedChange={(v) => { setIsGrouped(v); if (v && groupBy === "alphabetical") setGroupBy("productCategory"); }}
            groupBy={groupBy} onGroupByChange={setGroupBy}
          />
        ) : (
          <div className="flex items-center gap-2 pointer-events-none">
            <span className="text-[12px] font-semibold text-[#818DA0] leading-4 tracking-[-0.024px]">View by: <span className="text-[#818DA0]">Product</span></span>
            <span className="w-6 h-6 flex items-center justify-center">
              <ControlIcon className="w-3 h-3 text-[#818DA0]" />
            </span>
          </div>
        )}
      </div>
      {hasRoles && <p className="text-[13px] text-[#596171] leading-5 flex-shrink-0">Shows combined permissions from selected roles.</p>}
      {!hasRoles && (
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <div className="flex flex-col items-center gap-2 text-[#6C7688]">
            <ShieldCheckIcon />
            <p className="text-[13px] text-[#596171] leading-5 tracking-[-0.15px]" style={{ fontFeatureSettings: "'lnum', 'pnum'" }}>Select one or more roles to see their<br />combined permissions here.</p>
          </div>
        </div>
      )}
      {hasRoles && (
        <div className="flex items-center gap-2 border border-[#D8DEE4] rounded-md px-2 py-1 min-h-[28px] bg-white form-focus-ring">
          <SearchIcon className="text-[#818DA0]" />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search"
            className="flex-1 text-[13px] text-[#353A44] leading-[19px] tracking-[-0.15px] bg-transparent outline-none placeholder:text-[#818DA0]" />
          {searchQuery && <button onClick={() => setSearchQuery("")} className="text-[#818DA0] hover:text-[#353A44] transition-colors">×</button>}
        </div>
      )}
      {hasRoles && (
        <div className={`flex-1 min-h-0 overflow-y-auto flex flex-col ${useDividerStyle ? "gap-0" : isGrouped ? "gap-1" : "gap-2"}`}>
          {isGrouped && groupedPermissions && (() => {
            const entries = Object.entries(groupedPermissions).sort(([a], [b]) => a.localeCompare(b));
            const sortedEntries = showAll
              ? entries.map(([gn, perms]) => [gn, [...perms].sort((a, b) => {
                  const aA = activeApiNames.has(a.apiName) ? 0 : 1; const bA = activeApiNames.has(b.apiName) ? 0 : 1;
                  if (aA !== bA) return aA - bA; return a.displayName.localeCompare(b.displayName);
                })] as [string, Permission[]]).sort(([, pA], [, pB]) => {
                  const aH = pA.some(p => activeApiNames.has(p.apiName)) ? 0 : 1;
                  const bH = pB.some(p => activeApiNames.has(p.apiName)) ? 0 : 1;
                  return aH - bH;
                })
              : entries;
            return sortedEntries.map(([groupName, perms], idx) => (
              <GroupCard key={groupName} groupName={groupName} description={GROUP_DESCRIPTIONS[groupBy]?.[groupName]}
                permissions={perms} roleId={roleIds[0] || ""} groupBy={groupBy}
                isFirst={idx === 0} isLast={idx === sortedEntries.length - 1}
                activeApiNames={showAll ? activeApiNames : undefined} showAll={showAll} invertColors={invertColors}
                useDividers={useDividerStyle} lightDividers={lightDividerStyle} />
            ));
          })()}
          {!isGrouped && alphabeticalPermissions && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <h3 className="text-[13px] font-semibold text-[#353A44] leading-[19px] tracking-[-0.15px]">All permissions</h3>
                <span className="inline-flex items-center justify-center min-w-[16px] h-[16px] px-1 bg-[#F5F6F8] text-[10px] font-semibold text-[#596171] leading-4 rounded-full text-center">
                  {showAll ? `${alphabeticalPermissions.filter(p => activeApiNames.has(p.apiName)).length} of ${alphabeticalPermissions.length}` : alphabeticalPermissions.length}
                </span>
              </div>
              {alphabeticalPermissions.map((p) => <PermissionItem key={p.apiName} permission={p} roleId={roleIds[0] || ""} showTaskCategories={true} isInactive={showAll ? !activeApiNames.has(p.apiName) : false} />)}
            </div>
          )}
          {!isGrouped && groupedPermissions && Object.entries(groupedPermissions).sort(([a], [b]) => a.localeCompare(b)).map(([groupName, perms]) => (
            <div key={groupName} className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <h3 className="text-[13px] font-semibold text-[#353A44] leading-[19px] tracking-[-0.15px]">{groupName}</h3>
                <span className="inline-flex items-center justify-center min-w-[16px] h-[16px] px-1 bg-[#F5F6F8] text-[10px] font-semibold text-[#596171] leading-4 rounded-full text-center">
                  {showAll ? `${perms.filter(p => activeApiNames.has(p.apiName)).length} of ${perms.length}` : perms.length}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                {perms.map((p) => <PermissionItem key={p.apiName} permission={p} roleId={roleIds[0] || ""} showTaskCategories={false} currentGroup={groupName} groupBy={groupBy} isInactive={showAll ? !activeApiNames.has(p.apiName) : false} />)}
              </div>
            </div>
          ))}
          {filteredPermissions.length === 0 && (
            <div className="text-center py-8 text-[#596171]">
              <div className="w-10 h-10 mx-auto mb-3 text-[#EBEEF1]"><ShieldCheckIcon /></div>
              <p className="text-[13px]">{searchQuery ? `No permissions matching "${searchQuery}"` : "No permissions assigned"}</p>
              {searchQuery && <button onClick={() => setSearchQuery("")} className="mt-2 text-[13px] text-[#635BFF] hover:underline">Clear search</button>}
            </div>
          )}
        </div>
      )}
    </main>
  );
}

// ===== Dashboard Chrome =====
function NavItem({ hasIcon = true }: { hasIcon?: boolean }) {
  return (
    <div className="flex items-center gap-2 w-full">
      {hasIcon && (
        <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
          <div className="w-4 h-4 rounded-full bg-[#EBEEF1]" />
        </div>
      )}
      <div className="py-1.5"><div className="h-2 bg-[#EBEEF1] rounded-lg w-[93px]" /></div>
    </div>
  );
}

export function SideNav({ protoControls }: { protoControls?: { teamSecurityEnabled: boolean; onTeamSecurityToggle: (v: boolean) => void; use14px: boolean; onUse14pxToggle: (v: boolean) => void } } = {}) {
  const popover = usePopover();

  return (
    <aside className="w-[240px] h-full flex flex-col justify-between px-5 py-4 bg-white border-r border-[rgba(0,39,77,0.08)] flex-shrink-0">
      <div className="flex flex-col gap-[42px]">
        <div className="flex items-center gap-2 h-9">
          <div className="w-6 h-6 bg-[#F5F6F8] rounded flex items-center justify-center"><OrgIcon /></div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1">
              <span className="text-xs font-semibold text-[#353A44] leading-4 tracking-[-0.024px]">Acme, Inc.</span>
              <ChevronDown className="w-3 h-3 text-[#6C7688]" />
            </div>
            <span className="text-xs text-[#596171] leading-4 truncate">Organization</span>
          </div>
        </div>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-1.5"><NavItem /><NavItem /><NavItem /></div>
          <div className="flex flex-col gap-1.5">
            <div className="h-6 flex items-center py-1.5"><div className="h-2 bg-[#EBEEF1] rounded-full w-[93px]" /></div>
            <NavItem /><NavItem /><NavItem /><NavItem /><NavItem />
          </div>
        </div>
      </div>
      {protoControls ? (
        <div className="relative">
          <button onClick={() => popover.toggle()} className="w-5 h-5 rounded-full bg-[#EBEEF1] hover:bg-[#D8DEE4] transition-colors cursor-pointer flex items-center justify-center" title="Prototype controls">
            <ControlIcon className="w-3 h-3 text-[#596171]" />
          </button>
          {popover.isVisible && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => popover.close()} />
              <div className={`absolute bottom-full left-0 mb-2 bg-white border border-[#D8DEE4] rounded-[8px] shadow-[0_5px_15px_rgba(0,0,0,0.12),0_15px_35px_rgba(48,49,61,0.08)] z-20 whitespace-nowrap overflow-hidden ${popover.animationClass}`}>
                <div className="p-2 flex flex-col min-w-[220px]">
                  <div className="px-2 py-1.5">
                    <span className="text-[12px] font-semibold text-[#818DA0] leading-4 tracking-[-0.024px] uppercase">Prototype controls</span>
                  </div>
                  <div className="h-px bg-[#EBEEF1] my-1" />
                  <div className="flex items-center justify-between gap-6 px-2 py-1.5 cursor-pointer" onClick={() => protoControls.onTeamSecurityToggle(!protoControls.teamSecurityEnabled)}>
                    <span className="text-[13px] text-[#353A44] leading-[19px] tracking-[-0.15px]">Enable add member</span>
                    <div onClick={(e) => e.stopPropagation()}>
                      <ToggleSwitch checked={protoControls.teamSecurityEnabled} onChange={protoControls.onTeamSecurityToggle} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-6 px-2 py-1.5 cursor-pointer" onClick={() => protoControls.onUse14pxToggle(!protoControls.use14px)}>
                    <span className="text-[13px] text-[#353A44] leading-[19px] tracking-[-0.15px]">Use 14px type</span>
                    <div onClick={(e) => e.stopPropagation()}>
                      <ToggleSwitch checked={protoControls.use14px} onChange={protoControls.onUse14pxToggle} />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      ) : (
        <NavItem />
      )}
    </aside>
  );
}

export function Topbar() {
  return (
    <header className="bg-white flex items-center justify-between py-3 flex-shrink-0">
      <div className="flex items-center gap-6">
        <div className="bg-[#F5F6F8] h-9 w-[360px] rounded-lg opacity-80" />
      </div>
      <div className="flex items-center gap-4">
        <div className="w-4 h-4 rounded-full bg-[#EBEEF1]" />
        <div className="w-4 h-4 rounded-full bg-[#EBEEF1]" />
      </div>
    </header>
  );
}
