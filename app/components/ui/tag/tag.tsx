import * as React from "react";
import "./tag.css";

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  selected?: boolean;
  /** If provided, renders an × button; called when clicked. */
  onRemove?: (e: React.MouseEvent) => void;
  icon?: React.ReactNode;
}

const Tag = React.forwardRef<HTMLSpanElement, TagProps>(
  ({ selected = false, onRemove, icon, onClick, className = "", children, ...props }, ref) => {
    const interactive = !!onClick;
    const cls = [
      "jl-tag",
      interactive ? "jl-tag--button" : "",
      selected ? "jl-tag--selected" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <span ref={ref} className={cls} onClick={onClick} {...props}>
        {icon}
        {children}
        {onRemove && (
          <button
            type="button"
            className="jl-tag__remove"
            aria-label="Remove"
            onClick={(e) => {
              e.stopPropagation();
              onRemove(e);
            }}
          >
            <svg viewBox="0 0 12 12" width="12" height="12" fill="none" aria-hidden="true">
              <path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </span>
    );
  }
);

Tag.displayName = "Tag";

export { Tag };
