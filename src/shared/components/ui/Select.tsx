import { forwardRef, useId, type ReactNode, type SelectHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';
import { Icon } from '../icons';
import { Field } from './Field';
import { controlClasses, describedBy } from './controlStyles';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: ReactNode;
  error?: string;
  hint?: ReactNode;
  containerClassName?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, id, className, containerClassName, children, ...props }, ref) => {
    const generatedId = useId();
    const selectId = id ?? generatedId;
    const { errorId, hintId, describedById } = describedBy(selectId, error, Boolean(hint));

    return (
      <Field
        label={label}
        htmlFor={selectId}
        error={error}
        hint={hint}
        errorId={errorId}
        hintId={hintId}
        className={containerClassName}
      >
        <div className="relative">
          <select
            id={selectId}
            ref={ref}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedById}
            className={controlClasses(Boolean(error), cn('appearance-none truncate pr-9', className))}
            {...props}
          >
            {children}
          </select>
          <Icon
            name="chevron-down"
            className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted"
          />
        </div>
      </Field>
    );
  },
);
Select.displayName = 'Select';
