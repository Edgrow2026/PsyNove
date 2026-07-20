import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ModalProps {
  id?: string;
  title?: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  className?: string;
  panelClassName?: string;
  onClose?: () => void;
}

export default function Modal({
  id,
  title,
  description,
  children,
  className,
  panelClassName,
  onClose,
}: ModalProps) {
  return (
    <div
      id={id}
      className={cn(
        'fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in',
        className
      )}
    >
      <div className={cn('bg-white rounded-2xl w-full shadow-2xl border border-hairline overflow-hidden', panelClassName)}>
        {(title || onClose) && (
          <div className="bg-paper text-ink-navy p-5 flex items-center justify-between border-b border-hairline">
            <div className="space-y-0.5">
              {title && <h3 className="font-bold text-sm tracking-tight font-display">{title}</h3>}
              {description && <p className="text-slate-500 text-[11px] font-sans">{description}</p>}
            </div>
            {onClose && (
              <button onClick={onClose} className="text-slate-600 hover:text-ink-navy cursor-pointer text-xs font-bold transition-colors">
                Close
              </button>
            )}
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
