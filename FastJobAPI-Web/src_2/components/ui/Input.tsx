// src/components/ui/Input.tsx
import React, { InputHTMLAttributes } from 'react';

type InputProps = InputHTMLAttributes<HTMLInputElement>;

const Input: React.FC<InputProps> = ({ className = '', ...rest }) => {
  return (
    <input
      className={
        `w-full h-10 bg-[#1e1e1e] rounded-md text-sm text-white placeholder:text-[#7a7a82] outline-none ${className}`
      }
      {...rest}
    />
  );
};

export default Input;
