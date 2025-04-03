// Route: /src/components/common/Button.tsx
import React, { forwardRef } from 'react';
import { ButtonProps } from '../../models/types';

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    children,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    onClick,
    disabled = false,
    type = 'button',
    className = '',
    as: Component,
    ...props
  }, ref) => {
    const baseClasses = 'font-medium rounded transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
    
    const variantClasses = {
      primary: 'bg-accent text-white hover:bg-accent-light focus:ring-accent',
      secondary: 'bg-transparent border border-accent text-accent hover:bg-accent hover:text-white focus:ring-accent',
      tertiary: 'bg-secondary text-white hover:bg-secondary-light focus:ring-secondary',
      success: 'bg-success text-white hover:bg-success/90 focus:ring-success',
      error: 'bg-error text-white hover:bg-error/90 focus:ring-error',
      ghost: 'bg-transparent text-primary hover:bg-silver focus:ring-primary',
    };
    
    const sizeClasses = {
      sm: 'px-2 py-1 text-sm',
      md: 'px-4 py-2',
      lg: 'px-6 py-3 text-lg',
    };
    
    const widthClass = fullWidth ? 'w-full' : '';
    const disabledClass = disabled ? 'opacity-50 cursor-not-allowed' : '';
    
    const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${disabledClass} ${className}`;

    if (Component) {
      return (
        <Component
          className={classes}
          disabled={disabled}
          {...props}
        >
          {children}
        </Component>
      );
    }
    
    return (
      <button
        ref={ref}
        type={type}
        className={classes}
        onClick={onClick}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;