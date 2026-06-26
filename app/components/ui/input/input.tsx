import * as React from "react";
import "./input.css";

export type InputSize = "sm" | "md" | "lg";

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  size?: InputSize;
  icon?: React.ReactNode;
  trailing?: React.ReactNode;
  invalid?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      size = "md",
      icon,
      trailing,
      invalid = false,
      disabled = false,
      className = "",
      ...props
    },
    ref
  ) => {
    return (
      <div
        className={["jl-input-wrap", `jl-input-wrap--${size}`, className]
          .filter(Boolean)
          .join(" ")}
        data-invalid={invalid || undefined}
        data-disabled={disabled || undefined}
      >
        {icon && <span className="jl-input-adorn">{icon}</span>}
        <input
          ref={ref}
          className="jl-input"
          disabled={disabled}
          aria-invalid={invalid || undefined}
          {...props}
        />
        {trailing && <span className="jl-input-adorn">{trailing}</span>}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
