import * as React from "react";
import "./popover.css";

export type PopoverSide = "bottom" | "top";
export type PopoverAlign = "start" | "center" | "end";

export interface PopoverProps {
  trigger: React.ReactElement;
  side?: PopoverSide;
  align?: PopoverAlign;
  arrow?: boolean;
  padded?: boolean;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  children?: React.ReactNode | ((api: { close: () => void }) => React.ReactNode);
}

export function Popover({
  trigger,
  side = "bottom",
  align = "center",
  arrow = true,
  padded = true,
  defaultOpen = false,
  open: controlledOpen,
  onOpenChange,
  className = "",
  children,
}: PopoverProps) {
  const isControlled = controlledOpen != null;
  const [uncontrolled, setUncontrolled] = React.useState(defaultOpen);
  const open = isControlled ? controlledOpen : uncontrolled;
  const ref = React.useRef<HTMLSpanElement>(null);

  const setOpen = React.useCallback(
    (v: boolean) => {
      if (!isControlled) setUncontrolled(v);
      if (onOpenChange) onOpenChange(v);
    },
    [isControlled, onOpenChange]
  );

  React.useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, setOpen]);

  const triggerEl = React.isValidElement(trigger)
    ? React.cloneElement(trigger as React.ReactElement<any>, {
        onClick: (e: React.MouseEvent) => {
          (trigger.props as any).onClick?.(e);
          setOpen(!open);
        },
        "aria-haspopup": "dialog",
        "aria-expanded": open,
      })
    : trigger;

  const origin = `${side === "top" ? "bottom" : "top"} ${align}`;

  return (
    <span className={["jl-popover", className].filter(Boolean).join(" ")} ref={ref}>
      {triggerEl}
      {open && (
        <div
          className="jl-popover__pop"
          role="dialog"
          data-side={side}
          data-align={align}
          style={
            {
              "--_origin": origin,
              "--_pad": padded ? undefined : "0",
            } as React.CSSProperties
          }
        >
          {arrow && <span className="jl-popover__arrow" aria-hidden="true" />}
          {typeof children === "function"
            ? children({ close: () => setOpen(false) })
            : children}
        </div>
      )}
    </span>
  );
}
