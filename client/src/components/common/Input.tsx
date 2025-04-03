// Route: /src/components/common/Input.tsx
import React, { forwardRef } from 'react';
import { InputProps } from '../../models/types';

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({
    id,
    label,
    type = 'text',
    placeholder,
    value,
    onChange,
    error,
    helperText,
    required = false,
    disabled = false,
    className = '',
    ...props
  }, ref) => {
    const inputClasses = `px-3 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent
      ${error ? 'border-error focus:ring-error' : 'border-gray'}
      ${disabled ? 'bg-silver opacity-75 cursor-not-allowed' : 'bg-white'}
      ${className}`;
    
    return (
      <div className="mb-4">
        {label && (
          <label htmlFor={id} className="block mb-2 text-sm font-medium text-midnight">
            {label}
            {required && <span className="ml-1 text-error">*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={inputClasses}
          {...props}
        />
        {(error || helperText) && (
          <p className={`mt-1 text-sm ${error ? 'text-error' : 'text-charcoal'}`}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;