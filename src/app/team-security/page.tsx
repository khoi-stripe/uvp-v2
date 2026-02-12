"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, MoreHorizontal, X } from "lucide-react";
import Link from "next/link";
import { roleCategories } from "@/lib/data";
import { SideNav, Topbar, DrawerPermissionsPanel, ToggleSwitch } from "@/components/shared";

// ===== Add Member Modal =====
function AddMemberModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [emails, setEmails] = useState<string[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [selectedAccount, setSelectedAccount] = useState<"all" | "selected">("all");
  const [selectedRoles, setSelectedRoles] = useState<Set<string>>(new Set());
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [showPermissions, setShowPermissions] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setStep(1); setEmails([]); setCurrentInput(""); setSelectedAccount("all");
      setSelectedRoles(new Set()); setExpandedCategories(new Set()); setShowPermissions(false); setIsClosing(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => { onClose(); setIsClosing(false); }, 500);
  };

  const addEmail = (raw: string) => {
    const trimmed = raw.trim().replace(/,$/,'').trim();
    if (trimmed && trimmed.includes("@") && !emails.includes(trimmed)) setEmails(prev => [...prev, trimmed]);
    setCurrentInput("");
  };

  const removeEmail = (email: string) => setEmails(prev => prev.filter(e => e !== email));

  const handleEmailKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === "," || e.key === " " || e.key === "Tab") {
      e.preventDefault();
      if (currentInput.trim()) addEmail(currentInput);
    }
    if (e.key === "Backspace" && !currentInput && emails.length > 0) removeEmail(emails[emails.length - 1]);
  };

  const handleEmailPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.clipboardData.getData("text").split(/[,;\s]+/).filter(Boolean).forEach(addEmail);
  };

  const toggleRole = (roleId: string) => {
    setSelectedRoles(prev => { const next = new Set(prev); if (next.has(roleId)) next.delete(roleId); else next.add(roleId); return next; });
  };

  const toggleCategory = (catName: string) => {
    setExpandedCategories(prev => { const next = new Set(prev); if (next.has(catName)) next.delete(catName); else next.add(catName); return next; });
  };

  const selectedRoleNames = roleCategories.flatMap(cat => cat.roles).filter(r => selectedRoles.has(r.id)).map(r => r.name);

  const categoryDisplayNames: Record<string, string> = {
    "Admin": "Admin", "Developer": "Developer", "Payments": "Payments", "Support": "Support",
    "Specialists": "Connect", "View only": "View only", "Sandbox": "Sandbox",
  };

  const stepLabels: Record<number, string> = { 1: "Add team members", 2: "Which accounts should be accessible?", 3: "Select roles", 4: "Review" };

  if (!isOpen && !isClosing) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className={`absolute inset-0 bg-[rgba(182,192,205,0.7)] transition-opacity duration-500 ${isClosing ? 'opacity-0' : 'opacity-100'}`} onClick={handleClose} />
      <div
        className={`relative bg-white rounded-[12px] shadow-[0px_15px_35px_0px_rgba(48,49,61,0.08),0px_5px_15px_0px_rgba(0,0,0,0.12)] flex flex-col overflow-hidden ${step === 3 ? 'transition-[width,max-width] duration-500 ease-out' : ''} ${isClosing ? 'opacity-0 scale-95 transition-all duration-500 ease-out' : 'opacity-100 scale-100'}`}
        style={step === 3
          ? { width: showPermissions ? 'calc(100vw - 64px)' : 640, maxWidth: showPermissions ? 1280 : undefined, height: 'calc(100vh - 64px)' }
          : { width: 640, ...(step === 4 ? { maxHeight: 'calc(100vh - 64px)' } : { height: 420 }) }}
      >
        {/* Close button (top-right) */}
        <div className="flex items-end justify-end pt-6 px-6 flex-shrink-0">
          <button onClick={handleClose} className="text-[#6C7688] hover:text-[#353A44] transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
          {/* Step 1: Add team members */}
          {step === 1 && (
            <div className="flex-1 overflow-y-auto flex flex-col gap-8 px-8 pb-8">
              {/* Title + description */}
              <div className="flex flex-col gap-1">
                <h2 className="text-[24px] font-bold text-[#21252C] leading-8 tracking-[0.3px] font-display" style={{ fontFeatureSettings: "'lnum', 'pnum'" }}>{stepLabels[step]}</h2>
                <p className="text-[14px] text-[#353A44] leading-5 tracking-[-0.15px]">Enter team member email addresses. Invited members will share the same roles.</p>
              </div>
              {/* Email input */}
              <div
                className="flex-1 flex flex-wrap content-start items-start gap-1.5 px-3 py-2 border border-[#D8DEE4] rounded-[6px] focus-within:ring-2 focus-within:ring-[#635BFF] focus-within:border-transparent cursor-text"
                onClick={() => inputRef.current?.focus()}
              >
                {emails.map((email) => (
                  <span key={email} className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#F5F6F8] text-[16px] text-[#353A44] rounded-md leading-6 tracking-[-0.31px]">
                    {email}
                    <button onClick={(e) => { e.stopPropagation(); removeEmail(email); }} className="text-[#596171] hover:text-[#353A44] ml-0.5"><X size={12} /></button>
                  </span>
                ))}
                <input ref={inputRef} type="text" value={currentInput} onChange={(e) => setCurrentInput(e.target.value)}
                  onKeyDown={handleEmailKeyDown} onPaste={handleEmailPaste} onBlur={() => { if (currentInput.trim()) addEmail(currentInput); }}
                  placeholder={emails.length === 0 ? "ada@example.com, ben@example.com, etc." : ""}
                  className="flex-1 min-w-[120px] text-[16px] text-[#353A44] leading-6 tracking-[-0.31px] placeholder:text-[#6C7688] bg-transparent border-none outline-none py-0.5"
                  style={{ fontFeatureSettings: "'lnum', 'pnum'" }}
                />
              </div>
            </div>
          )}

          {/* Step 2: Which accounts */}
          {step === 2 && (
            <div className="flex-1 overflow-y-auto flex flex-col gap-8 px-8 pb-8">
              <div className="flex flex-col gap-1">
                <h2 className="text-[24px] font-bold text-[#21252C] leading-8 tracking-[0.3px] font-display" style={{ fontFeatureSettings: "'lnum', 'pnum'" }}>{stepLabels[step]}</h2>
              </div>
              <div className="flex gap-4">
                <button onClick={() => setSelectedAccount("all")}
                  className={`flex-1 flex flex-col rounded-[6px] text-left transition-colors overflow-hidden ${selectedAccount === "all" ? 'border-2 border-[#675DFF]' : 'border border-[#D8DEE4] hover:border-[#A3ACB9]'}`}>
                  <div className={`h-[120px] w-full ${selectedAccount === "all" ? 'bg-[#F7F5FD]' : 'bg-[#F5F6F8]'}`} />
                  <div className="p-4">
                    <p className={`text-[16px] font-semibold leading-6 tracking-[-0.31px] ${selectedAccount === "all" ? 'text-[#533AFD]' : 'text-[#596171]'}`} style={{ fontFeatureSettings: "'lnum', 'pnum'" }}>Your whole organization</p>
                    <div className="flex flex-col gap-[10px] py-1.5"><div className="h-2 bg-[#EBEEF1] rounded-lg w-full" /><div className="h-2 bg-[#EBEEF1] rounded-lg w-full" /></div>
                  </div>
                </button>
                <button onClick={() => setSelectedAccount("selected")}
                  className={`flex-1 flex flex-col rounded-[6px] text-left transition-colors overflow-hidden ${selectedAccount === "selected" ? 'border-2 border-[#675DFF]' : 'border border-[#D8DEE4] hover:border-[#A3ACB9]'}`}>
                  <div className={`h-[120px] w-full ${selectedAccount === "selected" ? 'bg-[#F7F5FD]' : 'bg-[#F5F6F8]'}`} />
                  <div className="p-4">
                    <p className={`text-[16px] font-semibold leading-6 tracking-[-0.31px] ${selectedAccount === "selected" ? 'text-[#533AFD]' : 'text-[#596171]'}`} style={{ fontFeatureSettings: "'lnum', 'pnum'" }}>Only select accounts</p>
                    <div className="flex flex-col gap-[10px] py-1.5"><div className="h-2 bg-[#EBEEF1] rounded-lg w-full" /><div className="h-2 bg-[#EBEEF1] rounded-lg w-full" /></div>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Select Roles */}
          {step === 3 && (
            <div className="flex-1 min-h-0 flex flex-col gap-4 px-8 overflow-hidden">
              {/* Title */}
              <div className="flex-shrink-0">
                <h2 className="text-[24px] font-bold text-[#21252C] leading-8 tracking-[0.3px] font-display" style={{ fontFeatureSettings: "'lnum', 'pnum'" }}>{stepLabels[step]}</h2>
              </div>

              {/* Content area: roles (+ optional permissions panel) */}
              <div className={`flex-1 min-h-0 flex ${showPermissions ? 'gap-6' : ''} overflow-hidden`}>
                {/* Left panel: Roles */}
                <div className="flex-1 min-w-0 flex flex-col gap-2 overflow-hidden pt-4">
                  {/* Roles header + toggle */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <span className="flex-1 text-[16px] font-bold text-[#353A44] leading-6 tracking-[-0.31px]" style={{ fontFeatureSettings: "'lnum', 'pnum'" }}>Roles</span>
                    <ToggleSwitch checked={showPermissions} onChange={setShowPermissions} label="Show permissions" />
                  </div>

                  {/* Info banner */}
                  <div className="bg-[#F5F6F8] rounded-[4px] p-4 flex-shrink-0">
                    <p className="text-[13px] text-[#596171] leading-5 tracking-[-0.15px]" style={{ fontFeatureSettings: "'lnum', 'pnum'" }}>
                      To protect your account, users who are recently invited or have recently updated roles may be prevented from performing certain sensitive operations for two to three days.
                    </p>
                  </div>

                  {/* Scrollable role categories */}
                  <div className="flex-1 min-h-0 overflow-y-auto">
                    <div className="flex flex-col">
                      {roleCategories.map((cat) => {
                        const isCatExpanded = expandedCategories.has(cat.name);
                        const selectedCount = cat.roles.filter(r => selectedRoles.has(r.id)).length;
                        const displayName = categoryDisplayNames[cat.name] || cat.name;
                        return (
                          <div key={cat.name}>
                            {/* Category header */}
                            <button onClick={() => toggleCategory(cat.name)} className="w-full flex items-center gap-2 px-2 py-3 border-b border-[#D8DEE4] text-left">
                              <span className="text-[14px] font-semibold text-[#353A44] leading-5 tracking-[-0.15px]">{displayName}</span>
                              <div className="flex-1 flex items-center">
                                <span className="bg-[#F5F6F8] rounded-full min-w-[16px] px-1 text-[10px] font-semibold text-[#596171] leading-4 text-center">{selectedCount} of {cat.roles.length}</span>
                              </div>
                              <ChevronDown size={14} className={`text-[#474E5A] transition-transform duration-200 flex-shrink-0 ${isCatExpanded ? '' : '-rotate-90'}`} />
                            </button>
                            {/* Roles within category */}
                            <div className="grid transition-[grid-template-rows] duration-200 ease-in-out" style={{ gridTemplateRows: isCatExpanded ? '1fr' : '0fr' }}>
                              <div className="overflow-hidden">
                                <div className="flex flex-col pl-4 pb-2">
                                  {cat.roles.map((role, roleIdx) => {
                                    const isSelected = selectedRoles.has(role.id);
                                    return (
                                      <div key={role.id} className={`flex items-start gap-2 py-3 ${roleIdx > 0 ? 'border-t border-[#D8DEE4]' : ''}`}>
                                        <button onClick={() => toggleRole(role.id)}
                                          className={`mt-[3px] w-[14px] h-[14px] rounded-[4px] border flex-shrink-0 flex items-center justify-center transition-colors ${isSelected ? 'bg-[#675DFF] border-[#675DFF] shadow-[0_1px_1px_rgba(10,33,86,0.16)]' : 'border-[#D8DEE4] bg-white shadow-[0_1px_1px_rgba(33,37,44,0.16)] hover:border-[#A3ACB9]'}`}>
                                          {isSelected && <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M8.5 2.5L3.75 7.5L1.5 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                                        </button>
                                        <div className="flex-1 min-w-0">
                                          <p className="text-[14px] font-semibold text-[#353A44] leading-5 tracking-[-0.15px]">{role.name}</p>
                                          {role.details?.description && (
                                            <p className="text-[13px] text-[#596171] leading-5 tracking-[-0.15px]" style={{ fontFeatureSettings: "'lnum', 'pnum'" }}>{role.details.description}</p>
                                          )}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Right panel: Permissions (only when toggle is ON) */}
                {showPermissions && (
                  <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
                    <DrawerPermissionsPanel
                      roleIds={Array.from(selectedRoles)}
                      invertColors={true}
                      className="min-h-0 flex flex-col gap-4 p-4 bg-[#F5F6F8] rounded-[8px] overflow-hidden h-full"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {step === 4 && (
            <div className="flex-1 overflow-y-auto flex flex-col gap-4 px-8 pb-8">
              <div className="flex flex-col">
                <h2 className="text-[24px] font-bold text-[#21252C] leading-8 tracking-[0.3px] font-display" style={{ fontFeatureSettings: "'lnum', 'pnum'" }}>{stepLabels[step]}</h2>
              </div>
              <div className="flex flex-col gap-1 rounded-[4px] overflow-hidden">
                <div className="flex items-center gap-8 bg-[#F5F6F8] p-4">
                  <div className="flex-1 min-w-0 flex flex-col gap-1">
                    <p className="text-[14px] text-[#353A44] leading-5 tracking-[-0.15px]">Members</p>
                    <p className="text-[14px] font-semibold text-[#353A44] leading-5 tracking-[-0.15px]" style={{ fontFeatureSettings: "'lnum', 'pnum'" }}>
                      {emails.length > 0 ? (emails.length <= 3 ? emails.join(", ") : `${emails.slice(0, 2).join(", ")}, + ${emails.length - 2} more`) : "No emails entered"}
                    </p>
                  </div>
                  <button onClick={() => setStep(1)} className="w-7 h-7 flex items-center justify-center flex-shrink-0 rounded-md hover:bg-[#EBEEF1] transition-colors">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M0.975001 7.87468C0.991113 7.63299 1.0944 7.40537 1.26568 7.23409L7.43933 1.06043C8.02512 0.474647 8.97487 0.474647 9.56065 1.06043L10.9393 2.43911C11.5251 3.0249 11.5251 3.97465 10.9393 4.56043L4.76568 10.7341C4.5944 10.9054 4.36678 11.0087 4.12509 11.0248L1.03508 11.2308C0.884155 11.2408 0.758938 11.1156 0.769 10.9647L0.975001 7.87468ZM2.3607 9.63906L2.45918 8.16191L6.53031 4.09078L7.90899 5.46946L3.83786 9.54059L2.3607 9.63906ZM8.96965 4.4088L9.87867 3.49977L8.49999 2.12109L7.59097 3.03012L8.96965 4.4088Z" fill="#596171"/></svg>
                  </button>
                </div>
                <div className="flex items-center gap-8 bg-[#F5F6F8] p-4">
                  <div className="flex-1 min-w-0 flex flex-col gap-1">
                    <p className="text-[14px] text-[#353A44] leading-5 tracking-[-0.15px]">Access</p>
                    <p className="text-[14px] font-semibold text-[#353A44] leading-5 tracking-[-0.15px]" style={{ fontFeatureSettings: "'lnum', 'pnum'" }}>{selectedAccount === "all" ? "Acme, Inc." : "Selected accounts"}</p>
                  </div>
                  <button onClick={() => setStep(2)} className="w-7 h-7 flex items-center justify-center flex-shrink-0 rounded-md hover:bg-[#EBEEF1] transition-colors">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M0.975001 7.87468C0.991113 7.63299 1.0944 7.40537 1.26568 7.23409L7.43933 1.06043C8.02512 0.474647 8.97487 0.474647 9.56065 1.06043L10.9393 2.43911C11.5251 3.0249 11.5251 3.97465 10.9393 4.56043L4.76568 10.7341C4.5944 10.9054 4.36678 11.0087 4.12509 11.0248L1.03508 11.2308C0.884155 11.2408 0.758938 11.1156 0.769 10.9647L0.975001 7.87468ZM2.3607 9.63906L2.45918 8.16191L6.53031 4.09078L7.90899 5.46946L3.83786 9.54059L2.3607 9.63906ZM8.96965 4.4088L9.87867 3.49977L8.49999 2.12109L7.59097 3.03012L8.96965 4.4088Z" fill="#596171"/></svg>
                  </button>
                </div>
                <div className="flex items-center gap-8 bg-[#F5F6F8] p-4">
                  <div className="flex-1 min-w-0 flex flex-col gap-1">
                    <p className="text-[14px] text-[#353A44] leading-5 tracking-[-0.15px]">Roles</p>
                    <p className="text-[14px] font-semibold text-[#353A44] leading-5 tracking-[-0.15px]" style={{ fontFeatureSettings: "'lnum', 'pnum'" }}>{selectedRoleNames.length > 0 ? selectedRoleNames.join(", ") : "No roles selected"}</p>
                  </div>
                  <button onClick={() => setStep(3)} className="w-7 h-7 flex items-center justify-center flex-shrink-0 rounded-md hover:bg-[#EBEEF1] transition-colors">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M0.975001 7.87468C0.991113 7.63299 1.0944 7.40537 1.26568 7.23409L7.43933 1.06043C8.02512 0.474647 8.97487 0.474647 9.56065 1.06043L10.9393 2.43911C11.5251 3.0249 11.5251 3.97465 10.9393 4.56043L4.76568 10.7341C4.5944 10.9054 4.36678 11.0087 4.12509 11.0248L1.03508 11.2308C0.884155 11.2408 0.758938 11.1156 0.769 10.9647L0.975001 7.87468ZM2.3607 9.63906L2.45918 8.16191L6.53031 4.09078L7.90899 5.46946L3.83786 9.54059L2.3607 9.63906ZM8.96965 4.4088L9.87867 3.49977L8.49999 2.12109L7.59097 3.03012L8.96965 4.4088Z" fill="#596171"/></svg>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-[10px] py-6 px-8 flex-shrink-0">
          {step > 1 && <button onClick={() => setStep(step - 1)} className="px-4 py-2 text-[14px] font-semibold text-[#353A44] leading-5 tracking-[-0.15px] bg-white border border-[#D8DEE4] rounded-[6px] hover:bg-[#F5F6F8] transition-colors">Back</button>}
          {step < 4
            ? <button onClick={() => setStep(step + 1)} className="px-4 py-2 text-[14px] font-semibold text-white leading-5 tracking-[-0.15px] bg-[#635BFF] rounded-[6px] hover:bg-[#5851DF] transition-colors shadow-[0_1px_1px_rgba(47,14,99,0.32)]">Next</button>
            : <button onClick={handleClose} className="px-4 py-2 text-[14px] font-semibold text-white leading-5 tracking-[-0.15px] bg-[#635BFF] rounded-[6px] hover:bg-[#5851DF] transition-colors shadow-[0_1px_1px_rgba(47,14,99,0.32)]">Send invites</button>
          }
        </div>
      </div>
    </div>
  );
}

// ===== Team & Security Page =====
const DATA_ROWS = 10;

export default function TeamSecurityPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="h-screen flex bg-white">
      <SideNav />

      <div className="flex-1 flex flex-col px-8 pb-6 overflow-hidden">
        <Topbar teamSecurityHref="/team-security" />

        <div className="flex-1 min-h-0 flex flex-col gap-8 overflow-auto pt-5">
          {/* Header: breadcrumb + title + tabs */}
          <div className="flex flex-col gap-4 shrink-0">
            {/* Breadcrumb + Title */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <Link href="/" className="text-[12px] font-semibold text-[#533AFD] leading-4 tracking-[-0.02px] hover:underline">Organization settings</Link>
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none" className="text-[#6C7688]"><path d="M3 2L5 4L3 6" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <h1 className="text-[28px] font-bold text-[#353A44] leading-9 tracking-[0.38px] font-display" style={{ fontFeatureSettings: "'lnum', 'pnum'" }}>Team and security</h1>
            </div>

            {/* Tab bar */}
            <div className="flex items-start gap-6 border-b border-[#D8DEE4]">
              <div className="flex items-center justify-center py-4 border-b-2 border-[#533AFD]">
                <span className="text-[14px] font-semibold text-[#533AFD] leading-5 tracking-[-0.15px]">Team</span>
              </div>
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className="flex flex-col items-start py-4 w-[61px]">
                  <div className="py-1.5 w-full">
                    <div className="h-2 bg-[#EBEEF1] rounded-lg w-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Filter cards (4 equal-width, separated by 8px gap) */}
          <div className="flex gap-2 shrink-0">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="flex-1 h-[60px] bg-[#F5F6F8] rounded-[6px]" />
            ))}
          </div>

          {/* Toolbar + Table */}
          <div className="flex flex-col gap-3 flex-1 min-h-0">
            {/* Table Filters toolbar */}
            <div className="flex flex-wrap items-center gap-2 min-h-[28px] shrink-0">
              {/* Left: pill-shaped filters */}
              <div className="flex-1 flex items-center gap-2">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-[96px] h-[24px] bg-[#F5F6F8] rounded-full" />
                ))}
              </div>
              {/* Right: rect filter + button */}
              <div className="w-[96px] h-[24px] bg-[#F5F6F8] rounded-[6px]" />
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-1.5 h-[28px] px-3 text-[12px] font-semibold text-white leading-4 tracking-[-0.02px] bg-[#635BFF] rounded-[6px] hover:bg-[#5851DF] transition-colors shadow-[0_1px_1px_rgba(47,14,99,0.32)]"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 2v8M2 6h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                Add member
              </button>
            </div>

            {/* Table: column-based layout */}
            <div className="flex border-t border-[#D8DEE4] overflow-x-auto flex-1 min-h-0">
              {/* 7 data columns (equal flex) */}
              {[0, 1, 2, 3, 4, 5, 6].map((col) => (
                <div key={col} className="flex-1 flex flex-col min-w-0">
                  {/* Header cell */}
                  <div className="flex items-center h-[36px] px-3 border-b border-[#EBEEF1]">
                    <div className="flex-1 py-1.5">
                      <div className="h-2 bg-[#EBEEF1] rounded-lg w-full" />
                    </div>
                  </div>
                  {/* Data cells */}
                  {Array.from({ length: DATA_ROWS }, (_, row) => (
                    <div key={row} className="flex items-center h-[36px] px-3 border-b border-[#EBEEF1]">
                      <div className="flex-1 py-1.5">
                        <div className="h-2 bg-[#EBEEF1] rounded-lg w-full" />
                      </div>
                    </div>
                  ))}
                </div>
              ))}
              {/* Overflow menu column (fixed width) */}
              <div className="flex flex-col shrink-0">
                {/* Empty header cell */}
                <div className="h-[36px]" />
                {/* Overflow icons */}
                {Array.from({ length: DATA_ROWS }, (_, row) => (
                  <div key={row} className="flex items-center justify-center w-[36px] h-[36px] border-b border-[#EBEEF1]">
                    <MoreHorizontal size={16} className="text-[#6C7688]" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <AddMemberModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
