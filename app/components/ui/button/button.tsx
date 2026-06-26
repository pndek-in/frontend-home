import * as React from "react";
import "./button.css";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "subtle" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  fullWidth?: boolean;
  as?: "button" | "a";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      icon,
      trailingIcon,
      fullWidth = false,
      as: Tag = "button",
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    const cls = [
      "jl-btn",
      `jl-btn--${variant}`,
      `jl-btn--${size}`,
      fullWidth ? "jl-btn--block" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <Tag ref={ref as React.Ref<any>} className={cls} {...(props as any)}>
        {icon}
        {children != null && <span>{children}</span>}
        {trailingIcon}
      </Tag>
    );
  }
);

Button.displayName = "Button";

export { Button };
