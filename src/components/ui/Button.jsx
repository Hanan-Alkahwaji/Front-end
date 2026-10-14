const Button = ({
  children,
  size = "md",
  variant = "primary",
  icon,
  disabled = false,
  onClick,
  type = "button",
}) => {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition disabled:cursor-not-allowed disabled:opacity-50";

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-3 text-base",
  };

  const variants = {
    primary: "bg-navy text-white hover:bg-navy/85",
    soft: "bg-french/15 text-navy hover:bg-french/30",
    softDanger: "bg-red-50 text-red-600 hover:bg-red-100",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${sizes[size] || sizes.md} ${
        variants[variant] || variants.primary
      }`}
    >
      {icon && <span>{icon}</span>}
      {children}
    </button>
  );
};

export default Button;