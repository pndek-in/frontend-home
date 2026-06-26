import * as React from "react";
import "./alert.css";

export type AlertTone = "info" | "success" | "warning" | "danger";

export interface AlertProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  tone?: AlertTone;
  title?: React.ReactNode;
  /** Override the default tone icon. */
  icon?: React.ReactNode;
  /** If provided, shows a dismiss button. */
  onClose?: () => void;
}

const ICONS: Record<AlertTone, React.ReactNode> = {
  info: <path d="M12 8h.01M11 12h1v4h1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />,
  success: <path d="M8 12.5l2.5 2.5 5.5-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />,
  warning: <path d="M12 8.5v4M12 16h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />,
  danger: <path d="M12 8v4.5M12 16h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />,
};

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ tone = "info", title, icon, onClose, className = "", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={["jl-alert", `jl-alert--${tone}`, className].filter(Boolean).join(" ")}
        role="status"
        {...props}
      >
        <span className="jl-alert__icon">
          {icon || (
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" opacity="0.35" />
              {ICONS[tone]}
            </svg>
          )}
        </span>
        <div className="jl-alert__body">
          {title && <div className="jl-alert__title">{title}</div>}
          {children && <div className="jl-alert__text">{children}</div>}
        </div>
        {onClose && (
          <button type="button" className="jl-alert__close" aria-label="Dismiss" onClick={onClose}>
            <svg viewBox="0 0 16 16" width="16" height="16" fill="none" aria-hidden="true">
              <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>
    );
  }
);

Alert.displayName = "Alert";

export { Alert };
