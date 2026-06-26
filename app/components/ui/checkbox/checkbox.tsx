import * as React from "react";
import "./checkbox.css";

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: React.ReactNode;
  description?: React.ReactNode;
  indeterminate?: boolean;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, indeterminate = false, disabled = false, className = "", ...props }, ref) => {
    const innerRef = React.useRef<HTMLInputElement>(null);
    React.useImperativeHandle(ref, () => innerRef.current as HTMLInputElement);
    React.useEffect(() => {
      if (innerRef.current) innerRef.current.indeterminate = indeterminate;
    }, [indeterminate]);

    return (
      <label
        className={["jl-check", className].filter(Boolean).join(" ")}
        data-disabled={disabled || undefined}
      >
        <input
          ref={innerRef}
          type="checkbox"
          className="jl-check__input"
          disabled={disabled}
          {...props}
        />
        <span className="jl-check__box">
          <svg className="jl-check__mark" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path
              d="M2.5 6.2l2.2 2.3 4.8-5"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="jl-check__dash" aria-hidden="true" />
        </span>
        {(label || description) && (
          <span className="jl-check__body">
            {label && <span className="jl-check__label">{label}</span>}
            {description && <span className="jl-check__desc">{description}</span>}
          </span>
        )}
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";

export { Checkbox };
