import React from 'react';

const Card = ({ children, className = '', onClick, hover = true, padding = 'p-8' }) => {
  return (
    <div 
      onClick={onClick}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={`
        bg-card border border-border rounded-[2rem] shadow-premium transition-all duration-300
        ${hover ? 'hover:shadow-hover hover:border-primary/30' : ''}
        ${onClick ? 'cursor-pointer active:scale-[0.99] focus-visible:ring-4 focus-visible:ring-primary/20' : ''}
        ${padding}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Card;
