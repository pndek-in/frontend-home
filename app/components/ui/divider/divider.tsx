import * as React from "react";
import "./divider.css";

export type DividerOrientation = "horizontal" | "vertical";

export interface DividerProps extends React.HTMLAttributes<HTMLElement> {
  orientation?: DividerOrientation;
  label?: React.ReactNode;
}

const Divider = React.forwardRef<HTMLElement, DividerProps>(
  ({ orientation = "horizontal", label, className = "", ...props }, ref) => {
    if (label) {
      return (
        <div
          ref={ref as React.Ref<HTMLDivElement>}
          className={["jl-divider", "jl-divider--labeled", className]
            .filter(Boolean)
            .join(" ")}
          role="separator"
          {...props}
        >
          {label}
        </div>
      );
    }

    const isVertical = orientation === "vertical";
    return (
      <hr
        ref={ref as React.Ref<HTMLHRElement>}
        className={[
          "jl-divider",
          isVertical ? "jl-divider--v" : "jl-divider--h",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        role="separator"
        aria-orientation={isVertical ? "vertical" : undefined}
        {...props}
      />
    );
  }
);

Divider.displayName = "Divider";

export { Divider };
