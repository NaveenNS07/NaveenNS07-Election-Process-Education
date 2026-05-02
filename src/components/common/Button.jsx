import React from 'react';

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  type = 'button', 
  disabled = false,
  className = '',
  icon,
  ariaLabel
}) => {
  const baseStyles = "flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100";
  
  const variants = {
    primary: "bg-primary text-white shadow-lg shadow-primary/20 hover:bg-primary-dark",
    secondary: "bg-card border border-border text-text-primary hover:bg-background shadow-sm",
    danger: "bg-red-500 text-white shadow-lg shadow-red-500/20 hover:bg-red-600",
    ghost: "text-text-secondary hover:text-primary hover:bg-primary/5",
    accent: "bg-accent text-white shadow-lg shadow-accent/20 hover:bg-emerald-600"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      aria-label={ariaLabel}
    >
      {icon && <span className="material-symbols-outlined text-[20px]" aria-hidden="true">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;
