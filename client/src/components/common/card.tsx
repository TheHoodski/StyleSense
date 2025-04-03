// Route: /src/components/common/Card.tsx
import React, { forwardRef } from 'react';
import { CardProps } from '../../models/types';

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({
    children,
    variant = 'default',
    className = '',
    isPremium = false,
    onClick,
    ...props
  }, ref) => {
    const baseClasses = 'rounded-lg shadow-sm p-4';
    
    const variantClasses = {
      default: 'bg-silver',
      alt: 'bg-silver-dark',
      white: 'bg-white border border-silver',
    };
    
    let cardClasses = `${baseClasses} ${variantClasses[variant]} ${className}`;
    
    if (isPremium) {
      cardClasses = `premium-card ${className}`;
    }
    
    const clickableClass = onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : '';
    
    return (
      <div 
        ref={ref}
        className={`${cardClasses} ${clickableClass}`}
        onClick={onClick}
        {...props}
      >
        {isPremium && (
          <span className="premium-badge absolute top-2 right-2">Premium</span>
        )}
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export default Card;