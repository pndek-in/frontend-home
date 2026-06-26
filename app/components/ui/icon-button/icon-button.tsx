import * as React from "react";
import "./icon-button.css";

export type IconButtonVariant = "ghost" | "secondary" | "primary";
export type IconButtonSize = "sm" | "md" | "lg";

export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  round?: boolean;
  /** Required for accessibility — icon buttons have no visible label. */
  "aria-label": string;
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    { variant = "ghost", size = "md", round = false, className = "", children, ...props },
    ref
  ) => {
    const cls = [
      "jl-iconbtn",
      `jl-iconbtn--${variant}`,
      `jl-iconbtn--${size}`,
      round ? "jl-iconbtn--round" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <button ref={ref} className={cls} {...props}>
        {children}
      </button>
    );
  }
);

IconButton.displayName = "IconButton";

export { IconButton };
