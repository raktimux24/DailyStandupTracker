import React from 'react';
import { clsx } from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  children, 
  className,
  ...props 
}) => {
  return (
    <button
      className={clsx(
        'px-4 py-2 rounded-lg font-medium transition-colors',
        'focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900',
        {
          'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500': variant === 'primary',
          'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 focus:ring-gray-500': variant === 'secondary',
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};