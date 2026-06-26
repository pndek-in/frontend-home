import * as React from "react";
import "./switch.css";

export type SwitchSize = "sm" | "md";

export interface SwitchProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  label?: React.ReactNode;
  size?: SwitchSize;
}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ label, size = "md", disabled = false, className = "", ...props }, ref) => {
    return (
      <label
        className={["jl-switch", `jl-switch--${size}`, className].filter(Boolean).join(" ")}
        data-disabled={disabled || undefined}
      >
        <input
          ref={ref}
          type="checkbox"
          role="switch"
          className="jl-switch__input"
          disabled={disabled}
          {...props}
        />
        <span className="jl-switch__track">
          <span className="jl-switch__thumb" />
        </span>
        {label && <span className="jl-switch__label">{label}</span>}
      </label>
    );
  }
);

Switch.displayName = "Switch";

export { Switch };
