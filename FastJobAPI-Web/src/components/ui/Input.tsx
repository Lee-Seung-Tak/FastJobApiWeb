// src/components/ui/Input.tsx
import { forwardRef, type InputHTMLAttributes } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> { }

const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => (
  <input
    ref={ref}
    {...props}
    className={`${props.className ?? ''} w-full h-10 bg-[#1e1e1e] rounded-md text-sm text-white placeholder:text-[#7a7a82] outline-none`}
  />
));

Input.displayName = 'Input';
export default Input;
