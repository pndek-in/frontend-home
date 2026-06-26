import * as React from "react";
import "./card.css";

export type CardElevation = "flat" | "raised" | "floating";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  elevation?: CardElevation;
  interactive?: boolean;
}

export interface CardHeaderProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export interface CardSectionProps extends React.HTMLAttributes<HTMLDivElement> {}

function CardRoot({
  elevation = "flat",
  interactive = false,
  className = "",
  children,
  ...rest
}: CardProps) {
  const cls = [
    "jl-card",
    `jl-card--${elevation}`,
    interactive ? "jl-card--interactive" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <div className={cls} {...rest}>
      {children}
    </div>
  );
}

function CardHeader({
  title,
  subtitle,
  icon,
  action,
  className = "",
  children,
  ...rest
}: CardHeaderProps) {
  return (
    <div className={["jl-card__header", className].filter(Boolean).join(" ")} {...rest}>
      {icon}
      {(title || subtitle) && (
        <div className="jl-card__header-text">
          {title && <div className="jl-card__title">{title}</div>}
          {subtitle && <div className="jl-card__subtitle">{subtitle}</div>}
        </div>
      )}
      {children}
      {action && <div className="jl-card__header-action">{action}</div>}
    </div>
  );
}

function CardBody({ className = "", children, ...rest }: CardSectionProps) {
  return (
    <div className={["jl-card__body", className].filter(Boolean).join(" ")} {...rest}>
      {children}
    </div>
  );
}

function CardFooter({ className = "", children, ...rest }: CardSectionProps) {
  return (
    <div className={["jl-card__footer", className].filter(Boolean).join(" ")} {...rest}>
      {children}
    </div>
  );
}

export const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Body: CardBody,
  Footer: CardFooter,
});
