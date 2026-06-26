import * as React from "react";
import "./drawer.css";

export type DrawerSide = "right" | "left" | "bottom";

export interface DrawerProps {
  open: boolean;
  onClose?: () => void;
  side?: DrawerSide;
  size?: number | string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  footer?: React.ReactNode;
  showClose?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export function Drawer({
  open,
  onClose,
  side = "right",
  size,
  title,
  description,
  footer,
  showClose = true,
  className = "",
  children,
}: DrawerProps) {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && onClose) onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;
  const sizeVar = size != null ? (typeof size === "number" ? `${size}px` : size) : undefined;

  return (
    <div
      className="jl-drawer__overlay"
      data-side={side}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && onClose) onClose();
      }}
    >
      <div
        className={["jl-drawer", className].filter(Boolean).join(" ")}
        role="dialog"
        aria-modal="true"
        style={{ "--_size": sizeVar } as React.CSSProperties}
      >
        {(title || showClose) && (
          <div className="jl-drawer__header">
            <div className="jl-drawer__header-text">
              {title && <div className="jl-drawer__title">{title}</div>}
              {description && <div className="jl-drawer__desc">{description}</div>}
            </div>
            {showClose && (
              <button type="button" className="jl-drawer__close" aria-label="Close" onClick={onClose}>
                <svg viewBox="0 0 18 18" width="18" height="18" fill="none" aria-hidden="true">
                  <path d="M5 5l8 8M13 5l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </button>
            )}
          </div>
        )}
        {children && <div className="jl-drawer__body">{children}</div>}
        {footer && <div className="jl-drawer__footer">{footer}</div>}
      </div>
    </div>
  );
}
