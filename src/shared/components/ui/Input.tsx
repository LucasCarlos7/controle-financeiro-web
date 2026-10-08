import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../utils/cn';
import { Icon, type IconName } from '../icons';
import { Field } from './Field';
import { controlClasses, describedBy } from './controlStyles';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: ReactNode;
  error?: string;
  hint?: ReactNode;
  /** Ícone à esquerda (ex.: busca). */
  icon?: IconName;
  /** Texto fixo à esquerda (ex.: "R$"). */
  prefix?: string;
  containerClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, icon, prefix, id, className, containerClassName, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const { errorId, hintId, describedById } = describedBy(inputId, error, Boolean(hint));
    const hasAdornment = Boolean(icon || prefix);

    return (
      <Field
        label={label}
        htmlFor={inputId}
        error={error}
        hint={hint}
        errorId={errorId}
        hintId={hintId}
        className={containerClassName}
      >
        <div className={hasAdornment ? 'relative' : undefined}>
          {icon && (
            <Icon
              name={icon}
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-subtle"
            />
          )}
          {prefix && (
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-base text-text-muted">
              {prefix}
            </span>
          )}
          <input
            id={inputId}
            ref={ref}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedById}
            className={controlClasses(Boolean(error), cn(icon && 'pl-9', prefix && 'pl-10', className))}
            {...props}
          />
        </div>
      </Field>
    );
  },
);
Input.displayName = 'Input';
