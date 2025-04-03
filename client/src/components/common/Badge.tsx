// Route: /src/components/common/Badge.tsx
import React, { forwardRef } from 'react';
import { BadgeProps } from '../../models/types';

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({
    children,
    variant = 'primary',
    className = '',
    ...props
  }, ref) => {
    const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
    
    const variantClasses = {
      primary: 'bg-primary text-white',
      accent: 'bg-accent text-white',
      secondary: 'bg-secondary text-white',
      success: 'bg-success text-white',
      warning: 'bg-warning text-midnight',
      error: 'bg-error text-white',
      premium: 'bg-premium-gradient text-white',
    };
    
    const classes = `${baseClasses} ${variantClasses[variant]} ${className}`;
    
    return (
      <span ref={ref} className={classes} {...props}>
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export default Badge;