// src/components/ui/Button.tsx
import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary';
};

const variantStyles: Record<'primary' | 'secondary', string> = {
  primary: 'bg-[#2077ff] hover:bg-[#1a6fcc] text-white',
  secondary: 'bg-[#00b14f] hover:bg-[#009f45] text-white',
};

const Button: React.FC<ButtonProps> = ({ variant = 'primary', className = '', children, ...rest }) => {
  return (
    <button
      className={
        `w-full h-10 rounded-md text-sm font-medium ${variantStyles[variant]} ${className}`
      }
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;