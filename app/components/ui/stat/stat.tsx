import * as React from "react";
import "./stat.css";

export type StatDeltaTone = "positive" | "negative" | "neutral";
export type StatSize = "sm" | "md";

export interface StatProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: React.ReactNode;
  value: React.ReactNode;
  /** Change indicator, e.g. "+12%" or "-0.4%". Sign drives the default arrow + tone. */
  delta?: React.ReactNode;
  deltaTone?: StatDeltaTone;
  caption?: React.ReactNode;
  icon?: React.ReactNode;
  /** Drop the card surface (no border/padding) for embedding. @default false */
  plain?: boolean;
  size?: StatSize;
}

export interface StatGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Fixed column count. Omit for a responsive auto-fit grid. */
  columns?: number;
}

const ARROW_UP = (
  <path d="M12 19V5M6 11l6-6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
);
const ARROW_DOWN = (
  <path d="M12 5v14M6 13l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
);

interface StatComponent extends React.FC<StatProps> {
  Group: React.FC<StatGroupProps>;
}

const Stat = (({
  label,
  value,
  delta,
  deltaTone,
  caption,
  icon,
  plain = false,
  size = "md",
  className = "",
  ...props
}: StatProps) => {
  let tone = deltaTone;
  let dir: "up" | "down" | null = null;
  if (delta != null) {
    const s = String(delta).trim();
    if (!tone) tone = s.startsWith("-") ? "negative" : s.startsWith("+") ? "positive" : "neutral";
    dir = s.startsWith("-") ? "down" : s.startsWith("+") ? "up" : null;
  }

  const cls = ["jl-stat", `jl-stat--${size}`, plain ? "jl-stat--plain" : "", className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={cls} {...props}>
      <div className="jl-stat__top">
        {label && <span className="jl-stat__label">{label}</span>}
        {icon && <span className="jl-stat__icon">{icon}</span>}
      </div>
      <div className="jl-stat__value">{value}</div>
      {(delta != null || caption) && (
        <div className="jl-stat__foot">
          {delta != null && (
            <span className={`jl-stat__delta jl-stat__delta--${tone}`}>
              {dir && (
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  {dir === "up" ? ARROW_UP : ARROW_DOWN}
                </svg>
              )}
              {delta}
            </span>
          )}
          {caption && <span className="jl-stat__caption">{caption}</span>}
        </div>
      )}
    </div>
  );
}) as StatComponent;

Stat.displayName = "Stat";

const StatGroup: React.FC<StatGroupProps> = ({ columns, className = "", style, children, ...props }) => {
  const gridStyle: React.CSSProperties = columns
    ? { gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`, ...style }
    : (style ?? {});
  return (
    <div
      className={["jl-stat-group", className].filter(Boolean).join(" ")}
      style={gridStyle}
      {...props}
    >
      {children}
    </div>
  );
};
StatGroup.displayName = "Stat.Group";

Stat.Group = StatGroup;

export { Stat };
