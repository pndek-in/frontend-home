import * as React from "react";
import "./tooltip.css";

export type TooltipSide = "top" | "bottom" | "left" | "right";

export interface TooltipProps {
  content: React.ReactNode;
  side?: TooltipSide;
  delay?: number;
  className?: string;
  children: React.ReactNode;
}

export function Tooltip({
  content,
  side = "top",
  delay = 120,
  className = "",
  children,
}: TooltipProps) {
  const [show, setShow] = React.useState(false);
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const open = () => {
    timer.current = setTimeout(() => setShow(true), delay);
  };
  const close = () => {
    if (timer.current) clearTimeout(timer.current);
    setShow(false);
  };

  return (
    <span
      className={["jl-tooltip", className].filter(Boolean).join(" ")}
      onMouseEnter={open}
      onMouseLeave={close}
      onFocus={open}
      onBlur={close}
    >
      {children}
      <span
        className="jl-tooltip__pop"
        role="tooltip"
        data-side={side}
        data-show={show || undefined}
      >
        {content}
        <span className="jl-tooltip__arrow" />
      </span>
    </span>
  );
}
