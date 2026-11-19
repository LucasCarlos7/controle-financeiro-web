import { forwardRef, useState, useId, type InputHTMLAttributes } from 'react';
import { Icon } from '../icons';
import { Field } from './Field';
import { controlClasses, describedBy } from './controlStyles';

interface PasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
  hint?: string;
  containerClassName?: string;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ label, error, hint, id, containerClassName, className, ...props }, ref) => {
    const [visible, setVisible] = useState(false);
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const { errorId, hintId, describedById } = describedBy(inputId, error, Boolean(hint));

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
        <div className="relative">
          <input
            id={inputId}
            ref={ref}
            type={visible ? 'text' : 'password'}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedById}
            className={controlClasses(Boolean(error), 'pr-10')}
            {...props}
          />
          <button
            type="button"
            aria-label={visible ? 'Ocultar senha' : 'Mostrar senha'}
            onClick={() => setVisible((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-subtle transition-colors hover:text-text focus-visible:outline-none"
            tabIndex={-1}
          >
            <Icon name={visible ? 'eye-off' : 'eye'} className="h-4.5 w-4.5" />
          </button>
        </div>
      </Field>
    );
  },
);
PasswordInput.displayName = 'PasswordInput';
