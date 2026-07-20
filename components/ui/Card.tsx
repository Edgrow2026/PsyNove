import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padded?: boolean;
}

export default function Card({ padded = true, className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white border border-hairline rounded-2xl shadow-sm',
        padded && 'p-4',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
