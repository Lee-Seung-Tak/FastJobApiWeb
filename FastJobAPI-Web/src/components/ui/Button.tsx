import { forwardRef, type ButtonHTMLAttributes } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

// variant 별 클래스
const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-[#2077ff] hover:bg-[#1862cc] text-white',
  secondary: 'bg-[#00b14f] hover:bg-[#009043] text-white',
  outline: 'border border-[#3a3a3f] hover:bg-[#1e1e22] text-white',
};

// size 별 클래스
const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      className = '',
      children,
      ...rest
    },
    ref
  ) => {
    const base = 'rounded-md font-medium focus:outline-none transition-colors';
    return (
      <button
        ref={ref}
        className={`${base} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
        {...rest}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
