import * as React from "react";
import "./tabs.css";

export type TabItem =
  | string
  | { value: string; label: React.ReactNode; icon?: React.ReactNode; count?: number };

export interface TabsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  items: TabItem[];
  value: string;
  onChange?: (value: string) => void;
  variant?: "line" | "pill";
}

export function Tabs({
  items = [],
  value,
  onChange,
  variant = "line",
  className = "",
  ...rest
}: TabsProps) {
  return (
    <div
      className={["jl-tabs", `jl-tabs--${variant}`, className].filter(Boolean).join(" ")}
      role="tablist"
      {...rest}
    >
      {items.map((it) => {
        const tab = typeof it === "string" ? { value: it, label: it } : it;
        const selected = value === tab.value;
        return (
          <button
            key={tab.value}
            type="button"
            role="tab"
            className="jl-tab"
            aria-selected={selected}
            onClick={() => onChange?.(tab.value)}
          >
            {"icon" in tab && tab.icon}
            {tab.label}
            {"count" in tab && tab.count != null && (
              <span className="jl-tab__count">{tab.count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
