import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../utils/cn';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: ReactNode;
  description?: ReactNode;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, id, className, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    return (
      <label htmlFor={inputId} className={cn('flex min-h-11 cursor-pointer items-start gap-3 py-2.5', className)}>
        <input
          id={inputId}
          ref={ref}
          type="checkbox"
          className="mt-0.5 h-[18px] w-[18px] shrink-0 cursor-pointer rounded accent-primary"
          {...props}
        />
        <span>
          <span className="block text-base font-medium text-text">{label}</span>
          {description && <span className="mt-0.5 block text-sm text-text-muted">{description}</span>}
        </span>
      </label>
    );
  },
);
Checkbox.displayName = 'Checkbox';
