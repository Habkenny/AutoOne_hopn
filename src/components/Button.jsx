import { Link } from "react-router-dom";

const variants = {
  primary: "bg-brand-600 text-white hover:bg-brand-700",
  secondary: "bg-white text-slate-900 ring-1 ring-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-100 dark:ring-slate-700 dark:hover:bg-slate-800",
  ghost: "bg-transparent text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800",
  danger: "bg-rose-600 text-white hover:bg-rose-700",
};

export default function Button({
  as = "button",
  to,
  className = "",
  variant = "primary",
  children,
  ...props
}) {
  const classes = `focus-ring inline-flex min-h-11 items-center justify-center rounded-2xl px-5 py-2.5 text-sm font-semibold transition ${variants[variant]} ${className}`;

  if (as === "link") {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
