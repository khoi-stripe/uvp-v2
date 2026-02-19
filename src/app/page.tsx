"use client";

import React, { useState, useRef, useEffect, useLayoutEffect, useMemo, useCallback, Suspense } from "react";
import { Icon } from "@/icons/SailIcons";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, ChevronDown, MoreHorizontal, Search, X } from "lucide-react";
import {
  usePopover,
  type GroupByOption,
  SearchIcon,
  ControlIcon,
  CheckCircleFilledIcon,
  AccessSelector,
  Checkbox,
  Tooltip,
  ToggleSwitch,
  getAccessLabel,
  PermissionCardContent,
  PermissionCard,
  PermissionItem,
  BaseGroupCard,
  GroupCard,
  PermissionsFilterMenu,
  DrawerPermissionsPanel as SharedDrawerPermissionsPanel,
  useToast,
} from "@/components/shared";

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


function RevertIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5.99372 2.38044C6.33543 2.03873 6.33543 1.48471 5.99372 1.143C5.65201 0.801292 5.09799 0.801292 4.75628 1.143L0.506282 5.393C0.342052 5.55723 0.249853 5.76872 0.25 6.00098C0.250147 6.23323 0.342627 6.4672 0.507065 6.63122L4.75706 10.8705C5.09921 11.2118 5.65322 11.2111 5.9945 10.8689C6.33578 10.5268 6.33508 9.97275 5.99294 9.63148L3.23803 6.87598H10.625C12.4922 6.87598 14 8.27181 14 10.001C14 11.7977 12.4218 13.376 10.625 13.376C10.1418 13.376 9.75 13.7677 9.75 14.251C9.75 14.7342 10.1418 15.126 10.625 15.126C13.3882 15.126 15.75 12.7642 15.75 10.001C15.75 7.17189 13.3208 5.12851 10.63 5.12598H3.24063L5.99372 2.38044Z" fill="currentColor"/>
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



// Unified Permission Card component for both main view and customize modal
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

function riskSummaryText(assessment: RiskAssessment): string {
  const parts: string[] = [];
  const high = assessment.factors.filter(f => f.level === "High").length;
  const medium = assessment.factors.filter(f => f.level === "Medium").length;
  if (high > 0) parts.push(`${high} high-risk factor${high > 1 ? 's' : ''}`);
  if (medium > 0) parts.push(`${medium} elevated factor${medium > 1 ? 's' : ''}`);
  if (parts.length === 0 && assessment.factors.length > 0) parts.push(`${assessment.factors.length} factor${assessment.factors.length > 1 ? 's' : ''} analyzed`);
  const riskLabel = assessment.overallRisk === "High" ? "High" : assessment.overallRisk === "Medium" ? "Moderate" : "Low";
  return parts.length > 0
    ? `${riskLabel} security risk with ${parts.join(' and ')}.`
    : `${riskLabel} security risk.`;
}

function RiskAssessmentCard({ 
  assessment, 
  showAdvice = false,
  isExpanded = true,
  onToggle,
  onGreyBg = false,
}: { 
  assessment: RiskAssessment; 
  showAdvice?: boolean;
  isExpanded?: boolean;
  onToggle?: () => void;
  onGreyBg?: boolean;
}) {
  const summary = riskSummaryText(assessment);

  return (
    <div>
      {/* Header with overall risk */}
      <div className="flex items-center gap-2">
        <span className="text-[13px] font-semibold text-[#353A44] leading-[19px] tracking-[-0.15px]">Risk Assessment</span>
        <span className={`w-2 h-2 rounded-full ${
          assessment.overallRisk === "High" ? "bg-[#DF1B41]" :
          assessment.overallRisk === "Medium" ? "bg-[#D97706]" :
          "bg-[#1D7C4D]"
        }`} />
      </div>

      {/* Summary line + View more (when collapsed) */}
      {!isExpanded && (
        <p className="text-[13px] text-[#596171] leading-[19px] tracking-[-0.15px] mt-1">
          {summary}{' '}
          <button onClick={onToggle} className="text-[#635BFF] hover:text-[#5851DF] font-medium transition-colors">Show more</button>
        </p>
      )}

      {/* Collapsible content */}
      <div 
        className="grid transition-[grid-template-rows] duration-200"
        style={{ gridTemplateRows: isExpanded ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          <div className="pt-2 space-y-4">
            {/* Risk Factors Table */}
            {assessment.factors.length > 0 && (
              <table className="w-full text-[13px] mb-0">
                <tbody className={`divide-y ${onGreyBg ? 'divide-[#D8DEE4]' : 'divide-[#EBEEF1]'}`}>
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

            {/* View less link */}
            <button onClick={onToggle} className="text-[13px] text-[#635BFF] hover:text-[#5851DF] font-medium leading-[19px] tracking-[-0.15px] transition-colors">Show less</button>
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
  sourceModal?: "customize" | "create" | "menu" | "addMember";
  modalState?: {
    roleName: string;
    customDescription: string;
    permissionAccess: Record<string, string>;
    selectedBaseRole?: Role | null;
  };
};

// Tooltip component
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
        className="p-1 rounded-md hover:bg-[#F5F6F8] transition-colors"
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
                src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/waves.svg`}
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
  invertColors = false,
  useDividers = false,
  noDividers = false,
  lightDividers = false,
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
  invertColors?: boolean;
  useDividers?: boolean;
  noDividers?: boolean;
  lightDividers?: boolean;
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
      invertColors={invertColors}
      useDividers={useDividers}
      noDividers={noDividers}
      lightDividers={lightDividers}
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
            className={`relative flex items-start gap-4 px-2 py-3 transition-all duration-150 before:absolute before:inset-0 before:rounded-[8px] before:transition-colors ${
              isRequired ? 'cursor-default' : 'hover:before:bg-[#F5F6F8] cursor-pointer'
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
                onChange={(access: string) => onAccessChange(permission.apiName, access)}
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
  layoutVersion = "v1",
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
  layoutVersion?: "v1" | "v2" | "v3" | "v4" | "v5";
}) {
  const REQUIRED_PERMISSION = "dashboard_baseline";
  const isV2 = layoutVersion === "v2";
  const isV3 = layoutVersion === "v3";
  const isV4 = layoutVersion === "v4";
  const isV5 = layoutVersion === "v5";
  const useCompactLayout = isV3 || isV4 || isV5;
  const useDividerStyle = isV3 || isV4;
  const useLightDividers = !isV2;

  return (
    <div
      className={`${isAssistantOpen ? 'flex-1' : 'flex-[2]'} ${isV2 ? 'bg-[#F5F6F8] rounded-lg pt-6 px-4 pb-4' : 'bg-white rounded-lg p-4'} flex flex-col gap-4 overflow-hidden min-w-0`}
      style={{ transition: 'flex 400ms cubic-bezier(0.4, 0, 0.2, 1)' }}
    >
      {/* Permissions header */}
      <div className="flex items-center gap-4">
        <span className="text-[16px] font-bold text-[#353A44] leading-6 tracking-[-0.31px]" style={{ fontFeatureSettings: "'lnum', 'pnum'" }}>
          Permissions
        </span>
        {/* AI Assistant toggle button - invisible (not removed) when assistant is open to prevent layout shift */}
        <button
          onClick={onOpenAssistant}
          className={`flex items-center gap-1.5 text-[13px] font-semibold text-[#635BFF] leading-5 tracking-[-0.15px] transition-opacity duration-200 hover:opacity-70 ${
            isAssistantOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          <SparkleIcon />
          <span className="font-normal">Assistant</span>
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
        <div className="search-field flex-1 flex items-center gap-2 border border-[#D8DEE4] rounded-md px-2 py-1 min-h-[28px] bg-white form-focus-ring">
          <SearchIcon className="text-[#474E5A]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search"
            className="flex-1 text-[13px] text-[#353A44] leading-[19px] tracking-[-0.15px] bg-transparent outline-none placeholder:text-[#353A44] focus:placeholder:text-[#818DA0]"
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
        <div className={`flex-1 min-h-0 overflow-y-auto flex flex-col ${useCompactLayout ? "gap-0" : isGrouped ? "gap-1" : "gap-2"}`}>
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
                invertColors={isV2}
                useDividers={useDividerStyle}
                noDividers={isV5}
                lightDividers={useLightDividers}
              />
            ))
          ) : (
            /* Ungrouped view: flat list with optional section headers */
            sortedGroupEntries.map(([group, perms]) => (
              <div key={group || "all"} className={useCompactLayout ? "flex flex-col" : (isAlphabetical ? "" : "mb-3")}>
                {!isAlphabetical && group && (
                  <div className={`flex items-center gap-2 ${useDividerStyle ? `relative p-3 after:content-[''] after:absolute after:bottom-0 after:left-3 after:right-3 after:h-px ${useLightDividers ? 'after:bg-[#EBEEF1]' : 'after:bg-[#D8DEE4]'}` : (isV5 ? 'p-4' : 'mb-2')}`}>
                    <Checkbox
                      checked={getGroupCheckState(perms) === "all"}
                      indeterminate={getGroupCheckState(perms) === "some"}
                      onChange={() => toggleGroup(perms)}
                    />
                    <span className="text-[13px] font-semibold text-[#353A44] leading-[19px] tracking-[-0.15px]">
                      {group}
                    </span>
                    <span className={`inline-flex items-center justify-center min-w-[16px] h-[16px] px-1 ${isV2 ? 'bg-[#F5F6F8]' : 'bg-white'} text-[10px] font-semibold text-[#596171] leading-4 rounded-full text-center`}>
                      {perms.filter(p => p.apiName in permissionAccess).length} of {perms.length}
                    </span>
                  </div>
                )}
                <div className={useDividerStyle ? `flex flex-col pl-3 [&>*:not(:last-child)]:relative [&>*:not(:last-child)]:after:content-[''] [&>*:not(:last-child)]:after:absolute [&>*:not(:last-child)]:after:bottom-0 [&>*:not(:last-child)]:after:left-3 [&>*:not(:last-child)]:after:right-3 [&>*:not(:last-child)]:after:h-px ${useLightDividers ? '[&>*:not(:last-child)]:after:bg-[#EBEEF1]' : '[&>*:not(:last-child)]:after:bg-[#D8DEE4]'}` : (isV5 ? 'flex flex-col pl-4' : '')}>
                  {sortPermsInGroup(perms).map(perm => {
                    const isChecked = perm.apiName in permissionAccess;
                    return (
                      <div key={perm.apiName} className={useCompactLayout ? '' : 'mb-2'}>
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
                          invertColors={isV2}
                          useDividers={useDividerStyle}
                          noDividers={isV5}
                          lightDividers={useLightDividers}
                        />
                      </div>
                    );
                  })}
                </div>
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
  layoutVersion = "v1",
  mergedCanCannot = false,
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
  layoutVersion?: "v1" | "v2" | "v3" | "v4" | "v5";
  mergedCanCannot?: boolean;
}) {
  const isEditMode = mode === "edit";
  const isV2 = layoutVersion === "v2";
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
  const [modalTab, setModalTab] = useState<"role" | "permissions">("permissions");
  const modalContentRef = useRef<HTMLDivElement>(null);
  const [modalNarrow, setModalNarrow] = useState(false);
  useEffect(() => {
    const el = modalContentRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setModalNarrow(entry.contentRect.width < 1200);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [isOpen]);

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
        className="relative bg-white rounded-[12px] shadow-[0px_15px_35px_0px_rgba(48,49,61,0.08),0px_5px_15px_0px_rgba(0,0,0,0.12)] flex flex-col overflow-hidden w-full h-full max-w-[1280px]" 
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
          {/* Title */}
          <div className="flex items-center gap-4">
            <h2 className="text-[24px] font-bold text-[#21252C] leading-8 tracking-[0.3px] font-display" style={{ fontFeatureSettings: "'lnum', 'pnum'" }}>
              {isEditMode ? "Edit role" : "Duplicate and customize role"}
            </h2>
          </div>

          {/* Main content area */}
          <div ref={modalContentRef} className="flex-1 flex min-h-0 overflow-hidden">
            {/* Content container - side-by-side or tabbed depending on assistant + width */}
            <div className={`${isV2 ? '' : 'bg-[#F5F6F8] rounded-[12px] p-2 overflow-hidden'} flex ${isAssistantOpen && modalNarrow ? 'flex-col' : 'gap-4'} flex-1 min-w-0`}>

              {/* Tab bar (only when assistant is open and modal is narrow) */}
              {isAssistantOpen && modalNarrow && (
                <div className={`flex gap-6 ${isV2 ? 'px-6' : 'px-4'} border-b border-[#D8DEE4] shrink-0`}>
                  <button onClick={() => setModalTab("role")} className={`flex items-center justify-center py-3 ${modalTab === "role" ? 'border-b-2 border-[#533AFD]' : ''}`}>
                    <span className={`text-[14px] font-semibold leading-5 tracking-[-0.15px] ${modalTab === "role" ? 'text-[#533AFD]' : 'text-[#596171] hover:text-[#353A44]'}`}>Role info</span>
                  </button>
                  <button onClick={() => setModalTab("permissions")} className={`flex items-center justify-center py-3 ${modalTab === "permissions" ? 'border-b-2 border-[#533AFD]' : ''}`}>
                    <span className={`text-[14px] font-semibold leading-5 tracking-[-0.15px] ${modalTab === "permissions" ? 'text-[#533AFD]' : 'text-[#596171] hover:text-[#353A44]'}`}>Permissions</span>
                  </button>
                </div>
              )}

              {/* Role info column */}
              {(!(isAssistantOpen && modalNarrow) || modalTab === "role") && (
              <div className={`flex-1 flex flex-col gap-4 ${isV2 ? 'pt-5 pl-6 pr-2' : 'px-4 py-4'} overflow-y-auto min-w-0`}>
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
                        className="flex-1 text-[20px] font-bold text-[#353A44] leading-7 tracking-[0.3px] bg-white border border-[#D8DEE4] rounded-[6px] px-2 py-1 outline-none font-display min-w-0 input-focus-ring"
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
                      className="text-[13px] text-[#353A44] leading-[19px] tracking-[-0.15px] bg-white border border-[#D8DEE4] rounded-[6px] px-2 py-1 outline-none resize-y input-focus-ring"
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
                <div className={`${isV2 ? 'bg-[#F5F6F8] rounded-lg p-4' : ''} flex flex-col gap-4`}>
                  <div className="h-px bg-[#D8DEE4]" />

                  {/* Note */}
                  <p className="text-[13px] text-[#596171] leading-[19px]">
                    Capabilities listed are highlights. View permissions for the full list by role.
                  </p>

                  {mergedCanCannot ? (
                    <ul className="flex flex-col gap-1.5">
                      {previewDetails.canDo.slice(0, 5).map((item, i) => (
                        <li key={`can-${i}`} className="flex items-start gap-2 text-[13px] text-[#353A44] leading-[19px] tracking-[-0.15px]">
                          <svg width="10" height="10" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 mt-[4px]">
                            <path fillRule="evenodd" clipRule="evenodd" d="M15.4695 2.23296C15.8241 2.56129 15.8454 3.1149 15.5171 3.46949L6.14206 13.5945C5.97228 13.7778 5.73221 13.8799 5.48237 13.8748C5.23253 13.8698 4.99677 13.7582 4.83452 13.5681L0.459523 8.44311C0.145767 8.07557 0.18937 7.52327 0.556912 7.20951C0.924454 6.89575 1.47676 6.93936 1.79051 7.3069L5.52658 11.6834L14.233 2.28052C14.5613 1.92593 15.1149 1.90464 15.4695 2.23296Z" fill="#2B8700"/>
                          </svg>
                          {item}
                        </li>
                      ))}
                      {previewDetails.cannotDo.slice(0, 5).map((item, i) => (
                        <li key={`cannot-${i}`} className="flex items-start gap-2 text-[13px] text-[#353A44] leading-[19px] tracking-[-0.15px]">
                          <svg width="10" height="10" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 mt-[4px]">
                            <path fillRule="evenodd" clipRule="evenodd" d="M1.25628 1.25628C1.59799 0.914573 2.15201 0.914573 2.49372 1.25628L8 6.76256L13.5063 1.25628C13.848 0.914573 14.402 0.914573 14.7437 1.25628C15.0854 1.59799 15.0854 2.15201 14.7437 2.49372L9.23744 8L14.7437 13.5063C15.0854 13.848 15.0854 14.402 14.7437 14.7437C14.402 15.0854 13.848 15.0854 13.5063 14.7437L8 9.23744L2.49372 14.7437C2.15201 15.0854 1.59799 15.0854 1.25628 14.7437C0.914573 14.402 0.914573 13.848 1.25628 13.5063L6.76256 8L1.25628 2.49372C0.914573 2.15201 0.914573 1.59799 1.25628 1.25628Z" fill="#C0123C"/>
                          </svg>
                          {item}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <>
                    {/* Can section */}
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
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

                    {/* Cannot section */}
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
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
                    </>
                  )}

                  <div className="h-px bg-[#D8DEE4]" />

                </div>

                {/* Risk Assessment - own container */}
                <div className={`${isV2 ? 'p-4 bg-[#F5F6F8] rounded-lg' : ''}`}>
                  <RiskAssessmentCard 
                    assessment={previewRiskAssessment} 
                    showAdvice 
                    isExpanded={isRiskExpandedModal}
                    onToggle={() => setIsRiskExpandedModal(!isRiskExpandedModal)}
                    onGreyBg
                  />
                </div>
              </div>
              )}

              {/* Permissions panel */}
              {(!(isAssistantOpen && modalNarrow) || modalTab === "permissions") && (
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
                layoutVersion={layoutVersion}
              />
              )}

              </div>
            
            {/* AI Assistant Drawer - outside the offset background */}
            <AIAssistantDrawer 
              isOpen={isAssistantOpen} 
              onClose={() => setIsAssistantOpen(false)} 
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-2 px-8 py-6">
          <button
            onClick={() => {
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
          <div className="flex-1" />
          <button
            onClick={handleRevert}
            className="px-3 py-1.5 text-[13px] font-medium text-[#353A44] leading-[19px] tracking-[-0.15px] border border-[#D8DEE4] rounded-md hover:bg-[#F5F6F8] transition-colors bg-white shadow-[0px_1px_1px_0px_rgba(33,37,44,0.16)]"
          >
            Revert changes
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
// Reusable Create Role content (used by CreateRoleModal and inline in AddMemberModal)
function CreateRoleContent({
  onSave,
  onCancel,
  initialGroupBy,
  onTestInSandbox,
  initialState,
  layoutVersion = "v1",
  showSandbox = true,
  mergedCanCannot = false,
}: {
  onSave: (role: Role) => void;
  onCancel: () => void;
  initialGroupBy: GroupByOption;
  onTestInSandbox?: (role: Role, modalState: { roleName: string; customDescription: string; permissionAccess: Record<string, string>; selectedBaseRole?: Role | null }) => void;
  initialState?: { roleName: string; customDescription: string; permissionAccess: Record<string, string>; selectedBaseRole?: Role | null };
  layoutVersion?: "v1" | "v2" | "v3" | "v4" | "v5";
  showSandbox?: boolean;
  mergedCanCannot?: boolean;
}) {
  const isV2 = layoutVersion === "v2";
  const allPermissions = getAllPermissions();
  const roleNameInputRef = useRef<HTMLInputElement>(null);
  
  const [selectedBaseRole, setSelectedBaseRole] = useState<Role | null>(initialState?.selectedBaseRole || null);
  const [roleName, setRoleName] = useState(initialState?.roleName || "");
  const [customDescription, setCustomDescription] = useState(initialState?.customDescription || "");
  const [permissionAccess, setPermissionAccess] = useState<Record<string, string>>(initialState?.permissionAccess || { dashboard_baseline: "read" });
  const [pendingAccess, setPendingAccess] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [groupBy, setGroupBy] = useState<GroupByOption>("productCategory");
  const [isGrouped, setIsGrouped] = useState(true);
  const baseRolePopover = usePopover();
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isRiskExpanded, setIsRiskExpanded] = useState(false);
  const [createModalTab, setCreateModalTab] = useState<"role" | "permissions">("permissions");
  const createContentRef = useRef<HTMLDivElement>(null);
  const [createModalNarrow, setCreateModalNarrow] = useState(false);
  useEffect(() => {
    const el = createContentRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setCreateModalNarrow(entry.contentRect.width < 1200);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Snapshot of permission access used for stable sort order.
  // Unlike a ref, state triggers a re-render (and thus re-sort) when a new template is selected,
  // while individual permission toggles intentionally leave it unchanged to keep the list stable.
  const [sortSnapshot, setSortSnapshot] = useState<Record<string, string>>(
    initialState?.permissionAccess ? { ...initialState.permissionAccess } : { dashboard_baseline: "read" }
  );

  // Required permission constant
  const REQUIRED_PERMISSION = "dashboard_baseline";

  // Focus role name input on mount, after the modal open animation completes (~150ms)
  useEffect(() => {
    setTimeout(() => {
      roleNameInputRef.current?.focus();
    }, 200);
  }, []);

  // Handle group toggle with auto-switch logic
  const handleGroupToggle = (on: boolean) => {
    setIsGrouped(on);
    if (on && groupBy === "alphabetical") {
      setGroupBy("productCategory");
    }
  };

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
    setSortSnapshot({ ...accessMap });
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
    setSortSnapshot({ ...resetAccess });
    setPendingAccess({});
    setSearchQuery("");
    
    // Focus the role name input
    setTimeout(() => {
      roleNameInputRef.current?.focus();
    }, 50);
  };

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

  // Sort groups and permissions: active items first (based on sortSnapshot, which updates on template switch)
  const sortedGroupEntries = Object.entries(groupedAll).sort(([aGroup, aPerms], [bGroup, bPerms]) => {
    const aHasActive = aPerms.some(p => p.apiName in sortSnapshot) ? 0 : 1;
    const bHasActive = bPerms.some(p => p.apiName in sortSnapshot) ? 0 : 1;
    if (aHasActive !== bHasActive) return aHasActive - bHasActive;
    return aGroup.localeCompare(bGroup);
  });

  const sortPermsInGroup = (perms: Permission[]) => {
    return [...perms].sort((a, b) => {
      const aActive = a.apiName in sortSnapshot ? 0 : 1;
      const bActive = b.apiName in sortSnapshot ? 0 : 1;
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
  };

  // Generate preview details
  const previewDetails = generateRoleDetails(selectedPermissions);
  const previewRiskAssessment = generateRiskAssessment(selectedPermissions);

  return (
    <>
      {/* Content */}
      <div className="flex-1 flex flex-col gap-4 px-8 overflow-hidden">
        {/* Title with Reset button */}
        <div className="flex items-center gap-4">
          <h2 className="text-[24px] font-bold text-[#21252C] leading-8 tracking-[0.3px] font-display" style={{ fontFeatureSettings: "'lnum', 'pnum'" }}>
            Create or customize role
          </h2>
        </div>

        {/* Main content area */}
        <div ref={createContentRef} className="flex-1 flex min-h-0 overflow-hidden">
          {/* Offset background container - side-by-side or tabbed depending on assistant + width */}
          <div className={`bg-[#F5F6F8] rounded-[12px] p-2 flex ${isAssistantOpen && createModalNarrow ? 'flex-col' : 'gap-4'} flex-1 overflow-hidden min-w-0`}>

            {/* Tab bar (only when assistant is open and modal is narrow) */}
            {isAssistantOpen && createModalNarrow && (
              <div className="flex gap-6 px-4 border-b border-[#D8DEE4] shrink-0">
                <button onClick={() => setCreateModalTab("role")} className={`flex items-center justify-center py-3 ${createModalTab === "role" ? 'border-b-2 border-[#533AFD]' : ''}`}>
                  <span className={`text-[14px] font-semibold leading-5 tracking-[-0.15px] ${createModalTab === "role" ? 'text-[#533AFD]' : 'text-[#596171] hover:text-[#353A44]'}`}>Role info</span>
                </button>
                <button onClick={() => setCreateModalTab("permissions")} className={`flex items-center justify-center py-3 ${createModalTab === "permissions" ? 'border-b-2 border-[#533AFD]' : ''}`}>
                  <span className={`text-[14px] font-semibold leading-5 tracking-[-0.15px] ${createModalTab === "permissions" ? 'text-[#533AFD]' : 'text-[#596171] hover:text-[#353A44]'}`}>Permissions</span>
                </button>
              </div>
            )}

            {/* Left column - Role info (1/3 width) */}
            {(!(isAssistantOpen && createModalNarrow) || createModalTab === "role") && (
            <div className="flex-1 flex flex-col gap-6 px-4 py-[13px] overflow-y-auto min-w-0">
              {/* Start from existing role, Role name, Description */}
              <div className="flex flex-col gap-4">
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
                    <span className="text-[#353A44]">
                      {selectedBaseRole ? selectedBaseRole.name : "None"}
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
                        <button
                          onClick={() => {
                            setSelectedBaseRole(null);
                            const noneAccess = { [REQUIRED_PERMISSION]: "read" };
                            setPermissionAccess(noneAccess);
                            setSortSnapshot({ ...noneAccess });
                            baseRolePopover.close();
                          }}
                          className={`w-full flex items-center justify-between gap-3 px-2.5 py-1.5 text-[13px] leading-[19px] tracking-[-0.15px] text-[#353A44] rounded transition-colors ${
                            !selectedBaseRole ? "bg-[#F5F6F8]" : "hover:bg-[#F5F6F8]"
                          }`}
                        >
                          <span className={!selectedBaseRole ? "font-semibold" : ""}>None</span>
                          {!selectedBaseRole && <CheckCircleFilledIcon size={12} />}
                        </button>
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

              {/* Role name input */}
              <div className="flex flex-col gap-1">
                <label className="text-[13px] font-semibold text-[#353A44] leading-[19px] tracking-[-0.15px]">
                  Role name
                </label>
                <input
                  ref={roleNameInputRef}
                  type="text"
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                  placeholder="Payment support"
                  className="w-full px-2 py-1.5 text-[13px] text-[#353A44] leading-[19px] tracking-[-0.15px] border border-[#D8DEE4] rounded-md bg-white outline-none placeholder:text-[#818DA0] input-focus-ring"
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
                  className="w-full px-2 py-1.5 text-[13px] text-[#353A44] leading-[19px] tracking-[-0.15px] border border-[#D8DEE4] rounded-md bg-white outline-none resize-none placeholder:text-[#818DA0] input-focus-ring"
                />
              </div>
              </div>{/* end fields group */}

              {/* Combined Can / Cannot container */}
              <div className="flex flex-col gap-4">
                <div className="h-px bg-[#D8DEE4]" />

                {/* Note */}
                <p className="text-[13px] text-[#596171] leading-[19px]">
                  Capabilities listed are highlights. View permissions for the full list by role.
                </p>

                {mergedCanCannot ? (
                  <ul className="flex flex-col gap-1.5">
                    {previewDetails.canDo.slice(0, 5).map((item, i) => (
                      <li key={`can-${i}`} className="flex items-start gap-2 text-[13px] text-[#353A44] leading-[19px] tracking-[-0.15px]">
                        <svg width="10" height="10" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 mt-[4px]">
                          <path fillRule="evenodd" clipRule="evenodd" d="M15.4695 2.23296C15.8241 2.56129 15.8454 3.1149 15.5171 3.46949L6.14206 13.5945C5.97228 13.7778 5.73221 13.8799 5.48237 13.8748C5.23253 13.8698 4.99677 13.7582 4.83452 13.5681L0.459523 8.44311C0.145767 8.07557 0.18937 7.52327 0.556912 7.20951C0.924454 6.89575 1.47676 6.93936 1.79051 7.3069L5.52658 11.6834L14.233 2.28052C14.5613 1.92593 15.1149 1.90464 15.4695 2.23296Z" fill="#2B8700"/>
                        </svg>
                        {item}
                      </li>
                    ))}
                    {previewDetails.cannotDo.slice(0, 5).map((item, i) => (
                      <li key={`cannot-${i}`} className="flex items-start gap-2 text-[13px] text-[#353A44] leading-[19px] tracking-[-0.15px]">
                        <svg width="10" height="10" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 mt-[4px]">
                          <path fillRule="evenodd" clipRule="evenodd" d="M1.25628 1.25628C1.59799 0.914573 2.15201 0.914573 2.49372 1.25628L8 6.76256L13.5063 1.25628C13.848 0.914573 14.402 0.914573 14.7437 1.25628C15.0854 1.59799 15.0854 2.15201 14.7437 2.49372L9.23744 8L14.7437 13.5063C15.0854 13.848 15.0854 14.402 14.7437 14.7437C14.402 15.0854 13.848 15.0854 13.5063 14.7437L8 9.23744L2.49372 14.7437C2.15201 15.0854 1.59799 15.0854 1.25628 14.7437C0.914573 14.402 0.914573 13.848 1.25628 13.5063L6.76256 8L1.25628 2.49372C0.914573 2.15201 0.914573 1.59799 1.25628 1.25628Z" fill="#C0123C"/>
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <>
                  {/* Can section */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <CheckCircleIcon />
                      <span className="text-[13px] font-semibold text-[#353A44] leading-[19px] tracking-[-0.15px]">Can</span>
                    </div>
                    {previewDetails.canDo.length > 0 ? (
                      <ul className="list-disc pl-6 flex flex-col gap-1.5">
                        {previewDetails.canDo.slice(0, 5).map((item, i) => (
                          <li key={i} className="text-[13px] text-[#353A44] leading-[19px] tracking-[-0.15px]">{item}</li>
                        ))}
                        {previewDetails.canDo.length > 5 && (
                          <li className="text-[13px] text-[#596171] leading-[19px] tracking-[-0.15px]">+{previewDetails.canDo.length - 5} more</li>
                        )}
                      </ul>
                    ) : (
                      <div className="flex flex-col gap-2.5 py-1.5">
                        <div className="h-2 bg-[#EBEEF1] rounded-lg w-full" />
                        <div className="h-2 bg-[#EBEEF1] rounded-lg w-full" />
                      </div>
                    )}
                  </div>

                  {/* Cannot section */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <CancelCircleIcon />
                      <span className="text-[13px] font-semibold text-[#353A44] leading-[19px] tracking-[-0.15px]">Cannot</span>
                    </div>
                    {previewDetails.cannotDo.length > 0 ? (
                      <ul className="list-disc pl-6 flex flex-col gap-1.5">
                        {previewDetails.cannotDo.slice(0, 5).map((item, i) => (
                          <li key={i} className="text-[13px] text-[#353A44] leading-[19px] tracking-[-0.15px]">{item}</li>
                        ))}
                        {previewDetails.cannotDo.length > 5 && (
                          <li className="text-[13px] text-[#596171] leading-[19px] tracking-[-0.15px]">+{previewDetails.cannotDo.length - 5} more</li>
                        )}
                      </ul>
                    ) : (
                      <div className="flex flex-col gap-2.5 py-1.5">
                        <div className="h-2 bg-[#EBEEF1] rounded-lg w-full" />
                        <div className="h-2 bg-[#EBEEF1] rounded-lg w-full" />
                      </div>
                    )}
                  </div>
                  </>
                )}

                <div className="h-px bg-[#D8DEE4]" />
              </div>

              {/* Risk Assessment */}
              <RiskAssessmentCard
                assessment={previewRiskAssessment}
                showAdvice
                isExpanded={isRiskExpanded}
                onToggle={() => setIsRiskExpanded(!isRiskExpanded)}
                onGreyBg
              />
            </div>
            )}

            {/* Permissions panel */}
            {(!(isAssistantOpen && createModalNarrow) || createModalTab === "permissions") && (
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
              layoutVersion={layoutVersion}
            />
            )}

            </div>
          
          {/* AI Assistant Drawer - outside the offset background */}
          <AIAssistantDrawer 
            isOpen={isAssistantOpen} 
            onClose={() => setIsAssistantOpen(false)} 
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center gap-2 px-8 py-6">
        {(onTestInSandbox || !showSandbox) && (
          <button
            onClick={() => {
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
        )}
        <div className="flex-1" />
        {!showSandbox ? (
          <button
            onClick={onCancel}
            className="px-3 py-1.5 text-[13px] font-medium text-[#353A44] leading-[19px] tracking-[-0.15px] border border-[#D8DEE4] rounded-md hover:bg-[#F5F6F8] transition-colors bg-white shadow-[0px_1px_1px_0px_rgba(33,37,44,0.16)]"
          >
            Back
          </button>
        ) : (
          <button
            onClick={handleReset}
            className="px-3 py-1.5 text-[13px] font-medium text-[#353A44] leading-[19px] tracking-[-0.15px] border border-[#D8DEE4] rounded-md hover:bg-[#F5F6F8] transition-colors bg-white shadow-[0px_1px_1px_0px_rgba(33,37,44,0.16)]"
          >
            Revert changes
          </button>
        )}
        <button
          onClick={handleSave}
          className="px-4 py-1.5 bg-[#675DFF] text-white text-[13px] font-semibold leading-[19px] tracking-[-0.15px] rounded-md hover:bg-[#5851DB] transition-colors shadow-[0px_1px_1px_0px_rgba(47,14,99,0.32)]"
        >
          Save
        </button>
      </div>
    </>
  );
}

// Create Role Modal - thin wrapper around CreateRoleContent
function CreateRoleModal({
  isOpen,
  onClose,
  onSave,
  initialGroupBy,
  onTestInSandbox,
  initialState,
  layoutVersion = "v1",
  mergedCanCannot = false,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (role: Role) => void;
  initialGroupBy: GroupByOption;
  onTestInSandbox?: (role: Role, modalState: { roleName: string; customDescription: string; permissionAccess: Record<string, string>; selectedBaseRole?: Role | null }) => void;
  initialState?: { roleName: string; customDescription: string; permissionAccess: Record<string, string>; selectedBaseRole?: Role | null };
  layoutVersion?: "v1" | "v2" | "v3" | "v4" | "v5";
  mergedCanCannot?: boolean;
}) {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 150);
  };

  // Keyboard shortcuts
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-8">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-[rgba(182,192,205,0.7)] ${isClosing ? 'animate-fade-out' : 'animate-fade-in'}`}
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div 
        className="relative bg-white rounded-[12px] shadow-[0px_15px_35px_0px_rgba(48,49,61,0.08),0px_5px_15px_0px_rgba(0,0,0,0.12)] flex flex-col overflow-hidden w-full h-full max-w-[1280px]" 
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

        <CreateRoleContent
          onSave={(role) => { onSave(role); handleClose(); }}
          onCancel={handleClose}
          initialGroupBy={initialGroupBy}
          onTestInSandbox={onTestInSandbox}
          initialState={initialState}
          layoutVersion={layoutVersion}
          showSandbox={true}
          mergedCanCannot={mergedCanCannot}
        />
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

// ─── Real Sail dashboard chrome ──────────────────────────────────────────────

type ProtoControlsType = {
  teamSecurityEnabled: boolean; onTeamSecurityToggle: (v: boolean) => void;
  use14px: boolean; onUse14pxToggle: (v: boolean) => void;
  singleRoleSelect: boolean; onSingleRoleSelectToggle: (v: boolean) => void;
  compactTabMode: boolean; onCompactTabModeToggle: (v: boolean) => void;
  reduceCounts: boolean; onReduceCountsToggle: (v: boolean) => void;
  mergedCanCannot: boolean; onMergedCanCannotToggle: (v: boolean) => void;
  wireframe: boolean; onWireframeToggle: (v: boolean) => void;
  layoutVersion: "v1" | "v2" | "v3" | "v4" | "v5"; onLayoutVersionChange: (v: "v1" | "v2" | "v3" | "v4" | "v5") => void;
};

function ProtoControlsPopover({ protoControls }: { protoControls: ProtoControlsType }) {
  const popover = usePopover();
  return (
    <div className="relative">
      <button onClick={() => popover.toggle()} className="w-5 h-5 rounded-full bg-[#EBEEF1] hover:bg-[#D8DEE4] transition-colors cursor-pointer flex items-center justify-center" title="Prototype controls">
        <ControlIcon className="w-3 h-3 text-[#596171]" />
      </button>
      {popover.isVisible && (
        <PopoverBackdrop onClose={() => popover.close()}>
          <div className={`absolute bottom-full left-0 mb-2 bg-white border border-[#D8DEE4] rounded-[8px] shadow-[0_5px_15px_rgba(0,0,0,0.12),0_15px_35px_rgba(48,49,61,0.08)] z-20 whitespace-nowrap overflow-hidden ${popover.animationClass}`}>
            <div className="p-2 flex flex-col min-w-[260px]">
              <div className="px-2 py-1.5">
                <span className="text-[12px] font-semibold text-[#818DA0] leading-4 tracking-[-0.024px] uppercase">Prototype controls</span>
              </div>

              {/* General */}
              <div className="h-px bg-[#EBEEF1] my-1" />
              <div className="px-2 pt-1 pb-0.5">
                <span className="text-[11px] font-semibold text-[#B0B9C9] leading-4 uppercase tracking-[0.04em]">General</span>
              </div>
              {([
                { label: "Use 14px type", key: "use14px", toggle: "onUse14pxToggle" },
                { label: "Wireframe chrome", key: "wireframe", toggle: "onWireframeToggle" },
              ] as const).map(({ label, key, toggle }) => (
                <div key={key} className="flex items-center justify-between gap-6 px-2 py-1.5 cursor-pointer" onClick={() => (protoControls[toggle] as (v: boolean) => void)(!protoControls[key])}>
                  <span className="text-[13px] text-[#353A44] leading-[19px] tracking-[-0.15px]">{label}</span>
                  <div onClick={(e) => e.stopPropagation()}>
                    <ToggleSwitch checked={protoControls[key] as boolean} onChange={(protoControls[toggle] as (v: boolean) => void)} />
                  </div>
                </div>
              ))}

              {/* Add member flow */}
              <div className="h-px bg-[#EBEEF1] my-1" />
              <div className="px-2 pt-1 pb-0.5">
                <span className="text-[11px] font-semibold text-[#B0B9C9] leading-4 uppercase tracking-[0.04em]">Add member flow</span>
              </div>
              {([
                { label: "Enable add member", key: "teamSecurityEnabled", toggle: "onTeamSecurityToggle" },
                { label: "Single role select", key: "singleRoleSelect", toggle: "onSingleRoleSelectToggle" },
              ] as const).map(({ label, key, toggle }) => (
                <div key={key} className="flex items-center justify-between gap-6 px-2 py-1.5 cursor-pointer" onClick={() => (protoControls[toggle] as (v: boolean) => void)(!protoControls[key])}>
                  <span className="text-[13px] text-[#353A44] leading-[19px] tracking-[-0.15px]">{label}</span>
                  <div onClick={(e) => e.stopPropagation()}>
                    <ToggleSwitch checked={protoControls[key] as boolean} onChange={(protoControls[toggle] as (v: boolean) => void)} />
                  </div>
                </div>
              ))}

              {/* Roles & permissions */}
              <div className="h-px bg-[#EBEEF1] my-1" />
              <div className="px-2 pt-1 pb-0.5">
                <span className="text-[11px] font-semibold text-[#B0B9C9] leading-4 uppercase tracking-[0.04em]">Roles &amp; permissions</span>
              </div>
              {([
                { label: "Hide permissions by default", key: "compactTabMode", toggle: "onCompactTabModeToggle" },
                { label: "Reduce counts", key: "reduceCounts", toggle: "onReduceCountsToggle" },
                { label: "Simplified can/cannot", key: "mergedCanCannot", toggle: "onMergedCanCannotToggle" },
              ] as const).map(({ label, key, toggle }) => (
                <div key={key} className="flex items-center justify-between gap-6 px-2 py-1.5 cursor-pointer" onClick={() => (protoControls[toggle] as (v: boolean) => void)(!protoControls[key])}>
                  <span className="text-[13px] text-[#353A44] leading-[19px] tracking-[-0.15px]">{label}</span>
                  <div onClick={(e) => e.stopPropagation()}>
                    <ToggleSwitch checked={protoControls[key] as boolean} onChange={(protoControls[toggle] as (v: boolean) => void)} />
                  </div>
                </div>
              ))}

              <div className="h-px bg-[#EBEEF1] my-1" />
              <div className="flex items-center justify-between gap-6 px-2 py-1.5">
                <span className="text-[13px] text-[#353A44] leading-[19px] tracking-[-0.15px]">Layout</span>
                <div className="flex bg-[#F5F6F8] rounded-md p-0.5 gap-0.5">
                  {(["v1", "v2", "v3", "v4", "v5"] as const).map((v) => (
                    <button key={v} onClick={() => protoControls.onLayoutVersionChange(v)}
                      className={`px-2 py-0.5 text-[12px] font-semibold leading-4 rounded-[4px] transition-colors ${protoControls.layoutVersion === v ? "bg-white text-[#353A44] shadow-[0_1px_2px_rgba(0,0,0,0.1)]" : "text-[#596171] hover:text-[#353A44]"}`}>
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
  );
}

function RealHeader() {
  return (
    <header className="bg-white flex items-center h-[60px] flex-shrink-0">
      <div className="max-w-[1400px] mx-auto w-full flex items-center justify-between">
        {/* Search */}
        <div className="flex-1 max-w-[500px]">
          <div className="flex items-center gap-2 px-3 py-2 bg-[#F5F6F8] rounded-lg cursor-pointer hover:bg-[#EBEEF1] transition-colors">
            <Icon name="search" size="small" fill="currentColor" className="text-[#596171] flex-shrink-0" />
            <span className="text-sm text-[#596171]">Search</span>
          </div>
        </div>
        {/* Actions */}
        <div className="flex items-center gap-2">
          <button className="w-8 h-8 rounded-full flex items-center justify-center text-[#474E5A] hover:bg-[#F5F6F8] transition-colors">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M6.8864 4.92282C6.65368 5.17294 6.5 5.55331 6.5 6.04545C6.5 6.45967 6.16421 6.79545 5.75 6.79545C5.33579 6.79545 5 6.45967 5 6.04545C5 5.24215 5.2544 4.47479 5.78823 3.90105C6.32915 3.31968 7.09913 3 8 3C8.90087 3 9.67085 3.31968 10.2118 3.90105C10.7456 4.47479 11 5.24215 11 6.04545C11 7.27924 10.1311 7.96688 9.56438 8.37658C9.47014 8.4447 9.38575 8.5042 9.30937 8.55805C9.11953 8.69189 8.97916 8.79085 8.85995 8.90077C8.79024 8.96503 8.76105 9.00433 8.75 9.02233V9.5C8.75 9.91421 8.41421 10.25 8 10.25C7.58579 10.25 7.25 9.91421 7.25 9.5V9C7.25 8.43699 7.57587 8.04442 7.84318 7.79796C8.04139 7.61521 8.29958 7.43355 8.51465 7.28224C8.57594 7.23911 8.63372 7.19846 8.68562 7.16094C9.24387 6.75739 9.5 6.46776 9.5 6.04545C9.5 5.55331 9.34631 5.17294 9.1136 4.92282C8.88797 4.68032 8.53295 4.5 8 4.5C7.46705 4.5 7.11203 4.68032 6.8864 4.92282Z" fill="currentColor"/>
              <path d="M9 12C9 12.5514 8.5514 13 8 13C7.4486 13 7 12.5514 7 12C7 11.4486 7.4486 11 8 11C8.5514 11 9 11.4486 9 12Z" fill="currentColor"/>
              <path fillRule="evenodd" clipRule="evenodd" d="M8 14.5C11.5899 14.5 14.5 11.5899 14.5 8C14.5 4.41015 11.5899 1.5 8 1.5C4.41015 1.5 1.5 4.41015 1.5 8C1.5 9.02218 1.67899 9.60751 2.10262 10.3985C2.4189 10.989 2.51047 11.712 2.28063 12.4015L1.62171 14.3783L3.59848 13.7194C4.28801 13.4895 5.01103 13.5811 5.60154 13.8974C6.39249 14.321 6.97782 14.5 8 14.5ZM8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 9.29031 0.250384 10.1172 0.780342 11.1067C0.915539 11.3591 0.948157 11.6555 0.857606 11.9272L0.0513167 14.3461C0.0173279 14.448 0 14.5548 0 14.6623V15C0 15.5523 0.447715 16 1 16H1.33772C1.4452 16 1.55198 15.9827 1.65395 15.9487L4.07282 15.1424C4.34447 15.0518 4.6409 15.0845 4.89332 15.2197C5.88278 15.7496 6.70969 16 8 16Z" fill="currentColor"/>
            </svg>
          </button>
          <button className="w-8 h-8 rounded-full flex items-center justify-center bg-[#F5F6F8] text-[#533AFD] transition-colors">
            <Icon name="settings" size="small" fill="currentColor" />
          </button>
        </div>
      </div>
    </header>
  );
}

function RealSideNav({ protoControls }: { protoControls?: ProtoControlsType }) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const NavItemReal = ({ iconName, label, active = false }: { iconName: string; label: string; active?: boolean }) => (
    <div className={`flex items-center gap-2 h-[30px] px-1 rounded-md cursor-pointer hover:bg-[#F5F6F8] transition-colors ${active ? 'bg-[#F5F6F8]' : ''}`}>
      <div className={`w-6 h-6 flex items-center justify-center ${active ? 'text-[#533AFD]' : 'text-[#596171]'}`}>
        <Icon name={iconName} size="small" fill="currentColor" />
      </div>
      <span className={`text-sm flex-1 ${active ? 'text-[#533AFD] font-medium' : 'text-[#353A44]'}`}>{label}</span>
    </div>
  );

  const SubNavItemReal = ({ label, active = false }: { label: string; active?: boolean }) => (
    <div className={`flex items-center gap-2 h-[30px] px-1 rounded-md cursor-pointer hover:bg-[#F5F6F8] transition-colors`}>
      <div className="w-6 h-6 flex-shrink-0" />
      <span className={`text-sm ${active ? 'text-[#533AFD] font-medium' : 'text-[#353A44]'}`}>{label}</span>
    </div>
  );

  const ExpandableItem = ({ iconName, label, sectionId, children }: { iconName: string; label: string; sectionId: string; children: React.ReactNode }) => {
    const isExpanded = expandedSection === sectionId;
    return (
      <div>
        <div className="flex items-center gap-2 h-[30px] px-1 rounded-md hover:bg-[#F5F6F8] cursor-pointer transition-colors" onClick={() => setExpandedSection(isExpanded ? null : sectionId)}>
          <div className="w-6 h-6 flex items-center justify-center text-[#596171]">
            <Icon name={iconName} size="small" fill="currentColor" />
          </div>
          <span className="text-sm text-[#353A44] flex-1">{label}</span>
          <ChevronDown className={`w-4 h-4 text-[#596171] transition-transform duration-200 flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`} />
        </div>
        <div className={`grid transition-[grid-template-rows] duration-200 ${isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
          <div className="overflow-hidden"><div className="pb-1">{children}</div></div>
        </div>
      </div>
    );
  };

  return (
    <aside className="w-[240px] h-full flex flex-col bg-white border-r border-[rgba(0,39,77,0.08)] flex-shrink-0">
      {/* Account */}
      <div className="h-[60px] px-5 flex items-center">
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
      </div>

      {/* Nav */}
      <div className="flex-1 px-5 py-5 flex flex-col gap-7 overflow-y-auto">
        <div className="flex flex-col">
          <NavItemReal iconName="home" label="Home" />
          <NavItemReal iconName="balance" label="Balances" />
          <NavItemReal iconName="arrowsLoop" label="Transactions" />
          <NavItemReal iconName="person" label="Directory" />
          <NavItemReal iconName="product" label="Product catalog" />
        </div>
        <div className="flex flex-col gap-2">
          <div className="h-[26px] flex items-center">
            <span className="text-xs text-[#596171] uppercase tracking-wider">Products</span>
          </div>
          <div className="flex flex-col">
            <ExpandableItem iconName="platform" label="Connect" sectionId="connect">
              <SubNavItemReal label="Overview" />
              <SubNavItemReal label="Connected accounts" />
              <SubNavItemReal label="Accounts to review" />
              <SubNavItemReal label="Embedded finance" />
              <SubNavItemReal label="Capital" />
            </ExpandableItem>
            <ExpandableItem iconName="wallet" label="Payments" sectionId="payments">
              <SubNavItemReal label="Analytics" />
              <SubNavItemReal label="Disputes" />
              <SubNavItemReal label="Radar" />
              <SubNavItemReal label="Payment Links" />
              <SubNavItemReal label="Terminal" />
            </ExpandableItem>
            <ExpandableItem iconName="invoice" label="Billing" sectionId="billing">
              <SubNavItemReal label="Overview" />
              <SubNavItemReal label="Subscriptions" />
              <SubNavItemReal label="Invoices" />
              <SubNavItemReal label="Usage-based" />
              <SubNavItemReal label="Revenue recovery" />
            </ExpandableItem>
            <ExpandableItem iconName="barChart" label="Reporting" sectionId="reporting">
              <SubNavItemReal label="Reports" />
              <SubNavItemReal label="Sigma" />
              <SubNavItemReal label="Revenue Recognition" />
              <SubNavItemReal label="Data management" />
            </ExpandableItem>
            <NavItemReal iconName="more" label="More" />
          </div>
        </div>
      </div>

      {/* Proto controls */}
      {protoControls && (
        <div className="px-5 py-4 flex items-center">
          <ProtoControlsPopover protoControls={protoControls} />
        </div>
      )}
    </aside>
  );
}

// ─── Wireframe chrome ─────────────────────────────────────────────────────────

// Global Top Bar Component
function Topbar() {
  return (
    <header className="bg-white flex items-center py-3 flex-shrink-0">
      <div className="max-w-[1400px] mx-auto w-full flex items-center justify-between">
        {/* Search field placeholder */}
        <div className="flex items-center gap-6">
          <div className="bg-[#F5F6F8] h-9 w-[360px] rounded-lg opacity-80" />
        </div>

        {/* Right icons */}
        <div className="flex items-center gap-4">
          <div className="w-4 h-4 rounded-full bg-[#EBEEF1]" />
          <div className="w-4 h-4 rounded-full bg-[#EBEEF1]" />
        </div>
      </div>
    </header>
  );
}

// Side Navigation Component (wireframe)
function SideNav({ protoControls }: { protoControls?: ProtoControlsType }) {
  return (
    <aside className="w-[240px] h-full flex flex-col bg-white border-r border-[rgba(0,39,77,0.08)] flex-shrink-0">
      {/* Account Switcher */}
      <div className="h-[60px] px-5 flex items-center">
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
      </div>

      {/* Nav sections */}
      <div className="flex-1 px-5 py-5 flex flex-col gap-6 overflow-y-auto">
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

      {/* Bottom: proto controls or plain nav item */}
      <div className="px-5 py-4 flex items-center">
        {protoControls ? (
          <ProtoControlsPopover protoControls={protoControls} />
        ) : (
          <NavItem />
        )}
      </div>
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

// ============================================================
// Team & Security View + Add Member Drawer
// ============================================================


function RolesPermissionsContent({ sandboxMode, setSandboxMode, layoutVersion = "v2", customRoles, setCustomRoles, compactTabMode = false, reduceCounts = false, mergedCanCannot = false }: {
  sandboxMode: SandboxModeState;
  setSandboxMode: React.Dispatch<React.SetStateAction<SandboxModeState>>;
  layoutVersion?: "v1" | "v2" | "v3" | "v4" | "v5";
  customRoles: Role[];
  setCustomRoles: React.Dispatch<React.SetStateAction<Role[]>>;
  compactTabMode?: boolean;
  reduceCounts?: boolean;
  mergedCanCannot?: boolean;
}) {
  const { showToast } = useToast();
  // v2 and v3 share inverted color scheme (gray bg, gray badges) in the roles view
  const useInvertedColors = layoutVersion === "v2" || layoutVersion === "v3";
  const isV2Only = layoutVersion === "v2";
  const isV3 = layoutVersion === "v3";
  const isV4 = layoutVersion === "v4";
  const isV5 = layoutVersion === "v5";
  const useCompactLayout = isV3 || isV4 || isV5;
  const useDividerStyle = isV3 || isV4;
  // v2 has no dividers, so light vs dark only matters for v3/v4/v5 — use light for all
  const useLightDividers = !isV2Only;
  const [selectedRole, setSelectedRole] = useState<Role>(allRoles[0]);
  // Only one category can be expanded at a time (accordion behavior)
  const [expandedCategory, setExpandedCategory] = useState<string | null>(roleCategories[0]?.name || null);
  const [groupBy, setGroupBy] = useState<GroupByOption>("productCategory");
  const [isGrouped, setIsGrouped] = useState(true);
  const [showAll, setShowAll] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const roleDetailsRef = useRef<HTMLElement>(null);
  const [isRiskExpanded, setIsRiskExpanded] = useState(false);

  // Responsive: collapse roles sidebar into selector when container is narrow AND permissions are shown
  const panelContainerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(Infinity);
  const [showPermissionsPanel, setShowPermissionsPanel] = useState(false);
  const useTabLayout = compactTabMode;
  const compactRoles = showPermissionsPanel && containerWidth < 900;
  const roleSelectorPopover = usePopover();
  useEffect(() => {
    const el = panelContainerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setContainerWidth(entry.contentRect.width);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  
  const [isCustomizeModalOpen, setIsCustomizeModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");

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
        <div ref={panelContainerRef} className="flex flex-col flex-1 min-h-0 gap-6 overflow-hidden">

        {/* Compact role selector (shown when sidebar is collapsed) */}
        {compactRoles && (
          <div className="flex items-end gap-3 flex-shrink-0">
            <div className="relative flex items-center gap-3">
              <label className="text-[14px] font-semibold text-[#596171] leading-5 tracking-[-0.15px]">Roles</label>
              <button
                onClick={() => roleSelectorPopover.toggle()}
                className="flex items-center gap-2 px-3 py-1.5 text-[14px] font-semibold text-[#353A44] leading-5 tracking-[-0.15px] border border-[#D8DEE4] rounded-[6px] bg-white shadow-[0px_1px_1px_0px_rgba(33,37,44,0.16)] hover:bg-[#F5F6F8] transition-colors"
                style={{ fontFeatureSettings: "'lnum', 'pnum'" }}
              >
                <span className="flex-1 min-w-0 text-left truncate">{selectedRole.name}</span>
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="flex-shrink-0 text-[#474E5A]"><path fillRule="evenodd" clipRule="evenodd" d="M2.34963 9.91465C2.67291 9.55546 3.22617 9.52634 3.58536 9.84962L7.99991 13.8228L12.4148 9.84961C12.774 9.52634 13.3272 9.55547 13.6505 9.91467C13.9738 10.2739 13.9446 10.8271 13.5854 11.1504L8.58522 15.6504C8.41884 15.8001 8.20937 15.875 7.99991 15.875C7.79041 15.875 7.58092 15.8001 7.41453 15.6504L2.41466 11.1504C2.05546 10.8271 2.02635 10.2738 2.34963 9.91465Z" fill="currentColor"/><path fillRule="evenodd" clipRule="evenodd" d="M7.41453 0.349625C7.58092 0.199871 7.79041 0.124995 7.99991 0.125C8.20937 0.125005 8.41884 0.199873 8.58522 0.349605L13.5854 4.84961C13.9446 5.17287 13.9738 5.72613 13.6505 6.08533C13.3272 6.44453 12.774 6.47366 12.4148 6.15039L7.99991 2.17719L3.58536 6.15038C3.22617 6.47366 2.67291 6.44454 2.34963 6.08535C2.02635 5.72616 2.05546 5.17291 2.41466 4.84962L7.41453 0.349625Z" fill="currentColor"/></svg>
              </button>

              {roleSelectorPopover.isVisible && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => roleSelectorPopover.close()} />
                  <div className={`absolute top-full left-0 mt-1 min-w-full w-max max-w-[320px] bg-white border border-[#D8DEE4] rounded-[8px] shadow-[0_5px_15px_rgba(0,0,0,0.12),0_15px_35px_rgba(48,49,61,0.08)] z-20 overflow-hidden ${roleSelectorPopover.animationClass}`}>
                    <div className="max-h-[320px] overflow-y-auto py-1">
                      {allCategories.map((category, catIndex) => (
                        <div key={category.name}>
                          {catIndex > 0 && <div className="h-px bg-[#EBEEF1] my-1" />}
                          <div className="px-3 py-1.5">
                            <span className="text-[12px] font-bold text-[#353A44] leading-5">{category.name}</span>
                          </div>
                          {category.roles.map((role) => (
                            <button
                              key={role.id}
                              onClick={() => {
                                setSelectedRole(role);
                                setSearchQuery("");
                                roleDetailsRef.current?.scrollTo(0, 0);
                                roleSelectorPopover.close();
                              }}
                              className={`w-full text-left px-3 py-1.5 text-[14px] leading-5 tracking-[-0.15px] transition-colors ${
                                selectedRole.id === role.id
                                  ? "bg-[#F7F5FD] text-[#533AFD] font-semibold"
                                  : "text-[#353A44] hover:bg-[#F5F6F8]"
                              }`}
                            >
                              {role.name}
                            </button>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="flex-1" />
            <button
              onClick={() => { setModalMode("create"); setIsCreateModalOpen(true); }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-semibold text-[#353A44] leading-5 tracking-[-0.15px] rounded-[6px] bg-white border border-[#D8DEE4] hover:bg-[#F5F6F8] transition-colors shadow-[0px_1px_1px_0px_rgba(33,37,44,0.16)] flex-shrink-0"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="flex-shrink-0"><path d="M6 1V11M1 6H11" stroke="#353A44" strokeWidth="1.5" strokeLinecap="round"/></svg>
              Create or customize role
            </button>
          </div>
        )}

        <div className={`flex flex-1 min-h-0 ${compactRoles ? '' : 'gap-6'} overflow-hidden`}>
        {/* Left Panel - Roles List */}
        {/* Baseline alignment: 16px title needs pt-[23px] to align with section's 20px title at pt-5/pt-3+8 */}
        {!compactRoles && (
        <aside className="w-[240px] max-w-[240px] overflow-y-auto flex-shrink-0 pt-[23px] relative">
          {/* Header */}
          <div className="flex items-center gap-2.5 pb-4 border-b border-[#EBEEF1]">
            <h2 className="flex-1 text-[16px] font-bold text-[#353A44] leading-6 tracking-[-0.31px]" style={{ fontFeatureSettings: "'lnum', 'pnum'" }}>Roles</h2>
          </div>

          {/* Categories */}
          <div className="flex flex-col">
            {allCategories.map((category) => {
              const isExpanded = expandedCategory === category.name;
              const hasActiveRole = category.roles.some(r => r.id === selectedRole.id);
              const showActiveCategory = !isExpanded && hasActiveRole;
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
                    className={`w-full flex items-center gap-2 px-2 py-1 rounded-md transition-colors ${showActiveCategory ? 'bg-[#F5F6F8] hover:bg-[#EBEEF1]' : 'hover:bg-[#F5F6F8]'}`}
                  >
                    <span className={`flex-1 text-left text-[13px] font-semibold leading-[19px] tracking-[-0.15px] ${showActiveCategory ? 'text-[#533AFD]' : 'text-[#353A44]'}`}>
                      {category.name}
                    </span>
                    {!reduceCounts && (
                      <span className="text-[10px] font-semibold text-[#596171] leading-4 min-w-[16px] px-1 text-center">
                        {category.roles.length}
                      </span>
                    )}
                    <ChevronDown 
                      className={`w-4 h-4 transition-transform duration-300 ${showActiveCategory ? 'text-[#533AFD]' : 'text-[#474E5A]'}`}
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
            {/* Create role button */}
            <button
              onClick={() => { setModalMode("create"); setIsCreateModalOpen(true); }}
              className="w-full flex items-center gap-1.5 px-2 py-2 text-left hover:bg-[#F5F6F8] transition-colors rounded-md mt-1"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="flex-shrink-0"><path d="M6 1V11M1 6H11" stroke="#635BFF" strokeWidth="1.5" strokeLinecap="round"/></svg>
              <span className="text-[13px] font-semibold text-[#635BFF] leading-[19px] tracking-[-0.15px]">Create or customize role</span>
            </button>
          </div>
        </aside>
        )}

        {/* Shared Container for Role Details + Permissions */}
        <div className={`flex-1 min-h-0 min-w-0 flex flex-col overflow-hidden ${useInvertedColors ? '' : 'bg-[#F5F6F8] rounded-xl p-2'}`}>
          <div className="flex-1 min-h-0 flex gap-4 overflow-hidden">
          {/* Role Details Panel */}
          {/* Baseline alignment: pt-5 (20px) for the 20px title; in v1 subtract container's p-2 (8px) → pt-3 */}
          <section ref={roleDetailsRef} className={`flex-1 min-w-0 max-w-[720px] flex flex-col gap-6 overflow-y-auto ${useInvertedColors ? 'pt-5 pl-6' : 'px-4 pt-3 pb-[13px]'}`}>
            {/* Header */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <h2 className="text-[20px] font-bold text-[#353A44] leading-7 tracking-[0.3px] font-display" style={{ fontFeatureSettings: "'lnum', 'pnum'" }}>
                  {selectedRole.name}
                </h2>
                {!reduceCounts && (
                  <Tooltip content={`There are ${selectedRole.userCount} users with the ${selectedRole.name} role`}>
                    <span className={`${useInvertedColors ? 'bg-[#F5F6F8]' : 'bg-white'} text-[10px] font-semibold text-[#596171] leading-4 min-w-[16px] px-1 rounded-full text-center cursor-default`}>
                      {selectedRole.userCount}
                    </span>
                  </Tooltip>
                )}
                {selectedRole.category === "Custom" && (
                  <span className="bg-[#e2fbfe] text-[#045ad0] text-[12px] font-normal px-2 py-0.5 rounded flex-shrink-0">
                    Custom
                  </span>
                )}
                <div className="flex-1" />
                {useTabLayout && (
                  <button
                    onClick={() => setShowPermissionsPanel(v => !v)}
                    className="flex items-center gap-1.5 text-[13px] text-[#635BFF] hover:text-[#533AFD] transition-colors p-1 -m-1 rounded-md hover:bg-[#EBEEF1]"
                  >
                    {showPermissionsPanel ? (
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M14.5303 2.53033C14.8232 2.23744 14.8232 1.76256 14.5303 1.46967C14.2374 1.17678 13.7626 1.17678 13.4697 1.46967L12.1045 2.83488C10.8712 2.17214 9.44492 1.75 8 1.75C5.99343 1.75 4.02285 2.5641 2.55506 3.70615C1.11359 4.82771 0 6.39643 0 8C0 9.60357 1.11359 11.1723 2.55506 12.2939C2.572 12.307 2.58901 12.3202 2.60608 12.3333L1.46967 13.4697C1.17678 13.7626 1.17678 14.2374 1.46967 14.5303C1.76256 14.8232 2.23744 14.8232 2.53033 14.5303L3.89554 13.1651C5.12884 13.8279 6.55508 14.25 8 14.25C10.0066 14.25 11.9771 13.4359 13.4449 12.2939C14.8864 11.1723 16 9.60357 16 8C16 6.39643 14.8864 4.82771 13.4449 3.70615C13.428 3.69297 13.411 3.67983 13.3939 3.66674L14.5303 2.53033ZM10.9875 3.95179C10.0504 3.5138 9.01807 3.25 8 3.25C6.38157 3.25 4.72715 3.91667 3.47619 4.89001C2.19891 5.88383 1.5 7.06511 1.5 8C1.5 8.93489 2.19891 10.1162 3.47619 11.11C3.54227 11.1614 3.60947 11.212 3.67773 11.2616L5.05255 9.88679C4.70339 9.34227 4.50049 8.69413 4.50049 7.99951C4.50049 6.06651 6.06749 4.49951 8.00049 4.49951C8.69488 4.49951 9.34316 4.70236 9.88778 5.05156L10.9875 3.95179ZM8.78172 6.15762C8.5419 6.05575 8.27807 5.99951 8.00049 5.99951C6.89592 5.99951 6.00049 6.89494 6.00049 7.99951C6.00049 8.27696 6.05671 8.54084 6.1586 8.78074L8.78172 6.15762ZM5.01245 12.0482L12.3223 4.73839C12.3905 4.78804 12.4577 4.83859 12.5238 4.89001C13.8011 5.88383 14.5 7.06511 14.5 8C14.5 8.93489 13.8011 10.1162 12.5238 11.11C11.2729 12.0833 9.61843 12.75 8 12.75C6.98193 12.75 5.94962 12.4862 5.01245 12.0482Z" fill="currentColor"/>
                      </svg>
                    ) : (
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M8.00049 5.99951C6.89592 5.99951 6.00049 6.89494 6.00049 7.99951C6.00049 9.10408 6.89592 9.99951 8.00049 9.99951C9.10506 9.99951 10.0005 9.10408 10.0005 7.99951C10.0005 6.89494 9.10506 5.99951 8.00049 5.99951ZM4.50049 7.99951C4.50049 6.06652 6.06749 4.49951 8.00049 4.49951C9.93349 4.49951 11.5005 6.06652 11.5005 7.99951C11.5005 9.93251 9.93349 11.4995 8.00049 11.4995C6.06749 11.4995 4.50049 9.93251 4.50049 7.99951Z" fill="currentColor"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M3.47619 4.89001C2.19891 5.88383 1.5 7.06511 1.5 8C1.5 8.93489 2.19891 10.1162 3.47619 11.11C4.72715 12.0833 6.38157 12.75 8 12.75C9.61843 12.75 11.2729 12.0833 12.5238 11.11C13.8011 10.1162 14.5 8.93489 14.5 8C14.5 7.06511 13.8011 5.88383 12.5238 4.89001C11.2729 3.91667 9.61843 3.25 8 3.25C6.38157 3.25 4.72715 3.91667 3.47619 4.89001ZM2.55506 3.70615C4.02285 2.5641 5.99343 1.75 8 1.75C10.0066 1.75 11.9771 2.5641 13.4449 3.70615C14.8864 4.82771 16 6.39643 16 8C16 9.60357 14.8864 11.1723 13.4449 12.2939C11.9771 13.4359 10.0066 14.25 8 14.25C5.99343 14.25 4.02285 13.4359 2.55506 12.2939C1.11359 11.1723 0 9.60357 0 8C0 6.39643 1.11359 4.82771 2.55506 3.70615Z" fill="currentColor"/>
                      </svg>
                    )}
                    <span>Permissions</span>
                  </button>
                )}
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
            <div className={`${isV2Only ? 'bg-[#F5F6F8] rounded-lg p-4' : ''} flex flex-col gap-4`}>
              {!isV2Only && <div className={`h-px ${isV3 ? 'bg-[#EBEEF1]' : 'bg-[#D8DEE4]'}`} />}

              {/* Note */}
              <p className="text-[13px] text-[#596171] leading-[19px] tracking-[-0.15px]">
                Capabilities listed are highlights.{' '}
                {useTabLayout ? (
                  <button
                    onClick={() => setShowPermissionsPanel(true)}
                    disabled={showPermissionsPanel}
                    className={`transition-colors ${showPermissionsPanel ? 'text-[#596171] cursor-default' : 'text-[#635BFF] hover:text-[#533AFD]'}`}
                  >
                    View permissions
                  </button>
                ) : (
                  'View permissions'
                )}{' '}
                for the full list by role.
              </p>

              {mergedCanCannot ? (
                /* Merged can/cannot list */
                <ul className="flex flex-col gap-1.5">
                  {(selectedRole.details?.canDo ?? []).map((item, i) => (
                    <li key={`can-${i}`} className="flex items-start gap-2 text-[13px] text-[#353A44] leading-[19px] tracking-[-0.15px]">
                      <svg width="10" height="10" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 mt-[4px]">
                        <path fillRule="evenodd" clipRule="evenodd" d="M15.4695 2.23296C15.8241 2.56129 15.8454 3.1149 15.5171 3.46949L6.14206 13.5945C5.97228 13.7778 5.73221 13.8799 5.48237 13.8748C5.23253 13.8698 4.99677 13.7582 4.83452 13.5681L0.459523 8.44311C0.145767 8.07557 0.18937 7.52327 0.556912 7.20951C0.924454 6.89575 1.47676 6.93936 1.79051 7.3069L5.52658 11.6834L14.233 2.28052C14.5613 1.92593 15.1149 1.90464 15.4695 2.23296Z" fill="#2B8700"/>
                      </svg>
                      {item}
                    </li>
                  ))}
                  {(selectedRole.details?.cannotDo ?? []).map((item, i) => (
                    <li key={`cannot-${i}`} className="flex items-start gap-2 text-[13px] text-[#353A44] leading-[19px] tracking-[-0.15px]">
                      <svg width="10" height="10" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 mt-[4px]">
                        <path fillRule="evenodd" clipRule="evenodd" d="M1.25628 1.25628C1.59799 0.914573 2.15201 0.914573 2.49372 1.25628L8 6.76256L13.5063 1.25628C13.848 0.914573 14.402 0.914573 14.7437 1.25628C15.0854 1.59799 15.0854 2.15201 14.7437 2.49372L9.23744 8L14.7437 13.5063C15.0854 13.848 15.0854 14.402 14.7437 14.7437C14.402 15.0854 13.848 15.0854 13.5063 14.7437L8 9.23744L2.49372 14.7437C2.15201 15.0854 1.59799 15.0854 1.25628 14.7437C0.914573 14.402 0.914573 13.848 1.25628 13.5063L6.76256 8L1.25628 2.49372C0.914573 2.15201 0.914573 1.59799 1.25628 1.25628Z" fill="#C0123C"/>
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <>
                {/* Can section */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
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

                {/* Cannot section */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
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
                </>
              )}

              {!isV2Only && <div className={`h-px ${isV3 ? 'bg-[#EBEEF1]' : 'bg-[#D8DEE4]'}`} />}

            </div>

            {/* Risk Assessment - own container */}
            <div className={`${isV2Only ? 'p-4 bg-[#F5F6F8] rounded-lg' : ''}`}>
              <RiskAssessmentCard 
                assessment={riskAssessment} 
                isExpanded={isRiskExpanded}
                onToggle={() => setIsRiskExpanded(!isRiskExpanded)}
                onGreyBg
              />
            </div>
          </section>

          {/* Permissions Panel */}
          {/* Baseline alignment: pt-6 (24px) for the 16px title; in v1 container's p-2 (8px) + p-4 (16px) = 24px */}
          <div
            className={`flex flex-col overflow-hidden transition-[flex,opacity] duration-500 ${(!useTabLayout || showPermissionsPanel) ? 'flex-1 min-w-0 opacity-100' : 'flex-[0] w-0 opacity-0 pointer-events-none'}`}
            style={{ transitionTimingFunction: 'cubic-bezier(0.34, 1.2, 0.64, 1)' }}
          >
          <main className={`flex-1 min-w-0 min-h-0 flex flex-col gap-4 rounded-lg overflow-hidden ${useInvertedColors ? 'bg-[#F5F6F8] pt-6 px-4 pb-4' : 'p-4 bg-white'}`}>
            {/* Header */}
            <div className="flex items-baseline gap-2">
              <h2 className="text-[16px] font-bold text-[#353A44] leading-6 tracking-[-0.31px]" style={{ fontFeatureSettings: "'lnum', 'pnum'" }}>Permissions</h2>
              <span className={`${useInvertedColors ? 'bg-[#F5F6F8]' : 'bg-white'} text-[10px] font-semibold text-[#596171] leading-4 min-w-[16px] px-1 rounded-full text-center`}>
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
              <div className="search-field flex-1 flex items-center gap-2 border border-[#D8DEE4] rounded-md px-2 py-1 min-h-[28px] bg-white form-focus-ring">
                <SearchIcon className="text-[#474E5A]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search"
                  className="flex-1 text-[13px] text-[#353A44] leading-[19px] tracking-[-0.15px] bg-transparent outline-none placeholder:text-[#353A44] focus:placeholder:text-[#818DA0]"
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
            <div className={`flex-1 min-h-0 overflow-y-auto flex flex-col ${useCompactLayout ? "gap-0" : isGrouped ? "gap-1" : "gap-2"}`}>
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
                    invertColors={useInvertedColors}
                    useDividers={useDividerStyle}
                    noDividers={isV5}
                    lightDividers={useLightDividers}
                  />
                ));
              })()}

              {/* Ungrouped: Alphabetical (flat list) - show task categories as tags */}
              {!isGrouped && alphabeticalPermissions && (
                <div className={useCompactLayout ? "flex flex-col" : "flex flex-col gap-2"}>
                  <div className={`flex items-center gap-2 ${useDividerStyle ? `relative p-3 after:content-[''] after:absolute after:bottom-0 after:left-3 after:right-3 after:h-px ${useLightDividers ? 'after:bg-[#EBEEF1]' : 'after:bg-[#D8DEE4]'}` : (isV5 ? 'p-4' : '')}`}>
                    <h3 className="text-[13px] font-semibold text-[#353A44] leading-[19px] tracking-[-0.15px]">
                      All permissions
                    </h3>
                    <span className={`inline-flex items-center justify-center min-w-[16px] h-[16px] px-1 ${useInvertedColors ? 'bg-[#F5F6F8]' : 'bg-white'} text-[10px] font-semibold text-[#596171] leading-4 rounded-full text-center`}>
                      {showAll
                        ? `${alphabeticalPermissions.filter(p => activeApiNames.has(p.apiName)).length} of ${alphabeticalPermissions.length}`
                        : alphabeticalPermissions.length}
                    </span>
                  </div>
                  <div className={useDividerStyle ? `flex flex-col pl-3 [&>*:not(:last-child)]:relative [&>*:not(:last-child)]:after:content-[''] [&>*:not(:last-child)]:after:absolute [&>*:not(:last-child)]:after:bottom-0 [&>*:not(:last-child)]:after:left-3 [&>*:not(:last-child)]:after:right-3 [&>*:not(:last-child)]:after:h-px ${useLightDividers ? '[&>*:not(:last-child)]:after:bg-[#EBEEF1]' : '[&>*:not(:last-child)]:after:bg-[#D8DEE4]'}` : (isV5 ? 'flex flex-col pl-4' : '')}>
                    {alphabeticalPermissions.map((permission) => (
                      <PermissionItem
                        key={permission.apiName}
                        permission={permission}
                        roleId={selectedRole.id}
                        showTaskCategories={true}
                        customAccess={selectedRole.permissionAccess?.[permission.apiName]}
                        isInactive={showAll ? !activeApiNames.has(permission.apiName) : false}
                        invertColors={useInvertedColors}
                        useDividers={useDividerStyle}
                        noDividers={isV5}
                        lightDividers={useLightDividers}
                      />
                    ))}
                  </div>
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
                  <div key={groupName} className={useCompactLayout ? "flex flex-col" : "flex flex-col gap-2"}>
                    <div className={`flex items-center gap-2 ${useDividerStyle ? `relative p-3 after:content-[''] after:absolute after:bottom-0 after:left-3 after:right-3 after:h-px ${useLightDividers ? 'after:bg-[#EBEEF1]' : 'after:bg-[#D8DEE4]'}` : (isV5 ? 'p-4' : '')}`}>
                      <h3 className="text-[13px] font-semibold text-[#353A44] leading-[19px] tracking-[-0.15px]">
                        {groupName}
                      </h3>
                      <span className={`inline-flex items-center justify-center min-w-[16px] h-[16px] px-1 ${useInvertedColors ? 'bg-[#F5F6F8]' : 'bg-white'} text-[10px] font-semibold text-[#596171] leading-4 rounded-full text-center`}>
                        {showAll
                          ? `${perms.filter(p => activeApiNames.has(p.apiName)).length} of ${perms.length}`
                          : perms.filter(p => activeApiNames.has(p.apiName)).length}
                      </span>
                    </div>
                    <div className={useDividerStyle ? `flex flex-col pl-3 [&>*:not(:last-child)]:relative [&>*:not(:last-child)]:after:content-[''] [&>*:not(:last-child)]:after:absolute [&>*:not(:last-child)]:after:bottom-0 [&>*:not(:last-child)]:after:left-3 [&>*:not(:last-child)]:after:right-3 [&>*:not(:last-child)]:after:h-px ${useLightDividers ? '[&>*:not(:last-child)]:after:bg-[#EBEEF1]' : '[&>*:not(:last-child)]:after:bg-[#D8DEE4]'}` : (isV5 ? 'flex flex-col pl-4' : 'flex flex-col gap-2')}>
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
                          invertColors={useInvertedColors}
                          useDividers={useDividerStyle}
                          noDividers={isV5}
                          lightDividers={useLightDividers}
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
          showToast(`${role.name} has been created`);
        }}
        onUpdate={(role) => {
          handleUpdateCustomRole(role);
          // Clear sandbox modal state after updating
          setSandboxMode(prev => ({ ...prev, sourceModal: undefined, modalState: undefined }));
          showToast(`${role.name} has been updated`);
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
        layoutVersion={layoutVersion}
        mergedCanCannot={mergedCanCannot}
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
          showToast(`${newRole.name} has been created`);
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
        layoutVersion={layoutVersion}
        mergedCanCannot={mergedCanCannot}
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

function AddMemberModal({ isOpen, onClose, onComplete, layoutVersion = "v1", customRoles = [], singleRoleSelect = false, setCustomRoles, mergedCanCannot = false, onTestInSandbox, initialCreatingRole = false, initialRoleState }: { isOpen: boolean; onClose: () => void; onComplete?: () => void; layoutVersion?: "v1" | "v2" | "v3" | "v4" | "v5"; customRoles?: Role[]; singleRoleSelect?: boolean; setCustomRoles?: React.Dispatch<React.SetStateAction<Role[]>>; mergedCanCannot?: boolean; onTestInSandbox?: (previewRole: Role, modalState: { roleName: string; customDescription: string; permissionAccess: Record<string, string>; selectedBaseRole?: Role | null }) => void; initialCreatingRole?: boolean; initialRoleState?: { roleName: string; customDescription: string; permissionAccess: Record<string, string>; selectedBaseRole?: Role | null } }) {
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
  const [creatingRole, setCreatingRole] = useState(false);
  const [showPermissions, setShowPermissions] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [emailVisibleCount, setEmailVisibleCount] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const accountSearchRef = useRef<HTMLInputElement>(null);
  const emailReviewRef = useRef<HTMLParagraphElement>(null);
  const step3ContentRef = useRef<HTMLDivElement>(null);
  const rolesScrollRef = useRef<HTMLDivElement>(null);
  const [rolesShowShadow, setRolesShowShadow] = useState(false);
  const step3ModalRef = useRef<HTMLDivElement>(null);
  const [step3ContentHeight, setStep3ContentHeight] = useState<number | null>(null);
  const prevShowPermRef = useRef(showPermissions);
  const [permClosingPhase, setPermClosingPhase] = useState<'width' | null>(null);
  const [rolesMaxWidth, setRolesMaxWidth] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (initialCreatingRole) {
        // Returning from sandbox — jump straight to the create role screen at step 3
        setStep(3); setCreatingRole(true); setIsClosing(false);
        setEmailVisibleCount(0); setPermClosingPhase(null); setRolesMaxWidth(null);
      } else {
        setStep(1); setEmails([]); setCurrentInput(""); setSelectedAccount("all");
        setSelectedAccounts(new Set(ALL_ACCOUNT_IDS)); setShowAccountPicker(false); setAccountGroupFilter("All"); setAccountSearch("");
        setSelectedRoles(new Set()); setExpandedCategories(new Set()); setShowPermissions(false); setIsClosing(false); setCreatingRole(false);
        setEmailVisibleCount(0); setPermClosingPhase(null); setRolesMaxWidth(null);
        // Focus the email input after the modal animation settles
        requestAnimationFrame(() => { inputRef.current?.focus(); });
      }
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

  // Handle permissions closing: capture roles column width for fixed-width during transition.
  useLayoutEffect(() => {
    if (prevShowPermRef.current && !showPermissions && step === 3) {
      const rolesCol = step3ContentRef.current?.parentElement?.parentElement;
      if (rolesCol) {
        setRolesMaxWidth(rolesCol.offsetWidth);
      }
      setPermClosingPhase('width');
    }
    prevShowPermRef.current = showPermissions;
  }, [step, showPermissions]);

  // Release the fixed roles width after the transition completes
  useEffect(() => {
    if (permClosingPhase === 'width') {
      const timer = setTimeout(() => {
        setPermClosingPhase(null);
        setRolesMaxWidth(null);
      }, 520);
      return () => clearTimeout(timer);
    }
  }, [permClosingPhase]);

  const cleanupRef = useRef<(() => void) | null>(null);
  // Observe step 3 role list height for dynamic modal sizing.
  // Measures "chrome height" (close button, title, roles header, info box, footer, gaps)
  // by temporarily collapsing the scroll container, then target = chrome + roleList.scrollHeight.
  // useLayoutEffect ensures measurement happens before paint (no flash).
  useLayoutEffect(() => {
    if (step !== 3) {
      setStep3ContentHeight(null);
      return;
    }
    if (showPermissions || creatingRole) {
      // Keep the existing step3ContentHeight so the modal can smoothly
      // transition from height:100% back to content height when these close.
      return;
    }
    // Defer measurement by one frame so the role list DOM is fully mounted
    const raf = requestAnimationFrame(() => {
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
      // Store cleanup in a way the outer effect can use
      cleanupRef.current = () => ro.disconnect();
    });
    return () => {
      cancelAnimationFrame(raf);
      cleanupRef.current?.();
      cleanupRef.current = null;
    };
  }, [step, showPermissions, creatingRole]);

  // Check if roles scroll container overflows and is not at bottom
  // Uses ResizeObserver so it rechecks whenever the scroll container changes size
  useEffect(() => {
    const el = rolesScrollRef.current;
    if (!el) { setRolesShowShadow(false); return; }
    const check = () => {
      const overflows = el.scrollHeight > el.clientHeight + 4;
      const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 4;
      setRolesShowShadow(overflows && !atBottom);
    };
    const ro = new ResizeObserver(check);
    ro.observe(el);
    check();
    return () => ro.disconnect();
  }, [step, creatingRole]);

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
    if (singleRoleSelect) {
      // Single select: replace selection (or deselect if already selected)
      setSelectedRoles(prev => prev.has(roleId) ? new Set() : new Set([roleId]));
    } else {
      setSelectedRoles(prev => { const next = new Set(prev); if (next.has(roleId)) next.delete(roleId); else next.add(roleId); return next; });
    }
  };

  const toggleCategory = (catName: string) => {
    if (singleRoleSelect) {
      // Accordion: only one category open at a time
      setExpandedCategories(prev => prev.has(catName) ? new Set() : new Set([catName]));
    } else {
      setExpandedCategories(prev => { const next = new Set(prev); if (next.has(catName)) next.delete(catName); else next.add(catName); return next; });
    }
  };

  // Combined role categories including custom roles
  const allCategories = customRoles.length > 0
    ? [...roleCategories, { name: "Custom", roles: customRoles }]
    : roleCategories;

  const selectedRoleNames = allCategories.flatMap(cat => cat.roles).filter(r => selectedRoles.has(r.id)).map(r => r.name);

  const categoryDisplayNames: Record<string, string> = {
    "Admin": "Admin", "Developer": "Developer", "Payments": "Payments", "Support": "Support",
    "Specialists": "Connect", "View only": "View only", "Sandbox": "Sandbox", "Custom": "Custom",
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
            transition: 'width 500ms cubic-bezier(0.4,0,0.2,1), max-width 500ms cubic-bezier(0.4,0,0.2,1), height 500ms cubic-bezier(0.4,0,0.2,1), max-height 500ms cubic-bezier(0.4,0,0.2,1)',
          } : {}),
          ...(step === 3
            ? creatingRole
              ? { width: '100%', maxWidth: 1280, maxHeight: '100%', height: '100%' }
              : {
                  width: showPermissions ? '100%' : 640,
                  maxWidth: showPermissions ? 1280 : 640,
                  maxHeight: showPermissions ? '100%' : 661,
                  ...(showPermissions
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
        <div className={`${step === 3 && !showPermissions && !creatingRole ? 'min-h-0' : 'flex-1 min-h-0'} overflow-hidden flex flex-col`}>
          {step === 1 && (
            <div className="flex-1 min-h-0 flex flex-col gap-8 p-8 pt-0 pb-2">
              <div className="flex flex-col gap-1 flex-shrink-0">
                <h2 className="text-[24px] font-bold text-[#21252C] leading-8 tracking-[0.3px] font-display" style={{ fontFeatureSettings: "'lnum', 'pnum'" }}>{stepLabels[step]}</h2>
                <p className="text-[14px] text-[#353A44] leading-5 tracking-[-0.15px]">Enter team member email addresses. Invited members will share the same roles.</p>
              </div>
              <div className="flex-1 min-h-0 flex flex-wrap content-start items-start gap-1.5 px-3 py-2 border border-[#D8DEE4] rounded-[6px] form-focus-ring cursor-text overflow-y-auto" onClick={() => inputRef.current?.focus()}>
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
          {step === 3 && !creatingRole && (
            <div className={`flex flex-col gap-4 px-8 min-h-0 overflow-hidden ${showPermissions || isClosingWidth ? 'flex-1' : ''}`}>
              <div className="flex-shrink-0">
                <h2 className="text-[24px] font-bold text-[#21252C] leading-8 tracking-[0.3px] font-display" style={{ fontFeatureSettings: "'lnum', 'pnum'" }}>{singleRoleSelect ? 'Select a role' : stepLabels[step]}</h2>
              </div>
              <div className={`flex gap-6 min-h-0 overflow-hidden ${showPermissions || isClosingWidth ? 'flex-1' : ''}`} style={{ transition: 'flex 500ms cubic-bezier(0.4,0,0.2,1)' }}>
                <div className="flex-1 min-w-0 flex flex-col gap-2 min-h-0 pt-[18px]" style={rolesMaxWidth != null ? { maxWidth: rolesMaxWidth } : undefined}>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <span className="flex-1 text-[16px] font-bold text-[#353A44] leading-6 tracking-[-0.31px]" style={{ fontFeatureSettings: "'lnum', 'pnum'" }}>Roles</span>
                    <button
                      onClick={() => setShowPermissions(v => !v)}
                      className="flex items-center gap-1.5 text-[13px] text-[#635BFF] hover:text-[#533AFD] transition-colors p-1 -m-1 rounded-md hover:bg-[#EBEEF1]"
                    >
                      {showPermissions ? (
                        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" clipRule="evenodd" d="M14.5303 2.53033C14.8232 2.23744 14.8232 1.76256 14.5303 1.46967C14.2374 1.17678 13.7626 1.17678 13.4697 1.46967L12.1045 2.83488C10.8712 2.17214 9.44492 1.75 8 1.75C5.99343 1.75 4.02285 2.5641 2.55506 3.70615C1.11359 4.82771 0 6.39643 0 8C0 9.60357 1.11359 11.1723 2.55506 12.2939C2.572 12.307 2.58901 12.3202 2.60608 12.3333L1.46967 13.4697C1.17678 13.7626 1.17678 14.2374 1.46967 14.5303C1.76256 14.8232 2.23744 14.8232 2.53033 14.5303L3.89554 13.1651C5.12884 13.8279 6.55508 14.25 8 14.25C10.0066 14.25 11.9771 13.4359 13.4449 12.2939C14.8864 11.1723 16 9.60357 16 8C16 6.39643 14.8864 4.82771 13.4449 3.70615C13.428 3.69297 13.411 3.67983 13.3939 3.66674L14.5303 2.53033ZM10.9875 3.95179C10.0504 3.5138 9.01807 3.25 8 3.25C6.38157 3.25 4.72715 3.91667 3.47619 4.89001C2.19891 5.88383 1.5 7.06511 1.5 8C1.5 8.93489 2.19891 10.1162 3.47619 11.11C3.54227 11.1614 3.60947 11.212 3.67773 11.2616L5.05255 9.88679C4.70339 9.34227 4.50049 8.69413 4.50049 7.99951C4.50049 6.06651 6.06749 4.49951 8.00049 4.49951C8.69488 4.49951 9.34316 4.70236 9.88778 5.05156L10.9875 3.95179ZM8.78172 6.15762C8.5419 6.05575 8.27807 5.99951 8.00049 5.99951C6.89592 5.99951 6.00049 6.89494 6.00049 7.99951C6.00049 8.27696 6.05671 8.54084 6.1586 8.78074L8.78172 6.15762ZM5.01245 12.0482L12.3223 4.73839C12.3905 4.78804 12.4577 4.83859 12.5238 4.89001C13.8011 5.88383 14.5 7.06511 14.5 8C14.5 8.93489 13.8011 10.1162 12.5238 11.11C11.2729 12.0833 9.61843 12.75 8 12.75C6.98193 12.75 5.94962 12.4862 5.01245 12.0482Z" fill="currentColor"/>
                        </svg>
                      ) : (
                        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" clipRule="evenodd" d="M8.00049 5.99951C6.89592 5.99951 6.00049 6.89494 6.00049 7.99951C6.00049 9.10408 6.89592 9.99951 8.00049 9.99951C9.10506 9.99951 10.0005 9.10408 10.0005 7.99951C10.0005 6.89494 9.10506 5.99951 8.00049 5.99951ZM4.50049 7.99951C4.50049 6.06652 6.06749 4.49951 8.00049 4.49951C9.93349 4.49951 11.5005 6.06652 11.5005 7.99951C11.5005 9.93251 9.93349 11.4995 8.00049 11.4995C6.06749 11.4995 4.50049 9.93251 4.50049 7.99951Z" fill="currentColor"/>
                          <path fillRule="evenodd" clipRule="evenodd" d="M3.47619 4.89001C2.19891 5.88383 1.5 7.06511 1.5 8C1.5 8.93489 2.19891 10.1162 3.47619 11.11C4.72715 12.0833 6.38157 12.75 8 12.75C9.61843 12.75 11.2729 12.0833 12.5238 11.11C13.8011 10.1162 14.5 8.93489 14.5 8C14.5 7.06511 13.8011 5.88383 12.5238 4.89001C11.2729 3.91667 9.61843 3.25 8 3.25C6.38157 3.25 4.72715 3.91667 3.47619 4.89001ZM2.55506 3.70615C4.02285 2.5641 5.99343 1.75 8 1.75C10.0066 1.75 11.9771 2.5641 13.4449 3.70615C14.8864 4.82771 16 6.39643 16 8C16 9.60357 14.8864 11.1723 13.4449 12.2939C11.9771 13.4359 10.0066 14.25 8 14.25C5.99343 14.25 4.02285 13.4359 2.55506 12.2939C1.11359 11.1723 0 9.60357 0 8C0 6.39643 1.11359 4.82771 2.55506 3.70615Z" fill="currentColor"/>
                        </svg>
                      )}
                      <span>Permissions</span>
                    </button>
                  </div>
                  <div className="min-h-0 relative">
                    <div ref={rolesScrollRef} className="overflow-y-auto h-full" onScroll={(e) => {
                      const el = e.currentTarget;
                      const overflows = el.scrollHeight > el.clientHeight + 4;
                      const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 4;
                      setRolesShowShadow(overflows && !atBottom);
                    }}>
                    <div className="bg-[#F5F6F8] rounded-[4px] p-4 mb-2">
                      <p className="text-[13px] text-[#596171] leading-5 tracking-[-0.15px]" style={{ fontFeatureSettings: "'lnum', 'pnum'" }}>
                        To protect your account, users who are recently invited or have recently updated roles may be prevented from performing certain sensitive operations for two to three days.
                      </p>
                    </div>
                    <div ref={step3ContentRef} className="flex flex-col">
                      {allCategories.map((cat) => {
                        const isCatExpanded = expandedCategories.has(cat.name);
                        const selectedCount = cat.roles.filter(r => selectedRoles.has(r.id)).length;
                        const displayName = categoryDisplayNames[cat.name] || cat.name;
                        return (
                          <div key={cat.name}>
                            <button onClick={() => toggleCategory(cat.name)} className="w-full flex items-center gap-2 px-2 py-3 border-b border-[#EBEEF1] text-left hover:bg-[#F5F6F8] transition-colors">
                              <span className="text-[14px] font-semibold text-[#353A44] leading-5 tracking-[-0.15px]">{displayName}</span>
                              <div className="flex-1 flex items-center">
                                {!singleRoleSelect && (
                                  <span className="bg-[#F5F6F8] rounded-full min-w-[16px] px-1 text-[10px] font-semibold text-[#596171] leading-4 text-center">{selectedCount} of {cat.roles.length}</span>
                                )}
                              </div>
                              <ChevronDown size={14} className={`text-[#474E5A] transition-transform duration-200 flex-shrink-0 ${isCatExpanded ? 'rotate-180' : ''}`} />
                            </button>
                            <div className="grid transition-[grid-template-rows] duration-200 ease-in-out" style={{ gridTemplateRows: isCatExpanded ? '1fr' : '0fr' }}>
                              <div className="overflow-hidden">
                                <div className="flex flex-col pb-2">
                                  {cat.roles.map((role, roleIdx) => {
                                    const isSelected = selectedRoles.has(role.id);
                                    return (
                                      <div key={role.id} data-role-id={role.id} onClick={() => toggleRole(role.id)} className={`relative flex items-center gap-3 py-3 pl-4 pr-2 cursor-pointer ${roleIdx > 0 ? 'border-t border-[#EBEEF1]' : ''} before:absolute before:inset-0 before:transition-colors hover:before:bg-[#F5F6F8]`}>
                                        {singleRoleSelect ? (
                                          /* Radio button for single-select */
                                          <div
                                            className={`relative z-10 w-[14px] h-[14px] rounded-full border flex-shrink-0 flex items-center justify-center transition-colors ${isSelected ? 'border-[#675DFF] bg-white shadow-[0_1px_1px_rgba(10,33,86,0.16)]' : 'border-[#D8DEE4] bg-white shadow-[0_1px_1px_rgba(33,37,44,0.16)]'}`}>
                                            {isSelected && <div className="w-[8px] h-[8px] rounded-full bg-[#675DFF]" />}
                                          </div>
                                        ) : (
                                          /* Checkbox for multi-select */
                                          <div
                                            className={`relative z-10 w-[14px] h-[14px] rounded-[4px] border flex-shrink-0 flex items-center justify-center transition-colors ${isSelected ? 'bg-[#675DFF] border-[#675DFF] shadow-[0_1px_1px_rgba(10,33,86,0.16)]' : 'border-[#D8DEE4] bg-white shadow-[0_1px_1px_rgba(33,37,44,0.16)]'}`}>
                                            {isSelected && <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M8.5 2.5L3.75 7.5L1.5 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                                          </div>
                                        )}
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
                      {/* Create custom role option (single-select only) */}
                      {singleRoleSelect && (
                        <button
                          onClick={() => setCreatingRole(true)}
                          className="w-full flex items-center gap-2 px-2 py-3 text-left hover:bg-[#F5F6F8] transition-colors"
                        >
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="flex-shrink-0"><path d="M6 1V11M1 6H11" stroke="#635BFF" strokeWidth="1.5" strokeLinecap="round"/></svg>
                          <span className="text-[14px] font-semibold text-[#635BFF] leading-5 tracking-[-0.15px]">Create or customize role</span>
                        </button>
                      )}
                    </div>
                    </div>
                    {/* Overflow shadow - only when list overflows, fades at bottom */}
                    <div className="absolute bottom-0 left-0 right-0 h-12 pointer-events-none transition-opacity duration-200" style={{ opacity: rolesShowShadow ? 1 : 0, background: 'radial-gradient(ellipse 100% 100% at 50% 100%, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0) 70%)' }} />
                  </div>
                </div>
                <div className={`flex flex-col overflow-hidden transition-[flex,opacity] duration-500 ${showPermissions ? 'flex-1 min-w-0 opacity-100' : 'flex-[0] w-0 opacity-0 pointer-events-none'}`} style={{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }}>
                  <SharedDrawerPermissionsPanel
                    roleIds={Array.from(selectedRoles)}
                    invertColors={true}
                    className="min-h-0 flex flex-col gap-4 p-4 bg-[#F5F6F8] rounded-[8px] overflow-hidden h-full"
                    layoutVersion={layoutVersion}
                    customRoles={customRoles}
                    singleRoleSelect={singleRoleSelect}
                  />
                </div>
              </div>
            </div>
          )}
          {step === 3 && creatingRole && (() => {
            // Pre-populate from currently selected role (if any)
            const selectedId = Array.from(selectedRoles)[0];
            const baseRole = selectedId
              ? allCategories.flatMap(c => c.roles).find(r => r.id === selectedId) || null
              : null;
            let baseInitialState: { roleName: string; customDescription: string; permissionAccess: Record<string, string>; selectedBaseRole?: Role | null } | undefined;
            if (baseRole) {
              const allPerms = getAllPermissions();
              const accessMap: Record<string, string> = {};
              if (baseRole.permissionAccess) {
                Object.assign(accessMap, baseRole.permissionAccess);
              } else if (baseRole.permissionApiNames) {
                baseRole.permissionApiNames.forEach(apiName => {
                  const perm = allPerms.find(p => p.apiName === apiName);
                  accessMap[apiName] = perm?.actions || "read";
                });
              } else {
                getPermissionsForRole(baseRole.id).forEach(p => {
                  const roleAccess = p.roleAccess[baseRole.id];
                  accessMap[p.apiName] = roleAccess || p.actions;
                });
              }
              if (!accessMap["dashboard_baseline"]) accessMap["dashboard_baseline"] = "read";
              baseInitialState = {
                roleName: "",
                customDescription: baseRole.details?.description || "",
                permissionAccess: accessMap,
                selectedBaseRole: baseRole,
              };
            }
            return (
              <CreateRoleContent
                onSave={(newRole) => {
                  setCustomRoles?.(prev => [...prev, newRole]);
                  setSelectedRoles(new Set([newRole.id]));
                  // Expand "Custom" category so the new role is visible
                  setExpandedCategories(new Set(["Custom"]));
                  setCreatingRole(false);
                  // Scroll to the newly created role after DOM updates
                  if (!showPermissions) {
                    setTimeout(() => {
                      const el = step3ModalRef.current?.querySelector(`[data-role-id="${newRole.id}"]`);
                      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }, 350);
                  }
                }}
                onCancel={() => setCreatingRole(false)}
                initialGroupBy="productCategory"
                layoutVersion={layoutVersion}
                showSandbox={false}
                initialState={initialRoleState || baseInitialState}
                mergedCanCannot={mergedCanCannot}
                onTestInSandbox={onTestInSandbox ? (previewRole, modalState) => {
                  onClose();
                  onTestInSandbox(previewRole, modalState);
                } : undefined}
              />
            );
          })()}
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
                    <p className="text-[14px] text-[#353A44] leading-5 tracking-[-0.15px]">{singleRoleSelect ? 'Role' : 'Roles'}</p>
                    <p className="text-[14px] font-semibold text-[#353A44] leading-5 tracking-[-0.15px]" style={{ fontFeatureSettings: "'lnum', 'pnum'" }}>{selectedRoleNames.length > 0 ? selectedRoleNames.join(", ") : singleRoleSelect ? "No role selected" : "No roles selected"}</p>
                  </div>
                  <button onClick={() => setStep(3)} className="w-7 h-7 flex items-center justify-center flex-shrink-0 rounded-md hover:bg-[#EBEEF1] transition-colors">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M0.975001 7.87468C0.991113 7.63299 1.0944 7.40537 1.26568 7.23409L7.43933 1.06043C8.02512 0.474647 8.97487 0.474647 9.56065 1.06043L10.9393 2.43911C11.5251 3.0249 11.5251 3.97465 10.9393 4.56043L4.76568 10.7341C4.5944 10.9054 4.36678 11.0087 4.12509 11.0248L1.03508 11.2308C0.884155 11.2408 0.758938 11.1156 0.769 10.9647L0.975001 7.87468ZM2.3607 9.63906L2.45918 8.16191L6.53031 4.09078L7.90899 5.46946L3.83786 9.54059L2.3607 9.63906ZM8.96965 4.4088L9.87867 3.49977L8.49999 2.12109L7.59097 3.03012L8.96965 4.4088Z" fill="#596171"/></svg>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        {!(step === 3 && creatingRole) && (
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
              : <button onClick={() => { onComplete?.(); handleClose(); }} className="px-4 py-2 text-[14px] font-semibold text-white leading-5 tracking-[-0.15px] bg-[#635BFF] rounded-[6px] hover:bg-[#5851DF] transition-colors shadow-[0_1px_1px_rgba(47,14,99,0.32)]">Send invites</button>
            }
          </div>
        )}
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
  const { showToast } = useToast();
  const searchParams = useSearchParams();

  // --- URL-driven prototype config ---
  // Compact encoding: ?t=team&l=v4&p=abcd
  //   t = tab (team|roles, default roles)
  //   l = layout version (v1-v5, default v3)
  //   p = proto flags string, each char = a non-default flag:
  //       Uppercase = default-ON toggled OFF: A = addMember off, S = singleRole off, R = reduceCounts off, C = compactTabMode off, M = mergedCanCannot off
  //       Lowercase = default-OFF toggled ON: f = 14px font on, w = wireframe on
  const initFromUrl = useCallback(() => {
    const lParam = searchParams.get("l");
    const validLayouts = ["v1", "v2", "v3", "v4", "v5"] as const;
    const layout = validLayouts.includes(lParam as any) ? (lParam as "v1"|"v2"|"v3"|"v4"|"v5") : "v3";
    const flags = searchParams.get("p") || "";
    return {
      layout,
      addMember: !flags.includes("A"),
      font14: flags.includes("f"),
      singleRole: !flags.includes("S"),
      compactTab: !flags.includes("C"),
      reduceCounts: !flags.includes("R"),
      mergedCanCannot: !flags.includes("M"),
      wireframe: flags.includes("w"),
    };
  }, [searchParams]);

  const init = initFromUrl();
  const tabParam = searchParams.get("t") || searchParams.get("tab");
  const [activeTab, setActiveTabState] = useState<"team" | "roles">(tabParam === "team" ? "team" : "roles");
  const [teamSecurityEnabled, setTeamSecurityEnabled] = useState(init.addMember);
  const [use14px, setUse14px] = useState(init.font14);
  const [layoutVersion, setLayoutVersion] = useState<"v1" | "v2" | "v3" | "v4" | "v5">(init.layout);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Custom roles state with localStorage persistence (lifted to page level for sharing with AddMemberModal)
  const [customRoles, setCustomRoles] = useState<Role[]>([]);

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

  const [singleRoleSelect, setSingleRoleSelect] = useState(init.singleRole);
  const [compactTabMode, setCompactTabMode] = useState(init.compactTab);
  const [reduceCounts, setReduceCounts] = useState(init.reduceCounts ?? true);
  const [mergedCanCannot, setMergedCanCannot] = useState(init.mergedCanCannot);
  const [wireframe, setWireframe] = useState(init.wireframe);

  // Sync proto controls to URL (only non-default values, compact encoding)
  const setActiveTab = useCallback((tab: "team" | "roles") => {
    setActiveTabState(tab);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (activeTab === "team") params.set("t", "team");
    if (layoutVersion !== "v4") params.set("l", layoutVersion);
    // Build flags string from non-default booleans
    // Defaults: addMember=on, singleRole=on, compactTab=on, 14px=off
    let flags = "";
    if (!teamSecurityEnabled) flags += "A";
    if (use14px) flags += "f";
    if (!singleRoleSelect) flags += "S";
    if (!compactTabMode) flags += "C";
    if (!reduceCounts) flags += "R";
    if (!mergedCanCannot) flags += "M";
    if (wireframe) flags += "w";
    if (flags) params.set("p", flags);
    const qs = params.toString();
    const newUrl = qs ? `${window.location.pathname}?${qs}` : window.location.pathname;
    window.history.replaceState(null, '', newUrl);
  }, [activeTab, layoutVersion, teamSecurityEnabled, use14px, singleRoleSelect, compactTabMode, reduceCounts, mergedCanCannot, wireframe]);
  
  // Sandbox mode state - lifted to page level for full-screen takeover
  const [sandboxMode, setSandboxMode] = useState<SandboxModeState>({
    active: false,
    role: null,
    unsavedRole: null,
    sourceModal: undefined,
    modalState: undefined
  });

  // Track whether add member modal should return to create role screen after sandbox
  const [addMemberReturnToCreate, setAddMemberReturnToCreate] = useState(false);

  // Reopen add member modal after returning from sandbox
  useEffect(() => {
    if (!sandboxMode.active && sandboxMode.sourceModal === "addMember") {
      setAddMemberReturnToCreate(true);
      setIsModalOpen(true);
    }
  }, [sandboxMode.active, sandboxMode.sourceModal]);

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

  const protoControls: ProtoControlsType = {
    teamSecurityEnabled, onTeamSecurityToggle: setTeamSecurityEnabled,
    use14px, onUse14pxToggle: setUse14px,
    singleRoleSelect, onSingleRoleSelectToggle: setSingleRoleSelect,
    compactTabMode, onCompactTabModeToggle: setCompactTabMode,
    reduceCounts, onReduceCountsToggle: setReduceCounts,
    mergedCanCannot, onMergedCanCannotToggle: setMergedCanCannot,
    wireframe, onWireframeToggle: setWireframe,
    layoutVersion, onLayoutVersionChange: setLayoutVersion,
  };

  return (
    <div className={`h-screen flex bg-white min-w-[1024px] ${use14px ? 'use-14px' : ''}`}>
      {wireframe
        ? <SideNav protoControls={protoControls} />
        : <RealSideNav protoControls={protoControls} />
      }

      <div className={`flex-1 flex flex-col overflow-hidden ${wireframe ? 'px-8 pb-6' : 'px-8 pb-6'}`}>
        {wireframe ? <Topbar /> : <RealHeader />}

        <div className={`flex-1 min-h-0 flex flex-col gap-6 pt-5 max-w-[1400px] mx-auto w-full ${activeTab === "roles" ? 'overflow-hidden' : 'overflow-auto'}`}>
          {/* Header: breadcrumb + title + tabs */}
          <div className="flex flex-col gap-1 shrink-0 w-full">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-[12px] font-semibold text-[#533AFD] leading-4 tracking-[-0.02px]">Organization settings</span>
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none" className="text-[#6C7688]"><path d="M3 2L5 4L3 6" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <h1 className="text-[28px] font-bold text-[#353A44] leading-9 tracking-[0.38px] font-display" style={{ fontFeatureSettings: "'lnum', 'pnum'" }}>Team and security</h1>
            </div>

            {/* Tab bar */}
            <div className="flex items-start gap-6 border-b border-[#D8DEE4] overflow-hidden">
              <button onClick={() => setActiveTab("team")} className={`flex items-center justify-center py-4 cursor-pointer shrink-0 ${activeTab === "team" ? 'border-b-2 border-[#533AFD]' : ''}`}>
                <span className={`text-[14px] font-semibold leading-5 tracking-[-0.15px] whitespace-nowrap ${activeTab === "team" ? 'text-[#533AFD]' : 'text-[#596171] hover:text-[#353A44]'}`}>Team</span>
              </button>
              <button onClick={() => setActiveTab("roles")} className={`flex items-center justify-center py-4 cursor-pointer shrink-0 ${activeTab === "roles" ? 'border-b-2 border-[#533AFD]' : ''}`}>
                <span className={`text-[14px] font-semibold leading-5 tracking-[-0.15px] whitespace-nowrap ${activeTab === "roles" ? 'text-[#533AFD]' : 'text-[#596171] hover:text-[#353A44]'}`}>Roles and permissions</span>
              </button>
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="flex flex-col items-start py-4 w-[61px] shrink-0">
                  <div className="py-1.5 w-full"><div className="h-2 bg-[#EBEEF1] rounded-lg w-full" /></div>
                </div>
              ))}
            </div>
          </div>

          {/* Tab content */}
          {activeTab === "roles" ? (
            <RolesPermissionsContent sandboxMode={sandboxMode} setSandboxMode={setSandboxMode} layoutVersion={layoutVersion} customRoles={customRoles} setCustomRoles={setCustomRoles} compactTabMode={compactTabMode} reduceCounts={reduceCounts} mergedCanCannot={mergedCanCannot} />
          ) : (
            <TeamContent teamSecurityEnabled={teamSecurityEnabled} onAddMember={() => setIsModalOpen(true)} />
          )}
        </div>
      </div>

      <AddMemberModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setAddMemberReturnToCreate(false);
          setSandboxMode(prev => ({ ...prev, sourceModal: undefined, modalState: undefined }));
        }}
        onComplete={() => showToast("Invitations sent successfully")}
        layoutVersion={layoutVersion}
        customRoles={customRoles}
        singleRoleSelect={singleRoleSelect}
        setCustomRoles={setCustomRoles}
        mergedCanCannot={mergedCanCannot}
        initialCreatingRole={addMemberReturnToCreate}
        initialRoleState={addMemberReturnToCreate ? sandboxMode.modalState : undefined}
        onTestInSandbox={(previewRole, modalState) => {
          setIsModalOpen(false);
          setSandboxMode({
            active: true,
            role: previewRole,
            unsavedRole: previewRole,
            sourceModal: "addMember",
            modalState,
          });
        }}
      />
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

