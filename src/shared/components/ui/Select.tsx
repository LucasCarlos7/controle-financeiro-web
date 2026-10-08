import { forwardRef, type SelectHTMLAttributes } from 'react';
import { Field } from './Field';
import { inputClasses } from './Input';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, id, className = '', children, ...props }, ref) => {
    return (
      <Field label={label} htmlFor={id} error={error}>
        <select
          id={id}
          ref={ref}
          className={`${inputClasses(Boolean(error), className)} appearance-none bg-[url('data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2364748b%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%2F%3E%3C%2Fsvg%3E')] bg-[right_0.65rem_center] bg-no-repeat pr-9 bg-[length:1.1rem]`}
          {...props}
        >
          {children}
        </select>
      </Field>
    );
  },
);
Select.displayName = 'Select';
