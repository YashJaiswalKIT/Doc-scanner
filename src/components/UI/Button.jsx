import React from "react";
import classNames from "classnames";

const Button = ({ children, onClick, className = "", variant = "default", ...props }) => {
  const baseClasses = "inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200";

  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-blue-600 text-blue-600 hover:bg-blue-50",
    ghost: "text-blue-600 hover:bg-blue-100",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };

  const combined = classNames(baseClasses, variants[variant], className);

  return (
    <button onClick={onClick} className={combined} {...props}>
      {children}
    </button>
  );
};

export { Button };
