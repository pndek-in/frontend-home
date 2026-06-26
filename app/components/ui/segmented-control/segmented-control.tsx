import * as React from "react";
import "./segmented-control.css";

export interface SegmentedOption {
  value: string;
  label?: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface SegmentedControlProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  options: (SegmentedOption | string)[];
  value?: string;
  defaultValue?: string;
  size?: "sm" | "md";
  fullWidth?: boolean;
  onChange?: (value: string) => void;
  "aria-label"?: string;
}

export function SegmentedControl({
  options,
  value,
  defaultValue,
  size = "md",
  fullWidth = false,
  onChange,
  className = "",
  "aria-label": ariaLabel,
  ...rest
}: SegmentedControlProps) {
  const norm = options.map((o) =>
    typeof o === "string" ? { value: o, label: o } : o
  );
  const isControlled = value != null;
  const [internal, setInternal] = React.useState(
    defaultValue ?? norm[0]?.value
  );
  const current = isControlled ? value : internal;
  const idx = Math.max(0, norm.findIndex((o) => o.value === current));

  const ref = React.useRef<HTMLDivElement>(null);
  const [thumb, setThumb] = React.useState<{ left: number; width: number } | null>(null);

  React.useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    const btn = root.querySelectorAll<HTMLElement>(".jl-segmented__option")[idx];
    if (btn) {
      const pad = parseFloat(getComputedStyle(root).paddingLeft) || 0;
      setThumb({ left: btn.offsetLeft - pad, width: btn.offsetWidth });
    }
  }, [idx, fullWidth, size, options.length]);

  const select = (v: string, disabled?: boolean) => {
    if (disabled || v === current) return;
    if (!isControlled) setInternal(v);
    onChange?.(v);
  };

  const cls = [
    "jl-segmented",
    size === "sm" ? "jl-segmented--sm" : "",
    fullWidth ? "jl-segmented--full" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={cls} role="radiogroup" aria-label={ariaLabel} ref={ref} {...rest}>
      {thumb && (
        <span
          className="jl-segmented__thumb"
          style={{ transform: `translateX(${thumb.left}px)`, width: thumb.width }}
          aria-hidden="true"
        />
      )}
      {norm.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={o.value === current}
          disabled={o.disabled}
          className="jl-segmented__option"
          onClick={() => select(o.value, o.disabled)}
        >
          {o.icon}
          {o.label ?? o.value}
        </button>
      ))}
    </div>
  );
}
