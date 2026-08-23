import React from "react";
import Image from "next/image";

export const CHRONONAV_LOGO_URL =
  "https://res.cloudinary.com/deua2yipj/image/upload/v1758917007/ChronoNav_logo_muon27.png";

interface LogoProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  showText?: boolean;
  subtitle?: string;
  priority?: boolean;
}

const SIZE_MAP = {
  xs: { imgSize: 24, container: "size-6" },
  sm: { imgSize: 32, container: "size-8" },
  md: { imgSize: 40, container: "size-10" },
  lg: { imgSize: 56, container: "size-14" },
  xl: { imgSize: 72, container: "size-18" },
};

/**
 * Official ChronoNav Campus Brand Logo Component
 * High performance, crisp aspect ratio, responsive across Mobile, Tablet, and Desktop.
 */
export function Logo({
  size = "md",
  className = "",
  showText = false,
  subtitle = "UC Main • CCS",
  priority = false,
}: LogoProps) {
  const { imgSize, container } = SIZE_MAP[size] || SIZE_MAP.md;

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <div
        className={`relative ${container} shrink-0 flex items-center justify-center rounded-2xl overflow-hidden transition-transform duration-200`}
      >
        <img
          src={CHRONONAV_LOGO_URL}
          alt="ChronoNav University Logo"
          width={imgSize}
          height={imgSize}
          loading={priority ? "eager" : "lazy"}
          className="w-full h-full object-contain drop-shadow-sm select-none"
        />
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className="text-base font-black tracking-tight text-foreground leading-none">
            CHRONONAV
          </span>
          {subtitle && (
            <span className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase mt-0.5">
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
