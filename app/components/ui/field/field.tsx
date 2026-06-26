import * as React from "react";
import "./field.css";

export interface FieldProps {
  label?: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  required?: boolean;
  optional?: boolean;
  htmlFor?: string;
  className?: string;
  children?: React.ReactNode;
}

export function Field({
  label,
  hint,
  error,
  required = false,
  optional = false,
  htmlFor,
  className = "",
  children,
}: FieldProps) {
  return (
    <div className={["jl-field", className].filter(Boolean).join(" ")}>
      {label && (
        <label className="jl-field__label" htmlFor={htmlFor}>
          {label}
          {required && (
            <span className="jl-field__req" aria-hidden="true">
              *
            </span>
          )}
          {optional && <span className="jl-field__optional">(optional)</span>}
        </label>
      )}
      {children}
      {error ? (
        <div className="jl-field__error" role="alert">
          {error}
        </div>
      ) : (
        hint && <div className="jl-field__hint">{hint}</div>
      )}
    </div>
  );
}
