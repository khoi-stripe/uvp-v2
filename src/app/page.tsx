"use client";

import React, { useState, useRef, useEffect, useLayoutEffect, useMemo, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ChevronDown, MoreHorizontal, Search, X } from "lucide-react";
import { DrawerPermissionsPanel as SharedDrawerPermissionsPanel, ToggleSwitch as SharedToggleSwitch } from "@/components/shared";

// Hook for animated popover open/close
function usePopover() {
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
    }, 100); // matches popover-out animation duration
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

// Animated ticker number component
function AnimatedNumber({ value, className = "" }: { value: number; className?: string }) {
  const [displayValue, setDisplayValue] = useState(value);
  const [isAnimating, setIsAnimating] = useState(false);
  const prevValue = useRef(value);

  useEffect(() => {
    if (prevValue.current !== value) {
      setIsAnimating(true);
      const diff = value - prevValue.current;
      const steps = Math.abs(diff);
      const duration = Math.min(300, steps * 50); // Cap at 300ms
      const stepTime = duration / steps;
      
      let current = prevValue.current;
      const increment = diff > 0 ? 1 : -1;
      
      const tick = () => {
        current += increment;
        setDisplayValue(current);
        
        if (current !== value) {
          setTimeout(tick, stepTime);
        } else {
          setIsAnimating(false);
        }
      };
      
      setTimeout(tick, stepTime);
      prevValue.current = value;
    }
  }, [value]);

  return (
    <span className={`${className} ${isAnimating ? 'text-[#635BFF]' : ''} transition-colors duration-150`}>
      {displayValue}
    </span>
  );
}

// Custom SVG Icons
function CheckCircleIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M12.2803 5.21967C12.5732 5.51256 12.5732 5.98744 12.2803 6.28033L7.53033 11.0303C7.23744 11.3232 6.76256 11.3232 6.46967 11.0303L3.96967 8.53033C3.67678 8.23744 3.67678 7.76256 3.96967 7.46967C4.26256 7.17678 4.73744 7.17678 5.03033 7.46967L7 9.43934L11.2197 5.21967C11.5126 4.92678 11.9874 4.92678 12.2803 5.21967Z" fill="#2B8700"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M8 14.5C11.5903 14.5 14.5 11.5903 14.5 7.99999C14.5 4.40834 11.6 1.5 8 1.5C4.4097 1.5 1.5 4.40969 1.5 7.99999C1.5 11.5903 4.4097 14.5 8 14.5ZM8 16C12.4187 16 16 12.4187 16 7.99999C16 3.58126 12.4297 0 8 0C3.58127 0 0 3.58126 0 7.99999C0 12.4187 3.58127 16 8 16Z" fill="#2B8700"/>
    </svg>
  );
}

function CancelCircleIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5.53033 4.46967C5.23744 4.17678 4.76256 4.17678 4.46967 4.46967C4.17678 4.76256 4.17678 5.23744 4.46967 5.53033L6.93934 8L4.46967 10.4697C4.17678 10.7626 4.17678 11.2374 4.46967 11.5303C4.76256 11.8232 5.23744 11.8232 5.53033 11.5303L8 9.06066L10.4697 11.5303C10.7626 11.8232 11.2374 11.8232 11.5303 11.5303C11.8232 11.2374 11.8232 10.7626 11.5303 10.4697L9.06066 8L11.5303 5.53033C11.8232 5.23744 11.8232 4.76256 11.5303 4.46967C11.2374 4.17678 10.7626 4.17678 10.4697 4.46967L8 6.93934L5.53033 4.46967Z" fill="#C0123C"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M16 7.99999C16 12.4187 12.4187 16 8 16C3.58127 16 0 12.4187 0 7.99999C0 3.58126 3.58127 0 8 0C12.4297 0 16 3.58126 16 7.99999ZM14.5 7.99999C14.5 11.5903 11.5903 14.5 8 14.5C4.4097 14.5 1.5 11.5903 1.5 7.99999C1.5 4.40969 4.4097 1.5 8 1.5C11.6 1.5 14.5 4.40834 14.5 7.99999Z" fill="#C0123C"/>
    </svg>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path fillRule="evenodd" clipRule="evenodd" d="M7.88334 9.08539C7.06854 9.6615 6.0738 10 5 10C2.23858 10 0 7.76142 0 5C0 2.23858 2.23858 0 5 0C7.76142 0 10 2.23858 10 5C10 6.07379 9.66151 7.06852 9.08542 7.88331L11.7511 10.549C11.9187 10.7166 12.0017 10.9368 12 11.1564C11.9984 11.3718 11.9154 11.5867 11.7511 11.751C11.5847 11.9174 11.3665 12.0004 11.1485 12C10.9315 11.9996 10.7146 11.9166 10.549 11.751L7.88334 9.08539ZM8.3 5C8.3 6.82254 6.82254 8.3 5 8.3C3.17746 8.3 1.7 6.82254 1.7 5C1.7 3.17746 3.17746 1.7 5 1.7C6.82254 1.7 8.3 3.17746 8.3 5Z" fill="currentColor"/>
    </svg>
  );
}

function HistoryIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3.98717 5.53849L2.5434 5.05723C3.69723 2.54125 5.96605 1.5 7.99987 1.5C11.5858 1.5 14.5 4.41422 14.5 7.99999C14.4999 11.5858 11.5857 14.5 7.99987 14.5C4.87508 14.5 2.62696 12.5093 1.71147 9.76283C1.58049 9.36987 1.15575 9.1575 0.762788 9.28849C0.448485 9.39326 0.249711 9.68595 0.249756 10C0.249767 10.0786 0.262229 10.1585 0.288447 10.2372C1.37296 13.4907 4.12484 16 7.99987 16C12.4142 16 15.9999 12.4142 16 8.00001C16 3.58578 12.4142 0 7.99987 0C5.63618 0 3.00506 1.13867 1.5 3.804V1.75C1.5 1.33579 1.16421 1 0.75 1C0.335786 1 0 1.33579 0 1.75V5.25C0 5.57282 0.206573 5.85943 0.512829 5.96151L3.51283 6.96151C3.90579 7.0925 4.33053 6.88013 4.46151 6.48717C4.5925 6.09421 4.38013 5.66947 3.98717 5.53849Z" fill="#6C7688"/>
      <path d="M8.5 4.25C8.5 3.83579 8.16421 3.5 7.75 3.5C7.33579 3.5 7 3.83579 7 4.25V8.75C7 9.06538 7.1973 9.34707 7.49369 9.45485L10.2437 10.4548C10.633 10.5964 11.0633 10.3956 11.2048 10.0063C11.3464 9.61703 11.1456 9.18671 10.7563 9.04515L8.5 8.22468V4.25Z" fill="#6C7688"/>
    </svg>
  );
}

function ShieldCheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11.358 6.18917C11.6005 5.85338 11.5249 5.38456 11.1891 5.14205C10.8533 4.89953 10.3845 4.97514 10.142 5.31094L7.43596 9.05776L5.80748 7.24833C5.53038 6.94045 5.05617 6.91549 4.74828 7.19258C4.4404 7.46968 4.41544 7.9439 4.69254 8.25178L6.94254 10.7518C7.09418 10.9203 7.31388 11.0111 7.54024 10.999C7.76659 10.9868 7.9753 10.8729 8.10802 10.6892L11.358 6.18917Z" fill="#474E5A"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M4.82822 14.2188L7.08401 15.7227C7.35528 15.9035 7.67401 16 8.00003 16C8.32606 16 8.64479 15.9035 8.91606 15.7227L11.1718 14.2188C13.267 12.822 14.5822 10.5203 14.7219 8.00617L14.9707 3.52775C14.9866 3.24115 14.7588 2.9985 14.4766 2.94568C12.7465 2.62173 9.96846 0.936793 8.91934 0.271047C8.64407 0.096362 8.32606 0 8.00003 0C7.67401 0 7.356 0.0963626 7.08072 0.271048C6.03161 0.936798 3.25355 2.62174 1.52342 2.94568C1.24128 2.99851 1.01343 3.24115 1.02935 3.52775L1.27815 8.00617C1.41783 10.5203 2.73308 12.822 4.82822 14.2188ZM2.77584 7.92296L2.57044 4.22569C3.47509 3.94652 4.43732 3.49215 5.25264 3.06572C6.34631 2.49371 7.34214 1.88169 7.88443 1.53756C7.92989 1.50871 7.97084 1.5 8.00003 1.5C8.02923 1.5 8.07017 1.50871 8.11564 1.53756C8.65793 1.88169 9.65376 2.4937 10.7474 3.06571C11.5628 3.49215 12.525 3.94651 13.4296 4.22569L13.2242 7.92296C13.1107 9.96573 12.0421 11.8359 10.3398 12.9707L8.084 14.4746C8.05914 14.4912 8.02992 14.5 8.00003 14.5C7.97015 14.5 7.94093 14.4912 7.91606 14.4746L5.66027 12.9707C3.95797 11.8359 2.88933 9.96573 2.77584 7.92296Z" fill="#474E5A"/>
    </svg>
  );
}

function SandboxIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M7.09793 1.68763C7.36276 1.56405 7.65145 1.5 7.9437 1.5H8.0563C8.34855 1.5 8.63724 1.56405 8.90207 1.68763L14.8458 4.46136C15.5499 4.78996 16 5.49668 16 6.27373V9.76393C16 10.5215 15.572 11.214 14.8944 11.5528L9.63344 14.1833C9.21687 14.3916 8.75753 14.5 8.2918 14.5H7.7082C7.24247 14.5 6.78313 14.3916 6.36656 14.1833L1.10557 11.5528C0.428006 11.214 0 10.5215 0 9.76393V6.27373C0 5.49668 0.45008 4.78996 1.15423 4.46136L7.09793 1.68763ZM14.5 7.08859V9.76393C14.5 9.95332 14.393 10.1264 14.2236 10.2111L8.96262 12.8416C8.89387 12.876 8.82279 12.9049 8.75004 12.9283V9.96357L14.5 7.08859ZM13.9375 5.69279L11.4552 6.93393L8.60002 5.61615V3.20197L13.9375 5.69279ZM7.40002 3.20195L2.06255 5.69277L4.5448 6.93389L7.40002 5.6161V3.20195ZM8.00004 8.66152L10.0807 7.62119L7.99997 6.66085L5.91931 7.62115L8.00004 8.66152ZM1.5 7.08855L7.25004 9.96357V12.9283C7.17726 12.905 7.10616 12.876 7.03738 12.8416L1.77639 10.2111C1.607 10.1264 1.5 9.95332 1.5 9.76393V7.08855Z" fill="#474E5A"/>
    </svg>
  );
}

// AI Assistant sparkle icon with gradient
function SparkleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11.4715 2.62411C11.5425 2.59893 11.5984 2.54302 11.6236 2.47196L12.2639 0.665039C12.3032 0.554041 12.4014 0.49854 12.4995 0.498535C12.5977 0.498531 12.6958 0.554032 12.7352 0.665038L13.3754 2.47196C13.4006 2.54302 13.4565 2.59893 13.5276 2.62411L15.3345 3.26436C15.4455 3.30369 15.501 3.40184 15.501 3.5C15.501 3.59816 15.4455 3.69631 15.3345 3.73565L13.5276 4.3759C13.4565 4.40108 13.4006 4.45698 13.3754 4.52805L12.7352 6.33497C12.6958 6.44597 12.5977 6.50147 12.4995 6.50147C12.4014 6.50147 12.3032 6.44596 12.2639 6.33497L11.6236 4.52805C11.5984 4.45698 11.5425 4.40108 11.4715 4.3759L9.66456 3.73565C9.55356 3.69632 9.49805 3.59816 9.49806 3.5C9.49806 3.40184 9.55356 3.30369 9.66456 3.26436L11.4715 2.62411Z" fill="url(#paint0_sparkle)"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M6.99952 5.49119L6.43977 7.07092C6.21315 7.71049 5.71001 8.21363 5.07044 8.44025L3.49071 9L5.07044 9.55975C5.71001 9.78637 6.21315 10.2895 6.43977 10.9291L6.99952 12.5088L7.55927 10.9291C7.78589 10.2895 8.28903 9.78637 8.9286 9.55975L10.5083 9L8.9286 8.44025C8.28903 8.21363 7.78589 7.71049 7.55927 7.07092L6.99952 5.49119ZM7.70645 2.99511C7.58846 2.6621 7.29398 2.49559 6.99951 2.4956C6.70505 2.4956 6.41058 2.6621 6.29259 2.99511L5.0259 6.56994C4.95036 6.78313 4.78265 6.95084 4.56946 7.02638L0.994626 8.29307C0.66162 8.41106 0.495117 8.70553 0.495117 9C0.495118 9.29447 0.661621 9.58894 0.994628 9.70693L4.56946 10.9736C4.78265 11.0492 4.95036 11.2169 5.0259 11.4301L6.29259 15.0049C6.41058 15.3379 6.70505 15.5044 6.99951 15.5044C7.29398 15.5044 7.58846 15.3379 7.70645 15.0049L8.97314 11.4301C9.04868 11.2169 9.21639 11.0492 9.42958 10.9736L13.0044 9.70693C13.3374 9.58894 13.5039 9.29447 13.5039 9C13.5039 8.70553 13.3374 8.41106 13.0044 8.29307L9.42958 7.02638C9.21639 6.95084 9.04868 6.78313 8.97314 6.56994L7.70645 2.99511Z" fill="url(#paint1_sparkle)"/>
      <defs>
        <linearGradient id="paint0_sparkle" x1="-2.24035" y1="18.88" x2="20.1597" y2="-3.52" gradientUnits="userSpaceOnUse">
          <stop stopColor="#55DDFF"/>
          <stop offset="0.5" stopColor="#675DFF"/>
          <stop offset="0.98" stopColor="#28239B"/>
        </linearGradient>
        <linearGradient id="paint1_sparkle" x1="-2.24035" y1="18.88" x2="20.1597" y2="-3.52" gradientUnits="userSpaceOnUse">
          <stop stopColor="#55DDFF"/>
          <stop offset="0.5" stopColor="#675DFF"/>
          <stop offset="0.98" stopColor="#28239B"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

// More/overflow icon for assistant header (12x12)
function AssistantMoreIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 7.25C6.69036 7.25 7.25 6.69036 7.25 6C7.25 5.30964 6.69036 4.75 6 4.75C5.30964 4.75 4.75 5.30964 4.75 6C4.75 6.69036 5.30964 7.25 6 7.25Z" fill="#6C7688"/>
      <path d="M10.5 7.25C11.1904 7.25 11.75 6.69036 11.75 6C11.75 5.30964 11.1904 4.75 10.5 4.75C9.80964 4.75 9.25 5.30964 9.25 6C9.25 6.69036 9.80964 7.25 10.5 7.25Z" fill="#6C7688"/>
      <path d="M1.5 7.25C2.19036 7.25 2.75 6.69036 2.75 6C2.75 5.30964 2.19036 4.75 1.5 4.75C0.809644 4.75 0.25 5.30964 0.25 6C0.25 6.69036 0.809644 7.25 1.5 7.25Z" fill="#6C7688"/>
    </svg>
  );
}

// Support/help icon for assistant header (12x12)
function AssistantSupportIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 6C12 9.31371 9.31371 12 6 12C2.68629 12 0 9.31371 0 6C0 2.68629 2.68629 0 6 0C9.31371 0 12 2.68629 12 6ZM10.875 6C10.875 7.14352 10.4813 8.19508 9.82201 9.02652L9.01962 8.22412C8.79583 8.52744 8.52744 8.79584 8.22412 9.01962L9.02651 9.82201C8.19508 10.4813 7.14352 10.875 6 10.875C4.85652 10.875 3.80499 10.4813 2.97357 9.82208L3.776 9.01965C3.7133 8.97339 3.6521 8.92522 3.59248 8.87524C4.24387 9.42125 5.08354 9.75 6 9.75C8.07107 9.75 9.75 8.07107 9.75 6C9.75 5.06155 9.40528 4.20361 8.83555 3.54591C8.89984 3.62011 8.96126 3.69687 9.01964 3.776L9.82207 2.97357C10.4813 3.80499 10.875 4.85652 10.875 6ZM9.02659 2.17806C8.19514 1.51875 7.14355 1.125 6 1.125C4.85648 1.125 3.80492 1.51872 2.97349 2.17799L3.77592 2.98043C4.39817 2.52135 5.1674 2.25 6 2.25C6.83264 2.25 7.6019 2.52137 8.22416 2.98049L9.02659 2.17806ZM2.98049 8.22417C2.52137 7.60191 2.25 6.83264 2.25 6C2.25 5.1674 2.52134 4.39817 2.98043 3.77592L2.17799 2.97349C1.51872 3.80493 1.125 4.85649 1.125 6C1.125 7.14356 1.51874 8.19515 2.17806 9.0266L2.98049 8.22417ZM8.625 6C8.625 7.44975 7.44975 8.625 6 8.625C4.55025 8.625 3.375 7.44975 3.375 6C3.375 4.55025 4.55025 3.375 6 3.375C7.44975 3.375 8.625 4.55025 8.625 6Z" fill="#6C7688"/>
    </svg>
  );
}

// Cancel/close icon for assistant header (12x12)
function AssistantCloseIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M1.24896 1.24896C1.5809 0.917014 2.1191 0.917014 2.45104 1.24896L6 4.79792L9.54896 1.24896C9.88091 0.917014 10.4191 0.917014 10.751 1.24896C11.083 1.5809 11.083 2.1191 10.751 2.45104L7.20208 6L10.751 9.54896C11.083 9.88091 11.083 10.4191 10.751 10.751C10.4191 11.083 9.88091 11.083 9.54896 10.751L6 7.20208L2.45104 10.751C2.1191 11.083 1.5809 11.083 1.24896 10.751C0.917014 10.4191 0.917014 9.88091 1.24896 9.54896L4.79792 6L1.24896 2.45104C0.917014 2.1191 0.917014 1.5809 1.24896 1.24896Z" fill="#6C7688"/>
    </svg>
  );
}

// Send icon for assistant input
function SendIcon({ disabled = false }: { disabled?: boolean }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 1L6 11M6 1L2 5M6 1L10 5" stroke={disabled ? "#99A5B8" : "#6C7688"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function ArrowUpDownIcon({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M2.34975 9.91465C2.67304 9.55546 3.22629 9.52634 3.58548 9.84962L8.00003 13.8228L12.4149 9.84961C12.7741 9.52634 13.3273 9.55547 13.6506 9.91467C13.9739 10.2739 13.9448 10.8271 13.5856 11.1504L8.58534 15.6504C8.41896 15.8001 8.20949 15.875 8.00003 15.875C7.79054 15.875 7.58105 15.8001 7.41466 15.6504L2.41478 11.1504C2.05559 10.8271 2.02647 10.2738 2.34975 9.91465Z" fill="#474E5A"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M7.41466 0.349625C7.58105 0.199871 7.79054 0.124995 8.00003 0.125C8.20949 0.125005 8.41896 0.199873 8.58534 0.349605L13.5856 4.84961C13.9448 5.17287 13.9739 5.72613 13.6506 6.08533C13.3273 6.44453 12.7741 6.47366 12.4149 6.15039L8.00003 2.17719L3.58548 6.15038C3.22629 6.47366 2.67304 6.44454 2.34975 6.08535C2.02647 5.72616 2.05559 5.17291 2.41478 4.84962L7.41466 0.349625Z" fill="#474E5A"/>
    </svg>
  );
}

// Custom Checkbox component matching Figma design
function Checkbox({ 
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
        <svg 
          width="8" 
          height="2" 
          viewBox="0 0 8 2" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M1 1H7" 
            stroke="white" 
            strokeWidth="1.5" 
            strokeLinecap="round"
          />
        </svg>
      ) : checked ? (
        <svg 
          width="10" 
          height="8" 
          viewBox="0 0 10 8" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M1 4L3.5 6.5L9 1" 
            stroke="white" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      ) : null}
    </button>
  );
}

// Shared Permission Card Content component (just the text content, no badge)
function PermissionCardContent({
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
  // Get other groups this permission belongs to (excluding current group)
  const getOtherGroups = (): string[] => {
    if (!currentGroup || !groupBy) return [];
    
    if (groupBy === "taskCategory") {
      return permission.taskCategories.filter(tc => tc !== currentGroup);
    }
    // For other multi-value groupings like sensitivity, add similar logic here
    return [];
  };

  const otherGroups = getOtherGroups();

  return (
    <div className={`flex-1 min-w-0 flex flex-col ${insideGroup ? "gap-0.5" : "gap-2"}`}>
      {/* Top section: title and description */}
      <div className="flex flex-col">
        <h4 className="font-semibold text-[#353A44] text-[13px] leading-[19px] tracking-[-0.15px]">
          {permission.displayName}
        </h4>
        <p className="text-[13px] text-[#596171] leading-[19px]">
          {permission.description}
        </p>
      </div>
      {/* Task categories as plain text */}
      {showTaskCategories && permission.taskCategories.length > 0 && (
        <p className="text-[12px] text-[#596171] leading-4">
          Task: {permission.taskCategories.join(', ')}
        </p>
      )}
      {/* Show other groups when permission appears in multiple groups */}
      {otherGroups.length > 0 && (
        <p className="text-[12px] text-[#596171] leading-4">
          Also in: {otherGroups.join(', ')}
        </p>
      )}
    </div>
  );
}

// Helper to get access label from actions string
function getAccessLabel(actions: string): { label: string; hasWrite: boolean } {
  const lower = actions.toLowerCase();
  if (lower.includes('write') && lower.includes('read')) {
    return { label: 'Read/Write', hasWrite: true };
  }
  if (lower.includes('write')) {
    return { label: 'Write', hasWrite: true };
  }
  return { label: 'Read', hasWrite: false };
}

// Access options for permissions that support both read and write
const accessOptions: { value: string; label: string }[] = [
  { value: "read", label: "Read" },
  { value: "write", label: "Write" },
  { value: "read, write", label: "Read/Write" },
];

// Inline access selector for permission cards
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
        onClick={(e) => {
          e.stopPropagation();
          if (!disabled) popover.toggle();
        }}
        className={`flex items-center gap-1 text-[12px] font-medium px-2 py-0.5 rounded flex-shrink-0 transition-colors ${
          showPlaceholder
            ? "bg-[#F5F6F8] text-[#596171] border border-dashed border-[#D8DEE4] hover:bg-[#EBEEF1]"
            : hasWrite
            ? "bg-[#D3F8DF] text-[#1D7C4D] hover:bg-[#C0F0D0]"
            : "bg-[#D4E5FF] text-[#0055BC] hover:bg-[#C4D8F8]"
        } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      >
        <span>{label}</span>
        {!disabled && <ArrowUpDownIcon size={10} />}
      </button>

      {popover.isVisible && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={(e) => {
              e.stopPropagation();
              popover.close();
            }} 
          />
          <div className={`absolute top-full right-0 mt-1 bg-white border border-[#D8DEE4] rounded-[8px] shadow-[0_15px_35px_rgba(48,49,61,0.08),0_5px_15px_rgba(0,0,0,0.12)] z-20 min-w-[100px] p-1 overflow-hidden ${popover.animationClass}`}>
            {accessOptions.map((option) => (
              <button
                key={option.value}
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(option.value);
                  popover.close();
                }}
                className={`w-full flex items-center justify-between gap-2 px-2.5 py-1.5 text-[12px] leading-4 text-[#353A44] rounded transition-colors ${
                  value === option.value && !showPlaceholder ? "bg-[#F5F6F8]" : "hover:bg-[#F5F6F8]"
                }`}
              >
                <span className={value === option.value && !showPlaceholder ? "font-semibold" : ""}>
                  {option.label}
                </span>
                {value === option.value && !showPlaceholder && <CheckCircleFilledIcon size={10} />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// Unified Permission Card component for both main view and customize modal
function PermissionCard({
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
  pendingAccess?: string;  // For available permissions - tracks access selection before adding
  onPendingAccessChange?: (access: string) => void;
  isExiting?: boolean;
  disabled?: boolean;  // For required permissions that can't be toggled
  insideGroup?: boolean;
  isInactive?: boolean;  // For "show all" mode - permission not assigned to current role
}) {
  // Default to permission's actions if not provided
  const { label: defaultLabel, hasWrite: defaultHasWrite } = getAccessLabel(permission.actions);
  const finalLabel = isInactive ? undefined : (accessLabel ?? defaultLabel);
  const finalHasWrite = isInactive ? false : (hasWrite ?? defaultHasWrite);
  
  // Check if permission supports multiple access levels
  const supportsMultipleAccess = permission.actions.toLowerCase().includes("read") && 
                                  permission.actions.toLowerCase().includes("write");
  
  // For available permissions with multiple access options, check if access has been selected
  const needsAccessSelection = !isChecked && supportsMultipleAccess && onPendingAccessChange;
  const hasSelectedAccess = pendingAccess && pendingAccess !== "";
  const isCheckboxDisabled = needsAccessSelection && !hasSelectedAccess;

  // Render access badge or selector
  const renderAccessBadge = () => {
    // For inactive permissions in "show all" mode
    if (isInactive) {
      return (
        <span className="text-[12px] font-medium px-2 py-0.5 rounded flex-shrink-0 bg-[#F0F1F3] text-[#818DA0]">
          No access
        </span>
      );
    }

    // For available permissions that need access selection - show placeholder selector
    if (needsAccessSelection) {
      return (
        <AccessSelector
          value={pendingAccess || ""}
          onChange={onPendingAccessChange!}
          showPlaceholder={!hasSelectedAccess}
        />
      );
    }
    
    // Show selector in customize mode (when onAccessChange is provided) and permission supports both read and write
    if (onAccessChange && supportsMultipleAccess && currentAccess) {
      return (
        <AccessSelector
          value={currentAccess}
          onChange={onAccessChange}
        />
      );
    }
    
    // Show static badge
    return (
      <span
        className={`text-[12px] font-medium px-2 py-0.5 rounded flex-shrink-0 ${
          finalHasWrite
            ? "bg-[#D3F8DF] text-[#1D7C4D]"
            : "bg-[#D4E5FF] text-[#0055BC]"
        }`}
      >
        {currentAccess ? getAccessLabel(currentAccess).label : finalLabel}
      </span>
    );
  };

  // Determine if checkbox should be disabled (either because it's a required permission or needs access selection)
  const checkboxDisabled = disabled || isCheckboxDisabled;

  const cardContent = (
    <>
      {showCheckbox && (
        <div className="self-center">
          {isCheckboxDisabled && !disabled ? (
            <Tooltip content="Choose access level first" position="above">
              <Checkbox
                checked={isChecked}
                onChange={() => {}}
                disabled={true}
              />
            </Tooltip>
          ) : disabled ? (
            <Tooltip content="Required permission" position="above">
              <Checkbox
                checked={isChecked}
                onChange={() => {}}
                disabled={true}
              />
            </Tooltip>
          ) : (
            <Checkbox
              checked={isChecked}
              onChange={() => onToggle?.()}
            />
          )}
        </div>
      )}
      <PermissionCardContent 
        permission={permission} 
        showTaskCategories={showTaskCategories} 
        currentGroup={currentGroup} 
        groupBy={groupBy}
        insideGroup={insideGroup}
        isInactive={isInactive}
      />
      {renderAccessBadge()}
    </>
  );

  // Clickable version for modal
  if (showCheckbox && onToggle) {
    return (
      <div
        onClick={() => !checkboxDisabled && onToggle()}
        className={`relative flex items-start gap-4 p-4 bg-[#F5F6F8] transition-all duration-150 before:absolute before:inset-0 before:rounded before:transition-colors ${
          checkboxDisabled ? 'cursor-default' : 'hover:before:bg-[#EBEEF1] cursor-pointer'
        } ${isExiting ? 'animate-scale-out' : ''}`}
      >
        <div className="relative z-10 flex items-start gap-4 w-full">{cardContent}</div>
      </div>
    );
  }

  // Static version for main view
  return (
    <div className={`flex items-start transition-colors ${
      insideGroup
        ? "gap-2 py-3 px-2"
        : "gap-4 p-4 bg-[#F5F6F8] rounded"
    }`}>
      {cardContent}
    </div>
  );
}

function CheckCircleFilledIcon({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM12.2803 6.28027C12.5732 5.98738 12.5732 5.51251 12.2803 5.21961C11.9874 4.92672 11.5125 4.92672 11.2196 5.21961L6.99994 9.43928L5.03027 7.46961C4.73738 7.17672 4.26251 7.17672 3.96961 7.46961C3.67672 7.76251 3.67672 8.23738 3.96961 8.53027L6.46961 11.0303C6.76251 11.3232 7.23738 11.3232 7.53027 11.0303L12.2803 6.28027Z" fill="#474E5A"/>
    </svg>
  );
}

// Risk Assessment Card component
function RiskBadge({ level, score }: { level: RiskLevel; score?: number }) {
  const styles: Record<RiskLevel, string> = {
    Low: "bg-[#D3F8DF] text-[#1D7C4D]",
    Medium: "bg-[#FEF6D4] text-[#8A6100]",
    High: "bg-[#FFE4E4] text-[#CD3131]",
  };
  return (
    <span className={`inline-flex items-center text-[12px] font-normal px-2 py-0.5 rounded leading-4 ${styles[level]}`}>
      {level}{score !== undefined && ` ${score}/100`}
    </span>
  );
}

function RiskAssessmentCard({ 
  assessment, 
  showAdvice = false,
  isExpanded = true,
  onToggle,
}: { 
  assessment: RiskAssessment; 
  showAdvice?: boolean;
  isExpanded?: boolean;
  onToggle?: () => void;
}) {
  return (
    <div>
      {/* Header with overall risk */}
      <button 
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-3 cursor-pointer hover:opacity-80 transition-opacity"
      >
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-semibold text-[#353A44] leading-[19px] tracking-[-0.15px]">Risk Assessment</span>
          <span className={`w-2 h-2 rounded-full ${
            assessment.overallRisk === "High" ? "bg-[#DF1B41]" :
            assessment.overallRisk === "Medium" ? "bg-[#D97706]" :
            "bg-[#1D7C4D]"
          }`} />
        </div>
        <ChevronDown 
          className="w-4 h-4 text-[#474E5A] transition-transform duration-200"
          style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>

      {/* Collapsible content */}
      <div 
        className="grid transition-[grid-template-rows] duration-200"
        style={{ gridTemplateRows: isExpanded ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          <div className="pt-4 space-y-4">
            {/* Risk Factors Table */}
            {assessment.factors.length > 0 && (
              <table className="w-full text-[13px]">
                <tbody className="divide-y divide-[#EBEEF1]">
                  {assessment.factors.map((factor, i) => (
                    <tr key={i}>
                      <td className="py-2 text-[#353A44]">
                        <span className="font-medium">{factor.name}</span>
                        <p className="text-[12px] text-[#596171] mt-0.5">{factor.description}</p>
                      </td>
                      <td className="py-2 align-top text-right">
                        <RiskBadge level={factor.level} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* Warnings & Recommendations - only shown when customizing */}
            {showAdvice && (assessment.warnings.length > 0 || assessment.recommendations.length > 0) && (
              <div className="flex flex-col gap-3 text-[13px]">
                {assessment.warnings.length > 0 && (
                  <div>
                    <div className="font-medium text-[#353A44] mb-1">Warnings</div>
                    <ul className="space-y-0.5 text-[#596171]">
                      {assessment.warnings.map((warning, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-[#596171]">•</span>
                          {warning}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {assessment.recommendations.length > 0 && (
                  <div>
                    <div className="font-medium text-[#353A44] mb-1">Recommendations</div>
                    <ul className="space-y-0.5 text-[#596171]">
                      {assessment.recommendations.map((rec, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-[#596171]">•</span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Office/Org icon SVG
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
import {
  roleCategories,
  allRoles,
  getPermissionsForRole,
  groupPermissions,
  getAllPermissions,
  generateRoleDetails,
  generateRiskAssessment,
  generateRoleDescription,
  GROUP_DESCRIPTIONS,
  type Role,
  type Permission,
  type RoleDetails,
  type RiskAssessment,
  type RiskLevel,
} from "@/lib/data";

type SandboxModeState = {
  active: boolean;
  role: Role | null;
  unsavedRole?: Role | null;
  sourceModal?: "customize" | "create" | "menu";
  modalState?: {
    roleName: string;
    customDescription: string;
    permissionAccess: Record<string, string>;
    selectedBaseRole?: Role | null;
  };
};

// Tooltip component
function Tooltip({ children, content, position: pos = "below" }: { children: React.ReactNode; content: string; position?: "above" | "below" }) {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLSpanElement>(null);
  
  const handleMouseEnter = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      if (pos === "above") {
        setTooltipPosition({
          top: rect.top - 8,
          left: rect.left + rect.width / 2,
        });
      } else {
        setTooltipPosition({
          top: rect.bottom + 8,
          left: rect.left + rect.width / 2,
        });
      }
    }
    setIsVisible(true);
  };
  
  return (
    <span 
      ref={triggerRef}
      className="inline-flex items-center"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div 
          className={`fixed z-[9999] px-4 py-3 bg-white border border-[#D8DEE4] rounded-lg shadow-[0px_2px_5px_rgba(64,68,82,0.08),0px_3px_9px_rgba(64,68,82,0.08)] whitespace-nowrap -translate-x-1/2 ${pos === "above" ? "-translate-y-full" : ""}`}
          style={{ top: tooltipPosition.top, left: tooltipPosition.left }}
        >
          <p className="text-[13px] text-[#353A44] leading-[19px] tracking-[-0.15px]" style={{ fontFeatureSettings: "'lnum', 'pnum'" }}>
            {content}
          </p>
        </div>
      )}
    </span>
  );
}

// Shared Dropdown component
function Dropdown<T extends string>({
  value,
  onChange,
  options,
  width = 120,
}: {
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: string }[];
  width?: number;
}) {
  const popover = usePopover();
  const selectedLabel = options.find((o) => o.value === value)?.label || options[0]?.label;

  return (
    <div className="relative">
      {/* Trigger button */}
      <button
        onClick={() => popover.toggle()}
        className="flex items-center justify-between gap-2 text-[13px] font-semibold leading-[19px] tracking-[-0.15px] border border-[#D8DEE4] rounded-md px-2 py-1 min-h-[28px] bg-white text-[#353A44] hover:bg-[#F5F6F8] transition-colors shadow-[0_1px_1px_rgba(33,37,44,0.16)]"
        style={{ width }}
      >
        <span>{selectedLabel}</span>
        <ArrowUpDownIcon size={12} />
      </button>

      {/* Dropdown popover */}
      {popover.isVisible && (
        <>
          {/* Backdrop to close dropdown */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => popover.close()} 
          />
          {/* Popover - with 4px internal padding */}
          <div className={`absolute top-full left-0 mt-1 bg-white border border-[#D8DEE4] rounded-[8px] shadow-[0_15px_35px_rgba(48,49,61,0.08),0_5px_15px_rgba(0,0,0,0.12)] z-20 min-w-[168px] p-1 overflow-hidden ${popover.animationClass}`} style={{ "--popover-origin": "top left" } as React.CSSProperties}>
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  popover.close();
                }}
                className={`w-full flex items-center justify-between gap-3 px-2.5 py-1.5 text-[13px] leading-[19px] tracking-[-0.15px] text-[#353A44] rounded transition-colors ${
                  value === option.value ? "bg-[#F5F6F8]" : "hover:bg-[#F5F6F8]"
                }`}
              >
                <span className={value === option.value ? "font-semibold" : ""}>
                  {option.label}
                </span>
                {value === option.value && <CheckCircleFilledIcon size={12} />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

type GroupByOption = "alphabetical" | "productCategory" | "taskCategory" | "operationType" | "riskLevel" | "sensitivity";

const groupByOptions: { value: GroupByOption; label: string }[] = [
  { value: "productCategory", label: "Product" },
  { value: "taskCategory", label: "Task" },
  { value: "operationType", label: "Operation" },
  { value: "riskLevel", label: "Risk" },
  { value: "sensitivity", label: "Sensitivity" },
  { value: "alphabetical", label: "Alphabetical" },
];

// When grouped, alphabetical doesn't make sense (no groups to collapse)
const groupedGroupByOptions: { value: GroupByOption; label: string }[] = [
  { value: "productCategory", label: "Product" },
  { value: "taskCategory", label: "Task" },
  { value: "operationType", label: "Operation" },
  { value: "riskLevel", label: "Risk" },
  { value: "sensitivity", label: "Sensitivity" },
];

// When ungrouped, all options are available
const ungroupedGroupByOptions = groupByOptions;

// Role overflow menu component
function RoleMenu({ 
  onDuplicate, 
  onEdit,
  isCustomRole = false,
  onDelete,
  onTestInSandbox,
}: { 
  onDuplicate: () => void;
  onEdit?: () => void;
  isCustomRole?: boolean;
  onDelete?: () => void;
  onTestInSandbox?: () => void;
}) {
  const popover = usePopover();

  const menuItems = isCustomRole
    ? [
        // Custom roles: Edit, Duplicate, Test in sandbox, Delete
        ...(onEdit ? [{ label: "Edit", onClick: onEdit }] : []),
        { label: "Duplicate", onClick: onDuplicate },
        { label: "Test in sandbox", onClick: () => onTestInSandbox?.() },
        ...(onDelete ? [{ label: "Delete", onClick: onDelete, danger: true }] : []),
      ]
    : [
        // Standard roles: Duplicate and customize (creates copy), Test in sandbox
        { label: "Duplicate and customize", onClick: onDuplicate },
        { label: "Test in sandbox", onClick: () => onTestInSandbox?.() },
      ];

  return (
    <div className="relative">
      <button
        onClick={() => popover.toggle()}
        className="p-1 rounded-md hover:bg-[#EBEEF1] transition-colors"
      >
        <MoreHorizontal className="w-5 h-5 text-[#474E5A]" />
      </button>

      {popover.isVisible && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => popover.close()} 
          />
          <div className={`absolute top-full right-0 mt-1 bg-white border border-[#D8DEE4] rounded-[8px] shadow-[0_5px_15px_rgba(0,0,0,0.12),0_15px_35px_rgba(48,49,61,0.08)] z-20 whitespace-nowrap overflow-hidden ${popover.animationClass}`}>
            <div className="p-1 flex flex-col">
              {menuItems.map((item, index) => (
                <React.Fragment key={item.label}>
                  <button
                    onClick={() => {
                      item.onClick();
                      popover.close();
                    }}
                    className={`w-full text-left px-[10px] py-[6px] text-[13px] leading-[19px] tracking-[-0.15px] rounded transition-colors ${
                      item.danger 
                        ? "text-[#C0123C] hover:bg-[#FEF2F4]" 
                        : "text-[#353A44] hover:bg-[#F5F6F8]"
                    }`}
                  >
                    {item.label}
                  </button>
                </React.Fragment>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function ControlIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M11.5 8C13.433 8 15 9.567 15 11.5C15 13.433 13.433 15 11.5 15C9.82456 15 8.42548 13.8224 8.08203 12.25H2.625C2.21079 12.25 1.875 11.9142 1.875 11.5C1.875 11.0858 2.21079 10.75 2.625 10.75H8.08203C8.42548 9.17757 9.82456 8.00001 11.5 8ZM11.5 9.5C10.3954 9.50001 9.5 10.3954 9.5 11.5C9.5 12.6046 10.3954 13.5 11.5 13.5C12.6046 13.5 13.5 12.6046 13.5 11.5C13.5 10.3954 12.6046 9.5 11.5 9.5Z" fill="currentColor"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M4.5 1C6.17545 1 7.57452 2.17756 7.91797 3.75H13.375C13.7892 3.75 14.125 4.08579 14.125 4.5C14.125 4.91421 13.7892 5.25 13.375 5.25H7.91797C7.57452 6.82244 6.17545 8 4.5 8C2.567 8 1 6.433 1 4.5C1 2.567 2.567 1 4.5 1ZM4.5 2.5C3.39543 2.5 2.5 3.39543 2.5 4.5C2.5 5.60457 3.39543 6.5 4.5 6.5C5.60457 6.5 6.5 5.60457 6.5 4.5C6.5 3.39543 5.60457 2.5 4.5 2.5Z" fill="currentColor"/>
    </svg>
  );
}

// Permissions filter menu with toggle options and group-by selector
function PermissionsFilterMenu({
  showAll,
  onShowAllChange,
  isGrouped,
  onGroupedChange,
  groupBy,
  onGroupByChange,
}: {
  showAll?: boolean;
  onShowAllChange?: (v: boolean) => void;
  isGrouped: boolean;
  onGroupedChange: (v: boolean) => void;
  groupBy: GroupByOption;
  onGroupByChange: (v: GroupByOption) => void;
}) {
  const popover = usePopover();
  const options = isGrouped ? groupedGroupByOptions : ungroupedGroupByOptions;

  const currentLabel = options.find(o => o.value === groupBy)?.label || groupBy;

  return (
    <div className="relative flex items-center gap-1">
      <button
        onClick={() => popover.toggle()}
        className="flex items-center gap-1 cursor-pointer"
      >
        <span className="text-[13px] font-semibold text-[#596171] leading-[19px]">View by: <span className="text-[#635BFF]">{currentLabel}</span></span>
        <span className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-[#EBEEF1] transition-colors">
          <ControlIcon className="w-3 h-3 text-[#474E5A]" />
        </span>
      </button>

      {popover.isVisible && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => popover.close()}
          />
          <div className={`absolute top-full right-0 mt-1 bg-white border border-[#D8DEE4] rounded-[8px] shadow-[0_5px_15px_rgba(0,0,0,0.12),0_15px_35px_rgba(48,49,61,0.08)] z-20 whitespace-nowrap overflow-hidden ${popover.animationClass}`}>
            <div className="p-2 flex flex-col">
              <div className="px-2 py-1.5">
                <span className="text-[12px] font-semibold text-[#818DA0] leading-4 tracking-[-0.024px] uppercase">View by</span>
              </div>
              {options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    onGroupByChange(option.value);
                  }}
                  className={`w-full flex items-center justify-between gap-3 px-2 py-1.5 text-[13px] leading-[19px] tracking-[-0.15px] text-[#353A44] rounded transition-colors ${
                    groupBy === option.value ? "bg-[#F5F6F8]" : "hover:bg-[#F5F6F8]"
                  }`}
                >
                  <span className={groupBy === option.value ? "font-semibold" : ""}>
                    {option.label}
                  </span>
                  {groupBy === option.value && <CheckCircleFilledIcon size={12} />}
                </button>
              ))}
              <div className="h-px bg-[#EBEEF1] my-1" />
              <div className="flex items-center justify-between gap-6 px-2 py-1.5 cursor-pointer" onClick={() => onGroupedChange(!isGrouped)}>
                <span className="text-[13px] text-[#353A44] leading-[19px] tracking-[-0.15px]">Bundle permissions</span>
                <div onClick={(e) => e.stopPropagation()}>
                  <ToggleSwitch checked={isGrouped} onChange={onGroupedChange} />
                </div>
              </div>
              {showAll !== undefined && onShowAllChange && (
                <div className="flex items-center justify-between gap-6 px-2 py-1.5 cursor-pointer" onClick={() => onShowAllChange(!showAll)}>
                  <span className="text-[13px] text-[#353A44] leading-[19px] tracking-[-0.15px]">Hide inactive permissions</span>
                  <div onClick={(e) => e.stopPropagation()}>
                    <ToggleSwitch checked={!showAll} onChange={(v) => onShowAllChange(!v)} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// AI Assistant Drawer Component
function AIAssistantDrawer({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean; 
  onClose: () => void;
}) {
  const [inputValue, setInputValue] = useState("");
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);

  const handleSubmit = () => {
    if (inputValue.trim()) {
      setSubmittedMessage(inputValue.trim());
      setInputValue("");
    }
  };
  
  return (
    <div 
      className={`bg-white flex flex-col h-full overflow-hidden rounded-tr-[12px] rounded-br-[12px] ${
        isOpen ? 'w-[360px] opacity-100' : 'w-0 opacity-0'
      }`}
      style={{
        transition: 'width 400ms cubic-bezier(0.4, 0, 0.2, 1), opacity 300ms cubic-bezier(0.4, 0, 0.2, 1)'
      }}
    >
      {isOpen && (
        <>
          {/* Header - matching Figma exactly */}
          <div className="flex items-center gap-2.5 px-4 pt-[18px] pb-3 border-b border-[#EBEEF1] shrink-0">
            <div className="flex items-center gap-2 flex-1 h-9">
              <SparkleIcon />
              <span className="text-[16px] font-bold text-[#21252C] leading-6 tracking-[-0.31px]" style={{ fontFeatureSettings: "'lnum', 'pnum'" }}>
                Assistant
              </span>
            </div>
            {/* Actions - 68px wide with 16px gap between icons */}
            <div className="flex items-center gap-4 w-[68px]">
              <button className="hover:bg-[#F5F6F8] rounded transition-colors p-0.5">
                <AssistantMoreIcon />
              </button>
              <button className="hover:bg-[#F5F6F8] rounded transition-colors p-0.5">
                <AssistantSupportIcon />
              </button>
              <button 
                onClick={onClose}
                className="hover:bg-[#F5F6F8] rounded transition-colors p-0.5"
              >
                <AssistantCloseIcon />
              </button>
            </div>
          </div>

          {/* Body - with wave background */}
          <div className="flex-1 flex flex-col gap-6 p-4 overflow-hidden relative">
            {/* Wave background from Figma */}
            <div 
              className="absolute pointer-events-none"
              style={{
                width: '516.214px',
                height: '526.205px',
                left: '-39.91px',
                top: '-230.4px',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={`${process.env.NODE_ENV === 'production' ? '/uvp' : ''}/waves.svg`}
                alt="" 
                className="w-full h-full"
              />
            </div>
            
            {/* Content */}
            <div className="relative z-10 flex flex-col gap-4 flex-1 overflow-y-auto">
              {!submittedMessage ? (
                <p className="text-[13px] text-[#353A44] leading-[19px] tracking-[-0.15px]">
                  Describe how you want to customize this role and I'll add or remove the appropriate permissions.
                </p>
              ) : (
                <>
                  {/* User message */}
                  <div className="flex justify-end">
                    <div className="bg-[#635BFF] text-white rounded-[12px] rounded-br-[4px] px-3 py-2 max-w-[85%]">
                      <p className="text-[13px] leading-[19px] tracking-[-0.15px]">{submittedMessage}</p>
                    </div>
                  </div>
                  {/* Assistant response */}
                  <div className="flex justify-start">
                    <div className="bg-[#F5F6F8] text-[#353A44] rounded-[12px] rounded-bl-[4px] px-3 py-2 max-w-[85%]">
                      <p className="text-[13px] leading-[19px] tracking-[-0.15px]">
                        Stripe Assistant has not been implemented for this prototype.
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Input area */}
          <div className="flex flex-col gap-3 p-4 shrink-0">
            <div className="bg-white rounded-[12px] shadow-[0px_0px_35px_0px_rgba(48,49,61,0.08),0px_0px_15px_0px_rgba(0,0,0,0.12)] flex items-start min-h-[40px] overflow-hidden pl-4 pr-2 py-2">
              <div className="flex-1 flex items-center">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit();
                    }
                  }}
                  placeholder="Describe the role"
                  className="flex-1 text-[13px] text-[#353A44] leading-[19px] tracking-[-0.15px] bg-transparent outline-none resize-none placeholder:text-[#818DA0] min-h-[68px] py-1"
                />
              </div>
              <div className="flex flex-col h-full items-end justify-end">
                <button 
                  onClick={handleSubmit}
                  className="shrink-0 w-7 h-7 rounded-full bg-[#EBEEF1] flex items-center justify-center hover:bg-[#D8DEE4] transition-colors"
                  disabled={!inputValue.trim()}
                >
                  <SendIcon disabled={!inputValue.trim()} />
                </button>
              </div>
            </div>
            <p className="text-[12px] text-[#596171] leading-4 text-center">
              AI may make mistakes. Verify important information.
            </p>
          </div>
        </>
      )}
    </div>
  );
}

// Shared base for collapsible group cards (used by GroupCard and CustomizeGroupCard)
function BaseGroupCard({
  groupName,
  description,
  countLabel,
  isFirst = false,
  isLast = false,
  defaultExpanded = false,
  headerLeft,
  children,
  invertColors = false,
  useDividers = false,
}: {
  groupName: string;
  description?: string;
  countLabel: string;
  isFirst?: boolean;
  isLast?: boolean;
  defaultExpanded?: boolean;
  headerLeft?: React.ReactNode;
  children: React.ReactNode;
  invertColors?: boolean;
  useDividers?: boolean;
}) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const radiusClass = useDividers ? "" : (isFirst && isLast
    ? "rounded-[4px]"
    : isFirst
    ? "rounded-t-[4px]"
    : isLast
    ? "rounded-b-[4px]"
    : "");

  const cardBg = useDividers ? "" : (invertColors ? "bg-white" : "bg-[#F5F6F8]");
  const badgeBg = useDividers ? "bg-[#F5F6F8]" : (invertColors ? "bg-[#F5F6F8]" : "bg-white");

  const titleContent = (
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2">
        <span className={`${useDividers ? 'text-[14px] leading-5' : 'text-[13px] leading-[19px]'} font-semibold text-[#353A44] tracking-[-0.15px] truncate`}>
          {groupName}
        </span>
        <span className={`inline-flex items-center justify-center min-w-[16px] h-[16px] px-1 ${badgeBg} text-[10px] font-semibold text-[#596171] leading-4 rounded-full text-center`}>
          {countLabel}
        </span>
      </div>
      {description && (
        <p className="text-[13px] text-[#596171] leading-[19px] line-clamp-2">
          {description}
        </p>
      )}
    </div>
  );

  const chevron = (
    <ChevronDown
      className={`${useDividers ? 'w-3.5 h-3.5' : 'w-4 h-4'} text-[#474E5A] flex-shrink-0 transition-transform duration-200 ${
        isExpanded ? "" : "-rotate-90"
      }`}
    />
  );

  return (
    <div className={`${cardBg} ${radiusClass} shrink-0 flex flex-col`}>
      {/* Header */}
      {headerLeft ? (
        <div className={`relative flex items-center gap-4 ${useDividers ? 'py-3 px-2 border-b border-[#D8DEE4]' : 'py-4 px-4'} before:absolute before:inset-0 before:rounded before:transition-colors hover:before:bg-[#EBEEF1]`}>
          <div className="relative z-10">{headerLeft}</div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="relative z-10 flex-1 flex items-center gap-4 text-left group min-w-0"
          >
            {titleContent}
            {chevron}
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`relative w-full flex items-center gap-4 ${useDividers ? 'py-3 px-2 border-b border-[#D8DEE4]' : 'py-4 px-4'} text-left group before:absolute before:inset-0 before:rounded before:transition-colors hover:before:bg-[#EBEEF1]`}
        >
          <span className="relative z-10 flex items-center gap-4 flex-1 min-w-0">{titleContent}</span>
          <span className="relative z-10">{chevron}</span>
        </button>
      )}

      {/* Collapsible permissions */}
      <div
        className="grid transition-[grid-template-rows] duration-200 ease-in-out"
        style={{ gridTemplateRows: isExpanded ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          <div className={`flex flex-col divide-y divide-[#D8DEE4] ${useDividers ? 'pl-4 pb-2' : 'mx-5 pb-2 border-t border-[#D8DEE4]'}`}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

// Group card for the customize modal - includes group-level checkbox
function CustomizeGroupCard({
  groupName,
  description,
  permissions: perms,
  checkState,
  onToggleGroup,
  permissionAccess,
  onTogglePermission,
  onAccessChange,
  defaultExpanded = false,
  isFirst = false,
  isLast = false,
}: {
  groupName: string;
  description?: string;
  permissions: Permission[];
  checkState: "all" | "none" | "some";
  onToggleGroup: () => void;
  permissionAccess: Record<string, string>;
  onTogglePermission: (apiName: string) => void;
  onAccessChange: (apiName: string, access: string) => void;
  defaultExpanded?: boolean;
  isFirst?: boolean;
  isLast?: boolean;
}) {
  const REQUIRED_PERMISSION = "dashboard_baseline";

  return (
    <BaseGroupCard
      groupName={groupName}
      description={description}
      countLabel={`${perms.filter(p => p.apiName in permissionAccess).length} of ${perms.length}`}
      isFirst={isFirst}
      isLast={isLast}
      defaultExpanded={defaultExpanded}
      headerLeft={
        <Checkbox
          checked={checkState === "all"}
          indeterminate={checkState === "some"}
          onChange={onToggleGroup}
        />
      }
    >
      {perms.map((permission) => {
        const isChecked = permission.apiName in permissionAccess;
        const isRequired = permission.apiName === REQUIRED_PERMISSION;
        const currentAccess = permissionAccess[permission.apiName];
        const supportsMultipleAccess = permission.actions.toLowerCase().includes("read") && 
                                        permission.actions.toLowerCase().includes("write");

        return (
          <div
            key={permission.apiName}
            onClick={() => !isRequired && onTogglePermission(permission.apiName)}
            className={`relative flex items-start gap-4 px-2 py-3 transition-all duration-150 before:absolute before:inset-0 before:rounded before:transition-colors ${
              isRequired ? 'cursor-default' : 'hover:before:bg-[#EBEEF1] cursor-pointer'
            }`}
          >
            <div className="relative z-10 self-center">
              {isRequired ? (
                <Tooltip content="Required permission" position="above">
                  <Checkbox
                    checked={isChecked}
                    onChange={() => {}}
                    disabled={true}
                  />
                </Tooltip>
              ) : (
                <Checkbox
                  checked={isChecked}
                  onChange={() => onTogglePermission(permission.apiName)}
                />
              )}
            </div>
            <div className="relative z-10 flex-1 min-w-0">
              <PermissionCardContent
                permission={permission}
                showTaskCategories={false}
                currentGroup={groupName}
                groupBy="productCategory"
                insideGroup
              />
            </div>
            {/* Access badge */}
            <div className="relative z-10 flex-shrink-0">
            {isChecked && supportsMultipleAccess && currentAccess ? (
              <AccessSelector
                value={currentAccess}
                onChange={(access) => onAccessChange(permission.apiName, access)}
              />
            ) : (
              <span
                className={`text-[12px] font-medium px-2 py-0.5 rounded flex-shrink-0 ${
                  permission.actions.includes("write")
                    ? "bg-[#D3F8DF] text-[#1D7C4D]"
                    : "bg-[#D4E5FF] text-[#0055BC]"
                }`}
              >
                {currentAccess ? getAccessLabel(currentAccess).label : getAccessLabel(permission.actions).label}
              </span>
            )}
            </div>
          </div>
        );
      })}
    </BaseGroupCard>
  );
}

// Shared permissions panel for modal dialogs (CustomizeRoleModal & CreateRoleModal)
function ModalPermissionsPanel({
  isAssistantOpen,
  onOpenAssistant,
  isGrouped,
  onGroupedChange,
  groupBy,
  onGroupByChange,
  searchQuery,
  onSearchChange,
  selectedCount,
  totalCount,
  isAlphabetical,
  sortedGroupEntries,
  sortPermsInGroup,
  getGroupCheckState,
  toggleGroup,
  permissionAccess,
  togglePermission,
  updatePermissionAccess,
  pendingAccess,
  updatePendingAccess,
  hasResults,
}: {
  isAssistantOpen: boolean;
  onOpenAssistant: () => void;
  isGrouped: boolean;
  onGroupedChange: (on: boolean) => void;
  groupBy: GroupByOption;
  onGroupByChange: (v: GroupByOption) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCount: number;
  totalCount: number;
  isAlphabetical: boolean;
  sortedGroupEntries: [string, Permission[]][];
  sortPermsInGroup: (perms: Permission[]) => Permission[];
  getGroupCheckState: (perms: Permission[]) => "all" | "none" | "some";
  toggleGroup: (perms: Permission[]) => void;
  permissionAccess: Record<string, string>;
  togglePermission: (apiName: string) => void;
  updatePermissionAccess: (apiName: string, access: string) => void;
  pendingAccess: Record<string, string>;
  updatePendingAccess: (apiName: string, access: string) => void;
  hasResults: boolean;
}) {
  const REQUIRED_PERMISSION = "dashboard_baseline";

  return (
    <div
      className={`${isAssistantOpen ? 'flex-1' : 'flex-[2]'} bg-white rounded-lg shadow-[0_7px_14px_0_rgba(48,49,61,0.08),0_3px_6px_0_rgba(0,0,0,0.12)] p-4 flex flex-col gap-4 overflow-hidden min-w-0`}
      style={{ transition: 'flex 400ms cubic-bezier(0.4, 0, 0.2, 1)' }}
    >
      {/* Permissions header */}
      <div className="flex items-center gap-2">
        <span className="text-[16px] font-bold text-[#353A44] leading-6 tracking-[-0.31px]" style={{ fontFeatureSettings: "'lnum', 'pnum'" }}>
          Permissions
        </span>
        {/* AI Assistant toggle button - invisible (not removed) when assistant is open to prevent layout shift */}
        <button
          onClick={onOpenAssistant}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[13px] font-medium transition-all duration-200 text-[#353A44] hover:bg-[#F5F6F8] border border-[#D8DEE4] bg-white shadow-[0px_1px_1px_0px_rgba(33,37,44,0.16)] ${
            isAssistantOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          <SparkleIcon />
          <span className="leading-5 tracking-[-0.15px]">Assistant</span>
        </button>
        <div className="ml-auto">
          <PermissionsFilterMenu
            isGrouped={isGrouped}
            onGroupedChange={onGroupedChange}
            groupBy={groupBy}
            onGroupByChange={onGroupByChange}
          />
        </div>
      </div>

      {/* Controls row - full width */}
      <div className="flex items-center gap-2">
        {/* Search field - spans full width */}
        <div className="flex-1 flex items-center gap-2 border border-[#D8DEE4] rounded-md px-2 py-1 min-h-[28px] bg-white form-focus-ring">
          <SearchIcon className="text-[#818DA0]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search"
            className="flex-1 text-[13px] text-[#353A44] leading-[19px] tracking-[-0.15px] bg-transparent outline-none placeholder:text-[#818DA0]"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="text-[#818DA0] hover:text-[#353A44] transition-colors"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Unified permission list */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <div className="flex items-center gap-2.5 py-4">
          <span className="flex-1 text-[12px] font-semibold text-[#353A44] leading-4 tracking-[-0.024px]">
            {selectedCount} of {totalCount} selected
          </span>
        </div>
        <div className={`flex-1 min-h-0 overflow-y-auto flex flex-col ${isGrouped ? "gap-1" : "gap-2"}`}>
          {isGrouped ? (
            /* Grouped view: CustomizeGroupCard for each group */
            sortedGroupEntries.map(([group, perms], idx) => (
              <CustomizeGroupCard
                key={group}
                groupName={group}
                description={GROUP_DESCRIPTIONS[groupBy]?.[group]}
                permissions={sortPermsInGroup(perms)}
                checkState={getGroupCheckState(perms)}
                onToggleGroup={() => toggleGroup(perms)}
                permissionAccess={permissionAccess}
                onTogglePermission={(apiName) => togglePermission(apiName)}
                onAccessChange={updatePermissionAccess}
                isFirst={idx === 0}
                isLast={idx === sortedGroupEntries.length - 1}
              />
            ))
          ) : (
            /* Ungrouped view: flat list with optional section headers */
            sortedGroupEntries.map(([group, perms]) => (
              <div key={group || "all"} className={isAlphabetical ? "" : "mb-3"}>
                {!isAlphabetical && group && (
                  <div className="flex items-center gap-2 mb-2">
                    <Checkbox
                      checked={getGroupCheckState(perms) === "all"}
                      indeterminate={getGroupCheckState(perms) === "some"}
                      onChange={() => toggleGroup(perms)}
                    />
                    <span className="text-[13px] font-semibold text-[#353A44] leading-[19px] tracking-[-0.15px]">
                      {group}
                    </span>
                    <span className="inline-flex items-center justify-center min-w-[16px] h-[16px] px-1 bg-[#F5F6F8] text-[10px] font-semibold text-[#596171] leading-4 rounded-full text-center">
                      {perms.filter(p => p.apiName in permissionAccess).length} of {perms.length}
                    </span>
                  </div>
                )}
                {sortPermsInGroup(perms).map(perm => {
                  const isChecked = perm.apiName in permissionAccess;
                  return (
                    <div key={perm.apiName} className="mb-2">
                      <PermissionCard
                        permission={perm}
                        showCheckbox
                        isChecked={isChecked}
                        onToggle={() => togglePermission(perm.apiName)}
                        currentGroup={group}
                        groupBy={groupBy}
                        disabled={perm.apiName === REQUIRED_PERMISSION}
                        currentAccess={isChecked ? permissionAccess[perm.apiName] : undefined}
                        onAccessChange={isChecked ? (access) => updatePermissionAccess(perm.apiName, access) : undefined}
                        pendingAccess={!isChecked ? pendingAccess[perm.apiName] : undefined}
                        onPendingAccessChange={!isChecked ? (access) => updatePendingAccess(perm.apiName, access) : undefined}
                      />
                    </div>
                  );
                })}
              </div>
            ))
          )}
          {!hasResults && (
            <div className="text-center py-8 text-[#596171] text-[13px] leading-[19px] tracking-[-0.15px]">
              No permissions match your search
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Customize Role Modal Component
function CustomizeRoleModal({
  isOpen,
  onClose,
  baseRole,
  onSave,
  onUpdate,
  initialGroupBy,
  mode = "create",
  onTestInSandbox,
  initialState,
}: {
  isOpen: boolean;
  onClose: () => void;
  baseRole: Role;
  onSave: (role: Role) => void;
  onUpdate?: (role: Role) => void;
  initialGroupBy: GroupByOption;
  mode?: "create" | "edit";
  onTestInSandbox?: (role: Role, modalState: { roleName: string; customDescription: string; permissionAccess: Record<string, string> }) => void;
  initialState?: { roleName: string; customDescription: string; permissionAccess: Record<string, string> };
}) {
  const isEditMode = mode === "edit";
  const allPermissions = getAllPermissions(); // ~50 consolidated permissions
  
  const [roleName, setRoleName] = useState(isEditMode ? baseRole.name : `${baseRole.name} (copy)`);
  const [isEditingName, setIsEditingName] = useState(false);
  const [customDescription, setCustomDescription] = useState("");
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  // Maps permission API name to access level ("read", "write", "read, write")
  const [permissionAccess, setPermissionAccess] = useState<Record<string, string>>({});
  // Tracks pending access selections for available permissions (before adding)
  const [pendingAccess, setPendingAccess] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [groupBy, setGroupBy] = useState<GroupByOption>("productCategory");
  const [isGrouped, setIsGrouped] = useState(true);
  const [isRiskExpandedModal, setIsRiskExpandedModal] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  // Capture initial permission state for stable sort order (active items on top, frozen after load)
  const initialAccessRef = useRef<Record<string, string>>({});

  // Handle close with fade-out animation
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 150); // Match animation duration
  };

  // Handle group toggle with auto-switch logic
  const handleGroupToggle = (on: boolean) => {
    setIsGrouped(on);
    if (on && groupBy === "alphabetical") {
      setGroupBy("productCategory");
    }
  };

  // Reset state when modal opens with new role (or restore from initialState if returning from sandbox)
  useEffect(() => {
    if (isOpen) {
      // If we have initialState (returning from sandbox), use it
      if (initialState) {
        setRoleName(initialState.roleName);
        setIsEditingName(false);
        setCustomDescription(initialState.customDescription);
        setIsEditingDescription(!!initialState.customDescription);
        setPermissionAccess(initialState.permissionAccess);
        initialAccessRef.current = { ...initialState.permissionAccess };
        setPendingAccess({});
        setSearchQuery("");
        setGroupBy("productCategory");
        setIsGrouped(true);
        return;
      }

      // Build permission access map from base role
      const accessMap: Record<string, string> = {};
      
      if (baseRole.permissionAccess) {
        // Custom role with permissionAccess - use it directly
        Object.assign(accessMap, baseRole.permissionAccess);
      } else if (baseRole.permissionApiNames) {
        // Legacy custom role with just API names - default to full access
        baseRole.permissionApiNames.forEach(apiName => {
          const perm = allPermissions.find(p => p.apiName === apiName);
          accessMap[apiName] = perm?.actions || "read";
        });
      } else {
        // Standard role - get access from roleAccess field
        const basePermissions = getPermissionsForRole(baseRole.id);
        basePermissions.forEach(p => {
          const roleAccess = p.roleAccess[baseRole.id];
          accessMap[p.apiName] = roleAccess || p.actions;
        });
      }
      
      // Ensure dashboard_baseline is always included (it's required)
      const dashboardBaseline = allPermissions.find(p => p.apiName === "dashboard_baseline");
      if (dashboardBaseline && !accessMap["dashboard_baseline"]) {
        accessMap["dashboard_baseline"] = "read";
      }
      
      setRoleName(isEditMode ? baseRole.name : `${baseRole.name} (copy)`);
      setIsEditingName(false);
      setCustomDescription(baseRole.customDescription || "");
      setIsEditingDescription(!!baseRole.customDescription);
      setPermissionAccess(accessMap);
      initialAccessRef.current = { ...accessMap };
      setPendingAccess({});
      setSearchQuery("");
      setGroupBy("productCategory");
      setIsGrouped(true);
    }
  }, [isOpen, baseRole.id, baseRole.permissionApiNames, baseRole.permissionAccess, baseRole.customDescription, initialState]);

  // Keyboard shortcuts: ESC to close, CMD+Enter to save
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // ESC to close modal
      if (e.key === "Escape") {
        e.preventDefault();
        handleClose();
      }
      // CMD+Enter (Mac) or Ctrl+Enter (Windows) to save
      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        // Compute selected permissions inside the handler
        const selectedApiNames = Object.keys(permissionAccess);
        const currentSelectedPermissions = allPermissions.filter(p => selectedApiNames.includes(p.apiName));
        const finalDetails = generateRoleDetails(currentSelectedPermissions);
        if (customDescription.trim()) {
          finalDetails.description = customDescription.trim();
        }
        
        if (isEditMode && onUpdate) {
          // Edit mode: update existing role
          const updatedRole: Role = {
            ...baseRole,
            name: roleName,
            details: finalDetails,
            permissionAccess: { ...permissionAccess },
            customDescription: customDescription.trim() || undefined,
          };
          onUpdate(updatedRole);
        } else {
          // Create mode: create new role
          const newRole: Role = {
            id: `custom_${Date.now()}`,
            name: roleName,
            category: "Custom",
            details: finalDetails,
            userCount: 0,
            permissionAccess: { ...permissionAccess },
            customDescription: customDescription.trim() || undefined,
          };
          onSave(newRole);
        }
        handleClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isEditMode, baseRole, roleName, customDescription, permissionAccess, allPermissions, onSave, onUpdate]);

  if (!isOpen) return null;

  const selectedApiNames = Object.keys(permissionAccess);
  const selectedPermissions = allPermissions.filter(p => selectedApiNames.includes(p.apiName));
  const availablePermissions = allPermissions.filter(p => !selectedApiNames.includes(p.apiName));
  
  // Filter by search
  const filterBySearch = (perms: Permission[]) => {
    if (!searchQuery) return perms;
    const q = searchQuery.toLowerCase();
    return perms.filter(p => 
      p.apiName.toLowerCase().includes(q) ||
      p.displayName.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.productCategory.toLowerCase().includes(q) ||
      p.taskCategories.some(tc => tc.toLowerCase().includes(q))
    );
  };

  const filteredSelected = filterBySearch(selectedPermissions);
  const filteredAvailable = filterBySearch(availablePermissions);

  // Group permissions - matches main page logic
  const groupPerms = (perms: Permission[]) => {
    if (groupBy === "alphabetical") {
      return { "": [...perms].sort((a, b) => a.apiName.localeCompare(b.apiName)) };
    }
    const groups: Record<string, Permission[]> = {};
    for (const p of perms) {
      if (groupBy === "taskCategory") {
        // Put permission in each of its task categories
        for (const tc of p.taskCategories) {
          if (!groups[tc]) groups[tc] = [];
          groups[tc].push(p);
        }
      } else if (groupBy === "sensitivity") {
        // Put permission in each applicable sensitivity group
        const sensitivityGroups: string[] = [];
        if (p.hasPII) sensitivityGroups.push("PII");
        if (p.hasFinancialData) sensitivityGroups.push("Financial Data");
        if (p.hasPaymentCredentials) sensitivityGroups.push("Payment Credentials");
        if (sensitivityGroups.length === 0) sensitivityGroups.push("Non-sensitive");
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
  };

  const groupedSelected = groupPerms(filteredSelected);
  const groupedAvailable = groupPerms(filteredAvailable);
  const isAlphabetical = groupBy === "alphabetical";

  // Unified list: all permissions grouped together (for the new single-list layout)
  const filteredAll = filterBySearch(allPermissions);
  const groupedAll = groupPerms(filteredAll);

  // Sort groups and permissions within groups: active items first (based on initial state, so order is stable)
  const sortedGroupEntries = Object.entries(groupedAll).sort(([aGroup, aPerms], [bGroup, bPerms]) => {
    const aActiveCount = aPerms.filter(p => p.apiName in initialAccessRef.current).length;
    const bActiveCount = bPerms.filter(p => p.apiName in initialAccessRef.current).length;
    // Groups with any active permissions sort first
    const aHasActive = aActiveCount > 0 ? 0 : 1;
    const bHasActive = bActiveCount > 0 ? 0 : 1;
    if (aHasActive !== bHasActive) return aHasActive - bHasActive;
    // Within same tier, sort alphabetically
    return aGroup.localeCompare(bGroup);
  });

  // Sort permissions within each group: active first (based on initial state)
  const sortPermsInGroup = (perms: Permission[]) => {
    return [...perms].sort((a, b) => {
      const aActive = a.apiName in initialAccessRef.current ? 0 : 1;
      const bActive = b.apiName in initialAccessRef.current ? 0 : 1;
      if (aActive !== bActive) return aActive - bActive;
      return a.displayName.localeCompare(b.displayName);
    });
  };

  // Required permission that cannot be removed
  const REQUIRED_PERMISSION = "dashboard_baseline";

  const togglePermission = (apiName: string) => {
    // Don't allow toggling the required permission
    if (apiName === REQUIRED_PERMISSION) return;
    
    setPermissionAccess(prev => {
      const next = { ...prev };
      if (apiName in next) {
        // Removing permission
        delete next[apiName];
      } else {
        // Adding permission - use pending access if set, otherwise default to permission's actions
        const pending = pendingAccess[apiName];
        const perm = allPermissions.find(p => p.apiName === apiName);
        next[apiName] = pending || perm?.actions || "read";
        
        // Clear pending access after adding
        setPendingAccess(p => {
          const newPending = { ...p };
          delete newPending[apiName];
          return newPending;
        });
      }
      return next;
    });
  };

  const updatePermissionAccess = (apiName: string, access: string) => {
    setPermissionAccess(prev => ({
      ...prev,
      [apiName]: access
    }));
  };

  const updatePendingAccess = (apiName: string, access: string) => {
    setPendingAccess(prev => ({
      ...prev,
      [apiName]: access
    }));
  };

  // Group checkbox helpers
  const getGroupCheckState = (perms: Permission[]): "all" | "none" | "some" => {
    const checkedCount = perms.filter(p => p.apiName in permissionAccess).length;
    if (checkedCount === 0) return "none";
    if (checkedCount === perms.length) return "all";
    return "some";
  };

  const toggleGroup = (perms: Permission[]) => {
    const state = getGroupCheckState(perms);
    setPermissionAccess(prev => {
      const next = { ...prev };
      if (state === "all") {
        // Uncheck all in this group (except required)
        for (const p of perms) {
          if (p.apiName !== REQUIRED_PERMISSION) {
            delete next[p.apiName];
          }
        }
      } else {
        // Check all in this group
        for (const p of perms) {
          if (!(p.apiName in next)) {
            next[p.apiName] = p.actions;
          }
        }
      }
      return next;
    });
  };

  const handleRevert = () => {
    // Rebuild permission access map from base role
    const accessMap: Record<string, string> = {};
    
    if (baseRole.permissionAccess) {
      Object.assign(accessMap, baseRole.permissionAccess);
    } else if (baseRole.permissionApiNames) {
      baseRole.permissionApiNames.forEach(apiName => {
        const perm = allPermissions.find(p => p.apiName === apiName);
        accessMap[apiName] = perm?.actions || "read";
      });
    } else {
      const basePermissions = getPermissionsForRole(baseRole.id);
      basePermissions.forEach(p => {
        const roleAccess = p.roleAccess[baseRole.id];
        accessMap[p.apiName] = roleAccess || p.actions;
      });
    }
    
    // Ensure dashboard_baseline is always included (it's required)
    if (!accessMap[REQUIRED_PERMISSION]) {
      accessMap[REQUIRED_PERMISSION] = "read";
    }
    
    setPermissionAccess(accessMap);
    setPendingAccess({});
    setRoleName(isEditMode ? baseRole.name : `${baseRole.name} (copy)`);
    setIsEditingName(false);
    setCustomDescription(baseRole.customDescription || "");
    setIsEditingDescription(!!baseRole.customDescription);
  };

  const handleSave = () => {
    const generatedDetails = generateRoleDetails(selectedPermissions);
    // Use custom description if provided, otherwise use generated
    const finalDetails: RoleDetails = {
      ...generatedDetails,
      description: customDescription.trim() || generatedDetails.description,
    };
    
    if (isEditMode && onUpdate) {
      // Edit mode: update existing role
      const updatedRole: Role = {
        ...baseRole,
        name: roleName,
        details: finalDetails,
        permissionAccess: { ...permissionAccess },
        customDescription: customDescription.trim() || undefined,
      };
      onUpdate(updatedRole);
    } else {
      // Create mode: create new role
      const newRole: Role = {
        id: `custom_${Date.now()}`,
        name: roleName,
        category: "Custom",
        details: finalDetails,
        userCount: 0,
        permissionAccess: { ...permissionAccess },
        customDescription: customDescription.trim() || undefined,
      };
      onSave(newRole);
    }
    handleClose();
  };

  // Generate live preview of details
  const previewDetails = generateRoleDetails(selectedPermissions);
  const previewRiskAssessment = generateRiskAssessment(selectedPermissions);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-8">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[rgba(182,192,205,0.7)]"
        style={{ 
          animation: isClosing ? 'fade-out 150ms ease-out forwards' : 'fade-in 150ms ease-out' 
        }}
      />
      
      {/* Modal - full screen with 32px margin */}
      <div 
        className="relative bg-white rounded-[12px] shadow-[0px_15px_35px_0px_rgba(48,49,61,0.08),0px_5px_15px_0px_rgba(0,0,0,0.12)] flex flex-col overflow-hidden w-full h-full" 
        style={{ 
          animation: isClosing ? 'modal-out 150ms ease-out forwards' : 'modal-in 200ms cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        {/* Close button - top right */}
        <div className="flex items-end justify-end pt-6 px-6">
          <button 
            onClick={handleClose}
            className="p-1 rounded-md hover:bg-[#F5F6F8] transition-colors"
          >
            <X className="w-5 h-5 text-[#6C7688]" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col gap-4 px-8 overflow-hidden">
          {/* Title with Revert button */}
          <div className="flex items-center gap-4">
            <h2 className="text-[24px] font-bold text-[#21252C] leading-8 tracking-[0.3px] font-display" style={{ fontFeatureSettings: "'lnum', 'pnum'" }}>
              {isEditMode ? "Edit role" : "Duplicate and customize role"}
            </h2>
            <button
              onClick={handleRevert}
              className="px-3 py-1 text-[13px] font-medium text-[#353A44] leading-[19px] tracking-[-0.15px] border border-[#D8DEE4] rounded-md hover:bg-[#F5F6F8] transition-colors bg-white shadow-[0px_1px_1px_0px_rgba(33,37,44,0.16)]"
            >
              Revert
            </button>
          </div>

          {/* Main content area */}
          <div className="flex-1 flex min-h-0 overflow-hidden">
            {/* Offset background container - role info + permissions */}
            <div className="bg-[#F5F6F8] rounded-[12px] p-2 flex gap-4 flex-1 overflow-hidden">
              {/* Role info column - 1/3 width */}
              <div className="flex-1 flex flex-col gap-4 px-4 py-4 overflow-y-auto min-w-0">
                {/* Role name header */}
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    {isEditingName ? (
                      <input
                        type="text"
                        value={roleName}
                        onChange={(e) => setRoleName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            setIsEditingName(false);
                          }
                        }}
                        autoFocus
                        className="flex-1 text-[20px] font-bold text-[#353A44] leading-7 tracking-[0.3px] bg-white border border-[#D8DEE4] rounded-[6px] px-2 py-1 outline-none font-display min-w-0 focus:shadow-[0px_0px_0px_4px_rgba(8,142,249,0.36)] transition-shadow"
                        style={{ fontFeatureSettings: "'lnum', 'pnum'" }}
                      />
                    ) : (
                      <h3 className="flex-1 text-[20px] font-bold text-[#353A44] leading-7 tracking-[0.3px] font-display min-w-0" style={{ fontFeatureSettings: "'lnum', 'pnum'" }}>
                        {roleName}
                      </h3>
                    )}
                  </div>
                  <button
                    onClick={() => setIsEditingName(!isEditingName)}
                    className="self-start text-[12px] text-[#635BFF] hover:text-[#5851DB] transition-colors"
                  >
                    {isEditingName ? "Done" : "Edit name"}
                  </button>
                </div>

                {/* Description - display or edit mode */}
                {isEditingDescription ? (
                  <div className="flex flex-col gap-1">
                    <textarea
                      value={customDescription}
                      onChange={(e) => setCustomDescription(e.target.value)}
                      rows={4}
                      autoFocus
                      className="text-[13px] text-[#353A44] leading-[19px] tracking-[-0.15px] bg-white border border-[#D8DEE4] rounded-[6px] px-2 py-1 outline-none resize-y focus:shadow-[0px_0px_0px_4px_rgba(8,142,249,0.36)] focus:border-[#D8DEE4] transition-shadow"
                    />
                    <button
                      onClick={() => {
                        setCustomDescription("");
                        setIsEditingDescription(false);
                      }}
                      className="self-start text-[12px] text-[#635BFF] hover:text-[#5851DB] transition-colors"
                    >
                      Use auto-generated
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-1">
                    <p className="text-[13px] text-[#596171] leading-[19px] tracking-[-0.15px]">
                      {previewDetails.description}
                    </p>
                    <button
                      onClick={() => {
                        setCustomDescription(previewDetails.description);
                        setIsEditingDescription(true);
                      }}
                      className="self-start text-[12px] text-[#635BFF] hover:text-[#5851DB] transition-colors"
                    >
                      Edit description
                    </button>
                  </div>
                )}

                {/* Combined Can / Cannot container */}
                <div className="bg-white rounded-lg p-4">
                  {/* Can section */}
                  <div className="pb-4">
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircleIcon />
                      <span className="text-[13px] font-semibold text-[#353A44] leading-[19px] tracking-[-0.15px]">Can</span>
                    </div>
                    <ul className="list-disc pl-6 flex flex-col gap-1.5">
                      {previewDetails.canDo.slice(0, 5).map((item, i) => (
                        <li key={i} className="text-[13px] text-[#353A44] leading-[19px] tracking-[-0.15px]">{item}</li>
                      ))}
                      {previewDetails.canDo.length > 5 && (
                        <li className="text-[13px] text-[#596171] leading-[19px] tracking-[-0.15px]">+{previewDetails.canDo.length - 5} more</li>
                      )}
                    </ul>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-[#EBEEF1] my-4" />

                  {/* Cannot section */}
                  <div className="pb-4">
                    <div className="flex items-center gap-2 mb-3">
                      <CancelCircleIcon />
                      <span className="text-[13px] font-semibold text-[#353A44] leading-[19px] tracking-[-0.15px]">Cannot</span>
                    </div>
                    <ul className="list-disc pl-6 flex flex-col gap-1.5">
                      {previewDetails.cannotDo.slice(0, 5).map((item, i) => (
                        <li key={i} className="text-[13px] text-[#353A44] leading-[19px] tracking-[-0.15px]">{item}</li>
                      ))}
                      {previewDetails.cannotDo.length > 5 && (
                        <li className="text-[13px] text-[#596171] leading-[19px] tracking-[-0.15px]">+{previewDetails.cannotDo.length - 5} more</li>
                      )}
                    </ul>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-[#EBEEF1] my-4" />

                  {/* Note */}
                  <p className="text-[13px] text-[#596171] leading-[19px]">
                    Note: The capabilities listed are highlights only. Refer to the permissions panel for the complete, authoritative list of what each role can access.
                  </p>
                </div>

                {/* Risk Assessment - own container */}
                <div className="p-4 bg-white rounded-lg">
                  <RiskAssessmentCard 
                    assessment={previewRiskAssessment} 
                    showAdvice 
                    isExpanded={isRiskExpandedModal}
                    onToggle={() => setIsRiskExpandedModal(!isRiskExpandedModal)}
                  />
                </div>
              </div>

              <ModalPermissionsPanel
                isAssistantOpen={isAssistantOpen}
                onOpenAssistant={() => setIsAssistantOpen(true)}
                isGrouped={isGrouped}
                onGroupedChange={handleGroupToggle}
                groupBy={groupBy}
                onGroupByChange={setGroupBy}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedCount={selectedPermissions.length}
                totalCount={allPermissions.length}
                isAlphabetical={isAlphabetical}
                sortedGroupEntries={sortedGroupEntries}
                sortPermsInGroup={sortPermsInGroup}
                getGroupCheckState={getGroupCheckState}
                toggleGroup={toggleGroup}
                permissionAccess={permissionAccess}
                togglePermission={togglePermission}
                updatePermissionAccess={updatePermissionAccess}
                pendingAccess={pendingAccess}
                updatePendingAccess={updatePendingAccess}
                hasResults={filteredAll.length > 0}
              />

              </div>
            
            {/* AI Assistant Drawer - outside the offset background */}
            <AIAssistantDrawer 
              isOpen={isAssistantOpen} 
              onClose={() => setIsAssistantOpen(false)} 
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-8 py-6">
          <button
            onClick={() => {
              // Create a preview role with current permissions to test
              const previewRole: Role = {
                id: isEditMode ? baseRole.id : `custom_${Date.now()}`,
                name: roleName,
                category: "Custom",
                userCount: 0,
                permissionAccess: { ...permissionAccess },
                customDescription: customDescription || undefined,
              };
              onTestInSandbox?.(previewRole, {
                roleName,
                customDescription,
                permissionAccess: { ...permissionAccess },
              });
            }}
            className="flex items-center gap-2 px-3 py-1.5 text-[13px] font-medium text-[#353A44] leading-[19px] tracking-[-0.15px] hover:bg-[#F5F6F8] border border-[#D8DEE4] rounded-md transition-colors bg-white shadow-[0px_1px_1px_0px_rgba(33,37,44,0.16)]"
          >
            <SandboxIcon />
            Test in sandbox
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-1.5 bg-[#675DFF] text-white text-[13px] font-semibold leading-[19px] tracking-[-0.15px] rounded-md hover:bg-[#5851DB] transition-colors shadow-[0px_1px_1px_0px_rgba(47,14,99,0.32)]"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

// Create Role Modal Component
function CreateRoleModal({
  isOpen,
  onClose,
  onSave,
  initialGroupBy,
  onTestInSandbox,
  initialState,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (role: Role) => void;
  initialGroupBy: GroupByOption;
  onTestInSandbox?: (role: Role, modalState: { roleName: string; customDescription: string; permissionAccess: Record<string, string>; selectedBaseRole?: Role | null }) => void;
  initialState?: { roleName: string; customDescription: string; permissionAccess: Record<string, string>; selectedBaseRole?: Role | null };
}) {
  const allPermissions = getAllPermissions();
  const roleNameInputRef = useRef<HTMLInputElement>(null);
  
  const [selectedBaseRole, setSelectedBaseRole] = useState<Role | null>(null);
  const [roleName, setRoleName] = useState("");
  const [customDescription, setCustomDescription] = useState("");
  const [permissionAccess, setPermissionAccess] = useState<Record<string, string>>({});
  const [pendingAccess, setPendingAccess] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [groupBy, setGroupBy] = useState<GroupByOption>("productCategory");
  const [isGrouped, setIsGrouped] = useState(true);
  const [isClosing, setIsClosing] = useState(false);
  const baseRolePopover = usePopover();
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  // Capture initial permission state for stable sort order
  const initialAccessRef = useRef<Record<string, string>>({});

  // Required permission constant
  const REQUIRED_PERMISSION = "dashboard_baseline";

  // Handle close with animation
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 150);
  };

  // Handle group toggle with auto-switch logic
  const handleGroupToggle = (on: boolean) => {
    setIsGrouped(on);
    if (on && groupBy === "alphabetical") {
      setGroupBy("productCategory");
    }
  };

  // Reset and initialize when modal opens (or restore from initialState if returning from sandbox)
  useEffect(() => {
    if (isOpen) {
      // If we have initialState (returning from sandbox), use it
      if (initialState) {
        setSelectedBaseRole(initialState.selectedBaseRole || null);
        setRoleName(initialState.roleName);
        setCustomDescription(initialState.customDescription);
        setPermissionAccess(initialState.permissionAccess);
        initialAccessRef.current = { ...initialState.permissionAccess };
        setPendingAccess({});
        setSearchQuery("");
        setGroupBy("productCategory");
        setIsGrouped(true);
        baseRolePopover.close();
        return;
      }

      const initialAccess = { [REQUIRED_PERMISSION]: "read" };
      setSelectedBaseRole(null);
      setRoleName("");
      setCustomDescription("");
      setPermissionAccess(initialAccess);
      initialAccessRef.current = { ...initialAccess };
      setPendingAccess({});
      setSearchQuery("");
      setGroupBy("productCategory");
      setIsGrouped(true);
      baseRolePopover.close();
      
      // Focus the role name input after a short delay
      setTimeout(() => {
        roleNameInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, initialState]);

  // When base role is selected, populate permissions and description
  const handleBaseRoleSelect = (role: Role) => {
    setSelectedBaseRole(role);
    baseRolePopover.close();
    
    // Build permission access map from selected role
    const accessMap: Record<string, string> = {};
    
    if (role.permissionAccess) {
      Object.assign(accessMap, role.permissionAccess);
    } else if (role.permissionApiNames) {
      role.permissionApiNames.forEach(apiName => {
        const perm = allPermissions.find(p => p.apiName === apiName);
        accessMap[apiName] = perm?.actions || "read";
      });
    } else {
      const basePermissions = getPermissionsForRole(role.id);
      basePermissions.forEach(p => {
        const roleAccess = p.roleAccess[role.id];
        accessMap[p.apiName] = roleAccess || p.actions;
      });
    }
    
    // Ensure dashboard_baseline is always included
    if (!accessMap[REQUIRED_PERMISSION]) {
      accessMap[REQUIRED_PERMISSION] = "read";
    }
    
    setPermissionAccess(accessMap);
    initialAccessRef.current = { ...accessMap };
    setPendingAccess({});
    
    // Set description from role details
    if (role.details?.description) {
      setCustomDescription(role.details.description);
    }
  };

  // Handle reset
  const handleReset = () => {
    const resetAccess = { [REQUIRED_PERMISSION]: "read" };
    setSelectedBaseRole(null);
    setRoleName("");
    setCustomDescription("");
    setPermissionAccess(resetAccess);
    initialAccessRef.current = { ...resetAccess };
    setPendingAccess({});
    setSearchQuery("");
    
    // Focus the role name input
    setTimeout(() => {
      roleNameInputRef.current?.focus();
    }, 50);
  };

  // Keyboard shortcuts
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        handleClose();
      }
      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        handleSave();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, permissionAccess, roleName, customDescription]);

  if (!isOpen) return null;

  const selectedApiNames = Object.keys(permissionAccess);
  const selectedPermissions = allPermissions.filter(p => selectedApiNames.includes(p.apiName));
  const availablePermissions = allPermissions.filter(p => !selectedApiNames.includes(p.apiName));
  
  // Filter by search
  const filterBySearch = (perms: Permission[]) => {
    if (!searchQuery) return perms;
    const q = searchQuery.toLowerCase();
    return perms.filter(p => 
      p.apiName.toLowerCase().includes(q) ||
      p.displayName.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.productCategory.toLowerCase().includes(q) ||
      p.taskCategories.some(tc => tc.toLowerCase().includes(q))
    );
  };

  const filteredSelected = filterBySearch(selectedPermissions);
  const filteredAvailable = filterBySearch(availablePermissions);

  // Group permissions
  const groupPerms = (perms: Permission[]) => {
    if (groupBy === "alphabetical") {
      return { "": [...perms].sort((a, b) => a.apiName.localeCompare(b.apiName)) };
    }
    const groups: Record<string, Permission[]> = {};
    for (const p of perms) {
      if (groupBy === "taskCategory") {
        for (const tc of p.taskCategories) {
          if (!groups[tc]) groups[tc] = [];
          groups[tc].push(p);
        }
      } else if (groupBy === "sensitivity") {
        const sensitivityGroups: string[] = [];
        if (p.hasPII) sensitivityGroups.push("PII");
        if (p.hasFinancialData) sensitivityGroups.push("Financial Data");
        if (p.hasPaymentCredentials) sensitivityGroups.push("Payment Credentials");
        if (sensitivityGroups.length === 0) sensitivityGroups.push("Non-sensitive");
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
  };

  const groupedSelected = groupPerms(filteredSelected);
  const groupedAvailable = groupPerms(filteredAvailable);
  const isAlphabetical = groupBy === "alphabetical";

  // Unified list: all permissions grouped together
  const filteredAll = filterBySearch(allPermissions);
  const groupedAll = groupPerms(filteredAll);

  // Sort groups and permissions: active items first (based on initial state, frozen after load)
  const sortedGroupEntries = Object.entries(groupedAll).sort(([aGroup, aPerms], [bGroup, bPerms]) => {
    const aHasActive = aPerms.some(p => p.apiName in initialAccessRef.current) ? 0 : 1;
    const bHasActive = bPerms.some(p => p.apiName in initialAccessRef.current) ? 0 : 1;
    if (aHasActive !== bHasActive) return aHasActive - bHasActive;
    return aGroup.localeCompare(bGroup);
  });

  const sortPermsInGroup = (perms: Permission[]) => {
    return [...perms].sort((a, b) => {
      const aActive = a.apiName in initialAccessRef.current ? 0 : 1;
      const bActive = b.apiName in initialAccessRef.current ? 0 : 1;
      if (aActive !== bActive) return aActive - bActive;
      return a.displayName.localeCompare(b.displayName);
    });
  };

  // Group checkbox helpers
  const getGroupCheckState = (perms: Permission[]): "all" | "none" | "some" => {
    const checkedCount = perms.filter(p => p.apiName in permissionAccess).length;
    if (checkedCount === 0) return "none";
    if (checkedCount === perms.length) return "all";
    return "some";
  };

  const toggleGroup = (perms: Permission[]) => {
    const state = getGroupCheckState(perms);
    setPermissionAccess(prev => {
      const next = { ...prev };
      if (state === "all") {
        for (const p of perms) {
          if (p.apiName !== REQUIRED_PERMISSION) {
            delete next[p.apiName];
          }
        }
      } else {
        for (const p of perms) {
          if (!(p.apiName in next)) {
            next[p.apiName] = p.actions;
          }
        }
      }
      return next;
    });
  };

  const togglePermission = (apiName: string) => {
    if (apiName === REQUIRED_PERMISSION) return;
    
    setPermissionAccess(prev => {
      const next = { ...prev };
      if (apiName in next) {
        delete next[apiName];
      } else {
        const accessLevel = pendingAccess[apiName];
        const perm = allPermissions.find(p => p.apiName === apiName);
        next[apiName] = accessLevel || perm?.actions || "read";
        
        setPendingAccess(pa => {
          const newPa = { ...pa };
          delete newPa[apiName];
          return newPa;
        });
      }
      return next;
    });
  };

  const updatePermissionAccess = (apiName: string, access: string) => {
    setPermissionAccess(prev => ({
      ...prev,
      [apiName]: access
    }));
  };

  const updatePendingAccess = (apiName: string, access: string) => {
    setPendingAccess(prev => ({
      ...prev,
      [apiName]: access
    }));
  };

  const handleSave = () => {
    if (!roleName.trim()) {
      roleNameInputRef.current?.focus();
      return;
    }
    
    const finalDetails = generateRoleDetails(selectedPermissions);
    if (customDescription.trim()) {
      finalDetails.description = customDescription.trim();
    }
    
    const newRole: Role = {
      id: `custom_${Date.now()}`,
      name: roleName.trim(),
      category: "Custom",
      details: finalDetails,
      userCount: 0,
      permissionApiNames: selectedApiNames,
      permissionAccess: { ...permissionAccess },
      customDescription: customDescription.trim() || undefined,
    };
    
    onSave(newRole);
    handleClose();
  };

  // Generate preview details
  const previewDetails = generateRoleDetails(selectedPermissions);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-8">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-[rgba(182,192,205,0.7)] ${isClosing ? 'animate-fade-out' : 'animate-fade-in'}`}
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div 
        className="relative bg-white rounded-[12px] shadow-[0px_15px_35px_0px_rgba(48,49,61,0.08),0px_5px_15px_0px_rgba(0,0,0,0.12)] flex flex-col overflow-hidden w-full h-full" 
        style={{ 
          animation: isClosing ? 'modal-out 150ms ease-out forwards' : 'modal-in 200ms cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        {/* Close button */}
        <div className="flex items-end justify-end pt-6 px-6">
          <button 
            onClick={handleClose}
            className="p-1 rounded-md hover:bg-[#F5F6F8] transition-colors"
          >
            <X className="w-5 h-5 text-[#6C7688]" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col gap-4 px-8 overflow-hidden">
          {/* Title with Reset button */}
          <div className="flex items-center gap-4">
            <h2 className="text-[24px] font-bold text-[#21252C] leading-8 tracking-[0.3px] font-display" style={{ fontFeatureSettings: "'lnum', 'pnum'" }}>
              Create role
            </h2>
            <button
              onClick={handleReset}
              className="px-3 py-1 text-[13px] font-medium text-[#353A44] leading-[19px] tracking-[-0.15px] border border-[#D8DEE4] rounded-md hover:bg-[#F5F6F8] transition-colors bg-white shadow-[0px_1px_1px_0px_rgba(33,37,44,0.16)]"
            >
              Reset
            </button>
          </div>

          {/* Main content area */}
          <div className="flex-1 flex min-h-0 overflow-hidden">
            {/* Offset background container */}
            <div className="bg-[#F5F6F8] rounded-[12px] p-2 flex gap-4 flex-1 overflow-hidden">
              {/* Left column - Role info (1/3 width) */}
              <div className="flex-1 flex flex-col gap-6 px-4 py-[13px] overflow-y-auto min-w-0">
                {/* Start from existing role dropdown */}
                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-semibold text-[#353A44] leading-[19px] tracking-[-0.15px]">
                    Start from an existing role
                  </label>
                  <div className="relative">
                    <button
                      onClick={() => baseRolePopover.toggle()}
                      className="w-full flex items-center justify-between gap-2 px-2 py-1.5 text-[13px] leading-[19px] tracking-[-0.15px] border border-[#D8DEE4] rounded-md bg-white hover:bg-[#F5F6F8] transition-colors shadow-[0px_1px_1px_0px_rgba(33,37,44,0.16)]"
                    >
                      <span className={selectedBaseRole ? "text-[#353A44]" : "text-[#818DA0]"}>
                        {selectedBaseRole ? selectedBaseRole.name : "Choose an option"}
                      </span>
                      <ArrowUpDownIcon size={12} />
                    </button>
                    
                    {baseRolePopover.isVisible && (
                      <>
                        <div 
                          className="fixed inset-0 z-10" 
                          onClick={() => baseRolePopover.close()} 
                        />
                        <div className={`absolute top-full left-0 right-0 mt-1 bg-white border border-[#D8DEE4] rounded-[8px] shadow-[0_15px_35px_rgba(48,49,61,0.08),0_5px_15px_rgba(0,0,0,0.12)] z-20 max-h-[300px] overflow-y-auto p-1 ${baseRolePopover.animationClass}`} style={{ "--popover-origin": "top left" } as React.CSSProperties}>
                          {allRoles.map((role) => (
                            <button
                              key={role.id}
                              onClick={() => handleBaseRoleSelect(role)}
                              className={`w-full flex items-center justify-between gap-3 px-2.5 py-1.5 text-[13px] leading-[19px] tracking-[-0.15px] text-[#353A44] rounded transition-colors ${
                                selectedBaseRole?.id === role.id ? "bg-[#F5F6F8]" : "hover:bg-[#F5F6F8]"
                              }`}
                            >
                              <span className={selectedBaseRole?.id === role.id ? "font-semibold" : ""}>
                                {role.name}
                              </span>
                              {selectedBaseRole?.id === role.id && <CheckCircleFilledIcon size={12} />}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-[#D8DEE4]" />

                {/* Role name input */}
                <div className="flex flex-col gap-1">
                  <input
                    ref={roleNameInputRef}
                    type="text"
                    value={roleName}
                    onChange={(e) => setRoleName(e.target.value)}
                    placeholder="Role name"
                    className="w-full px-2 py-1.5 text-[13px] text-[#353A44] leading-[19px] tracking-[-0.15px] border border-[#D8DEE4] rounded-md bg-white outline-none placeholder:text-[#818DA0] focus:border-[#635BFF] focus:shadow-[0px_0px_0px_4px_rgba(8,142,249,0.36)] transition-shadow"
                  />
                </div>

                {/* Description textarea */}
                <div className="flex flex-col gap-1">
                  <label className="text-[13px] font-semibold text-[#353A44] leading-[19px] tracking-[-0.15px]">
                    Description
                  </label>
                  <textarea
                    value={customDescription}
                    onChange={(e) => setCustomDescription(e.target.value)}
                    rows={4}
                    className="w-full px-2 py-1.5 text-[13px] text-[#353A44] leading-[19px] tracking-[-0.15px] border border-[#D8DEE4] rounded-md bg-white outline-none resize-y placeholder:text-[#818DA0] focus:border-[#635BFF] focus:shadow-[0px_0px_0px_4px_rgba(8,142,249,0.36)] transition-shadow"
                  />
                </div>

                {/* Can / Cannot section */}
                <div className="bg-white rounded-lg p-4">
                  {/* Can section */}
                  <div className={previewDetails.canDo.length > 0 ? "pb-4" : ""}>
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircleIcon />
                      <span className="text-[13px] font-semibold text-[#353A44] leading-[19px] tracking-[-0.15px]">Can</span>
                    </div>
                    {previewDetails.canDo.length > 0 ? (
                      <ul className="list-disc pl-4 flex flex-col gap-1">
                        {previewDetails.canDo.slice(0, 5).map((item, i) => (
                          <li key={i} className="text-[13px] text-[#353A44] leading-[19px] tracking-[-0.15px] pl-1">{item}</li>
                        ))}
                        {previewDetails.canDo.length > 5 && (
                          <li className="text-[13px] text-[#596171] leading-[19px] tracking-[-0.15px] pl-1">+{previewDetails.canDo.length - 5} more</li>
                        )}
                      </ul>
                    ) : (
                      <div className="flex flex-col gap-2.5 py-1.5">
                        <div className="h-2 bg-[#EBEEF1] rounded-lg w-full" />
                      </div>
                    )}
                  </div>

                  {/* Cannot section - only show when user has added permissions beyond just dashboard_baseline */}
                  {selectedPermissions.length > 1 && previewDetails.cannotDo.length > 0 && (
                    <>
                      <div className="h-px bg-[#EBEEF1] my-4" />
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <CancelCircleIcon />
                          <span className="text-[13px] font-semibold text-[#353A44] leading-[19px] tracking-[-0.15px]">Cannot</span>
                        </div>
                        <ul className="list-disc pl-4 flex flex-col gap-1">
                          {previewDetails.cannotDo.slice(0, 5).map((item, i) => (
                            <li key={i} className="text-[13px] text-[#353A44] leading-[19px] tracking-[-0.15px] pl-1">{item}</li>
                          ))}
                          {previewDetails.cannotDo.length > 5 && (
                            <li className="text-[13px] text-[#596171] leading-[19px] tracking-[-0.15px] pl-1">+{previewDetails.cannotDo.length - 5} more</li>
                          )}
                        </ul>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <ModalPermissionsPanel
                isAssistantOpen={isAssistantOpen}
                onOpenAssistant={() => setIsAssistantOpen(true)}
                isGrouped={isGrouped}
                onGroupedChange={handleGroupToggle}
                groupBy={groupBy}
                onGroupByChange={setGroupBy}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedCount={selectedPermissions.length}
                totalCount={allPermissions.length}
                isAlphabetical={isAlphabetical}
                sortedGroupEntries={sortedGroupEntries}
                sortPermsInGroup={sortPermsInGroup}
                getGroupCheckState={getGroupCheckState}
                toggleGroup={toggleGroup}
                permissionAccess={permissionAccess}
                togglePermission={togglePermission}
                updatePermissionAccess={updatePermissionAccess}
                pendingAccess={pendingAccess}
                updatePendingAccess={updatePendingAccess}
                hasResults={filteredAll.length > 0}
              />

              </div>
            
            {/* AI Assistant Drawer - outside the offset background */}
            <AIAssistantDrawer 
              isOpen={isAssistantOpen} 
              onClose={() => setIsAssistantOpen(false)} 
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-8 py-6">
          <button
            onClick={() => {
              // Create a preview role with current permissions to test
              const previewRole: Role = {
                id: `custom_${Date.now()}`,
                name: roleName || "New Role",
                category: "Custom",
                userCount: 0,
                permissionAccess: { ...permissionAccess },
                customDescription: customDescription || undefined,
              };
              onTestInSandbox?.(previewRole, {
                roleName,
                customDescription,
                permissionAccess: { ...permissionAccess },
                selectedBaseRole,
              });
            }}
            className="flex items-center gap-2 px-3 py-1.5 text-[13px] font-medium text-[#353A44] leading-[19px] tracking-[-0.15px] hover:bg-[#F5F6F8] border border-[#D8DEE4] rounded-md transition-colors bg-white shadow-[0px_1px_1px_0px_rgba(33,37,44,0.16)]"
          >
            <SandboxIcon />
            Test in sandbox
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-1.5 bg-[#675DFF] text-white text-[13px] font-semibold leading-[19px] tracking-[-0.15px] rounded-md hover:bg-[#5851DB] transition-colors shadow-[0px_1px_1px_0px_rgba(47,14,99,0.32)]"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

// Wireframe nav item component
function NavItem({ hasIcon = true }: { hasIcon?: boolean }) {
  return (
    <div className="flex items-center gap-2 w-full">
      {hasIcon && (
        <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
          <div className="w-4 h-4 rounded-full bg-[#EBEEF1]" />
        </div>
      )}
      <div className="py-1.5">
        <div className="h-2 bg-[#EBEEF1] rounded-lg w-[93px]" />
      </div>
    </div>
  );
}

// Global Top Bar Component
function Topbar() {
  return (
    <header className="bg-white flex items-center justify-between py-3 flex-shrink-0">
      {/* Search field placeholder */}
      <div className="flex items-center gap-6">
        <div className="bg-[#F5F6F8] h-9 w-[360px] rounded-lg opacity-80" />
      </div>
      
      {/* Right icons */}
      <div className="flex items-center gap-4">
        <div className="w-4 h-4 rounded-full bg-[#EBEEF1]" />
        <div className="w-4 h-4 rounded-full bg-[#EBEEF1]" />
      </div>
    </header>
  );
}

// Side Navigation Component
function SideNav({ protoControls }: { protoControls?: { teamSecurityEnabled: boolean; onTeamSecurityToggle: (v: boolean) => void; use14px: boolean; onUse14pxToggle: (v: boolean) => void; layoutVersion: "v1" | "v2" | "v3"; onLayoutVersionChange: (v: "v1" | "v2" | "v3") => void } }) {
  const popover = usePopover();

  return (
    <aside className="w-[240px] h-full flex flex-col justify-between px-5 py-4 bg-white border-r border-[rgba(0,39,77,0.08)] flex-shrink-0">
      {/* Top section */}
      <div className="flex flex-col gap-[42px]">
        {/* Account Switcher */}
        <div className="flex items-center gap-2 h-9">
          <div className="w-6 h-6 bg-[#F5F6F8] rounded flex items-center justify-center">
            <OrgIcon />
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1">
              <span className="text-xs font-semibold text-[#353A44] leading-4 tracking-[-0.024px]">
                Acme, Inc.
              </span>
              <ChevronDown className="w-3 h-3 text-[#6C7688]" />
            </div>
            <span className="text-xs text-[#596171] leading-4 truncate">
              Organization
            </span>
          </div>
        </div>

        {/* Nav sections */}
        <div className="flex flex-col gap-6">
          {/* First nav group */}
          <div className="flex flex-col gap-1.5">
            <NavItem />
            <NavItem />
            <NavItem />
          </div>

          {/* Second nav group with section header */}
          <div className="flex flex-col gap-1.5">
            {/* Section header (no icon) */}
            <div className="h-6 flex items-center py-1.5">
              <div className="h-2 bg-[#EBEEF1] rounded-full w-[93px]" />
            </div>
            <NavItem />
            <NavItem />
            <NavItem />
            <NavItem />
            <NavItem />
          </div>
        </div>
      </div>

      {/* Bottom: proto controls or plain nav item */}
      {protoControls ? (
        <div className="relative">
          <button onClick={() => popover.toggle()} className="w-5 h-5 rounded-full bg-[#EBEEF1] hover:bg-[#D8DEE4] transition-colors cursor-pointer flex items-center justify-center" title="Prototype controls">
            <ControlIcon className="w-3 h-3 text-[#596171]" />
          </button>
          {popover.isVisible && (
            <PopoverBackdrop onClose={() => popover.close()}>
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
                  <div className="h-px bg-[#EBEEF1] my-1" />
                  <div className="flex items-center justify-between gap-6 px-2 py-1.5">
                    <span className="text-[13px] text-[#353A44] leading-[19px] tracking-[-0.15px]">Layout</span>
                    <div className="flex bg-[#F5F6F8] rounded-md p-0.5 gap-0.5">
                      {(["v1", "v2", "v3"] as const).map((v) => (
                        <button
                          key={v}
                          onClick={() => protoControls.onLayoutVersionChange(v)}
                          className={`px-2 py-0.5 text-[12px] font-semibold leading-4 rounded-[4px] transition-colors ${
                            protoControls.layoutVersion === v
                              ? "bg-white text-[#353A44] shadow-[0_1px_2px_rgba(0,0,0,0.1)]"
                              : "text-[#596171] hover:text-[#353A44]"
                          }`}
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </PopoverBackdrop>
          )}
        </div>
      ) : (
        <NavItem />
      )}
    </aside>
  );
}

// Popover backdrop that uses event listener instead of full-page overlay
function PopoverBackdrop({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);
  return <div ref={ref}>{children}</div>;
}

// Sandbox View Component
function SandboxView({
  role,
  allRoles,
  unsavedRole,
  onRoleChange,
  onExit,
}: {
  role: Role;
  allRoles: Role[];
  unsavedRole?: Role | null;
  onRoleChange: (role: Role) => void;
  onExit: () => void;
}) {
  const [isRoleSelectorOpen, setIsRoleSelectorOpen] = useState(false);
  const [roleSearchQuery, setRoleSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const selectedRoleRef = useRef<HTMLButtonElement>(null);

  // Group roles by category
  const standardRoles = allRoles.filter(r => r.category !== "Custom");
  const customRoles = allRoles.filter(r => r.category === "Custom");

  // Filter roles by search query
  const filteredStandardRoles = standardRoles.filter(r => 
    r.name.toLowerCase().includes(roleSearchQuery.toLowerCase())
  );
  const filteredCustomRoles = customRoles.filter(r => 
    r.name.toLowerCase().includes(roleSearchQuery.toLowerCase())
  );
  // Show unsaved role section if there's an unsaved role and it matches search
  const showUnsavedRole = unsavedRole && unsavedRole.name.toLowerCase().includes(roleSearchQuery.toLowerCase());

  // Focus search input and scroll to selected when dropdown opens
  useEffect(() => {
    if (isRoleSelectorOpen) {
      // Focus search input
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
      // Scroll to selected item after a brief delay to allow DOM to render
      setTimeout(() => {
        if (selectedRoleRef.current) {
          selectedRoleRef.current.scrollIntoView({ block: "center" });
        }
      }, 0);
    }
    if (!isRoleSelectorOpen) {
      setRoleSearchQuery("");
    }
  }, [isRoleSelectorOpen]);

  return (
    <div className="min-h-screen bg-[#0e3359] flex flex-col">
      {/* Sandbox Header Banner */}
      <div className="h-[56px] flex items-center px-5 py-3">
        <span className="text-white text-[13px] font-semibold leading-[19px] tracking-[-0.15px]">
          Sandbox
        </span>
        <div className="flex-1 flex justify-center">
          <span className="text-white text-[13px] leading-[19px] tracking-[-0.15px]">
            You're testing{" "}
            <span className="font-semibold">{role.name}</span>
            {" "}role in a sandbox. Changes you make here won't affect your live account.
          </span>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="flex-1 bg-white rounded-t-[12px] shadow-[0px_15px_35px_rgba(48,49,61,0.08),0px_5px_15px_rgba(0,0,0,0.12)] overflow-hidden flex">
        {/* Left Sidebar */}
        <div className="w-[240px] border-r border-[rgba(0,39,77,0.08)] flex flex-col justify-between px-5 py-4">
          <div className="flex flex-col gap-[42px]">
            {/* Account Switcher */}
            <div className="flex items-center gap-2 h-9">
              <div className="w-6 h-6 rounded bg-[#58BA27] flex items-center justify-center">
                <span className="text-white text-[10px] font-bold">A</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <span className="text-[12px] font-semibold text-[#353A44] leading-4">Acme US</span>
                  <ChevronDown className="w-3 h-3 text-[#474E5A]" />
                </div>
                <span className="text-[12px] text-[#596171] leading-4">Acme, Inc.</span>
              </div>
            </div>

            {/* Placeholder Nav Items */}
            <div className="flex flex-col gap-6">
              {/* Nav group 1 */}
              <div className="flex flex-col gap-1.5">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-2 h-6">
                    <div className="w-6 h-6 rounded bg-[#EBEEF1]" />
                    <div className="h-2 bg-[#EBEEF1] rounded-full w-[93px]" />
                  </div>
                ))}
              </div>

              {/* Nav group 2 with section header */}
              <div className="flex flex-col gap-1.5">
                <div className="h-6 flex items-center py-1.5">
                  <div className="h-2 bg-[#EBEEF1] rounded-full w-[93px]" />
                </div>
                <div className="flex items-center gap-2 h-6">
                  <div className="w-6 h-6 rounded bg-[#EBEEF1]" />
                  <div className="h-2 bg-[#EBEEF1] rounded-full w-[93px]" />
                </div>
              </div>

              {/* Nav group 3 with section header */}
              <div className="flex flex-col gap-1.5">
                <div className="h-6 flex items-center py-1.5">
                  <div className="h-2 bg-[#EBEEF1] rounded-full w-[93px]" />
                </div>
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="flex items-center gap-2 h-6">
                    <div className="w-6 h-6 rounded bg-[#EBEEF1]" />
                    <div className="h-2 bg-[#EBEEF1] rounded-full w-[93px]" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom nav item */}
          <div className="flex items-center gap-2 h-6">
            <div className="w-6 h-6 rounded bg-[#EBEEF1]" />
            <div className="h-2 bg-[#EBEEF1] rounded-full w-[93px]" />
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col gap-5 px-8 pb-8 relative">
          {/* Top Bar */}
          <div className="bg-white sticky top-0 py-3 flex items-center justify-between z-10">
            {/* Search placeholder */}
            <div className="h-9 w-[360px] bg-[#F5F6F8] rounded-lg opacity-80" />
            {/* Right icons placeholder */}
            <div className="flex items-center gap-4">
              <div className="h-2 bg-[#EBEEF1] rounded-full w-[93px]" />
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-4 h-4 rounded-full bg-[#EBEEF1]" />
              ))}
            </div>
          </div>

          {/* Grey Placeholder Content */}
          <div className="flex-1 bg-[#F5F6F8] rounded-[12px]" />
        </div>

        {/* Floating Controller */}
        <div className="fixed bottom-8 right-8 w-[288px] bg-white border border-[rgba(0,39,77,0.08)] rounded-[12px] shadow-[0px_15px_35px_rgba(48,49,61,0.08),0px_5px_15px_rgba(0,0,0,0.12)] z-50">
          {/* Header */}
          <div className="px-3 py-2">
            <span className="text-[13px] font-semibold text-[#353A44] leading-[19px] tracking-[-0.15px]">
              Test roles and permissions
            </span>
          </div>

          {/* Content */}
          <div className="px-3 pb-4 flex flex-col gap-2">
            {/* Role Selector */}
            <div className="relative">
              <button
                onClick={() => setIsRoleSelectorOpen(!isRoleSelectorOpen)}
                className="w-full flex items-center justify-between px-2 py-1.5 text-[13px] text-[#353A44] leading-[19px] tracking-[-0.15px] border border-[#D8DEE4] rounded-md bg-white hover:bg-[#F5F6F8] transition-colors shadow-[0px_1px_1px_0px_rgba(33,37,44,0.16)]"
              >
                <span>{role.name}</span>
                <ArrowUpDownIcon size={12} />
              </button>

              {isRoleSelectorOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setIsRoleSelectorOpen(false)} 
                  />
                  <div className="absolute bottom-full left-0 right-0 mb-1 bg-white border border-[#D8DEE4] rounded-[8px] shadow-[0_15px_35px_rgba(48,49,61,0.08),0_5px_15px_rgba(0,0,0,0.12)] z-20 max-h-[400px] overflow-hidden flex flex-col">
                    {/* Search Input */}
                    <div className="border-b border-[#D8DEE4] px-1 pt-1 pb-[5px]">
                      <div className="flex items-center gap-1.5 px-1.5 py-1 min-h-[28px]">
                        <SearchIcon className="text-[#474E5A] flex-shrink-0" />
                        <input
                          ref={searchInputRef}
                          type="text"
                          value={roleSearchQuery}
                          onChange={(e) => setRoleSearchQuery(e.target.value)}
                          placeholder="Search roles..."
                          className="flex-1 text-[13px] text-[#353A44] leading-[19px] tracking-[-0.15px] outline-none placeholder:text-[#818DA0] bg-transparent"
                        />
                      </div>
                    </div>

                    {/* Scrollable Content */}
                    <div className="overflow-y-auto flex-1">
                      {/* Unsaved Role Section */}
                      {showUnsavedRole && unsavedRole && (
                        <div className="p-1 border-b border-[#D8DEE4]">
                          <div className="px-2.5 py-1.5">
                            <span className="text-[12px] font-bold text-[#353A44] leading-5">
                              Unsaved
                            </span>
                          </div>
                          <button
                            ref={role.id === unsavedRole.id ? selectedRoleRef : undefined}
                            onClick={() => {
                              onRoleChange(unsavedRole);
                              setIsRoleSelectorOpen(false);
                            }}
                            className={`w-full flex items-center justify-between gap-3 px-2.5 py-1.5 text-[13px] leading-[19px] tracking-[-0.15px] text-[#353A44] rounded-[6px] transition-colors ${
                              role.id === unsavedRole.id ? "bg-[#F5F6F8]" : "hover:bg-[#F5F6F8]"
                            }`}
                          >
                            <span>{unsavedRole.name || "New Role"}</span>
                            {role.id === unsavedRole.id && <CheckCircleFilledIcon size={12} />}
                          </button>
                        </div>
                      )}

                      {/* Standard Roles Section */}
                      {filteredStandardRoles.length > 0 && (
                        <div className={`p-1 ${filteredCustomRoles.length > 0 ? "border-b border-[#D8DEE4]" : ""}`}>
                          <div className="px-2.5 py-1.5">
                            <span className="text-[12px] font-bold text-[#353A44] leading-5">
                              Standard roles
                            </span>
                          </div>
                          {filteredStandardRoles.map((r) => (
                            <button
                              key={r.id}
                              ref={role.id === r.id ? selectedRoleRef : undefined}
                              onClick={() => {
                                onRoleChange(r);
                                setIsRoleSelectorOpen(false);
                              }}
                              className={`w-full flex items-center justify-between gap-3 px-2.5 py-1.5 text-[13px] leading-[19px] tracking-[-0.15px] text-[#353A44] rounded-[6px] transition-colors ${
                                role.id === r.id ? "bg-[#F5F6F8]" : "hover:bg-[#F5F6F8]"
                              }`}
                            >
                              <span>{r.name}</span>
                              {role.id === r.id && <CheckCircleFilledIcon size={12} />}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Custom Roles Section */}
                      {filteredCustomRoles.length > 0 && (
                        <div className="p-1">
                          <div className="px-2.5 py-1.5">
                            <span className="text-[12px] font-bold text-[#353A44] leading-5">
                              Custom roles
                            </span>
                          </div>
                          {filteredCustomRoles.map((r) => (
                            <button
                              key={r.id}
                              ref={role.id === r.id ? selectedRoleRef : undefined}
                              onClick={() => {
                                onRoleChange(r);
                                setIsRoleSelectorOpen(false);
                              }}
                              className={`w-full flex items-center justify-between gap-3 px-2.5 py-1.5 text-[13px] leading-[19px] tracking-[-0.15px] text-[#353A44] rounded-[6px] transition-colors ${
                                role.id === r.id ? "bg-[#F5F6F8]" : "hover:bg-[#F5F6F8]"
                              }`}
                            >
                              <span>{r.name}</span>
                              {role.id === r.id && <CheckCircleFilledIcon size={12} />}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* No results */}
                      {!showUnsavedRole && filteredStandardRoles.length === 0 && filteredCustomRoles.length === 0 && (
                        <div className="p-4 text-center text-[13px] text-[#596171]">
                          No roles found
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Return to live account button */}
            <button
              onClick={onExit}
              className="w-full py-1.5 px-3 text-[13px] font-medium text-white leading-[19px] tracking-[-0.15px] bg-[#635BFF] hover:bg-[#5851DB] rounded-md transition-colors shadow-[0px_1px_1px_0px_rgba(47,14,99,0.32)]"
            >
              Return to live account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Toggle switch component matching Figma spec
function ToggleSwitch({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex items-center gap-1.5 group"
    >
      <div
        className={`relative w-[26px] h-[14px] rounded-full transition-colors duration-200 ${
          checked ? "bg-[#635BFF]" : "bg-[#C0C8D2]"
        }`}
      >
        <div
          className={`absolute top-[2px] w-[10px] h-[10px] rounded-full bg-white shadow-[0_1px_2px_rgba(0,0,0,0.2)] transition-transform duration-200 ${
            checked ? "translate-x-[14px]" : "translate-x-[2px]"
          }`}
        />
      </div>
      {label && (
        <span className="text-[12px] font-medium text-[#596171] leading-4 select-none group-hover:text-[#353A44] transition-colors">
          {label}
        </span>
      )}
    </button>
  );
}

// GroupCard component: collapsible card wrapping a group of permissions
function GroupCard({
  groupName,
  description,
  permissions: perms,
  roleId,
  groupBy,
  customAccess,
  defaultExpanded = false,
  isFirst = false,
  isLast = false,
  activeApiNames,
  showAll = false,
  invertColors = false,
  useDividers = false,
}: {
  groupName: string;
  description?: string;
  permissions: Permission[];
  roleId: string;
  groupBy: string;
  customAccess?: Record<string, string>;
  defaultExpanded?: boolean;
  isFirst?: boolean;
  isLast?: boolean;
  activeApiNames?: Set<string>;
  showAll?: boolean;
  invertColors?: boolean;
  useDividers?: boolean;
}) {
  return (
    <BaseGroupCard
      groupName={groupName}
      description={description}
      countLabel={
        showAll && activeApiNames
          ? `${perms.filter(p => activeApiNames.has(p.apiName)).length} of ${perms.length}`
          : `${perms.length}`
      }
      isFirst={isFirst}
      isLast={isLast}
      defaultExpanded={defaultExpanded}
      invertColors={invertColors}
      useDividers={useDividers}
    >
      {perms.map((permission) => (
        <PermissionItem
          key={permission.apiName}
          permission={permission}
          roleId={roleId}
          showTaskCategories={false}
          currentGroup={groupName}
          groupBy={groupBy}
          customAccess={customAccess?.[permission.apiName]}
          insideGroup
          isInactive={showAll && activeApiNames ? !activeApiNames.has(permission.apiName) : false}
        />
      ))}
    </BaseGroupCard>
  );
}

// ============================================================
// Team & Security View + Add Member Drawer
// ============================================================

// Permissions panel shown inside the drawer for selected roles
// Reuses the exact same components as the main prototype
function DrawerPermissionsPanel({ roleIds }: { roleIds: string[] }) {
  const [groupBy, setGroupBy] = useState<GroupByOption>("productCategory");
  const [isGrouped, setIsGrouped] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Cumulative permissions across all selected roles (deduplicated)
  const rolePermissions = useMemo(() => {
    if (roleIds.length === 0) return [];
    const seen = new Set<string>();
    const result: Permission[] = [];
    for (const rid of roleIds) {
      for (const p of getPermissionsForRole(rid)) {
        if (!seen.has(p.apiName)) {
          seen.add(p.apiName);
          result.push(p);
        }
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
      p.displayName.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.productCategory.toLowerCase().includes(q) ||
      p.apiName.toLowerCase().includes(q)
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
    <main className="w-[300px] flex-shrink-0 min-h-0 flex flex-col gap-3 p-3 bg-white rounded-lg shadow-[0_2px_5px_0_rgba(48,49,61,0.08),0_1px_1px_0_rgba(0,0,0,0.12)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2">
        <h2 className="text-[14px] font-bold text-[#353A44] leading-5">Permissions</h2>
        {hasRoles && (
          <>
            <span className="bg-[#F5F6F8] text-[10px] font-semibold text-[#596171] leading-4 min-w-[16px] px-1 rounded-full text-center">
              {showAll
                ? (searchQuery
                  ? `${filteredPermissions.filter(p => activeApiNames.has(p.apiName)).length} of ${filteredPermissions.length}`
                  : `${rolePermissions.length} of ${getAllPermissions().length}`)
                : (searchQuery
                  ? `${filteredPermissions.length}/${rolePermissions.length}`
                  : rolePermissions.length)}
            </span>
            <div className="flex-1" />
            <PermissionsFilterMenu
              showAll={showAll}
              onShowAllChange={setShowAll}
              isGrouped={isGrouped}
              onGroupedChange={(v) => {
                setIsGrouped(v);
                if (v && groupBy === "alphabetical") {
                  setGroupBy("productCategory");
                }
              }}
              groupBy={groupBy}
              onGroupByChange={setGroupBy}
            />
          </>
        )}
      </div>

      {/* Empty state */}
      {!hasRoles && (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
          <div className="w-10 h-10 mb-3 text-[#EBEEF1]"><ShieldCheckIcon /></div>
          <p className="text-[13px] text-[#596171] leading-5">Select one or more roles to see their combined permissions here.</p>
        </div>
      )}

      {/* Search */}
      {hasRoles && (
      <div className="flex items-center gap-2 border border-[#D8DEE4] rounded-md px-2 py-1 min-h-[28px] bg-white form-focus-ring">
        <SearchIcon className="text-[#818DA0]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search"
          className="flex-1 text-[13px] text-[#353A44] leading-[19px] tracking-[-0.15px] bg-transparent outline-none placeholder:text-[#818DA0]"
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery("")} className="text-[#818DA0] hover:text-[#353A44] transition-colors">×</button>
        )}
      </div>
      )}

      {/* Permissions list */}
      {hasRoles && (
      <div className={`flex-1 min-h-0 overflow-y-auto flex flex-col ${isGrouped ? "gap-1" : "gap-2"}`}>
        {/* Grouped view */}
        {isGrouped && groupedPermissions && (() => {
          const entries = Object.entries(groupedPermissions).sort(([a], [b]) => a.localeCompare(b));
          const sortedEntries = showAll
            ? entries
                .map(([groupName, perms]) => [groupName, [...perms].sort((a, b) => {
                  const aActive = activeApiNames.has(a.apiName) ? 0 : 1;
                  const bActive = activeApiNames.has(b.apiName) ? 0 : 1;
                  if (aActive !== bActive) return aActive - bActive;
                  return a.displayName.localeCompare(b.displayName);
                })] as [string, Permission[]])
                .sort(([, permsA], [, permsB]) => {
                  const aHasActive = permsA.some(p => activeApiNames.has(p.apiName)) ? 0 : 1;
                  const bHasActive = permsB.some(p => activeApiNames.has(p.apiName)) ? 0 : 1;
                  return aHasActive - bHasActive;
                })
            : entries;
          return sortedEntries.map(([groupName, perms], idx) => (
            <GroupCard
              key={groupName}
              groupName={groupName}
              description={GROUP_DESCRIPTIONS[groupBy]?.[groupName]}
              permissions={perms}
              roleId={roleIds[0] || ""}
              groupBy={groupBy}
              isFirst={idx === 0}
              isLast={idx === sortedEntries.length - 1}
              activeApiNames={showAll ? activeApiNames : undefined}
              showAll={showAll}
            />
          ));
        })()}

        {/* Alphabetical view */}
        {!isGrouped && alphabeticalPermissions && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <h3 className="text-[13px] font-semibold text-[#353A44] leading-[19px] tracking-[-0.15px]">All permissions</h3>
              <span className="inline-flex items-center justify-center min-w-[16px] h-[16px] px-1 bg-[#F5F6F8] text-[10px] font-semibold text-[#596171] leading-4 rounded-full text-center">
                {showAll
                  ? `${alphabeticalPermissions.filter(p => activeApiNames.has(p.apiName)).length} of ${alphabeticalPermissions.length}`
                  : alphabeticalPermissions.length}
              </span>
            </div>
            {alphabeticalPermissions.map((permission) => (
              <PermissionItem
                key={permission.apiName}
                permission={permission}
                roleId={roleIds[0] || ""}
                showTaskCategories={true}
                isInactive={showAll ? !activeApiNames.has(permission.apiName) : false}
              />
            ))}
          </div>
        )}

        {/* Ungrouped with section headers */}
        {!isGrouped && groupedPermissions && Object.entries(groupedPermissions)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([groupName, perms]) => (
            <div key={groupName} className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <h3 className="text-[13px] font-semibold text-[#353A44] leading-[19px] tracking-[-0.15px]">{groupName}</h3>
                <span className="inline-flex items-center justify-center min-w-[16px] h-[16px] px-1 bg-[#F5F6F8] text-[10px] font-semibold text-[#596171] leading-4 rounded-full text-center">
                  {showAll
                    ? `${perms.filter(p => activeApiNames.has(p.apiName)).length} of ${perms.length}`
                    : perms.length}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                {perms.map((permission) => (
                  <PermissionItem
                    key={permission.apiName}
                    permission={permission}
                    roleId={roleIds[0] || ""}
                    showTaskCategories={false}
                    currentGroup={groupName}
                    groupBy={groupBy}
                    isInactive={showAll ? !activeApiNames.has(permission.apiName) : false}
                  />
                ))}
              </div>
            </div>
          ))}

        {filteredPermissions.length === 0 && (
          <div className="text-center py-8 text-[#596171]">
            <div className="w-10 h-10 mx-auto mb-3 text-[#EBEEF1]"><ShieldCheckIcon /></div>
            <p className="text-[13px]">{searchQuery ? `No permissions matching "${searchQuery}"` : "No permissions assigned"}</p>
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="mt-2 text-[13px] text-[#635BFF] hover:underline">Clear search</button>
            )}
          </div>
        )}
      </div>
      )}
    </main>
  );
}


function RolesPermissionsContent({ sandboxMode, setSandboxMode, layoutVersion = "v2" }: {
  sandboxMode: SandboxModeState;
  setSandboxMode: React.Dispatch<React.SetStateAction<SandboxModeState>>;
  layoutVersion?: "v1" | "v2" | "v3";
}) {
  const isV2 = layoutVersion === "v2" || layoutVersion === "v3";
  const isV3 = layoutVersion === "v3";
  const [selectedRole, setSelectedRole] = useState<Role>(allRoles[0]);
  // Only one category can be expanded at a time (accordion behavior)
  const [expandedCategory, setExpandedCategory] = useState<string | null>(roleCategories[0]?.name || null);
  const [groupBy, setGroupBy] = useState<GroupByOption>("productCategory");
  const [isGrouped, setIsGrouped] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const roleDetailsRef = useRef<HTMLElement>(null);
  const [isRiskExpanded, setIsRiskExpanded] = useState(false);
  
  // Custom roles state with localStorage persistence
  const [customRoles, setCustomRoles] = useState<Role[]>([]);
  const [isCustomizeModalOpen, setIsCustomizeModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");

  // Load custom roles from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("customRoles");
    if (saved) {
      try {
        setCustomRoles(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse custom roles:", e);
      }
    }
  }, []);

  // Save custom roles to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("customRoles", JSON.stringify(customRoles));
  }, [customRoles]);

  // Combined role categories including custom roles
  const allCategories = customRoles.length > 0
    ? [...roleCategories, { name: "Custom", roles: customRoles }]
    : roleCategories;

  // All roles including custom ones
  const combinedAllRoles = [...allRoles, ...customRoles];

  const toggleCategory = (categoryName: string) => {
    // If clicking the already expanded category, collapse it; otherwise expand clicked category
    setExpandedCategory((prev) => prev === categoryName ? null : categoryName);
  };

  const handleSaveCustomRole = (newRole: Role) => {
    setCustomRoles(prev => [...prev, newRole]);
    setSelectedRole(newRole);
    setExpandedCategory("Custom");
  };

  const handleUpdateCustomRole = (updatedRole: Role) => {
    setCustomRoles(prev => prev.map(r => r.id === updatedRole.id ? updatedRole : r));
    setSelectedRole(updatedRole);
  };

  const handleDeleteCustomRole = () => {
    if (selectedRole.category !== "Custom") return;
    
    const updatedRoles = customRoles.filter(r => r.id !== selectedRole.id);
    setCustomRoles(updatedRoles);
    
    // Select the first available role after deletion
    const firstRole = roleCategories[0]?.roles[0];
    if (firstRole) {
      setSelectedRole(firstRole);
      setExpandedCategory(roleCategories[0].name);
    }
  };

  // For custom roles, we need to handle permissions differently
  const rolePermissions = selectedRole.permissionAccess
    ? getAllPermissions().filter(p => p.apiName in selectedRole.permissionAccess!)
    : selectedRole.permissionApiNames
    ? getAllPermissions().filter(p => selectedRole.permissionApiNames!.includes(p.apiName))
    : getPermissionsForRole(selectedRole.id);
  
  // When showAll is true, display all permissions with inactive ones dimmed
  const activeApiNames = useMemo(() => new Set(rolePermissions.map(p => p.apiName)), [rolePermissions]);
  const displayPermissions = showAll ? getAllPermissions() : rolePermissions;

  // Generate risk assessment for the current role
  const riskAssessment = generateRiskAssessment(rolePermissions);
  
  // Filter permissions by search query
  const filteredPermissions = searchQuery
    ? displayPermissions.filter(
        (p) =>
          p.apiName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.productCategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.taskCategories.some(tc => tc.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : displayPermissions;
  
  // Sort: active permissions first, then inactive
  const sortedFilteredPermissions = showAll
    ? [...filteredPermissions].sort((a, b) => {
        const aActive = activeApiNames.has(a.apiName) ? 0 : 1;
        const bActive = activeApiNames.has(b.apiName) ? 0 : 1;
        if (aActive !== bActive) return aActive - bActive;
        return a.displayName.localeCompare(b.displayName);
      })
    : filteredPermissions;

  const groupedPermissions = groupBy !== "alphabetical" 
    ? groupPermissions(sortedFilteredPermissions, groupBy)
    : null;
  
  const alphabeticalPermissions = groupBy === "alphabetical"
    ? [...sortedFilteredPermissions].sort((a, b) => {
        if (showAll) {
          const aActive = activeApiNames.has(a.apiName) ? 0 : 1;
          const bActive = activeApiNames.has(b.apiName) ? 0 : 1;
          if (aActive !== bActive) return aActive - bActive;
        }
        return a.apiName.localeCompare(b.apiName);
      })
    : null;

  return (
    <>
      <div className="flex-1 min-h-0 flex flex-col gap-6 overflow-hidden">

        {/* Main content - 3 panels */}
        <div className="flex flex-1 min-h-0 gap-6 overflow-hidden max-w-[1400px] mx-auto">
        {/* Left Panel - Roles List */}
        {/* Baseline alignment: 16px title needs pt-[23px] to align with section's 20px title at pt-5/pt-3+8 */}
        <aside className="w-[240px] max-w-[240px] overflow-y-auto flex-shrink-0 pt-[23px] relative">
          {/* Header */}
          <div className="flex items-center gap-2.5 pb-4 border-b border-[#EBEEF1]">
            <h2 className="flex-1 text-[16px] font-bold text-[#353A44] leading-6 tracking-[-0.31px]" style={{ fontFeatureSettings: "'lnum', 'pnum'" }}>Roles</h2>
          </div>

          {/* Categories */}
          <div className="flex flex-col">
            {allCategories.map((category) => {
              const isExpanded = expandedCategory === category.name;
              return (
                <div 
                  key={category.name} 
                  className="border-b border-[#EBEEF1] transition-[padding] duration-300"
                  style={{ 
                    padding: isExpanded ? '4px 0' : '4px 0',
                    transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
                  }}
                >
                  {/* Category header */}
                  <button
                    onClick={() => toggleCategory(category.name)}
                    className="w-full flex items-center gap-2 px-2 py-1 rounded-md hover:bg-[#F5F6F8] transition-colors"
                  >
                    <span className="flex-1 text-left text-[13px] font-semibold text-[#353A44] leading-[19px] tracking-[-0.15px]">
                      {category.name}
                    </span>
                    <span className="text-[10px] font-semibold text-[#596171] leading-4 min-w-[16px] px-1 text-center">
                      {category.roles.length}
                    </span>
                    <ChevronDown 
                      className="w-4 h-4 text-[#474E5A] transition-transform duration-300"
                      style={{
                        transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                        transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
                      }}
                    />
                  </button>

                  {/* Roles in category - animated accordion */}
                  <div 
                    className="grid transition-[grid-template-rows] duration-300"
                    style={{ 
                      gridTemplateRows: isExpanded ? '1fr' : '0fr',
                      transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                    }}
                  >
                    <div className="overflow-hidden">
                      <div className="flex flex-col gap-px mt-px">
                        {category.roles.map((role, index) => (
                          <button
                            key={role.id}
                            onClick={() => {
                              setSelectedRole(role);
                              setSearchQuery(""); // Clear search when switching roles
                              roleDetailsRef.current?.scrollTo(0, 0); // Reset scroll position
                            }}
                            className={`w-full text-left px-2 py-1 text-[13px] leading-[19px] tracking-[-0.15px] rounded-md transition-[background-color] duration-150 ${
                              selectedRole.id === role.id
                                ? "bg-[#F7F5FD] text-[#533AFD]"
                                : "text-[#353A44] hover:bg-[#F5F6F8]"
                            }`}
                            style={{ 
                              transitionProperty: 'opacity, transform, background-color, color',
                              transitionDuration: '250ms',
                              transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
                              transitionDelay: isExpanded ? `${index * 40}ms` : '0ms',
                              opacity: isExpanded ? 1 : 0,
                              transform: isExpanded ? 'translateY(0) scale(1)' : 'translateY(-8px) scale(0.95)',
                              pointerEvents: isExpanded ? 'auto' : 'none'
                            }}
                          >
                            {role.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </aside>

        {/* Shared Container for Role Details + Permissions */}
        <div className={`flex-1 min-h-0 flex gap-4 overflow-hidden ${isV2 ? '' : 'bg-[#F5F6F8] rounded-xl p-2'}`}>
          {/* Role Details Panel */}
          {/* Baseline alignment: pt-5 (20px) for the 20px title; in v1 subtract container's p-2 (8px) → pt-3 */}
          <section ref={roleDetailsRef} className={`flex-1 flex flex-col gap-6 overflow-y-auto ${isV2 ? 'pt-5 pl-6' : 'px-4 pt-3 pb-[13px]'}`}>
            {/* Header */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <h2 className="text-[20px] font-bold text-[#353A44] leading-7 tracking-[0.3px] font-display" style={{ fontFeatureSettings: "'lnum', 'pnum'" }}>
                  {selectedRole.name}
                </h2>
                <Tooltip content={`There are ${selectedRole.userCount} users with the ${selectedRole.name} role`}>
                  <span className={`${isV2 ? 'bg-[#F5F6F8]' : 'bg-white'} text-[10px] font-semibold text-[#596171] leading-4 min-w-[16px] px-1 rounded-full text-center cursor-default`}>
                    {selectedRole.userCount}
                  </span>
                </Tooltip>
                {selectedRole.category === "Custom" && (
                  <span className="bg-[#e2fbfe] text-[#045ad0] text-[12px] font-normal px-2 py-0.5 rounded flex-shrink-0">
                    Custom
                  </span>
                )}
                <div className="flex-1" />
                <RoleMenu 
                  onDuplicate={() => {
                    setModalMode("create");
                    setIsCustomizeModalOpen(true);
                  }}
                  onEdit={selectedRole.category === "Custom" ? () => {
                    setModalMode("edit");
                    setIsCustomizeModalOpen(true);
                  } : undefined}
                  isCustomRole={selectedRole.category === "Custom"}
                  onDelete={handleDeleteCustomRole}
                  onTestInSandbox={() => setSandboxMode({ active: true, role: selectedRole, unsavedRole: null, sourceModal: "menu" })}
                />
              </div>
              {/* Description */}
              {selectedRole.details?.description && (
                <p className="text-[13px] text-[#596171] leading-[19px] tracking-[-0.15px]">
                  {selectedRole.details.description}
                </p>
              )}
            </div>

            {/* Can, Cannot - combined container */}
            <div className={`${isV3 ? '' : isV2 ? 'bg-[#F5F6F8] rounded-lg p-4' : 'bg-white rounded-lg p-4'} flex flex-col`}>
              {/* Can section */}
              <div className="pb-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircleIcon />
                  <span className="text-[13px] font-semibold text-[#353A44] leading-[19px] tracking-[-0.15px]">Can</span>
                </div>
                {selectedRole.details?.canDo && selectedRole.details.canDo.length > 0 ? (
                  <ul className="list-disc pl-4 flex flex-col gap-1">
                    {selectedRole.details.canDo.map((item, index) => (
                      <li key={index} className="text-[13px] text-[#353A44] leading-[19px] tracking-[-0.15px] pl-1">{item}</li>
                    ))}
                  </ul>
                ) : (
                  <div className="flex flex-col gap-2.5 py-1.5">
                    <div className="h-2 bg-[#EBEEF1] rounded-lg w-full"></div>
                    <div className="h-2 bg-[#EBEEF1] rounded-lg w-full"></div>
                  </div>
                )}
              </div>

              <div className="h-px bg-[#EBEEF1]" />

              {/* Cannot section */}
              <div className="py-4">
                <div className="flex items-center gap-2 mb-2">
                  <CancelCircleIcon />
                  <span className="text-[13px] font-semibold text-[#353A44] leading-[19px] tracking-[-0.15px]">Cannot</span>
                </div>
                {selectedRole.details?.cannotDo && selectedRole.details.cannotDo.length > 0 ? (
                  <ul className="list-disc pl-4 flex flex-col gap-1">
                    {selectedRole.details.cannotDo.map((item, index) => (
                      <li key={index} className="text-[13px] text-[#353A44] leading-[19px] tracking-[-0.15px] pl-1">{item}</li>
                    ))}
                  </ul>
                ) : (
                  <div className="flex flex-col gap-2.5 py-1.5">
                    <div className="h-2 bg-[#EBEEF1] rounded-lg w-full"></div>
                    <div className="h-2 bg-[#EBEEF1] rounded-lg w-full"></div>
                  </div>
                )}
              </div>

              <div className="h-px bg-[#EBEEF1]" />

              {/* Note */}
              <p className="pt-4 text-[12px] text-[#596171] leading-4">
                Note: The capabilities listed are highlights only. Refer to the permissions panel for the complete, authoritative list of what each role can access.
              </p>
            </div>

            {/* Risk Assessment - own container */}
            <div className={`${isV3 ? '' : isV2 ? 'p-4 bg-[#F5F6F8] rounded-lg' : 'p-4 bg-white rounded-lg'}`}>
              <RiskAssessmentCard 
                assessment={riskAssessment} 
                isExpanded={isRiskExpanded}
                onToggle={() => setIsRiskExpanded(!isRiskExpanded)}
              />
            </div>
          </section>

          {/* Permissions Panel */}
          {/* Baseline alignment: pt-6 (24px) for the 16px title; in v1 container's p-2 (8px) + p-4 (16px) = 24px */}
          <main className={`flex-1 min-h-0 flex flex-col gap-4 rounded-lg overflow-hidden ${isV2 ? 'bg-[#F5F6F8] pt-6 px-4 pb-4' : 'p-4 bg-white shadow-[0_2px_5px_0_rgba(48,49,61,0.08),0_1px_1px_0_rgba(0,0,0,0.12)]'}`}>
            {/* Header */}
            <div className="flex items-baseline gap-2">
              <h2 className="text-[16px] font-bold text-[#353A44] leading-6 tracking-[-0.31px]" style={{ fontFeatureSettings: "'lnum', 'pnum'" }}>Permissions</h2>
              <span className={`${isV2 ? 'bg-white' : 'bg-[#F5F6F8]'} text-[10px] font-semibold text-[#596171] leading-4 min-w-[16px] px-1 rounded-full text-center`}>
                {showAll
                  ? (searchQuery
                    ? `${filteredPermissions.filter(p => activeApiNames.has(p.apiName)).length} of ${filteredPermissions.length}`
                    : `${rolePermissions.length} of ${getAllPermissions().length}`)
                  : (searchQuery
                    ? `${filteredPermissions.length}/${rolePermissions.length}`
                    : rolePermissions.length)}
              </span>
              <div className="flex-1" />
              <PermissionsFilterMenu
                showAll={showAll}
                onShowAllChange={setShowAll}
                isGrouped={isGrouped}
                onGroupedChange={(v) => {
                  setIsGrouped(v);
                  if (v && groupBy === "alphabetical") {
                    setGroupBy("productCategory");
                  }
                }}
                groupBy={groupBy}
                onGroupByChange={setGroupBy}
              />
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              {/* Search field */}
              <div className="flex-1 flex items-center gap-2 border border-[#D8DEE4] rounded-md px-2 py-1 min-h-[28px] bg-white form-focus-ring">
                <SearchIcon className="text-[#818DA0]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search"
                  className="flex-1 text-[13px] text-[#353A44] leading-[19px] tracking-[-0.15px] bg-transparent outline-none placeholder:text-[#818DA0]"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="text-[#818DA0] hover:text-[#353A44] transition-colors"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            {/* Permissions list */}
            <div className={`flex-1 min-h-0 overflow-y-auto flex flex-col ${isV3 ? "gap-0" : isGrouped ? "gap-1" : "gap-2"}`}>
              {/* Grouped view: collapsible GroupCards */}
              {isGrouped && groupedPermissions && (() => {
                const entries = Object.entries(groupedPermissions).sort(([a], [b]) => a.localeCompare(b));
                // When showAll is on, sort active bundles and permissions to the top
                const sortedEntries = showAll
                  ? entries
                      .map(([groupName, perms]) => [groupName, [...perms].sort((a, b) => {
                        const aActive = activeApiNames.has(a.apiName) ? 0 : 1;
                        const bActive = activeApiNames.has(b.apiName) ? 0 : 1;
                        if (aActive !== bActive) return aActive - bActive;
                        return a.displayName.localeCompare(b.displayName);
                      })] as [string, Permission[]])
                      .sort(([, permsA], [, permsB]) => {
                        const aHasActive = permsA.some(p => activeApiNames.has(p.apiName)) ? 0 : 1;
                        const bHasActive = permsB.some(p => activeApiNames.has(p.apiName)) ? 0 : 1;
                        return aHasActive - bHasActive;
                      })
                  : entries;
                return sortedEntries.map(([groupName, perms], idx) => (
                  <GroupCard
                    key={groupName}
                    groupName={groupName}
                    description={GROUP_DESCRIPTIONS[groupBy]?.[groupName]}
                    permissions={perms}
                    roleId={selectedRole.id}
                    groupBy={groupBy}
                    customAccess={selectedRole.permissionAccess}
                    isFirst={idx === 0}
                    isLast={idx === sortedEntries.length - 1}
                    activeApiNames={showAll ? activeApiNames : undefined}
                    showAll={showAll}
                    invertColors={isV2}
                    useDividers={isV3}
                  />
                ));
              })()}

              {/* Ungrouped: Alphabetical (flat list) - show task categories as tags */}
              {!isGrouped && alphabeticalPermissions && (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-[13px] font-semibold text-[#353A44] leading-[19px] tracking-[-0.15px]">
                      All permissions
                    </h3>
                    <span className={`inline-flex items-center justify-center min-w-[16px] h-[16px] px-1 ${isV2 ? 'bg-white' : 'bg-[#F5F6F8]'} text-[10px] font-semibold text-[#596171] leading-4 rounded-full text-center`}>
                      {showAll
                        ? `${alphabeticalPermissions.filter(p => activeApiNames.has(p.apiName)).length} of ${alphabeticalPermissions.length}`
                        : alphabeticalPermissions.length}
                    </span>
                  </div>
                  {alphabeticalPermissions.map((permission) => (
                    <PermissionItem
                      key={permission.apiName}
                      permission={permission}
                      roleId={selectedRole.id}
                      showTaskCategories={true}
                      customAccess={selectedRole.permissionAccess?.[permission.apiName]}
                      isInactive={showAll ? !activeApiNames.has(permission.apiName) : false}
                    />
                  ))}
                </div>
              )}

              {/* Ungrouped: list with section headers */}
              {!isGrouped && groupedPermissions && Object.entries(groupedPermissions)
                .sort(([a], [b]) => {
                  if (showAll) {
                    const aHasActive = groupedPermissions[a].some(p => activeApiNames.has(p.apiName)) ? 0 : 1;
                    const bHasActive = groupedPermissions[b].some(p => activeApiNames.has(p.apiName)) ? 0 : 1;
                    if (aHasActive !== bHasActive) return aHasActive - bHasActive;
                  }
                  return a.localeCompare(b);
                })
                .map(([groupName, perms]) => (
                  <div key={groupName} className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-[13px] font-semibold text-[#353A44] leading-[19px] tracking-[-0.15px]">
                        {groupName}
                      </h3>
                      <span className={`inline-flex items-center justify-center min-w-[16px] h-[16px] px-1 ${isV2 ? 'bg-white' : 'bg-[#F5F6F8]'} text-[10px] font-semibold text-[#596171] leading-4 rounded-full text-center`}>
                        {showAll
                          ? `${perms.filter(p => activeApiNames.has(p.apiName)).length} of ${perms.length}`
                          : perms.filter(p => activeApiNames.has(p.apiName)).length}
                      </span>
                    </div>
                    <div className="flex flex-col gap-2">
                      {perms.map((permission) => (
                        <PermissionItem
                          key={permission.apiName}
                          permission={permission}
                          roleId={selectedRole.id}
                          showTaskCategories={false}
                          currentGroup={groupName}
                          groupBy={groupBy}
                          customAccess={selectedRole.permissionAccess?.[permission.apiName]}
                          isInactive={showAll ? !activeApiNames.has(permission.apiName) : false}
                        />
                      ))}
                    </div>
                  </div>
                ))}

              {filteredPermissions.length === 0 && (
                <div className="text-center py-12 text-[#596171]">
                  <div className="w-12 h-12 mx-auto mb-4 text-[#EBEEF1]"><ShieldCheckIcon /></div>
                  <p>{searchQuery ? `No permissions matching "${searchQuery}"` : "No permissions assigned to this role"}</p>
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="mt-2 text-[13px] text-[#635BFF] hover:underline"
                    >
                      Clear search
                    </button>
                  )}
                </div>
              )}
            </div>
          </main>
        </div>
        </div>
      </div>

      {/* Customize Role Modal */}
      <CustomizeRoleModal
        isOpen={isCustomizeModalOpen}
        onClose={() => {
          setIsCustomizeModalOpen(false);
          // Clear sandbox modal state when closing the modal (done editing)
          setSandboxMode(prev => ({ ...prev, sourceModal: undefined, modalState: undefined }));
        }}
        baseRole={selectedRole}
        onSave={(role) => {
          handleSaveCustomRole(role);
          // Clear sandbox modal state after saving
          setSandboxMode(prev => ({ ...prev, sourceModal: undefined, modalState: undefined }));
        }}
        onUpdate={(role) => {
          handleUpdateCustomRole(role);
          // Clear sandbox modal state after updating
          setSandboxMode(prev => ({ ...prev, sourceModal: undefined, modalState: undefined }));
        }}
        initialGroupBy={groupBy}
        mode={modalMode}
        onTestInSandbox={(previewRole, modalState) => {
          setIsCustomizeModalOpen(false);
          setSandboxMode({ 
            active: true, 
            role: previewRole, 
            unsavedRole: previewRole, 
            sourceModal: "customize",
            modalState 
          });
        }}
        initialState={sandboxMode.sourceModal === "customize" ? sandboxMode.modalState : undefined}
      />

      {/* Create Role Modal */}
      <CreateRoleModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          // Clear sandbox modal state when closing the modal (done editing)
          setSandboxMode(prev => ({ ...prev, sourceModal: undefined, modalState: undefined }));
        }}
        onSave={(newRole) => {
          handleSaveCustomRole(newRole);
          setSelectedRole(newRole);
          setExpandedCategory("Custom");
          // Clear sandbox modal state after saving
          setSandboxMode(prev => ({ ...prev, sourceModal: undefined, modalState: undefined }));
        }}
        initialGroupBy={groupBy}
        onTestInSandbox={(previewRole, modalState) => {
          setIsCreateModalOpen(false);
          setSandboxMode({ 
            active: true, 
            role: previewRole, 
            unsavedRole: previewRole, 
            sourceModal: "create",
            modalState 
          });
        }}
        initialState={sandboxMode.sourceModal === "create" ? sandboxMode.modalState : undefined}
      />
    </>
  );
}

// ===== Add Member Modal (from Team & Security flow) =====
const MOCK_ACCOUNTS = [
  { id: "del-ca", name: "Acme Deliveries CA", group: "Deliveries" },
  { id: "del-uk", name: "Acme Deliveries UK", group: "Deliveries" },
  { id: "del-us", name: "Acme Deliveries US", group: "Deliveries" },
  { id: "eats-ca", name: "Acme Eats CA", group: "Eats" },
  { id: "eats-uk", name: "Acme Eats UK", group: "Eats" },
  { id: "eats-us", name: "Acme Eats US", group: "Eats" },
  { id: "rides-ca", name: "Acme Rides CA", group: "Rides" },
  { id: "rides-uk", name: "Acme Rides UK", group: "Rides" },
  { id: "rides-us", name: "Acme Rides US", group: "Rides" },
];
const ACCOUNT_GROUPS = ["All", ...Array.from(new Set(MOCK_ACCOUNTS.map(a => a.group)))];
const ALL_ACCOUNT_IDS = new Set(MOCK_ACCOUNTS.map(a => a.id));

function AddMemberModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [emails, setEmails] = useState<string[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [selectedAccount, setSelectedAccount] = useState<"all" | "selected">("all");
  const [selectedAccounts, setSelectedAccounts] = useState<Set<string>>(new Set(ALL_ACCOUNT_IDS));
  const [showAccountPicker, setShowAccountPicker] = useState(false);
  const [accountGroupFilter, setAccountGroupFilter] = useState("All");
  const [accountSearch, setAccountSearch] = useState("");
  const [selectedRoles, setSelectedRoles] = useState<Set<string>>(new Set());
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [showPermissions, setShowPermissions] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [emailVisibleCount, setEmailVisibleCount] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const accountSearchRef = useRef<HTMLInputElement>(null);
  const emailReviewRef = useRef<HTMLParagraphElement>(null);
  const step3ContentRef = useRef<HTMLDivElement>(null);
  const step3ModalRef = useRef<HTMLDivElement>(null);
  const [step3ContentHeight, setStep3ContentHeight] = useState<number | null>(null);
  const prevShowPermRef = useRef(showPermissions);
  const [permClosingPhase, setPermClosingPhase] = useState<'width' | null>(null);
  const [rolesMaxWidth, setRolesMaxWidth] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      setStep(1); setEmails([]); setCurrentInput(""); setSelectedAccount("all");
      setSelectedAccounts(new Set(ALL_ACCOUNT_IDS)); setShowAccountPicker(false); setAccountGroupFilter("All"); setAccountSearch("");
      setSelectedRoles(new Set()); setExpandedCategories(new Set()); setShowPermissions(false); setIsClosing(false);
      setEmailVisibleCount(0); setPermClosingPhase(null); setRolesMaxWidth(null);
      // Focus the email input after the modal animation settles
      requestAnimationFrame(() => { inputRef.current?.focus(); });
    }
  }, [isOpen]);

  // Measure how many emails fit in 2 lines on the review screen
  useEffect(() => {
    const el = emailReviewRef.current;
    if (!el || emails.length === 0 || step !== 4) {
      setEmailVisibleCount(emails.length);
      return;
    }
    const lineHeight = 20; // leading-5
    const maxHeight = lineHeight * 2 + 1; // 2 lines with tolerance

    // Try showing all emails first
    let count = emails.length;
    el.textContent = emails.join(", ");
    if (el.scrollHeight <= maxHeight) {
      setEmailVisibleCount(emails.length);
      return;
    }

    // Progressively reduce until it fits in 2 lines
    for (count = emails.length - 1; count >= 1; count--) {
      el.textContent = emails.slice(0, count).join(", ") + ` +${emails.length - count} more`;
      if (el.scrollHeight <= maxHeight) break;
    }
    setEmailVisibleCount(count);
  }, [emails, step]);

  const emailDisplayText = useMemo(() => {
    if (emails.length === 0) return "No emails entered";
    if (emailVisibleCount >= emails.length) return emails.join(", ");
    return emails.slice(0, emailVisibleCount).join(", ") + ` +${emails.length - emailVisibleCount} more`;
  }, [emails, emailVisibleCount]);

  // Detect permissions closing on this render (ref has previous value, updated in effect below)
  const justClosedPerm = prevShowPermRef.current && !showPermissions && step === 3;
  const isClosingWidth = permClosingPhase === 'width' || justClosedPerm;

  // Handle permissions closing: capture roles column width and start the width-first phase.
  useLayoutEffect(() => {
    if (prevShowPermRef.current && !showPermissions && step === 3) {
      // Navigate from role list ref → scroll container → roles column
      const rolesCol = step3ContentRef.current?.parentElement?.parentElement;
      if (rolesCol) {
        setRolesMaxWidth(rolesCol.offsetWidth);
      }
      setPermClosingPhase('width');
    }
    prevShowPermRef.current = showPermissions;
  }, [step, showPermissions]);

  // End the width phase after the width transition completes (500ms)
  useEffect(() => {
    if (permClosingPhase === 'width') {
      const timer = setTimeout(() => {
        setPermClosingPhase(null);
        setRolesMaxWidth(null);
      }, 520);
      return () => clearTimeout(timer);
    }
  }, [permClosingPhase]);

  // Observe step 3 role list height for dynamic modal sizing.
  // Measures "chrome height" (close button, title, roles header, info box, footer, gaps)
  // by temporarily collapsing the scroll container, then target = chrome + roleList.scrollHeight.
  // useLayoutEffect ensures measurement happens before paint (no flash).
  useLayoutEffect(() => {
    if (step !== 3) {
      setStep3ContentHeight(null);
      return;
    }
    if (showPermissions) {
      // Keep the existing step3ContentHeight so the modal can smoothly
      // transition from height:100% back to content height when permissions close.
      return;
    }
    const roleListEl = step3ContentRef.current;
    const modalEl = step3ModalRef.current;
    if (!roleListEl || !modalEl) return;
    const scrollContainer = roleListEl.parentElement;
    if (!scrollContainer) return;

    // Measure chrome by temporarily collapsing the scroll container and the
    // hidden permissions panel (which can inflate the flex row's cross-axis height).
    const prevModalHeight = modalEl.style.height;
    modalEl.style.height = '';
    scrollContainer.style.maxHeight = '0';
    scrollContainer.style.overflow = 'hidden';
    const rolesColumn = scrollContainer.parentElement;
    const flexRow = rolesColumn?.parentElement;
    const permissionsPanel = flexRow?.lastElementChild as HTMLElement | null;
    const prevPermDisplay = permissionsPanel && permissionsPanel !== rolesColumn
      ? permissionsPanel.style.display : null;
    if (prevPermDisplay !== null && permissionsPanel) {
      permissionsPanel.style.display = 'none';
    }
    const chromeHeight = modalEl.offsetHeight;
    if (prevPermDisplay !== null && permissionsPanel) {
      permissionsPanel.style.display = prevPermDisplay;
    }
    scrollContainer.style.maxHeight = '';
    scrollContainer.style.overflow = '';
    modalEl.style.height = prevModalHeight;

    const measure = () => {
      setStep3ContentHeight(chromeHeight + roleListEl.scrollHeight + 8);
    };
    const ro = new ResizeObserver(measure);
    ro.observe(roleListEl);
    measure();
    return () => ro.disconnect();
  }, [step, showPermissions]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => { onClose(); setIsClosing(false); }, 300);
  };

  const addEmail = (raw: string) => {
    const trimmed = raw.trim().replace(/,$/,'').trim();
    if (trimmed && trimmed.includes("@") && !emails.includes(trimmed)) setEmails(prev => [...prev, trimmed]);
    setCurrentInput("");
  };

  const removeEmail = (email: string) => setEmails(prev => prev.filter(e => e !== email));

  const handleEmailKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      if (currentInput.trim()) addEmail(currentInput);
      setStep(2);
      return;
    }
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

  // Account picker derived data
  const filteredAccounts = useMemo(() => {
    let accts = accountGroupFilter === "All" ? MOCK_ACCOUNTS : MOCK_ACCOUNTS.filter(a => a.group === accountGroupFilter);
    if (accountSearch.trim()) {
      const q = accountSearch.trim().toLowerCase();
      accts = accts.filter(a => a.name.toLowerCase().includes(q));
    }
    return accts;
  }, [accountGroupFilter, accountSearch]);

  const groupCounts = useMemo(() => {
    const counts: Record<string, number> = { All: MOCK_ACCOUNTS.length };
    for (const a of MOCK_ACCOUNTS) counts[a.group] = (counts[a.group] || 0) + 1;
    return counts;
  }, []);

  const toggleAccount = (id: string) => {
    setSelectedAccounts(prev => { const next = new Set(prev); if (next.has(id)) next.delete(id); else next.add(id); return next; });
  };

  const toggleAllVisible = () => {
    const allSelected = filteredAccounts.every(a => selectedAccounts.has(a.id));
    setSelectedAccounts(prev => {
      const next = new Set(prev);
      if (allSelected) { filteredAccounts.forEach(a => next.delete(a.id)); }
      else { filteredAccounts.forEach(a => next.add(a.id)); }
      return next;
    });
  };

  const stepLabels: Record<number, string> = { 1: "Add team members", 2: "Which accounts should be accessible?", 3: "Select roles", 4: "Review" };

  if (!isOpen && !isClosing) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-8">
      <div className={`absolute inset-0 bg-[rgba(182,192,205,0.7)] ${isClosing ? 'animate-fade-out' : 'animate-fade-in'}`} onClick={handleClose} />
      <div
        ref={step3ModalRef}
        className={`relative bg-white rounded-[12px] shadow-[0px_15px_35px_0px_rgba(48,49,61,0.08),0px_5px_15px_0px_rgba(0,0,0,0.12)] flex flex-col overflow-hidden ${isClosing ? 'animate-modal-out' : 'animate-modal-in'}`}
        style={{
          ...(step === 3 ? {
            transition: isClosingWidth
              ? 'width 500ms cubic-bezier(0.4,0,0.2,1), max-width 500ms cubic-bezier(0.4,0,0.2,1)'
              : 'width 500ms cubic-bezier(0.4,0,0.2,1), max-width 500ms cubic-bezier(0.4,0,0.2,1), height 200ms ease-in-out',
          } : {}),
          ...(step === 3
            ? {
                width: showPermissions ? '100%' : 640,
                maxWidth: showPermissions ? 1280 : 640,
                maxHeight: '100%',
                ...(showPermissions || isClosingWidth
                  ? { height: '100%' }
                  : step3ContentHeight != null
                    ? { height: step3ContentHeight }
                    : {}),
              }
            : { width: 640, ...(step === 4 ? { maxHeight: '100%' } : { height: 480 }) }),
        }}
      >
        <div className="flex items-end justify-end pt-6 px-6 flex-shrink-0">
          <button onClick={handleClose} className="text-[#6C7688] hover:text-[#353A44] transition-colors">
            <X size={16} />
          </button>
        </div>
        <div className={`${step === 3 && !showPermissions && !isClosingWidth ? 'min-h-0' : 'flex-1 min-h-0'} overflow-hidden flex flex-col`}>
          {step === 1 && (
            <div className="flex-1 overflow-y-auto flex flex-col gap-8 p-8 pt-0">
              <div className="flex flex-col gap-1">
                <h2 className="text-[24px] font-bold text-[#21252C] leading-8 tracking-[0.3px] font-display" style={{ fontFeatureSettings: "'lnum', 'pnum'" }}>{stepLabels[step]}</h2>
                <p className="text-[14px] text-[#353A44] leading-5 tracking-[-0.15px]">Enter team member email addresses. Invited members will share the same roles.</p>
              </div>
              <div className="flex-1 flex flex-wrap content-start items-start gap-1.5 px-3 py-2 border border-[#D8DEE4] rounded-[6px] form-focus-ring cursor-text" onClick={() => inputRef.current?.focus()}>
                {emails.map((email) => (
                  <span key={email} className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#F5F6F8] text-[16px] text-[#353A44] rounded-full leading-6 tracking-[-0.31px]">
                    {email}
                    <button onClick={(e) => { e.stopPropagation(); removeEmail(email); }} className="text-[#596171] hover:text-[#353A44] ml-0.5"><X size={12} /></button>
                  </span>
                ))}
                <input ref={inputRef} type="text" value={currentInput} onChange={(e) => setCurrentInput(e.target.value)}
                  onKeyDown={handleEmailKeyDown} onPaste={handleEmailPaste} onBlur={() => { if (currentInput.trim()) addEmail(currentInput); }}
                  placeholder={emails.length === 0 ? "ada@example.com, ben@example.com, etc." : ""}
                  className="flex-1 min-w-[120px] text-[16px] text-[#353A44] leading-6 tracking-[-0.31px] placeholder:text-[#6C7688] bg-transparent border-none outline-none py-0.5"
                  autoFocus
                  style={{ fontFeatureSettings: "'lnum', 'pnum'" }}
                />
              </div>
            </div>
          )}
          {step === 2 && !showAccountPicker && (
            <div className="flex-1 overflow-y-auto flex flex-col gap-8 px-8 pb-0">
              <div className="flex flex-col gap-1">
                <h2 className="text-[24px] font-bold text-[#21252C] leading-8 tracking-[0.3px] font-display" style={{ fontFeatureSettings: "'lnum', 'pnum'" }}>{stepLabels[step]}</h2>
              </div>
              <div className="flex gap-4 flex-1 min-h-0">
                <button onClick={() => setSelectedAccount("all")}
                  className={`flex-1 flex flex-col rounded-[6px] text-left transition-colors ${selectedAccount === "all" ? 'border-2 border-[#675DFF]' : 'border border-[#D8DEE4] hover:border-[#A3ACB9]'}`}>
                  <div className={`flex-1 w-full rounded-t-[5px] ${selectedAccount === "all" ? 'bg-[#F7F5FD]' : 'bg-[#F5F6F8]'}`} />
                  <div className="p-4 shrink-0">
                    <p className={`text-[16px] font-semibold leading-6 tracking-[-0.31px] ${selectedAccount === "all" ? 'text-[#533AFD]' : 'text-[#596171]'}`} style={{ fontFeatureSettings: "'lnum', 'pnum'" }}>Your whole organization</p>
                    <p className="text-[14px] text-[#596171] leading-5 tracking-[-0.15px] mt-0.5">Grant access to all accounts organization-wide, including accounts added in the future.</p>
                  </div>
                </button>
                <button onClick={() => setSelectedAccount("selected")}
                  className={`flex-1 flex flex-col rounded-[6px] text-left transition-colors ${selectedAccount === "selected" ? 'border-2 border-[#675DFF]' : 'border border-[#D8DEE4] hover:border-[#A3ACB9]'}`}>
                  <div className={`flex-1 w-full rounded-t-[5px] ${selectedAccount === "selected" ? 'bg-[#F7F5FD]' : 'bg-[#F5F6F8]'}`} />
                  <div className="p-4 shrink-0">
                    <p className={`text-[16px] font-semibold leading-6 tracking-[-0.31px] ${selectedAccount === "selected" ? 'text-[#533AFD]' : 'text-[#596171]'}`} style={{ fontFeatureSettings: "'lnum', 'pnum'" }}>Only select accounts</p>
                    <p className="text-[14px] text-[#596171] leading-5 tracking-[-0.15px] mt-0.5">Grant access to specific accounts only. Future accounts won't automatically receive this role.</p>
                  </div>
                </button>
              </div>
            </div>
          )}
          {step === 2 && showAccountPicker && (() => {
            const visibleSelectedCount = filteredAccounts.filter(a => selectedAccounts.has(a.id)).length;
            const allVisibleSelected = filteredAccounts.length > 0 && visibleSelectedCount === filteredAccounts.length;
            const someVisibleSelected = visibleSelectedCount > 0 && !allVisibleSelected;
            return (
              <div className="flex-1 min-h-0 flex flex-col">
                <div className="px-8">
                  <h2 className="text-[24px] font-bold text-[#21252C] leading-8 tracking-[0.3px] font-display" style={{ fontFeatureSettings: "'lnum', 'pnum'" }}>Choose accounts from your organization</h2>
                </div>
                <div className="flex-1 min-h-0 flex pt-4">
                  {/* Group filter sidebar */}
                  <div className="w-[240px] shrink-0 pl-6 pt-4 relative">
                    <div
                      className="h-full overflow-y-auto flex flex-col gap-px rounded-[6px]"
                      ref={(el) => {
                        if (!el) return;
                        const update = () => {
                          const shadow = el.nextElementSibling as HTMLElement | null;
                          if (shadow) {
                            const canScroll = el.scrollHeight > el.clientHeight;
                            const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 2;
                            shadow.style.opacity = canScroll && !atBottom ? '1' : '0';
                          }
                        };
                        el.addEventListener('scroll', update);
                        requestAnimationFrame(update);
                      }}
                    >
                      {ACCOUNT_GROUPS.map(group => {
                        const isActive = accountGroupFilter === group;
                        return (
                          <button
                            key={group}
                            onClick={() => {
                              setAccountGroupFilter(group);
                              setAccountSearch("");
                              const ids = group === "All" ? MOCK_ACCOUNTS.map(a => a.id) : MOCK_ACCOUNTS.filter(a => a.group === group).map(a => a.id);
                              setSelectedAccounts(new Set(ids));
                            }}
                            className={`flex items-center gap-2 px-2 py-1 rounded-[6px] text-left transition-colors ${isActive ? 'bg-[#F7F5FD]' : 'hover:bg-[#F5F6F8]'}`}
                          >
                            <span className={`flex-1 text-[14px] leading-5 tracking-[-0.15px] ${isActive ? 'text-[#533AFD]' : 'text-[#353A44]'}`}>{group}</span>
                            <span className={`text-[12px] leading-4 min-w-[16px] px-1 text-center ${isActive ? 'text-[#533AFD]' : 'text-[#596171]'}`}>{groupCounts[group]}</span>
                          </button>
                        );
                      })}
                    </div>
                    {/* Overflow shadow */}
                    <div className="absolute bottom-0 left-0 right-0 h-12 pointer-events-none transition-opacity duration-200" style={{ background: 'radial-gradient(ellipse 100% 100% at 50% 100%, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0) 70%)' }} />
                  </div>
                  {/* Account list */}
                  <div className="flex-1 min-w-0 flex flex-col pt-4 px-4 overflow-hidden">
                    {/* Search */}
                    <div className="pb-2 px-2 flex-shrink-0">
                      <div className="flex items-center gap-2 px-2 py-1 border border-[#D8DEE4] rounded-[6px] form-focus-ring">
                        <Search size={14} className="text-[#6C7688] flex-shrink-0" />
                        <input
                          ref={accountSearchRef}
                          type="text"
                          value={accountSearch}
                          onChange={(e) => setAccountSearch(e.target.value)}
                          placeholder="Search"
                          className="flex-1 text-[14px] text-[#353A44] leading-5 tracking-[-0.15px] placeholder:text-[#818DA0] bg-transparent border-none outline-none"
                        />
                      </div>
                    </div>
                    {/* Account rows */}
                    <div className="flex-1 min-h-0 relative">
                      <div
                        className="h-full overflow-y-auto rounded-[6px]"
                        ref={(el) => {
                          if (!el) return;
                          const update = () => {
                            const shadow = el.nextElementSibling as HTMLElement | null;
                            if (shadow) {
                              const canScroll = el.scrollHeight > el.clientHeight;
                              const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 2;
                              shadow.style.opacity = canScroll && !atBottom ? '1' : '0';
                            }
                          };
                          el.addEventListener('scroll', update);
                          requestAnimationFrame(update);
                        }}
                      >
                        {/* Select all row */}
                        <button onClick={toggleAllVisible} className="w-full flex items-center gap-1 p-2 rounded-[4px] hover:bg-[#F5F6F8] transition-colors">
                          <div className={`w-[14px] h-[14px] rounded-[4px] border flex-shrink-0 flex items-center justify-center transition-colors ${
                            allVisibleSelected ? 'bg-[#675DFF] border-[#675DFF] shadow-[0_1px_1px_rgba(10,33,86,0.16)]'
                              : someVisibleSelected ? 'bg-[#675DFF] border-[#675DFF] shadow-[0_1px_1px_rgba(10,33,86,0.16)]'
                              : 'border-[#D8DEE4] bg-white shadow-[0_1px_1px_rgba(33,37,44,0.16)]'
                          }`}>
                            {allVisibleSelected && <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M8.5 2.5L3.75 7.5L1.5 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                            {someVisibleSelected && !allVisibleSelected && <svg width="8" height="2" viewBox="0 0 8 2" fill="none"><rect width="8" height="2" rx="1" fill="white"/></svg>}
                          </div>
                          <span className="px-2 text-[12px] text-[#353A44] leading-4">{visibleSelectedCount} selected</span>
                        </button>
                        {/* Individual accounts */}
                        {filteredAccounts.map(account => {
                          const isChecked = selectedAccounts.has(account.id);
                          return (
                            <button
                              key={account.id}
                              onClick={() => toggleAccount(account.id)}
                              className="w-full flex items-center gap-1 p-2 rounded-[4px] hover:bg-[#F5F6F8] transition-colors"
                            >
                              <div className={`w-[14px] h-[14px] rounded-[4px] border flex-shrink-0 flex items-center justify-center transition-colors ${isChecked ? 'bg-[#675DFF] border-[#675DFF] shadow-[0_1px_1px_rgba(10,33,86,0.16)]' : 'border-[#D8DEE4] bg-white shadow-[0_1px_1px_rgba(33,37,44,0.16)]'}`}>
                                {isChecked && <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M8.5 2.5L3.75 7.5L1.5 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                              </div>
                              <div className="flex items-center gap-1.5 px-2">
                                <div className="w-5 h-5 rounded-[4px] bg-[#088EF9] flex items-center justify-center flex-shrink-0">
                                  <span className="text-[9px] font-bold text-white leading-none">A</span>
                                </div>
                                <span className="text-[14px] text-[#353A44] leading-5 tracking-[-0.15px]">{account.name}</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                      {/* Overflow shadow */}
                      <div className="absolute bottom-0 left-0 right-0 h-12 pointer-events-none transition-opacity duration-200" style={{ background: 'radial-gradient(ellipse 100% 100% at 50% 100%, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0) 70%)' }} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
          {step === 3 && (
            <div className={`flex flex-col gap-4 px-8 min-h-0 overflow-hidden ${showPermissions || isClosingWidth ? 'flex-1' : ''}`}>
              <div className="flex-shrink-0">
                <h2 className="text-[24px] font-bold text-[#21252C] leading-8 tracking-[0.3px] font-display" style={{ fontFeatureSettings: "'lnum', 'pnum'" }}>{stepLabels[step]}</h2>
              </div>
              <div className={`flex gap-6 min-h-0 overflow-hidden ${showPermissions || isClosingWidth ? 'flex-1' : ''}`}>
                <div className="flex-1 min-w-0 flex flex-col gap-2 min-h-0 pt-4" style={rolesMaxWidth != null ? { maxWidth: rolesMaxWidth } : undefined}>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <span className="flex-1 text-[16px] font-bold text-[#353A44] leading-6 tracking-[-0.31px]" style={{ fontFeatureSettings: "'lnum', 'pnum'" }}>Roles</span>
                    <SharedToggleSwitch checked={showPermissions} onChange={setShowPermissions} label="Show permissions" />
                  </div>
                  <div className="bg-[#F5F6F8] rounded-[4px] p-4 flex-shrink-0">
                    <p className="text-[13px] text-[#596171] leading-5 tracking-[-0.15px]" style={{ fontFeatureSettings: "'lnum', 'pnum'" }}>
                      To protect your account, users who are recently invited or have recently updated roles may be prevented from performing certain sensitive operations for two to three days.
                    </p>
                  </div>
                  <div className="min-h-0 overflow-y-auto">
                    <div ref={step3ContentRef} className="flex flex-col">
                      {roleCategories.map((cat) => {
                        const isCatExpanded = expandedCategories.has(cat.name);
                        const selectedCount = cat.roles.filter(r => selectedRoles.has(r.id)).length;
                        const displayName = categoryDisplayNames[cat.name] || cat.name;
                        return (
                          <div key={cat.name}>
                            <button onClick={() => toggleCategory(cat.name)} className="w-full flex items-center gap-2 px-2 py-3 border-b border-[#EBEEF1] text-left">
                              <span className="text-[14px] font-semibold text-[#353A44] leading-5 tracking-[-0.15px]">{displayName}</span>
                              <div className="flex-1 flex items-center">
                                <span className="bg-[#F5F6F8] rounded-full min-w-[16px] px-1 text-[10px] font-semibold text-[#596171] leading-4 text-center">{selectedCount} of {cat.roles.length}</span>
                              </div>
                              <ChevronDown size={14} className={`text-[#474E5A] transition-transform duration-200 flex-shrink-0 ${isCatExpanded ? '' : '-rotate-90'}`} />
                            </button>
                            <div className="grid transition-[grid-template-rows] duration-200 ease-in-out" style={{ gridTemplateRows: isCatExpanded ? '1fr' : '0fr' }}>
                              <div className="overflow-hidden">
                                <div className="flex flex-col pb-2">
                                  {cat.roles.map((role, roleIdx) => {
                                    const isSelected = selectedRoles.has(role.id);
                                    return (
                                      <div key={role.id} onClick={() => toggleRole(role.id)} className={`relative flex items-start gap-2 py-3 pl-6 pr-2 cursor-pointer ${roleIdx > 0 ? 'border-t border-[#EBEEF1]' : ''} before:absolute before:inset-0 before:transition-colors hover:before:bg-[#F5F6F8]`}>
                                        <div
                                          className={`relative z-10 mt-[3px] w-[14px] h-[14px] rounded-[4px] border flex-shrink-0 flex items-center justify-center transition-colors ${isSelected ? 'bg-[#675DFF] border-[#675DFF] shadow-[0_1px_1px_rgba(10,33,86,0.16)]' : 'border-[#D8DEE4] bg-white shadow-[0_1px_1px_rgba(33,37,44,0.16)]'}`}>
                                          {isSelected && <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M8.5 2.5L3.75 7.5L1.5 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                                        </div>
                                        <div className="relative z-10 flex-1 min-w-0">
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
                <div className={`flex flex-col overflow-hidden transition-[flex,opacity] duration-500 ${showPermissions ? 'flex-1 min-w-0 opacity-100' : 'flex-[0] w-0 opacity-0 pointer-events-none'}`} style={{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }}>
                  <SharedDrawerPermissionsPanel
                    roleIds={Array.from(selectedRoles)}
                    invertColors={true}
                    className="min-h-0 flex flex-col gap-4 p-4 bg-[#F5F6F8] rounded-[8px] overflow-hidden h-full"
                  />
                </div>
              </div>
            </div>
          )}
          {step === 4 && (
            <div className="flex-1 overflow-y-auto flex flex-col gap-4 px-8 pb-0">
              <div className="flex flex-col">
                <h2 className="text-[24px] font-bold text-[#21252C] leading-8 tracking-[0.3px] font-display" style={{ fontFeatureSettings: "'lnum', 'pnum'" }}>{stepLabels[step]}</h2>
              </div>
              <div className="flex flex-col gap-1 rounded-[4px] overflow-hidden">
                <div className="flex items-start gap-8 bg-[#F5F6F8] p-4">
                  <div className="flex-1 min-w-0 flex flex-col gap-1">
                    <p className="text-[14px] text-[#353A44] leading-5 tracking-[-0.15px]">Members</p>
                    <p ref={emailReviewRef} className="text-[14px] font-semibold text-[#353A44] leading-5 tracking-[-0.15px]" style={{ fontFeatureSettings: "'lnum', 'pnum'" }}>
                      {emailDisplayText}
                    </p>
                  </div>
                  <button onClick={() => setStep(1)} className="w-7 h-7 flex items-center justify-center flex-shrink-0 rounded-md hover:bg-[#EBEEF1] transition-colors">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M0.975001 7.87468C0.991113 7.63299 1.0944 7.40537 1.26568 7.23409L7.43933 1.06043C8.02512 0.474647 8.97487 0.474647 9.56065 1.06043L10.9393 2.43911C11.5251 3.0249 11.5251 3.97465 10.9393 4.56043L4.76568 10.7341C4.5944 10.9054 4.36678 11.0087 4.12509 11.0248L1.03508 11.2308C0.884155 11.2408 0.758938 11.1156 0.769 10.9647L0.975001 7.87468ZM2.3607 9.63906L2.45918 8.16191L6.53031 4.09078L7.90899 5.46946L3.83786 9.54059L2.3607 9.63906ZM8.96965 4.4088L9.87867 3.49977L8.49999 2.12109L7.59097 3.03012L8.96965 4.4088Z" fill="#596171"/></svg>
                  </button>
                </div>
                <div className="flex items-center gap-8 bg-[#F5F6F8] p-4">
                  <div className="flex-1 min-w-0 flex flex-col gap-1">
                    <p className="text-[14px] text-[#353A44] leading-5 tracking-[-0.15px]">Access</p>
                    <p className="text-[14px] font-semibold text-[#353A44] leading-5 tracking-[-0.15px]" style={{ fontFeatureSettings: "'lnum', 'pnum'" }}>{selectedAccount === "all" ? "Acme, Inc." : (() => {
                      const names = MOCK_ACCOUNTS.filter(a => selectedAccounts.has(a.id)).map(a => a.name);
                      if (names.length === 0) return "No accounts selected";
                      if (names.length <= 3) return names.join(", ");
                      return `${names.slice(0, 3).join(", ")} + ${names.length - 3} more`;
                    })()}</p>
                  </div>
                  <button onClick={() => { setStep(2); if (selectedAccount === "selected") setShowAccountPicker(true); }} className="w-7 h-7 flex items-center justify-center flex-shrink-0 rounded-md hover:bg-[#EBEEF1] transition-colors">
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
        <div className="flex items-center justify-end gap-[10px] py-6 px-8 flex-shrink-0">
          {(step > 1 || showAccountPicker) && (
            <button onClick={() => {
              if (step === 2 && showAccountPicker) { setShowAccountPicker(false); }
              else if (step === 3 && selectedAccount === "selected") { setStep(2); setShowAccountPicker(true); }
              else { setStep(step - 1); }
            }} className="px-4 py-2 text-[14px] font-semibold text-[#353A44] leading-5 tracking-[-0.15px] bg-white border border-[#D8DEE4] rounded-[6px] hover:bg-[#F5F6F8] transition-colors shadow-[0_1px_1px_rgba(33,37,44,0.16)]">Back</button>
          )}
          {step < 4
            ? <button onClick={() => {
                if (step === 2 && !showAccountPicker && selectedAccount === "selected") { setShowAccountPicker(true); }
                else { setStep(step + 1); if (step === 2) setShowAccountPicker(false); }
              }} className="px-4 py-2 text-[14px] font-semibold text-white leading-5 tracking-[-0.15px] bg-[#635BFF] rounded-[6px] hover:bg-[#5851DF] transition-colors shadow-[0_1px_1px_rgba(47,14,99,0.32)]">Next</button>
            : <button onClick={handleClose} className="px-4 py-2 text-[14px] font-semibold text-white leading-5 tracking-[-0.15px] bg-[#635BFF] rounded-[6px] hover:bg-[#5851DF] transition-colors shadow-[0_1px_1px_rgba(47,14,99,0.32)]">Send invites</button>
          }
        </div>
      </div>
    </div>
  );
}

// ===== Team Content (Team tab) =====
const DATA_ROWS = 10;

function TeamContent({ teamSecurityEnabled, onAddMember }: { teamSecurityEnabled: boolean; onAddMember: () => void }) {
  return (
    <div className="flex-1 min-h-0 flex flex-col gap-8 overflow-auto max-w-[1400px] mx-auto w-full">
      {/* Filter cards */}
      <div className="flex gap-2 shrink-0">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex-1 h-[60px] bg-[#F5F6F8] rounded-[6px]" />
        ))}
      </div>

      {/* Toolbar + Table */}
      <div className="flex flex-col gap-3 flex-1 min-h-0">
        <div className="flex flex-wrap items-center gap-2 min-h-[28px] shrink-0">
          <div className="flex-1 flex items-center gap-2">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="w-[96px] h-[24px] bg-[#F5F6F8] rounded-full" />
            ))}
          </div>
          <div className="w-[96px] h-[28px] bg-[#F5F6F8] rounded-[6px]" />
          <button
            onClick={onAddMember}
            disabled={!teamSecurityEnabled}
            className={`flex items-center gap-1.5 h-[28px] px-3 text-[12px] font-semibold leading-4 tracking-[-0.02px] rounded-[6px] transition-colors ${
              teamSecurityEnabled
                ? 'text-white bg-[#635BFF] hover:bg-[#5851DF] shadow-[0_1px_1px_rgba(47,14,99,0.32)] cursor-pointer'
                : 'text-white bg-[#A3ACB9] cursor-not-allowed'
            }`}
          >
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M8 0.25C8.48325 0.25 8.875 0.641751 8.875 1.125V7.125H14.875C15.3582 7.125 15.75 7.51675 15.75 8C15.75 8.48325 15.3582 8.875 14.875 8.875H8.875V14.875C8.875 15.3582 8.48325 15.75 8 15.75C7.51675 15.75 7.125 15.3582 7.125 14.875V8.875H1.125C0.641751 8.875 0.25 8.48325 0.25 8C0.25 7.51675 0.641751 7.125 1.125 7.125H7.125V1.125C7.125 0.641751 7.51675 0.25 8 0.25Z" fill="currentColor"/></svg>
            Add member
          </button>
        </div>

        <div className="flex border-t border-[#D8DEE4] overflow-x-auto flex-1 min-h-0">
          {[0, 1, 2, 3, 4, 5, 6].map((col) => (
            <div key={col} className="flex-1 flex flex-col min-w-0">
              <div className="flex items-center h-[36px] px-3 border-b border-[#EBEEF1]">
                <div className="flex-1 py-1.5"><div className="h-2 bg-[#EBEEF1] rounded-lg w-full" /></div>
              </div>
              {Array.from({ length: DATA_ROWS }, (_, row) => (
                <div key={row} className="flex items-center h-[36px] px-3 border-b border-[#EBEEF1]">
                  <div className="flex-1 py-1.5"><div className="h-2 bg-[#EBEEF1] rounded-lg w-full" /></div>
                </div>
              ))}
            </div>
          ))}
          <div className="flex flex-col shrink-0">
            <div className="h-[36px]" />
            {Array.from({ length: DATA_ROWS }, (_, row) => (
              <div key={row} className="flex items-center justify-center w-[36px] h-[36px] border-b border-[#EBEEF1]">
                <MoreHorizontal size={16} className="text-[#6C7688]" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== Main Page: Team and Security with Tabs =====
function TeamAndSecurityPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tabParam = searchParams.get("tab");
  const activeTab: "team" | "roles" = tabParam === "team" ? "team" : "roles";
  const setActiveTab = useCallback((tab: "team" | "roles") => {
    router.replace(`?tab=${tab}`, { scroll: false });
  }, [router]);
  const [teamSecurityEnabled, setTeamSecurityEnabled] = useState(true);
  const [use14px, setUse14px] = useState(false);
  const [layoutVersion, setLayoutVersion] = useState<"v1" | "v2" | "v3">("v1");
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Sandbox mode state - lifted to page level for full-screen takeover
  const [sandboxMode, setSandboxMode] = useState<SandboxModeState>({
    active: false,
    role: null,
    unsavedRole: null,
    sourceModal: undefined,
    modalState: undefined
  });

  // Sandbox full-screen takeover
  if (sandboxMode.active && sandboxMode.role) {
    return (
      <SandboxView
        role={sandboxMode.role}
        allRoles={allRoles}
        unsavedRole={sandboxMode.unsavedRole}
        onRoleChange={(role) => setSandboxMode({ ...sandboxMode, role })}
        onExit={() => {
          const sourceModal = sandboxMode.sourceModal;
          const modalState = sandboxMode.modalState;
          setSandboxMode({ 
            active: false, role: null, unsavedRole: null,
            sourceModal, modalState
          });
        }}
      />
    );
  }

  return (
    <div className={`h-screen flex bg-white ${use14px ? 'use-14px' : ''}`}>
      <SideNav protoControls={{ teamSecurityEnabled, onTeamSecurityToggle: setTeamSecurityEnabled, use14px, onUse14pxToggle: setUse14px, layoutVersion, onLayoutVersionChange: setLayoutVersion }} />

      <div className="flex-1 flex flex-col px-8 pb-6 overflow-hidden">
        <Topbar />

        <div className={`flex-1 min-h-0 flex flex-col gap-8 pt-5 ${activeTab === "roles" ? 'overflow-hidden' : 'overflow-auto'}`}>
          {/* Header: breadcrumb + title + tabs */}
          <div className="flex flex-col gap-4 shrink-0 max-w-[1400px] mx-auto w-full">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-[12px] font-semibold text-[#533AFD] leading-4 tracking-[-0.02px]">Organization settings</span>
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none" className="text-[#6C7688]"><path d="M3 2L5 4L3 6" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <h1 className="text-[28px] font-bold text-[#353A44] leading-9 tracking-[0.38px] font-display" style={{ fontFeatureSettings: "'lnum', 'pnum'" }}>Team and security</h1>
            </div>

            {/* Tab bar */}
            <div className="flex items-start gap-6 border-b border-[#D8DEE4]">
              <button onClick={() => setActiveTab("team")} className={`flex items-center justify-center py-4 cursor-pointer ${activeTab === "team" ? 'border-b-2 border-[#533AFD]' : ''}`}>
                <span className={`text-[14px] font-semibold leading-5 tracking-[-0.15px] ${activeTab === "team" ? 'text-[#533AFD]' : 'text-[#596171] hover:text-[#353A44]'}`}>Team</span>
              </button>
              <button onClick={() => setActiveTab("roles")} className={`flex items-center justify-center py-4 cursor-pointer ${activeTab === "roles" ? 'border-b-2 border-[#533AFD]' : ''}`}>
                <span className={`text-[14px] font-semibold leading-5 tracking-[-0.15px] ${activeTab === "roles" ? 'text-[#533AFD]' : 'text-[#596171] hover:text-[#353A44]'}`}>Roles and permissions</span>
              </button>
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="flex flex-col items-start py-4 w-[61px]">
                  <div className="py-1.5 w-full"><div className="h-2 bg-[#EBEEF1] rounded-lg w-full" /></div>
                </div>
              ))}
            </div>
          </div>

          {/* Tab content */}
          {activeTab === "roles" ? (
            <RolesPermissionsContent sandboxMode={sandboxMode} setSandboxMode={setSandboxMode} layoutVersion={layoutVersion} />
          ) : (
            <TeamContent teamSecurityEnabled={teamSecurityEnabled} onAddMember={() => setIsModalOpen(true)} />
          )}
        </div>
      </div>

      <AddMemberModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

export default function TeamAndSecurityPage() {
  return (
    <Suspense>
      <TeamAndSecurityPageInner />
    </Suspense>
  );
}

function PermissionItem({
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
  customAccess?: string;  // For custom roles - the user-set access level
  insideGroup?: boolean;
  isInactive?: boolean;
}) {
  // For custom roles (or roles not in roleAccess), use the permission's actions field
  const access = permission.roleAccess[roleId];
  const isCustomRole = roleId.startsWith("custom_");
  
  // Determine access label based on role type
  let accessLabel: string;
  let hasWrite: boolean;
  
  if (isCustomRole && customAccess) {
    // Use custom role's permissionAccess
    const result = getAccessLabel(customAccess);
    accessLabel = result.label;
    hasWrite = result.hasWrite;
  } else if (isCustomRole || !access) {
    // Fallback: use permission's actions field for custom roles
    const result = getAccessLabel(permission.actions);
    accessLabel = result.label;
    hasWrite = result.hasWrite;
  } else {
    // Use role-specific access for standard roles
    accessLabel =
      access === "read"
        ? "Read"
        : access === "write"
        ? "Write"
        : access?.includes("read") && access?.includes("write")
        ? "Read/Write"
        : access;
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
