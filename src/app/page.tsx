"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, MoreHorizontal, X } from "lucide-react";

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
  insideBundle = false,
}: {
  permission: Permission;
  showTaskCategories?: boolean;
  currentGroup?: string;
  groupBy?: string;
  insideBundle?: boolean;
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
    <div className={`flex-1 min-w-0 flex flex-col ${insideBundle ? "gap-0.5" : "gap-4"}`}>
      {/* Top section: title and description */}
      <div className="flex flex-col gap-0">
        <h4 className={`font-semibold text-[#353A44] ${insideBundle ? "text-[12px] leading-4 tracking-[-0.024px]" : "text-[14px] leading-5 tracking-[-0.15px]"}`}>
          {permission.displayName}
        </h4>
        <p className={`text-[#596171] ${insideBundle ? "text-[12px] leading-4" : "text-[14px] leading-5"}`}>
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
  const [isOpen, setIsOpen] = useState(false);
  const hasValue = value && !showPlaceholder;
  const { label, hasWrite } = hasValue ? getAccessLabel(value) : { label: "Choose", hasWrite: false };

  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (!disabled) setIsOpen(!isOpen);
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

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
            }} 
          />
          <div className="absolute top-full right-0 mt-1 bg-white border border-[#D8DEE4] rounded-[8px] shadow-[0_15px_35px_rgba(48,49,61,0.08),0_5px_15px_rgba(0,0,0,0.12)] z-20 min-w-[100px] p-1 overflow-hidden">
            {accessOptions.map((option) => (
              <button
                key={option.value}
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(option.value);
                  setIsOpen(false);
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
  insideBundle = false,
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
  insideBundle?: boolean;
}) {
  // Default to permission's actions if not provided
  const { label: defaultLabel, hasWrite: defaultHasWrite } = getAccessLabel(permission.actions);
  const finalLabel = accessLabel ?? defaultLabel;
  const finalHasWrite = hasWrite ?? defaultHasWrite;
  
  // Check if permission supports multiple access levels
  const supportsMultipleAccess = permission.actions.toLowerCase().includes("read") && 
                                  permission.actions.toLowerCase().includes("write");
  
  // For available permissions with multiple access options, check if access has been selected
  const needsAccessSelection = !isChecked && supportsMultipleAccess && onPendingAccessChange;
  const hasSelectedAccess = pendingAccess && pendingAccess !== "";
  const isCheckboxDisabled = needsAccessSelection && !hasSelectedAccess;

  // Render access badge or selector
  const renderAccessBadge = () => {
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
        insideBundle={insideBundle}
      />
      {renderAccessBadge()}
    </>
  );

  // Clickable version for modal
  if (showCheckbox && onToggle) {
    return (
      <div
        onClick={() => !checkboxDisabled && onToggle()}
        className={`flex items-start gap-4 p-4 bg-[#F5F6F8] rounded transition-all duration-150 ${
          checkboxDisabled ? 'cursor-default' : 'hover:bg-[#EBEEF1] cursor-pointer'
        } ${isExiting ? 'animate-scale-out' : ''}`}
      >
        {cardContent}
      </div>
    );
  }

  // Static version for main view
  return (
    <div className={`flex items-start gap-4 rounded ${
      insideBundle
        ? "pr-2 py-3"
        : "p-4 bg-[#F5F6F8]"
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
          <span className="text-[14px] font-semibold text-[#353A44] leading-5 tracking-[-0.15px]">Risk Assessment</span>
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
              <div className="flex flex-col gap-3 text-[14px]">
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
          <p className="text-[14px] text-[#353A44] leading-5 tracking-[-0.15px]" style={{ fontFeatureSettings: "'lnum', 'pnum'" }}>
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
  const [isOpen, setIsOpen] = useState(false);
  const selectedLabel = options.find((o) => o.value === value)?.label || options[0]?.label;

  return (
    <div className="relative">
      {/* Trigger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between gap-2 text-[14px] font-semibold leading-5 tracking-[-0.15px] border border-[#D8DEE4] rounded-md px-2 py-1 min-h-[28px] bg-white text-[#353A44] hover:bg-[#F5F6F8] transition-colors shadow-[0_1px_1px_rgba(33,37,44,0.16)]"
        style={{ width }}
      >
        <span>{selectedLabel}</span>
        <ArrowUpDownIcon size={12} />
      </button>

      {/* Dropdown popover */}
      {isOpen && (
        <>
          {/* Backdrop to close dropdown */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)} 
          />
          {/* Popover - with 4px internal padding */}
          <div className="absolute top-full left-0 mt-1 bg-white border border-[#D8DEE4] rounded-[8px] shadow-[0_15px_35px_rgba(48,49,61,0.08),0_5px_15px_rgba(0,0,0,0.12)] z-20 min-w-[168px] p-1 overflow-hidden">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between gap-3 px-2.5 py-1.5 text-[14px] leading-5 tracking-[-0.15px] text-[#353A44] rounded transition-colors ${
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
  { value: "alphabetical", label: "Alphabetical" },
  { value: "productCategory", label: "Product" },
  { value: "taskCategory", label: "Task" },
  { value: "operationType", label: "Operation" },
  { value: "riskLevel", label: "Risk" },
  { value: "sensitivity", label: "Sensitivity" },
];

// When bundled, alphabetical doesn't make sense (no groups to bundle)
const bundledGroupByOptions: { value: GroupByOption; label: string }[] = [
  { value: "productCategory", label: "Product" },
  { value: "taskCategory", label: "Task" },
  { value: "operationType", label: "Operation" },
  { value: "riskLevel", label: "Risk" },
  { value: "sensitivity", label: "Sensitivity" },
];

// When unbundled, all options are available
const unbundledGroupByOptions = groupByOptions;

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
  const [isOpen, setIsOpen] = useState(false);

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
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 rounded-md hover:bg-[#EBEEF1] transition-colors"
      >
        <MoreHorizontal className="w-5 h-5 text-[#474E5A]" />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)} 
          />
          <div className="absolute top-full right-0 mt-1 bg-white border border-[#D8DEE4] rounded-[8px] shadow-[0_5px_15px_rgba(0,0,0,0.12),0_15px_35px_rgba(48,49,61,0.08)] z-20 whitespace-nowrap overflow-hidden">
            <div className="p-1 flex flex-col">
              {menuItems.map((item, index) => (
                <React.Fragment key={item.label}>
                  {item.danger && index > 0 && <div className="h-px bg-[#EBEEF1] my-1" />}
                  <button
                    onClick={() => {
                      item.onClick();
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-[10px] py-[6px] text-[14px] leading-5 tracking-[-0.15px] rounded transition-colors ${
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
                src={`${process.env.NODE_ENV === 'production' ? '/uvp' : ''}/waves.svg`}
                alt="" 
                className="w-full h-full"
              />
            </div>
            
            {/* Content */}
            <div className="relative z-10 flex flex-col gap-4 flex-1 overflow-y-auto">
              {!submittedMessage ? (
                <p className="text-[14px] text-[#353A44] leading-5 tracking-[-0.15px]">
                  Describe how you want to customize this role and I'll add or remove the appropriate permissions.
                </p>
              ) : (
                <>
                  {/* User message */}
                  <div className="flex justify-end">
                    <div className="bg-[#635BFF] text-white rounded-[12px] rounded-br-[4px] px-3 py-2 max-w-[85%]">
                      <p className="text-[14px] leading-5 tracking-[-0.15px]">{submittedMessage}</p>
                    </div>
                  </div>
                  {/* Assistant response */}
                  <div className="flex justify-start">
                    <div className="bg-[#F5F6F8] text-[#353A44] rounded-[12px] rounded-bl-[4px] px-3 py-2 max-w-[85%]">
                      <p className="text-[14px] leading-5 tracking-[-0.15px]">
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
                  className="flex-1 text-[14px] text-[#353A44] leading-5 tracking-[-0.15px] bg-transparent outline-none resize-none placeholder:text-[#818DA0] min-h-[68px] py-1"
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

// Bundle card for the customize modal - includes group-level checkbox
function CustomizeBundleCard({
  groupName,
  description,
  permissions: perms,
  checkState,
  onToggleBundle,
  permissionAccess,
  onTogglePermission,
  onAccessChange,
  defaultExpanded = false,
}: {
  groupName: string;
  description?: string;
  permissions: Permission[];
  checkState: "all" | "none" | "some";
  onToggleBundle: () => void;
  permissionAccess: Record<string, string>;
  onTogglePermission: (apiName: string) => void;
  onAccessChange: (apiName: string, access: string) => void;
  defaultExpanded?: boolean;
}) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const REQUIRED_PERMISSION = "dashboard_baseline";

  return (
    <div className="bg-[#F5F6F8] rounded-[4px] py-4 px-2 shrink-0 flex flex-col gap-2">
      {/* Header */}
      <div className="flex items-center gap-3 px-2">
        <Checkbox
          checked={checkState === "all"}
          indeterminate={checkState === "some"}
          onChange={onToggleBundle}
        />
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex-1 flex items-center gap-4 text-left group min-w-0"
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[14px] font-semibold text-[#353A44] leading-5 tracking-[-0.15px] truncate">
                {groupName}
              </span>
              <span className="inline-flex items-center justify-center min-w-[16px] h-[16px] px-1 bg-white text-[12px] text-[#596171] leading-4 rounded-full text-center">
                {perms.filter(p => p.apiName in permissionAccess).length} of {perms.length}
              </span>
            </div>
            {description && (
              <p className="text-[14px] text-[#596171] leading-5 line-clamp-2 mt-0.5">
                {description}
              </p>
            )}
          </div>
          <ChevronDown
            size={12}
            className={`text-[#474E5A] flex-shrink-0 transition-transform duration-200 ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {/* Expandable permission cards */}
      <div
        className="grid transition-[grid-template-rows] duration-200 ease-in-out"
        style={{ gridTemplateRows: isExpanded ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          <div className="border-t border-[#D8DEE4] mx-2" />
          <div className="flex flex-col divide-y divide-[#D8DEE4] ml-2">
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
                  className={`flex items-start gap-4 pr-2 py-3 transition-all duration-150 ${
                    isRequired ? 'cursor-default' : 'hover:bg-[#EBEEF1]/50 cursor-pointer'
                  }`}
                >
                  <div className="self-center">
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
                  <PermissionCardContent
                    permission={permission}
                    showTaskCategories={false}
                    currentGroup={groupName}
                    groupBy="productCategory"
                    insideBundle
                  />
                  {/* Access badge */}
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
              );
            })}
          </div>
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
  const [isBundled, setIsBundled] = useState(true);
  const [isRiskExpandedModal, setIsRiskExpandedModal] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  // Handle close with fade-out animation
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 150); // Match animation duration
  };

  // Handle bundle toggle with auto-switch logic
  const handleBundleToggle = (on: boolean) => {
    setIsBundled(on);
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
        setPendingAccess({});
        setSearchQuery("");
        setGroupBy("productCategory");
        setIsBundled(true);
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
      setPendingAccess({});
      setSearchQuery("");
      setGroupBy("productCategory");
      setIsBundled(true);
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

  // Bundle checkbox helpers
  const getBundleCheckState = (perms: Permission[]): "all" | "none" | "some" => {
    const checkedCount = perms.filter(p => p.apiName in permissionAccess).length;
    if (checkedCount === 0) return "none";
    if (checkedCount === perms.length) return "all";
    return "some";
  };

  const toggleBundle = (perms: Permission[]) => {
    const state = getBundleCheckState(perms);
    setPermissionAccess(prev => {
      const next = { ...prev };
      if (state === "all") {
        // Uncheck all in this bundle (except required)
        for (const p of perms) {
          if (p.apiName !== REQUIRED_PERMISSION) {
            delete next[p.apiName];
          }
        }
      } else {
        // Check all in this bundle
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
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50"
        style={{ 
          animation: isClosing ? 'fade-out 150ms ease-out forwards' : 'fade-in 150ms ease-out' 
        }}
      />
      
      {/* Modal - full screen with 32px margin */}
      <div 
        className="relative bg-white rounded-[12px] shadow-[0px_15px_35px_0px_rgba(48,49,61,0.08),0px_5px_15px_0px_rgba(0,0,0,0.12)] flex flex-col overflow-hidden m-[32px]" 
        style={{ 
          width: 'calc(100vw - 64px)', 
          height: 'calc(100vh - 64px)',
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
              className="px-3 py-1 text-[14px] font-medium text-[#353A44] leading-5 tracking-[-0.15px] border border-[#D8DEE4] rounded-md hover:bg-[#F5F6F8] transition-colors bg-white shadow-[0px_1px_1px_0px_rgba(33,37,44,0.16)]"
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
                      className="text-[14px] text-[#353A44] leading-5 tracking-[-0.15px] bg-white border border-[#D8DEE4] rounded-[6px] px-2 py-1 outline-none resize-y focus:shadow-[0px_0px_0px_4px_rgba(8,142,249,0.36)] focus:border-[#D8DEE4] transition-shadow"
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
                    <p className="text-[14px] text-[#596171] leading-5 tracking-[-0.15px]">
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
                      <span className="text-[14px] font-semibold text-[#353A44] leading-5 tracking-[-0.15px]">Can</span>
                    </div>
                    <ul className="list-disc pl-6 flex flex-col gap-1.5">
                      {previewDetails.canDo.slice(0, 5).map((item, i) => (
                        <li key={i} className="text-[14px] text-[#353A44] leading-5 tracking-[-0.15px]">{item}</li>
                      ))}
                      {previewDetails.canDo.length > 5 && (
                        <li className="text-[14px] text-[#596171] leading-5 tracking-[-0.15px]">+{previewDetails.canDo.length - 5} more</li>
                      )}
                    </ul>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-[#EBEEF1] my-4" />

                  {/* Cannot section */}
                  <div className="pb-4">
                    <div className="flex items-center gap-2 mb-3">
                      <CancelCircleIcon />
                      <span className="text-[14px] font-semibold text-[#353A44] leading-5 tracking-[-0.15px]">Cannot</span>
                    </div>
                    <ul className="list-disc pl-6 flex flex-col gap-1.5">
                      {previewDetails.cannotDo.slice(0, 5).map((item, i) => (
                        <li key={i} className="text-[14px] text-[#353A44] leading-5 tracking-[-0.15px]">{item}</li>
                      ))}
                      {previewDetails.cannotDo.length > 5 && (
                        <li className="text-[14px] text-[#596171] leading-5 tracking-[-0.15px]">+{previewDetails.cannotDo.length - 5} more</li>
                      )}
                    </ul>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-[#EBEEF1] my-4" />

                  {/* Note */}
                  <p className="text-[13px] text-[#596171] leading-5">
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

              {/* Permissions panel - 2/3 when assistant closed, 1/2 when open */}
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
                      onClick={() => setIsAssistantOpen(true)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[13px] font-medium transition-all duration-200 text-[#353A44] hover:bg-[#F5F6F8] border border-[#D8DEE4] bg-white shadow-[0px_1px_1px_0px_rgba(33,37,44,0.16)] ${
                        isAssistantOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
                      }`}
                    >
                      <SparkleIcon />
                      <span className="leading-5 tracking-[-0.15px]">Assistant</span>
                    </button>
                    <div className="ml-auto">
                      <ToggleSwitch checked={isBundled} onChange={handleBundleToggle} label="Bundle" />
                    </div>
                  </div>

                  {/* Controls row - full width */}
                  <div className="flex items-center gap-2">
                    {/* Group by dropdown */}
                    <Dropdown
                      value={groupBy}
                      onChange={setGroupBy}
                      options={isBundled ? bundledGroupByOptions : unbundledGroupByOptions}
                    />
                    {/* Search field - spans full width */}
                    <div className="flex-1 flex items-center gap-2 border border-[#D8DEE4] rounded-md px-2 py-1 min-h-[28px] bg-white focus-within:border-[#635BFF] transition-colors">
                      <SearchIcon className="text-[#818DA0]" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search"
                        className="flex-1 text-[14px] text-[#353A44] leading-5 tracking-[-0.15px] bg-transparent outline-none placeholder:text-[#818DA0]"
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

                  {/* Unified permission list */}
                  <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                    <div className="flex items-center gap-2.5 py-4">
                      <span className="flex-1 text-[12px] font-semibold text-[#353A44] leading-4 tracking-[-0.024px]">
                        {selectedPermissions.length} of {allPermissions.length} selected
                      </span>
                    </div>
                    <div className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-2">
                      {isBundled ? (
                        /* Bundled view: CustomizeBundleCard for each group */
                        Object.entries(groupedAll).sort(([a], [b]) => a.localeCompare(b)).map(([group, perms]) => (
                          <CustomizeBundleCard
                            key={group}
                            groupName={group}
                            description={GROUP_DESCRIPTIONS[groupBy]?.[group]}
                            permissions={perms}
                            checkState={getBundleCheckState(perms)}
                            onToggleBundle={() => toggleBundle(perms)}
                            permissionAccess={permissionAccess}
                            onTogglePermission={(apiName) => togglePermission(apiName)}
                            onAccessChange={updatePermissionAccess}
                          />
                        ))
                      ) : (
                        /* Unbundled view: flat list with optional section headers */
                        Object.entries(groupedAll).sort(([a], [b]) => a.localeCompare(b)).map(([group, perms]) => (
                          <div key={group || "all"} className={isAlphabetical ? "" : "mb-3"}>
                            {!isAlphabetical && group && (
                              <div className="text-[12px] font-semibold text-[#353A44] leading-4 tracking-[-0.024px] mb-2">
                                {group}
                              </div>
                            )}
                            {perms.map(perm => {
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
                      {filteredAll.length === 0 && (
                        <div className="text-center py-8 text-[#596171] text-[14px] leading-5 tracking-[-0.15px]">
                          No permissions match your search
                        </div>
                      )}
                    </div>
                  </div>
                </div>

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
            className="flex items-center gap-2 px-3 py-1.5 text-[14px] font-medium text-[#353A44] leading-5 tracking-[-0.15px] hover:bg-[#F5F6F8] border border-[#D8DEE4] rounded-md transition-colors bg-white shadow-[0px_1px_1px_0px_rgba(33,37,44,0.16)]"
          >
            <SandboxIcon />
            Test in sandbox
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-1.5 bg-[#675DFF] text-white text-[14px] font-semibold leading-5 tracking-[-0.15px] rounded-md hover:bg-[#5851DB] transition-colors shadow-[0px_1px_1px_0px_rgba(47,14,99,0.32)]"
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
  const [groupBy, setGroupBy] = useState<GroupByOption>(initialGroupBy);
  const [exitingApiName, setExitingApiName] = useState<string | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [isBaseRoleDropdownOpen, setIsBaseRoleDropdownOpen] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

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

  // Reset and initialize when modal opens (or restore from initialState if returning from sandbox)
  useEffect(() => {
    if (isOpen) {
      // If we have initialState (returning from sandbox), use it
      if (initialState) {
        setSelectedBaseRole(initialState.selectedBaseRole || null);
        setRoleName(initialState.roleName);
        setCustomDescription(initialState.customDescription);
        setPermissionAccess(initialState.permissionAccess);
        setPendingAccess({});
        setSearchQuery("");
        setGroupBy(initialGroupBy);
        setIsBaseRoleDropdownOpen(false);
        return;
      }

      setSelectedBaseRole(null);
      setRoleName("");
      setCustomDescription("");
      // Start with just dashboard_baseline
      setPermissionAccess({ [REQUIRED_PERMISSION]: "read" });
      setPendingAccess({});
      setSearchQuery("");
      setGroupBy(initialGroupBy);
      setIsBaseRoleDropdownOpen(false);
      
      // Focus the role name input after a short delay
      setTimeout(() => {
        roleNameInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, initialGroupBy, initialState]);

  // When base role is selected, populate permissions and description
  const handleBaseRoleSelect = (role: Role) => {
    setSelectedBaseRole(role);
    setIsBaseRoleDropdownOpen(false);
    
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
    setPendingAccess({});
    
    // Set description from role details
    if (role.details?.description) {
      setCustomDescription(role.details.description);
    }
  };

  // Handle reset
  const handleReset = () => {
    setSelectedBaseRole(null);
    setRoleName("");
    setCustomDescription("");
    setPermissionAccess({ [REQUIRED_PERMISSION]: "read" });
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

  const togglePermission = (apiName: string) => {
    if (apiName === REQUIRED_PERMISSION) return;
    
    setExitingApiName(apiName);
    
    setTimeout(() => {
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
      setExitingApiName(null);
    }, 200);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/50 ${isClosing ? 'animate-fade-out' : 'animate-fade-in'}`}
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div 
        className="relative bg-white rounded-[12px] shadow-[0px_15px_35px_0px_rgba(48,49,61,0.08),0px_5px_15px_0px_rgba(0,0,0,0.12)] flex flex-col overflow-hidden m-[32px]" 
        style={{ 
          width: 'calc(100vw - 64px)', 
          height: 'calc(100vh - 64px)',
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
              className="px-3 py-1 text-[14px] font-medium text-[#353A44] leading-5 tracking-[-0.15px] border border-[#D8DEE4] rounded-md hover:bg-[#F5F6F8] transition-colors bg-white shadow-[0px_1px_1px_0px_rgba(33,37,44,0.16)]"
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
                  <label className="text-[14px] font-semibold text-[#353A44] leading-5 tracking-[-0.15px]">
                    Start from an existing role
                  </label>
                  <div className="relative">
                    <button
                      onClick={() => setIsBaseRoleDropdownOpen(!isBaseRoleDropdownOpen)}
                      className="w-full flex items-center justify-between gap-2 px-2 py-1.5 text-[14px] leading-5 tracking-[-0.15px] border border-[#D8DEE4] rounded-md bg-white hover:bg-[#F5F6F8] transition-colors shadow-[0px_1px_1px_0px_rgba(33,37,44,0.16)]"
                    >
                      <span className={selectedBaseRole ? "text-[#353A44]" : "text-[#818DA0]"}>
                        {selectedBaseRole ? selectedBaseRole.name : "Choose an option"}
                      </span>
                      <ArrowUpDownIcon size={12} />
                    </button>
                    
                    {isBaseRoleDropdownOpen && (
                      <>
                        <div 
                          className="fixed inset-0 z-10" 
                          onClick={() => setIsBaseRoleDropdownOpen(false)} 
                        />
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#D8DEE4] rounded-[8px] shadow-[0_15px_35px_rgba(48,49,61,0.08),0_5px_15px_rgba(0,0,0,0.12)] z-20 max-h-[300px] overflow-y-auto p-1">
                          {allRoles.map((role) => (
                            <button
                              key={role.id}
                              onClick={() => handleBaseRoleSelect(role)}
                              className={`w-full flex items-center justify-between gap-3 px-2.5 py-1.5 text-[14px] leading-5 tracking-[-0.15px] text-[#353A44] rounded transition-colors ${
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
                    className="w-full px-2 py-1.5 text-[14px] text-[#353A44] leading-5 tracking-[-0.15px] border border-[#D8DEE4] rounded-md bg-white outline-none placeholder:text-[#818DA0] focus:border-[#635BFF] focus:shadow-[0px_0px_0px_4px_rgba(8,142,249,0.36)] transition-shadow"
                  />
                </div>

                {/* Description textarea */}
                <div className="flex flex-col gap-1">
                  <label className="text-[14px] font-semibold text-[#353A44] leading-5 tracking-[-0.15px]">
                    Description
                  </label>
                  <textarea
                    value={customDescription}
                    onChange={(e) => setCustomDescription(e.target.value)}
                    rows={4}
                    className="w-full px-2 py-1.5 text-[14px] text-[#353A44] leading-5 tracking-[-0.15px] border border-[#D8DEE4] rounded-md bg-white outline-none resize-y placeholder:text-[#818DA0] focus:border-[#635BFF] focus:shadow-[0px_0px_0px_4px_rgba(8,142,249,0.36)] transition-shadow"
                  />
                </div>

                {/* Can / Cannot section */}
                <div className="bg-white rounded-lg p-4">
                  {/* Can section */}
                  <div className={previewDetails.canDo.length > 0 ? "pb-4" : ""}>
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircleIcon />
                      <span className="text-[14px] font-semibold text-[#353A44] leading-5 tracking-[-0.15px]">Can</span>
                    </div>
                    {previewDetails.canDo.length > 0 ? (
                      <ul className="list-disc pl-4 flex flex-col gap-1">
                        {previewDetails.canDo.slice(0, 5).map((item, i) => (
                          <li key={i} className="text-[14px] text-[#353A44] leading-5 tracking-[-0.15px] pl-1">{item}</li>
                        ))}
                        {previewDetails.canDo.length > 5 && (
                          <li className="text-[14px] text-[#596171] leading-5 tracking-[-0.15px] pl-1">+{previewDetails.canDo.length - 5} more</li>
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
                          <span className="text-[14px] font-semibold text-[#353A44] leading-5 tracking-[-0.15px]">Cannot</span>
                        </div>
                        <ul className="list-disc pl-4 flex flex-col gap-1">
                          {previewDetails.cannotDo.slice(0, 5).map((item, i) => (
                            <li key={i} className="text-[14px] text-[#353A44] leading-5 tracking-[-0.15px] pl-1">{item}</li>
                          ))}
                          {previewDetails.cannotDo.length > 5 && (
                            <li className="text-[14px] text-[#596171] leading-5 tracking-[-0.15px] pl-1">+{previewDetails.cannotDo.length - 5} more</li>
                          )}
                        </ul>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Permissions panel - 2/3 when assistant closed, 1/2 when open */}
              <div 
                className={`${isAssistantOpen ? 'flex-1' : 'flex-[2]'} bg-white rounded-lg shadow-[0px_7px_14px_0px_rgba(48,49,61,0.08),0px_3px_6px_0px_rgba(0,0,0,0.12)] p-4 flex flex-col gap-4 overflow-hidden min-w-0`}
                style={{ transition: 'flex 400ms cubic-bezier(0.4, 0, 0.2, 1)' }}
              >
                  {/* Permissions header */}
                  <div className="flex items-center gap-2">
                    <span className="flex-1 text-[16px] font-bold text-[#353A44] leading-6 tracking-[-0.31px]" style={{ fontFeatureSettings: "'lnum', 'pnum'" }}>
                      Permissions
                    </span>
                    {/* AI Assistant toggle button - invisible (not removed) when assistant is open to prevent layout shift */}
                    <button
                      onClick={() => setIsAssistantOpen(true)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[13px] font-medium transition-all duration-200 text-[#353A44] hover:bg-[#F5F6F8] border border-[#D8DEE4] bg-white shadow-[0px_1px_1px_0px_rgba(33,37,44,0.16)] ${
                        isAssistantOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
                      }`}
                    >
                      <SparkleIcon />
                      <span className="leading-5 tracking-[-0.15px]">Assistant</span>
                    </button>
                  </div>

                  {/* Controls row - full width */}
                  <div className="flex items-center gap-2">
                    <Dropdown
                      value={groupBy}
                      onChange={setGroupBy}
                      options={groupByOptions}
                    />
                    {/* Search field - spans full width */}
                    <div className="flex-1 flex items-center gap-2 border border-[#D8DEE4] rounded-md px-2 py-1 min-h-[28px] bg-white focus-within:border-[#635BFF] transition-colors">
                      <SearchIcon className="text-[#818DA0]" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search"
                        className="flex-1 text-[14px] text-[#353A44] leading-5 tracking-[-0.15px] bg-transparent outline-none placeholder:text-[#818DA0]"
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

                  {/* Two-column permission lists */}
                  <div className="flex-1 flex gap-4 min-h-0 overflow-hidden">
                    {/* Current permissions */}
                    <div className="flex-1 flex flex-col gap-2 overflow-hidden min-w-0">
                      <div className="flex items-center gap-2.5">
                        <span className="flex-1 text-[14px] font-semibold text-[#353A44] leading-5 tracking-[-0.15px]">Current</span>
                        <span className="bg-[#F5F6F8] text-[12px] text-[#596171] leading-4 min-w-[16px] px-1 rounded-full text-center">
                          <AnimatedNumber value={selectedPermissions.length} />
                        </span>
                      </div>
                      <div className="flex-1 overflow-y-auto">
                        {Object.entries(groupedSelected).sort(([a], [b]) => a.localeCompare(b)).map(([group, perms]) => (
                          <div key={group || "all"} className={isAlphabetical ? "" : "mb-3"}>
                            {!isAlphabetical && group && (
                              <div className="text-[12px] font-semibold text-[#353A44] leading-4 tracking-[-0.024px] mb-2">
                                {group}
                              </div>
                            )}
                            {perms.map(perm => (
                              <div key={perm.apiName} className="mb-2">
                                <PermissionCard
                                  permission={perm}
                                  showCheckbox
                                  isChecked={true}
                                  onToggle={() => !exitingApiName && togglePermission(perm.apiName)}
                                  currentGroup={group}
                                  groupBy={groupBy}
                                  disabled={perm.apiName === REQUIRED_PERMISSION}
                                  isExiting={exitingApiName === perm.apiName}
                                  currentAccess={permissionAccess[perm.apiName]}
                                  onAccessChange={(access) => updatePermissionAccess(perm.apiName, access)}
                                />
                              </div>
                            ))}
                          </div>
                        ))}
                        {filteredSelected.length === 0 && (
                          <div className="text-center py-8 text-[#596171] text-[14px] leading-5 tracking-[-0.15px]">
                            No permissions selected
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Available permissions - collapses when assistant is open */}
                    <div 
                      className={`flex flex-col gap-2 overflow-hidden ${
                        isAssistantOpen ? 'w-0 opacity-0 min-w-0' : 'flex-1 opacity-100 min-w-0'
                      }`}
                      style={{ transition: 'width 400ms cubic-bezier(0.4, 0, 0.2, 1), opacity 300ms cubic-bezier(0.4, 0, 0.2, 1)' }}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="flex-1 text-[14px] font-semibold text-[#353A44] leading-5 tracking-[-0.15px]">Available</span>
                        <span className="bg-[#F5F6F8] text-[12px] text-[#596171] leading-4 min-w-[16px] px-1 rounded-full text-center">
                          <AnimatedNumber value={availablePermissions.length} />
                        </span>
                      </div>
                      <div className="flex-1 overflow-y-auto">
                        {Object.entries(groupedAvailable).sort(([a], [b]) => a.localeCompare(b)).map(([group, perms]) => (
                          <div key={group || "all"} className={isAlphabetical ? "" : "mb-3"}>
                            {!isAlphabetical && group && (
                              <div className="text-[12px] font-semibold text-[#353A44] leading-4 tracking-[-0.024px] mb-2">
                                {group}
                              </div>
                            )}
                            {perms.map(perm => (
                              <div key={perm.apiName} className="mb-2">
                                <PermissionCard
                                  permission={perm}
                                  showCheckbox
                                  isChecked={false}
                                  onToggle={() => !exitingApiName && togglePermission(perm.apiName)}
                                  currentGroup={group}
                                  groupBy={groupBy}
                                  isExiting={exitingApiName === perm.apiName}
                                  pendingAccess={pendingAccess[perm.apiName]}
                                  onPendingAccessChange={(access) => updatePendingAccess(perm.apiName, access)}
                                />
                              </div>
                            ))}
                          </div>
                        ))}
                        {filteredAvailable.length === 0 && (
                          <div className="text-center py-8 text-[#596171] text-[14px] leading-5 tracking-[-0.15px]">
                            All permissions selected
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

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
            className="flex items-center gap-2 px-3 py-1.5 text-[14px] font-medium text-[#353A44] leading-5 tracking-[-0.15px] hover:bg-[#F5F6F8] border border-[#D8DEE4] rounded-md transition-colors bg-white shadow-[0px_1px_1px_0px_rgba(33,37,44,0.16)]"
          >
            <SandboxIcon />
            Test in sandbox
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-1.5 bg-[#675DFF] text-white text-[14px] font-semibold leading-5 tracking-[-0.15px] rounded-md hover:bg-[#5851DB] transition-colors shadow-[0px_1px_1px_0px_rgba(47,14,99,0.32)]"
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
function SideNav() {
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

      {/* Bottom nav item */}
      <NavItem />
    </aside>
  );
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
        <span className="text-white text-[14px] font-semibold leading-5 tracking-[-0.15px]">
          Sandbox
        </span>
        <div className="flex-1 flex justify-center">
          <span className="text-white text-[14px] leading-5 tracking-[-0.15px]">
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
            <span className="text-[14px] font-semibold text-[#353A44] leading-5 tracking-[-0.15px]">
              Test roles and permissions
            </span>
          </div>

          {/* Content */}
          <div className="px-3 pb-4 flex flex-col gap-2">
            {/* Role Selector */}
            <div className="relative">
              <button
                onClick={() => setIsRoleSelectorOpen(!isRoleSelectorOpen)}
                className="w-full flex items-center justify-between px-2 py-1.5 text-[14px] text-[#353A44] leading-5 tracking-[-0.15px] border border-[#D8DEE4] rounded-md bg-white hover:bg-[#F5F6F8] transition-colors shadow-[0px_1px_1px_0px_rgba(33,37,44,0.16)]"
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
                          className="flex-1 text-[14px] text-[#353A44] leading-5 tracking-[-0.15px] outline-none placeholder:text-[#818DA0] bg-transparent"
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
                            className={`w-full flex items-center justify-between gap-3 px-2.5 py-1.5 text-[14px] leading-5 tracking-[-0.15px] text-[#353A44] rounded-[6px] transition-colors ${
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
                              className={`w-full flex items-center justify-between gap-3 px-2.5 py-1.5 text-[14px] leading-5 tracking-[-0.15px] text-[#353A44] rounded-[6px] transition-colors ${
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
                              className={`w-full flex items-center justify-between gap-3 px-2.5 py-1.5 text-[14px] leading-5 tracking-[-0.15px] text-[#353A44] rounded-[6px] transition-colors ${
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
                        <div className="p-4 text-center text-[14px] text-[#596171]">
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
              className="w-full py-1.5 px-3 text-[14px] font-medium text-white leading-5 tracking-[-0.15px] bg-[#635BFF] hover:bg-[#5851DB] rounded-md transition-colors shadow-[0px_1px_1px_0px_rgba(47,14,99,0.32)]"
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

// BundleCard component: collapsible card wrapping a group of permissions
function BundleCard({
  groupName,
  description,
  permissions: perms,
  roleId,
  groupBy,
  customAccess,
  defaultExpanded = false,
}: {
  groupName: string;
  description?: string;
  permissions: Permission[];
  roleId: string;
  groupBy: string;
  customAccess?: Record<string, string>;
  defaultExpanded?: boolean;
}) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="bg-[#F5F6F8] rounded-[4px] py-4 px-2 shrink-0 flex flex-col gap-2">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center gap-4 px-2 text-left group"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[14px] font-semibold text-[#353A44] leading-5 tracking-[-0.15px] truncate">
              {groupName}
            </span>
            <span className="inline-flex items-center justify-center min-w-[16px] h-[16px] px-1 bg-white text-[12px] text-[#596171] leading-4 rounded-full text-center">
              {perms.length}
            </span>
          </div>
          {description && (
            <p className="text-[14px] text-[#596171] leading-5 line-clamp-2 mt-0.5">
              {description}
            </p>
          )}
        </div>
        {/* Chevron */}
        <ChevronDown
          size={12}
          className={`text-[#474E5A] flex-shrink-0 transition-transform duration-200 ${
            isExpanded ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Expandable permission cards */}
      <div
        className="grid transition-[grid-template-rows] duration-200 ease-in-out"
        style={{ gridTemplateRows: isExpanded ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          <div className="border-t border-[#D8DEE4] mx-2" />
          <div className="flex flex-col divide-y divide-[#D8DEE4] ml-2">
            {perms.map((permission) => (
              <PermissionItem
                key={permission.apiName}
                permission={permission}
                roleId={roleId}
                showTaskCategories={false}
                currentGroup={groupName}
                groupBy={groupBy}
                customAccess={customAccess?.[permission.apiName]}
                insideBundle
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RolesPermissionsPage() {
  const [selectedRole, setSelectedRole] = useState<Role>(allRoles[0]);
  // Only one category can be expanded at a time (accordion behavior)
  const [expandedCategory, setExpandedCategory] = useState<string | null>(roleCategories[0]?.name || null);
  const [groupBy, setGroupBy] = useState<GroupByOption>("productCategory");
  const [isBundled, setIsBundled] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const roleDetailsRef = useRef<HTMLElement>(null);
  const [isRiskExpanded, setIsRiskExpanded] = useState(false);
  
  // Custom roles state with localStorage persistence
  const [customRoles, setCustomRoles] = useState<Role[]>([]);
  const [isCustomizeModalOpen, setIsCustomizeModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  
  // Sandbox mode state - tracks source modal to return to and original unsaved role
  const [sandboxMode, setSandboxMode] = useState<{ 
    active: boolean; 
    role: Role | null;
    unsavedRole?: Role | null; // Original unsaved role for comparison
    sourceModal?: "customize" | "create" | "menu";
    // Preserve modal state when going to sandbox so changes aren't lost
    modalState?: {
      roleName: string;
      customDescription: string;
      permissionAccess: Record<string, string>;
      selectedBaseRole?: Role | null; // For create modal
    };
  }>({
    active: false,
    role: null,
    unsavedRole: null,
    sourceModal: undefined,
    modalState: undefined
  });

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
  
  // Generate risk assessment for the current role
  const riskAssessment = generateRiskAssessment(rolePermissions);
  
  // Filter permissions by search query
  const filteredPermissions = searchQuery
    ? rolePermissions.filter(
        (p) =>
          p.apiName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.productCategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.taskCategories.some(tc => tc.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : rolePermissions;
  
  const groupedPermissions = groupBy !== "alphabetical" 
    ? groupPermissions(filteredPermissions, groupBy)
    : null;
  
  const alphabeticalPermissions = groupBy === "alphabetical"
    ? [...filteredPermissions].sort((a, b) => a.apiName.localeCompare(b.apiName))
    : null;

  // Render sandbox view if active
  if (sandboxMode.active && sandboxMode.role) {
    return (
      <SandboxView
        role={sandboxMode.role}
        allRoles={combinedAllRoles}
        unsavedRole={sandboxMode.unsavedRole}
        onRoleChange={(role) => setSandboxMode({ ...sandboxMode, role })}
        onExit={() => {
          const sourceModal = sandboxMode.sourceModal;
          const modalState = sandboxMode.modalState;
          
          // Keep sourceModal and modalState so the modal can restore its state
          setSandboxMode({ 
            active: false, 
            role: null, 
            unsavedRole: null, 
            sourceModal: sourceModal, // Keep this so modal knows to use initialState
            modalState: modalState // Preserve modal state for restoration
          });
          
          // Return to the modal they came from
          if (sourceModal === "customize") {
            setIsCustomizeModalOpen(true);
          } else if (sourceModal === "create") {
            setIsCreateModalOpen(true);
          }
          // If sourceModal is "menu" or undefined, just return to the main view
        }}
      />
    );
  }

  return (
    <div className="h-screen flex bg-white">
      {/* Side Navigation - full height */}
      <SideNav />

      {/* Right side: Topbar + Content */}
      <div className="flex-1 flex flex-col gap-5 px-8 pb-8 overflow-hidden">
        {/* Global Top Bar */}
        <Topbar />

        {/* Main Content Area */}
        <div className="flex-1 min-h-0 flex flex-col gap-8 overflow-hidden">
        {/* Header */}
        <header className="flex-shrink-0 max-w-[1600px]">
          <div className="flex flex-col gap-2">
            {/* Title row */}
            <div className="flex items-center gap-2">
              <h1 className="flex-1 text-[28px] font-bold text-[#353A44] leading-9 tracking-[0.38px] font-display" style={{ fontFeatureSettings: "'lnum', 'pnum'" }}>
                Roles and permissions
              </h1>
              <button 
                onClick={() => setIsCreateModalOpen(true)}
                className="px-3 py-1.5 bg-[#635BFF] text-white text-sm font-semibold rounded-md hover:bg-[#5851DB] transition-colors shadow-[0_1px_1px_rgba(47,14,99,0.32)]"
              >
                Add role
              </button>
            </div>
            {/* Wireframe description placeholder */}
            <div className="flex flex-col gap-2.5 py-1.5 w-[640px]">
              <div className="h-2 bg-[#EBEEF1] rounded-lg w-full"></div>
              <div className="h-2 bg-[#EBEEF1] rounded-lg w-full"></div>
            </div>
          </div>
        </header>

        {/* Main content - 3 panels */}
        <div className="flex flex-1 min-h-0 gap-6 overflow-hidden max-w-[1600px]">
        {/* Left Panel - Roles List */}
        <aside className="w-[240px] overflow-y-auto flex-shrink-0 pt-6 relative">
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
                    padding: isExpanded ? '16px 0' : '4px 0',
                    transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
                  }}
                >
                  {/* Category header */}
                  <button
                    onClick={() => toggleCategory(category.name)}
                    className="w-full flex items-center gap-2 px-2 py-1 rounded-md hover:bg-[#F5F6F8] transition-colors"
                  >
                    <span className="flex-1 text-left text-[14px] font-semibold text-[#353A44] leading-5 tracking-[-0.15px]">
                      {category.name}
                    </span>
                    <span className="text-[12px] text-[#596171] leading-4 min-w-[16px] px-1 text-center">
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
                            className={`w-full text-left px-2 py-1 text-[14px] leading-5 tracking-[-0.15px] rounded-md transition-[background-color] duration-150 ${
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
        <div className="flex-1 min-h-0 flex gap-4 p-2 bg-[#F5F6F8] rounded-xl overflow-hidden">
          {/* Role Details Panel */}
          <section ref={roleDetailsRef} className="flex-1 flex flex-col gap-6 px-4 pt-[11px] pb-[13px] overflow-y-auto">
            {/* Header */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <h2 className="text-[20px] font-bold text-[#353A44] leading-7 tracking-[0.3px] font-display" style={{ fontFeatureSettings: "'lnum', 'pnum'" }}>
                  {selectedRole.name}
                </h2>
                <Tooltip content={`There are ${selectedRole.userCount} users with the ${selectedRole.name} role`}>
                  <span className="bg-white text-[12px] text-[#596171] leading-4 min-w-[16px] px-1 rounded-full text-center cursor-default">
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
                <p className="text-[14px] text-[#596171] leading-5 tracking-[-0.15px]">
                  {selectedRole.details.description}
                </p>
              )}
            </div>

            {/* Can, Cannot - combined container */}
            <div className="bg-white rounded-lg p-4 flex flex-col">
              {/* Can section */}
              <div className="pb-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircleIcon />
                  <span className="text-[14px] font-semibold text-[#353A44] leading-5 tracking-[-0.15px]">Can</span>
                </div>
                {selectedRole.details?.canDo && selectedRole.details.canDo.length > 0 ? (
                  <ul className="list-disc pl-4 flex flex-col gap-1">
                    {selectedRole.details.canDo.map((item, index) => (
                      <li key={index} className="text-[14px] text-[#353A44] leading-5 tracking-[-0.15px] pl-1">{item}</li>
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
                  <span className="text-[14px] font-semibold text-[#353A44] leading-5 tracking-[-0.15px]">Cannot</span>
                </div>
                {selectedRole.details?.cannotDo && selectedRole.details.cannotDo.length > 0 ? (
                  <ul className="list-disc pl-4 flex flex-col gap-1">
                    {selectedRole.details.cannotDo.map((item, index) => (
                      <li key={index} className="text-[14px] text-[#353A44] leading-5 tracking-[-0.15px] pl-1">{item}</li>
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
            <div className="p-4 bg-white rounded-lg">
              <RiskAssessmentCard 
                assessment={riskAssessment} 
                isExpanded={isRiskExpanded}
                onToggle={() => setIsRiskExpanded(!isRiskExpanded)}
              />
            </div>
          </section>

          {/* Permissions Panel */}
          <main className="flex-1 min-h-0 flex flex-col gap-4 p-4 bg-white rounded-lg shadow-[0_2px_5px_0_rgba(48,49,61,0.08),0_1px_1px_0_rgba(0,0,0,0.12)] overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-2">
              <h2 className="text-[16px] font-bold text-[#353A44] leading-6 tracking-[-0.31px]" style={{ fontFeatureSettings: "'lnum', 'pnum'" }}>Permissions</h2>
              <span className="bg-[#F5F6F8] text-[12px] text-[#596171] leading-4 min-w-[16px] px-1 rounded-full text-center">
                {searchQuery ? `${filteredPermissions.length}/${rolePermissions.length}` : rolePermissions.length}
              </span>
              <div className="flex-1" />
              <ToggleSwitch
                checked={isBundled}
                onChange={(v) => {
                  setIsBundled(v);
                  // When turning bundle ON and currently on alphabetical, auto-switch to productCategory
                  if (v && groupBy === "alphabetical") {
                    setGroupBy("productCategory");
                  }
                }}
                label="Bundle"
              />
            </div>

            {/* Controls */}
            <div className="flex items-end gap-2">
              {/* Group by selector */}
              <Dropdown
                value={groupBy}
                onChange={setGroupBy}
                options={isBundled ? bundledGroupByOptions : unbundledGroupByOptions}
              />
              {/* Search field */}
              <div className="flex-1 flex items-center gap-2 border border-[#D8DEE4] rounded-md px-2 py-1 min-h-[28px] bg-white focus-within:border-[#635BFF] transition-colors">
                <SearchIcon className="text-[#818DA0]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search"
                  className="flex-1 text-[14px] text-[#353A44] leading-5 tracking-[-0.15px] bg-transparent outline-none placeholder:text-[#818DA0]"
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
            <div className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-2">
              {/* Bundled view: collapsible BundleCards */}
              {isBundled && groupedPermissions && Object.entries(groupedPermissions)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([groupName, perms]) => (
                  <BundleCard
                    key={groupName}
                    groupName={groupName}
                    description={GROUP_DESCRIPTIONS[groupBy]?.[groupName]}
                    permissions={perms}
                    roleId={selectedRole.id}
                    groupBy={groupBy}
                    customAccess={selectedRole.permissionAccess}
                  />
                ))}

              {/* Unbundled: Alphabetical (flat list) - show task categories as tags */}
              {!isBundled && alphabeticalPermissions && (
                <div className="flex flex-col gap-2">
                  {alphabeticalPermissions.map((permission) => (
                    <PermissionItem
                      key={permission.apiName}
                      permission={permission}
                      roleId={selectedRole.id}
                      showTaskCategories={true}
                      customAccess={selectedRole.permissionAccess?.[permission.apiName]}
                    />
                  ))}
                </div>
              )}

              {/* Unbundled: Grouped list with section headers */}
              {!isBundled && groupedPermissions && Object.entries(groupedPermissions)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([groupName, perms]) => (
                  <div key={groupName} className="flex flex-col gap-2">
                    <h3 className="text-[12px] font-semibold text-[#353A44] leading-4 tracking-[-0.024px]">
                      {groupName}
                    </h3>
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
                      className="mt-2 text-[14px] text-[#635BFF] hover:underline"
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
    </div>
  );
}

function PermissionItem({
  permission,
  roleId,
  showTaskCategories = false,
  currentGroup,
  groupBy,
  customAccess,
  insideBundle = false,
}: {
  permission: Permission;
  roleId: string;
  showTaskCategories?: boolean;
  currentGroup?: string;
  groupBy?: string;
  customAccess?: string;  // For custom roles - the user-set access level
  insideBundle?: boolean;
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
      accessLabel={accessLabel}
      hasWrite={hasWrite}
      insideBundle={insideBundle}
    />
  );
}
