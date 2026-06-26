import * as React from "react";
import "./select.css";

export type SelectOption = string | { value: string; label: string };
export type SelectSize = "sm" | "md" | "lg";

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  size?: SelectSize;
  options?: SelectOption[];
  placeholder?: string;
}

const Chevron = () => (
  <svg viewBox="0 0 16 16" width="16" height="16" fill="none" aria-hidden="true">
    <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ size = "md", options = [], placeholder, value, className = "", children, ...props }, ref) => {
    const isPlaceholder = placeholder != null && (value === "" || value == null);
    return (
      <span className="jl-select-wrap">
        <select
          ref={ref}
          className={["jl-select", `jl-select--${size}`, className].filter(Boolean).join(" ")}
          data-placeholder={isPlaceholder || undefined}
          value={value}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((o) => {
            const opt = typeof o === "string" ? { value: o, label: o } : o;
            return (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            );
          })}
          {children}
        </select>
        <span className="jl-select-chevron">
          <Chevron />
        </span>
      </span>
    );
  }
);

Select.displayName = "Select";

export { Select };
