import * as React from "react";
import "./empty-state.css";

export interface EmptyStateProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  icon?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  size?: "sm" | "md";
  bordered?: boolean;
}

const InboxIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M3 13h5l1.5 3h5L21 13" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5 5h14l2 8v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5Z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export function EmptyState({
  icon,
  title,
  description,
  actions,
  size = "md",
  bordered = false,
  className = "",
  children,
  ...rest
}: EmptyStateProps) {
  const cls = [
    "jl-empty",
    size === "sm" ? "jl-empty--sm" : "",
    bordered ? "jl-empty--bordered" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={cls} {...rest}>
      <span className="jl-empty__media">{icon ?? <InboxIcon />}</span>
      {title && <p className="jl-empty__title">{title}</p>}
      {description && <p className="jl-empty__desc">{description}</p>}
      {children}
      {actions && <div className="jl-empty__actions">{actions}</div>}
    </div>
  );
}
