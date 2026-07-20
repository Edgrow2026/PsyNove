import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
}

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-warm-turmeric text-ink-navy hover:bg-warm-turmeric/90 shadow-xs',
  secondary: 'bg-white text-ink-navy border border-hairline hover:border-warm-turmeric',
  danger: 'bg-red-600 text-white hover:bg-red-700',
  success: 'bg-emerald-600 text-white hover:bg-emerald-500',
  ghost: 'bg-transparent text-ink-navy hover:bg-paper',
};

const sizes: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-[10px] rounded-lg',
  md: 'px-4 py-2.5 text-xs rounded-xl',
  lg: 'px-6 py-3 text-sm rounded-full',
  icon: 'h-10 w-10 rounded-full',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  icon,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 font-bold transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
