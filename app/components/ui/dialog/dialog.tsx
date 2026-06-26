import * as React from "react";
import "./dialog.css";

export interface DialogProps {
  open: boolean;
  onClose?: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  footer?: React.ReactNode;
  showClose?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export function Dialog({
  open,
  onClose,
  title,
  description,
  size = "md",
  footer,
  showClose = true,
  className = "",
  children,
}: DialogProps) {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="jl-dialog__overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div
        className={["jl-dialog", `jl-dialog--${size}`, className].filter(Boolean).join(" ")}
        role="dialog"
        aria-modal="true"
      >
        {(title || showClose) && (
          <div className="jl-dialog__header">
            <div className="jl-dialog__header-text">
              {title && <div className="jl-dialog__title">{title}</div>}
              {description && <div className="jl-dialog__desc">{description}</div>}
            </div>
            {showClose && (
              <button type="button" className="jl-dialog__close" aria-label="Close" onClick={onClose}>
                <svg viewBox="0 0 18 18" width="18" height="18" fill="none" aria-hidden="true">
                  <path d="M5 5l8 8M13 5l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </button>
            )}
          </div>
        )}
        {children && <div className="jl-dialog__body">{children}</div>}
        {footer && <div className="jl-dialog__footer">{footer}</div>}
      </div>
    </div>
  );
}
