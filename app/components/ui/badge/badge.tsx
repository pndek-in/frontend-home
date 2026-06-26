import * as React from "react";
import "./badge.css";

export type BadgeColor =
  | "neutral"
  | "brand"
  | "success"
  | "warning"
  | "danger"
  | "info";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  color?: BadgeColor;
  solid?: boolean;
  pill?: boolean;
  dot?: boolean;
  icon?: React.ReactNode;
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      color = "neutral",
      solid = false,
      pill = false,
      dot = false,
      icon,
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    const cls = [
      "jl-badge",
      `jl-badge--${color}`,
      solid ? "jl-badge--solid" : "",
      pill ? "jl-badge--pill" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <span ref={ref} className={cls} {...props}>
        {dot && <span className="jl-badge__dot" />}
        {icon}
        {children}
      </span>
    );
  }
);

Badge.displayName = "Badge";

export { Badge };
