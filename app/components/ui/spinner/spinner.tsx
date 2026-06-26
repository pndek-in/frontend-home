import * as React from "react";
import "./spinner.css";

export type SpinnerSize = "sm" | "md" | "lg";
export type SpinnerTone = "inherit" | "neutral" | "white";

export interface SpinnerProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: SpinnerSize | number;
  tone?: SpinnerTone;
}

const SIZES: Record<SpinnerSize, number> = { sm: 16, md: 20, lg: 28 };

const Spinner = React.forwardRef<HTMLSpanElement, SpinnerProps>(
  ({ size = "md", tone, className = "", style, ...props }, ref) => {
    const px = typeof size === "number" ? size : SIZES[size] ?? 20;
    const color =
      tone === "inherit"
        ? "currentColor"
        : tone === "neutral"
        ? "var(--neutral-400)"
        : tone === "white"
        ? "#fff"
        : undefined;

    return (
      <span
        ref={ref}
        className={["jl-spinner", className].filter(Boolean).join(" ")}
        role="status"
        aria-label="Loading"
        style={{ color, ...style }}
        {...props}
      >
        <svg width={px} height={px} viewBox="0 0 24 24" fill="none">
          <circle
            className="jl-spinner__track"
            cx="12"
            cy="12"
            r="9"
            stroke="currentColor"
            strokeWidth="2.5"
          />
          <path
            d="M21 12a9 9 0 0 0-9-9"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </span>
    );
  }
);

Spinner.displayName = "Spinner";

export { Spinner };
